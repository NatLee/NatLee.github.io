'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { getSite, loadSite } from '@/lib/site'

type Status = 'loading' | 'ready' | 'error'

/**
 * Gate around the whole app: fetches /content/site.json once, then renders children.
 * Components below it read content synchronously through data/*.ts.
 */
export default function SiteProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<Status>('loading')
  const [error, setError] = useState('')
  const pathname = usePathname()

  const load = useCallback(() => {
    setStatus('loading')
    loadSite()
      .then(() => setStatus('ready'))
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : String(err))
        setStatus('error')
      })
  }, [])

  useEffect(load, [load])

  useEffect(() => {
    if (status === 'ready') document.title = `${getSite().profile.name} · Flat theme`
  }, [status, pathname])

  if (status === 'ready') return <>{children}</>
  if (status === 'error') return <LoadError message={error} onRetry={load} />
  return <Loading />
}

function Backdrop({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-dark-900 overflow-hidden px-4">
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-accent/5"></div>
      <div className="absolute top-20 left-10 w-20 h-20 border-2 border-secondary/20 rotate-45 animate-float"></div>
      <div className="absolute bottom-40 right-20 w-12 h-12 border border-accent/30 rotate-12 animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="relative z-10 text-center">{children}</div>
    </div>
  )
}

function Loading() {
  return (
    <Backdrop>
      <div role="status" aria-live="polite" className="animate-fade-in">
        <div className="relative w-28 h-28 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full border-2 border-secondary border-t-transparent animate-spin" style={{ animationDuration: '1.4s' }}></div>
          <div className="absolute inset-3 rounded-full border border-accent border-b-transparent animate-spin" style={{ animationDuration: '1s', animationDirection: 'reverse' }}></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 bg-gradient-to-br from-secondary to-accent rounded-full animate-pulse"></div>
          </div>
        </div>
        <p className="text-2xl font-bold">
          <span className="bg-gradient-to-r from-secondary via-neon-red to-accent bg-clip-text text-transparent">Loading portfolio</span>
        </p>
        <p className="mt-3 text-sm text-gray-400 font-mono">
          <span className="text-secondary">&gt;</span> fetching content…
        </p>
      </div>
    </Backdrop>
  )
}

function LoadError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <Backdrop>
      <div role="alert" className="max-w-lg bg-dark-800/80 backdrop-blur-sm border border-secondary/30 rounded-2xl p-8 shadow-2xl shadow-secondary/10 animate-fade-in">
        <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-xl flex items-center justify-center">
          <span className="text-3xl font-bold text-secondary">!</span>
        </div>
        <h1 className="text-3xl font-bold mb-4">
          <span className="bg-gradient-to-r from-secondary via-neon-red to-accent bg-clip-text text-transparent">Content unavailable</span>
        </h1>
        <p className="text-gray-300 leading-relaxed mb-2">The portfolio content could not be loaded.</p>
        <p className="text-xs text-gray-500 font-mono break-words mb-8">{message}</p>
        <button
          type="button"
          onClick={onRetry}
          className="bg-gradient-to-r from-secondary to-accent hover:from-accent hover:to-secondary text-dark-900 px-8 py-3 rounded-full font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-secondary/25"
        >
          Try Again
        </button>
      </div>
    </Backdrop>
  )
}
