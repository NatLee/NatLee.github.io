'use client'

import Image from 'next/image'
import Icon from './Icon'

interface Article {
  imgSrc: string
  link: string
  title: string
  description: string
}

interface PortfolioTileProps {
  article: Article
}

export default function PortfolioTile({ article }: PortfolioTileProps) {
  // 判斷是否應該使用圖標而不是圖片
  const shouldUseIcon = 
    article.imgSrc.includes('pypi.png') || 
    article.imgSrc.includes('github.png') ||
    article.title.toLowerCase().includes('github') ||
    article.title.toLowerCase().includes('tool')

  // 根據標題選擇合適的圖標
  const getIconName = (title: string) => {
    const lowerTitle = title.toLowerCase()
    if (lowerTitle.includes('github')) return 'github'
    if (lowerTitle.includes('medium')) return 'medium'
    if (lowerTitle.includes('linkedin')) return 'linkedin'
    if (lowerTitle.includes('kaggle')) return 'kaggle'
    if (lowerTitle.includes('leetcode')) return 'leetcode'
    if (lowerTitle.includes('hugging face')) return 'huggingface'
    if (lowerTitle.includes('tool') || lowerTitle.includes('pypi')) return 'default'
    return 'default'
  }

  return (
    <article className="tile group">
      <div className="relative overflow-hidden rounded-lg">
        {shouldUseIcon ? (
          <div className="tile-image bg-gray-800 flex items-center justify-center">
            <Icon 
              name={getIconName(article.title)} 
              className="text-white w-24 h-24"
              size={96}
            />
          </div>
        ) : (
          <Image
            src={article.imgSrc}
            alt={article.title}
            width={400}
            height={360}
            className="tile-image"
          />
        )}
        <div className="tile-overlay group-hover:bg-opacity-80"></div>
        
        <a
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          className="tile-content"
        >
          <h3 className="tile-title">{article.title}</h3>
          <div className="tile-description">
            <p className="text-sm leading-relaxed">{article.description}</p>
          </div>
        </a>
      </div>
    </article>
  )
}