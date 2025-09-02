'use client'

import { experienceData } from '@/data/experience'
import Icon from './Icon'

// Utility function: Parse time string to a comparable format
function parseTimeString(timeStr: string): Date | null {
  if (timeStr === 'Present') return new Date() // 當前時間
  
  // Process "MMM YYYY" format
  const months: { [key: string]: number } = {
    'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
    'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
  }
  
  const parts = timeStr.split(' ')
  if (parts.length === 2) {
    const month = months[parts[0]]
    const year = parseInt(parts[1])
    if (month !== undefined && !isNaN(year)) {
      return new Date(year, month, 1)
    }
  }
  
  return null
}

// Utility function: Format time range
function formatDuration(start: string, end: string): string {
  return `${start} - ${end}`
}

// Utility function: Calculate grouped experience time range
function calculateGroupedDuration(experiences: any[]): string {
  if (experiences.length === 0) return ''
  
  // Parse all times
  const startTimes = experiences.map(exp => parseTimeString(exp.start)).filter(Boolean)
  const endTimes = experiences.map(exp => parseTimeString(exp.end)).filter(Boolean)
  
  if (startTimes.length === 0 || endTimes.length === 0) return ''
  
  // Find earliest start time and latest end time
  const earliestStart = new Date(Math.min(...startTimes.map(d => d!.getTime())))
  const latestEnd = new Date(Math.max(...endTimes.map(d => d!.getTime())))
  
  // Format time
  const formatDate = (date: Date): string => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${months[date.getMonth()]} ${date.getFullYear()}`
  }
  
  const startStr = formatDate(earliestStart)
  const endStr = latestEnd.getTime() === new Date().getTime() ? 'Present' : formatDate(latestEnd)
  
  return formatDuration(startStr, endStr)
}

export default function Experience() {
  return (
    <section id="experience" className="py-20 bg-dark-800 min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 via-transparent to-secondary/5"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-accent via-secondary to-neon-red bg-clip-text text-transparent">
                Experience
              </span>
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-accent to-secondary mx-auto mb-8 rounded-full"></div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              My professional journey spanning 6+ years across innovative companies, 
              building AI systems, backend architectures, and scalable solutions.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Main Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-secondary/60 via-accent/40 to-secondary/20"></div>
            
            {/* Timeline decorative elements */}
            <div className="absolute left-7 top-0 bottom-0 w-3 bg-gradient-to-b from-secondary/5 via-accent/3 to-transparent blur-sm"></div>
            
            {/* Time markers */}
            <div className="absolute left-6 top-20 w-5 h-px bg-gradient-to-r from-transparent via-secondary/30 to-transparent"></div>
            <div className="absolute left-6 top-40 w-5 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent"></div>
            <div className="absolute left-6 top-60 w-5 h-px bg-gradient-to-r from-transparent via-secondary/30 to-transparent"></div>
            
            <div className="space-y-12">
              {(() => {
                // Group experiences by companyId
                const groupedExperiences = []
                let i = 0
                
                while (i < experienceData.length) {
                  const currentExp = experienceData[i]
                  
                  // Check if this company has multiple experiences
                  const sameCompanyExps = experienceData.filter(exp => exp.companyId === currentExp.companyId)
                  
                  if (sameCompanyExps.length > 1) {
                    // Group all experiences from the same company
                    groupedExperiences.push({
                      type: 'grouped',
                      company: currentExp.company,
                      companyId: currentExp.companyId,
                      companyLogo: currentExp.companyLogo,
                      experiences: sameCompanyExps
                    })
                    i += sameCompanyExps.length // Skip all grouped experiences
                  } else {
                    // Single experience
                    groupedExperiences.push({
                      type: 'single',
                      experience: currentExp
                    })
                    i++
                  }
                }
                
                return groupedExperiences.map((item, index) => {
                  if (item.type === 'grouped' && item.experiences) {
                    // Render grouped HD Renewables experience
                    return (
                      <div key={`${item.company}-grouped`} className="relative flex items-start gap-8">
                        {/* Timeline Dot for grouped experience */}
                        <div className="relative z-10">
                          <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 ring-4 ring-orange-400/30 rounded-full flex items-center justify-center shadow-lg">
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                              <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                            </div>
                          </div>
                        </div>

                        {/* Grouped Experience Card */}
                        <div className="flex-1 bg-gray-800 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:transform hover:-translate-y-2 overflow-hidden">
                          {/* Company Header */}
                          <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border-b border-orange-400/30 p-6">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-orange-400/30 to-red-500/30 rounded-lg border-2 border-orange-400/50 flex items-center justify-center overflow-hidden">
                                <img 
                                  src={item.companyLogo} 
                                  alt={item.company} 
                                  className="w-8 h-8 object-cover rounded"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement
                                    const companyName = item.company
                                    const firstLetter = companyName.charAt(0).toUpperCase()
                                    target.style.display = 'none'
                                    target.parentElement!.innerHTML = `
                                      <div class="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded flex items-center justify-center text-white font-bold text-sm">
                                        ${firstLetter}
                                      </div>
                                    `
                                  }}
                                />
                              </div>
                              <div>
                                <h3 className="text-2xl font-bold text-white">{item.company}</h3>
                                <p className="text-orange-300 font-medium">{calculateGroupedDuration(item.experiences)} • Internal Department Transfer</p>
                              </div>
                            </div>
                          </div>

                          {/* Stages */}
                          <div className="p-6 space-y-8">
                            {item.experiences.map((exp, expIndex) => (
                              <div key={exp.id} className="relative">
                                {/* Stage indicator */}
                                <div className="flex items-start gap-4">
                                  <div className="flex flex-col items-center relative">
                                    {/* Stage timeline */}
                                    <div className="relative flex flex-col items-center">
                                      {/* Stage number circle */}
                                      <div className={`w-14 h-14 ${expIndex === 0 ? 'bg-gradient-to-br from-orange-400/15 to-red-400/15 border-2 border-orange-400/40' : 'bg-gradient-to-br from-secondary/15 to-accent/15 border-2 border-secondary/40'} rounded-full flex items-center justify-center backdrop-blur-sm shadow-lg`}>
                                        <div className={`w-8 h-8 ${expIndex === 0 ? 'bg-gradient-to-br from-orange-400 to-red-400' : 'bg-gradient-to-br from-secondary to-accent'} rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                                          {expIndex === 0 ? '2' : '1'}
                                        </div>
                                      </div>
                                      
                                      {/* Stage status indicator */}
                                      <div className="mt-2 flex flex-col items-center">
                                        <div className={`w-2 h-2 ${expIndex === 0 ? 'bg-orange-400' : 'bg-secondary'} rounded-full mb-1 animate-pulse`}></div>
                                        <span className={`text-xs font-medium ${expIndex === 0 ? 'text-orange-300' : 'text-secondary'} tracking-wide`}>
                                          {expIndex === 0 ? 'CURRENT' : 'PREVIOUS'}
                                        </span>
                                      </div>
                                    </div>
                                    
                                    {/* Connecting line - only show for the second (previous) stage */}
                                    {expIndex === 1 && (
                                      <div className="absolute top-16 w-px h-8 bg-gradient-to-b from-secondary/40 to-transparent"></div>
                                    )}
                                  </div>
                                  
                                  <div className="flex-1">
                                    {/* Stage header */}
                                    <div className="mb-6">
                                      <div className="flex items-start justify-between mb-3">
                                        <h4 className="text-xl font-bold text-white">{exp.title}</h4>
                                        <div className="flex flex-col items-end gap-2">
                                          <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 ${expIndex === 0 ? 'bg-orange-400' : 'bg-secondary'} rounded-full animate-pulse`}></div>
                                            <span className={`text-sm font-mono ${expIndex === 0 ? 'text-orange-300' : 'text-secondary'} bg-dark-700/80 px-3 py-1 rounded-full border ${expIndex === 0 ? 'border-orange-400/20' : 'border-secondary/20'}`}>
                                              {formatDuration(exp.start, exp.end)}
                                            </span>
                                          </div>
                                          <div className="flex items-center gap-2 text-sm text-gray-400">
                                            <Icon name="location" className="w-4 h-4" />
                                            <span>{exp.location}</span>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div className="flex items-center gap-3 mb-3">
                                        <span className={`inline-block ${expIndex === 0 ? 'bg-gradient-to-r from-orange-400/15 to-red-400/15 border border-orange-400/30 text-orange-300' : 'bg-gradient-to-r from-secondary/15 to-accent/15 border border-secondary/30 text-secondary'} rounded-lg px-3 py-1.5 text-sm font-medium`}>
                                          {exp.department}
                                        </span>
                                      </div>
                                      
                                      {/* Stage description with better styling */}
                                      <div className={`p-4 rounded-lg ${expIndex === 0 ? 'bg-orange-500/5 border-l-4 border-orange-400/50' : 'bg-secondary/5 border-l-4 border-secondary/50'}`}>
                                        <p className="text-gray-300 leading-relaxed text-sm">{exp.summary}</p>
                                      </div>
                                    </div>

                                    {/* Stage content */}
                                    <div className="grid md:grid-cols-1 gap-4">
                                      
                                      {/* Key Responsibilities */}
                                      <div className="bg-dark-700/50 rounded-lg p-4 border border-gray-700/50">
                                        <h5 className={`font-semibold mb-3 flex items-center gap-2 ${expIndex === 0 ? 'text-orange-300' : 'text-secondary'}`}>
                                          <Icon name="check" className="w-4 h-4" />
                                          Key Responsibilities
                                        </h5>
                                        <ul className="space-y-2 text-gray-300 text-sm">
                                          {exp.responsibilities.slice(0, 3).map((resp, respIndex) => (
                                            <li key={respIndex} className="flex items-start gap-3">
                                              <span className={`${expIndex === 0 ? 'text-orange-400' : 'text-secondary'} mt-1 text-xs`}>▸</span>
                                              <span className="leading-relaxed">{resp}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>

                                      {/* Technologies */}
                                      <div className="bg-dark-700/50 rounded-lg p-4 border border-gray-700/50">
                                        <h5 className={`font-semibold mb-3 flex items-center gap-2 ${expIndex === 0 ? 'text-orange-300' : 'text-secondary'}`}>
                                          <Icon name="code" className="w-4 h-4" />
                                          Technologies
                                        </h5>
                                        <div className="flex flex-wrap gap-2">
                                          {exp.techStack.map((tech) => (
                                            <span key={tech} className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${expIndex === 0 ? 'bg-orange-400/10 text-orange-300 border-orange-400/30 hover:border-orange-400/50' : 'bg-secondary/10 text-secondary border-secondary/30 hover:border-secondary/50'}`}>
                                              {tech}
                                            </span>
                                          ))}
                                        </div>
                                      </div>

                                      {/* Achievements */}
                                      {exp.achievements && exp.achievements.length > 0 && (
                                        <div className="bg-dark-700/50 rounded-lg p-4 border border-gray-700/50">
                                          <h5 className={`font-semibold mb-3 flex items-center gap-2 ${expIndex === 0 ? 'text-orange-300' : 'text-secondary'}`}>
                                            <Icon name="star" className="w-4 h-4" />
                                            Key Achievements
                                          </h5>
                                          <ul className="space-y-2 text-gray-300 text-sm">
                                            {exp.achievements.map((achievement, achIndex) => (
                                              <li key={achIndex} className="flex items-start gap-3">
                                                <span className={`${expIndex === 0 ? 'text-orange-400' : 'text-accent'} mt-1 text-xs`}>★</span>
                                                <span className="leading-relaxed">{achievement}</span>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )
                  } else if (item.experience) {
                    // Render single experience
                    const exp = item.experience
                    
                    // Define company color themes
                    const getCompanyTheme = (companyName: string) => {
                      switch (companyName) {
                        case 'Big Data Co., Ltd.':
                          return {
                            circle: 'from-purple-400/15 to-indigo-400/15 border-purple-400/40',
                            inner: 'from-purple-400 to-indigo-400',
                            dot: 'bg-purple-400',
                            text: 'text-purple-300',
                            header: 'from-purple-500/20 to-indigo-500/20 border-purple-400/30',
                            icon: 'from-purple-400/30 to-indigo-400/30 border-purple-400/50 text-purple-400'
                          }
                        case 'TAIWAN-CA, Inc.':
                          return {
                            circle: 'from-green-400/15 to-emerald-400/15 border-green-400/40',
                            inner: 'from-green-400 to-emerald-400',
                            dot: 'bg-green-400',
                            text: 'text-green-300',
                            header: 'from-green-500/20 to-emerald-500/20 border-green-400/30',
                            icon: 'from-green-400/30 to-emerald-400/30 border-green-400/50 text-green-400'
                          }
                        case 'Infortrend Technology, Inc.':
                          return {
                            circle: 'from-blue-400/15 to-cyan-400/15 border-blue-400/40',
                            inner: 'from-blue-400 to-cyan-400',
                            dot: 'bg-blue-400',
                            text: 'text-blue-300',
                            header: 'from-blue-500/20 to-cyan-500/20 border-blue-400/30',
                            icon: 'from-blue-400/30 to-cyan-400/30 border-blue-400/50 text-blue-400'
                          }
                        case 'Leopard Mobile, Ltd.':
                          return {
                            circle: 'from-yellow-400/15 to-amber-400/15 border-yellow-400/40',
                            inner: 'from-yellow-400 to-amber-400',
                            dot: 'bg-yellow-400',
                            text: 'text-yellow-300',
                            header: 'from-yellow-500/20 to-amber-500/20 border-yellow-400/30',
                            icon: 'from-yellow-400/30 to-amber-400/30 border-yellow-400/50 text-yellow-400'
                          }
                        default:
                          return {
                            circle: 'from-secondary/15 to-accent/15 border-secondary/40',
                            inner: 'from-secondary to-accent',
                            dot: 'bg-secondary',
                            text: 'text-secondary',
                            header: 'from-orange-500/20 to-red-500/20 border-orange-400/30',
                            icon: 'from-secondary/30 to-accent/30 border-secondary/50 text-secondary'
                          }
                      }
                    }
                    
                    const theme = getCompanyTheme(exp.company)
                    
                    return (
                      <div key={exp.id} className="relative flex items-start gap-8">
                        {/* Timeline Dot */}
                        <div className="relative z-10">
                          <div className="relative">
                            {/* Main timeline circle */}
                            <div className={`w-16 h-16 bg-gradient-to-br ${theme.circle} rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm border-2 border-gray-600/20`}>
                              <div className={`w-10 h-10 bg-gradient-to-br ${theme.inner} rounded-full flex items-center justify-center shadow-md`}>
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 114 0 2 2 0 01-4 0zm6 0a2 2 0 104 0 2 2 0 00-4 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            </div>
                            
                            {/* Timeline connecting rings - for visual depth */}
                            <div className="absolute -inset-2 rounded-full border border-gray-600/10"></div>
                            <div className="absolute -inset-4 rounded-full border border-gray-600/5"></div>
                          </div>
                        </div>

                        {/* Experience Card */}
                        <div className="flex-1 bg-gray-800 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:transform hover:-translate-y-2 overflow-hidden">
                          {/* Company Header */}
                          <div className={`bg-gradient-to-r ${theme.header} p-6`}>
                            <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 bg-gradient-to-br ${theme.icon} rounded-lg border-2 flex items-center justify-center overflow-hidden`}>
                                <img 
                                  src={exp.companyLogo} 
                                  alt={exp.company} 
                                  className="w-8 h-8 object-cover rounded"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement
                                    const companyName = exp.company
                                    const firstLetter = companyName.charAt(0).toUpperCase()
                                    target.style.display = 'none'
                                    target.parentElement!.innerHTML = `
                                      <div class="w-8 h-8 bg-gradient-to-br ${theme.inner} rounded flex items-center justify-center text-white font-bold text-sm">
                                        ${firstLetter}
                                      </div>
                                    `
                                  }}
                                />
                              </div>
                              <div>
                                <h3 className="text-2xl font-bold text-white">{exp.title}</h3>
                                <p className={`font-semibold ${theme.text}`}>{exp.company}</p>
                                {exp.department && (
                                  <div className="mt-1">
                                    <span className={`inline-block bg-gradient-to-r ${theme.header} border rounded-full px-3 py-1 text-xs font-medium ${theme.text}`}>
                                      {exp.department}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-6 mt-4 text-sm text-gray-300">
                              <div className="flex items-center gap-2">
                                <Icon name="location" className="w-4 h-4" />
                                <span>{exp.location}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 ${theme.dot} rounded-full animate-pulse`}></div>
                                <span className="font-mono">{formatDuration(exp.start, exp.end)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Experience Content */}
                          <div className="p-6">
                            <p className="text-gray-300 mb-6 leading-relaxed">
                              {exp.summary}
                            </p>

                            <div className="grid md:grid-cols-1 gap-6">
                              {/* Responsibilities */}
                              <div className="bg-dark-700/50 rounded-lg p-4 border border-gray-700/50">
                                <h4 className={`font-semibold mb-3 flex items-center gap-2 ${theme.text}`}>
                                  <Icon name="check" className="w-4 h-4" />
                                  Key Responsibilities
                                </h4>
                                <ul className="space-y-2">
                                  {exp.responsibilities.slice(0, 3).map((resp, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-gray-300 text-sm">
                                      <span className={`${theme.text} mt-1 text-xs`}>▸</span>
                                      <span className="leading-relaxed">{resp}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Achievements */}
                              {exp.achievements && exp.achievements.length > 0 && (
                                <div className="bg-dark-700/50 rounded-lg p-4 border border-gray-700/50">
                                  <h4 className={`font-semibold mb-3 flex items-center gap-2 ${theme.text}`}>
                                    <Icon name="star" className="w-4 h-4" />
                                    Key Achievements
                                  </h4>
                                  <div className="space-y-2">
                                    {exp.achievements.slice(0, 2).map((achievement, idx) => (
                                      <div key={idx} className="flex items-start gap-3 text-gray-300 text-sm">
                                        <span className={`${theme.text} mt-1 text-xs`}>★</span>
                                        <span className="leading-relaxed">{achievement}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Technologies */}
                              <div className="bg-dark-700/50 rounded-lg p-4 border border-gray-700/50">
                                <h4 className={`font-semibold mb-3 flex items-center gap-2 ${theme.text}`}>
                                  <Icon name="code" className="w-4 h-4" />
                                  Technologies Used
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {exp.techStack.map((tech) => (
                                    <span
                                      key={tech}
                                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors bg-gradient-to-r ${theme.circle} ${theme.text} border-opacity-30 hover:border-opacity-50`}
                                    >
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  } else {
                    return null
                  }
                })
              })()}
            </div>
          </div>

          {/* Summary Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-secondary mb-2">6+</div>
              <div className="text-gray-400">Years Experience</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-secondary mb-2">5</div>
              <div className="text-gray-400">Companies</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-secondary mb-2">15+</div>
              <div className="text-gray-400">Major Projects</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-secondary mb-2">10+</div>
              <div className="text-gray-400">Technologies</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}