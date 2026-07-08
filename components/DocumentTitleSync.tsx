'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'

export function DocumentTitleSync() {
  const pathname = usePathname()
  const { t } = useLanguage()

  useEffect(() => {
    if (pathname === '/') document.title = t('meta.siteTitle')
    else if (pathname.startsWith('/about')) document.title = t('meta.aboutTitle')
    else if (pathname.startsWith('/experience')) document.title = t('meta.experienceTitle')
    else if (pathname.startsWith('/projects/') && pathname !== '/projects/') {
      document.title = t('meta.projectsTitle')
    } else if (pathname.startsWith('/projects')) document.title = t('meta.projectsTitle')
  }, [pathname, t])

  return null
}
