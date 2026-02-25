import type { Metadata } from 'next'
import Link from 'next/link'
import { getPosts } from '@/lib/payload'
import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav'

export const metadata: Metadata = {
  title: 'Посты',
  description: 'Статьи сообщества Stackovervibe о вайбкодинге',
}

interface ПараметрыПоиска {
  searchParams: Promise<{ page?: string }>
}

export default async function PostsPage({ searchParams }: ПараметрыПоиска) {
  const { page } = await searchParams
  const номерСтраницы = Math.max(1, Number(page) || 1)
  const { docs: посты, totalPages } = await getPosts(номерСтраницы)

  return (
    <div className="space-y-8">
      <BreadcrumbNav items={[{ label: 'posts' }]} />
      <div>
        <h1 className="text-3xl md:text-4xl mb-4">Посты</h1>
        <p className="text-[var(--color-text-muted)] max-w-2xl">
          Статьи сообщества о вайбкодинге. Делись опытом — пиши свой пост.
        </p>
      </div>

      {посты.length === 0 ? (
        <div className="p-8 border border-[var(--color-border)] rounded-lg text-center">
          <p className="text-[var(--color-text-muted)] font-[family-name:var(--font-code)]">
            {'>'} Пока нет постов. Будь первым!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {посты.map((пост) => {
            const автор = typeof пост.author === 'object' && пост.author ? пост.author : null
            return (
              <Link
                key={пост.id}
                href={`/posts/${пост.slug}`}
                className="group flex flex-col p-5 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-card)] hover:border-[var(--color-primary)] transition-colors"
              >
                <div className="flex items-center gap-3 mb-2 text-xs text-[var(--color-text-muted)]">
                  {автор && (
                    <span>
                      {автор.avatarUrl && (
                        <img
                          src={автор.avatarUrl}
                          alt=""
                          className="inline w-5 h-5 rounded-full mr-1 align-middle"
                        />
                      )}
                      {автор.displayName || автор.telegramUsername || 'Аноним'}
                    </span>
                  )}
                  {пост.publishedAt && (
                    <time>{new Date(пост.publishedAt).toLocaleDateString('ru-RU')}</time>
                  )}
                  {typeof пост.category === 'object' && пост.category && (
                    <span className="text-[var(--color-accent)]">{пост.category.title}</span>
                  )}
                </div>
                <h2 className="text-lg group-hover:text-[var(--color-primary)] transition-colors">
                  {пост.title}
                </h2>
              </Link>
            )
          })}
        </div>
      )}

      {/* Пагинация */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 font-[family-name:var(--font-code)] text-sm">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((с) => (
            <Link
              key={с}
              href={`/posts?page=${с}`}
              className={`px-3 py-1 rounded border transition-colors ${
                с === номерСтраницы
                  ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                  : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-text-muted)]'
              }`}
            >
              {с}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
