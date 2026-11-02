import { JsonLd } from '@/components/JsonLd'
import { personalInfo } from '@/data/personal'

export function PersonJsonLd() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: personalInfo.nameEn,
        alternateName: personalInfo.name,
        jobTitle: personalInfo.title,
        description: personalInfo.description,
        email: `mailto:${personalInfo.email}`,
        url: 'https://natlee.github.io',
        image: personalInfo.avatar,
        knowsLanguage: ['zh-TW', 'ja', 'en'],
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Taipei',
          addressCountry: 'TW',
        },
        sameAs: personalInfo.socialLinks.map((link) => link.url),
      }}
    />
  )
}
