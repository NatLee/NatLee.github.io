import type { Metadata, Viewport } from 'next'
import './globals.css'
import { fontVariables } from './fonts'
import Providers from '@/components/Providers'
import SiteHeader from '@/components/site/SiteHeader'
import SiteFooter from '@/components/site/SiteFooter'
import { PersonJsonLd } from '@/components/PersonJsonLd'
import { personalInfo } from '@/data/personal'

const siteUrl = 'https://natlee.github.io'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Nat Lee',
    template: '%s | Nat Lee',
  },
  description: personalInfo.description,
  alternates: { canonical: '/' },
  // natlee 的 N 字標（public/favicon.svg 是原稿；.ico 與 PNG 都由同一組形狀產生）。
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '16x16 32x32 48x48' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['zh_TW'],
    url: siteUrl,
    siteName: 'Nat Lee',
    title: 'Nat Lee',
    description: personalInfo.description,
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Nat Lee' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nat Lee',
    description: personalInfo.description,
    images: ['/og.png'],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7f3f2' },
    { media: '(prefers-color-scheme: dark)', color: '#141012' },
  ],
}

// 在第一次繪製前套用使用者選過的主題，避免閃一下。沒選過就跟隨系統（不設 data-theme）。
const themeScript = `(function(){try{var t=localStorage.getItem('natlee-theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t)}catch(e){}})()`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <PersonJsonLd />
        <Providers>
          <a
            href="#main"
            className="sr-only z-50 rounded-md bg-ink px-4 py-2 font-semibold text-paper focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
          >
            Skip to content
          </a>
          <SiteHeader />
          {children}
          <SiteFooter />
        </Providers>
      </body>
    </html>
  )
}
