'use client'

import { useEffect, useRef } from 'react'

interface TelegramLoginWidgetProps {
  botUsername: string
  onAuth?: () => void
}

export function TelegramLoginWidget({ botUsername, onAuth }: TelegramLoginWidgetProps) {
  const контейнер = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!контейнер.current || !botUsername) return

    /* Callback для Telegram Widget */
    ;(window as unknown as Record<string, unknown>).onTelegramAuth = async (user: Record<string, unknown>) => {
      const ответ = await fetch('/api/auth/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      })

      if (ответ.ok) {
        onAuth?.()
        window.location.reload()
      }
    }

    const script = document.createElement('script')
    script.src = 'https://telegram.org/js/telegram-widget.js?22'
    script.setAttribute('data-telegram-login', botUsername)
    script.setAttribute('data-size', 'medium')
    script.setAttribute('data-onauth', 'onTelegramAuth(user)')
    script.setAttribute('data-request-access', 'write')
    script.async = true

    /* Очистить контейнер безопасно через DOM API */
    while (контейнер.current.firstChild) {
      контейнер.current.removeChild(контейнер.current.firstChild)
    }
    контейнер.current.appendChild(script)
  }, [botUsername, onAuth])

  return <div ref={контейнер} />
}
