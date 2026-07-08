'use client'

import { localeLabels, locales, type Locale } from '@/lib/i18n/config'
import { useLanguage } from '@/contexts/LanguageContext'

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage()

  return (
    <div
      className="flex items-center h-full border-l border-gray-800"
      role="group"
      aria-label="Language selector"
    >
      {locales.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLocale(code as Locale)}
          aria-pressed={locale === code}
          className={`h-full px-2 lg:px-3 text-[10px] lg:text-xs font-bold transition-colors ${
            locale === code
              ? 'text-secondary bg-gray-900'
              : 'text-gray-600 hover:text-white hover:bg-gray-900/50'
          }`}
        >
          {localeLabels[code]}
        </button>
      ))}
    </div>
  )
}
