'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { useLanguage } from '@/contexts/LanguageContext'

const NAV_ITEMS = [
  { id: '1', labelKey: 'nav.home', href: '/' },
  { id: '2', labelKey: 'nav.about', href: '/about' },
  { id: '3', labelKey: 'nav.experience', href: '/experience' },
  { id: '4', labelKey: 'nav.projects', href: '/projects' },
] as const

function smoothRandom(current: number, min: number, max: number, maxDelta: number): number {
  const delta = (Math.random() - 0.5) * 2 * maxDelta
  const newValue = current + delta
  return Math.max(min, Math.min(max, newValue))
}

function formatUptime(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

export default function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const { t } = useLanguage()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [time, setTime] = useState('')
  const [mounted, setMounted] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [cpuUsage, setCpuUsage] = useState(15)
  const [memUsage, setMemUsage] = useState(45)
  const [networkLatency, setNetworkLatency] = useState(12)
  const [uptime, setUptime] = useState(0)
  const [networkStatus, setNetworkStatus] = useState<'SECURE' | 'SYNC' | 'IDLE'>('SECURE')
  const [statusText, setStatusText] = useState('ONLINE')
  const cpuRef = useRef(15)
  const memRef = useRef(45)
  const latencyRef = useRef(12)

  const navItems = NAV_ITEMS

  const isActive = useCallback(
    (href: string) => {
      if (href === '/') return pathname === '/'
      return pathname.startsWith(href)
    },
    [pathname]
  )

  useEffect(() => {
    setMounted(true)
    setReduceMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)

    const updateTime = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    }
    updateTime()
    const timeInterval = setInterval(updateTime, 1000)
    const uptimeInterval = setInterval(() => setUptime((prev) => prev + 1), 1000)

    let statsInterval: ReturnType<typeof setInterval> | undefined
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const updateStats = () => {
        const hasSpike = Math.random() < 0.1
        const cpuMax = hasSpike ? 65 : 35
        cpuRef.current = smoothRandom(cpuRef.current, 3, cpuMax, hasSpike ? 15 : 5)
        setCpuUsage(Math.round(cpuRef.current))
        memRef.current = smoothRandom(memRef.current, 25, 75, hasSpike ? 8 : 3)
        setMemUsage(Math.round(memRef.current))
        latencyRef.current = smoothRandom(latencyRef.current, 5, 45, hasSpike ? 15 : 5)
        setNetworkLatency(Math.round(latencyRef.current))

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
      statsInterval = setInterval(updateStats, 2000)
    }

    return () => {
      clearInterval(timeInterval)
      clearInterval(uptimeInterval)
      if (statsInterval) clearInterval(statsInterval)
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Escape always closes the shortcuts dialog.
      if (event.key === 'Escape') {
        setShowShortcuts(false)
        return
      }
      // Don't hijack browser shortcuts (Cmd/Ctrl/Alt+number switch tabs, etc.).
      if (event.metaKey || event.ctrlKey || event.altKey) return
      const target = event.target as HTMLElement | null
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable
      ) {
        return
      }
      // "?" toggles the keyboard-shortcut help overlay.
      if (event.key === '?') {
        event.preventDefault()
        setShowShortcuts((prev) => !prev)
        return
      }
      const index = Number(event.key) - 1
      if (index >= 0 && index < navItems.length) {
        router.push(navItems[index].href)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [router])

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

  const statusLabel = () => {
    switch (statusText) {
      case 'BUSY': return t('nav.status.busy')
      case 'IDLE': return t('nav.status.idle')
      default: return t('nav.status.online')
    }
  }

  const networkLabel = () => {
    switch (networkStatus) {
      case 'SYNC': return t('nav.status.sync')
      case 'IDLE': return t('nav.status.idle')
      default: return t('nav.status.secure')
    }
  }

  if (!mounted) return <nav className="fixed top-0 w-full h-12 bg-black border-b border-gray-800 z-50" aria-label={t('nav.ariaLabel')} />

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-gray-800 font-mono text-xs uppercase select-none pointer-events-auto" aria-label={t('nav.ariaLabel')}>
      <div className="w-full flex items-center justify-between h-12 px-2 md:px-0">
        <div className="flex items-center h-full">
          <div className={`hidden md:flex items-center h-full px-4 bg-gray-900 border-r border-gray-800 font-bold gap-2 transition-colors duration-300 ${getStatusColor()}`}>
            <span className={`w-2 h-2 rounded-full ${reduceMotion ? '' : 'animate-pulse'} transition-colors duration-300 ${getStatusDotColor()}`} />
            <span className="hidden xl:inline">NATLEE::</span>
            <span className="inline-block w-[6ch] text-left">{statusLabel()}</span>
          </div>

          <div className="hidden xl:flex items-center h-full px-3 border-r border-gray-800 text-gray-600 gap-2">
            <span className="text-gray-700">UP:</span>
            <span className="tabular-nums text-gray-500">{formatUptime(uptime)}</span>
          </div>

          <div className="flex items-center h-full px-4 border-r border-gray-800 font-bold text-white bg-black">
            <span className="text-secondary mr-1">@</span>
            Nat Lee
          </div>

          <div className="hidden md:flex h-full">
            {navItems.map((item, index) => (
              <Link
                key={item.id}
                href={item.href}
                className={`group h-full flex items-center px-4 lg:px-6 border-r border-gray-900 transition-all duration-200 relative ${
                  isActive(item.href)
                    ? 'bg-secondary text-black font-bold'
                    : 'text-gray-500 hover:text-white hover:bg-gray-900'
                }`}
              >
                {isActive(item.href) && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />}
                <span className={`mr-2 transition-all duration-200 ${isActive(item.href) ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}>
                  {isActive(item.href) ? '>' : item.id === '1' ? '~' : item.id === '2' ? '?' : item.id === '3' ? '▶' : '◈'}
                </span>
                {t(item.labelKey)}
                <span className={`ml-2 text-[10px] transition-opacity duration-200 ${isActive(item.href) ? 'opacity-50' : 'opacity-0 group-hover:opacity-30'}`}>
                  [{index + 1}]
                </span>
              </Link>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex items-center gap-2 text-secondary px-2"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav-menu"
            aria-label={isMobileMenuOpen ? t('nav.close') : t('nav.menu')}
          >
            <span className={`transition-transform duration-200 ${isMobileMenuOpen ? 'rotate-90' : ''}`}>
              {isMobileMenuOpen ? '×' : '≡'}
            </span>
            <span className="text-[10px]">{isMobileMenuOpen ? t('nav.close') : t('nav.menu')}</span>
          </button>
        </div>

        <div className="flex items-center h-full gap-2 lg:gap-4 px-2 lg:px-4 text-gray-600">
          {!reduceMotion && (
            <div className="hidden lg:flex items-center gap-3 xl:gap-4">
              <span className="flex items-center gap-1">
                <span className="text-gray-700">{t('nav.cpu')}:</span>
                <span className={`tabular-nums transition-colors duration-300 min-w-[3ch] ${cpuUsage > 50 ? 'text-red-400' : cpuUsage > 30 ? 'text-yellow-400' : 'text-gray-400'}`}>
                  {cpuUsage}%
                </span>
              </span>
              <span className="flex items-center gap-1">
                <span className="text-gray-700">{t('nav.mem')}:</span>
                <span className={`tabular-nums transition-colors duration-300 min-w-[3ch] ${memUsage > 70 ? 'text-red-400' : memUsage > 55 ? 'text-yellow-400' : 'text-gray-400'}`}>
                  {memUsage}%
                </span>
              </span>
              <span className="flex items-center gap-1">
                <span className="text-gray-700">{t('nav.net')}:</span>
                <span className={`inline-block w-[6ch] transition-colors duration-300 ${getNetworkColor()}`}>{networkLabel()}</span>
                <span className={`tabular-nums text-[10px] inline-block w-[5ch] text-right transition-colors duration-300 ${getLatencyColor()}`}>
                  {networkLatency}ms
                </span>
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowShortcuts(true)}
            aria-label={t('nav.shortcutsButton')}
            title={t('nav.shortcutsButton')}
            className="hidden md:flex items-center justify-center h-full px-2 text-gray-600 hover:text-secondary transition-colors font-bold text-sm"
          >
            ?
          </button>

          <LanguageSwitcher />

          <div className="flex items-center border-l border-gray-800 pl-2 lg:pl-4 h-full gap-2">
            <span className="hidden sm:inline text-gray-700 text-[10px]">⏱</span>
            <span className="text-secondary font-bold tabular-nums">{time}</span>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div id="mobile-nav-menu" className="md:hidden bg-black border-b border-gray-800 animate-slideDown">
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-900 text-[10px] text-gray-600">
            <div className="flex items-center gap-3">
              <span>{t('nav.cpu')}: <span className={cpuUsage > 50 ? 'text-red-400' : 'text-gray-400'}>{cpuUsage}%</span></span>
              <span>{t('nav.mem')}: <span className={memUsage > 70 ? 'text-red-400' : 'text-gray-400'}>{memUsage}%</span></span>
            </div>
            <span className={getNetworkColor()}>{networkLabel()}</span>
          </div>

          {navItems.map((item, index) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center justify-between p-4 border-b border-gray-900 transition-colors ${
                isActive(item.href) ? 'text-secondary bg-gray-900/50' : 'text-gray-400 active:bg-gray-900'
              }`}
            >
              <span>{t(item.labelKey)}</span>
              <span className="text-gray-700 text-[10px]">[{index + 1}]</span>
            </Link>
          ))}

          <div className="px-4 py-2 text-[10px] text-gray-700 flex justify-between">
            <span>{t('nav.sessionUptime')}</span>
            <span className="tabular-nums text-gray-500">{formatUptime(uptime)}</span>
          </div>
        </div>
      )}

      {showShortcuts && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={t('nav.shortcutsTitle')}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowShortcuts(false)} />
          <div className="relative z-10 w-full max-w-sm border border-gray-700 rounded-lg bg-[#0a0a0a] shadow-2xl overflow-hidden animate-scale-in normal-case">
            <div className="flex items-center justify-between px-4 py-3 bg-[#1a1a1a] border-b border-gray-800">
              <span className="text-secondary font-bold text-xs uppercase tracking-wider">{t('nav.shortcutsTitle')}</span>
              <button
                type="button"
                onClick={() => setShowShortcuts(false)}
                aria-label={t('nav.close')}
                className="text-gray-500 hover:text-red-400 text-lg leading-none"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="p-4 space-y-2.5 text-xs">
              {navItems.map((item, index) => (
                <div key={item.id} className="flex items-center justify-between gap-4">
                  <span className="text-gray-400">{t('nav.shortcutNavigate')} {t(item.labelKey)}</span>
                  <kbd className="px-2 py-0.5 rounded border border-gray-700 bg-gray-900 text-secondary font-mono text-[11px] min-w-[2rem] text-center">{index + 1}</kbd>
                </div>
              ))}
              <div className="flex items-center justify-between gap-4 pt-2 border-t border-gray-800">
                <span className="text-gray-400">{t('nav.shortcutHelpRow')}</span>
                <kbd className="px-2 py-0.5 rounded border border-gray-700 bg-gray-900 text-secondary font-mono text-[11px] min-w-[2rem] text-center">?</kbd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-gray-400">{t('nav.shortcutEscRow')}</span>
                <kbd className="px-2 py-0.5 rounded border border-gray-700 bg-gray-900 text-secondary font-mono text-[11px] min-w-[2rem] text-center">Esc</kbd>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
