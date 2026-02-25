import type { Metadata } from 'next'
import Link from 'next/link'
import '@/styles/globals.css'
import '@/styles/effects.css'

export const metadata: Metadata = {
  title: {
    default: 'Stackovervibe — База знаний по вайбкодингу',
    template: '%s — Stackovervibe',
  },
  description:
    'Структурированная база знаний по вайбкодингу. Гайды, инструменты, конфиги — всё в одном месте.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className="dark">
      <body className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="border-b border-[var(--color-border)] px-6 py-4">
          <nav className="max-w-6xl mx-auto flex items-center justify-between">
            <Link
              href="/"
              className="font-[family-name:var(--font-heading)] text-[var(--color-primary)] text-lg"
            >
              {'>'} stackovervibe<span className="cursor-blink"> </span>
            </Link>
            <div className="flex gap-6 text-sm">
              <Link href="/path">Путь новичка</Link>
              <Link href="/tools">Инструменты</Link>
              <Link href="/framework">Фреймворк</Link>
              <Link href="/search">Поиск</Link>
            </div>
          </nav>
        </header>

        {/* Контент */}
        <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">{children}</main>

        {/* Footer */}
        <footer className="border-t border-[var(--color-border)] px-6 py-6 text-center text-[var(--color-text-muted)] text-sm">
          <pre className="font-[family-name:var(--font-code)] text-xs mb-4 text-[var(--color-border)] select-none">
{`  _____ _             _    _____       _     _
 / ____| |           | |  / ____|     (_)   | |
| (___ | |_ __ _  ___| |_| |  ____   ___ _ __| |__  ___
 \\___ \\| __/ _\` |/ __| __| | / __ \\ / / | '_ \\| '_ \\ / _ \\
 ____) | || (_| | (__| |_| |__| \\ V /| | |_) | |_) |  __/
|_____/ \\__\\__,_|\\___|\\__|\\_____|_\\_/ |_|_.__/|_.__/ \\___|`}
          </pre>
          <p>
            &copy; {new Date().getFullYear()} Stackovervibe.
            Сделано с помощью ИИ и кофе.
          </p>
        </footer>
      </body>
    </html>
  )
}
