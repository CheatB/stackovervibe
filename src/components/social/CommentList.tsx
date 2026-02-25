'use client'

import { useState } from 'react'

interface Комментарий {
  id: number | string
  text: string
  author: {
    displayName?: string | null
    telegramUsername?: string | null
    avatarUrl?: string | null
  } | number | string
  createdAt: string
}

interface CommentListProps {
  comments?: Комментарий[]
  contentType: string
  contentId: string
}

export function CommentList({ comments = [], contentType, contentId }: CommentListProps) {
  const [текст, setТекст] = useState('')
  const [отправка, setОтправка] = useState(false)
  const [ошибка, setОшибка] = useState('')
  const [локальные, setЛокальные] = useState<Комментарий[]>([])

  const отправить = async () => {
    if (!текст.trim() || отправка) return
    setОтправка(true)
    setОшибка('')

    try {
      const ответ = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: текст, contentType, contentId }),
      })

      if (!ответ.ok) {
        const данные = await ответ.json()
        setОшибка(данные.error || 'Ошибка отправки')
        return
      }

      const новый = await ответ.json()
      setЛокальные((п) => [новый, ...п])
      setТекст('')
    } catch {
      setОшибка('Ошибка сети')
    } finally {
      setОтправка(false)
    }
  }

  const все = [...локальные, ...comments]

  return (
    <div className="space-y-4">
      {/* Форма */}
      <div className="space-y-2">
        <textarea
          value={текст}
          onChange={(e) => setТекст(e.target.value)}
          placeholder="Написать комментарий... (нужна авторизация через Telegram)"
          maxLength={2000}
          className="w-full px-4 py-3 rounded border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:border-[var(--color-primary)] outline-none resize-y min-h-[80px] text-sm font-[family-name:var(--font-code)]"
        />
        <div className="flex items-center gap-3">
          <button
            onClick={отправить}
            disabled={!текст.trim() || отправка}
            className="px-4 py-1.5 text-xs rounded bg-[var(--color-primary)] text-[var(--color-bg)] font-bold disabled:opacity-50 transition-opacity font-[family-name:var(--font-code)]"
          >
            {отправка ? '...' : 'Отправить'}
          </button>
          {ошибка && <span className="text-xs text-[var(--color-danger)]">{ошибка}</span>}
        </div>
      </div>

      {/* Список */}
      {все.length === 0 ? (
        <p className="text-sm text-[var(--color-text-muted)] font-[family-name:var(--font-code)]">
          {'>'} Пока нет комментариев
        </p>
      ) : (
        <div className="space-y-3">
          {все.map((к) => {
            const автор = typeof к.author === 'object' && к.author ? к.author : null
            return (
              <div
                key={к.id}
                className="p-4 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-card)]"
              >
                <div className="flex items-center gap-2 mb-2 text-xs text-[var(--color-text-muted)]">
                  {автор?.avatarUrl && (
                    <img src={автор.avatarUrl} alt="" className="w-5 h-5 rounded-full" />
                  )}
                  <span>{автор?.displayName || автор?.telegramUsername || 'Аноним'}</span>
                  <time>{new Date(к.createdAt).toLocaleString('ru-RU')}</time>
                </div>
                <p className="text-sm whitespace-pre-wrap">{к.text}</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
