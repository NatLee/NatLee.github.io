'use client'

// 淺色 / 深色切換。初始值由 app/layout.tsx 的內嵌腳本在載入前決定（不閃），這裡只負責切換與記住選擇。
import { useEffect, useState } from 'react'
import Icon from '@/components/Icon'
import { useLanguage } from '@/contexts/LanguageContext'

export const THEME_STORAGE_KEY = 'natlee-theme'

type Theme = 'light' | 'dark'

function currentTheme(): Theme {
  const attr = document.documentElement.getAttribute('data-theme')
  if (attr === 'light' || attr === 'dark') return attr
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export default function ThemeToggle() {
  const { t } = useLanguage()
  const [theme, setTheme] = useState<Theme | null>(null)

  useEffect(() => {
    setTheme(currentTheme())
  }, [])

  const next: Theme = theme === 'dark' ? 'light' : 'dark'
  const label = theme === null ? t('nav.toDark') : next === 'dark' ? t('nav.toDark') : t('nav.toLight')

  function toggle() {
    document.documentElement.setAttribute('data-theme', next)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      // 無痕模式或停用儲存空間：這次有效，下次回到系統設定。
    }
    setTheme(next)
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="grid h-9 w-9 place-items-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-ink"
    >
      <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={18} />
    </button>
  )
}
