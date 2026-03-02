'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Github, RefreshCw, Loader2, Menu, X } from 'lucide-react'
import { PipelineTrack } from '@/components/dashboard/pipeline-track'
import { TaskList } from '@/components/dashboard/task-list'
import { PhaseCard } from '@/components/dashboard/phase-card'
import { StatsCard } from '@/components/dashboard/stats-card'
import { cn } from '@/lib/utils'

// Types
interface Task {
  id: number
  taskId: string
  description: string
  priority: string
  estimatedHours: number
  status: string
  githubIssueId: number | null
  githubPrId: number | null
  assignedTo: string | null
  completedAt: string | null
  module?: {
    name: string
    phase?: {
      name: string
    }
  }
  issueSync?: {
    githubIssueUrl: string
  } | null
}

interface Module {
  id: number
  name: string
  description: string | null
  completionPercent: number
  weightPercent: number
  _count?: {
    tasks: number
  }
}

interface Phase {
  id: number
  name: string
  description: string | null
  targetMonths: string | null
  completionPercent: number
  weightPercent: number
  modules?: Module[]
  totalTasks?: number
  completedTasks?: number
}

interface Project {
  id: number
  name: string
  githubRepo: string
  stage: string
  lastEvent: string | null
  totalTasks?: number
  completedTasks?: number
  completionPercent?: number
}

interface DashboardStats {
  totalTasks: number
  completedTasks: number
  inProgressTasks: number
  notStartedTasks: number
  blockedTasks: number
  totalHours: number
  completedHours: number
  overallCompletion: number
  phaseCompletion: Array<{
    phase: string
    percent: number
  }>
  priorityBreakdown: {
    high: number
    medium: number
    low: number
  }
}

const PIPELINE_STAGES = ['idea', 'assets', 'mvp', 'qa', 'docker', 'review', 'prod']

export default function Dashboard() {
  const [project, setProject] = useState<Project | null>(null)
  const [phases, setPhases] = useState<Phase[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedPhase, setExpandedPhase] = useState<number | null>(null)
  const [creatingIssueId, setCreatingIssueId] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)

  // Fetch all data
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const [projectRes, phasesRes, tasksRes, statsRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/phases'),
        fetch('/api/tasks'),
        fetch('/api/stats')
      ])

      if (!projectRes.ok || !phasesRes.ok || !tasksRes.ok || !statsRes.ok) {
        throw new Error('Failed to fetch data')
      }

      const projectsData = await projectRes.json()
      const phasesData = await phasesRes.json()
      const tasksData = await tasksRes.json()
      const statsData = await statsRes.json()

      if (projectsData.length > 0) {
        setProject(projectsData[0])
      }
      setPhases(phasesData)
      setTasks(tasksData)
      setStats(statsData)
    } catch (err) {
      console.error('Failed to load dashboard:', err)
      setError('Failed to load dashboard data. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // SSE connection for real-time updates
  useEffect(() => {
    const eventSource = new EventSource('/api/sse')
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'update') {
        fetchData()
      }
    }

    eventSource.onerror = () => {
      eventSource.close()
    }

    return () => {
      eventSource.close()
    }
  }, [fetchData])

  // Handle task status change
  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, status: newStatus })
      })

      if (!response.ok) throw new Error('Failed to update task')

      // Refresh data
      fetchData()
    } catch (err) {
      console.error('Failed to update task status:', err)
    }
  }

  // Handle task assignment
  const handleAssign = async (taskId: string, user: string) => {
    try {
      await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, assignedTo: user || null })
      })
    } catch (err) {
      console.error('Failed to assign task:', err)
    }
  }

  // Handle GitHub issue creation
  const handleCreateIssue = async (taskId: string) => {
    try {
      setCreatingIssueId(taskId)
      
      const response = await fetch('/api/github/create-issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          taskId, 
          repoName: project?.githubRepo || 'gotham-platform' 
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create issue')
      }

      // Show success notification (in a real app, use toast)
      alert(`✅ GitHub Issue #${result.issue.number} created!\n${result.issue.url}`)

      // Refresh tasks
      fetchData()
    } catch (err: any) {
      console.error('Failed to create issue:', err)
      alert(`❌ Error: ${err.message}`)
    } finally {
      setCreatingIssueId(null)
    }
  }

  // Handle GitHub sync
  const handleSync = async () => {
    try {
      setIsSyncing(true)
      const response = await fetch('/api/github/sync', { method: 'POST' })
      const result = await response.json()
      
      if (result.success) {
        alert(`✅ Synced ${result.synced} issues, updated ${result.updated}`)
        fetchData()
      }
    } catch (err) {
      console.error('Sync failed:', err)
    } finally {
      setIsSyncing(false)
    }
  }

  // Get current stage index
  const currentStageIndex = project ? PIPELINE_STAGES.indexOf(project.stage as any) : 0

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 text-slate-400 hover:text-slate-200"
              >
                {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <div>
                <h1 className="text-xl font-bold text-slate-100">🔄 Gotham Dashboard</h1>
                <p className="text-xs text-slate-500">GitHub Actions + Auto-Issue Creation</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSync}
                disabled={isSyncing}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-slate-800 border border-slate-700 text-slate-300 rounded-lg hover:border-slate-600 transition-colors disabled:opacity-50"
              >
                {isSyncing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                Sync
              </button>
              <a
                href={`https://github.com/${project?.githubRepo || 'gotham-platform'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-slate-800 border border-slate-700 text-slate-300 rounded-lg hover:border-purple-500 hover:text-purple-400 transition-colors"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex">
        {/* Sidebar - Phase Navigation */}
        <aside className={cn(
          "fixed lg:sticky top-[57px] left-0 h-[calc(100vh-57px)] w-64 bg-slate-900/95 backdrop-blur-md border-r border-slate-800 overflow-y-auto z-40 transition-transform lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="p-4">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Project Phases
            </h2>
            <nav className="space-y-2">
              {phases.map((phase, index) => (
                <button
                  key={phase.id}
                  onClick={() => setExpandedPhase(expandedPhase === phase.id ? null : phase.id)}
                  className={cn(
                    "w-full text-left p-3 rounded-lg transition-colors",
                    expandedPhase === phase.id 
                      ? "bg-purple-600/20 border border-purple-500/30" 
                      : "hover:bg-slate-800",
                    index <= currentStageIndex ? "text-slate-200" : "text-slate-500"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium">{phase.name.split(':')[0]}</span>
                    <span className={cn(
                      "text-xs font-semibold flex-shrink-0",
                      phase.completionPercent === 100 ? "text-green-400" : "text-cyan-400"
                    )}>
                      {phase.completionPercent.toFixed(0)}%
                    </span>
                  </div>
                  <div className="mt-2 h-1 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-purple-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${phase.completionPercent}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 container mx-auto px-4 py-6">
          {/* Pipeline Track */}
          {project && (
            <PipelineTrack
              stage={project.stage}
              projectName={project.name}
              phases={phases}
              overallCompletion={stats?.overallCompletion || 0}
            />
          )}

          {/* Stats Cards */}
          {stats && <StatsCard stats={stats} />}

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Phases Section */}
            <section>
              <h2 className="text-lg font-semibold text-slate-200 mb-4">Project Phases</h2>
              <div className="space-y-4">
                {phases.map((phase, index) => (
                  <PhaseCard
                    key={phase.id}
                    phase={phase}
                    isExpanded={expandedPhase === phase.id}
                    onToggleExpand={setExpandedPhase}
                    currentStageIndex={currentStageIndex}
                    phaseIndex={index}
                  />
                ))}
              </div>
            </section>

            {/* Tasks Section */}
            <section>
              <h2 className="text-lg font-semibold text-slate-200 mb-4">All Tasks</h2>
              <TaskList
                tasks={tasks}
                onStatusChange={handleStatusChange}
                onAssign={handleAssign}
                onCreateIssue={handleCreateIssue}
                creatingIssueId={creatingIssueId}
              />
            </section>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="sticky bottom-0 bg-slate-900/80 backdrop-blur-md border-t border-slate-800 mt-auto">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-4">
              <span>🔄 GitHub Integration Dashboard</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">{stats?.totalTasks || 0} tasks</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">{stats?.completedTasks || 0} completed</span>
            </div>
            <div className="flex items-center gap-4">
              <a 
                href="https://github.com/gotham-platform" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-slate-300 transition-colors"
              >
                View on GitHub
              </a>
              <span>•</span>
              <span>Built with Next.js & Prisma</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
