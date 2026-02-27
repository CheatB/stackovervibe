import Link from 'next/link'
import { getQuestions } from '@/lib/payload'
import { generatePageMetadata } from '@/lib/seo'
import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav'
import { FeedCard } from '@/components/cards/FeedCard'
import type { FeedItem } from '@/components/cards/FeedCard'

export const metadata = generatePageMetadata({
  title: 'Вопросы',
  description: 'Вопросы и ответы по вайбкодингу. Задавайте вопросы, делитесь опытом, помогайте другим.',
  url: '/questions',
})

export default async function QuestionsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageStr } = await searchParams
  const страница = Math.max(1, Number(pageStr) || 1)
  const { docs, totalPages } = await getQuestions(страница, 20)

  const элементы: FeedItem[] = docs.map((в) => {
    const автор = typeof в.author === 'object' ? в.author : null
    return {
      id: в.id,
      type: 'question',
      title: в.title,
      slug: в.slug,
      url: `/questions/${в.slug}`,
      excerpt: '',
      votes: ((в.likes as number) || 0) - ((в.dislikes as number) || 0),
      views: (в.views as number) || 0,
      answersCount: (в.answersCount as number) || 0,
      tags: Array.isArray(в.tags)
        ? в.tags.filter((t: any) => typeof t === 'object').map((t: any) => ({ title: t.title, slug: t.slug }))
        : [],
      author: автор ? { displayName: (автор as any).displayName, telegramUsername: (автор as any).telegramUsername } : null,
      publishedAt: (в.publishedAt as string) || (в.createdAt as string),
      hasAcceptedAnswer: false,
    }
  })

  return (
    <div>
      <BreadcrumbNav items={[{ label: 'questions', href: '/questions' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
        <h1 className="text-2xl font-bold font-[family-name:var(--font-code)]">
          <span className="text-[var(--color-text-muted)]">$</span> ls questions/
        </h1>
        <Link
          href="/questions/ask"
          className="self-start sm:self-auto px-4 py-2 bg-[var(--color-primary)] text-[var(--color-bg)] font-bold text-sm rounded font-[family-name:var(--font-code)] hover:opacity-90 transition neon-primary"
        >
          + задать вопрос
        </Link>
      </div>

      {элементы.length === 0 ? (
        <p className="text-[var(--color-text-muted)] font-[family-name:var(--font-code)]">
          Пока нет вопросов. Будь первым!
        </p>
      ) : (
        <div className="space-y-3">
          {элементы.map((э) => (
            <FeedCard key={э.id} элемент={э} />
          ))}
        </div>
      )}

      {/* Пагинация */}
      {totalPages > 1 && (
        <nav className="flex justify-center gap-2 mt-8 font-[family-name:var(--font-code)] text-sm">
          {страница > 1 && (
            <Link
              href={`/questions?page=${страница - 1}`}
              className="px-3 py-1 border border-[var(--color-border)] rounded hover:border-[var(--color-primary)] transition-colors"
            >
              ← назад
            </Link>
          )}
          <span className="px-3 py-1 text-[var(--color-text-muted)]">
            {страница} / {totalPages}
          </span>
          {страница < totalPages && (
            <Link
              href={`/questions?page=${страница + 1}`}
              className="px-3 py-1 border border-[var(--color-border)] rounded hover:border-[var(--color-primary)] transition-colors"
            >
              далее →
            </Link>
          )}
        </nav>
      )}
    </div>
  )
}
