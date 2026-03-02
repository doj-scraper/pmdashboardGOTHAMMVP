import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')

    // Get all tasks
    const tasks = await db.task.findMany({
      include: {
        module: {
          include: {
            phase: projectId ? {
              where: { projectId: parseInt(projectId) }
            } : true
          }
        }
      }
    })

    const filteredTasks = projectId 
      ? tasks.filter(t => t.module?.phase?.projectId === parseInt(projectId))
      : tasks

    const totalTasks = filteredTasks.length
    const completedTasks = filteredTasks.filter(t => t.status === 'completed').length
    const inProgressTasks = filteredTasks.filter(t => t.status === 'in_progress').length
    const notStartedTasks = filteredTasks.filter(t => t.status === 'not_started').length
    const blockedTasks = filteredTasks.filter(t => t.status === 'blocked').length

    const totalHours = filteredTasks.reduce((acc, t) => acc + t.estimatedHours, 0)
    const completedHours = filteredTasks
      .filter(t => t.status === 'completed')
      .reduce((acc, t) => acc + t.estimatedHours, 0)

    const overallCompletion = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

    // Get phase completion data
    const phases = await db.phase.findMany({
      where: projectId ? { projectId: parseInt(projectId) } : undefined,
      orderBy: { orderIndex: 'asc' }
    })

    const phaseCompletion = phases.map(p => ({
      phase: p.name,
      percent: Math.round(p.completionPercent * 10) / 10
    }))

    // Priority breakdown
    const highPriority = filteredTasks.filter(t => t.priority === 'High').length
    const mediumPriority = filteredTasks.filter(t => t.priority === 'Medium').length
    const lowPriority = filteredTasks.filter(t => t.priority === 'Low').length

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
        low: lowPriority
      }
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
