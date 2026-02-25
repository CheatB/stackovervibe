import Link from 'next/link'
import { JsonLd } from '@/components/seo/JsonLd'

const САЙТ_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

const ASCII_LOGO = `
 ███████╗████████╗ █████╗  ██████╗██╗  ██╗
 ██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
 ███████╗   ██║   ███████║██║     █████╔╝
 ╚════██║   ██║   ██╔══██║██║     ██╔═██╗
 ███████║   ██║   ██║  ██║╚██████╗██║  ██╗
 ╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝
      O V E R V I B E`.trimStart()

export default function HomePage() {
  return (
    <div className="space-y-20">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Stackovervibe',
          url: САЙТ_URL,
          description: 'Структурированная база знаний по вайбкодингу.',
          potentialAction: {
            '@type': 'SearchAction',
            target: `${САЙТ_URL}/search?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        }}
      />

      {/* Hero */}
      <section className="text-center py-16 md:py-24">
        <pre
          className="text-[var(--color-primary)] text-[0.35rem] sm:text-[0.5rem] md:text-xs leading-tight font-[family-name:var(--font-code)] mb-8 neon-text select-none overflow-hidden"
          aria-hidden="true"
        >
          {ASCII_LOGO}
        </pre>

        <h1 className="sr-only">Stackovervibe — база знаний по вайбкодингу</h1>

        <p className="text-lg md:text-xl text-[var(--color-text-muted)] max-w-2xl mx-auto mb-4 font-[family-name:var(--font-code)]">
          <span className="text-[var(--color-text-muted)]">$</span>{' '}
          <span className="text-[var(--color-text)]">cat</span>{' '}
          <span className="text-[var(--color-accent)]">about.txt</span>
        </p>
        <p className="text-base md:text-lg text-[var(--color-text-muted)] max-w-xl mx-auto mb-10">
          Структурированная база знаний по вайбкодингу.
          Гайды, инструменты, конфиги — всё в одном месте.
        </p>

        <Link
          href="/path"
          className="inline-block px-8 py-3 bg-[var(--color-primary)] text-[var(--color-bg)] font-bold rounded neon-primary hover:opacity-90 transition font-[family-name:var(--font-code)]"
        >
          ./start.sh
        </Link>
      </section>

      {/* Разделитель */}
      <div className="text-center text-[var(--color-border)] font-[family-name:var(--font-code)] text-xs select-none">
        ════════════════════════════════════════
      </div>

      {/* Блоки */}
      <section className="grid md:grid-cols-3 gap-6">
        <Link
          href="/path"
          className="group p-6 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-card)] hover:border-[var(--color-primary)] transition-all hover:shadow-[0_0_20px_rgba(0,255,65,0.08)]"
        >
          <div className="text-xs text-[var(--color-text-muted)] font-[family-name:var(--font-code)] mb-3">
            ~/path
          </div>
          <h2 className="text-xl mb-3 group-hover:neon-text transition-all">Путь новичка</h2>
          <p className="text-sm text-[var(--color-text-muted)] mb-4">
            Пошаговый маршрут от нуля до рабочей среды. Без воды, по делу.
          </p>
          <span className="text-xs text-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition-opacity font-[family-name:var(--font-code)]">
            cd path/ →
          </span>
        </Link>

        <Link
          href="/tools"
          className="group p-6 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-card)] hover:border-[var(--color-secondary)] transition-all hover:shadow-[0_0_20px_rgba(255,0,255,0.08)]"
        >
          <div className="text-xs text-[var(--color-text-muted)] font-[family-name:var(--font-code)] mb-3">
            ~/tools
          </div>
          <h2 className="text-xl mb-3">Инструменты</h2>
          <p className="text-sm text-[var(--color-text-muted)] mb-4">
            Каталог скиллов, хуков, команд и правил. Копируй и используй.
          </p>
          <span className="text-xs text-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition-opacity font-[family-name:var(--font-code)]">
            ls tools/ →
          </span>
        </Link>

        <Link
          href="/framework"
          className="group p-6 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-card)] hover:border-[var(--color-accent)] transition-all hover:shadow-[0_0_20px_rgba(0,255,255,0.08)]"
        >
          <div className="text-xs text-[var(--color-text-muted)] font-[family-name:var(--font-code)] mb-3">
            ~/framework
          </div>
          <h2 className="text-xl mb-3">Фреймворк</h2>
          <p className="text-sm text-[var(--color-text-muted)] mb-4">
            Полное описание методологии работы с ИИ-ассистентами.
          </p>
          <span className="text-xs text-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition-opacity font-[family-name:var(--font-code)]">
            cat framework.md →
          </span>
        </Link>
      </section>
    </div>
  )
}
