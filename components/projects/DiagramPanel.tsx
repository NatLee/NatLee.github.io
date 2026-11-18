'use client'

// 作品頁的圖解（流程圖、架構圖）擺在哪裡，依畫面寬度分兩種：
// - 寬（Tailwind 的 lg 以上）：流程圖坐在文字右邊的欄位，跟著頁面捲動停在畫面裡（FlowSidePanel）；架構圖照舊在文字下方全寬橫排。
// - 窄：流程圖和架構圖合成一張卡，切換看哪一張；卡片先露出開頭，可以展開，也可以開全螢幕（DiagramCard）。
// 兩種容器都由 CSS 決定顯示，第一個畫面就在對的位置；圖本身只掛在其中一個（useWideLayout），同一張圖不會量兩次。
import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react'
import { MascotRemark } from '@/components/mascot/Mascot'
import { useLanguage } from '@/contexts/LanguageContext'
import type { ArchitectureStep, FlowStep } from '@/data/projects'
import ArchitectureFlow from './ArchitectureFlow'
import FlowGraph from './FlowGraph'

/** 和 Tailwind 預設的 lg 斷點相同（tailwind.config.js 沒有改 screens）。版面的 CSS 用 lg:，這裡用同一個寬度決定圖掛在哪個容器。 */
const WIDE_QUERY = '(min-width: 1024px)'
/** 窄螢幕的卡片收合時露出多高（rem）。 */
const COLLAPSED_REM = 22

/** 寬版面（lg 以上）時為 true。伺服器輸出時當作窄，載入後再依實際寬度切換。 */
export function useWideLayout() {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia(WIDE_QUERY)
      query.addEventListener('change', onChange)
      return () => query.removeEventListener('change', onChange)
    },
    () => window.matchMedia(WIDE_QUERY).matches,
    () => false
  )
}

const SMALL_BUTTON =
  'inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1 font-mono text-xs font-semibold text-ink transition-colors hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

/** 全螢幕看一張圖：開的時候才把圖掛上去，量到的就是全螢幕的寬度。Esc 或「關閉」收起。 */
function Fullscreen({ title, open, onClose, children }: { title: string; open: boolean; onClose: () => void; children: ReactNode }) {
  const { t } = useLanguage()
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-label={title}
      className="m-0 h-[100dvh] max-h-none w-screen max-w-none bg-paper p-0 text-ink backdrop:bg-ink/40"
    >
      {open && (
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-4 border-b border-line px-4 pb-3 sm:px-8" style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top, 0px))' }}>
            <h2 className="mr-auto font-display text-xl font-bold">{title}</h2>
            <button type="button" onClick={onClose} className={SMALL_BUTTON}>
              {t('project.close')}
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-auto px-4 py-6 sm:px-8">
            <div className="mx-auto max-w-6xl">{children}</div>
          </div>
        </div>
      )}
    </dialog>
  )
}

/** 寬螢幕：流程圖放在右欄，高度跟畫面一樣，圖比較高就在框裡捲。 */
export function FlowSidePanel({ steps, seed, lines }: { steps: FlowStep[]; seed: string; lines?: string[] }) {
  const { t } = useLanguage()
  const [full, setFull] = useState(false)
  return (
    <section aria-labelledby="flow-title" className="flex min-h-0 flex-1 flex-col rounded-2xl border border-line bg-surface/60">
      <div className="flex items-start gap-3 border-b border-line px-4 py-3">
        <div className="mr-auto min-w-0">
          <h2 id="flow-title" className="font-display text-xl font-bold">
            {t('project.flow')}
          </h2>
          <p className="mt-0.5 text-xs leading-snug text-muted">{t('project.flowNote')}</p>
        </div>
        <button type="button" onClick={() => setFull(true)} className={SMALL_BUTTON}>
          {t('project.fullscreen')}
        </button>
      </div>
      <div data-print-expand="" className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3 [scrollbar-width:thin]">
        <FlowGraph steps={steps} />
      </div>
      <div className="flex justify-end border-t border-line px-4 py-2">
        <MascotRemark section="flow" seed={seed} own={lines} />
      </div>
      <Fullscreen title={t('project.flow')} open={full} onClose={() => setFull(false)}>
        <FlowGraph steps={steps} />
      </Fullscreen>
    </section>
  )
}

type Kind = 'flow' | 'architecture'

/** 窄螢幕：流程圖和架構圖合成一張卡。只有一張圖時不出現切換鈕。 */
export function DiagramCard({ flow, architecture, seed, lines }: { flow?: FlowStep[]; architecture?: ArchitectureStep[]; seed: string; lines?: string[] }) {
  const { t } = useLanguage()
  const kinds = [flow?.length ? 'flow' : null, architecture?.length ? 'architecture' : null].filter(Boolean) as Kind[]
  const [kind, setKind] = useState<Kind>(kinds[0])
  const [open, setOpen] = useState(false)
  const [full, setFull] = useState(false)
  // 內容比收合高度高，才需要淡出和「展開全部」。圖排好、換圖、改寬度時重新判斷。
  const [overflows, setOverflows] = useState(false)
  const card = useRef<HTMLElement>(null)
  const body = useRef<HTMLDivElement>(null)
  const inner = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const content = inner.current
    if (!content) return
    const check = () => {
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
      setOverflows(content.offsetHeight > COLLAPSED_REM * rem + 1)
    }
    check()
    const observer = new ResizeObserver(check)
    observer.observe(content)
    return () => observer.disconnect()
  }, [kind])

  const collapse = () => {
    setOpen(false)
    if (body.current) body.current.scrollTop = 0
    const top = card.current?.getBoundingClientRect().top ?? 0
    if (top < 0) card.current?.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }
  const pickKind = (next: Kind) => {
    setKind(next)
    if (body.current) body.current.scrollTop = 0
  }
  const label = (k: Kind) => (k === 'flow' ? t('project.tabFlow') : t('project.tabArchitecture'))
  const title = kind === 'flow' ? t('project.flow') : t('project.architecture')
  const diagram = kind === 'flow' ? <FlowGraph steps={flow!} /> : <ArchitectureFlow steps={architecture!} />

  return (
    <section ref={card} aria-labelledby="diagrams-title" className="rounded-2xl border border-line bg-surface">
      <div className="grid gap-3 border-b border-line px-4 py-3">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <h2 id="diagrams-title" className="mr-auto font-display text-xl font-bold">
            {kinds.length > 1 ? t('project.diagrams') : title}
          </h2>
          {kinds.length > 1 && (
            <div role="group" aria-label={t('project.diagrams')} className="inline-flex rounded-full border border-line bg-paper p-0.5">
              {kinds.map((k) => (
                <button
                  key={k}
                  type="button"
                  aria-pressed={kind === k}
                  onClick={() => pickKind(k)}
                  className={`rounded-full px-3 py-0.5 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent ${
                    kind === k ? 'bg-ink text-paper' : 'text-muted hover:text-ink'
                  }`}
                >
                  {label(k)}
                </button>
              ))}
            </div>
          )}
        </div>
        <p className="text-xs leading-snug text-muted">{kind === 'flow' ? t('project.flowNote') : t('project.architectureNote')}</p>
        <MascotRemark key={kind} section={kind} seed={seed} own={lines} pose={kind === 'architecture' ? 'wave' : 'idle'} />
      </div>
      <div ref={body} data-print-expand="" className="relative overflow-hidden" style={open ? undefined : { maxHeight: `${COLLAPSED_REM}rem` }}>
        <div ref={inner} className="p-3 sm:p-4">
          {diagram}
          {kind === 'architecture' && <p className="mt-4 font-mono text-[11px] text-muted">{t('project.diagramHint')}</p>}
        </div>
        {!open && overflows && <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-surface/0 to-surface" aria-hidden="true" />}
      </div>
      <div className="flex flex-wrap items-center gap-2 border-t border-line px-4 py-3">
        {overflows && (
          <button type="button" aria-expanded={open} onClick={() => (open ? collapse() : setOpen(true))} className={SMALL_BUTTON}>
            {open ? t('project.collapse') : t('project.expand')}
          </button>
        )}
        <button type="button" onClick={() => setFull(true)} className={SMALL_BUTTON}>
          {t('project.fullscreen')}
        </button>
      </div>
      <Fullscreen title={title} open={full} onClose={() => setFull(false)}>
        {diagram}
      </Fullscreen>
    </section>
  )
}
