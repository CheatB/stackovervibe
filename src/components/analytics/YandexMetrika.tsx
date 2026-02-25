'use client'

import { useEffect, useState } from 'react'
import { получитьСогласие } from './CookieBanner'

const МЕТРИКА_ID = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID

export function YandexMetrika() {
  const [загружено, setЗагружено] = useState(false)

  useEffect(() => {
    if (!МЕТРИКА_ID || загружено) return

    const загрузить = () => {
      if (!получитьСогласие()) return
      if (загружено) return

      /* Инициализация Яндекс.Метрики */
      const w = window as unknown as Record<string, unknown>
      w.ym = w.ym || function (...args: unknown[]) {
        (w.ym as unknown as { a: unknown[] }).a = (w.ym as unknown as { a: unknown[] }).a || []
        ;(w.ym as unknown as { a: unknown[] }).a.push(args)
      }

      const script = document.createElement('script')
      script.src = 'https://mc.yandex.ru/metrika/tag.js'
      script.async = true
      script.onload = () => {
        ;(w.ym as (...args: unknown[]) => void)(Number(МЕТРИКА_ID), 'init', {
          clickmap: true,
          trackLinks: true,
          accurateTrackBounce: true,
          webvisor: true,
        })
      }
      document.head.appendChild(script)
      setЗагружено(true)
    }

    /* Попробовать загрузить сразу и слушать изменение согласия */
    загрузить()
    window.addEventListener('cookie-consent-changed', загрузить)
    return () => window.removeEventListener('cookie-consent-changed', загрузить)
  }, [загружено])

  if (!МЕТРИКА_ID) return null

  return (
    <noscript>
      <div>
        <img
          src={`https://mc.yandex.ru/watch/${МЕТРИКА_ID}`}
          style={{ position: 'absolute', left: '-9999px' }}
          alt=""
        />
      </div>
    </noscript>
  )
}
