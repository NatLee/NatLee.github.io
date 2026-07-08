import About from '@/components/About'

export const metadata = {
  // Bare title — the root layout's title.template appends " | Nat Lee" once.
  title: 'About',
  description: 'Learn more about Nat Lee - Software Engineer and AI Specialist',
  alternates: {
    canonical: '/about/',
  },
}

export default function AboutPage() {
  return (
    <main id="main" tabIndex={-1} className="min-h-screen pointer-events-none focus:outline-none">
      <h1 className="sr-only">About Nat Lee</h1>
      <About />
    </main>
  )
}
