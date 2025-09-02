'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { allProjectsData, getAllCategories } from '@/data/projects'
import Icon from './Icon'

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

  const featuredProjects = filteredProjects.filter(project => project.featured)
  const otherProjects = filteredProjects.filter(project => !project.featured)

  return (
    <section className="py-20 bg-dark-900 min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-5"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-accent/5"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-secondary via-accent to-neon-red bg-clip-text text-transparent">
                Open Source Projects
              </span>
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-secondary to-accent mx-auto mb-8 rounded-full"></div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              A collection of my open source projects, tools, and experiments. 
              From AI/ML applications to web development tools.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="mb-12 space-y-6">
            {/* First Row: Search with Project Count */}
            <div className="flex justify-center">
              {/* Search with Project Count */}
              <div className="relative w-full max-w-2xl">
                <Icon name="search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-32 py-3 bg-dark-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                />
                
                {/* Project Count inside search box */}
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <span className="text-sm text-gray-400">
                    <span className="text-secondary font-bold">{filteredProjects.length}</span> projects
                  </span>
                </div>
              </div>
            </div>

            {/* Second Row: All Category Filters */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-secondary text-white shadow-lg shadow-secondary/20'
                      : 'bg-dark-800 text-gray-300 hover:bg-dark-700 border border-gray-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Featured Projects */}
          {featuredProjects.length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                <Icon name="star" className="text-accent" size={32} />
                Featured Projects
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredProjects.map((project, index) => (
                  <ProjectCard key={project.id} project={project} featured={true} index={index} />
                ))}
              </div>
            </div>
          )}

          {/* All Projects Grid */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
              <Icon name="code" className="text-secondary" size={32} />
              All Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} featured={project.featured} index={index} />
              ))}
            </div>
          </div>

          {/* No Results */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-16">
              <Icon name="search" className="text-gray-600 mx-auto mb-4" size={64} />
              <h3 className="text-2xl font-bold text-gray-400 mb-2">No projects found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ project, featured, index }: { project: any, featured: boolean, index: number }) {
  const [imageError, setImageError] = useState(false)

  return (
    <div
      className={`group bg-dark-800 rounded-xl border border-gray-700 overflow-hidden hover:border-secondary/50 transition-all duration-500 hover:transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-secondary/10 ${
        featured ? 'ring-2 ring-secondary/20' : ''
      }`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Project Image */}
      <div className="relative h-48 overflow-hidden bg-dark-700">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-accent/10"></div>
        {project.images.length > 0 && !imageError ? (
          <img
            src={project.images[0]}
            alt={project.title}
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              const parent = target.parentElement
              if (parent) {
                parent.innerHTML = `
                  <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary/10 to-accent/10">
                    <div class="text-center">
                      <svg class="w-16 h-16 text-secondary/40 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clip-rule="evenodd" />
                      </svg>
                      <p class="text-sm text-gray-400 font-mono">${project.title}</p>
                    </div>
                  </div>
                `
              }
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary/10 to-accent/10">
            <div className="text-center">
              <Icon name="code" className="text-secondary/40 mx-auto mb-2" size={64} />
              <p className="text-sm text-gray-400 font-mono">{project.title}</p>
            </div>
          </div>
        )}
        
        {/* Overlay - 大幅減少遮罩透明度 */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/50 via-dark-900/10 to-transparent"></div>

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <div className="relative group">
            <span className={`relative z-10 px-3 py-1.5 rounded-full text-xs font-bold border ${
              project.status === 'Completed' 
                ? 'bg-gradient-to-r from-accent to-warm-500 text-white border-accent/30' 
                : project.status === 'In Progress' 
                  ? 'bg-gradient-to-r from-secondary to-neon-red text-white border-secondary/30'
                  : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white border-gray-400/30'
            }`}>
              {project.status}
            </span>
            <div className={`absolute inset-0 rounded-full blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-300 -z-10 ${
              project.status === 'Completed' 
                ? 'bg-gradient-to-r from-accent/30 to-warm-500/30' 
                : project.status === 'In Progress' 
                  ? 'bg-gradient-to-r from-secondary/30 to-neon-red/30'
                  : 'bg-gradient-to-r from-gray-500/30 to-gray-600/30'
            }`}></div>
          </div>
        </div>

        {/* Featured & Open Source Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {featured && (
            <div className="relative group">
              <span className="relative z-10 px-3 py-1.5 bg-gradient-to-r from-accent to-warm-500 text-white text-xs font-bold rounded-full border border-accent/30">
                FEATURED
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-accent/30 to-warm-500/30 rounded-full blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </div>
          )}
          {project.opensource && (
            <div className="relative group">
              <span className="relative z-10 px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-full border border-green-400/30">
                OPEN SOURCE
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/30 to-emerald-500/30 rounded-full blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </div>
          )}
        </div>

        {/* Category Icon */}
        <div className="absolute bottom-3 left-3">
          <div className="group relative">
            <div className="w-12 h-12 bg-gradient-to-br from-dark-900/90 to-dark-800/90 rounded-full flex items-center justify-center border border-secondary/40 backdrop-blur-sm">
              <Icon name={project.category} className="text-secondary group-hover:text-accent transition-colors duration-300" size={24} />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-full blur-md opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>
      </div>

      {/* Project Content */}
      <div className="p-6">
        {/* Category */}
        <div className="mb-3">
          <span className="text-sm text-secondary font-mono font-medium">
            {project.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-secondary transition-colors">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
          {project.description}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Link
            href={`/projects/${project.id}`}
            className="inline-flex items-center gap-2 text-secondary hover:text-accent font-bold transition-colors group text-sm"
          >
            Learn More
            <Icon name="arrow-right" className="group-hover:translate-x-1 transition-transform" size={16} />
          </Link>

          <div className="flex items-center gap-2">
            {project.links?.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-gray-400 hover:text-white transition-colors hover:scale-110"
                title="View Code"
              >
                <Icon name="github" className="" size={14} />
              </a>
            )}
            {project.links?.demo && (
              <a
                href={project.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-gray-400 hover:text-secondary transition-colors hover:scale-110"
                title="Live Demo"
              >
                <Icon name="external-link" className="" size={14} />
              </a>
            )}
            {project.images && project.images.length > 1 && (
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Icon name="image" className="" size={12} />
                +{project.images.length - 1}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
