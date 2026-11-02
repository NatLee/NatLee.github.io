'use client'

// 各頁共用的小元件：強調片語、區塊標題、外部連結、星數、主題標籤。
import type { ReactNode } from 'react'
import Icon from '@/components/Icon'
import { useLanguage } from '@/contexts/LanguageContext'

/** 把 **雙星號** 標起來的片語染成強調色。 */
export function Emphasis({ text }: { text: string }) {
  const parts = text.split('**')
  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <em key={index} className="not-italic text-accent">
            {part}
          </em>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  )
}

interface SectionHeaderProps {
  id?: string
  eyebrow?: string
  title: string
  intro?: string
  action?: ReactNode
}

export function SectionHeader({ id, eyebrow, title, intro, action }: SectionHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
      <div className="max-w-prose">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h2 id={id} className="section-title">
          {title}
        </h2>
        {intro && <p className="mt-3 text-lg text-muted">{intro}</p>}
      </div>
      {action}
    </div>
  )
}

interface ExternalLinkProps {
  href: string
  children: ReactNode
  className?: string
  icon?: boolean
}

export function ExternalLink({ href, children, className = 'link', icon = true }: ExternalLinkProps) {
  const { t } = useLanguage()
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
      {icon && <Icon name="external" size={14} className="ml-0.5 inline-block align-[-2px]" />}
      <span className="sr-only"> ({t('common.newTab')})</span>
    </a>
  )
}

/** `inherit`：放在深色按鈕裡時沿用按鈕的文字色，不用 muted（對比不夠）。 */
export function StarCount({ stars, tone = 'muted' }: { stars?: number; tone?: 'muted' | 'inherit' }) {
  const { t } = useLanguage()
  if (stars === undefined || stars < 1) return null
  return (
    <span
      className={`tabular inline-flex items-center gap-1 font-mono text-xs ${tone === 'muted' ? 'text-muted' : 'text-current opacity-85'}`}
      title={t('common.stars', { count: stars })}
    >
      <Icon name="star" size={13} className={tone === 'muted' ? 'text-accent-fill' : ''} />
      {stars}
      <span className="sr-only">{t('common.stars', { count: stars })}</span>
    </span>
  )
}

const themeDot: Record<string, string> = {
  energy: 'bg-accent-fill',
  infra: 'bg-clip',
  ai: 'bg-plum',
  libraries: 'bg-ink',
  web: 'bg-muted',
}

export function ThemeLabel({ theme }: { theme: string }) {
  const { t } = useLanguage()
  return (
    <span className="inline-flex items-center gap-2 font-mono text-xs text-muted">
      <span className={`h-2 w-2 rounded-full ${themeDot[theme] ?? 'bg-muted'}`} aria-hidden="true" />
      {t(`projects.themes.${theme}`)}
    </span>
  )
}
