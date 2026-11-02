'use client'

// 切換語言時同步分頁標題（靜態匯出的 <title> 是英文）。
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import { getProjectById } from '@/data/projects'

function getProjectId(pathname: string): string | null {
  const match = pathname.match(/^\/projects\/([^/]+)\/?$/)
  return match ? match[1] : null
}

export function DocumentTitleSync() {
  const pathname = usePathname() ?? '/'
  const { locale, t } = useLanguage()

  useEffect(() => {
    const projectId = getProjectId(pathname)
    if (pathname === '/') document.title = t('meta.siteTitle')
    else if (pathname.startsWith('/about')) document.title = t('meta.aboutTitle')
    else if (pathname.startsWith('/experience')) document.title = t('meta.experienceTitle')
    else if (pathname.startsWith('/valhalla')) document.title = t('meta.valhallaTitle')
    else if (projectId) {
      const project = getProjectById(projectId, locale)
      document.title = project ? `${project.title} | Nat Lee` : t('meta.projectsTitle')
    } else if (pathname.startsWith('/projects')) document.title = t('meta.projectsTitle')
  }, [pathname, locale, t])

  return null
}
