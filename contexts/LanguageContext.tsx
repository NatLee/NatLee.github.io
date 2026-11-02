'use client'

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { defaultLocale, isLocale, type Locale } from '@/lib/i18n/config'
import enMessages from '@/messages/en.json'
import zhMessages from '@/messages/zh-TW.json'

type Messages = typeof enMessages

const messageMap: Record<Locale, Messages> = {
  en: enMessages,
  'zh-TW': zhMessages,
}

const STORAGE_KEY = 'natlee-portfolio-locale'

interface LanguageContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string, params?: Record<string, string | number>) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function getNestedValue(obj: Record<string, unknown>, path: string): string | undefined {
  const value = path.split('.').reduce<unknown>((current, segment) => {
    if (current && typeof current === 'object' && segment in (current as Record<string, unknown>)) {
      return (current as Record<string, unknown>)[segment]
    }
    return undefined
  }, obj)

  return typeof value === 'string' ? value : undefined
}

function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) return template
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(params[key] ?? `{${key}}`))
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    let stored: string | null = null
    try {
      stored = localStorage.getItem(STORAGE_KEY)
    } catch {
      stored = null
    }

    // Default to English; only an explicit, stored user choice overrides it.
    if (stored && isLocale(stored)) {
      setLocaleState(stored)
    }
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    document.documentElement.lang = locale === 'zh-TW' ? 'zh-TW' : 'en'
  }, [locale, mounted])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    // Persist only explicit user choices so the site keeps following the
    // browser preference until the visitor deliberately picks a language.
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Ignore storage failures (private mode, disabled storage, etc.).
    }
  }, [])

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      const messages = messageMap[locale] as Record<string, unknown>
      const value = getNestedValue(messages, key) ?? getNestedValue(messageMap.en as Record<string, unknown>, key)
      return interpolate(value ?? key, params)
    },
    [locale]
  )

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
