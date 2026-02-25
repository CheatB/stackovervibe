import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export function Card({ children, className = '', hover = true }: CardProps) {
  return (
    <div
      className={`p-6 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-card)] ${
        hover ? 'hover:border-[var(--color-primary)] transition-colors' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}
