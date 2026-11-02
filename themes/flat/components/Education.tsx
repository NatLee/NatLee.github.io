'use client'

import { getEducation } from '@/data/education'
import { joinList } from '@/lib/site'
import Icon from './Icon'

export default function Education() {
  const educationData = getEducation()
  // Earliest first, for the "Bachelor + Master" style summary.
  const chronological = [...educationData].sort((a, b) => a.startYear.localeCompare(b.startYear))
  const yearsOfStudy = educationData.reduce((sum, edu) => {
    const years = parseInt(edu.endYear) - parseInt(edu.startYear)
    return sum + (Number.isFinite(years) && years > 0 ? years : 0)
  }, 0)
  const degrees = chronological.map(edu => edu.degree).filter(Boolean)
  const fields = Array.from(new Set(chronological.flatMap(edu => [edu.major, edu.minor ?? '']).filter(Boolean)))

  return (
    <section id="education" className="py-20 bg-dark-900 min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-bl from-secondary/5 via-transparent to-accent/5"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-secondary via-accent to-neon-red bg-clip-text text-transparent">
                Education
              </span>
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-secondary to-accent mx-auto mb-8 rounded-full"></div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              My academic journey, building the foundation
              for my career in technology.
            </p>
          </div>

          {/* Education Timeline */}
          <div className="space-y-8">
            {educationData.map((edu, index) => (
              <div key={edu.id} className="relative">
                <div className="bg-dark-800/80 backdrop-blur-sm border border-gray-700 rounded-lg p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:transform hover:-translate-y-2 animate-fade-in-up" style={{ animationDelay: `${index * 0.2}s` }}>
                  <div className="flex flex-col lg:flex-row items-start gap-6">
                    {/* School Logo */}
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center shadow-lg hover:border-secondary/50 transition-colors group">
                        {/* School logo placeholder */}
                        <div className="text-center">
                          <div className="flex justify-center"><Icon name="graduation" className="text-secondary" size={32} /></div>
                          <span className="text-xs text-gray-500 font-mono">
                            {edu.schoolAbbr}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Education Details */}
                    <div className="flex-1">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-2">
                            {edu.schoolEn}
                          </h3>
                          <p className="text-lg text-secondary font-semibold mb-1">
                            {edu.degree} in {edu.major}
                          </p>
                          {edu.minor && (
                            <p className="text-gray-400 text-sm mb-2">
                              Minor in {edu.minor}
                            </p>
                          )}
                          {edu.school && <p className="text-gray-400 text-sm">{edu.school}</p>}
                        </div>

                        <div className="mt-4 lg:mt-0 lg:text-right lg:flex lg:flex-col lg:items-end">
                          <div className="inline-flex items-center gap-2 bg-secondary/20 text-secondary px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap">
                            <Icon name="calendar" className="w-4 h-4" />
                            <span>{edu.startYear} - {edu.endYear}</span>
                          </div>
                          {edu.location && (
                            <div className="flex items-center gap-2 mt-2 text-gray-400 text-sm lg:justify-end">
                              <Icon name="location" className="w-4 h-4" />
                              <span>{edu.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Connection Line */}
                {index < educationData.length - 1 && (
                  <div className="flex justify-center my-8">
                    <div className="w-0.5 h-8 bg-gradient-to-b from-secondary to-purple-500"></div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Academic Summary */}
          <div className="mt-16 bg-gradient-to-r from-secondary/10 to-purple-500/10 rounded-lg p-8 border border-secondary/20">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Academic Journey</h3>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-secondary mb-2">{yearsOfStudy}</div>
                <div className="text-gray-300">Years of Study</div>
                <div className="text-gray-400 text-sm">{chronological.length > 0 ? `${chronological[0].startYear} - ${chronological[chronological.length - 1].endYear}` : ''}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-secondary mb-2">{educationData.length}</div>
                <div className="text-gray-300">Degrees Earned</div>
                <div className="text-gray-400 text-sm">{degrees.join(' + ')}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-secondary mb-2">{fields.length}</div>
                <div className="text-gray-300">Major Fields</div>
                <div className="text-gray-400 text-sm">{joinList(fields)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
