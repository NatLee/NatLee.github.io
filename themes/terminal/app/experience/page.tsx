'use client'

import Experience from '@/components/Experience'
import { getPersonalInfo } from '@/data/personal'

export default function ExperiencePage() {
  return (
    <main id="main" tabIndex={-1} className="min-h-screen pointer-events-none focus:outline-none">
      <h1 className="sr-only">{getPersonalInfo().displayName} — Experience &amp; Education</h1>
      <Experience />
    </main>
  )
}
