'use client'

// 全站頁首：品牌、三個主要頁面、語言、主題、鍵盤快捷鍵。
// 單鍵快捷鍵（1–4、/、?）預設開啟，可以在快捷鍵面板關掉（WCAG 2.1.4），設定存在這個瀏覽器。
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import Icon from '@/components/Icon'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import ThemeToggle from '@/components/site/ThemeToggle'
import { useLanguage } from '@/contexts/LanguageContext'

const NAV = [
  { href: '/projects/', key: 'projects' },
  { href: '/about/', key: 'about' },
  { href: '/experience/', key: 'experience' },
] as const

const SHORTCUT_ROUTES: Record<string, string> = { '1': '/', '2': '/projects/', '3': '/about/', '4': '/experience/' }
const SHORTCUTS_KEY = 'natlee-shortcuts'
/** 頁尾的「鍵盤快捷鍵」按鈕用這個事件打開面板。 */
export const OPEN_SHORTCUTS_EVENT = 'natlee:open-shortcuts'

function isTyping(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
}

export default function SiteHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const { t } = useLanguage()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [enabled, setEnabled] = useState(true)

  useEffect(() => {
    try {
      setEnabled(localStorage.getItem(SHORTCUTS_KEY) !== 'off')
    } catch {
      // 讀不到就維持預設
    }
  }, [])

  const openPanel = useCallback(() => dialogRef.current?.showModal(), [])

  function setShortcuts(on: boolean) {
    setEnabled(on)
    try {
      localStorage.setItem(SHORTCUTS_KEY, on ? 'on' : 'off')
    } catch {
      // 只在這次有效
    }
  }

  useEffect(() => {
    window.addEventListener(OPEN_SHORTCUTS_EVENT, openPanel)
    return () => window.removeEventListener(OPEN_SHORTCUTS_EVENT, openPanel)
  }, [openPanel])

  useEffect(() => {
    if (!enabled) return
    function onKey(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey || isTyping(event.target)) return
      if (dialogRef.current?.open) return
      if (SHORTCUT_ROUTES[event.key]) {
        event.preventDefault()
        router.push(SHORTCUT_ROUTES[event.key])
      } else if (event.key === '/') {
        const search = document.getElementById('project-search')
        event.preventDefault()
        if (search) search.focus()
        else router.push('/projects/')
      } else if (event.key === '?') {
        event.preventDefault()
        openPanel()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [enabled, router, openPanel])

  const isActive = (href: string) => pathname?.startsWith(href.replace(/\/$/, ''))

  const links = NAV.map((item) => (
    <li key={item.href}>
      <Link
        href={item.href}
        aria-current={isActive(item.href) ? 'page' : undefined}
        className={`relative rounded-md px-3 py-2 text-sm font-medium transition-colors ${
          isActive(item.href) ? 'text-ink' : 'text-muted hover:text-ink'
        }`}
      >
        {t(`nav.${item.key}`)}
        {isActive(item.href) && <span className="absolute inset-x-3 -bottom-[11px] h-0.5 rounded-full bg-accent-fill" aria-hidden="true" />}
      </Link>
    </li>
  ))

  const rows: [string, string][] = [
    ['1', t('shortcuts.home')],
    ['2', t('shortcuts.projects')],
    ['3', t('shortcuts.about')],
    ['4', t('shortcuts.experience')],
    ['/', t('shortcuts.search')],
    ['?', t('shortcuts.help')],
  ]

  return (
    <header
      className="no-print sticky top-0 z-40 border-b border-line/80 bg-paper/90 backdrop-blur"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <div className="shell flex h-14 items-center gap-4">
        <Link href="/" className="font-display text-lg font-bold tracking-tight">
          Nat Lee
        </Link>
        <nav aria-label={t('nav.primary')} className="ml-4 hidden sm:block">
          <ul className="flex items-center gap-1">{links}</ul>
        </nav>
        <div className="ml-auto flex items-center gap-1.5">
          <LanguageSwitcher />
          <ThemeToggle />
          <button
            type="button"
            onClick={openPanel}
            aria-label={t('nav.shortcuts')}
            title={t('nav.shortcuts')}
            className="hidden h-9 w-9 place-items-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-ink md:grid"
          >
            <Icon name="keyboard" size={18} />
          </button>
        </div>
      </div>
      <nav aria-label={t('nav.primary')} className="shell -mt-1 pb-2 sm:hidden">
        <ul className="flex items-center gap-1">{links}</ul>
      </nav>

      <dialog
        ref={dialogRef}
        aria-labelledby="shortcuts-title"
        className="w-[min(26rem,calc(100vw-2rem))] rounded-2xl border border-line bg-surface p-0 text-ink shadow-2xl backdrop:bg-ink/40"
      >
        <div className="p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 id="shortcuts-title" className="font-display text-xl font-bold">
              {t('shortcuts.title')}
            </h2>
            <form method="dialog">
              <button type="submit" aria-label={t('shortcuts.close')} className="grid h-8 w-8 place-items-center rounded-md text-muted hover:bg-paper hover:text-ink">
                <Icon name="close" size={18} />
              </button>
            </form>
          </div>
          <label className="mt-5 flex items-center justify-between gap-4 rounded-xl border border-line bg-paper px-4 py-3">
            <span className="text-sm font-semibold">{t('shortcuts.toggle')}</span>
            <span className="flex items-center gap-2 text-sm text-muted">
              {enabled ? t('shortcuts.on') : t('shortcuts.off')}
              <input
                id="shortcuts-enabled"
                type="checkbox"
                role="switch"
                checked={enabled}
                onChange={(event) => setShortcuts(event.target.checked)}
                className="h-5 w-5 accent-[rgb(var(--accent-fill))]"
              />
            </span>
          </label>
          <p className="mt-2 text-xs leading-relaxed text-muted">{t('shortcuts.hint')}</p>
          <dl className={`mt-5 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm ${enabled ? '' : 'opacity-50'}`}>
            {rows.map(([key, label]) => (
              <div key={key} className="contents">
                <dt>
                  <kbd className="inline-grid h-6 min-w-6 place-items-center rounded border border-line bg-paper px-1.5 font-mono text-xs">{key}</kbd>
                </dt>
                <dd className="self-center text-muted">{label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </dialog>
    </header>
  )
}
