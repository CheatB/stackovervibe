'use client'

import { useState } from 'react'

interface ShareButtonsProps {
  url: string
  title: string
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const [скопировано, setСкопировано] = useState(false)

  const копировать = async () => {
    await navigator.clipboard.writeText(url)
    setСкопировано(true)
    setTimeout(() => setСкопировано(false), 2000)
  }

  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`

  return (
    <div className="flex items-center gap-2 font-[family-name:var(--font-code)] text-xs">
      <a
        href={telegramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="px-2 py-1 rounded border border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
      >
        TG
      </a>
      <button
        onClick={копировать}
        className="px-2 py-1 rounded border border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
      >
        {скопировано ? 'OK!' : 'URL'}
      </button>
    </div>
  )
}
