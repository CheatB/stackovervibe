import type { Metadata } from 'next'
import { getTools, getCategories } from '@/lib/payload'
import { ToolCard } from '@/components/cards/ToolCard'
import { ToolsFilter } from '@/components/ToolsFilter'
import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav'

export const metadata: Metadata = {
  title: 'Инструменты',
  description:
    'Каталог скиллов, хуков, команд и правил для вайбкодинга. Копируй и используй.',
}

interface ПараметрыПоиска {
  searchParams: Promise<{ type?: string; category?: string }>
}

export default async function ToolsPage({ searchParams }: ПараметрыПоиска) {
  const { type: тип, category: категория } = await searchParams

  const [инструменты, категории] = await Promise.all([
    getTools({ toolType: тип, category: категория }),
    getCategories(),
  ])

  return (
    <div className="space-y-8">
      <BreadcrumbNav items={[{ label: 'tools' }]} />
      <div>
        <h1 className="text-3xl md:text-4xl mb-4">Инструменты</h1>
        <p className="text-[var(--color-text-muted)] max-w-2xl">
          Каталог скиллов, хуков, команд и правил. Фильтруй по типу и категории.
        </p>
      </div>

      {/* Фильтры */}
      <ToolsFilter
        текущийТип={тип}
        текущаяКатегория={категория}
        категории={категории.map((к) => ({
          slug: к.slug,
          title: к.title,
        }))}
      />

      {/* Сетка инструментов */}
      {инструменты.length === 0 ? (
        <div className="p-8 border border-[var(--color-border)] rounded-lg text-center">
          <p className="text-[var(--color-text-muted)] font-[family-name:var(--font-code)]">
            {'>'} Ничего не найдено. Попробуй другие фильтры.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {инструменты.map((инструмент) => (
            <ToolCard
              key={инструмент.id}
              заголовок={инструмент.title}
              slug={инструмент.slug}
              тип={инструмент.toolType}
              описание={инструмент.shortDescription}
              категория={
                typeof инструмент.category === 'object' && инструмент.category
                  ? инструмент.category.title
                  : null
              }
            />
          ))}
        </div>
      )}
    </div>
  )
}
