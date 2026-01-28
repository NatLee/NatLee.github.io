'use client'

import React from 'react'

export default function QuickStats() {
  const stats = [
    {
      label: 'Years Experience',
      value: '6',
      max: 10,
      code: 'EXP_LEVEL'
    },
    {
      label: 'AI/ML Projects',
      value: '15',
      max: 20,
      code: 'ML_MODELS'
    },
    {
      label: 'Backend APIs',
      value: '50',
      max: 60,
      code: 'API_ENDPOINTS'
    },
    {
      label: 'Open Source',
      value: '100',
      max: 120,
      code: 'COMMIT_LOG'
    }
  ]

  const getBar = (value: string, max: number) => {
    const num = parseInt(value)
    const total = 30
    const fill = Math.min(Math.floor((num / max) * total), total)
    const filled = '|'.repeat(fill)
    const empty = ' '.repeat(total - fill)
    return `[${filled}${empty}]`
  }

  return (
    <section className="py-20 bg-[#0a0a0a] font-mono text-gray-400">
      <div className="container mx-auto px-4 w-full max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div className="flex items-center gap-2 w-32 shrink-0">
                <span className="text-secondary font-bold">{stat.code}</span>
              </div>

              <div className="flex-1 text-secondary hidden sm:block">
                {getBar(stat.value, stat.max)}
              </div>

              <div className="text-right w-24">
                <span className="text-white">{stat.value}/{stat.max}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4 text-xs text-gray-500 border-t border-gray-800 pt-4">
          <div>Running Tasks: 4</div>
          <div>Load Average: 0.54 0.40 0.82</div>
          <div>Uptime: 6 years</div>
          <div className="col-span-3 mt-2 flex gap-4">
            <span><span className="bg-gray-700 text-white px-1">F1</span>Help</span>
            <span><span className="bg-gray-700 text-white px-1">F2</span>Setup</span>
            <span><span className="bg-gray-700 text-white px-1">F10</span>Quit</span>
          </div>
        </div>
      </div>
    </section>
  )
}
