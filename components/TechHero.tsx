'use client'

import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { personalInfo } from '@/data/personal'
import Icon from './Icon'
import ScrollingTechStack from './ScrollingTechStack'


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
    <section className="relative min-h-screen flex items-center justify-center bg-dark-900 overflow-x-hidden">
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
      <div className="relative z-10 text-center w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pt-20 pb-8">
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
        <div className="w-full max-w-4xl mx-auto mb-8 sm:mb-10 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 leading-relaxed break-words hyphens-auto">
            {personalInfo.bio}
          </p>
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-6 mb-12 animate-fade-in" style={{ animationDelay: '1.2s' }}>
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

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-6 mb-12 animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <Link
            href="/projects"
            className="group bg-gradient-to-r from-secondary to-accent hover:from-accent hover:to-secondary text-dark-900 px-6 sm:px-10 py-4 sm:py-5 rounded-2xl text-base sm:text-lg font-bold transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-secondary/25 w-fit mx-auto sm:w-auto text-center relative overflow-hidden min-w-[200px]"
          >
            {/* Button glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            <span className="flex items-center justify-center gap-2 sm:gap-3 relative z-10">
              View My Work
              <Icon name="arrow-right" className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
          
          <Link
            href="/about"
            className="group bg-dark-700 hover:bg-dark-600 text-white px-6 sm:px-10 py-4 sm:py-5 rounded-2xl text-base sm:text-lg font-bold transition-all duration-300 border-2 border-dark-500 hover:border-secondary/50 hover:shadow-lg hover:shadow-secondary/10 w-fit mx-auto sm:w-auto text-center relative overflow-hidden min-w-[200px]"
          >
            {/* Button glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            <span className="flex items-center justify-center gap-2 sm:gap-3 relative z-10">
              Learn More
              <Icon name="chevron-down" className="w-5 h-5 sm:w-6 sm:h-6 rotate-90 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>

        {/* Scrolling Tech Stack */}
        <ScrollingTechStack />


      </div>
    </section>
  )
}
