'use client'

import React, { useEffect, useMemo, useState } from 'react'
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

function hashString(value: string): number {
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

export default function ScrollingTechStack() {
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    setReduceMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  const rows = useMemo(
    () => [techStack.slice(0, 6), techStack.slice(6, 12), techStack.slice(12), techStack.slice(0, 8), techStack.slice(8)],
    []
  )

  return (
    <div className="w-full h-full relative overflow-hidden">
      <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(18,18,18,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(18,18,18,0.8)_1px,transparent_1px)] bg-[size:30px_30px] opacity-60" />
      <div className="relative z-10 w-full h-full flex flex-col justify-between py-12 text-sm font-mono opacity-100 transition-opacity duration-700">
        <div className="flex-1 flex flex-col justify-around py-8">
          {rows.map((rowItems, rowIndex) => (
            <div key={rowIndex} className="relative group">
              {reduceMotion ? (
                <div className="flex gap-16 pr-16 overflow-hidden">
                  {rowItems.map((tech, index) => (
                    <ProcessRow key={`${rowIndex}-${index}`} tech={tech} pid={1000 + rowIndex * 100 + index} />
                  ))}
                </div>
              ) : (
                <Marquee gradient={false} speed={15 + rowIndex * 5} pauseOnHover direction={rowIndex % 2 === 0 ? 'left' : 'right'} className="overflow-visible">
                  <div className="flex gap-16 pr-16">
                    {rowItems.map((tech, index) => (
                      <ProcessRow key={`${rowIndex}-${index}`} tech={tech} pid={1000 + rowIndex * 100 + index} />
                    ))}
                  </div>
                </Marquee>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ProcessRow({ tech, pid }: { tech: TechItem; pid: number }) {
  const stats = useMemo(() => {
    const hash = hashString(`${tech.name}-${pid}`)
    return {
      cpu: ((hash % 500) / 100 + 1).toFixed(1),
      mem: ((hash % 1000) / 100 + 2).toFixed(1),
    }
  }, [tech.name, pid])

  const categoryColorClasses: Record<string, string> = {
    frontend: 'text-blue-400/40',
    backend: 'text-emerald-400/40',
    ai: 'text-purple-400/40',
    devops: 'text-orange-400/40',
    cloud: 'text-sky-400/40',
    database: 'text-amber-300/40',
    os: 'text-rose-300/40',
  }

  const baseColorClass = categoryColorClasses[tech.category] ?? 'text-gray-400/40'

  return (
    <div className="group">
      <div className={`flex gap-4 md:gap-12 items-center ${baseColorClass} border border-transparent rounded-md px-3 py-1 cursor-crosshair transition-all duration-200 ease-out group-hover:bg-emerald-500/10 group-hover:border-emerald-400/60 group-hover:text-emerald-300 group-hover:scale-[1.03]`}>
        <span className="w-12 text-right opacity-70 group-hover:opacity-100">{pid}</span>
        <span className="w-16 opacity-70 group-hover:opacity-100">natlee</span>
        <span className="w-12 text-right opacity-70 group-hover:opacity-100">{stats.cpu}</span>
        <span className="w-12 text-right opacity-70 group-hover:opacity-100">{stats.mem}</span>
        <div className="flex items-center gap-2 font-bold whitespace-nowrap group-hover:drop-shadow-[0_0_12px_rgba(34,197,94,0.5)]">
          <Icon name={tech.icon} size={14} className="opacity-90" />
          <span>./{tech.name.toLowerCase().replace(/\s+/g, '_')}</span>
          <span className="text-gray-500/60 group-hover:text-emerald-300/80">--{tech.category}</span>
        </div>
      </div>
    </div>
  )
}
