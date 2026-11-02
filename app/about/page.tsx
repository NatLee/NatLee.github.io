import AboutPage from '@/components/about/AboutPage'

export const metadata = {
  title: 'About',
  description: 'Nat Lee: from crawlers and computer vision to power-trading systems for Japan, and how he builds with AI coding agents.',
  alternates: { canonical: '/about/' },
}

export default function About() {
  return (
    <main id="main" tabIndex={-1} className="focus:outline-none">
      <AboutPage />
    </main>
  )
}
