import type { Metadata } from 'next'

const САЙТ = 'Stackovervibe'
const ДЕФОЛТ_ОПИСАНИЕ = 'Структурированная база знаний по вайбкодингу. Гайды, инструменты, конфиги — всё в одном месте.'
const САЙТ_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

/** Генерирует полный объект Metadata для страницы */
export function generatePageMetadata(options: {
  title: string
  description?: string
  image?: string
  url?: string
  type?: 'website' | 'article'
}): Metadata {
  const { title, description = ДЕФОЛТ_ОПИСАНИЕ, image, url, type = 'website' } = options

  const fullTitle = `${title} — ${САЙТ}`
  const ogImage = image || `${САЙТ_URL}/og-default.png`

  return {
    title,
    description,
    openGraph: {
      title: fullTitle,
      description,
      url: url ? `${САЙТ_URL}${url}` : САЙТ_URL,
      siteName: САЙТ,
      type,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'ru_RU',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
    },
  }
}
