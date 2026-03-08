import Link from "next/link";
import { getRelatedByTags } from "@/lib/payload";

const ТИП_ЛЕЙБЛ: Record<string, string> = {
  tool: "инструмент",
  question: "вопрос",
  post: "пост",
  framework: "фреймворк",
};

interface RelatedContentProps {
  тегиSlug: string[];
  исключитьId: number | string;
  исключитьТип: string;
}

export async function RelatedContent({
  тегиSlug,
  исключитьId,
  исключитьТип,
}: RelatedContentProps) {
  const связанные = await getRelatedByTags(
    тегиSlug,
    исключитьId,
    исключитьТип,
    5,
  );

  if (связанные.length === 0) return null;

  return (
    <section className="pt-6 border-t border-[var(--color-border)]">
      <h2 className="text-lg font-bold font-[family-name:var(--font-code)] mb-4">
        Связанный контент
      </h2>
      <ul className="space-y-2">
        {связанные.map((элемент) => (
          <li key={`${элемент.type}-${элемент.id}`}>
            <Link
              href={элемент.url}
              className="group flex items-start gap-2 text-sm hover:text-[var(--color-primary)] transition-colors"
            >
              <span className="shrink-0 text-[0.65rem] px-1.5 py-0.5 rounded border border-[var(--color-border)] text-[var(--color-text-muted)] font-[family-name:var(--font-code)]">
                {ТИП_ЛЕЙБЛ[элемент.type] || элемент.type}
              </span>
              <span className="group-hover:underline">{элемент.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
