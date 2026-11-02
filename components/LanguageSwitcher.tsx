'use client'

import { localeLabels, locales, type Locale } from '@/lib/i18n/config'
import { useLanguage } from '@/contexts/LanguageContext'

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useLanguage()

  return (
    <div className="flex items-center rounded-lg border border-line p-0.5" role="group" aria-label={t('nav.language')}>
      {locales.map((code) => (
        <button
          key={code}
          type="button"
          lang={code}
          onClick={() => setLocale(code as Locale)}
          aria-pressed={locale === code}
          className={`rounded-md px-2 py-1 text-xs font-semibold transition-colors ${
            locale === code ? 'bg-ink text-paper' : 'text-muted hover:text-ink'
          }`}
        >
          {localeLabels[code]}
        </button>
      ))}
    </div>
  )
}
