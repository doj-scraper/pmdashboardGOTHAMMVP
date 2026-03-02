'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Loader2 } from 'lucide-react'
import { TaskCard } from './task-card'

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

interface TaskListProps {
  tasks: Task[]
  onStatusChange: (taskId: string, status: string) => void
  onAssign: (taskId: string, user: string) => void
  onCreateIssue: (taskId: string) => void
  creatingIssueId?: string | null
}

export function TaskList({ tasks, onStatusChange, onAssign, onCreateIssue, creatingIssueId }: TaskListProps) {
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (filterStatus !== 'all' && task.status !== filterStatus) return false
      if (filterPriority !== 'all' && task.priority !== filterPriority) return false
      if (searchQuery && !task.description.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return true
    })
  }, [tasks, filterStatus, filterPriority, searchQuery])

  const taskStats = useMemo(() => ({
    total: filteredTasks.length,
    completed: filteredTasks.filter(t => t.status === 'completed').length,
    inProgress: filteredTasks.filter(t => t.status === 'in_progress').length,
    notStarted: filteredTasks.filter(t => t.status === 'not_started').length
  }), [filteredTasks])

  return (
    <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 overflow-hidden">
      {/* Filters */}
      <div className="p-4 border-b border-slate-700/50">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="w-full bg-slate-800 border border-slate-700 text-slate-200 pl-9 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 placeholder:text-slate-500"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            <option value="all">All Status</option>
            <option value="not_started">Not Started</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="blocked">Blocked</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            <option value="all">All Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-400">
          <span><strong className="text-slate-200">{taskStats.total}</strong> Total</span>
          <span><strong className="text-green-400">{taskStats.completed}</strong> Completed</span>
          <span><strong className="text-blue-400">{taskStats.inProgress}</strong> In Progress</span>
          <span><strong className="text-slate-500">{taskStats.notStarted}</strong> Not Started</span>
        </div>
      </div>

      {/* Task List */}
      <div className="max-h-[600px] overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        <AnimatePresence mode="popLayout">
          {filteredTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-slate-500"
            >
              <Filter className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No tasks match your filters</p>
            </motion.div>
          ) : (
            filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={onStatusChange}
                onAssign={onAssign}
                onCreateIssue={onCreateIssue}
                isCreatingIssue={creatingIssueId === task.taskId}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
