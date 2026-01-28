import Navigation from '@/components/Navigation'
import TechHero from '@/components/TechHero'
import FeaturedProjects from '@/components/FeaturedProjects'
import QuickStats from '@/components/QuickStats'

export default function Home() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-16 md:pt-20 pb-20 font-mono relative overflow-hidden pointer-events-none">

        {/* Global Background handled in layout */}

        {/* Layer 1: Main Terminal Window */}
        <div className="relative z-10 container mx-auto px-2 md:px-4 max-w-6xl">

          <div className="border border-gray-700 rounded-lg overflow-hidden shadow-2xl bg-black/60 backdrop-blur-sm pointer-events-auto">
            {/* Terminal Top Bar */}
            <div className="w-full bg-[#1a1a1a] p-3 flex items-center gap-2 sticky top-0 z-20 border-b border-gray-800 pointer-events-auto">
              <div className="flex gap-2 mr-4">
                <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400"></div>
              </div>
              <div className="flex-1 text-center text-xs md:text-sm text-gray-500 font-bold select-none">
                natlee@mainframe: ~ (zsh)
              </div>
            </div>

            {/* Terminal Content Area */}
            <div className="min-h-[80vh] p-2 md:p-8 text-gray-300 pointer-events-auto">

              {/* 1. Intro Section */}
              <div className="mb-6">
                <div className="text-secondary mb-2">natlee@mainframe:~$ ./intro.sh</div>
                <TechHero />
              </div>

              {/* 3. Projects Section */}
              <div className="mb-6">
                <div className="text-secondary mb-2">natlee@mainframe:~$ ls -l ./projects/ --ranger-mode</div>
                <FeaturedProjects />
              </div>

              {/* 4. Active Cursor */}
              <div className="mt-4">
                <span className="text-secondary">natlee@mainframe:~$</span> <span className="animate-pulse bg-secondary text-black px-1">_</span>
              </div>

            </div>
          </div>
        </div>

      </main>
    </>
  )
}