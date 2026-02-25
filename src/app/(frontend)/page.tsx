import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="text-center py-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Stack<span className="text-[var(--color-secondary)]">over</span>vibe
        </h1>
        <p className="text-xl text-[var(--color-text-muted)] max-w-2xl mx-auto mb-8">
          Структурированная база знаний по вайбкодингу.
          Гайды, инструменты, конфиги — всё в одном месте.
        </p>
        <Link
          href="/path"
          className="inline-block px-8 py-3 bg-[var(--color-primary)] text-[var(--color-bg)] font-bold rounded neon-primary hover:opacity-90 transition"
        >
          Начать путь
        </Link>
      </section>

      {/* О проекте */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="p-6 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-card)]">
          <h2 className="text-xl mb-3">Путь новичка</h2>
          <p className="text-[var(--color-text-muted)] mb-4">
            Пошаговый маршрут от нуля до рабочей среды. Без воды, по делу.
          </p>
          <Link href="/path" className="text-sm">Начать →</Link>
        </div>

        <div className="p-6 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-card)]">
          <h2 className="text-xl mb-3">Инструменты</h2>
          <p className="text-[var(--color-text-muted)] mb-4">
            Каталог скиллов, хуков, команд и правил. Копируй и используй.
          </p>
          <Link href="/tools" className="text-sm">Каталог →</Link>
        </div>

        <div className="p-6 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-card)]">
          <h2 className="text-xl mb-3">Фреймворк</h2>
          <p className="text-[var(--color-text-muted)] mb-4">
            Полное описание методологии работы с ИИ-ассистентами.
          </p>
          <Link href="/framework" className="text-sm">Читать →</Link>
        </div>
      </section>
    </div>
  )
}
