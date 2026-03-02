import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const GITHUB_API_BASE = 'https://api.github.com'

// Sync GitHub issues with local tasks
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const repoName = searchParams.get('repo') || 'gotham-platform'

    // Get GitHub credentials
    const credentials = await db.gitHubCredentials.findUnique({
      where: { repoName }
    })

    if (!credentials) {
      return NextResponse.json({ error: 'GitHub credentials not configured' }, { status: 500 })
    }

    // For demo mode, return mock sync data
    if (credentials.accessToken.includes('demo')) {
      const issues = await db.gitHubIssueSync.findMany({
        where: { syncStatus: 'created' }
      })

      return NextResponse.json({
        success: true,
        synced: issues.length,
        updated: 0,
        total_issues: issues.length,
        note: 'Demo mode - showing local sync data only'
      })
    }

    // Fetch all issues with 'auto-generated' label
    const issuesResponse = await fetch(
      `${GITHUB_API_BASE}/repos/${repoName}/issues?labels=auto-generated&state=all&per_page=100`,
      {
        headers: {
          'Authorization': `token ${credentials.accessToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    )

    if (!issuesResponse.ok) {
      throw new Error('Failed to fetch GitHub issues')
    }

    const issues = await issuesResponse.json()

    let synced = 0
    let updated = 0

    for (const issue of issues) {
      // Extract task ID from title [Task 1.1.1]
      const match = issue.title?.match(/\[Task\s+(\d+\.\d+\.\d+)\]/i)
      if (!match) continue

      const taskId = match[1]

      // Check if sync record exists
      const existing = await db.gitHubIssueSync.findFirst({
        where: { githubIssueId: issue.id }
      })

      if (!existing) {
        // New issue - create sync record
        await db.gitHubIssueSync.create({
          data: {
            taskId,
            githubIssueId: issue.id,
            githubIssueNumber: issue.number,
            githubIssueUrl: issue.html_url,
            syncStatus: 'synced',
            lastSyncedAt: new Date()
          }
        })
        synced++
      } else {
        // Update existing sync record
        await db.gitHubIssueSync.update({
          where: { id: existing.id },
          data: {
            syncStatus: 'synced',
            lastSyncedAt: new Date()
          }
        })
        updated++
      }

      // Update task status if issue closed
      const task = await db.task.findUnique({ where: { taskId } })
      if (task && issue.state === 'closed' && task.status !== 'completed') {
        await db.task.update({
          where: { taskId },
          data: {
            status: 'completed',
            githubIssueId: issue.id,
            completedAt: issue.closed_at ? new Date(issue.closed_at) : new Date()
          }
        })
      }
    }

    return NextResponse.json({
      success: true,
      synced,
      updated,
      total_issues: issues.length
    })
  } catch (error: any) {
    console.error('Failed to sync GitHub issues:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Manual sync trigger
export async function POST(request: Request) {
  return GET(request)
}
