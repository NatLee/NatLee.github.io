'use client'

import PortfolioTile from './PortfolioTile'

interface Article {
  imgSrc: string
  link: string
  title: string
  description: string
}

interface PortfolioSectionProps {
  title: string
  articles: Article[]
}

export default function PortfolioSection({ title, articles }: PortfolioSectionProps) {
  return (
    <section className="mb-20">
      <h2 className="section-header">{title}</h2>
      <div className="tiles-grid">
        {articles.map((article, index) => (
          <PortfolioTile key={index} article={article} />
        ))}
      </div>
    </section>
  )
}
