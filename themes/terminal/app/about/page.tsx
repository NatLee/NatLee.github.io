'use client'

import About from '@/components/About'
import { getPersonalInfo } from '@/data/personal'

export default function AboutPage() {
  return (
    <main id="main" tabIndex={-1} className="min-h-screen pointer-events-none focus:outline-none">
      <h1 className="sr-only">About {getPersonalInfo().displayName}</h1>
      <About />
    </main>
  )
}
