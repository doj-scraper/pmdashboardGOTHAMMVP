import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const parsedProjectId = projectId ? parseInt(projectId, 10) : null

    // Get all tasks (optionally filtered by project)
    const tasks = await db.task.findMany({
      where: parsedProjectId
        ? {
            module: {
              phase: {
                projectId: parsedProjectId,
              },
            },
          }
        : undefined,
      include: {
        module: {
          include: {
            phase: true,
          },
        },
      },
    })

    const totalTasks = tasks.length
    const completedTasks = tasks.filter((t) => t.status === 'completed').length
    const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length
    const notStartedTasks = tasks.filter((t) => t.status === 'not_started').length
    const blockedTasks = tasks.filter((t) => t.status === 'blocked').length

    const totalHours = tasks.reduce((acc, t) => acc + t.estimatedHours, 0)
    const completedHours = tasks
      .filter((t) => t.status === 'completed')
      .reduce((acc, t) => acc + t.estimatedHours, 0)

    const overallCompletion = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

    // Get phase completion data
    const phases = await db.phase.findMany({
      where: parsedProjectId ? { projectId: parsedProjectId } : undefined,
      orderBy: { orderIndex: 'asc' },
    })

    const phaseCompletion = phases.map((p) => ({
      phase: p.name,
      percent: Math.round(p.completionPercent * 10) / 10,
    }))

    // Priority breakdown
    const highPriority = tasks.filter((t) => t.priority === 'High').length
    const mediumPriority = tasks.filter((t) => t.priority === 'Medium').length
    const lowPriority = tasks.filter((t) => t.priority === 'Low').length

    return NextResponse.json({
      totalTasks,
      completedTasks,
      inProgressTasks,
      notStartedTasks,
      blockedTasks,
      totalHours,
      completedHours,
      overallCompletion: Math.round(overallCompletion * 10) / 10,
      phaseCompletion,
      priorityBreakdown: {
        high: highPriority,
        medium: mediumPriority,
        low: lowPriority,
      },
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
