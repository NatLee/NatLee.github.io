'use client'

import { JsonLd } from '@/components/JsonLd'
import { personalInfo } from '@/data/personal'

export function PersonJsonLd() {
  const sameAs = personalInfo.socialLinks.map((link) => link.url)

  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: personalInfo.nameEn,
        alternateName: personalInfo.name,
        jobTitle: personalInfo.title,
        email: personalInfo.email,
        url: 'https://natlee.github.io',
        image: personalInfo.avatar,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Taipei',
          addressCountry: 'TW',
        },
        sameAs,
      }}
    />
  )
}
