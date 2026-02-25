'use client'

import { useState } from 'react'
import Link from 'next/link'

const ссылки = [
  { href: '/path', label: 'path/' },
  { href: '/tools', label: 'tools/' },
  { href: '/framework', label: 'framework/' },
  { href: '/posts', label: 'posts/' },
  { href: '/search', label: 'search' },
]

export function MobileMenu() {
  const [открыто, setОткрыто] = useState(false)

  return (
    <div className="md:hidden">
      <button
        onClick={() => setОткрыто(!открыто)}
        className="text-[var(--color-primary)] font-[family-name:var(--font-code)] text-sm"
        aria-label={открыто ? 'Закрыть меню' : 'Открыть меню'}
      >
        {открыто ? '[x]' : '[=]'}
      </button>

      {открыто && (
        <nav className="absolute top-full left-0 right-0 bg-[var(--color-bg)] border-b border-[var(--color-border)] z-50 px-6 py-4">
          <div className="flex flex-col gap-3 font-[family-name:var(--font-code)] text-sm">
            {ссылки.map((с) => (
              <Link
                key={с.href}
                href={с.href}
                onClick={() => setОткрыто(false)}
                className="py-1 hover:text-[var(--color-primary)] transition-colors"
              >
                <span className="text-[var(--color-text-muted)]">$ cd</span> {с.label}
              </Link>
            ))}
            <form action="/search" method="GET" className="pt-2 border-t border-[var(--color-border)]">
              <input
                type="text"
                name="q"
                placeholder="grep -r '...'"
                className="w-full px-3 py-2 text-xs rounded border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:border-[var(--color-primary)] outline-none"
              />
            </form>
          </div>
        </nav>
      )}
    </div>
  )
}
