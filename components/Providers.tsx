'use client'

import { LanguageProvider } from '@/contexts/LanguageContext'
import { DocumentTitleSync } from '@/components/DocumentTitleSync'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <DocumentTitleSync />
      {children}
    </LanguageProvider>
  )
}
