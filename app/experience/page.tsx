import Experience from '@/components/Experience'

export const metadata = {
  // Bare title — the root layout's title.template appends " | Nat Lee" once.
  title: 'Experience',
  description: 'Professional experience and career journey of Nat Lee',
  alternates: {
    canonical: '/experience/',
  },
}

export default function ExperiencePage() {
  return (
    <main id="main" tabIndex={-1} className="min-h-screen pointer-events-none focus:outline-none">
      <h1 className="sr-only">Nat Lee — Experience &amp; Education</h1>
      <Experience />
    </main>
  )
}
