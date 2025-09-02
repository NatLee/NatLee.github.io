'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ProjectDetail as ProjectDetailType } from '@/data/projects'

import Icon from './Icon'

interface Props {
  project: ProjectDetailType
}

export default function ProjectDetail({ project }: Props) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'text-electric-500 bg-electric-500/10 border-electric-500/20'
      case 'In Progress': return 'text-secondary bg-secondary/10 border-secondary/20'
      case 'Archived': return 'text-gray-400 bg-gray-400/10 border-gray-400/20'
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'AI/ML': return 'brain'
      case 'Computer Vision': return 'eye'
      case 'Web Development': return 'code'
      case 'Data Science': return 'chart'
      case 'Backend': return 'server'
      case 'Open Source': return 'github'
      default: return 'default'
    }
  }

  return (
    <div className="bg-dark-900 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-dark-900 via-dark-800 to-dark-900">
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Back Button */}
            <div className="mb-8">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-secondary hover:text-neon-blue transition-colors"
              >
                <Icon name="arrow-left" className="w-5 h-5" />
                Back to Projects
              </Link>
            </div>

            {/* Project Header */}
            <div className="mb-8">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Icon name={getCategoryIcon(project.category)} className="w-6 h-6 text-secondary" />
                  <span className="text-secondary font-medium">{project.category}</span>
                </div>
                <div className={`px-4 py-2 rounded-full border text-sm font-medium ${getStatusColor(project.status)}`}>
                  {project.status}
                </div>
                {project.featured && (
                  <div className="px-4 py-2 rounded-full bg-neon-pink/10 border border-neon-pink/20 text-neon-pink text-sm font-medium">
                    Featured
                  </div>
                )}
              </div>

              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                <span className="bg-gradient-to-r from-white via-secondary to-accent bg-clip-text text-transparent">
                  {project.title}
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-6">{project.subtitle}</p>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Project Links */}
            <div className="flex flex-wrap justify-center gap-4">
              {project.links.demo && (
                <a
                  href={project.links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-dark-900 px-6 py-3 rounded-full font-medium transition-all hover:scale-105"
                >
                  <Icon name="external-link" className="w-5 h-5" />
                  Live Demo
                </a>
              )}
              {project.links.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-dark-700 hover:bg-dark-600 text-white px-6 py-3 rounded-full font-medium transition-all border border-dark-500 hover:border-secondary/50"
                >
                  <Icon name="github" className="w-5 h-5" />
                  View Code
                </a>
              )}
              {project.links.article && (
                <a
                  href={project.links.article}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-dark-700 hover:bg-dark-600 text-white px-6 py-3 rounded-full font-medium transition-all border border-dark-500 hover:border-secondary/50"
                >
                  <Icon name="blog" className="w-5 h-5" />
                  Read Article
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Project Images Slider */}
      {project.images && project.images.length > 0 && (
        <section className="py-16 bg-dark-800">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Project Gallery</h2>
              
              <div className="flex justify-center">
                <ImageSlider images={project.images} title={project.title} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Project Details */}
      <section className="py-16 bg-dark-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-12">
                {/* Overview */}
                <div>
                  <h2 className="text-3xl font-bold text-white mb-6">Overview</h2>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                      {project.longDescription}
                    </p>
                  </div>
                </div>

                {/* Features */}
                {project.features && project.features.length > 0 && (
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-6">Key Features</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      {project.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-3 p-4 bg-dark-800 rounded-lg border border-dark-600">
                          <Icon name="check" className="w-5 h-5 text-electric-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Challenges & Solutions */}
                {project.challenges && project.solutions && (
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-6">Challenges</h3>
                      <div className="space-y-4">
                        {project.challenges.map((challenge, index) => (
                          <div key={index} className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                            <p className="text-gray-300">{challenge}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-6">Solutions</h3>
                      <div className="space-y-4">
                        {project.solutions.map((solution, index) => (
                          <div key={index} className="p-4 bg-electric-500/10 border border-electric-500/20 rounded-lg">
                            <p className="text-gray-300">{solution}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Results */}
                {project.results && project.results.length > 0 && (
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-6">Results & Impact</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      {project.results.map((result, index) => (
                        <div key={index} className="p-4 bg-secondary/10 border border-secondary/20 rounded-lg">
                          <div className="flex items-start gap-3">
                            <Icon name="chart" className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                            <span className="text-gray-300">{result}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                {/* Project Info */}
                <div className="bg-dark-800 rounded-lg p-6 border border-dark-600">
                  <h3 className="text-xl font-bold text-white mb-4">Project Info</h3>
                  <div className="space-y-4">
                    <div>
                      <span className="text-gray-400 text-sm">Role</span>
                      <p className="text-white font-medium">{project.role}</p>
                    </div>
                    {project.company && (
                      <div>
                        <span className="text-gray-400 text-sm">Company</span>
                        <p className="text-white font-medium">{project.company}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-400 text-sm">Timeline</span>
                      <p className="text-white font-medium">
                        {project.timeline.start} {project.timeline.end ? `- ${project.timeline.end}` : '- Present'}
                      </p>
                      <p className="text-gray-400 text-sm">{project.timeline.duration}</p>
                    </div>
                    {project.team && project.team.length > 0 && (
                      <div>
                        <span className="text-gray-400 text-sm">Team</span>
                        <p className="text-white font-medium">{project.team.join(', ')}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Technologies */}
                <div className="bg-dark-800 rounded-lg p-6 border border-dark-600">
                  <h3 className="text-xl font-bold text-white mb-4">Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-dark-700 text-gray-300 text-sm rounded-full border border-dark-500 hover:border-secondary/50 transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Links */}
                <div className="bg-dark-800 rounded-lg p-6 border border-dark-600">
                  <h3 className="text-xl font-bold text-white mb-4">Links</h3>
                  <div className="space-y-3">
                    {Object.entries(project.links).map(([key, url]) => (
                      <a
                        key={key}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-gray-300 hover:text-secondary transition-colors"
                      >
                        <Icon name={key === 'github' ? 'github' : key === 'demo' ? 'external-link' : 'blog'} className="w-5 h-5" />
                        <span className="capitalize">{key}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function ImageSlider({ images, title }: { images: string[], title: string }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Main Image - 更大尺寸 */}
      <div className="relative rounded-xl overflow-hidden bg-dark-700 shadow-2xl" style={{ aspectRatio: '16/10' }}>
        {images.length > 0 ? (
          <img
            src={images[currentIndex]}
            alt={`${title} image ${currentIndex + 1}`}
            className="w-full h-full object-contain bg-dark-700 transition-opacity duration-300"
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
                      <p class="text-sm text-gray-400 font-mono">${title}</p>
                    </div>
                  </div>
                `
              }
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary/10 to-accent/10">
            <div className="text-center">
              <Icon name="code" className="w-16 h-16 text-secondary/40 mx-auto mb-2" />
              <p className="text-sm text-gray-400 font-mono">{title}</p>
            </div>
          </div>
        )}
        
        {/* 漸變邊框效果 */}
        <div className="absolute inset-0 rounded-xl border-2 border-gradient-to-r from-secondary/30 via-accent/30 to-secondary/30"></div>
        
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-dark-900/90 hover:bg-dark-900 text-white p-4 rounded-full transition-all duration-300 hover:scale-110 shadow-xl"
            >
              <Icon name="arrow-left" className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-dark-900/90 hover:bg-dark-900 text-white p-4 rounded-full transition-all duration-300 hover:scale-110 shadow-xl"
            >
              <Icon name="arrow-right" className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-6 right-6 bg-dark-900/90 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="flex justify-center gap-4 mt-8 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`relative rounded-lg overflow-hidden border-2 transition-all duration-300 flex-shrink-0 ${
                index === currentIndex 
                  ? 'border-secondary shadow-lg shadow-secondary/20 w-24 h-16' 
                  : 'border-gray-600 hover:border-gray-400 w-20 h-14'
              }`}
            >
              <img
                src={image}
                alt={`${title} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  const parent = target.parentElement
                  if (parent) {
                    parent.innerHTML = `
                      <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary/10 to-accent/10">
                        <div class="text-center">
                          <svg class="w-8 h-8 text-secondary/40 mx-auto mb-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clip-rule="evenodd" />
                          </svg>
                          <p class="text-xs text-gray-400 font-mono">${title}</p>
                        </div>
                      </div>
                    `
                  }
                }}
              />
              {/* 選中指示器 */}
              {index === currentIndex && (
                <div className="absolute inset-0 bg-secondary/20 flex items-center justify-center">
                  <div className="w-3 h-3 bg-secondary rounded-full"></div>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
