import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPostBySlug, getComments } from '@/lib/payload'
import { generatePageMetadata } from '@/lib/seo'
import { RichTextRenderer } from '@/components/content/RichTextRenderer'
import { JsonLd } from '@/components/seo/JsonLd'
import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav'
import { ReactionButtons } from '@/components/social/ReactionButtons'
import { CommentList } from '@/components/social/CommentList'
import { ShareButtons } from '@/components/social/ShareButtons'
import { ViewsTracker } from '@/components/ViewsTracker'

const САЙТ_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

interface ПараметрыСтраницы {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ПараметрыСтраницы): Promise<Metadata> {
  const { slug } = await params
  const пост = await getPostBySlug(slug)
  if (!пост) return { title: 'Не найдено' }

  return generatePageMetadata({
    title: пост.seoTitle || пост.title,
    description: пост.seoDescription || undefined,
    url: `/posts/${slug}`,
    type: 'article',
  })
}

export default async function PostSlugPage({ params }: ПараметрыСтраницы) {
  const { slug } = await params
  const пост = await getPostBySlug(slug)

  if (!пост) notFound()

  const автор = typeof пост.author === 'object' && пост.author ? пост.author : null
  const комментарииРав = await getComments('post', String(пост.id))
  const комментарии = комментарииРав.map((к) => ({
    id: к.id,
    text: (к.text as string) || '',
    author: к.author as { displayName?: string | null; telegramUsername?: string | null; avatarUrl?: string | null } | number | string,
    createdAt: (к.createdAt as string) || '',
  }))

  return (
    <article className="max-w-3xl mx-auto space-y-8">
      <ViewsTracker contentType="post" contentId={String(пост.id)} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: пост.title,
          url: `${САЙТ_URL}/posts/${пост.slug}`,
          ...(пост.publishedAt && { datePublished: пост.publishedAt }),
          ...(автор && { author: { '@type': 'Person', name: автор.displayName || автор.telegramUsername } }),
          publisher: { '@type': 'Organization', name: 'Stackovervibe' },
        }}
      />

      <BreadcrumbNav items={[
        { label: 'posts', href: '/posts' },
        { label: пост.title },
      ]} />

      <header>
        <h1 className="text-3xl md:text-4xl mb-4">{пост.title}</h1>
        <div className="flex items-center gap-4 text-sm text-[var(--color-text-muted)]">
          {автор && (
            <span className="flex items-center gap-2">
              {автор.avatarUrl && (
                <img src={автор.avatarUrl} alt="" className="w-6 h-6 rounded-full" />
              )}
              {автор.telegramUsername ? (
                <a href={`/profile/${автор.telegramUsername}`} className="hover:text-[var(--color-primary)]">
                  {автор.displayName || автор.telegramUsername}
                </a>
              ) : (
                <span>{автор.displayName || 'Аноним'}</span>
              )}
            </span>
          )}
          {пост.publishedAt && (
            <time>{new Date(пост.publishedAt).toLocaleDateString('ru-RU')}</time>
          )}
        </div>
      </header>

      {пост.content && <RichTextRenderer content={пост.content} />}

      <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-6 border-t border-[var(--color-border)]">
        <ReactionButtons
          contentType="post"
          contentId={String(пост.id)}
          likes={пост.likes ?? 0}
          dislikes={пост.dislikes ?? 0}
        />
        <ShareButtons url={`${САЙТ_URL}/posts/${пост.slug}`} title={пост.title} />
      </div>

      <section>
        <h2 className="text-xl mb-4">Комментарии ({комментарии.length})</h2>
        <CommentList
          comments={комментарии}
          contentType="post"
          contentId={String(пост.id)}
        />
      </section>
    </article>
  )
}
