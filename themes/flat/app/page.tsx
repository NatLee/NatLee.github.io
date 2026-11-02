import Navigation from '@/components/Navigation'
import TechHero from '@/components/TechHero'
import FeaturedProjects from '@/components/FeaturedProjects'
import QuickStats from '@/components/QuickStats'

export default function Home() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        <TechHero />
        <QuickStats />
        <FeaturedProjects />
      </main>
    </>
  )
}