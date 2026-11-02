'use client'

import { useEffect, useRef, useState } from 'react'
import Icon from '@/components/Icon'
import { useLanguage } from '@/contexts/LanguageContext'

interface Props {
  /** 要複製的文字。 */
  value: string
  label?: string
  className?: string
}

/** 複製到剪貼簿，按下後短暫顯示「已複製」。剪貼簿不能用時安靜地什麼都不做。 */
export default function CopyButton({ value, label, className = '' }: Props) {
  const { t } = useLanguage()
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    []
  )

  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), 1600)
    } catch {
      // 非安全來源或沒有權限
    }
  }

  const idle = label ?? t('common.copy')

  return (
    <button
      type="button"
      onClick={copy}
      title={idle}
      aria-label={copied ? t('common.copied') : idle}
      className={`grid h-8 w-8 place-items-center rounded-md transition-colors ${
        copied ? 'text-clip' : 'text-muted hover:bg-surface hover:text-ink'
      } ${className}`}
    >
      <Icon name={copied ? 'check' : 'copy'} size={15} />
      <span className="sr-only" aria-live="polite">
        {copied ? t('common.copied') : ''}
      </span>
    </button>
  )
}
