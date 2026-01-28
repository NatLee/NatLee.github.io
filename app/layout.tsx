import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ScrollingTechStack from '@/components/ScrollingTechStack'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'Nat Lee | Portfolio',
  description: 'Personal portfolio and project showcase',
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
      <body className={`${inter.variable} font-sans bg-[#050505] text-gray-300`}>
        {/* Global Background Layer */}
        <div className="fixed inset-0 z-0">
          <ScrollingTechStack />
        </div>

        {/* Main Content - pointer-events-none to let background receive hover */}
        <div className="relative z-10 pointer-events-none">
          {children}
        </div>
      </body>
    </html>
  )
}
