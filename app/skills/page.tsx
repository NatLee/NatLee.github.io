import Navigation from '@/components/Navigation'
import Skills from '@/components/Skills'

export const metadata = {
  title: 'Skills | Nat Lee',
  description: 'Technical skills and expertise of Nat Lee',
}

export default function SkillsPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-16">
        <Skills />
      </main>
    </>
  )
}
