'use client'

// 全站頁尾：聯絡方式、其他平台、英靈殿入口、主題名稱，以及 Tapi（點它會說一句台詞，連點五下換髮夾顏色）。
import Link from 'next/link'
import { useState } from 'react'
import CopyButton from '@/components/CopyButton'
import Icon from '@/components/Icon'
import { SpeechBubble, useMascotTalk } from '@/components/mascot/Mascot'
import { OPEN_SHORTCUTS_EVENT } from '@/components/site/SiteHeader'
import Tapi, { DEFAULT_CLIP } from '@/components/tapi/Tapi'
import { useLanguage } from '@/contexts/LanguageContext'
import { getPersonalInfo } from '@/data/personal'
import { CLIP_COLORS } from '@/lib/tapi/mascot'

function FooterTapi() {
  const { t } = useLanguage()
  const [clicks, setClicks] = useState(0)
  const { line, talk } = useMascotTalk('tapi')

  const clip = clicks >= 5 ? CLIP_COLORS[Math.floor(clicks / 5) % CLIP_COLORS.length][1] : DEFAULT_CLIP

  function poke() {
    setClicks((count) => count + 1)
    talk()
  }

  return (
    <span className="relative inline-block">
      <SpeechBubble text={line} />
      <button type="button" onClick={poke} aria-label={t('footer.tapi')} title={t('footer.tapi')} className="rounded-lg p-1 transition-transform hover:-translate-y-0.5">
        <Tapi pose={line ? 'happy' : 'idle'} size={52} clip={clip} />
      </button>
    </span>
  )
}

export default function SiteFooter() {
  const { locale, t } = useLanguage()
  const me = getPersonalInfo(locale)

  return (
    <footer className="no-print mt-28 border-t border-line" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className="shell grid gap-10 py-12 md:grid-cols-[1.3fr_1fr_1.2fr]">
        <div>
          <p className="font-display text-xl font-bold">{me.displayName}</p>
          <p className="mt-2 max-w-[36ch] text-sm text-muted">{me.tagline.sub}</p>
          <p className="eyebrow mt-6">{t('footer.contact')}</p>
          <div className="mt-2 flex items-center gap-1">
            <a href={`mailto:${me.email}`} className="link text-sm">
              {me.email}
            </a>
            <CopyButton value={me.email} />
          </div>
        </div>

        <div>
          <p className="eyebrow">{t('footer.elsewhere')}</p>
          <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            {me.socialLinks.map((link) => (
              <li key={link.name}>
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-muted transition-colors hover:text-ink">
                  <Icon name={link.icon} size={15} />
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <Link href="/valhalla/" className="group block rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-accent-fill/60">
            <span className="font-pixel text-sm text-accent">VALHALLA</span>
            <span className="mt-2 block font-display text-lg font-bold">
              {t('footer.valhalla')} <Icon name="arrow" size={16} className="inline-block align-[-2px] transition-transform group-hover:translate-x-0.5" />
            </span>
            <span className="mt-1 block text-sm text-muted">{t('footer.valhallaNote')}</span>
          </Link>
        </div>
      </div>

      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-4 border-t border-line/70 py-5">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs text-muted">
          <span>{t('footer.version')}</span>
          <span>{t('footer.built')}</span>
          <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_SHORTCUTS_EVENT))} className="underline decoration-line underline-offset-4 hover:text-ink">
            {t('nav.shortcuts')}
          </button>
        </div>
        <FooterTapi />
        </div>
      </div>
    </footer>
  )
}
