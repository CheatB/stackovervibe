import Link from 'next/link'

/** Маппинг типов инструментов → лейблы и цвета */
const типИнструмента: Record<string, { лейбл: string; цвет: string }> = {
  skill: { лейбл: 'Скилл', цвет: 'var(--color-primary)' },
  hook: { лейбл: 'Хук', цвет: 'var(--color-secondary)' },
  command: { лейбл: 'Команда', цвет: 'var(--color-accent)' },
  rule: { лейбл: 'Правило', цвет: 'var(--color-danger)' },
}

interface ToolCardProps {
  заголовок: string
  slug: string
  тип: string
  описание?: string | null
  категория?: string | null
}

export function ToolCard({ заголовок, slug, тип, описание, категория }: ToolCardProps) {
  const инфо = типИнструмента[тип] ?? { лейбл: тип, цвет: 'var(--color-text-muted)' }

  return (
    <Link
      href={`/tools/${slug}`}
      className="group flex flex-col p-5 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-card)] hover:border-[var(--color-primary)] transition-colors"
    >
      <div className="flex items-center gap-2 mb-3">
        <span
          className="px-2 py-0.5 text-xs rounded font-[family-name:var(--font-code)] border"
          style={{ color: инфо.цвет, borderColor: инфо.цвет }}
        >
          {инфо.лейбл}
        </span>
        {категория && (
          <span className="text-xs text-[var(--color-text-muted)]">{категория}</span>
        )}
      </div>

      <h3 className="text-base mb-2 group-hover:text-[var(--color-primary)] transition-colors">
        {заголовок}
      </h3>

      {описание && (
        <p className="text-sm text-[var(--color-text-muted)] line-clamp-3 flex-1">{описание}</p>
      )}

      <span className="mt-3 text-xs text-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition-opacity">
        Открыть →
      </span>
    </Link>
  )
}
