'use client'

import React from 'react'
import Icon from './Icon'
import Marquee from 'react-fast-marquee'
import { getPersonalInfo } from '@/data/personal'
import { getSkills } from '@/data/skills'

interface TechItem {
  name: string
  icon: string
  color: string
  category: string
}

type TechStyle = Omit<TechItem, 'name'>

// Theme look for well-known technologies (icon, badge gradient, badge label), keyed by lower-case name.
// Which technologies appear comes from the bundle's skills and tools.
const techStyles: Record<string, TechStyle> = {
  // Frontend
  'react': { icon: 'react', color: 'from-blue-400 to-cyan-500', category: 'frontend' },
  'next.js': { icon: 'nextjs', color: 'from-gray-400 to-gray-600', category: 'frontend' },
  'typescript': { icon: 'typescript', color: 'from-blue-500 to-blue-700', category: 'frontend' },
  'tailwind css': { icon: 'tailwind', color: 'from-cyan-400 to-blue-500', category: 'frontend' },
  'vue.js': { icon: 'vue', color: 'from-green-400 to-emerald-500', category: 'frontend' },
  'figma': { icon: 'figma', color: 'from-pink-400 to-purple-500', category: 'frontend' },
  'javascript': { icon: 'javascript', color: 'from-yellow-400 to-orange-500', category: 'frontend' },

  // Backend
  'python': { icon: 'python', color: 'from-yellow-400 to-blue-500', category: 'backend' },
  'django': { icon: 'django', color: 'from-green-400 to-emerald-500', category: 'backend' },
  'fastapi': { icon: 'fastapi', color: 'from-teal-400 to-cyan-500', category: 'backend' },
  'node.js': { icon: 'nodejs', color: 'from-green-500 to-green-700', category: 'backend' },
  'java': { icon: 'java', color: 'from-red-400 to-orange-500', category: 'backend' },

  // AI/ML
  'pytorch': { icon: 'pytorch', color: 'from-red-400 to-orange-500', category: 'ai' },
  'tensorflow': { icon: 'tensorflow', color: 'from-orange-400 to-red-500', category: 'ai' },
  'scikit-learn': { icon: 'scikit', color: 'from-orange-500 to-red-600', category: 'ai' },
  'opencv': { icon: 'opencv', color: 'from-blue-500 to-purple-600', category: 'ai' },
  'hugging face': { icon: 'huggingface', color: 'from-yellow-400 to-orange-500', category: 'ai' },

  // DevOps
  'docker': { icon: 'docker', color: 'from-blue-500 to-indigo-500', category: 'devops' },
  'kubernetes': { icon: 'kubernetes', color: 'from-blue-400 to-blue-600', category: 'devops' },
  'git': { icon: 'git', color: 'from-orange-400 to-red-500', category: 'devops' },
  'github actions': { icon: 'github', color: 'from-gray-400 to-gray-600', category: 'devops' },

  // Database
  'postgresql': { icon: 'postgresql', color: 'from-blue-600 to-purple-600', category: 'database' },
  'mongodb': { icon: 'mongodb', color: 'from-green-500 to-green-700', category: 'database' },
  'redis': { icon: 'redis', color: 'from-red-500 to-red-700', category: 'database' },
  'elasticsearch': { icon: 'elasticsearch', color: 'from-yellow-500 to-orange-600', category: 'database' },
  'mysql': { icon: 'mysql', color: 'from-blue-500 to-blue-700', category: 'database' },

  // Cloud
  'aws': { icon: 'aws', color: 'from-orange-400 to-red-500', category: 'cloud' },
  'google cloud': { icon: 'gcp', color: 'from-blue-400 to-blue-600', category: 'cloud' },
  'azure': { icon: 'azure', color: 'from-blue-500 to-blue-700', category: 'cloud' },
  'vercel': { icon: 'vercel', color: 'from-gray-400 to-gray-600', category: 'cloud' },
}

// Fallback look for technologies without an entry above, by skill category id.
const categoryStyles: Record<string, TechStyle> = {
  programming: { icon: 'code', color: 'from-yellow-400 to-orange-500', category: 'language' },
  backend: { icon: 'server', color: 'from-teal-400 to-cyan-500', category: 'backend' },
  'ai-ml': { icon: 'brain', color: 'from-orange-400 to-red-500', category: 'ai' },
  database: { icon: 'Database', color: 'from-blue-600 to-purple-600', category: 'database' },
  devops: { icon: 'DevOps', color: 'from-blue-500 to-indigo-500', category: 'devops' },
  tools: { icon: 'tool', color: 'from-pink-400 to-purple-500', category: 'tools' },
}

// Skills from every category except the soft "specialization" one, then the profile's everyday tools.
function getTechStack(): TechItem[] {
  const entries: { name: string; group: string }[] = [
    ...getSkills()
      .filter((category) => category.id !== 'specialization')
      .flatMap((category) => category.skills.map((skill) => ({ name: skill.name, group: category.id }))),
    ...getPersonalInfo().tools.map((name) => ({ name, group: 'tools' })),
  ]
  const seen = new Set<string>()
  const items: TechItem[] = []
  for (const { name, group } of entries) {
    const key = name.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    const style = techStyles[key] ?? categoryStyles[group] ?? categoryStyles.tools
    items.push({ name, ...style })
  }
  return items
}

export default function ScrollingTechStack() {
  const techStack = getTechStack()
  // Split tech stack into two rows
  const topRow = techStack.slice(0, Math.ceil(techStack.length / 2))
  const bottomRow = techStack.slice(Math.ceil(techStack.length / 2))

  return (
    <div className="mb-12 animate-fade-in" style={{ animationDelay: '0.8s' }}>
      <h3 className="text-2xl font-bold text-white mb-8 text-center">Core Technologies</h3>
      
      {/* Scrolling Tech Stack - True Infinite Marquee */}
      <div className="relative overflow-visible py-12 md:py-16 -mx-4 sm:-mx-6 md:-mx-8 lg:-mx-16 xl:-mx-24 2xl:-mx-32 3xl:-mx-48 4xl:-mx-64 5xl:-mx-80 6xl:-mx-96" style={{ marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)' }}>
        {/* Top Row - left */}
        <Marquee gradient={false} speed={50} pauseOnHover={false} autoFill direction="left" className="overflow-visible" style={{ overflow: 'visible' }}>
          <div className="flex gap-6 mr-6 overflow-visible py-2 md:py-3">
            {topRow.map((tech, index) => (
              <TechCard key={`top-${index}`} tech={tech} />
            ))}
          </div>
        </Marquee>

        {/* Bottom Row - right */}
        <Marquee gradient={false} speed={50} pauseOnHover={false} autoFill direction="right" className="mt-10 overflow-visible" style={{ overflow: 'visible' }}>
          <div className="flex gap-6 mr-6 overflow-visible py-2 md:py-3">
            {bottomRow.map((tech, index) => (
              <TechCard key={`bottom-${index}`} tech={tech} />
            ))}
          </div>
        </Marquee>
      </div>
    </div>
  )
}

function TechCard({ tech }: { tech: TechItem }) {
  return (
    <div className="group relative bg-dark-800/80 backdrop-blur-sm border border-gray-700 rounded-xl p-4 text-center hover:border-secondary/50 transition-transform duration-300 hover:scale-110 hover:shadow-xl hover:shadow-secondary/20 flex-shrink-0 min-w-[120px] z-20 origin-center overflow-visible">
      {/* Icon with gradient background */}
      <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${tech.color} p-0.5`}>
        <div className="w-full h-full bg-dark-800 rounded-xl flex items-center justify-center group-hover:bg-dark-700 transition-colors">
          <Icon name={tech.icon} className="text-white" size={24} />
        </div>
      </div>
      
      {/* Tech name */}
      <h4 className="text-white font-semibold text-xs mb-1">{tech.name}</h4>
      
      {/* Category badge */}
      <div className="text-xs text-gray-400 capitalize">{tech.category}</div>
      
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-secondary/0 via-secondary/5 to-accent/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Corner accent */}
      <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-gradient-to-br from-secondary to-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  )
}
