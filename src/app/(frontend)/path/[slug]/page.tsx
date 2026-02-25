import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getGuideBySlug, getPathGuides } from '@/lib/payload'
import { generatePageMetadata } from '@/lib/seo'
import { RichTextRenderer } from '@/components/content/RichTextRenderer'
import { JsonLd } from '@/components/seo/JsonLd'
import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav'
import { ReactionButtons } from '@/components/social/ReactionButtons'
import { CommentList } from '@/components/social/CommentList'
import { ShareButtons } from '@/components/social/ShareButtons'

const САЙТ_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

interface ПараметрыСтраницы {
  params: Promise<{ slug: string }>
}

/** Генерация метаданных для SEO */
export async function generateMetadata({ params }: ПараметрыСтраницы): Promise<Metadata> {
  const { slug } = await params
  const гайд = await getGuideBySlug(slug)
  if (!гайд) return { title: 'Не найдено' }

  return generatePageMetadata({
    title: гайд.seoTitle || гайд.title,
    description: гайд.seoDescription || гайд.excerpt || undefined,
    url: `/path/${slug}`,
    type: 'article',
  })
}

/** Статическая генерация — все опубликованные гайды из пути */
export async function generateStaticParams() {
  const гайды = await getPathGuides()
  return гайды.map((г) => ({ slug: г.slug }))
}

export default async function GuideSlugPage({ params }: ПараметрыСтраницы) {
  const { slug } = await params
  const гайд = await getGuideBySlug(slug)

  if (!гайд) notFound()

  /* Соседние гайды для навигации «предыдущий / следующий» */
  const всеГайды = await getPathGuides()
  const текущийИндекс = всеГайды.findIndex((г) => г.id === гайд.id)
  const предыдущий = текущийИндекс > 0 ? всеГайды[текущийИндекс - 1] : null
  const следующий =
    текущийИндекс >= 0 && текущийИндекс < всеГайды.length - 1
      ? всеГайды[текущийИндекс + 1]
      : null

  return (
    <article className="max-w-3xl mx-auto space-y-8">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: гайд.title,
          description: гайд.excerpt || undefined,
          url: `${САЙТ_URL}/path/${гайд.slug}`,
          publisher: { '@type': 'Organization', name: 'Stackovervibe' },
          ...(гайд.publishedAt && { datePublished: гайд.publishedAt }),
          ...(гайд.updatedAt && { dateModified: гайд.updatedAt }),
        }}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Главная', item: САЙТ_URL },
            { '@type': 'ListItem', position: 2, name: 'Путь новичка', item: `${САЙТ_URL}/path` },
            { '@type': 'ListItem', position: 3, name: гайд.title },
          ],
        }}
      />
      <BreadcrumbNav items={[
        { label: 'path', href: '/path' },
        { label: гайд.title },
      ]} />

      {/* Заголовок */}
      <header>
        {текущийИндекс >= 0 && (
          <span className="text-sm text-[var(--color-text-muted)] font-[family-name:var(--font-code)]">
            Шаг {текущийИндекс + 1} из {всеГайды.length}
          </span>
        )}
        <h1 className="text-3xl md:text-4xl mt-2">{гайд.title}</h1>
        {гайд.excerpt && (
          <p className="text-lg text-[var(--color-text-muted)] mt-3">{гайд.excerpt}</p>
        )}
      </header>

      {/* Контент */}
      {гайд.content && (
        <RichTextRenderer
          content={гайд.content}
          className="[&_h2]:text-2xl [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:text-xl [&_h3]:mt-8 [&_h3]:mb-3"
        />
      )}

      {/* Реакции и шеринг */}
      <div className="flex items-center justify-between pt-6 border-t border-[var(--color-border)]">
        <ReactionButtons contentType="guides" contentId={String(гайд.id)} />
        <ShareButtons title={гайд.title} url={`${САЙТ_URL}/path/${гайд.slug}`} />
      </div>

      {/* Комментарии */}
      <CommentList contentType="guides" contentId={String(гайд.id)} />

      {/* Навигация предыдущий/следующий */}
      <nav className="flex justify-between pt-8 border-t border-[var(--color-border)]">
        {предыдущий ? (
          <Link
            href={`/path/${предыдущий.slug}`}
            className="group flex flex-col text-left"
          >
            <span className="text-xs text-[var(--color-text-muted)]">← Назад</span>
            <span className="text-sm group-hover:text-[var(--color-primary)] transition-colors">
              {предыдущий.title}
            </span>
          </Link>
        ) : (
          <div />
        )}

        {следующий ? (
          <Link
            href={`/path/${следующий.slug}`}
            className="group flex flex-col text-right"
          >
            <span className="text-xs text-[var(--color-text-muted)]">Далее →</span>
            <span className="text-sm group-hover:text-[var(--color-primary)] transition-colors">
              {следующий.title}
            </span>
          </Link>
        ) : (
          <div />
        )}
      </nav>
    </article>
  )
}
