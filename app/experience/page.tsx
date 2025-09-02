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
      <main className="min-h-screen pt-16">
        <Experience />
      </main>
    </>
  )
}
