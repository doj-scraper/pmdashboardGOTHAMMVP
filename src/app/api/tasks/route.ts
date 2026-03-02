import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const moduleId = searchParams.get('moduleId')
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const search = searchParams.get('search')

    const where: any = {}

    if (moduleId) {
      where.moduleId = parseInt(moduleId)
    }

    if (status && status !== 'all') {
      where.status = status
    }

    if (priority && priority !== 'all') {
      where.priority = priority
    }

    if (search) {
      where.description = {
        contains: search,
        mode: 'insensitive'
      }
    }

    const tasks = await db.task.findMany({
      where,
      include: {
        module: {
          include: {
            phase: true
          }
        },
        issueSync: true
      },
      orderBy: { taskId: 'asc' }
    })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { taskId, ...updates } = body

    if (!taskId) {
      return NextResponse.json({ error: 'taskId is required' }, { status: 400 })
    }

    // If marking as completed, set completedAt
    if (updates.status === 'completed' && !updates.completedAt) {
      updates.completedAt = new Date()
    }

    // If marking as not started from completed, clear completedAt
    if (updates.status === 'not_started') {
      updates.completedAt = null
    }

    const task = await db.task.update({
      where: { taskId },
      data: updates
    })

    // Recalculate module and phase completion
    const module_ = await db.module.findUnique({
      where: { id: task.moduleId }
    })

    if (module_) {
      const moduleTasks = await db.task.findMany({
        where: { moduleId: module_.id }
      })
      const completedCount = moduleTasks.filter(t => t.status === 'completed').length
      const completionPercent = moduleTasks.length > 0 
        ? (completedCount / moduleTasks.length) * 100 
        : 0

      await db.module.update({
        where: { id: module_.id },
        data: { completionPercent }
      })

      // Update phase completion
      const phaseModules = await db.module.findMany({
        where: { phaseId: module_.phaseId }
      })
      
      const phaseCompletion = phaseModules.reduce((acc, m) => acc + m.completionPercent, 0) / phaseModules.length
      
      await db.phase.update({
        where: { id: module_.phaseId },
        data: { completionPercent: phaseCompletion }
      })
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error('Error updating task:', error)
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const task = await db.task.create({
      data: {
        moduleId: body.moduleId,
        taskId: body.taskId,
        description: body.description,
        priority: body.priority || 'Medium',
        estimatedHours: body.estimatedHours || 4,
        status: 'not_started'
      }
    })
    return NextResponse.json(task)
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 })
  }
}
