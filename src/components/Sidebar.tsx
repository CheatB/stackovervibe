import Link from "next/link";

interface SidebarProps {
  hotQuestions?: Array<{ title: string; slug: string }>;
  stats?: {
    guides: number;
    tools: number;
    questions: number;
    posts: number;
  };
}

/** Навигационные ссылки в терминальном стиле */
const НАВИГАЦИЯ = [
  { путь: "/path", лейбл: "path/", описание: "Путь новичка" },
  { путь: "/tools", лейбл: "tools/", описание: "Инструменты" },
  { путь: "/framework", лейбл: "framework/", описание: "Фреймворк" },
  { путь: "/questions", лейбл: "questions/", описание: "Вопросы" },
];

export function Sidebar({ hotQuestions = [], stats }: SidebarProps) {
  return (
    <aside className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
      {/* Блок 1: Навигация */}
      <div className="border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-card)] overflow-hidden">
        <div className="px-4 py-2 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
          <span className="font-[family-name:var(--font-code)] text-sm text-[var(--color-primary)]">
            $ ls ~/
          </span>
        </div>
        <nav className="p-3 space-y-1">
          {НАВИГАЦИЯ.map((ссылка) => (
            <Link
              key={ссылка.путь}
              href={ссылка.путь}
              className="flex items-center gap-3 px-2 py-1.5 rounded text-sm hover:bg-[var(--color-primary)]/5 group transition-colors"
            >
              <span className="font-[family-name:var(--font-code)] text-[var(--color-primary)] shrink-0">
                {ссылка.лейбл}
              </span>
              <span className="text-[var(--color-text-muted)] group-hover:text-[var(--color-text)] transition-colors">
                → {ссылка.описание}
              </span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Блок 2: Горячие вопросы */}
      {hotQuestions.length > 0 && (
        <div className="border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-card)] overflow-hidden">
          <div className="px-4 py-2 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
            <span className="font-[family-name:var(--font-code)] text-sm text-[var(--color-accent)]">
              $ top questions
            </span>
          </div>
          <ol className="p-3 space-y-2">
            {hotQuestions.slice(0, 5).map((вопрос, индекс) => (
              <li key={вопрос.slug} className="flex gap-2 items-start">
                <span className="font-[family-name:var(--font-code)] text-xs text-[var(--color-text-muted)] mt-0.5 min-w-[16px]">
                  {индекс + 1}.
                </span>
                <Link
                  href={`/questions/${вопрос.slug}`}
                  className="text-sm text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors line-clamp-2"
                >
                  {вопрос.title}
                </Link>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Блок 3: Статистика */}
      {stats && (
        <div className="border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-card)] overflow-hidden">
          <div className="px-4 py-2 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
            <span className="font-[family-name:var(--font-code)] text-sm text-[var(--color-secondary)]">
              $ cat stats.txt
            </span>
          </div>
          <div className="p-3 space-y-1.5 font-[family-name:var(--font-code)] text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--color-text-muted)]">гайды</span>
              <span className="text-[var(--color-primary)]">
                {stats.guides}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-text-muted)]">
                инструменты
              </span>
              <span className="text-[var(--color-secondary)]">
                {stats.tools}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-text-muted)]">вопросы</span>
              <span className="text-[var(--color-accent)]">
                {stats.questions}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-text-muted)]">посты</span>
              <span className="text-[var(--color-text)]">{stats.posts}</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
