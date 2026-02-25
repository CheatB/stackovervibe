import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

const базовыйСтиль =
  'w-full px-4 py-2.5 rounded border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:border-[var(--color-primary)] focus:shadow-[0_0_8px_rgba(0,255,65,0.15)] outline-none transition-all font-[family-name:var(--font-code)]'

export function Input({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`${базовыйСтиль} ${className}`} {...props} />
}

export function Textarea({ className = '', ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`${базовыйСтиль} resize-y min-h-[100px] ${className}`} {...props} />
}
