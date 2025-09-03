'use client'

import React from 'react'
import Icon from './Icon'
import Marquee from 'react-fast-marquee'

interface TechItem {
  name: string
  icon: string
  color: string
  category: 'frontend' | 'backend' | 'ai' | 'devops' | 'database' | 'cloud'
}

const techStack: TechItem[] = [
  // Frontend
  { name: 'React', icon: 'react', color: 'from-blue-400 to-cyan-500', category: 'frontend' },
  { name: 'Next.js', icon: 'nextjs', color: 'from-gray-400 to-gray-600', category: 'frontend' },
  { name: 'TypeScript', icon: 'typescript', color: 'from-blue-500 to-blue-700', category: 'frontend' },
  { name: 'Tailwind CSS', icon: 'tailwind', color: 'from-cyan-400 to-blue-500', category: 'frontend' },
  { name: 'Vue.js', icon: 'vue', color: 'from-green-400 to-emerald-500', category: 'frontend' },
  { name: 'Figma', icon: 'figma', color: 'from-pink-400 to-purple-500', category: 'frontend' },
  { name: 'JavaScript', icon: 'javascript', color: 'from-yellow-400 to-orange-500', category: 'frontend' },

  // Backend
  { name: 'Python', icon: 'python', color: 'from-yellow-400 to-blue-500', category: 'backend' },
  { name: 'Django', icon: 'django', color: 'from-green-400 to-emerald-500', category: 'backend' },
  { name: 'FastAPI', icon: 'fastapi', color: 'from-teal-400 to-cyan-500', category: 'backend' },
  { name: 'Node.js', icon: 'nodejs', color: 'from-green-500 to-green-700', category: 'backend' },
  { name: 'Java', icon: 'java', color: 'from-red-400 to-orange-500', category: 'backend' },
  
  // AI/ML
  { name: 'PyTorch', icon: 'pytorch', color: 'from-red-400 to-orange-500', category: 'ai' },
  { name: 'TensorFlow', icon: 'tensorflow', color: 'from-orange-400 to-red-500', category: 'ai' },
  { name: 'Scikit-learn', icon: 'scikit', color: 'from-orange-500 to-red-600', category: 'ai' },
  { name: 'OpenCV', icon: 'opencv', color: 'from-blue-500 to-purple-600', category: 'ai' },
  { name: 'Hugging Face', icon: 'huggingface', color: 'from-yellow-400 to-orange-500', category: 'ai' },
  
  // DevOps
  { name: 'Docker', icon: 'docker', color: 'from-blue-500 to-indigo-500', category: 'devops' },
  { name: 'Kubernetes', icon: 'kubernetes', color: 'from-blue-400 to-blue-600', category: 'devops' },
  { name: 'Git', icon: 'git', color: 'from-orange-400 to-red-500', category: 'devops' },
  { name: 'GitHub Actions', icon: 'github', color: 'from-gray-400 to-gray-600', category: 'devops' },

  // Database
  { name: 'PostgreSQL', icon: 'postgresql', color: 'from-blue-600 to-purple-600', category: 'database' },
  { name: 'MongoDB', icon: 'mongodb', color: 'from-green-500 to-green-700', category: 'database' },
  { name: 'Redis', icon: 'redis', color: 'from-red-500 to-red-700', category: 'database' },
  { name: 'Elasticsearch', icon: 'elasticsearch', color: 'from-yellow-500 to-orange-600', category: 'database' },
  { name: 'MySQL', icon: 'mysql', color: 'from-blue-500 to-blue-700', category: 'database' },
  
  // Cloud
  { name: 'AWS', icon: 'aws', color: 'from-orange-400 to-red-500', category: 'cloud' },
  { name: 'Google Cloud', icon: 'gcp', color: 'from-blue-400 to-blue-600', category: 'cloud' },
  { name: 'Azure', icon: 'azure', color: 'from-blue-500 to-blue-700', category: 'cloud' },
  { name: 'Vercel', icon: 'vercel', color: 'from-gray-400 to-gray-600', category: 'cloud' },

]

export default function ScrollingTechStack() {
  // Split tech stack into two rows
  const topRow = techStack.slice(0, Math.ceil(techStack.length / 2))
  const bottomRow = techStack.slice(Math.ceil(techStack.length / 2))

  return (
    <div className="mb-12 animate-fade-in" style={{ animationDelay: '0.8s' }}>
      <h3 className="text-2xl font-bold text-white mb-8 text-center">Core Technologies</h3>
      
      {/* Scrolling Tech Stack - True Infinite Marquee */}
      <div className="relative overflow-visible py-12 md:py-16 -mx-4 sm:-mx-6 md:-mx-8 lg:-mx-16 xl:-mx-24 2xl:-mx-32 3xl:-mx-48 4xl:-mx-64 5xl:-mx-80 6xl:-mx-96" style={{ marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)' }}>
        {/* Top Row - left */}
        <Marquee gradient={false} speed={50} pauseOnHover={false} direction="left" className="overflow-visible" style={{ overflow: 'visible' }}>
          <div className="flex gap-6 mr-6 overflow-visible py-2 md:py-3">
            {topRow.map((tech, index) => (
              <TechCard key={`top-${index}`} tech={tech} />
            ))}
          </div>
        </Marquee>

        {/* Bottom Row - right */}
        <Marquee gradient={false} speed={50} pauseOnHover={false} direction="right" className="mt-10 overflow-visible" style={{ overflow: 'visible' }}>
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
