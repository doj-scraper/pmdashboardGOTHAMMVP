import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import crypto from 'crypto'

function verifyGitHubSignature(signature: string | null, payload: string, secret: string): boolean {
  if (!signature) return false
  
  const hmac = crypto.createHmac('sha256', secret)
  const digest = 'sha256=' + hmac.update(payload).digest('hex')
  
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(digest)
    )
  } catch {
    return false
  }
}

function extractTaskIdFromPayload(payload: any): string | null {
  const title = payload.pull_request?.title || ''
  const labels = payload.pull_request?.labels || []
  const body = payload.pull_request?.body || ''

  // Pattern 1: [Task 1.1.1] in title
  const titleMatch = title.match(/\[Task\s+(\d+\.\d+\.\d+)\]/i)
  if (titleMatch) return titleMatch[1]

  // Pattern 2: task-1-1-1 label
  const taskLabel = labels.find((l: any) => l.name?.startsWith('task-'))
  if (taskLabel) {
    return taskLabel.name.replace('task-', '').replace(/-/g, '.')
  }

  // Pattern 3: Task ID in body
  const bodyMatch = body.match(/Task ID:\s*(\d+\.\d+\.\d+)/i)
  if (bodyMatch) return bodyMatch[1]

  return null
}

function resolvePipelineStage(event: string, payload: any): string | null {
  if (event === 'push') {
    if (payload.ref === 'refs/heads/main') return 'prod'
    if (payload.ref?.includes('feature/')) return 'mvp'
    return 'assets'
  }

  if (event === 'pull_request') {
    if (payload.action === 'opened') return 'qa'
    if (payload.action === 'closed' && payload.pull_request?.merged) return 'prod'
    if (payload.review_decision === 'approved') return 'review'
    if (payload.action === 'synchronize') return 'qa'
  }

  if (event === 'status' && payload.state === 'success') {
    if (payload.context?.includes('docker')) return 'docker'
    if (payload.context?.includes('ci') || payload.context?.includes('test')) return 'qa'
  }

  if (event === 'issues' && payload.action === 'closed') {
    return 'mvp'
  }

  return null
}

export async function POST(request: Request) {
  try {
    const event = request.headers.get('x-github-event') ?? 'unknown'
    const signature = request.headers.get('x-hub-signature-256')
    const rawBody = await request.text()
    const payload = JSON.parse(rawBody)

    // Security: Validate signature
    const secret = process.env.GITHUB_WEBHOOK_SECRET || 'webhook_secret_demo'
    const isValid = verifyGitHubSignature(signature, rawBody, secret)
    
    if (!isValid && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const repoName = payload.repository?.name
    if (!repoName) {
      return NextResponse.json({ error: 'No repository' }, { status: 400 })
    }

    // Get project from database
    const project = await db.project.findFirst({
      where: { githubRepo: repoName }
    })
    
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Resolve pipeline stage
    const newStage = resolvePipelineStage(event, payload)
    
    // Extract task ID from PR/Issue
    const taskId = extractTaskIdFromPayload(payload)

    // Handle task completion (PR merged)
    if (taskId && event === 'pull_request' && payload.action === 'closed' && payload.pull_request?.merged) {
      await db.task.update({
        where: { taskId },
        data: {
          status: 'completed',
          githubPrId: payload.pull_request?.id,
          completedAt: new Date()
        }
      })

      // Log event
      await db.gitHubEvent.create({
        data: {
          projectId: project.id,
          eventType: event,
          action: payload.action,
          payload: JSON.stringify(payload),
          taskId,
          stageChangedTo: newStage || undefined
        }
      })

      return NextResponse.json({ 
        received: true, 
        task_completed: taskId,
        message: `Task ${taskId} marked as completed`
      })
    }

    // Handle stage change
    if (newStage && newStage !== project.stage) {
      const previousStage = project.stage
      
      await db.project.update({
        where: { id: project.id },
        data: {
          stage: newStage,
          lastEvent: `${event}: ${payload.action || 'trigger'}`
        }
      })

      await db.gitHubEvent.create({
        data: {
          projectId: project.id,
          eventType: event,
          action: payload.action,
          payload: JSON.stringify(payload),
          stageChangedFrom: previousStage,
          stageChangedTo: newStage
        }
      })

      return NextResponse.json({
        received: true,
        stage_changed: true,
        from: previousStage,
        to: newStage
      })
    }

    // Log other events
    await db.gitHubEvent.create({
      data: {
        projectId: project.id,
        eventType: event,
        action: payload.action,
        payload: JSON.stringify(payload),
        taskId
      }
    })

    return NextResponse.json({ received: true, no_action: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
