import ValhallaHall from '@/components/valhalla/ValhallaHall'

export const metadata = {
  title: 'Valhalla',
  description: 'Every look natlee.github.io has worn since 2015, from Aerial to Terminal, all showing the current content.',
  alternates: { canonical: '/valhalla/' },
}

export default function ValhallaPage() {
  return (
    <main id="main" tabIndex={-1} className="-mb-28 focus:outline-none">
      <ValhallaHall />
    </main>
  )
}
