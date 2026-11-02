import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ScrollingTechStack from '@/components/ScrollingTechStack'
import Providers from '@/components/Providers'
import Navigation from '@/components/Navigation'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  variable: '--font-inter',
})

// Static on purpose: content (and per-page titles, via DocumentTitleSync) is
// loaded at runtime from /content/site.json.
export const metadata: Metadata = {
  title: 'Nat Lee · Terminal theme',
  icons: {
    icon: '/valhalla/terminal/favicon.svg',
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
