'use client'

import React from 'react'
import Link from 'next/link'
import { getFeaturedProjects } from '@/data/projects'
import Icon from './Icon'

export default function FeaturedProjects() {
  const featuredProjects = getFeaturedProjects()

  return (
    <section className="py-20 bg-dark-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-secondary via-neon-red to-accent bg-clip-text text-transparent">
                Featured Projects
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Explore some of my most impactful projects spanning AI/ML, computer vision, 
              and large-scale system development
            </p>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {featuredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>

          {/* View All Projects Button */}
          <div className="text-center">
            <Link
              href="/projects"
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-secondary to-accent hover:from-accent hover:to-secondary text-dark-900 px-8 py-4 rounded-full text-lg font-bold transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-secondary/25"
            >
              View All Projects
              <Icon name="arrow-right" className="group-hover:translate-x-1 transition-transform" size={24} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ project, index }: { project: any, index: number }) {


  return (
    <div 
      className="group bg-dark-800 rounded-2xl overflow-hidden border border-dark-600 hover:border-secondary/50 transition-all duration-500 hover:transform hover:-translate-y-4 hover:shadow-2xl hover:shadow-secondary/20 animate-slide-up"
      style={{ animationDelay: `${index * 0.2}s` }}
    >
      {/* Project Image */}
      <div className="relative h-64 overflow-hidden bg-dark-700">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-accent/10"></div>
        {project.images && project.images.length > 0 ? (
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
        <div className="absolute top-6 right-6">
          <span className={`px-3 py-1 rounded-full text-sm font-bold ${
            project.status === 'Completed' 
              ? 'bg-accent text-white' 
              : project.status === 'In Progress' 
                ? 'bg-secondary text-white'
                : 'bg-gray-500 text-white'
          }`}>
            {project.status}
          </span>
        </div>

        {/* Category Icon */}
        <div className="absolute top-6 left-6">
          <div className="w-12 h-12 bg-dark-900/80 rounded-full flex items-center justify-center border border-secondary/30">
            <Icon name={project.category} className="text-secondary" size={24} />
          </div>
        </div>
      </div>

      {/* Project Content */}
      <div className="p-8">
        {/* Category and Featured */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-secondary font-mono font-medium">
            {project.category}
          </span>
          <span className="text-sm text-accent font-bold">
            FEATURED
          </span>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-secondary transition-colors">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-gray-300 leading-relaxed mb-6 line-clamp-3">
          {project.description}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Link
            href={`/projects/${project.id}`}
            className="inline-flex items-center gap-2 text-secondary hover:text-accent font-bold transition-colors group"
          >
            Learn More
            <Icon name="arrow-right" className="group-hover:translate-x-1 transition-transform" size={20} />
          </Link>

          <div className="flex items-center gap-3">
            {project.links?.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-white transition-colors hover:scale-110"
                title="View Code"
              >
                <Icon name="github" className="" size={16} />
              </a>
            )}
            {project.links?.demo && (
              <a
                href={project.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-secondary transition-colors hover:scale-110"
                title="Live Demo"
              >
                <Icon name="external-link" className="" size={16} />
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
