'use client'

import Link from 'next/link'
import Icon from '@/components/Icon'
import Tapi from '@/components/tapi/Tapi'
import { useLanguage } from '@/contexts/LanguageContext'

export default function NotFound() {
  const { t } = useLanguage()
  return (
    <main id="main" tabIndex={-1} className="shell grid min-h-[60vh] place-items-center py-20 focus:outline-none">
      <div className="grid max-w-xl justify-items-start gap-6 md:grid-cols-[auto_minmax(0,1fr)] md:items-center md:gap-10">
        <Tapi pose="surprised" size={130} label="Tapi" />
        <div>
          <p className="font-pixel text-sm text-accent">404</p>
          <h1 className="mt-2 font-display text-4xl font-bold">{t('notFound.title')}</h1>
          <p className="mt-3 text-muted">{t('notFound.body')}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/" className="btn-primary">
              {t('notFound.home')}
            </Link>
            <Link href="/projects/" className="btn-ghost">
              {t('notFound.projects')}
            </Link>
          </div>
          <p className="mt-6 text-sm">
            <Link href="/valhalla/" className="link inline-flex items-center gap-1">
              {t('notFound.valhalla')} <Icon name="arrow" size={14} />
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
