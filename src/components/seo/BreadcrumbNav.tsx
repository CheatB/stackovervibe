import Link from 'next/link'

interface Крошка {
  label: string
  href?: string
}

interface BreadcrumbNavProps {
  items: Крошка[]
}

/** Хлебные крошки в стиле файловой системы: ~/path/to/page */
export function BreadcrumbNav({ items }: BreadcrumbNavProps) {
  return (
    <nav
      aria-label="Навигация"
      className="text-sm text-[var(--color-text-muted)] font-[family-name:var(--font-code)]"
    >
      <span className="text-[var(--color-primary)]">~</span>
      {items.map((крошка, индекс) => (
        <span key={индекс}>
          <span className="mx-1">/</span>
          {крошка.href ? (
            <Link href={крошка.href} className="hover:text-[var(--color-primary)] transition-colors">
              {крошка.label}
            </Link>
          ) : (
            <span className="text-[var(--color-text)]">{крошка.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
