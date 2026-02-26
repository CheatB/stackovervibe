import { notFound } from 'next/navigation'
import { getTagBySlug, getFeedPage } from '@/lib/payload'
import { generatePageMetadata } from '@/lib/seo'
import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav'
import { FeedCard } from '@/components/cards/FeedCard'
import type { FeedItem } from '@/components/cards/FeedCard'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const тег = await getTagBySlug(slug)
  if (!тег) return {}

  return generatePageMetadata({
    title: (тег as any).seoTitle || `Тег: ${тег.title}`,
    description: (тег as any).seoDescription || (тег as any).description || `Контент с тегом "${тег.title}" на Stackovervibe`,
    url: `/tags/${тег.slug}`,
  })
}

export default async function TagPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const тег = await getTagBySlug(slug)
  if (!тег) notFound()

  /* Получить весь контент и отфильтровать по тегу */
  const лента = await getFeedPage({ type: 'all', sort: 'new', page: 1, limit: 100 })
  const отфильтрованные = лента.items.filter((элемент: FeedItem) =>
    элемент.tags.some((t) => t.slug === slug),
  )

  return (
    <div>
      <BreadcrumbNav items={[
        { label: 'tags', href: '/tags' },
        { label: slug, href: `/tags/${slug}` },
      ]} />

      <div className="mb-8">
        <h1 className="text-2xl font-bold font-[family-name:var(--font-code)] mb-2">
          <span className="text-[var(--color-accent)]">#</span>{тег.title}
        </h1>
        {(тег as any).description && (
          <p className="text-sm text-[var(--color-text-muted)] max-w-2xl">
            {(тег as any).description}
          </p>
        )}
        <p className="text-xs text-[var(--color-text-muted)] font-[family-name:var(--font-code)] mt-2">
          {отфильтрованные.length} {отфильтрованные.length === 1 ? 'запись' : 'записей'}
        </p>
      </div>

      {отфильтрованные.length === 0 ? (
        <p className="text-[var(--color-text-muted)] font-[family-name:var(--font-code)]">
          Контент с этим тегом пока не опубликован.
        </p>
      ) : (
        <div className="space-y-3">
          {отфильтрованные.map((э: FeedItem) => (
            <FeedCard key={э.id} элемент={э} />
          ))}
        </div>
      )}
    </div>
  )
}
