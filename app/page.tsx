import Hero from '@/components/home/Hero'
import Flagship from '@/components/home/Flagship'
import { Career, OpenSource, SelectedWork, WorkAndWriting } from '@/components/home/HomeSections'

export default function HomePage() {
  return (
    <main id="main" tabIndex={-1} className="focus:outline-none">
      <Hero />
      <Flagship />
      <SelectedWork />
      <OpenSource />
      <Career />
      <WorkAndWriting />
    </main>
  )
}
