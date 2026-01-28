'use client'

import React, { useState } from 'react'
import { experienceData } from '@/data/experience'
import { educationData } from '@/data/education'
import Icon from './Icon'

// Group experiences by company
const getGroupedExperience = () => {
  const grouped: { company: string; items: typeof experienceData }[] = []

  experienceData.forEach(exp => {
    const existingGroup = grouped.find(g => g.company === exp.company)
    if (existingGroup) {
      existingGroup.items.push(exp)
    } else {
      grouped.push({ company: exp.company, items: [exp] })
    }
  })

  return grouped
}

export default function Experience() {
  const groupedData = getGroupedExperience()
  // By default expand the most recent job
  const [expandedGroups, setExpandedGroups] = useState<string[]>([groupedData[0]?.company])

  const toggleGroup = (company: string) => {
    setExpandedGroups(prev =>
      prev.includes(company)
        ? prev.filter(c => c !== company)
        : [...prev, company]
    )
  }

  return (
    <div className="font-mono text-sm md:text-base text-gray-300 w-full max-w-[90rem] mx-auto">

      {/* Header Log */}
      <div className="mb-8 p-4 bg-gray-900/50 border-l-4 border-secondary text-gray-400 text-xs md:text-sm">
        <span className="text-secondary font-bold">natlee@mainframe</span>: <span className="text-blue-400">~/var/log/career.log</span>
        <br />
        <span>Total process groups: {groupedData.length}</span>
        <span className="animate-pulse">_</span>
      </div>

      <div className="space-y-6">
        {groupedData.map((group) => {
          const isExpanded = expandedGroups.includes(group.company)

          return (
            <div key={group.company} className="border border-gray-800 bg-[#0a0a0a] rounded overflow-hidden">

              {/* Group Header (Clickable) */}
              <div
                onClick={() => toggleGroup(group.company)}
                className={`
                                cursor-pointer p-4 flex items-center justify-between transition-colors
                                ${isExpanded ? 'bg-gray-900 border-b border-gray-800' : 'hover:bg-gray-900'}
                            `}
              >
                <div className="flex items-center gap-4 text-sm md:text-base">
                  <span className={`text-xl transition-transform ${isExpanded ? 'rotate-90' : ''}`}>▶</span>
                  <span className={`font-bold ${isExpanded ? 'text-secondary' : 'text-gray-400'}`}>
                    {group.company}
                  </span>
                  <span className="text-gray-600 text-xs ml-2 border border-gray-800 px-2 py-0.5 rounded">
                    {group.items.length} role{group.items.length > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="hidden md:block text-xs text-gray-500">
                  Latest update: {group.items[0].end}
                </div>
              </div>

              {/* Expandable Content */}
              {isExpanded && (
                <div className="p-0">
                  {group.items.map((exp, index) => (
                    <div key={exp.id} className="relative pl-8 md:pl-12 py-8 pr-4 group transition-colors hover:bg-white/5">

                      {/* Thread Line - Connects multiple roles if exists */}
                      {group.items.length > 1 && (
                        <div className="absolute left-4 md:left-6 top-0 bottom-0 w-px bg-gray-800"></div>
                      )}
                      {/* Dot Indicator */}
                      <div className={`
                                            absolute left-[13px] md:left-[21px] top-10 w-2 h-2 rounded-full z-10
                                            ${index === 0 ? 'bg-green-500 ring-4 ring-green-900/30' : 'bg-gray-600'}
                                        `}></div>

                      <div className="flex flex-col md:flex-row md:items-start gap-4 mb-4">
                        {/* Time Column */}
                        <div className="w-48 flex-shrink-0 text-xs text-gray-500 font-mono pt-1">
                          [{exp.start} -- {exp.end}]
                        </div>

                        {/* Main Content */}
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                            {exp.title}
                          </h3>
                          <div className="text-orange-300 text-sm mb-4 flex items-center gap-2">
                            <span>@ {exp.location}</span>
                          </div>

                          <div className="border-l-2 border-gray-800 pl-4 space-y-4">
                            <div>
                              <span className="text-gray-500 text-xs block mb-1">LOG_SUMMARY</span>
                              <p className="text-gray-300 leading-relaxed max-w-3xl">
                                {exp.summary}
                              </p>
                            </div>

                            <div>
                              <span className="text-gray-500 text-xs block mb-1">PROCESS_OUTPUT (Responsibilities)</span>
                              <ul className="space-y-1">
                                {exp.responsibilities.map((resp, i) => (
                                  <li key={i} className="flex gap-2 items-start text-sm text-gray-400">
                                    <span className="text-secondary mt-1">➜</span>
                                    <span>{resp}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {exp.achievements && exp.achievements.length > 0 && (
                              <div>
                                <span className="text-gray-500 text-xs block mb-1">CRITICAL_EVENTS (Achievements)</span>
                                <ul className="space-y-1">
                                  {exp.achievements.map((ach, i) => (
                                    <li key={i} className="flex gap-2 items-start text-sm text-green-400/90">
                                      <span className="text-green-500 font-bold mt-1">+</span>
                                      <span>{ach}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            <div className="pt-2 flex flex-wrap gap-2">
                              {exp.techStack.map(tech => (
                                <span key={tech} className="bg-gray-900 border border-gray-700 text-gray-400 text-xs px-2 py-1 rounded hover:border-secondary hover:text-secondary transition-colors">
                                  #{tech}
                                </span>
                              ))}
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Education Section Merged */}
      <div className="mt-20">
        <div className="mb-8 p-4 bg-gray-900/50 border-l-4 border-blue-500 text-gray-400 text-xs md:text-sm">
          <span className="text-blue-500 font-bold">natlee@mainframe</span>: <span className="text-green-400">~/var/lib/education</span>
          <br />
          <span>Loaded modules: {educationData.length}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {educationData.map((edu, index) => (
            <div key={edu.id} className="border border-gray-800 bg-[#0a0a0a] p-6 rounded relative overflow-hidden group hover:border-blue-500/50 transition-colors">
              {/* Year Label */}
              <div className="absolute top-0 right-0 bg-gray-900 border-b border-l border-gray-800 px-3 py-1 text-xs text-blue-400 font-bold">
                {edu.startYear} - {edu.endYear}
              </div>

              <div className="mb-4">
                <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Module</div>
                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{edu.schoolEn}</h3>
                <div className="text-sm text-gray-400 mt-1">{edu.degree} in {edu.major}</div>
                {edu.minor && <div className="text-xs text-gray-500 mt-1">Minor: {edu.minor}</div>}
              </div>

              <div className="border-t border-gray-800 pt-4 mt-4">
                <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">Dependencies</div>
                <div className="flex flex-wrap gap-2">
                  {(edu.degree.includes('Master')
                    ? ['Computer Vision', 'Deep Learning', 'Cloud Computing']
                    : ['Algorithms', 'Data Structures', 'OS', 'Networks']
                  ).map(course => (
                    <span key={course} className="text-xs bg-gray-900 px-2 py-1 rounded text-gray-400 border border-gray-800">
                      {course}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-gray-600 text-center text-xs mt-12 mb-8">
        -- End of Log Stream --
      </div>

    </div>
  )
}