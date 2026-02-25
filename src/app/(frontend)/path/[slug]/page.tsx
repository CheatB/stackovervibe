import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getGuideBySlug, getPathGuides } from '@/lib/payload'
import { RichTextRenderer } from '@/components/content/RichTextRenderer'

interface ПараметрыСтраницы {
  params: Promise<{ slug: string }>
}

/** Генерация метаданных для SEO */
export async function generateMetadata({ params }: ПараметрыСтраницы): Promise<Metadata> {
  const { slug } = await params
  const гайд = await getGuideBySlug(slug)
  if (!гайд) return { title: 'Не найдено' }

  return {
    title: гайд.seoTitle || гайд.title,
    description: гайд.seoDescription || гайд.excerpt || undefined,
  }
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
      {/* Хлебные крошки */}
      <nav className="text-sm text-[var(--color-text-muted)]">
        <Link href="/path" className="hover:text-[var(--color-primary)]">
          Путь новичка
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--color-text)]">{гайд.title}</span>
      </nav>

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
