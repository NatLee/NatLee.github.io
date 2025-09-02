import Navigation from '@/components/Navigation'
import About from '@/components/About'

export const metadata = {
  title: 'About | Nat Lee',
  description: 'Learn more about Nat Lee - Software Engineer and AI Specialist',
}

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-16">
        <About />
      </main>
    </>
  )
}
