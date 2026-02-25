'use client'

import { useState, useEffect } from 'react'

const КЛЮЧ_СОГЛАСИЯ = 'cookie_consent'

export function CookieBanner() {
  const [показать, setПоказать] = useState(false)

  useEffect(() => {
    const согласие = localStorage.getItem(КЛЮЧ_СОГЛАСИЯ)
    if (!согласие) setПоказать(true)
  }, [])

  const принять = () => {
    localStorage.setItem(КЛЮЧ_СОГЛАСИЯ, 'accepted')
    setПоказать(false)
    window.dispatchEvent(new Event('cookie-consent-changed'))
  }

  const отклонить = () => {
    localStorage.setItem(КЛЮЧ_СОГЛАСИЯ, 'rejected')
    setПоказать(false)
  }

  if (!показать) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-[var(--color-bg-card)] border-t border-[var(--color-border)]">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center gap-4">
        <p className="text-xs text-[var(--color-text-muted)] font-[family-name:var(--font-code)] flex-1">
          {'>'} Мы используем cookies и аналитику для улучшения сайта.{' '}
          <a href="/privacy" className="text-[var(--color-primary)] hover:underline">
            Политика конфиденциальности
          </a>
        </p>
        <div className="flex gap-3">
          <button
            onClick={принять}
            className="px-4 py-1.5 text-xs rounded bg-[var(--color-primary)] text-[var(--color-bg)] font-bold font-[family-name:var(--font-code)] hover:opacity-90 transition-opacity"
          >
            Принять
          </button>
          <button
            onClick={отклонить}
            className="px-4 py-1.5 text-xs rounded border border-[var(--color-border)] text-[var(--color-text-muted)] font-[family-name:var(--font-code)] hover:border-[var(--color-text-muted)] transition-colors"
          >
            Отклонить
          </button>
        </div>
      </div>
    </div>
  )
}

/** Проверить согласие (для использования в других компонентах) */
export function получитьСогласие(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(КЛЮЧ_СОГЛАСИЯ) === 'accepted'
}
