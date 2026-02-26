'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav'
import { MarkdownEditor } from '@/components/social/MarkdownEditor'

export default function EditQuestionPage() {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string

  const [заголовок, setЗаголовок] = useState('')
  const [тело, setТело] = useState('')
  const [questionId, setQuestionId] = useState('')
  const [загрузка, setЗагрузка] = useState(true)
  const [отправка, setОтправка] = useState(false)
  const [ошибка, setОшибка] = useState('')

  useEffect(() => {
    /* Загрузить данные вопроса */
    fetch(`/api/feed?type=question&limit=100`)
      .then((r) => r.json())
      .then((данные) => {
        const вопрос = данные.items?.find((i: any) => i.slug === slug)
        if (вопрос) {
          setЗаголовок(вопрос.title)
          setQuestionId(String(вопрос.id))
        }
      })
      .finally(() => setЗагрузка(false))
  }, [slug])

  const отправить = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!questionId) return
    setОшибка('')
    setОтправка(true)

    try {
      const ответ = await fetch(`/api/questions/${questionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: заголовок,
          ...(тело.trim() ? { body: тело } : {}),
        }),
      })

      const данные = await ответ.json()

      if (!ответ.ok) {
        setОшибка(данные.error || 'Ошибка при обновлении')
        return
      }

      router.push(`/questions/${slug}`)
    } catch {
      setОшибка('Ошибка сети')
    } finally {
      setОтправка(false)
    }
  }

  if (загрузка) {
    return (
      <p className="text-[var(--color-text-muted)] font-[family-name:var(--font-code)]">
        &gt; загрузка...
      </p>
    )
  }

  return (
    <div>
      <BreadcrumbNav items={[
        { label: 'questions', href: '/questions' },
        { label: slug, href: `/questions/${slug}` },
        { label: 'edit', href: `/questions/${slug}/edit` },
      ]} />

      <h1 className="text-2xl font-bold font-[family-name:var(--font-code)] mb-8">
        <span className="text-[var(--color-text-muted)]">$</span> edit question
      </h1>

      <form onSubmit={отправить} className="space-y-6 max-w-3xl">
        <div>
          <label className="block text-sm text-[var(--color-text-muted)] font-[family-name:var(--font-code)] mb-2">
            Заголовок
          </label>
          <input
            type="text"
            value={заголовок}
            onChange={(e) => setЗаголовок(e.target.value)}
            maxLength={300}
            required
            className="w-full px-4 py-3 rounded border border-[var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text)] font-[family-name:var(--font-code)] text-sm focus:border-[var(--color-primary)] outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm text-[var(--color-text-muted)] font-[family-name:var(--font-code)] mb-2">
            Тело вопроса (оставьте пустым чтобы не менять)
          </label>
          <MarkdownEditor
            value={тело}
            onChange={setТело}
            placeholder="Новый текст вопроса..."
            minRows={6}
          />
        </div>

        {ошибка && (
          <p className="text-sm text-[var(--color-danger)] font-[family-name:var(--font-code)]">
            ✗ {ошибка}
          </p>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={отправка || заголовок.trim().length < 10}
            className="px-5 py-2 bg-[var(--color-primary)] text-[var(--color-bg)] font-bold text-sm rounded font-[family-name:var(--font-code)] hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {отправка ? '> сохранение...' : '> сохранить'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-2 border border-[var(--color-border)] text-sm rounded font-[family-name:var(--font-code)] hover:border-[var(--color-text-muted)] transition-colors"
          >
            отмена
          </button>
        </div>
      </form>
    </div>
  )
}
