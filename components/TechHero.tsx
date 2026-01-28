'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { personalInfo } from '@/data/personal'
import Icon from './Icon'

export default function TechHero() {
  const [text, setText] = useState('')
  const fullText = `> Initializing system...\n> Loading user profile: ${personalInfo.name}\n> Role: ${personalInfo.title}\n> Status: Online`
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    let index = 0
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setText(prev => prev + fullText.charAt(index))
        index++
      } else {
        clearInterval(timer)
      }
    }, 30)

    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 530)

    return () => {
      clearInterval(timer)
      clearInterval(cursorTimer)
    }
  }, [fullText])

  return (
    <section className="relative overflow-hidden font-mono text-secondary py-12 md:py-20">

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4">

        <div className="grid md:grid-cols-3 gap-12 items-center">

          {/* Left Col: Text */}
          <div className="md:col-span-2 order-2 md:order-1">
            <div className="whitespace-pre-wrap text-lg md:text-xl lg:text-2xl leading-relaxed mb-6 min-h-[160px] text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]">
              {text}
              <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} inline-block w-3 h-6 bg-green-400 align-middle ml-1 shadow-[0_0_10px_#4ade80]`}></span>
            </div>

            <div className="animate-fade-in space-y-6" style={{ animationDelay: '1.5s' }}>
              <div className="space-y-4">
                <p className="text-base md:text-lg border-l-2 border-secondary/50 pl-4 py-1 text-gray-300 leading-relaxed max-w-2xl">
                  {personalInfo.bio}
                </p>

                {/* Hashtag Social Links */}
                <div className="flex flex-wrap gap-4 pl-4 pt-2">
                  {personalInfo.socialLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors text-sm font-bold"
                    >
                      <span className="text-blue-600 group-hover:text-blue-400">#</span>
                      <span className="underline decoration-blue-500/30 group-hover:decoration-blue-400">{link.name}</span>
                    </a>
                  ))}
                  <a
                    href={`mailto:${personalInfo.email}`}
                    className="group flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors text-sm font-bold"
                  >
                    <span className="text-blue-600 group-hover:text-blue-400">#</span>
                    <span className="underline decoration-blue-500/30 group-hover:decoration-blue-400">Email</span>
                  </a>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="/projects"
                  className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-bold text-black transition-all duration-300 bg-secondary rounded hover:bg-orange-600 focus:outline-none ring-offset-2 focus:ring-2 ring-orange-400"
                >
                  <span className="mr-2 text-lg">&gt;</span>
                  ./view_projects.sh
                </Link>

                <Link
                  href="/about"
                  className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-bold text-secondary transition-all duration-300 bg-transparent border-2 border-secondary rounded hover:bg-secondary/10 focus:outline-none ring-offset-2 focus:ring-2 ring-orange-400"
                >
                  <span className="mr-2 text-lg">?</span>
                  man about_me
                </Link>
              </div>
            </div>
          </div>

          {/* Right Col: Glitch Image */}
          <div className="md:col-span-1 order-1 md:order-2 flex justify-center md:justify-end">
            <div className="relative w-48 h-48 md:w-72 md:h-72 group cursor-crosshair">

              {/* Spinning/Pulse Aura */}
              <div className="absolute inset-0 bg-secondary/10 rounded-full blur-2xl animate-pulse"></div>

              {/* Main Container */}
              <div className="relative w-full h-full overflow-hidden rounded-full border-2 border-dashed border-secondary/30 shadow-[0_0_20px_rgba(255,165,0,0.2)]">

                {/* TV Static Noise Overlay - Always On (Subtle) */}
                <div className="absolute inset-0 z-10 opacity-20 pointer-events-none mix-blend-overlay animate-noise"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    filter: 'contrast(120%) brightness(120%)'
                  }}
                ></div>

                {/* Profile Image */}
                <Image
                  src={personalInfo.avatar}
                  alt="Nat Lee"
                  fill
                  className="object-cover relative z-0 transition-all duration-100 group-hover:scale-105 group-hover:grayscale group-hover:contrast-150"
                  priority
                />

                {/* Glitch Layers (Active on Hover) */}
                <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-75 mix-blend-hard-light pointer-events-none">
                  <div className="absolute inset-0 bg-red-500/20 translate-x-1 animate-glitch-1"></div>
                  <div className="absolute inset-0 bg-blue-500/20 -translate-x-1 animate-glitch-2"></div>
                </div>

                {/* Scanlines */}
                <div className="absolute inset-0 z-30 pointer-events-none bg-[linear-gradient(rgba(18,18,18,0)_50%,rgba(0,0,0,0.4)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,6px_100%] opacity-50"></div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
