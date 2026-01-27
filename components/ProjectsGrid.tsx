'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { allProjectsData, getAllCategories } from '@/data/projects'
import Icon from './Icon'

// Language Color Mapping
const getLanguageColor = (language?: string): string => {
  if (!language) return '#6b7280'

  const languageColors: Record<string, string> = {
    'python': '#3776ab',
    'javascript': '#f1e05a',
    'typescript': '#2b7489',
    'shell': '#89e051',
    'html': '#e34c26',
    'css': '#563d7c',
    'java': '#b07219',
    'cpp': '#f34b7d',
    'go': '#00add8',
    'rust': '#dea584',
    'php': '#4f5d95',
    'c': '#a8b9cc',
    'csharp': '#239120',
    'ruby': '#701516',
    'swift': '#fa7343',
    'kotlin': '#7f52ff',
    'scala': '#dc322f',
    'r': '#276dc3',
    'matlab': '#e16737',
    'perl': '#39457e',
    'lua': '#000080',
    'dart': '#0175c2',
    'elixir': '#4e2a8e',
    'clojure': '#5881d8',
    'haskell': '#5d4f85',
    'erlang': '#a90533',
    'ocaml': '#3be133',
    'fsharp': '#378bda',
    'julia': '#9558b2',
    'nim': '#ffc200',
    'crystal': '#000100',
    'zig': '#f7a41d',
    'v': '#4f87c4',
    'd': '#ba595e',
    'ada': '#02f88c',
    'fortran': '#4d41b1',
    'cobol': '#005ca9',
    'pascal': '#e3f171',
    'prolog': '#74283c',
    'lisp': '#3fb68b',
    'scheme': '#1e4a72',
    'smalltalk': '#596706',
    'forth': '#341708',
    'assembly': '#6e4c13',
    'vhdl': '#adb2cb',
    'verilog': '#b2b7f8',
    'tcl': '#e4cc98',
    'awk': '#c30e24',
    'sed': '#64b970',
    'bash': '#4eaa25',
    'powershell': '#012456',
    'batch': '#c1c1c1',
    'vim': '#019733',
    'emacs': '#7f5ab6',
    'tex': '#3d6117',
    'markdown': '#083fa1',
    'yaml': '#cb171e',
    'json': '#000000',
    'xml': '#005f9f',
    'sql': '#336791',
    'dockerfile': '#384d54',
    'makefile': '#427819',
    'cmake': '#064f8c',
    'gradle': '#02303a',
    'maven': '#c71a36',
    'ant': '#a81c7d',
    'sbt': '#db4d3f',
    'leiningen': '#202020',
    'cargo': '#000000',
    'npm': '#cb3837',
    'yarn': '#2c8ebb',
    'pip': '#3776ab',
    'gem': '#e9573f',
    'composer': '#885630',
    'nuget': '#004880',
    'cpan': '#0298c3',
    'cabal': '#4655c2',
    'stack': '#f5f5f5',
    'mix': '#4e2a8e',
    'rebar': '#ff6b35',
    'hex': '#6e4a7e',
    'pub': '#0175c2',
    'conan': '#222222',
    'vcpkg': '#0052cc',
    'hunter': '#ff6b35',
    'buckaroo': '#ff6b35',
    'buck': '#ff6b35',
    'bazel': '#43a047',
    'pants': '#ff6b35',
    'scons': '#ff6b35',
    'waf': '#ff6b35',
    'ninja': '#ff6b35',
    'meson': '#0077c7',
    'premake': '#ff6b35',
    'qmake': '#ff6b35',
    'autotools': '#ff6b35'
  }

  return languageColors[language.toLowerCase()] || '#6b7280'
}

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
                Projects
              </span>
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-secondary to-accent mx-auto mb-8 rounded-full"></div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              A collection of my projects, tools, and experiments.
              From AI/ML applications to web development tools.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="mb-12 space-y-6">
            {/* First Row: Search and Project Count */}
            <div className="flex flex-col items-center gap-4">
              {/* Search Box */}
              <div className="relative w-full max-w-2xl">
                <Icon name="search" className="absolute left-3 top-1/2 transform -translate-y-1/2 translate-y-0.5 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-dark-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                />
              </div>

              {/* Project Count */}
              <div className="text-center">
                <span className="text-sm text-gray-400">
                  Showing <span className="text-secondary font-bold">{filteredProjects.length}</span> of <span className="text-secondary font-bold">{allProjectsData.length}</span> projects
                </span>
              </div>
            </div>

            {/* Second Row: All Category Filters */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedCategory === category
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
      className={`group bg-dark-800 rounded-xl border border-gray-700 overflow-hidden hover:border-secondary/50 transition-all duration-500 hover:transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-secondary/10 ${featured ? 'ring-2 ring-secondary/20' : ''
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
            className="w-full h-full object-cover object-center project-card-image"
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
          <div className="relative group overflow-hidden rounded-full">
            <span className={`relative z-10 px-3 py-1.5 rounded-full text-xs font-bold border ${project.status === 'Completed'
              ? 'bg-gradient-to-r from-accent to-warm-500 text-white border-accent/30'
              : project.status === 'In Progress'
                ? 'bg-gradient-to-r from-secondary to-neon-red text-white border-secondary/30'
                : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white border-gray-400/30'
              }`}>
              {project.status}
            </span>
            {/* 移除模糊效果，避免與卡片變換衝突 */}
          </div>
        </div>

        {/* Featured & Open Source Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {featured && (
            <div className="relative group overflow-hidden rounded-full">
              <span className="relative z-10 px-3 py-1.5 bg-gradient-to-r from-accent to-warm-500 text-white text-xs font-bold rounded-full border border-accent/30">
                FEATURED
              </span>
              {/* 移除模糊效果，避免與卡片變換衝突 */}
            </div>
          )}
          {project.opensource && (
            <div className="relative group overflow-hidden rounded-full">
              <span className="relative z-10 px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-full border border-green-400/30">
                OPEN SOURCE
              </span>
              {/* 移除模糊效果，避免與卡片變換衝突 */}
            </div>
          )}
        </div>

        {/* Category Icon & Language Badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-3">
          {/* Category Icon */}
          <div className="group relative overflow-hidden rounded-full">
            <div className="w-12 h-12 bg-gradient-to-br from-dark-900/90 to-dark-800/90 rounded-full flex items-center justify-center border border-secondary/40 backdrop-blur-sm">
              <Icon name={project.category} className="text-secondary group-hover:text-accent transition-colors duration-300" size={24} />
            </div>
            {/* 移除模糊效果，避免與卡片變換衝突 */}
          </div>

          {/* Language Badge */}
          {project.language && (
            <div className="relative group overflow-hidden rounded-full">
              <span
                className="relative z-10 px-3 py-1.5 text-white text-xs font-bold rounded-full border backdrop-blur-sm"
                style={{
                  backgroundColor: getLanguageColor(project.language),
                  borderColor: `${getLanguageColor(project.language)}40`
                }}
              >
                {project.language.toUpperCase()}
              </span>
              {/* 移除模糊效果，避免與卡片變換衝突 */}
            </div>
          )}
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
