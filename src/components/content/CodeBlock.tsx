'use client'

import { useState } from 'react'

interface CodeBlockProps {
  code: string
  language?: string
  filename?: string
}

export function CodeBlock({ code, language = 'text', filename }: CodeBlockProps) {
  const [скопировано, setСкопировано] = useState(false)

  const копировать = async () => {
    await navigator.clipboard.writeText(code)
    setСкопировано(true)
    setTimeout(() => setСкопировано(false), 2000)
  }

  const скачать = () => {
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename || `code.${language}`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="my-6 rounded-lg border border-[var(--color-border)] overflow-hidden bg-[#0d0d0d]">
      {/* Шапка — терминальный стиль */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#111] border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2">
          {/* Кружки терминала */}
          <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
          {filename && (
            <span className="ml-2 text-xs text-[var(--color-text-muted)] font-[family-name:var(--font-code)]">
              {filename}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={копировать}
            className="px-3 py-1 text-xs rounded border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-colors"
          >
            {скопировано ? 'Скопировано!' : 'Копировать'}
          </button>
          {filename && (
            <button
              onClick={скачать}
              className="px-3 py-1 text-xs rounded border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] transition-colors"
            >
              Скачать
            </button>
          )}
        </div>
      </div>

      {/* Код */}
      <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
        <code className="font-[family-name:var(--font-code)] text-[var(--color-primary)]">
          {code}
        </code>
      </pre>
    </div>
  )
}
