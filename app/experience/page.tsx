import Navigation from '@/components/Navigation'
import Experience from '@/components/Experience'

export const metadata = {
  title: 'Experience | Nat Lee',
  description: 'Professional experience and career journey of Nat Lee',
}

export default function ExperiencePage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-20 pb-20 font-mono relative pointer-events-none">

        <div className="relative z-10 container mx-auto px-4 max-w-6xl pointer-events-auto">
          {/* Terminal Top Bar */}
          <div className="w-full bg-[#1a1a1a] rounded-t-lg border border-gray-700 p-3 flex items-center gap-2 sticky top-14 z-20 shadow-xl">
            <div className="flex gap-2 mr-4">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="flex-1 text-center text-sm text-gray-500 font-bold select-none">
              natlee@mainframe:~/experience (cat experience.log)
            </div>
          </div>

          {/* Terminal Content */}
          <div className="bg-black/60 backdrop-blur-sm border-x border-b border-gray-700 rounded-b-lg shadow-2xl p-6 md:p-12 min-h-[600px]">
            <Experience />
          </div>
        </div>
      </main>
    </>
  )
}
