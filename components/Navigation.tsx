'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [time, setTime] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const updateTime = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  const navItems = [
    { id: '1', label: '/home', href: '/' },
    { id: '2', label: '/about', href: '/about' },
    { id: '3', label: '/experience', href: '/experience' },
    { id: '4', label: '/projects', href: '/projects' }
  ]

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  // Hydration mismatch avoidance
  if (!mounted) return <nav className="fixed top-0 w-full h-12 bg-black border-b border-gray-800 z-50"></nav>

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-gray-800 font-mono text-xs uppercase select-none pointer-events-auto">
      <div className="w-full flex items-center justify-between h-12 px-2 md:px-0">

        {/* Left: System Status */}
        <div className="flex items-center h-full">
          <div className="hidden md:flex items-center h-full px-4 bg-gray-900 border-r border-gray-800 text-green-500 font-bold gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            NATLEE::ONLINE
          </div>
          <div className="flex items-center h-full px-4 border-r border-gray-800 font-bold text-white bg-black">
            Nat Lee
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex h-full">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`
                    h-full flex items-center px-6 border-r border-gray-900 transition-all
                    ${isActive(item.href)
                    ? 'bg-secondary text-black font-bold'
                    : 'text-gray-500 hover:text-white hover:bg-gray-900'}
                  `}
              >
                <span className="opacity-50 mr-2">{isActive(item.href) ? '>' : ''}</span>
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex items-center gap-2 text-secondary px-2"
          >
            <span>{isMobileMenuOpen ? '[CLOSE]' : '[MENU]'}</span>

          </button>
        </div>

        {/* Right: Metrics */}
        <div className="flex items-center h-full gap-4 px-4 text-gray-600">
          <div className="hidden lg:flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="text-gray-700">CPU:</span>
              <span className="text-gray-400">12%</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="text-gray-700">MEM:</span>
              <span className="text-gray-400">45%</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="text-gray-700">NET:</span>
              <span className="text-green-900">SECURE</span>
            </span>
          </div>

          <div className="flex items-center border-l border-gray-800 pl-4 h-full">
            <span className="text-secondary font-bold">{time}</span>
          </div>
        </div>

      </div>

      {/* Mobile Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black border-b border-gray-800">
          {navItems.map(item => (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`
                  block p-4 border-b border-gray-900
                  ${isActive(item.href) ? 'text-secondary bg-gray-900/50' : 'text-gray-400'}
                `}
            >
              <span className="mr-2">{item.id}.</span>
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}