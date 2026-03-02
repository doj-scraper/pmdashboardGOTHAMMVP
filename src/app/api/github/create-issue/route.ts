import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const GITHUB_API_BASE = 'https://api.github.com'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { taskId, repoName } = body

    if (!taskId || !repoName) {
      return NextResponse.json({ error: 'taskId and repoName required' }, { status: 400 })
    }

    // Get task details
    const task = await db.task.findUnique({
      where: { taskId },
      include: {
        module: {
          include: {
            phase: true
          }
        }
      }
    })

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    // Check if issue already exists
    const existingSync = await db.gitHubIssueSync.findUnique({
      where: { taskId }
    })

    if (existingSync) {
      return NextResponse.json({
        error: 'Issue already exists for this task',
        issue_id: existingSync.githubIssueId,
        issue_url: existingSync.githubIssueUrl
      }, { status: 409 })
    }

    // Get GitHub credentials
    const credentials = await db.gitHubCredentials.findUnique({
      where: { repoName }
    })

    if (!credentials) {
      return NextResponse.json({ error: 'GitHub credentials not configured' }, { status: 500 })
    }

    // Create issue body with task details
    const issueBody = `
## Task Details

**Task ID:** ${task.taskId}
**Priority:** ${task.priority}
**Estimated Hours:** ${task.estimatedHours}h
**Status:** ${task.status}
**Phase:** ${task.module?.phase?.name || 'Unknown'}
**Module:** ${task.module?.name || 'Unknown'}

## Description

${task.description}

## Checklist

- [ ] Code implementation
- [ ] Unit tests
- [ ] Documentation
- [ ] Code review
- [ ] Deploy to staging

## Related

- Project: Gotham Platform
- Dashboard Task ID: ${task.taskId}

---
*This issue was auto-created from the Gotham Project Dashboard*
`

    // Call GitHub API to create issue
    const githubResponse = await fetch(`${GITHUB_API_BASE}/repos/${repoName}/issues`, {
      method: 'POST',
      headers: {
        'Authorization': `token ${credentials.accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: `[Task ${task.taskId}] ${task.description}`,
        body: issueBody,
        labels: [
          `task-${task.taskId.replace(/\./g, '-')}`,
          `priority-${task.priority.toLowerCase()}`,
          'gotham-platform',
          'auto-generated'
        ],
        assignees: task.assignedTo ? [task.assignedTo] : []
      })
    })

    if (!githubResponse.ok) {
      const errorData = await githubResponse.json()
      
      // For demo purposes, simulate successful issue creation if token is invalid
      if (credentials.accessToken.includes('demo')) {
        const mockIssueNumber = Math.floor(Math.random() * 1000) + 1
        const mockIssueUrl = `https://github.com/${repoName}/issues/${mockIssueNumber}`
        
        // Store issue sync record
        await db.gitHubIssueSync.create({
          data: {
            taskId,
            githubIssueId: mockIssueNumber,
            githubIssueNumber: mockIssueNumber,
            githubIssueUrl: mockIssueUrl,
            syncStatus: 'created',
            lastSyncedAt: new Date()
          }
        })

        // Update task with GitHub issue ID
        await db.task.update({
          where: { taskId },
          data: { githubIssueId: mockIssueNumber }
        })

        return NextResponse.json({
          success: true,
          taskId,
          issue: {
            id: mockIssueNumber,
            number: mockIssueNumber,
            url: mockIssueUrl,
            title: `[Task ${task.taskId}] ${task.description}`
          },
          note: 'Demo mode - issue simulated'
        })
      }
      
      throw new Error(`GitHub API error: ${errorData.message}`)
    }

    const issueData = await githubResponse.json()

    // Store issue sync record
    await db.gitHubIssueSync.create({
      data: {
        taskId,
        githubIssueId: issueData.id,
        githubIssueNumber: issueData.number,
        githubIssueUrl: issueData.html_url,
        syncStatus: 'created',
        lastSyncedAt: new Date()
      }
    })

    // Update task with GitHub issue ID
    await db.task.update({
      where: { taskId },
      data: { githubIssueId: issueData.id }
    })

    return NextResponse.json({
      success: true,
      taskId,
      issue: {
        id: issueData.id,
        number: issueData.number,
        url: issueData.html_url,
        title: issueData.title
      }
    })
  } catch (error: any) {
    console.error('Failed to create GitHub issue:', error)
    
    // Log to queue for retry
    try {
      const body = await request.clone().json()
      await db.issueCreationQueue.create({
        data: {
          taskId: body.taskId,
          status: 'failed',
          errorMessage: error.message
        }
      })
    } catch {}

    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
