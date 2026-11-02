'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { isSiteLoaded, loadSiteBundle, SITE_BUNDLE_URL } from '@/lib/site/store'
import { useLanguage } from '@/contexts/LanguageContext'

type GateState = { status: 'loading' } | { status: 'ready' } | { status: 'error'; message: string }

/**
 * Holds the app back until /content/site.json has loaded, so every data
 * accessor below it can stay synchronous. While waiting it shows a boot log;
 * on failure, a systemd-style FAILED line with a retry.
 */
export default function SiteDataGate({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GateState>(() => (isSiteLoaded() ? { status: 'ready' } : { status: 'loading' }))

  const load = useCallback(() => {
    setState({ status: 'loading' })
    loadSiteBundle()
      .then(() => setState({ status: 'ready' }))
      .catch((error: unknown) => setState({ status: 'error', message: error instanceof Error ? error.message : String(error) }))
  }, [])

  useEffect(() => {
    if (!isSiteLoaded()) load()
  }, [load])

  if (state.status === 'ready') return <>{children}</>
  return <BootScreen state={state} onRetry={load} />
}

function BootScreen({ state, onRetry }: { state: GateState; onRetry: () => void }) {
  const { t } = useLanguage()
  const failed = state.status === 'error'

  return (
    <main
      id="main"
      className="min-h-screen pt-16 md:pt-20 pb-20 font-mono relative overflow-hidden"
      aria-busy={!failed}
    >
      <div className="relative z-10 container mx-auto px-2 md:px-4 max-w-3xl">
        <div className="border border-gray-700 rounded-lg overflow-hidden shadow-2xl bg-black/95">
          <div className="w-full bg-[#1a1a1a] p-3 flex items-center gap-2 border-b border-gray-800">
            <div className="flex gap-2 mr-4" aria-hidden="true">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="flex-1 text-center text-xs md:text-sm text-gray-500 font-bold select-none">
              {t('boot.title')}
            </div>
          </div>

          <div className="p-6 md:p-10 text-sm md:text-base space-y-1 min-h-[40vh]" role="status" aria-live="polite">
            <div className="text-gray-400">
              [ <span className="text-green-400">OK</span> ] {t('boot.started')}
            </div>
            {failed ? (
              <>
                <div className="text-gray-400">
                  [<span className="text-red-400">FAILED</span>] {t('boot.mount', { path: SITE_BUNDLE_URL })}
                </div>
                <div className="text-red-400 pt-4">
                  zsh: {t('boot.error')} ({state.message})
                </div>
                <div className="pt-6">
                  <button
                    type="button"
                    onClick={onRetry}
                    className="inline-flex items-center justify-center px-6 py-3 font-bold text-black bg-secondary rounded hover:bg-orange-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 ring-offset-2 ring-offset-black"
                  >
                    <span className="mr-2" aria-hidden="true">&gt;</span>
                    {t('boot.retry')}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-gray-400">
                [ <span className="text-secondary animate-pulse">..</span> ] {t('boot.mount', { path: SITE_BUNDLE_URL })}
                <span className="inline-block w-2 h-4 bg-secondary ml-1 align-middle animate-pulse" aria-hidden="true" />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
