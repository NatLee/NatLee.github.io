'use client'

import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { personalInfo } from '@/data/personal'
import Icon from './Icon'
import TechIcon from './TechIcon'

export default function TechHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Particle system for tech background
    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
      opacity: number
    }> = []

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particles.forEach((particle, index) => {
        particle.x += particle.vx
        particle.y += particle.vy

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(212, 116, 30, ${particle.opacity})`
        ctx.fill()

        // Draw connections
        particles.forEach((otherParticle, otherIndex) => {
          if (index !== otherIndex) {
            const dx = particle.x - otherParticle.x
            const dy = particle.y - otherParticle.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < 100) {
              ctx.beginPath()
              ctx.moveTo(particle.x, particle.y)
              ctx.lineTo(otherParticle.x, otherParticle.y)
              ctx.strokeStyle = `rgba(212, 116, 30, ${0.1 * (1 - distance / 100)})`
              ctx.stroke()
            }
          }
        })
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-dark-900 overflow-hidden">
      {/* Animated Background Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 opacity-30"
        style={{ pointerEvents: 'none' }}
      />

      {/* Artistic Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-20"></div>
      
      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 border-2 border-secondary/20 rotate-45 animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-accent/10 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 left-20 w-12 h-12 border border-accent/30 rotate-12 animate-float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute top-60 right-40 w-8 h-8 bg-secondary/20 rotate-45 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-60 right-10 w-14 h-14 border-2 border-accent/15 rounded-full animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-dark-900/80 via-transparent to-dark-900/80"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-900/50 to-dark-900"></div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-6xl mx-auto px-4 pt-20 pb-8">
        {/* Avatar with Tech Effects */}
        <div className="mb-12 relative inline-block mt-8">
          <div className="relative">
            {/* Glowing rings */}
            <div className="absolute inset-0 rounded-full border-2 border-secondary animate-spin" style={{ animationDuration: '20s' }}></div>
            <div className="absolute inset-2 rounded-full border border-accent animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}></div>
            
            {/* Avatar */}
            <div className="relative w-48 h-48 mx-auto">
              <Image
                src={personalInfo.avatar}
                alt={personalInfo.nameEn}
                width={192}
                height={192}
                className="rounded-full border-4 border-secondary/50 shadow-2xl shadow-secondary/20 hover:shadow-secondary/40 transition-all duration-500"
              />
              
              {/* Status indicator */}
              <div className="absolute -bottom-2 -right-2 bg-accent w-12 h-12 rounded-full border-4 border-dark-900 flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Title - Simplified */}
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 animate-slide-up">
            <span className="bg-gradient-to-r from-white via-secondary to-accent bg-clip-text text-transparent">
              {personalInfo.name}
            </span>
            <br />
            <div className="flex items-center justify-center gap-4 mt-4">
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-accent"></div>
              <span className="text-2xl md:text-3xl bg-gradient-to-r from-accent via-neon-red to-secondary bg-clip-text text-transparent font-light">
                {personalInfo.nameEn}
              </span>
              <div className="w-16 h-0.5 bg-gradient-to-r from-accent to-transparent"></div>
            </div>
          </h1>
          
          <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <p className="text-2xl md:text-3xl text-secondary font-light mb-2">
              {personalInfo.title.split(' & ')[0]}
            </p>
            <p className="text-xl md:text-2xl text-accent font-light">
              {personalInfo.title.split(' & ')[1]}
            </p>
          </div>
          
          {/* Artistic separator */}
          <div className="flex justify-center mb-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="w-32 h-1 bg-gradient-to-r from-secondary via-accent to-secondary rounded-full"></div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto mb-10 leading-relaxed animate-fade-in" style={{ animationDelay: '0.4s' }}>
          {personalInfo.bio}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-6 mb-12 animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <Link
            href="/projects"
            className="group bg-gradient-to-r from-secondary to-accent hover:from-accent hover:to-secondary text-dark-900 px-8 py-4 rounded-full text-lg font-bold transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-secondary/25"
          >
            <span className="flex items-center gap-3">
              View My Work
              <Icon name="arrow-right" className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
          
          <Link
            href="/about"
            className="group bg-dark-700 hover:bg-dark-600 text-white px-8 py-4 rounded-full text-lg font-bold transition-all duration-300 border-2 border-dark-500 hover:border-secondary/50 hover:shadow-lg hover:shadow-secondary/10"
          >
            <span className="flex items-center gap-3">
              Learn More
              <Icon name="chevron-down" className="w-6 h-6 rotate-90 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>

                {/* Tech Stack Showcase - Icon Grid */}
        <div className="mb-12 animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <h3 className="text-2xl font-bold text-white mb-8 text-center">Core Technologies</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { name: 'Python', color: 'from-yellow-400 to-blue-500' },
              { name: 'AI/ML', color: 'from-purple-400 to-pink-500' },
              { name: 'Django', color: 'from-green-400 to-emerald-500' },
              { name: 'React', color: 'from-blue-400 to-cyan-500' },
              { name: 'Docker', color: 'from-blue-500 to-indigo-500' },
              { name: 'AWS', color: 'from-orange-400 to-red-500' },
              { name: 'PostgreSQL', color: 'from-blue-600 to-purple-600' },
              { name: 'PyTorch', color: 'from-red-400 to-orange-500' }
            ].map((tech, index) => (
              <div
                key={tech.name}
                className="group relative bg-dark-800/80 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center hover:border-secondary/50 transition-all duration-300 hover:scale-105 animate-scale-in hover:shadow-xl hover:shadow-secondary/20"
                style={{ animationDelay: `${0.9 + index * 0.1}s` }}
              >
                {/* Icon with gradient background */}
                <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br ${tech.color} p-0.5`}>
                  <div className="w-full h-full bg-dark-800 rounded-xl flex items-center justify-center group-hover:bg-dark-700 transition-colors">
                    <TechIcon name={tech.name} className="text-white" size={32} />
                  </div>
                </div>
                
                {/* Tech name */}
                <h4 className="text-white font-semibold text-sm mb-2">{tech.name}</h4>
                
                {/* Decorative elements */}
                <div className="absolute inset-0 bg-gradient-to-r from-secondary/0 via-secondary/5 to-accent/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Corner accent */}
                <div className="absolute top-2 right-2 w-2 h-2 bg-gradient-to-br from-secondary to-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-6 mb-16 animate-fade-in" style={{ animationDelay: '1.2s' }}>
          {personalInfo.socialLinks.slice(0, 4).map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 bg-dark-800 rounded-full border border-dark-600 hover:border-secondary/50 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-secondary/20"
              title={link.description}
            >
              <Icon name={link.icon} className="w-6 h-6 text-gray-400 group-hover:text-secondary transition-colors" />
            </a>
          ))}
        </div>

        {/* Code-Style Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
          <div className="group cursor-pointer" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
            {/* Terminal-style container */}
            <div className="bg-dark-800/90 backdrop-blur-sm border border-gray-700 rounded-lg p-4 min-w-[280px] shadow-xl">
              {/* Terminal header */}
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-700">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <span className="text-gray-400 text-xs font-mono ml-2">terminal</span>
              </div>
              
              {/* Code-style content */}
              <div className="font-mono text-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-gray-500">$</span>
                  <span className="text-gray-300">./explore</span>
                  <span className="text-secondary">--interactive</span>
                </div>
                <div className="flex items-center gap-2 group-hover:text-secondary transition-colors">
                  <span className="text-gray-500">→</span>
                  <span className="text-gray-300 group-hover:text-secondary">scroll_to_explore()</span>
                  <div className="w-2 h-4 bg-secondary animate-pulse ml-1"></div>
                </div>
              </div>
              
              {/* Animated scroll arrows */}
              <div className="flex justify-center mt-3 pt-2 border-t border-gray-700">
                <div className="flex flex-col items-center">
                  <div className="text-secondary/60 group-hover:text-secondary transition-colors animate-bounce">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-secondary/40 group-hover:text-secondary/60 transition-colors animate-bounce" style={{ animationDelay: '0.2s' }}>
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
