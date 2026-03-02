'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Clock, AlertCircle, ListTodo, TrendingUp, Zap } from 'lucide-react'

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

interface StatsCardProps {
  stats: DashboardStats
}

export function StatsCard({ stats }: StatsCardProps) {
  const statItems = [
    { label: 'Total Tasks', value: stats.totalTasks, icon: ListTodo, color: 'text-slate-300' },
    { label: 'Completed', value: stats.completedTasks, icon: CheckCircle2, color: 'text-green-400' },
    { label: 'In Progress', value: stats.inProgressTasks, icon: Clock, color: 'text-blue-400' },
    { label: 'Not Started', value: stats.notStartedTasks, icon: AlertCircle, color: 'text-slate-500' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {statItems.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-slate-700/50 ${item.color}`}>
              <item.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-100">{item.value}</p>
              <p className="text-xs text-slate-400">{item.label}</p>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Overall Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="col-span-2 md:col-span-4 bg-gradient-to-br from-purple-900/30 to-slate-800/50 border border-purple-500/30 rounded-xl p-4"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Overall Progress</p>
              <p className="text-2xl font-bold text-purple-300">{stats.overallCompletion.toFixed(1)}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span>{stats.completedHours.toFixed(0)}h / {stats.totalHours.toFixed(0)}h completed</span>
          </div>
        </div>
        <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400"
            initial={{ width: 0 }}
            animate={{ width: `${stats.overallCompletion}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
      </motion.div>
    </div>
  )
}
