import type { Metadata } from "next";
import Link from "next/link";
import { getFrameworks } from "@/lib/payload";
import { generatePageMetadata } from "@/lib/seo";
import { BreadcrumbNav } from "@/components/seo/BreadcrumbNav";
import { FeedCard } from "@/components/cards/FeedCard";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: "Фреймворки — AI-методологии от сообщества",
    description:
      "Каталог фреймворков и методологий для работы с AI-ассистентами. Rules, hooks, workflows — скачивай и используй.",
    url: "/framework",
  });
}

export default async function FrameworksListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const страница = Math.max(1, Number(pageParam) || 1);
  const { docs, totalPages } = await getFrameworks(страница, 20);

  return (
    <div className="space-y-8">
      <BreadcrumbNav items={[{ label: "framework" }]} />

      {/* Hero-блок */}
      <div className="p-6 border border-[var(--color-secondary)]/30 rounded-lg bg-[var(--color-secondary)]/5">
        <h1 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-code)] mb-3">
          <span className="text-[var(--color-text-muted)]">$</span> cat
          frameworks/
        </h1>
        <p className="text-[var(--color-text-muted)] mb-4 max-w-2xl">
          AI-фреймворки — это наборы правил, хуков и workflow для работы с
          ИИ-ассистентами. Скачай .md файл и закинь в свой проект — Claude,
          Cursor или любой AI поймёт.
        </p>
        <Link
          href="/framework/create"
          className="inline-block px-5 py-2.5 bg-[var(--color-secondary)] text-[var(--color-bg)] font-bold text-sm rounded font-[family-name:var(--font-code)] hover:opacity-90 transition neon-secondary"
        >
          {">"} создать фреймворк
        </Link>
      </div>

      {/* Лента */}
      {docs.length === 0 ? (
        <div className="p-8 border border-[var(--color-border)] rounded-lg text-center">
          <p className="text-[var(--color-text-muted)] font-[family-name:var(--font-code)]">
            {">"} Пока нет фреймворков. Будь первым!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {docs.map((ф) => {
            const автор = typeof ф.author === "object" ? ф.author : null;
            return (
              <FeedCard
                key={ф.id}
                элемент={{
                  id: ф.id,
                  type: "framework",
                  title: ф.title,
                  slug: ф.slug,
                  url: `/framework/${ф.slug}`,
                  excerpt: (ф.description as string) || "",
                  votes:
                    ((ф.likes as number) || 0) - ((ф.dislikes as number) || 0),
                  views: (ф.views as number) || 0,
                  answersCount: 0,
                  downloads: (ф.downloads as number) || 0,
                  tags: Array.isArray(ф.tags)
                    ? ф.tags
                        .filter((t: any) => typeof t === "object")
                        .map((t: any) => ({ title: t.title, slug: t.slug }))
                    : [],
                  author: автор
                    ? {
                        displayName: (автор as any).displayName,
                        telegramUsername: (автор as any).telegramUsername,
                      }
                    : null,
                  publishedAt:
                    (ф.publishedAt as string) || (ф.createdAt as string),
                  hasAcceptedAnswer: false,
                }}
              />
            );
          })}
        </div>
      )}

      {/* Пагинация */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 font-[family-name:var(--font-code)] text-sm">
          {страница > 1 && (
            <Link
              href={`/framework?page=${страница - 1}`}
              className="px-3 py-1.5 border border-[var(--color-border)] rounded hover:border-[var(--color-secondary)] transition-colors"
            >
              {"<"} назад
            </Link>
          )}
          <span className="px-3 py-1.5 text-[var(--color-text-muted)]">
            {страница} / {totalPages}
          </span>
          {страница < totalPages && (
            <Link
              href={`/framework?page=${страница + 1}`}
              className="px-3 py-1.5 border border-[var(--color-border)] rounded hover:border-[var(--color-secondary)] transition-colors"
            >
              далее {">"}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
