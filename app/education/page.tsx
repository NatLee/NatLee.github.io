import Navigation from '@/components/Navigation'
import Education from '@/components/Education'

export const metadata = {
  title: 'Education | Nat Lee',
  description: 'Educational background and academic achievements of Nat Lee',
}

export default function EducationPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-16">
        <Education />
      </main>
    </>
  )
}
