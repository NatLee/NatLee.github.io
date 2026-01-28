'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Helper to generate smooth random fluctuations
function smoothRandom(current: number, min: number, max: number, maxDelta: number): number {
  const delta = (Math.random() - 0.5) * 2 * maxDelta
  const newValue = current + delta
  return Math.max(min, Math.min(max, newValue))
}

// Format uptime as HH:MM:SS
function formatUptime(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

export default function Navigation() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [time, setTime] = useState('')
  const [mounted, setMounted] = useState(false)
  const [cpuUsage, setCpuUsage] = useState(15)
  const [memUsage, setMemUsage] = useState(45)
  const [networkLatency, setNetworkLatency] = useState(12)
  const [uptime, setUptime] = useState(0)
  const [networkStatus, setNetworkStatus] = useState<'SECURE' | 'SYNC' | 'IDLE'>('SECURE')
  const [statusText, setStatusText] = useState('ONLINE')
  const cpuRef = useRef(15)
  const memRef = useRef(45)
  const latencyRef = useRef(12)

  useEffect(() => {
    setMounted(true)
    
    // Time update
    const updateTime = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    }
    updateTime()
    const timeInterval = setInterval(updateTime, 1000)

    // Uptime counter
    const uptimeInterval = setInterval(() => {
      setUptime(prev => prev + 1)
    }, 1000)

    // System stats simulation with smooth fluctuations
    const updateStats = () => {
      // Occasionally add "activity spike"
      const hasSpike = Math.random() < 0.1
      
      // CPU fluctuates more rapidly
      const cpuMax = hasSpike ? 65 : 35
      const cpuDelta = hasSpike ? 15 : 5
      cpuRef.current = smoothRandom(cpuRef.current, 3, cpuMax, cpuDelta)
      setCpuUsage(Math.round(cpuRef.current))
      
      // MEM is more stable, slower changes
      const memDelta = hasSpike ? 8 : 3
      memRef.current = smoothRandom(memRef.current, 25, 75, memDelta)
      setMemUsage(Math.round(memRef.current))

      // Network latency fluctuates
      latencyRef.current = smoothRandom(latencyRef.current, 5, 45, hasSpike ? 15 : 5)
      setNetworkLatency(Math.round(latencyRef.current))

      // Update status based on activity
      if (hasSpike) {
        setStatusText('BUSY')
        setNetworkStatus('SYNC')
      } else if (cpuRef.current < 10) {
        setStatusText('IDLE')
        setNetworkStatus('IDLE')
      } else {
        setStatusText('ONLINE')
        setNetworkStatus('SECURE')
      }
    }
    
    // Update stats every 2 seconds
    const statsInterval = setInterval(updateStats, 2000)

    return () => {
      clearInterval(timeInterval)
      clearInterval(statsInterval)
      clearInterval(uptimeInterval)
    }
  }, [])

  const navItems = [
    { id: '1', label: '/home', href: '/', icon: '~' },
    { id: '2', label: '/about', href: '/about', icon: '?' },
    { id: '3', label: '/experience', href: '/experience', icon: '▶' },
    { id: '4', label: '/projects', href: '/projects', icon: '◈' }
  ]

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  // Get status color
  const getStatusColor = () => {
    switch (statusText) {
      case 'BUSY': return 'text-yellow-400'
      case 'IDLE': return 'text-blue-400'
      default: return 'text-green-500'
    }
  }

  const getStatusDotColor = () => {
    switch (statusText) {
      case 'BUSY': return 'bg-yellow-400'
      case 'IDLE': return 'bg-blue-400'
      default: return 'bg-green-500'
    }
  }

  const getNetworkColor = () => {
    switch (networkStatus) {
      case 'SYNC': return 'text-yellow-500'
      case 'IDLE': return 'text-blue-500'
      default: return 'text-green-600'
    }
  }

  const getLatencyColor = () => {
    if (networkLatency > 35) return 'text-red-400'
    if (networkLatency > 20) return 'text-yellow-400'
    return 'text-green-500'
  }

  // Hydration mismatch avoidance
  if (!mounted) return <nav className="fixed top-0 w-full h-12 bg-black border-b border-gray-800 z-50"></nav>

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-gray-800 font-mono text-xs uppercase select-none pointer-events-auto">
      <div className="w-full flex items-center justify-between h-12 px-2 md:px-0">

        {/* Left: System Status */}
        <div className="flex items-center h-full">
          <div className={`hidden md:flex items-center h-full px-4 bg-gray-900 border-r border-gray-800 font-bold gap-2 transition-colors duration-300 ${getStatusColor()}`}>
            <span className={`w-2 h-2 rounded-full animate-pulse transition-colors duration-300 ${getStatusDotColor()}`}></span>
            <span className="hidden xl:inline">NATLEE::</span>
            <span className="inline-block w-[6ch] text-left">{statusText}</span>
          </div>
          
          {/* Uptime Display */}
          <div className="hidden xl:flex items-center h-full px-3 border-r border-gray-800 text-gray-600 gap-2">
            <span className="text-gray-700">UP:</span>
            <span className="tabular-nums text-gray-500">{formatUptime(uptime)}</span>
          </div>

          <div className="flex items-center h-full px-4 border-r border-gray-800 font-bold text-white bg-black">
            <span className="text-secondary mr-1">@</span>
            Nat Lee
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex h-full">
            {navItems.map((item, index) => (
              <Link
                key={item.id}
                href={item.href}
                className={`
                    group h-full flex items-center px-4 lg:px-6 border-r border-gray-900 transition-all duration-200 relative
                    ${isActive(item.href)
                    ? 'bg-secondary text-black font-bold'
                    : 'text-gray-500 hover:text-white hover:bg-gray-900'}
                  `}
              >
                {/* Active indicator bar */}
                {isActive(item.href) && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"></span>
                )}
                
                {/* Icon for active item */}
                <span className={`mr-2 transition-all duration-200 ${
                  isActive(item.href) 
                    ? 'opacity-100' 
                    : 'opacity-0 group-hover:opacity-50'
                }`}>
                  {isActive(item.href) ? '>' : item.icon}
                </span>
                
                {item.label}
                
                {/* Keyboard shortcut hint */}
                <span className={`ml-2 text-[10px] transition-opacity duration-200 ${
                  isActive(item.href)
                    ? 'opacity-50'
                    : 'opacity-0 group-hover:opacity-30'
                }`}>
                  [{index + 1}]
                </span>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex items-center gap-2 text-secondary px-2"
          >
            <span className={`transition-transform duration-200 ${isMobileMenuOpen ? 'rotate-90' : ''}`}>
              {isMobileMenuOpen ? '×' : '≡'}
            </span>
            <span className="text-[10px]">{isMobileMenuOpen ? 'CLOSE' : 'MENU'}</span>
          </button>
        </div>

        {/* Right: Metrics */}
        <div className="flex items-center h-full gap-2 lg:gap-4 px-2 lg:px-4 text-gray-600">
          <div className="hidden lg:flex items-center gap-3 xl:gap-4">
            {/* CPU */}
            <span className="flex items-center gap-1">
              <span className="text-gray-700">CPU:</span>
              <span className={`tabular-nums transition-colors duration-300 min-w-[3ch] ${
                cpuUsage > 50 ? 'text-red-400' : cpuUsage > 30 ? 'text-yellow-400' : 'text-gray-400'
              }`}>
                {cpuUsage}%
              </span>
            </span>
            
            {/* MEM */}
            <span className="flex items-center gap-1">
              <span className="text-gray-700">MEM:</span>
              <span className={`tabular-nums transition-colors duration-300 min-w-[3ch] ${
                memUsage > 70 ? 'text-red-400' : memUsage > 55 ? 'text-yellow-400' : 'text-gray-400'
              }`}>
                {memUsage}%
              </span>
            </span>
            
            {/* Network Status & Latency */}
            <span className="flex items-center gap-1">
              <span className="text-gray-700">NET:</span>
              <span className={`inline-block w-[6ch] transition-colors duration-300 ${getNetworkColor()}`}>
                {networkStatus}
              </span>
              <span className={`tabular-nums text-[10px] inline-block w-[5ch] text-right transition-colors duration-300 ${getLatencyColor()}`}>
                {networkLatency}ms
              </span>
            </span>
          </div>

          {/* Mobile: Compact stats */}
          <div className="flex lg:hidden items-center gap-2 text-[10px]">
            <span className={`w-1.5 h-1.5 rounded-full ${getStatusDotColor()}`}></span>
            <span className={`tabular-nums ${cpuUsage > 50 ? 'text-red-400' : 'text-gray-500'}`}>
              {cpuUsage}%
            </span>
          </div>

          {/* Time */}
          <div className="flex items-center border-l border-gray-800 pl-2 lg:pl-4 h-full gap-2">
            <span className="hidden sm:inline text-gray-700 text-[10px]">⏱</span>
            <span className="text-secondary font-bold tabular-nums">{time}</span>
          </div>
        </div>

      </div>

      {/* Mobile Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black border-b border-gray-800 animate-slideDown">
          {/* Mobile Stats Bar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-900 text-[10px] text-gray-600">
            <div className="flex items-center gap-3">
              <span>CPU: <span className={cpuUsage > 50 ? 'text-red-400' : 'text-gray-400'}>{cpuUsage}%</span></span>
              <span>MEM: <span className={memUsage > 70 ? 'text-red-400' : 'text-gray-400'}>{memUsage}%</span></span>
            </div>
            <span className={getNetworkColor()}>{networkStatus}</span>
          </div>
          
          {navItems.map((item, index) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`
                  flex items-center justify-between p-4 border-b border-gray-900 transition-colors
                  ${isActive(item.href) ? 'text-secondary bg-gray-900/50' : 'text-gray-400 active:bg-gray-900'}
                `}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-3">
                <span className="text-gray-600">{item.icon}</span>
                <span>{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {isActive(item.href) && (
                  <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                )}
                <span className="text-gray-700 text-[10px]">[{index + 1}]</span>
              </div>
            </Link>
          ))}
          
          {/* Uptime in mobile */}
          <div className="px-4 py-2 text-[10px] text-gray-700 flex justify-between">
            <span>SESSION UPTIME</span>
            <span className="tabular-nums text-gray-500">{formatUptime(uptime)}</span>
          </div>
        </div>
      )}
    </nav>
  )
}
