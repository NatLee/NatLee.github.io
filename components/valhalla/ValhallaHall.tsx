'use client'

// 英靈殿大廳：同一份內容的其他外觀。每個主題在瀏覽器裡讀 /content/site.json，所以內容永遠是最新的。
// 大廳本身刻意是一個深色的像素世界，不跟隨淺深主題，所以這裡的顏色寫死、自成一套。
// 主題的程式在 themes/<name>/ 或 public/valhalla/<name>/，說明見 themes/README.md。
import { TalkingMascot } from '@/components/mascot/Mascot'
import Tapi from '@/components/tapi/Tapi'
import { useLanguage } from '@/contexts/LanguageContext'
import { valhalla } from '@/data/content'
import { pick } from '@/lib/i18n/localize'

const C = {
  hall: '#1a1214',
  card: '#231a1c',
  edge: '#3a2d30',
  text: '#efe5e1',
  soft: '#cbbcb9',
  dim: '#a8989b',
  orange: '#f28a38',
  teal: '#8de6cf',
}

export default function ValhallaHall() {
  const { locale, t } = useLanguage()

  return (
    <div className="pb-4" style={{ background: C.hall, color: C.text }}>
      <div className="shell pt-16 md:pt-24">
        <p className="font-pixel text-sm" style={{ color: C.teal }}>
          natlee.github.io · 2015 → {new Date().getFullYear()}
        </p>
        <h1 className="mt-4 font-pixel text-5xl leading-none md:text-7xl" style={{ color: C.orange }}>
          VALHALLA
        </h1>
        <p className="mt-3 font-display text-2xl font-bold">{t('valhalla.title')}</p>
        <p className="mt-4 max-w-[60ch] text-lg" style={{ color: C.soft }}>
          {t('valhalla.intro')}
        </p>

        <ol className="mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t border-dashed pt-5 font-mono text-xs" style={{ borderColor: C.edge, color: C.dim }} aria-label={t('valhalla.timeline')}>
          {valhalla
            .filter((entry) => !entry.side)
            .map((entry) => (
              <li key={entry.id} className="grid gap-0.5">
                <span className="tabular font-semibold" style={{ color: C.text }}>
                  {entry.since}
                </span>
                {entry.name}
              </li>
            ))}
          <li className="grid gap-0.5">
            <span className="font-semibold" style={{ color: C.teal }}>
              {t('valhalla.now')}
            </span>
            Persimmon
          </li>
        </ol>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {valhalla.map((entry) => (
            <li key={entry.id}>
              <a href={`/valhalla/${entry.id}/`} className="group flex h-full flex-col overflow-hidden rounded-xl border transition-colors" style={{ background: C.card, borderColor: C.edge }}>
                <span className="relative block aspect-[16/10] overflow-hidden" style={{ background: '#0e0a0b' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={entry.cover}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover object-top opacity-90 saturate-[.85] transition duration-500 group-hover:scale-[1.03] group-hover:opacity-100 group-hover:saturate-100"
                  />
                  <span className="absolute left-3 top-3 border px-2 py-0.5 font-pixel text-sm" style={{ background: C.hall, color: C.orange, borderColor: C.orange }}>
                    {entry.since}
                  </span>
                  {entry.side && (
                    <span className="absolute right-3 top-3 rounded px-2 py-0.5 font-mono text-[11px] font-semibold" style={{ background: C.edge, color: C.text }}>
                      {t('valhalla.side')}
                    </span>
                  )}
                </span>
                <span className="flex flex-1 flex-col gap-2 p-5">
                  <span className="font-display text-xl font-bold">{entry.name}</span>
                  <span className="font-mono text-xs" style={{ color: C.dim }}>
                    {entry.stack}
                  </span>
                  <span className="text-sm leading-relaxed" style={{ color: C.soft }}>
                    {pick(locale, entry.thesis)}
                  </span>
                  {pick(locale, entry.note) && (
                    <span className="text-xs" style={{ color: C.dim }}>
                      {pick(locale, entry.note)}
                    </span>
                  )}
                  <span className="mt-auto pt-3 font-mono text-sm font-semibold" style={{ color: C.teal }}>
                    {t('valhalla.enter', { name: entry.name })} →
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-14 grid gap-6 rounded-xl border p-6 md:grid-cols-[auto_minmax(0,1fr)] md:items-center" style={{ borderColor: C.edge }}>
          <div className="flex items-end gap-4 pt-16">
            <TalkingMascot id="tapi" size={78} align="left" />
            <TalkingMascot id="chiyo" size={104} align="left" />
          </div>
          <div>
            <p className="font-display text-lg font-bold">{t('valhalla.howTitle')}</p>
            <p className="mt-2 max-w-prose text-sm leading-relaxed" style={{ color: C.soft }}>
              {t('valhalla.how')}
            </p>
            <p className="mt-2 text-sm" style={{ color: C.dim }}>
              {t('valhalla.keepers')}
            </p>
          </div>
        </div>
      </div>

      <div
        className="relative mt-14 h-16 border-t-2"
        style={{ borderColor: C.edge, background: 'repeating-linear-gradient(90deg,#1f1618 0 24px,#231a1c 24px 48px)' }}
        aria-hidden="true"
      >
        <div className="shell relative h-full">
          <div className="relative h-full">
            <div className="walker" style={{ ['--walker-w' as string]: '52px', bottom: '12px' }}>
              <span className="relative block h-[52px] w-[52px]">
                <Tapi pose="sideA" size={52} className="frame-a absolute inset-0" />
                <Tapi pose="sideB" size={52} className="frame-b absolute inset-0" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
