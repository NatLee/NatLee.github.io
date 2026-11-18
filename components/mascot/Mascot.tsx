'use client'

// 吉祥物：Tapi（像素圖，取自 Telepy）與千代（表情圖，來自 2015 年的 Aerial 主題）。
// 角色、表情與台詞都在 content/mascots.json；純 HTML 的主題用 public/shared/mascot.js 讀同一份資料。
import { useEffect, useRef, useState } from 'react'
import mascotsJson from '@/content/mascots.json'
import Tapi, { type MascotPose } from '@/components/tapi/Tapi'
import { useLanguage } from '@/contexts/LanguageContext'
import type { Mascot } from '@/lib/content/contract'
import type { Locale } from '@/lib/i18n/config'

export type MascotId = 'tapi' | 'chiyo'

const { $schema: _schema, ...registry } = mascotsJson as Record<string, unknown>
const mascots = registry as Record<MascotId, Mascot>

export function mascotName(id: MascotId, locale: Locale) {
  const name = mascots[id].name
  return (locale === 'zh-TW' && name.zh) || name.en
}

export function mascotLines(id: MascotId, locale: Locale): string[] {
  const lines = mascots[id].lines
  const preferred = locale === 'zh-TW' ? lines.zh : lines.en
  if (preferred?.length) return preferred
  return (lines.en?.length ? lines.en : lines.zh) ?? []
}

/** 點一下說一句，幾秒後自己閉嘴。 */
export function useMascotTalk(id: MascotId, holdMs = 4200) {
  const { locale } = useLanguage()
  const lines = mascotLines(id, locale)
  const [index, setIndex] = useState(-1)
  const [visible, setVisible] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    []
  )

  function talk() {
    if (!lines.length) return
    setIndex((current) => (current + 1) % lines.length)
    setVisible(true)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setVisible(false), holdMs)
  }

  return { line: visible && index >= 0 ? lines[index] : null, talk }
}

export function SpeechBubble({ text, align = 'right' }: { text: string | null; align?: 'left' | 'right' }) {
  return (
    <span
      role="status"
      aria-live="polite"
      className={`pointer-events-none absolute bottom-full mb-2 w-max max-w-[16rem] rounded-xl border border-line bg-surface px-3 py-2 text-left text-sm leading-snug text-ink shadow-lg transition-opacity ${
        align === 'right' ? 'right-0' : 'left-0'
      } ${text ? 'opacity-100' : 'opacity-0'}`}
    >
      {text}
    </span>
  )
}

interface FigureProps {
  id: MascotId
  pose?: MascotPose
  size?: number
  clip?: string
  /** 千代用第幾張表情（0 起算）。 */
  face?: number
  className?: string
}

export function MascotFigure({ id, pose = 'idle', size = 78, clip, face = 0, className }: FigureProps) {
  const mascot = mascots[id]
  if (mascot.kind === 'sprite') return <Tapi pose={pose} size={size} clip={clip} className={className} />
  const images = mascot.images ?? []
  const src = images[((face % images.length) + images.length) % images.length]
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" height={size} style={{ height: size, width: 'auto' }} className={className} />
}

/** 可以點的吉祥物：點了會說一句台詞（千代每句換一張表情）。 */
export function TalkingMascot({ id, size = 78, align = 'right' }: { id: MascotId; size?: number; align?: 'left' | 'right' }) {
  const { locale } = useLanguage()
  const { line, talk } = useMascotTalk(id)
  const [face, setFace] = useState(0)
  const name = mascotName(id, locale)

  function onClick() {
    talk()
    setFace((current) => current + 1 + Math.floor(Math.random() * 5))
  }

  return (
    <span className="relative inline-block">
      <SpeechBubble text={line} align={align} />
      <button type="button" onClick={onClick} aria-label={name} title={name} className="rounded-lg p-1 transition-transform hover:-translate-y-0.5">
        <MascotFigure id={id} size={size} face={face} pose={line ? 'happy' : 'idle'} />
      </button>
    </span>
  )
}

/** 作品頁評論圖表的台詞（content/mascots.json 的 remarks），某個語言沒有就用另一個。 */
export function mascotRemarks(id: MascotId, section: string, locale: Locale): string[] {
  const set = mascots[id].remarks?.[section]
  if (!set) return []
  const preferred = locale === 'zh-TW' ? set.zh : set.en
  return preferred?.length ? preferred : (set.en ?? set.zh ?? [])
}

/** 同一個作品、同一段永遠先說同一句（伺服器和瀏覽器算出來一樣）。 */
function seedIndex(seed: string, length: number) {
  let hash = 0
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return length ? hash % length : 0
}

/**
 * Tapi 在作品頁的圖表旁邊講一句話：對話框加吉祥物，點吉祥物換下一句。
 * 作品有自己的台詞（own，作品 JSON 的 mascotLines）就講那些，沒有就用這一段的通用台詞。
 * seed 用作品 id，讓每個作品一開始講的不一樣；同一個作品的兩段（流程、架構）也會從不同句開始。
 */
export function MascotRemark({ id = 'tapi', section, seed, pose = 'idle', own }: { id?: MascotId; section: string; seed: string; pose?: MascotPose; own?: string[] }) {
  const { locale } = useLanguage()
  const lines = own?.length ? own : mascotRemarks(id, section, locale)
  const [offset, setOffset] = useState(0)
  if (!lines.length) return null
  const line = lines[(seedIndex(`${seed}:${section}`, lines.length) + offset) % lines.length]
  const name = mascotName(id, locale)
  return (
    <div className="flex items-end gap-2">
      <p className="relative max-w-[17rem] rounded-xl border border-line bg-surface px-3 py-2 text-sm leading-snug text-ink">
        {line}
        <span className="absolute -right-[7px] bottom-4 h-3 w-3 rotate-45 border-r border-t border-line bg-surface" aria-hidden="true" />
      </p>
      <button
        type="button"
        onClick={() => setOffset((current) => current + 1)}
        aria-label={name}
        title={name}
        className="shrink-0 rounded-lg p-0.5 transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <MascotFigure id={id} size={52} pose={offset % 2 ? 'happy' : pose} />
      </button>
    </div>
  )
}
