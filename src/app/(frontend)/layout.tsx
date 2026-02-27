import type { Metadata } from 'next'
import Link from 'next/link'
import { MobileMenu } from '@/components/layout/MobileMenu'
import { CookieBanner } from '@/components/analytics/CookieBanner'
import { YandexMetrika } from '@/components/analytics/YandexMetrika'
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics'
import '@/styles/globals.css'
import '@/styles/effects.css'

/** Все фронтенд-страницы рендерятся динамически (SSR) — данные из CMS всегда свежие */
export const dynamic = 'force-dynamic'

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
        {/* CRT-скенлайны */}
        <div className="crt-overlay" />

        {/* Header — терминальный стиль */}
        <header className="relative border-b border-[var(--color-border)] px-4 sm:px-6 py-3">
          <nav className="max-w-6xl mx-auto flex items-center justify-between">
            <Link
              href="/"
              className="font-[family-name:var(--font-code)] text-[var(--color-primary)] text-sm"
            >
              <span className="text-[var(--color-text-muted)]">visitor@</span>stackovervibe
              <span className="text-[var(--color-text-muted)]">:~$</span>
              <span className="cursor-blink"> </span>
            </Link>

            {/* Десктоп навигация */}
            <div className="hidden md:flex items-center gap-5 font-[family-name:var(--font-code)] text-xs">
              <Link href="/path" className="hover:text-[var(--color-primary)] transition-colors">
                path/
              </Link>
              <Link href="/tools" className="hover:text-[var(--color-primary)] transition-colors">
                tools/
              </Link>
              <Link href="/framework" className="hover:text-[var(--color-primary)] transition-colors">
                framework/
              </Link>
              <Link href="/posts" className="hover:text-[var(--color-primary)] transition-colors">
                posts/
              </Link>
              <Link href="/questions" className="hover:text-[var(--color-primary)] transition-colors">
                questions/
              </Link>
              <form action="/search" method="GET" className="flex">
                <input
                  type="text"
                  name="q"
                  placeholder="grep -r '...'"
                  className="w-28 focus:w-40 transition-all px-2 py-1 text-xs rounded border border-[var(--color-border)] bg-transparent text-[var(--color-text)] focus:border-[var(--color-primary)] outline-none"
                />
              </form>
            </div>

            {/* Мобильное меню */}
            <MobileMenu />
          </nav>
        </header>

        {/* Контент */}
        <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">{children}</main>

        {/* Footer — ASCII + ретро */}
        <footer className="border-t border-[var(--color-border)] px-4 sm:px-6 py-8 text-center">
          <div className="max-w-6xl mx-auto">
            <pre className="font-[family-name:var(--font-code)] text-[0.4rem] sm:text-[0.5rem] mb-6 text-[var(--color-border)] select-none leading-tight overflow-hidden">
{`╔══════════════════════════════════════════╗
║  STACKOVERVIBE v1.0                      ║
║  База знаний по вайбкодингу              ║
║  ──────────────────────────              ║
║  > Путь новичка   > Инструменты          ║
║  > Фреймворк      > Вопросы             ║
╚══════════════════════════════════════════╝`}
            </pre>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-4 font-[family-name:var(--font-code)] text-xs text-[var(--color-text-muted)]">
              <Link href="/path">path/</Link>
              <Link href="/tools">tools/</Link>
              <Link href="/framework">framework/</Link>
              <Link href="/posts">posts/</Link>
              <Link href="/questions">questions/</Link>
              <Link href="/search">search</Link>
            </div>
            <p className="text-xs text-[var(--color-text-muted)] font-[family-name:var(--font-code)]">
              &copy; {new Date().getFullYear()} stackovervibe // собрано нейросетью и кофеином
            </p>
          </div>
        </footer>
        {/* Аналитика + Cookie-баннер */}
        <CookieBanner />
        <YandexMetrika />
        <GoogleAnalytics />
      </body>
    </html>
  )
}
