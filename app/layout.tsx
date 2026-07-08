import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ScrollingTechStack from '@/components/ScrollingTechStack'
import Providers from '@/components/Providers'
import Navigation from '@/components/Navigation'
import { PersonJsonLd } from '@/components/PersonJsonLd'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  variable: '--font-inter',
})

const siteUrl = 'https://natlee.github.io'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Nat Lee | Portfolio',
    template: '%s | Nat Lee',
  },
  description: 'Senior Software Engineer & AI Specialist — portfolio, projects, and experience.',
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['zh_TW'],
    url: siteUrl,
    siteName: 'Nat Lee Portfolio',
    title: 'Nat Lee | Portfolio',
    description: 'Senior Software Engineer & AI Specialist — portfolio, projects, and experience.',
    images: [
      {
        url: 'https://avatars.githubusercontent.com/u/10178964?v=4',
        width: 460,
        height: 460,
        alt: 'Nat Lee',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Nat Lee | Portfolio',
    description: 'Senior Software Engineer & AI Specialist — portfolio, projects, and experience.',
    images: ['https://avatars.githubusercontent.com/u/10178964?v=4'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans bg-[#050505] text-gray-300`}>
        <PersonJsonLd />
        <Providers>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-secondary focus:text-black focus:font-bold focus:rounded"
          >
            Skip to content
          </a>

          {/* Decorative background — hidden from assistive tech. */}
          <div className="fixed inset-0 z-0" aria-hidden="true">
            <ScrollingTechStack />
          </div>

          {/* Persistent chrome: kept out of the route subtree so its live
              system-stats/uptime don't reset on every navigation. */}
          <Navigation />

          <div className="relative z-10 pointer-events-none">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}
