'use client'

import { Suspense } from 'react'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { DocumentTitleSync } from '@/components/DocumentTitleSync'
import SiteDataGate from '@/components/SiteDataGate'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <SiteDataGate>
        <Suspense fallback={null}>
          <DocumentTitleSync />
        </Suspense>
        {children}
      </SiteDataGate>
    </LanguageProvider>
  )
}
