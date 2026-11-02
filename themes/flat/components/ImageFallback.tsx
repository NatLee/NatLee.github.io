'use client'

// Placeholder drawn when a project image fails to load (replaces the old innerHTML fallbacks).
export default function ImageFallback({ title, small = false }: { title: string; small?: boolean }) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary/10 to-accent/10">
      <div className="text-center">
        <svg className={`${small ? 'w-8 h-8 mb-1' : 'w-16 h-16 mb-2'} text-secondary/40 mx-auto`} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
        </svg>
        <p className={`${small ? 'text-xs' : 'text-sm'} text-gray-400 font-mono`}>{title}</p>
      </div>
    </div>
  )
}
