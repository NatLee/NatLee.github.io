import WorkPage from '@/components/work/WorkPage'

export const metadata = {
  title: 'Work',
  description:
    'What Nat Lee built at work: power-trading and solar forecasting at HD Renewables, sentiment analysis at Big Data and computer vision at Infortrend, with the open-source projects that grew out of them.',
  alternates: { canonical: '/work/' },
}

export default function Work() {
  return (
    <main id="main" tabIndex={-1} className="focus:outline-none">
      <WorkPage />
    </main>
  )
}
