import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import SiteProvider from '@/components/SiteProvider'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  variable: '--font-inter'
})

// Static on purpose (no per-page SEO in Valhalla themes); SiteProvider adds the owner's name at runtime.
export const metadata: Metadata = {
  title: 'Flat theme',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans`}>
        <SiteProvider>{children}</SiteProvider>
      </body>
    </html>
  )
}
