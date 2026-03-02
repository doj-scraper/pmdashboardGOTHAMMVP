import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')

    const where = projectId ? { projectId: parseInt(projectId) } : {}

    const phases = await db.phase.findMany({
      where,
      include: {
        modules: {
          include: {
            _count: {
              select: { tasks: true }
            }
          },
          orderBy: { orderIndex: 'asc' }
        }
      },
      orderBy: { orderIndex: 'asc' }
    })

    // Calculate completion for each phase
    const phasesWithStats = await Promise.all(phases.map(async (phase) => {
      const tasks = await db.task.findMany({
        where: {
          module: {
            phaseId: phase.id
          }
        }
      })

      const totalTasks = tasks.length
      const completedTasks = tasks.filter(t => t.status === 'completed').length
      const completionPercent = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

      // Update phase completion
      await db.phase.update({
        where: { id: phase.id },
        data: { completionPercent }
      })

      return {
        ...phase,
        totalTasks,
        completedTasks,
        completionPercent: Math.round(completionPercent * 10) / 10
      }
    }))

    return NextResponse.json(phasesWithStats)
  } catch (error) {
    console.error('Error fetching phases:', error)
    return NextResponse.json({ error: 'Failed to fetch phases' }, { status: 500 })
  }
}
