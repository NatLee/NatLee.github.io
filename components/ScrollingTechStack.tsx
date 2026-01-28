'use client'

import React from 'react'
import Marquee from 'react-fast-marquee'
import Icon from './Icon'

interface TechItem {
  name: string
  category: string
  icon: string
}

const techStack: TechItem[] = [
  { name: 'React', category: 'frontend', icon: 'react' },
  { name: 'Next.js', category: 'frontend', icon: 'nextjs' },
  { name: 'TypeScript', category: 'frontend', icon: 'typescript' },
  { name: 'Tailwind CSS', category: 'frontend', icon: 'tailwind' },
  { name: 'Python', category: 'backend', icon: 'python' },
  { name: 'Django', category: 'backend', icon: 'django' },
  { name: 'FastAPI', category: 'backend', icon: 'fastapi' },
  { name: 'Node.js', category: 'backend', icon: 'nodejs' },
  { name: 'PyTorch', category: 'ai', icon: 'pytorch' },
  { name: 'TensorFlow', category: 'ai', icon: 'tensorflow' },
  { name: 'Docker', category: 'devops', icon: 'docker' },
  { name: 'Kubernetes', category: 'devops', icon: 'kubernetes' },
  { name: 'AWS', category: 'cloud', icon: 'aws' },
  { name: 'PostgreSQL', category: 'database', icon: 'postgresql' },
  { name: 'MongoDB', category: 'database', icon: 'mongodb' },
  { name: 'Git', category: 'devops', icon: 'git' },
  { name: 'Linux', category: 'os', icon: 'linux' },
]

export default function ScrollingTechStack() {
  // Split into multiple subsets to create variation across 5 rows
  const rows = [
    techStack.slice(0, 6),
    techStack.slice(6, 12),
    techStack.slice(12),
    techStack.slice(0, 8),
    techStack.slice(8)
  ]

  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(18,18,18,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(18,18,18,0.8)_1px,transparent_1px)] bg-[size:30px_30px] opacity-60"></div>

      <div className="relative z-10 w-full h-full flex flex-col justify-between py-12 text-sm font-mono opacity-100 transition-opacity duration-700">

        <div className="flex-1 flex flex-col justify-around py-8">
          {rows.map((rowItems, rowIndex) => (
            <div key={rowIndex} className="relative group">
              <Marquee
                gradient={false}
                speed={15 + rowIndex * 5}
                pauseOnHover={true}
                direction={rowIndex % 2 === 0 ? 'left' : 'right'}
                className="overflow-visible"
              >
                <div className="flex gap-16 pr-16">
                  {rowItems.map((tech, index) => (
                    <ProcessRow
                      key={`${rowIndex}-${index}`}
                      tech={tech}
                      pid={1000 + (rowIndex * 100) + index}
                    />
                  ))}
                </div>
              </Marquee>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ProcessRow({ tech, pid }: { tech: TechItem, pid: number }) {
  // Generate pseudo-random stats for effect
  // Use simple hashing or consistent randomness if possible, but random is okay for visual fluff
  const cpu = (Math.random() * 5 + 1).toFixed(1)
  const mem = (Math.random() * 10 + 2).toFixed(1)

  // Static Tailwind classes per category so JIT can pick them up correctly
  const categoryColorClasses: Record<string, string> = {
    frontend: 'text-blue-400/40',
    backend: 'text-emerald-400/40',
    ai: 'text-purple-400/40',
    devops: 'text-orange-400/40',
    cloud: 'text-sky-400/40',
    database: 'text-amber-300/40',
    os: 'text-rose-300/40'
  }

  // Base text color with ~30-40% opacity for "not too flashy but visible" look
  const baseColorClass = categoryColorClasses[tech.category] ?? 'text-gray-400/40'

  return (
    <div className="group">
      <div
        className={`flex gap-4 md:gap-12 items-center ${baseColorClass} border border-transparent rounded-md px-3 py-1 cursor-crosshair transition-all duration-200 ease-out group-hover:bg-emerald-500/10 group-hover:border-emerald-400/60 group-hover:text-emerald-300 group-hover:scale-[1.03]`}
      >
        <span className="w-12 text-right opacity-70 group-hover:opacity-100">{pid}</span>
        <span className="w-16 opacity-70 group-hover:opacity-100">natlee</span>
        <span className="w-12 text-right opacity-70 group-hover:opacity-100">{cpu}</span>
        <span className="w-12 text-right opacity-70 group-hover:opacity-100">{mem}</span>
        <div className="flex items-center gap-2 font-bold whitespace-nowrap group-hover:drop-shadow-[0_0_12px_rgba(34,197,94,0.5)]">
          <Icon name={tech.icon} size={14} className="opacity-90" />
          <span>./{tech.name.toLowerCase().replace(/\s+/g, '_')}</span>
          <span className="text-gray-500/60 group-hover:text-emerald-300/80">--{tech.category}</span>
        </div>
      </div>
      <div className="mt-1 pl-[4.5rem] text-xs text-gray-500/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        Running {tech.name} --category={tech.category}
      </div>
    </div>
  )
}
