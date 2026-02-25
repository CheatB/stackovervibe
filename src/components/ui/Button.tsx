import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Вариант = 'primary' | 'secondary' | 'ghost'
type Размер = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Вариант
  size?: Размер
  children: ReactNode
}

const варианты: Record<Вариант, string> = {
  primary:
    'bg-[var(--color-primary)] text-[var(--color-bg)] font-bold neon-primary hover:opacity-90',
  secondary:
    'border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10',
  ghost:
    'text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5',
}

const размеры: Record<Размер, string> = {
  sm: 'px-3 py-1 text-xs',
  md: 'px-5 py-2 text-sm',
  lg: 'px-8 py-3 text-base',
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`rounded transition-all font-[family-name:var(--font-code)] ${варианты[variant]} ${размеры[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
