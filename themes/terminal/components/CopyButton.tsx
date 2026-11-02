'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

interface Props {
  /** The text to copy to the clipboard. */
  value: string
  /** Accessible label / tooltip for the idle state. */
  label?: string
  className?: string
}

/**
 * A small clipboard-copy button with a transient "copied" confirmation.
 * Falls back silently if the Clipboard API is unavailable.
 */
export default function CopyButton({ value, label, className = '' }: Props) {
  const { t } = useLanguage()
  const [copied, setCopied] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current)
  }, [])

  const handleCopy = async (event: React.MouseEvent) => {
    // Don't let the click bubble to an enclosing link/card.
    event.preventDefault()
    event.stopPropagation()
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setCopied(false), 1600)
    } catch {
      // Clipboard unavailable (insecure context / permissions) — no-op.
    }
  }

  const idleLabel = label ?? t('common.copy')

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={idleLabel}
      aria-label={copied ? t('common.copied') : idleLabel}
      className={`inline-flex items-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/60 rounded ${
        copied ? 'text-green-400' : 'text-gray-500 hover:text-secondary'
      } ${className}`}
    >
      <span aria-hidden="true">{copied ? '✓' : '⧉'}</span>
    </button>
  )
}
