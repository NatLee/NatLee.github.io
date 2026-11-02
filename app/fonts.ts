// 字體：Familjen Grotesk（標題）、Source Sans 3（內文的拉丁字，和中文退回的思源黑體同一家）、JetBrains Mono（標籤與程式）、Silkscreen（只給英靈殿與 Tapi）。
// 中文不自架，退回系統字體（PingFang TC / Noto Sans TC / 微軟正黑體），見 tailwind.config.js 的 fontFamily。
import { Familjen_Grotesk, JetBrains_Mono, Silkscreen, Source_Sans_3 } from 'next/font/google'

export const displayFont = Familjen_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
})

export const bodyFont = Source_Sans_3({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-body',
  display: 'swap',
})

export const monoFont = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-mono',
  display: 'swap',
})

export const pixelFont = Silkscreen({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-pixel',
  display: 'swap',
})

export const fontVariables = [displayFont.variable, bodyFont.variable, monoFont.variable, pixelFont.variable].join(' ')
