import Link from 'next/link'

interface PathStepCardProps {
  номерШага: number
  заголовок: string
  описание?: string | null
  slug: string
}

export function PathStepCard({ номерШага, заголовок, описание, slug }: PathStepCardProps) {
  return (
    <Link
      href={`/path/${slug}`}
      className="group flex gap-4 p-5 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-card)] hover:border-[var(--color-primary)] transition-colors"
    >
      {/* Номер шага */}
      <div className="flex-shrink-0 w-10 h-10 rounded-full border border-[var(--color-primary)] flex items-center justify-center font-[family-name:var(--font-heading)] text-sm text-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-[var(--color-bg)] transition-colors">
        {номерШага}
      </div>

      <div className="min-w-0">
        <h3 className="text-lg mb-1 group-hover:text-[var(--color-primary)] transition-colors">
          {заголовок}
        </h3>
        {описание && (
          <p className="text-sm text-[var(--color-text-muted)] line-clamp-2">{описание}</p>
        )}
      </div>
    </Link>
  )
}
