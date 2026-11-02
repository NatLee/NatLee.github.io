'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import { getProjectById } from '@/data/projects'
import { getPersonalInfo } from '@/data/personal'

export function DocumentTitleSync() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const projectId = pathname.startsWith('/projects/view') ? searchParams.get('id') : null
  const { locale, t } = useLanguage()

  useEffect(() => {
    const name = getPersonalInfo(locale).displayName
    if (pathname === '/') document.title = t('meta.siteTitle', { name })
    else if (pathname.startsWith('/about')) document.title = t('meta.aboutTitle', { name })
    else if (pathname.startsWith('/experience')) document.title = t('meta.experienceTitle', { name })
    else if (projectId) {
      // Keep the correct per-project tab title (and localize it) instead of
      // overwriting it with the generic projects-list title.
      const project = getProjectById(projectId, locale)
      document.title = project
        ? t('meta.projectTitle', { title: project.title, name })
        : t('meta.projectsTitle', { name })
    } else if (pathname.startsWith('/projects')) document.title = t('meta.projectsTitle', { name })
  }, [pathname, projectId, locale, t])

  return null
}
