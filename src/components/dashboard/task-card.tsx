'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { CheckSquare, Square, ExternalLink, Loader2, Github } from 'lucide-react'
import { cn } from '@/lib/utils'

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

interface TaskCardProps {
  task: Task
  onStatusChange: (taskId: string, status: string) => void
  onAssign: (taskId: string, user: string) => void
  onCreateIssue: (taskId: string) => void
  isCreatingIssue?: boolean
}

const PRIORITY_COLORS: Record<string, string> = {
  High: 'text-red-400 bg-red-400/10 border-red-400/20',
  Medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  Low: 'text-green-400 bg-green-400/10 border-green-400/20'
}

const STATUS_COLORS: Record<string, string> = {
  not_started: 'text-slate-400 bg-slate-400/10 border-slate-400/20',
  in_progress: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  completed: 'text-green-400 bg-green-400/10 border-green-400/20',
  blocked: 'text-red-400 bg-red-400/10 border-red-400/20'
}

export function TaskCard({ task, onStatusChange, onAssign, onCreateIssue, isCreatingIssue }: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const isCompleted = task.status === 'completed'

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onStatusChange(task.taskId, isCompleted ? 'not_started' : 'completed')
  }

  const handleCreateIssue = (e: React.MouseEvent) => {
    e.stopPropagation()
    onCreateIssue(task.taskId)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        "bg-slate-800/50 border border-slate-700 rounded-lg transition-all hover:border-slate-600 hover:translate-x-1",
        isCompleted && "opacity-60"
      )}
    >
      <div
        className="flex justify-between items-center p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            onClick={handleCheckboxClick}
            className="flex-shrink-0 focus:outline-none"
            disabled={isCreatingIssue}
          >
            {isCompleted ? (
              <CheckSquare className="w-5 h-5 text-purple-500" />
            ) : (
              <Square className="w-5 h-5 text-slate-500 hover:text-purple-400 transition-colors" />
            )}
          </button>
          <span className="text-cyan-400 font-semibold text-sm min-w-[60px] flex-shrink-0">
            {task.taskId}
          </span>
          <span className={cn(
            "text-slate-200 text-sm truncate",
            isCompleted && "line-through text-slate-500"
          )}>
            {task.description}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-4">
          <span className={cn(
            "px-2 py-0.5 rounded text-xs font-semibold border",
            PRIORITY_COLORS[task.priority]
          )}>
            {task.priority}
          </span>
          <span className={cn(
            "px-2 py-0.5 rounded text-xs font-semibold border",
            STATUS_COLORS[task.status]
          )}>
            {task.status.replace('_', ' ')}
          </span>
          
          {task.githubIssueId ? (
            <a
              href={task.issueSync?.githubIssueUrl || `https://github.com/gotham-platform/issues/${task.githubIssueId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-slate-700/50 border border-slate-600 text-slate-300 hover:border-cyan-500 hover:text-cyan-400 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Github className="w-3 h-3" />
              #{task.githubIssueId}
            </a>
          ) : (
            <button
              onClick={handleCreateIssue}
              disabled={isCreatingIssue}
              className="flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-purple-600 border border-purple-500 text-white hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {isCreatingIssue ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                '+ Issue'
              )}
            </button>
          )}
          
          <span className="text-slate-500 text-xs ml-2">
            {isExpanded ? '▲' : '▼'}
          </span>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-2 border-t border-slate-700/50 space-y-2">
              <div className="flex items-center gap-3 text-sm">
                <span className="text-slate-500 min-w-[120px]">Estimated Hours:</span>
                <span className="text-slate-300">{task.estimatedHours}h</span>
              </div>

              {task.module && (
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-slate-500 min-w-[120px]">Module:</span>
                  <span className="text-slate-300">{task.module.name}</span>
                </div>
              )}

              {task.module?.phase && (
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-slate-500 min-w-[120px]">Phase:</span>
                  <span className="text-slate-300">{task.module.phase.name}</span>
                </div>
              )}

              {task.githubIssueId && (
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-slate-500 min-w-[120px]">GitHub Issue:</span>
                  <a
                    href={task.issueSync?.githubIssueUrl || `https://github.com/gotham-platform/issues/${task.githubIssueId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    #{task.githubIssueId}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {task.githubPrId && (
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-slate-500 min-w-[120px]">GitHub PR:</span>
                  <a
                    href={`https://github.com/gotham-platform/pull/${task.githubPrId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    #{task.githubPrId}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {task.completedAt && (
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-slate-500 min-w-[120px]">Completed:</span>
                  <span className="text-slate-300">
                    {format(new Date(task.completedAt), 'MMM d, yyyy')}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3 text-sm">
                <span className="text-slate-500 min-w-[120px]">Assign To:</span>
                <select
                  value={task.assignedTo || ''}
                  onChange={(e) => {
                    e.stopPropagation()
                    onAssign(task.taskId, e.target.value)
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-slate-900 border border-slate-700 text-slate-200 px-2 py-1 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                >
                  <option value="">Unassigned</option>
                  <option value="dev1">Developer 1</option>
                  <option value="dev2">Developer 2</option>
                  <option value="dev3">Developer 3</option>
                </select>
              </div>

              {!task.githubIssueId && (
                <div className="pt-3 mt-3 border-t border-slate-700/50">
                  <button
                    onClick={handleCreateIssue}
                    disabled={isCreatingIssue}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white py-2.5 px-4 rounded-lg font-medium text-sm hover:from-purple-700 hover:to-purple-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20"
                  >
                    {isCreatingIssue ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Creating Issue...
                      </>
                    ) : (
                      <>
                        <Github className="w-4 h-4" />
                        Create GitHub Issue
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
