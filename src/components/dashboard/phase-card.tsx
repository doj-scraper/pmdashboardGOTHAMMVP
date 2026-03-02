'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

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

interface PhaseCardProps {
  phase: Phase
  isExpanded: boolean
  onToggleExpand: (phaseId: number) => void
  currentStageIndex: number
  phaseIndex: number
}

export function PhaseCard({ phase, isExpanded, onToggleExpand, currentStageIndex, phaseIndex }: PhaseCardProps) {
  const isActive = phaseIndex <= currentStageIndex

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-xl border overflow-hidden transition-colors",
        isActive ? "border-slate-600" : "border-slate-700/50 opacity-60"
      )}
    >
      <div
        className="flex justify-between items-center p-4 cursor-pointer hover:bg-slate-700/20 transition-colors"
        onClick={() => onToggleExpand(phase.id)}
      >
        <div className="flex-1 min-w-0">
          <h3 className="text-slate-100 font-semibold truncate">{phase.name}</h3>
          {phase.description && (
            <p className="text-slate-400 text-sm mt-1 truncate">{phase.description}</p>
          )}
          {phase.targetMonths && (
            <span className="text-cyan-400 text-xs mt-1 inline-block">📅 {phase.targetMonths}</span>
          )}
        </div>

        <div className="flex items-center gap-4 ml-4 flex-shrink-0">
          {/* Completion Circle */}
          <div className="relative w-12 h-12">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <path
                className="text-slate-700"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              />
              <motion.path
                className="text-purple-500"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray={`${phase.completionPercent}, 100`}
                initial={{ strokeDasharray: '0, 100' }}
                animate={{ strokeDasharray: `${phase.completionPercent}, 100` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-slate-200 text-xs font-semibold">
              {phase.completionPercent.toFixed(0)}%
            </span>
          </div>

          {/* Expand Icon */}
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-slate-500" />
          ) : (
            <ChevronRight className="w-5 h-5 text-slate-500" />
          )}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && phase.modules && phase.modules.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3">
              {phase.modules.map((module) => (
                <div
                  key={module.id}
                  className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-3"
                >
                  <div className="flex justify-between items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-slate-200 font-medium text-sm truncate">
                        {module.name}
                      </h4>
                      {module.description && (
                        <p className="text-slate-500 text-xs mt-0.5 truncate">
                          {module.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="w-24 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-cyan-400 to-purple-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${module.completionPercent}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      <span className="text-cyan-400 text-xs font-semibold min-w-[40px] text-right">
                        {module.completionPercent.toFixed(0)}%
                      </span>
                      {module._count && (
                        <span className="text-slate-500 text-xs">
                          ({module._count.tasks} tasks)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
