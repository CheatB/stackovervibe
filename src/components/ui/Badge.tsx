type ТипБейджа = 'skill' | 'hook' | 'command' | 'rule' | 'default'

interface BadgeProps {
  type?: ТипБейджа
  children: string
  className?: string
}

const цвета: Record<ТипБейджа, string> = {
  skill: 'text-[var(--color-primary)] border-[var(--color-primary)]',
  hook: 'text-[var(--color-secondary)] border-[var(--color-secondary)]',
  command: 'text-[var(--color-accent)] border-[var(--color-accent)]',
  rule: 'text-[var(--color-danger)] border-[var(--color-danger)]',
  default: 'text-[var(--color-text-muted)] border-[var(--color-text-muted)]',
}

export function Badge({ type = 'default', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-block px-2 py-0.5 text-xs rounded border font-[family-name:var(--font-code)] ${цвета[type]} ${className}`}
    >
      {children}
    </span>
  )
}
