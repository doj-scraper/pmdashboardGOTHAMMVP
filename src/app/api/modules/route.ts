import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const phaseId = searchParams.get('phaseId')

    const where = phaseId ? { phaseId: parseInt(phaseId) } : {}

    const modules = await db.module.findMany({
      where,
      include: {
        _count: {
          select: { tasks: true }
        }
      },
      orderBy: { orderIndex: 'asc' }
    })

    // Calculate completion for each module
    const modulesWithStats = await Promise.all(modules.map(async (module_) => {
      const tasks = await db.task.findMany({
        where: { moduleId: module_.id }
      })

      const totalTasks = tasks.length
      const completedTasks = tasks.filter(t => t.status === 'completed').length
      const completionPercent = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

      // Update module completion
      await db.module.update({
        where: { id: module_.id },
        data: { completionPercent }
      })

      return {
        ...module_,
        totalTasks,
        completedTasks,
        completionPercent: Math.round(completionPercent * 10) / 10
      }
    }))

    return NextResponse.json(modulesWithStats)
  } catch (error) {
    console.error('Error fetching modules:', error)
    return NextResponse.json({ error: 'Failed to fetch modules' }, { status: 500 })
  }
}
