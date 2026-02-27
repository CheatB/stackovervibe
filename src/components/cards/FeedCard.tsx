import Link from "next/link";
import { форматДату } from "@/lib/date";

/** Элемент ленты — может быть гайдом, инструментом, вопросом или постом */
export interface FeedItem {
  id: number | string;
  type: "guide" | "tool" | "question" | "post";
  title: string;
  slug: string;
  url: string;
  excerpt: string;
  votes: number;
  views: number;
  answersCount: number;
  tags: Array<{ title: string; slug: string }>;
  author: { displayName?: string; telegramUsername?: string } | null;
  publishedAt: string;
  hasAcceptedAnswer: boolean;
}

/** Префиксы типов контента */
const ПРЕФИКСЫ_ТИПОВ: Record<
  FeedItem["type"],
  { текст: string; цвет: string }
> = {
  guide: { текст: "[guide]", цвет: "var(--color-primary)" },
  tool: { текст: "[tool]", цвет: "var(--color-secondary)" },
  question: { текст: "[question]", цвет: "var(--color-accent)" },
  post: { текст: "[post]", цвет: "var(--color-text-muted)" },
};

interface FeedCardProps {
  элемент: FeedItem;
}

export function FeedCard({ элемент }: FeedCardProps) {
  const типИнфо = ПРЕФИКСЫ_ТИПОВ[элемент.type];
  const имяАвтора =
    элемент.author?.displayName || элемент.author?.telegramUsername || "Аноним";
  const сокращённоеОписание =
    элемент.excerpt.length > 150
      ? элемент.excerpt.slice(0, 147) + "..."
      : элемент.excerpt;

  return (
    <div className="flex gap-4 p-4 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-card)] hover:border-[var(--color-primary)]/50 transition-colors">
      {/* Статистика — вертикальная на десктопе */}
      <div className="hidden sm:flex flex-col items-center gap-2 min-w-[56px] font-[family-name:var(--font-code)] text-xs">
        {/* Голоса */}
        <div className="flex flex-col items-center">
          <span
            className={`text-base font-bold ${
              элемент.votes > 0
                ? "text-[var(--color-primary)]"
                : элемент.votes < 0
                  ? "text-[var(--color-danger)]"
                  : "text-[var(--color-text-muted)]"
            }`}
          >
            {элемент.votes}
          </span>
          <span className="text-[var(--color-text-muted)]">голос</span>
        </div>

        {/* Ответы */}
        <div
          className={`flex flex-col items-center px-1.5 py-0.5 rounded border ${
            элемент.hasAcceptedAnswer
              ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
              : "border-[var(--color-border)] text-[var(--color-text-muted)]"
          }`}
        >
          <span className="text-base font-bold">{элемент.answersCount}</span>
          <span className="text-[10px]">ответов</span>
        </div>

        {/* Просмотры */}
        <div className="flex flex-col items-center text-[var(--color-text-muted)]">
          <span>{элемент.views}</span>
          <span>просм.</span>
        </div>
      </div>

      {/* Контент */}
      <div className="flex-1 min-w-0">
        {/* Мобильная статистика */}
        <div className="flex sm:hidden gap-4 mb-2 font-[family-name:var(--font-code)] text-xs text-[var(--color-text-muted)]">
          <span
            className={
              элемент.votes > 0
                ? "text-[var(--color-primary)]"
                : элемент.votes < 0
                  ? "text-[var(--color-danger)]"
                  : ""
            }
          >
            ↑{элемент.votes} голос
          </span>
          <span
            className={
              элемент.hasAcceptedAnswer ? "text-[var(--color-primary)]" : ""
            }
          >
            ✓{элемент.answersCount} ответ
          </span>
          <span>{элемент.views} просм.</span>
        </div>

        {/* Заголовок с префиксом типа */}
        <h2 className="text-sm sm:text-base mb-1.5">
          <span
            className="font-[family-name:var(--font-code)] text-xs mr-2"
            style={{ color: типИнфо.цвет }}
          >
            {типИнфо.текст}
          </span>
          <Link
            href={элемент.url}
            className="hover:text-[var(--color-primary)] transition-colors"
          >
            {элемент.title}
          </Link>
        </h2>

        {/* Описание */}
        {сокращённоеОписание && (
          <p className="text-sm text-[var(--color-text-muted)] mb-2 line-clamp-2">
            {сокращённоеОписание}
          </p>
        )}

        {/* Теги и метаданные */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Теги */}
          <div className="flex flex-wrap gap-1">
            {элемент.tags.map((тег) => (
              <Link
                key={тег.slug}
                href={`/tags/${тег.slug}`}
                className="px-1.5 py-0.5 text-xs rounded border border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors font-[family-name:var(--font-code)]"
              >
                {тег.title}
              </Link>
            ))}
          </div>

          {/* Автор и дата */}
          <div className="ml-auto flex items-center gap-1 text-xs text-[var(--color-text-muted)] font-[family-name:var(--font-code)] whitespace-nowrap">
            <span>{имяАвтора}</span>
            <span>·</span>
            <time dateTime={элемент.publishedAt}>
              {форматДату(элемент.publishedAt)}
            </time>
          </div>
        </div>
      </div>
    </div>
  );
}
