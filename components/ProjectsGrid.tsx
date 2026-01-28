'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { allProjectsData, getAllCategories } from '@/data/projects'

export default function ProjectsGrid() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchTerm, setSearchTerm] = useState('')

  const categories = ['All', ...getAllCategories()]

  const filteredProjects = allProjectsData.filter(project => {
    const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Simple project stats
  const totalProjects = allProjectsData.length
  const yearValues = allProjectsData
    .map((project) => {
      const startYear = project.timeline?.start
      if (!startYear || startYear === 'Present') return undefined
      // Extract year from formats like "2024-12", "2021", etc.
      const match = startYear.match(/^\d{4}/)
      return match ? parseInt(match[0]) : undefined
    })
    .filter((year): year is number => typeof year === 'number')
    .sort((a, b) => a - b)
  const yearRange =
    yearValues.length > 0
      ? `${yearValues[0]}–${yearValues[yearValues.length - 1]}`
      : 'N/A'
  const topCategory = (() => {
    const counts: Record<string, number> = {}
    allProjectsData.forEach((p) => {
      if (!p.category) return
      counts[p.category] = (counts[p.category] || 0) + 1
    })
    const entries = Object.entries(counts)
    if (!entries.length) return 'N/A'
    return entries.sort((a, b) => b[1] - a[1])[0][0]
  })()

  // Simulating file metadata
  const getRandomSize = () => Math.floor(Math.random() * 1000) + 'KB'
  const getRandomDate = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const month = months[Math.floor(Math.random() * months.length)]
    const day = Math.floor(Math.random() * 28) + 1
    const time = `${Math.floor(Math.random() * 23)}:${Math.floor(Math.random() * 59)}`
    return `${month} ${day} ${time}`
  }

  return (
    <section id="projects" className="min-h-screen pt-12 md:pt-16 pb-20 font-mono relative overflow-hidden pointer-events-none">

      <div className="relative z-10 container mx-auto px-2 md:px-4 max-w-7xl pointer-events-auto">

        <div className="border border-gray-700 rounded-lg overflow-hidden shadow-2xl bg-black/95 backdrop-blur-sm">
          {/* Terminal Header */}
          <div className="w-full bg-[#1a1a1a] p-3 flex items-center gap-2 sticky top-0 z-20 border-b border-gray-800">
            <div className="flex gap-2 mr-4">
              <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400"></div>
            </div>
            <div className="flex-1 text-center text-xs md:text-sm text-gray-500 font-bold select-none">
              natlee@mainframe: ~/projects (zsh)
            </div>
          </div>

          <div className="min-h-[80vh] p-6 md:p-12 text-gray-300">

            {/* Command Prompt */}
            <div className="mb-12 border-b border-gray-900 pb-8 pt-2">
              <span className="text-secondary font-bold">natlee@mainframe</span>:<span className="text-blue-500">~/projects</span>$ ls -la --ranger-mode
            </div>

            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

              {/* Left Sidebar - Explorer */}
              <aside className="w-full lg:w-64 flex-shrink-0 bg-[#0a0a0a] border border-gray-800 p-4 h-fit sticky top-24 rounded-lg flex flex-col max-h-[calc(100vh-8rem)]">
                <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-4 pl-2 border-b border-gray-800 pb-2">
                  Explorer
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-1">
                  {/* Root */}
                  <div
                    onClick={() => setSelectedCategory('All')}
                    className={`cursor-pointer px-2 py-1.5 rounded flex items-center gap-2 transition-colors ${selectedCategory === 'All' ? 'bg-secondary/10 text-secondary' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}
                  >
                    <span className="opacity-70">📂</span>
                    <span className="font-bold">/</span>
                  </div>

                  {/* Categories */}
                  {categories.filter(c => c !== 'All').map(category => (
                    <div
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`cursor-pointer px-2 py-1.5 rounded flex items-center gap-2 transition-colors ml-4 border-l border-gray-800 ${selectedCategory === category ? 'bg-secondary/10 text-secondary' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}
                    >
                      <span className="opacity-70 text-xs">drwxr-xr-x</span>
                      <span className="truncate">{category}</span>
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div className="mt-8 pt-4 border-t border-gray-800 text-xs text-gray-600">
                  <div>{totalProjects} items</div>
                  <div>{filteredProjects.length - totalProjects === 0 ? '0' : totalProjects - filteredProjects.length} hidden</div>
                  <div className="mt-2 text-[10px] opacity-50">Free space: 12GB</div>
                </div>
              </aside>

              {/* Main Content */}
              <div className="flex-1 min-w-0">

                {/* Top Bar: Path & Search */}
                <div className="mb-2 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-[#0a0a0a] border border-gray-800 p-4 rounded-lg">
                  <div className="flex items-center text-gray-400 overflow-hidden whitespace-nowrap">
                    <span className="text-green-500 font-bold">natlee@mainframe</span>
                    <span className="text-white mx-1">:</span>
                    <span className="text-blue-400">~</span>
                    <span className="text-gray-600 mx-2">$</span>
                    <span>ls -l ./projects/ --ranger-mode</span>
                  </div>

                  <div className="flex items-center bg-black border border-gray-700 px-3 py-1.5 w-full md:w-auto min-w-[300px] focus-within:border-secondary transition-colors rounded">
                    <span className="text-gray-500 text-xs mr-2">find . -name</span>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder='"pattern"'
                      className="bg-transparent border-none outline-none flex-1 text-white placeholder-gray-800 font-mono text-sm"
                      autoComplete="off"
                    />
                  </div>
                </div>

                {/* Stats strip */}
                <div className="mb-4 text-[11px] text-gray-600 flex flex-wrap gap-x-4 gap-y-1 font-mono">
                  <span>total: <span className="text-gray-400">{totalProjects}</span></span>
                  <span>|</span>
                  <span>showing: <span className="text-gray-400">{filteredProjects.length}</span></span>
                  <span>|</span>
                  <span>years: <span className="text-gray-400">{yearRange}</span></span>
                  <span>|</span>
                  <span>top: <span className="text-secondary">{topCategory}</span></span>
                </div>

                {/* File Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProjects.map((project) => (
                    <Link href={`/projects/${project.id}`} key={project.id} className="block group relative">
                      <div className="bg-[#0a0a0a] border border-gray-800 h-64 flex flex-col relative overflow-hidden transition-all duration-300 hover:border-secondary shadow-lg hover:shadow-secondary/20 rounded-lg">

                        {/* Preview Image Background (Framebuffer Style) */}
                        {(project.images?.[0] || project.thumbnail) && (
                          <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500 grayscale group-hover:grayscale-0">
                            <Image
                              src={project.thumbnail || project.images[0]}
                              alt=""
                              fill
                              className="object-cover"
                            />
                            {/* Scanline Overlay */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,18,18,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%] pointer-events-none"></div>
                          </div>
                        )}

                        {/* Content Overlay */}
                        <div className="relative z-10 w-full h-full p-5 flex flex-col transition-colors group-hover:bg-black/40">

                          {/* File Header */}
                          <div className="flex justify-between items-start mb-4 text-[10px] text-gray-500 font-mono border-b border-gray-800/50 pb-2">
                            <span>-rwxr-xr-x</span>
                            <span className="group-hover:text-secondary">{getRandomSize()}</span>
                          </div>

                          {/* Title & Icon */}
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-2xl opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all drop-shadow-md">
                              {project.category.includes('Web') ? '🌐' :
                                project.category.includes('AI') || project.category.includes('Vision') ? '🧠' :
                                  project.category.includes('Tool') ? '🛠️' : '📁'}
                            </span>
                            <h3 className="text-base font-bold text-gray-300 group-hover:text-white break-all drop-shadow-md group-hover:text-secondary transition-colors">
                              {project.title.toLowerCase().replace(/\s+/g, '_')}
                              {project.language ? `.${project.language.toLowerCase()}` : '.sh'}
                            </h3>
                          </div>

                          {/* Description Preview */}
                          <p className="text-gray-500 text-xs line-clamp-3 mb-4 group-hover:text-gray-300 transition-colors flex-grow leading-relaxed">
                            {project.description}
                          </p>

                          {/* Footer Meta */}
                          <div className="mt-auto border-t border-gray-800/50 pt-2 flex justify-between items-center text-[10px] text-gray-600 group-hover:text-gray-400">
                            <span>natlee:staff</span>
                            <span>{getRandomDate()}</span>
                          </div>
                        </div>

                      </div>
                    </Link>
                  ))}
                </div>

                {filteredProjects.length === 0 && (
                  <div className="text-gray-500 mt-12 bg-red-900/10 border border-red-900/30 p-4 rounded inline-block">
                    <span className="text-red-500 font-bold">Error:</span> zsh: no matches found: {searchTerm}
                  </div>
                )}

              </div>
            </div>

            <div className="mt-12 pt-6 border-t border-gray-800 text-gray-600 text-xs text-center flex justify-between items-center px-4">
              <span>TOTAL PROJECTS: {totalProjects}</span>
              <span className="animate-pulse">_</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
