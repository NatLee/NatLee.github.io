'use client'

import React from 'react'
import Icon from './Icon'

export default function QuickStats() {
  const stats = [
    {
      icon: 'code',
      value: '6+',
      label: 'Years Experience',
      description: 'Professional software development'
    },
    {
      icon: 'brain',
      value: '15+',
      label: 'AI/ML Projects',
      description: 'Machine learning implementations'
    },
    {
      icon: 'server',
      value: '50+',
      label: 'Backend APIs',
      description: 'Scalable system architectures'
    },
    {
      icon: 'github',
      value: '100+',
      label: 'Open Source',
      description: 'Community contributions'
    }
  ]

  return (
    <section className="py-20 bg-dark-800 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 via-transparent to-accent/5"></div>
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-10"></div>
      {/* Subtle Line Chart Concept */}
      <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" style={{ filter: 'drop-shadow(0 2px 8px rgba(239,68,68,0.08))' }}>
        <defs>
          <linearGradient id="statLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.35" />
          </linearGradient>
          <linearGradient id="statArea" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.10" />
          </linearGradient>
        </defs>

        {/* Primary line + soft area fill */}
        <path d="M0,65 L10,60 L20,62 L30,55 L40,58 L50,50 L60,54 L70,45 L80,48 L90,40 L100,44 L100,100 L0,100 Z" fill="url(#statArea)" />
        <path d="M0,65 L10,60 L20,62 L30,55 L40,58 L50,50 L60,54 L70,45 L80,48 L90,40 L100,44" fill="none" stroke="url(#statLine)" strokeWidth="1.5" />

        {/* Secondary faint guide line */}
        <path d="M0,78 L10,73 L20,75 L30,68 L40,71 L50,63 L60,67 L70,58 L80,61 L90,53 L100,56" fill="none" stroke="url(#statLine)" strokeWidth="1" opacity="0.35" />
      </svg>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                By the Numbers
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              A snapshot of my professional journey and technical achievements
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="group bg-dark-700 rounded-xl p-8 border border-dark-600 hover:border-secondary/50 transition-all duration-500 hover:transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-secondary/10 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Icon */}
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon name={stat.icon} className="w-8 h-8 text-secondary group-hover:text-accent transition-colors" />
                  </div>
                </div>

                {/* Value */}
                <div className="mb-4">
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <h3 className="text-xl font-semibold text-secondary group-hover:text-accent transition-colors">
                    {stat.label}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-gray-400 leading-relaxed">
                  {stat.description}
                </p>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 to-accent/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            ))}
          </div>

          {/* Tech Highlights */}
          <div className="mt-20 text-center">
            <div className="inline-block bg-dark-700 rounded-full px-8 py-4 border border-dark-600">
              <p className="text-gray-300 font-mono">
                <span className="text-secondary">&gt;</span> Specialized in{' '}
                <span className="text-accent font-semibold">AI/ML</span>,{' '}
                <span className="text-secondary font-semibold">Backend Systems</span>, and{' '}
                <span className="text-neon-blue font-semibold">Data Engineering</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
