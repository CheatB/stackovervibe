import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Поиск',
  description: 'Поиск по гайдам и инструментам Stackovervibe',
}

interface ПараметрыПоиска {
  searchParams: Promise<{ q?: string; type?: string; page?: string }>
}

interface РезультатПоиска {
  id: number | string
  title: string
  slug: string
  type: 'guide' | 'tool'
  excerpt?: string | null
  url: string
}

interface ОтветПоиска {
  results: РезультатПоиска[]
  total: number
  query: string
  page: number
}

async function искать(запрос: string, тип?: string, страница?: string): Promise<ОтветПоиска> {
  const { getPayloadClient } = await import('@/lib/payload')
  const payload = await getPayloadClient()

  const ЛИМИТ = 20
  const номерСтраницы = Math.max(1, Number(страница) || 1)
  const результаты: РезультатПоиска[] = []
  let итого = 0

  const искатьГайды = !тип || тип === 'guides' || тип === 'all'
  const искатьИнструменты = !тип || тип === 'tools' || тип === 'all'

  if (искатьГайды) {
    const { docs, totalDocs } = await payload.find({
      collection: 'guides',
      where: {
        status: { equals: 'published' },
        or: [
          { title: { contains: запрос } },
          { excerpt: { contains: запрос } },
        ],
      },
      limit: ЛИМИТ,
      page: номерСтраницы,
    })
    итого += totalDocs
    for (const гайд of docs) {
      результаты.push({
        id: гайд.id,
        title: гайд.title,
        slug: гайд.slug,
        type: 'guide',
        excerpt: гайд.excerpt,
        url: `/path/${гайд.slug}`,
      })
    }
  }

  if (искатьИнструменты) {
    const { docs, totalDocs } = await payload.find({
      collection: 'tools',
      where: {
        status: { equals: 'published' },
        or: [
          { title: { contains: запрос } },
          { shortDescription: { contains: запрос } },
        ],
      },
      limit: ЛИМИТ,
      page: номерСтраницы,
    })
    итого += totalDocs
    for (const инструмент of docs) {
      результаты.push({
        id: инструмент.id,
        title: инструмент.title,
        slug: инструмент.slug,
        type: 'tool',
        excerpt: инструмент.shortDescription,
        url: `/tools/${инструмент.slug}`,
      })
    }
  }

  return { results: результаты, total: итого, query: запрос, page: номерСтраницы }
}

const типЛейбл: Record<string, string> = {
  guide: 'Гайд',
  tool: 'Инструмент',
}

export default async function SearchPage({ searchParams }: ПараметрыПоиска) {
  const { q: запрос, type: тип, page: страница } = await searchParams
  const естьЗапрос = запрос && запрос.trim().length >= 2
  const данные = естьЗапрос ? await искать(запрос.trim(), тип, страница) : null

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl mb-4">Поиск</h1>
      </div>

      {/* Форма поиска */}
      <form action="/search" method="GET" className="flex gap-3">
        <input
          type="text"
          name="q"
          defaultValue={запрос ?? ''}
          placeholder="Что ищешь?"
          className="flex-1 px-4 py-2.5 rounded border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:border-[var(--color-primary)] outline-none font-[family-name:var(--font-code)]"
        />
        <button
          type="submit"
          className="px-6 py-2.5 rounded bg-[var(--color-primary)] text-[var(--color-bg)] font-bold hover:opacity-90 transition"
        >
          Найти
        </button>
      </form>

      {/* Фильтр по типу */}
      {естьЗапрос && (
        <div className="flex gap-2">
          {[
            { value: '', label: 'Все' },
            { value: 'guides', label: 'Гайды' },
            { value: 'tools', label: 'Инструменты' },
          ].map((ф) => (
            <Link
              key={ф.value}
              href={`/search?q=${encodeURIComponent(запрос)}${ф.value ? `&type=${ф.value}` : ''}`}
              className={`px-3 py-1.5 text-sm rounded border transition-colors ${
                (тип ?? '') === ф.value
                  ? 'border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-primary)]/10'
                  : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-text-muted)]'
              }`}
            >
              {ф.label}
            </Link>
          ))}
        </div>
      )}

      {/* Результаты */}
      {данные && (
        <>
          <p className="text-sm text-[var(--color-text-muted)]">
            Найдено: {данные.total} {данные.total === 1 ? 'результат' : 'результатов'}
          </p>

          {данные.results.length === 0 ? (
            <div className="p-8 border border-[var(--color-border)] rounded-lg text-center">
              <p className="text-[var(--color-text-muted)] font-[family-name:var(--font-code)]">
                {'>'} Ничего не найдено по запросу &quot;{данные.query}&quot;
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {данные.results.map((результат) => (
                <Link
                  key={`${результат.type}-${результат.id}`}
                  href={результат.url}
                  className="group flex flex-col p-5 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-card)] hover:border-[var(--color-primary)] transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-[var(--color-accent)]">
                      {типЛейбл[результат.type] ?? результат.type}
                    </span>
                  </div>
                  <h3 className="text-base group-hover:text-[var(--color-primary)] transition-colors">
                    {результат.title}
                  </h3>
                  {результат.excerpt && (
                    <p className="text-sm text-[var(--color-text-muted)] mt-1 line-clamp-2">
                      {результат.excerpt}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </>
      )}

      {/* Пустое состояние */}
      {!естьЗапрос && !данные && (
        <div className="p-8 border border-[var(--color-border)] rounded-lg text-center">
          <p className="text-[var(--color-text-muted)] font-[family-name:var(--font-code)]">
            {'>'} Введи запрос для поиска по гайдам и инструментам
          </p>
        </div>
      )}
    </div>
  )
}
