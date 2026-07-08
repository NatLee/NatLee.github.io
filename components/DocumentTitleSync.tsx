'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import { getProjectById } from '@/data/projects'

// Pull the id segment out of `/projects/<id>/` (trailingSlash export) or `/projects/<id>`.
function getProjectId(pathname: string): string | null {
  const match = pathname.match(/^\/projects\/([^/]+)\/?$/)
  return match ? match[1] : null
}

export function DocumentTitleSync() {
  const pathname = usePathname()
  const { locale, t } = useLanguage()

  useEffect(() => {
    const projectId = getProjectId(pathname)
    if (pathname === '/') document.title = t('meta.siteTitle')
    else if (pathname.startsWith('/about')) document.title = t('meta.aboutTitle')
    else if (pathname.startsWith('/experience')) document.title = t('meta.experienceTitle')
    else if (projectId) {
      // Keep the correct per-project tab title (and localize it) instead of
      // overwriting it with the generic projects-list title.
      const project = getProjectById(projectId, locale)
      document.title = project ? `${project.title} | Nat Lee` : t('meta.projectsTitle')
    } else if (pathname.startsWith('/projects')) document.title = t('meta.projectsTitle')
  }, [pathname, locale, t])

  return null
}
