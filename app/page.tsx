'use client'

import { useState } from 'react'
import TechHero from '@/components/TechHero'
import FeaturedProjects from '@/components/FeaturedProjects'
import TerminalCommand from '@/components/TerminalCommand'
import InteractiveTerminal from '@/components/InteractiveTerminal'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Home() {
  const { t } = useLanguage()
  const [firstCommandComplete, setFirstCommandComplete] = useState(false)
  const [secondCommandComplete, setSecondCommandComplete] = useState(false)

  return (
    <main id="main" tabIndex={-1} className="min-h-screen pt-16 md:pt-20 pb-20 font-mono relative overflow-hidden pointer-events-none focus:outline-none">
      <h1 className="sr-only">Nat Lee — Senior Software Engineer &amp; AI Specialist</h1>
      <div className="relative z-10 container mx-auto px-2 md:px-4 max-w-6xl pointer-events-auto">
          <div className="border border-gray-700 rounded-lg overflow-hidden shadow-2xl bg-black/60 backdrop-blur-sm">
            <div className="w-full bg-[#1a1a1a] p-3 flex items-center gap-2 sticky top-0 z-20 border-b border-gray-800">
              <div className="flex gap-2 mr-4" aria-hidden="true">
                <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400" />
              </div>
              <div className="flex-1 text-center text-xs md:text-sm text-gray-500 font-bold select-none">
                {t('home.terminalTitle')}
              </div>
            </div>

            <div className="min-h-[80vh] p-4 md:p-8 text-gray-300">
              <TerminalCommand
                command={t('home.introCommand')}
                startDelay={300}
                typingSpeed={40}
                onComplete={() => setFirstCommandComplete(true)}
              >
                <TechHero />
              </TerminalCommand>

              {firstCommandComplete && (
                <div className="mt-8 animate-content-reveal">
                  <TerminalCommand
                    path="~/projects"
                    command={t('home.projectsCommand')}
                    startDelay={200}
                    typingSpeed={30}
                    onComplete={() => setSecondCommandComplete(true)}
                  >
                    <FeaturedProjects />
                  </TerminalCommand>
                </div>
              )}

              {secondCommandComplete && (
                <div className="animate-content-reveal">
                  <InteractiveTerminal />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
  )
}
