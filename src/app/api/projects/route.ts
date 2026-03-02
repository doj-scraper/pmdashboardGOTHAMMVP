import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const projects = await db.project.findMany({
      include: {
        phases: {
          include: {
            modules: {
              include: {
                _count: {
                  select: { tasks: true }
                }
              }
            }
          },
          orderBy: { orderIndex: 'asc' }
        }
      }
    })

    // Calculate completion percentages
    const projectsWithStats = await Promise.all(projects.map(async (project) => {
      const tasks = await db.task.findMany({
        where: {
          module: {
            phase: {
              projectId: project.id
            }
          }
        }
      })

      const totalTasks = tasks.length
      const completedTasks = tasks.filter(t => t.status === 'completed').length
      const completionPercent = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

      return {
        ...project,
        totalTasks,
        completedTasks,
        completionPercent: Math.round(completionPercent * 10) / 10
      }
    }))

    return NextResponse.json(projectsWithStats)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const project = await db.project.create({
      data: {
        name: body.name,
        githubRepo: body.githubRepo,
        stage: body.stage || 'idea',
        lastEvent: 'Project created'
      }
    })
    return NextResponse.json(project)
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}
