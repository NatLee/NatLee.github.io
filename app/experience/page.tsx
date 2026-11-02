import ExperiencePage from '@/components/experience/ExperiencePage'

export const metadata = {
  title: 'Experience',
  description: 'Work history, education, skills and open-source contributions of Nat Lee. Prints as a one-page CV.',
  alternates: { canonical: '/experience/' },
}

export default function Experience() {
  return (
    <main id="main" tabIndex={-1} className="focus:outline-none">
      <ExperiencePage />
    </main>
  )
}
