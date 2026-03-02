'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

const PIPELINE_STAGES = ['idea', 'assets', 'mvp', 'qa', 'docker', 'review', 'prod'] as const
type PipelineStage = typeof PIPELINE_STAGES[number]

interface Phase {
  id: number
  name: string
  completionPercent: number
}

interface PipelineTrackProps {
  stage: PipelineStage | string
  projectName: string
  phases: Phase[]
  overallCompletion: number
}

export function PipelineTrack({ stage, projectName, phases, overallCompletion }: PipelineTrackProps) {
  const currentIndex = PIPELINE_STAGES.indexOf(stage as PipelineStage)
  const progressPercent = Math.max(0, (currentIndex / (PIPELINE_STAGES.length - 1)) * 100)

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 mb-6 border border-slate-700 shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-xl font-semibold text-slate-100">{projectName}</h3>
          <span className="text-sm text-slate-400">
            Current: <strong className="text-purple-400 uppercase">{stage}</strong>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-36 h-2.5 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-cyan-400"
              initial={{ width: 0 }}
              animate={{ width: `${overallCompletion}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
          <span className="text-cyan-400 font-semibold text-sm min-w-[50px] text-right">
            {overallCompletion.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* SVG Pipeline Track */}
      <svg className="w-full h-32" viewBox="0 0 800 120" preserveAspectRatio="xMidYMid meet">
        {/* Background Track Line */}
        <line
          x1="60"
          y1="60"
          x2="740"
          y2="60"
          stroke="#1e293b"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Completed Path */}
        <motion.line
          x1="60"
          y1="60"
          x2={60 + (currentIndex / (PIPELINE_STAGES.length - 1)) * 680}
          y2="60"
          stroke="url(#gradient)"
          strokeWidth="6"
          strokeLinecap="round"
          initial={{ x2: 60 }}
          animate={{ x2: 60 + (currentIndex / (PIPELINE_STAGES.length - 1)) * 680 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />

        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>

        {/* Stage Nodes */}
        {PIPELINE_STAGES.map((s, i) => (
          <g key={s} transform={`translate(${60 + i * 113.33}, 60)`}>
            {/* Outer Glow for Current Stage */}
            {i === currentIndex && (
              <motion.circle
                r="20"
                fill="#7c3aed"
                opacity={0.3}
                animate={{
                  r: [20, 25, 20],
                  opacity: [0.3, 0.1, 0.3]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}

            {/* Node Circle */}
            <motion.circle
              r="16"
              fill={i <= currentIndex ? '#7c3aed' : '#0f172a'}
              stroke={i <= currentIndex ? '#38bdf8' : '#334155'}
              strokeWidth="3"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
            />

            {/* Checkmark for Completed Stages */}
            {i < currentIndex && (
              <text
                y="5"
                textAnchor="middle"
                fill="#38bdf8"
                fontSize="18"
                fontWeight="bold"
              >
                ✓
              </text>
            )}

            {/* Current Stage Indicator */}
            {i === currentIndex && (
              <motion.circle
                r="6"
                fill="#fbbf24"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}

            {/* Stage Label */}
            <text
              y="38"
              textAnchor="middle"
              fill={i <= currentIndex ? '#f1f5f9' : '#64748b'}
              fontSize="11"
              fontWeight={i <= currentIndex ? 600 : 400}
            >
              {s}
            </text>

            {/* Phase Completion Badge */}
            {phases[i] && (
              <text
                y="-20"
                textAnchor="middle"
                fill="#38bdf8"
                fontSize="10"
                fontWeight="bold"
              >
                {phases[i].completionPercent.toFixed(0)}%
              </text>
            )}
          </g>
        ))}
      </svg>

      {/* Phase Details */}
      {phases.length > 0 && (
        <div className="mt-6 pt-6 border-t border-slate-700 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {phases.slice(0, 5).map((phase, i) => (
            <div key={phase.id} className={`flex flex-col gap-2 transition-opacity ${i <= currentIndex ? 'opacity-100' : 'opacity-50'}`}>
              <span className="text-slate-400 text-xs font-medium truncate">{phase.name.split(':')[0]}</span>
              <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-cyan-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${phase.completionPercent}%` }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                />
              </div>
              <span className="text-cyan-400 text-xs font-semibold">
                {phase.completionPercent.toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
