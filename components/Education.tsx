'use client'

import React from 'react'
import { educationData } from '@/data/education'

export default function Education() {
  return (
    <div className="font-mono text-sm md:text-base text-gray-400 w-full max-w-[90rem] mx-auto px-4 md:px-0">

      {/* Man Page Header */}
      <div className="border-b border-gray-700 pb-2 mb-12 flex justify-between text-gray-500 text-xs uppercase tracking-wider select-none">
        <span>EDUCATION(1)</span>
        <span className="hidden md:inline">System Modules</span>
        <span>EDUCATION(1)</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {educationData.map((edu, index) => (
          <div key={edu.id} className="animate-fade-in group border border-gray-800 bg-[#0a0a0a] p-6 rounded hover:border-secondary/50 transition-colors relative overflow-hidden" style={{ animationDelay: `${index * 0.15}s` }}>

            {/* Top Right Label (Year) */}
            <div className="absolute top-0 right-0 bg-gray-900 border-b border-l border-gray-800 px-3 py-1 text-xs text-secondary font-bold">
              {edu.startYear} - {edu.endYear}
            </div>

            {/* Package Header */}
            <div className="mb-6 space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-gray-500 w-24 flex-shrink-0 text-xs uppercase tracking-widest">Package:</span>
                <span className="text-xl md:text-2xl font-bold text-white group-hover:text-secondary transition-colors">{edu.schoolEn}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-gray-500 w-24 flex-shrink-0 text-xs uppercase tracking-widest">Version:</span>
                <span className="text-gray-300 font-bold">{edu.degree} in {edu.major}</span>
              </div>
              {edu.minor && (
                <div className="flex items-baseline gap-2">
                  <span className="text-gray-500 w-24 flex-shrink-0 text-xs uppercase tracking-widest">Extension:</span>
                  <span className="text-gray-400">Minor in {edu.minor}</span>
                </div>
              )}
              <div className="flex items-baseline gap-2">
                <span className="text-gray-500 w-24 flex-shrink-0 text-xs uppercase tracking-widest">Origin:</span>
                <span className="text-blue-400">{edu.location}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-gray-500 w-24 flex-shrink-0 text-xs uppercase tracking-widest">Status:</span>
                <span className="text-green-500">Installed</span>
              </div>
            </div>

            <div className="border-t border-gray-800 my-4 pt-4">
              <span className="text-gray-500 w-full block text-xs uppercase tracking-widest mb-2">Description:</span>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Advanced studies in <span className="text-gray-300">{edu.major}</span>.
                {edu.degree.includes('Master')
                  ? ' Focus on AI architectures, deep learning patterns, and system scalability.'
                  : ' Core foundations in algorithms, data structures, and software engineering.'
                }
              </p>
            </div>

            <div className="border-t border-gray-800 my-4 pt-4">
              <span className="text-gray-500 w-full block text-xs uppercase tracking-widest mb-2">Dependencies:</span>
              <div className="flex flex-wrap gap-2">
                {(edu.degree.includes('Master')
                  ? ['Computer Vision', 'Deep Learning', 'Cloud Computing', 'Research Methods']
                  : ['Algorithms', 'Data Structures', 'Database Systems', 'OS', 'Networks']
                ).map(course => (
                  <span key={course} className="bg-gray-900 border border-gray-800 text-xs px-2 py-1 text-gray-400 rounded group-hover:border-gray-600 transition-colors">
                    {course}
                  </span>
                ))}
              </div>
            </div>

            {edu.achievements && edu.achievements.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-800 bg-gray-900/30 -mx-6 -mb-6 px-6 py-4">
                <div className="text-xs text-yellow-500 font-bold mb-2 flex items-center gap-2">
                  <span>★</span> CERTIFIED PATCHES
                </div>
                <ul className="space-y-1">
                  {edu.achievements.map((ach, i) => (
                    <li key={i} className="text-xs text-gray-400 pl-4 border-l-2 border-yellow-500/30">
                      {ach}
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="border-t border-gray-700 pt-4 mt-12 flex justify-between text-gray-500 text-xs uppercase tracking-wider select-none">
        <span>Nat Lee Portfolio</span>
        <span>(END)</span>
      </div>

    </div>
  )
}
