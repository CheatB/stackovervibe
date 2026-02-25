'use client'

import { useEffect, useState } from 'react'
import { получитьСогласие } from './CookieBanner'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

export function GoogleAnalytics() {
  const [загружено, setЗагружено] = useState(false)

  useEffect(() => {
    if (!GA_ID || загружено) return

    const загрузить = () => {
      if (!получитьСогласие()) return
      if (загружено) return

      const script = document.createElement('script')
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
      script.async = true
      document.head.appendChild(script)

      const w = window as unknown as Record<string, unknown>
      w.dataLayer = (w.dataLayer as unknown[]) || []
      const gtag = (...args: unknown[]) => {
        ;(w.dataLayer as unknown[]).push(args)
      }
      w.gtag = gtag
      gtag('js', new Date())
      gtag('config', GA_ID)

      setЗагружено(true)
    }

    загрузить()
    window.addEventListener('cookie-consent-changed', загрузить)
    return () => window.removeEventListener('cookie-consent-changed', загрузить)
  }, [загружено])

  return null
}
