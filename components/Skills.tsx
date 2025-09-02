'use client'

import { skillsData } from '@/data/skills'
import Icon from './Icon'

export default function Skills() {
  const getCategoryIcon = (categoryId: string): string => {
    switch (categoryId) {
      case 'programming': return 'code'
      case 'backend': return 'server'
      case 'ai-ml': return 'AI/ML'
      case 'database': return 'Database'
      case 'devops': return 'DevOps'
      case 'specialization': return 'brain'
      default: return 'code'
    }
  }

  const getSkillLevel = (level: string): number => {
    switch (level) {
      case 'Expert': return 95
      case 'Advanced': return 80
      case 'Intermediate': return 65
      case 'Beginner': return 40
      default: return 50
    }
  }

  const getSkillColor = (level: string): string => {
    switch (level) {
      case 'Expert': return 'from-accent to-warm-500'
      case 'Advanced': return 'from-secondary to-neon-red'
      case 'Intermediate': return 'from-warm-400 to-warm-600'
      case 'Beginner': return 'from-gray-400 to-gray-500'
      default: return 'from-secondary to-accent'
    }
  }

  return (
    <section id="skills" className="py-20 bg-dark-800 min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 via-transparent to-secondary/5"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-accent via-secondary to-neon-red bg-clip-text text-transparent">
                Skills & Expertise
              </span>
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-accent to-secondary mx-auto mb-8 rounded-full"></div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              A comprehensive overview of my technical skills organized by expertise level, 
              showcasing proficiency across various technologies and frameworks.
            </p>
          </div>

          {/* Skills by Category - Compact Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {skillsData.map((category, categoryIndex) => (
              <div 
                key={category.id}
                className="bg-dark-800/80 backdrop-blur-sm border border-gray-700 rounded-lg p-6 animate-fade-in-up"
                style={{ animationDelay: `${categoryIndex * 0.1}s` }}
              >
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-secondary to-accent rounded-lg flex items-center justify-center">
                    <Icon name={getCategoryIcon(category.id)} className="w-4 h-4 text-white" />
                  </div>
                  {category.name}
                </h3>
                
                <div className="space-y-4">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skill.name} className="group">
                      {/* Skill Header */}
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white font-medium">{skill.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-secondary text-sm font-bold">
                            {skill.level}
                          </span>
                          {skill.years && (
                            <span className="text-gray-400 text-xs">
                              {skill.years}y
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Compact Progress Bar */}
                      <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${getSkillColor(skill.level)} transition-all duration-1000 ease-out rounded-full`}
                          style={{ 
                            width: `${getSkillLevel(skill.level)}%`,
                            animationDelay: `${categoryIndex * 0.2 + skillIndex * 0.1}s`
                          }}
                        >
                          <div className="h-full bg-white/20 animate-pulse rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Skills Summary - Horizontal Layout */}
          <div className="bg-dark-800/80 backdrop-blur-sm border border-gray-700 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-white mb-8 text-center">Expertise Summary</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {/* Expert Skills */}
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-accent/20 to-warm-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Icon name="star" className="w-8 h-8 text-accent" />
                </div>
                <div className="text-2xl font-bold text-accent mb-1">
                  {skillsData.flatMap(cat => cat.skills).filter(s => s.level === 'Expert').length}
                </div>
                <div className="text-gray-300 text-sm">Expert Level</div>
              </div>

              {/* Advanced Skills */}
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary/20 to-neon-red/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Icon name="check" className="w-8 h-8 text-secondary" />
                </div>
                <div className="text-2xl font-bold text-secondary mb-1">
                  {skillsData.flatMap(cat => cat.skills).filter(s => s.level === 'Advanced').length}
                </div>
                <div className="text-gray-300 text-sm">Advanced Level</div>
              </div>

              {/* Total Years */}
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Icon name="calendar" className="w-8 h-8 text-blue-300" />
                </div>
                <div className="text-2xl font-bold text-blue-300 mb-1">
                  {Math.round(skillsData.flatMap(cat => cat.skills).reduce((acc, skill) => acc + (skill.years || 0), 0) / skillsData.flatMap(cat => cat.skills).length)}+
                </div>
                <div className="text-gray-300 text-sm">Avg. Experience</div>
              </div>

              {/* Categories */}
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Icon name="chart" className="w-8 h-8 text-green-300" />
                </div>
                <div className="text-2xl font-bold text-green-300 mb-1">
                  {skillsData.length}
                </div>
                <div className="text-gray-300 text-sm">Categories</div>
              </div>
            </div>
          </div>

          {/* Proficiency Legend */}
          <div className="mt-8 bg-dark-700/50 rounded-lg p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-gradient-to-r from-accent to-warm-500 rounded-full"></div>
                <span className="text-gray-300 text-sm">Expert (95%)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-gradient-to-r from-secondary to-neon-red rounded-full"></div>
                <span className="text-gray-300 text-sm">Advanced (80%)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-gradient-to-r from-warm-400 to-warm-600 rounded-full"></div>
                <span className="text-gray-300 text-sm">Intermediate (65%)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full"></div>
                <span className="text-gray-300 text-sm">Beginner (40%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}