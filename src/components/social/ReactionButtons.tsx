'use client'

import { useState, useEffect } from 'react'

interface ReactionButtonsProps {
  contentType: string
  contentId: string
  likes?: number
  dislikes?: number
}

export function ReactionButtons({ contentType, contentId, likes = 0, dislikes = 0 }: ReactionButtonsProps) {
  const [лайки, setЛайки] = useState(likes)
  const [дизлайки, setДизлайки] = useState(dislikes)
  const [голосовал, setГолосовал] = useState(false)

  const ключ = `reaction_${contentType}_${contentId}`

  useEffect(() => {
    setГолосовал(!!localStorage.getItem(ключ))
  }, [ключ])

  const голосовать = async (тип: 'like' | 'dislike') => {
    if (голосовал) return

    const fingerprint = `${navigator.userAgent}_${screen.width}x${screen.height}`

    const ответ = await fetch('/api/reactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contentType, contentId, type: тип, fingerprint }),
    })

    if (ответ.ok) {
      if (тип === 'like') setЛайки((п) => п + 1)
      else setДизлайки((п) => п + 1)
      localStorage.setItem(ключ, тип)
      setГолосовал(true)
    }
  }

  return (
    <div className="flex items-center gap-3 font-[family-name:var(--font-code)] text-sm">
      <button
        onClick={() => голосовать('like')}
        disabled={голосовал}
        className={`flex items-center gap-1 px-2 py-1 rounded border transition-colors ${
          голосовал
            ? 'border-[var(--color-border)] text-[var(--color-text-muted)] cursor-not-allowed opacity-50'
            : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
        }`}
      >
        + {лайки}
      </button>
      <button
        onClick={() => голосовать('dislike')}
        disabled={голосовал}
        className={`flex items-center gap-1 px-2 py-1 rounded border transition-colors ${
          голосовал
            ? 'border-[var(--color-border)] text-[var(--color-text-muted)] cursor-not-allowed opacity-50'
            : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-danger)] hover:text-[var(--color-danger)]'
        }`}
      >
        - {дизлайки}
      </button>
    </div>
  )
}
