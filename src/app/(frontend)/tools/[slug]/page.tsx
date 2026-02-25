import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getToolBySlug, getRelatedTools, getTools } from '@/lib/payload'
import { RichTextRenderer } from '@/components/content/RichTextRenderer'
import { CodeBlock } from '@/components/content/CodeBlock'
import { ToolCard } from '@/components/cards/ToolCard'

/** Статическая генерация — все опубликованные инструменты */
export async function generateStaticParams() {
  const инструменты = await getTools()
  return инструменты.map((и) => ({ slug: и.slug }))
}

/** Маппинг типов → лейблы и цвета */
const типИнструмента: Record<string, { лейбл: string; цвет: string }> = {
  skill: { лейбл: 'Скилл', цвет: 'var(--color-primary)' },
  hook: { лейбл: 'Хук', цвет: 'var(--color-secondary)' },
  command: { лейбл: 'Команда', цвет: 'var(--color-accent)' },
  rule: { лейбл: 'Правило', цвет: 'var(--color-danger)' },
}

interface ПараметрыСтраницы {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ПараметрыСтраницы): Promise<Metadata> {
  const { slug } = await params
  const инструмент = await getToolBySlug(slug)
  if (!инструмент) return { title: 'Не найдено' }

  return {
    title: инструмент.seoTitle || инструмент.title,
    description: инструмент.seoDescription || инструмент.shortDescription || undefined,
  }
}

export default async function ToolSlugPage({ params }: ПараметрыСтраницы) {
  const { slug } = await params
  const инструмент = await getToolBySlug(slug)

  if (!инструмент) notFound()

  const инфоТипа = типИнструмента[инструмент.toolType] ?? {
    лейбл: инструмент.toolType,
    цвет: 'var(--color-text-muted)',
  }

  const категорияId =
    typeof инструмент.category === 'object' && инструмент.category
      ? инструмент.category.id
      : undefined

  const связанные = await getRelatedTools(инструмент.id, категорияId)

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Хлебные крошки */}
      <nav className="text-sm text-[var(--color-text-muted)]">
        <Link href="/tools" className="hover:text-[var(--color-primary)]">
          Инструменты
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--color-text)]">{инструмент.title}</span>
      </nav>

      {/* Шапка */}
      <header className="space-y-3">
        <div className="flex items-center gap-3 flex-wrap">
          <span
            className="px-2 py-0.5 text-xs rounded font-[family-name:var(--font-code)] border"
            style={{ color: инфоТипа.цвет, borderColor: инфоТипа.цвет }}
          >
            {инфоТипа.лейбл}
          </span>
          {typeof инструмент.category === 'object' && инструмент.category && (
            <span className="text-xs text-[var(--color-text-muted)]">
              {инструмент.category.title}
            </span>
          )}
          {инструмент.githubUrl && (
            <a
              href={инструмент.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[var(--color-accent)] hover:text-[var(--color-primary)]"
            >
              GitHub →
            </a>
          )}
        </div>
        <h1 className="text-3xl md:text-4xl">{инструмент.title}</h1>
        {инструмент.shortDescription && (
          <p className="text-lg text-[var(--color-text-muted)]">
            {инструмент.shortDescription}
          </p>
        )}
      </header>

      {/* Код инструмента */}
      {инструмент.code && (
        <section>
          <h2 className="text-xl mb-3">Код</h2>
          <CodeBlock code={инструмент.code} language="yaml" filename={`${инструмент.slug}.yml`} />
        </section>
      )}

      {/* Полное описание */}
      {инструмент.description && (
        <section>
          <h2 className="text-xl mb-3">Описание</h2>
          <RichTextRenderer content={инструмент.description} />
        </section>
      )}

      {/* Инструкция по установке */}
      {инструмент.installGuide && (
        <section>
          <h2 className="text-xl mb-3">Установка</h2>
          <RichTextRenderer content={инструмент.installGuide} />
        </section>
      )}

      {/* Частые проблемы */}
      {инструмент.commonProblems && (
        <section>
          <h2 className="text-xl mb-3">Частые проблемы</h2>
          <RichTextRenderer content={инструмент.commonProblems} />
        </section>
      )}

      {/* Поля по типу */}
      {инструмент.toolType === 'skill' && инструмент.skillFields && (
        <>
          {инструмент.skillFields.workflow && (
            <section>
              <h2 className="text-xl mb-3">Workflow</h2>
              <RichTextRenderer content={инструмент.skillFields.workflow} />
            </section>
          )}
          {инструмент.skillFields.examples && (
            <section>
              <h2 className="text-xl mb-3">Примеры</h2>
              <RichTextRenderer content={инструмент.skillFields.examples} />
            </section>
          )}
        </>
      )}

      {инструмент.toolType === 'hook' && инструмент.hookFields && (
        <section className="p-4 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-card)]">
          <h2 className="text-xl mb-3">Параметры хука</h2>
          <dl className="space-y-2 text-sm">
            {инструмент.hookFields.trigger && (
              <div className="flex gap-2">
                <dt className="text-[var(--color-text-muted)]">Триггер:</dt>
                <dd className="font-[family-name:var(--font-code)] text-[var(--color-secondary)]">
                  {инструмент.hookFields.trigger}
                </dd>
              </div>
            )}
            {инструмент.hookFields.condition && (
              <div className="flex gap-2">
                <dt className="text-[var(--color-text-muted)]">Условие:</dt>
                <dd className="font-[family-name:var(--font-code)]">
                  {инструмент.hookFields.condition}
                </dd>
              </div>
            )}
          </dl>
          {инструмент.hookFields.hookCommand && (
            <div className="mt-3">
              <CodeBlock code={инструмент.hookFields.hookCommand} language="bash" />
            </div>
          )}
        </section>
      )}

      {инструмент.toolType === 'command' && инструмент.commandFields && (
        <section className="p-4 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-card)]">
          <h2 className="text-xl mb-3">Параметры команды</h2>
          {инструмент.commandFields.syntax && (
            <div className="mb-2">
              <span className="text-sm text-[var(--color-text-muted)]">Синтаксис: </span>
              <code className="text-sm text-[var(--color-accent)]">
                {инструмент.commandFields.syntax}
              </code>
            </div>
          )}
          {инструмент.commandFields.args && (
            <div>
              <span className="text-sm text-[var(--color-text-muted)]">Аргументы: </span>
              <span className="text-sm">{инструмент.commandFields.args}</span>
            </div>
          )}
        </section>
      )}

      {/* Теги */}
      {Array.isArray(инструмент.tags) && инструмент.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {инструмент.tags.map((тег: { id: number | string; title: string }) => (
            <span
              key={тег.id}
              className="px-2 py-1 text-xs border border-[var(--color-border)] rounded text-[var(--color-text-muted)]"
            >
              #{тег.title}
            </span>
          ))}
        </div>
      )}

      {/* Связанные инструменты */}
      {связанные.length > 0 && (
        <section>
          <h2 className="text-xl mb-4">Похожие инструменты</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {связанные.map((инстр) => (
              <ToolCard
                key={инстр.id}
                заголовок={инстр.title}
                slug={инстр.slug}
                тип={инстр.toolType}
                описание={инстр.shortDescription}
                категория={null}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
