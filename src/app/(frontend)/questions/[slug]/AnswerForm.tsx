'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MarkdownEditor } from '@/components/social/MarkdownEditor'

export function AnswerForm({ questionId }: { questionId: string }) {
  const router = useRouter()
  const [тело, setТело] = useState('')
  const [отправка, setОтправка] = useState(false)
  const [ошибка, setОшибка] = useState('')

  const отправить = async (e: React.FormEvent) => {
    e.preventDefault()
    setОшибка('')
    setОтправка(true)

    try {
      const ответ = await fetch('/api/answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId, body: тело }),
      })

      const данные = await ответ.json()

      if (!ответ.ok) {
        setОшибка(данные.error || 'Ошибка при отправке ответа')
        return
      }

      setТело('')
      router.refresh()
    } catch {
      setОшибка('Ошибка сети')
    } finally {
      setОтправка(false)
    }
  }

  return (
    <div className="border-t border-[var(--color-border)] pt-6">
      <h3 className="text-sm font-bold font-[family-name:var(--font-code)] mb-4">
        <span className="text-[var(--color-text-muted)]">$</span> написать ответ
      </h3>

      <form onSubmit={отправить} className="space-y-4">
        <MarkdownEditor
          value={тело}
          onChange={setТело}
          placeholder="Ваш ответ... (минимум 10 символов, поддерживается Markdown)"
          minRows={5}
        />

        {ошибка && (
          <p className="text-sm text-[var(--color-danger)] font-[family-name:var(--font-code)]">
            ✗ {ошибка}
          </p>
        )}

        <button
          type="submit"
          disabled={отправка || тело.trim().length < 10}
          className="px-5 py-2 bg-[var(--color-primary)] text-[var(--color-bg)] font-bold text-sm rounded font-[family-name:var(--font-code)] hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {отправка ? '> отправка...' : '> отправить'}
        </button>
      </form>
    </div>
  )
}
