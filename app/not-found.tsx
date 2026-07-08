'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import TerminalCommand from '@/components/TerminalCommand'
import { useLanguage } from '@/contexts/LanguageContext'

export default function NotFound() {
  const { t } = useLanguage()
  const pathname = usePathname()
  const path = pathname && pathname !== '/' ? pathname : '/404'

  return (
    <main
      id="main"
      tabIndex={-1}
      className="min-h-screen pt-16 md:pt-20 pb-20 font-mono relative overflow-hidden pointer-events-none focus:outline-none"
    >
      <h1 className="sr-only">404 — Page not found</h1>
      <div className="relative z-10 container mx-auto px-2 md:px-4 max-w-3xl pointer-events-auto">
        <div className="border border-gray-700 rounded-lg overflow-hidden shadow-2xl bg-black/95 backdrop-blur-sm">
          <div className="w-full bg-[#1a1a1a] p-3 flex items-center gap-2 border-b border-gray-800">
            <div className="flex gap-2 mr-4" aria-hidden="true">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="flex-1 text-center text-xs md:text-sm text-gray-500 font-bold select-none truncate px-2">
              natlee@mainframe: {path} (zsh)
            </div>
          </div>

          <div className="p-6 md:p-10 text-gray-300 min-h-[50vh]">
            <TerminalCommand path="~" command={`cat ${path}`} startDelay={300} typingSpeed={40}>
              <div className="mt-6 space-y-6">
                <p className="text-red-400 text-sm md:text-base">
                  bash: cat: {path}: {t('notFound.error')}
                </p>
                <div className="text-secondary font-black text-6xl md:text-8xl tracking-[0.15em] drop-shadow-[0_0_15px_rgba(212,116,30,0.4)] select-none">
                  404
                </div>
                <p className="text-gray-400 max-w-lg leading-relaxed text-sm md:text-base font-sans">
                  {t('notFound.message')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center px-6 py-3 font-bold text-black bg-secondary rounded hover:bg-orange-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 ring-offset-2 ring-offset-black"
                  >
                    <span className="mr-2" aria-hidden="true">&gt;</span>
                    {t('notFound.home')}
                  </Link>
                  <Link
                    href="/projects"
                    className="inline-flex items-center justify-center px-6 py-3 font-bold text-secondary border-2 border-secondary rounded hover:bg-secondary/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 ring-offset-2 ring-offset-black"
                  >
                    <span className="mr-2" aria-hidden="true">$</span>
                    {t('notFound.projects')}
                  </Link>
                </div>
              </div>
            </TerminalCommand>
          </div>
        </div>
      </div>
    </main>
  )
}
