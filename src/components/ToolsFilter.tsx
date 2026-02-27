'use client'

import { useRouter, useSearchParams } from 'next/navigation'

const типыИнструментов = [
  { value: '', label: 'Все' },
  { value: 'skill', label: 'Скиллы' },
  { value: 'hook', label: 'Хуки' },
  { value: 'command', label: 'Команды' },
  { value: 'rule', label: 'Правила' },
  { value: 'plugin', label: 'Плагины' },
]

interface ToolsFilterProps {
  текущийТип?: string
  текущаяКатегория?: string
  категории: Array<{ slug: string; title: string }>
}

export function ToolsFilter({ текущийТип, текущаяКатегория, категории }: ToolsFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  /** Обновить query-параметры */
  const обновитьФильтр = (ключ: string, значение: string) => {
    const параметры = new URLSearchParams(searchParams.toString())
    if (значение) {
      параметры.set(ключ, значение)
    } else {
      параметры.delete(ключ)
    }
    router.push(`/tools?${параметры.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-4">
      {/* Фильтр по типу */}
      <div className="flex flex-wrap gap-1">
        {типыИнструментов.map((тип) => (
          <button
            key={тип.value}
            onClick={() => обновитьФильтр('type', тип.value)}
            className={`px-3 py-1.5 text-sm rounded border transition-colors ${
              (текущийТип ?? '') === тип.value
                ? 'border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-primary)]/10'
                : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-text-muted)]'
            }`}
          >
            {тип.label}
          </button>
        ))}
      </div>

      {/* Фильтр по категории */}
      {категории.length > 0 && (
        <select
          value={текущаяКатегория ?? ''}
          onChange={(e) => обновитьФильтр('category', e.target.value)}
          className="px-3 py-1.5 text-sm rounded border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:border-[var(--color-primary)] outline-none"
        >
          <option value="">Все категории</option>
          {категории.map((к) => (
            <option key={к.slug} value={к.slug}>
              {к.title}
            </option>
          ))}
        </select>
      )}
    </div>
  )
}
