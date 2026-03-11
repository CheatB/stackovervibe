import type { Metadata } from "next";
import Link from "next/link";
import { getFeedPage, getHotQuestions, getSiteStats } from "@/lib/payload";

/** ISR: обновляем кэш раз в 60 сек */
export const revalidate = 60;

const САЙТ = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  alternates: { canonical: САЙТ },
};
import { JsonLd } from "@/components/seo/JsonLd";
import { FeedFilters } from "@/components/FeedFilters";
import { InfiniteScroll } from "@/components/InfiniteScroll";
import { Sidebar } from "@/components/Sidebar";
import { HeroSection } from "@/components/HeroSection";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; sort?: string }>;
}) {
  const { type, sort } = await searchParams;
  const текущийТип = type || "all";
  const текущаяСортировка = sort || "new";

  const [лента, горячие, статистика] = await Promise.all([
    getFeedPage({
      type: текущийТип,
      sort: текущаяСортировка,
      page: 1,
      limit: 20,
    }),
    getHotQuestions(5),
    getSiteStats(),
  ]);

  const searchParamsObj: Record<string, string> = {};
  if (текущийТип !== "all") searchParamsObj.type = текущийТип;
  if (текущаяСортировка !== "new") searchParamsObj.sort = текущаяСортировка;

  return (
    <div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Stackovervibe",
          url: САЙТ,
          description: "Структурированная база знаний по вайбкодингу.",
          potentialAction: {
            "@type": "SearchAction",
            target: `${САЙТ}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Stackovervibe",
          url: САЙТ,
          description:
            "Структурированная база знаний по вайбкодингу — гайды, инструменты, фреймворки.",
          sameAs: ["https://t.me/CheatB", "https://github.com/CheatB"],
        }}
      />

      <h1 className="sr-only">Stackovervibe — база знаний по вайбкодингу</h1>

      {/* ASCII Logo + GlitchText + DecryptedText + FaultyTerminal фон */}
      <HeroSection />

      {/* Разделитель */}
      <div className="text-center text-[var(--color-border)] font-[family-name:var(--font-code)] text-xs select-none mb-6 overflow-hidden">
        ════════════════════════════════════════
      </div>

      {/* SEO-блок: описание сайта */}
      <section className="mb-8 p-6 rounded border border-[var(--color-border)] bg-[var(--color-surface)]">
        <h2 className="text-lg font-bold mb-4 font-[family-name:var(--font-code)] text-[var(--color-primary)]">
          Что такое Stackovervibe?
        </h2>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4">
          Stackovervibe — структурированная база знаний по вайбкодингу.
          Вайбкодинг — это способ создавать приложения, сайты и ботов с помощью
          AI: ты описываешь что хочешь словами, а нейросеть пишет код. Здесь
          собраны проверенные гайды, инструменты и фреймворки для работы с
          Claude Code, Cursor, Windsurf и другими AI-ассистентами.
        </p>

        <div className="grid sm:grid-cols-3 gap-4 text-sm">
          <div>
            <h3 className="font-bold mb-1 text-[var(--color-text)]">
              Путь новичка
            </h3>
            <p className="text-[var(--color-text-muted)] text-xs leading-relaxed">
              Пошаговые гайды от &quot;что такое вайбкодинг&quot; до деплоя
              своего проекта. Начни с нуля — дойди до рабочего продукта.
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-1 text-[var(--color-text)]">
              Инструменты и скиллы
            </h3>
            <p className="text-[var(--color-text-muted)] text-xs leading-relaxed">
              Каталог скиллов, хуков, команд и плагинов для Claude Code. Скачай
              .md и закинь в свой проект — AI заработает лучше.
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-1 text-[var(--color-text)]">
              Вопросы и ответы
            </h3>
            <p className="text-[var(--color-text-muted)] text-xs leading-relaxed">
              Сообщество разработчиков, которые пишут код с AI. Задавай вопросы,
              делись опытом, получай ответы от практиков.
            </p>
          </div>
        </div>
      </section>

      {/* CTA — создать контент */}
      <div className="flex flex-wrap gap-3 mb-6 font-[family-name:var(--font-code)] text-sm">
        <Link
          href="/questions/ask"
          className="px-4 py-2 rounded border border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 transition-colors"
        >
          {">"} задать вопрос
        </Link>
        <Link
          href="/framework/create"
          className="px-4 py-2 rounded border border-[var(--color-secondary)] text-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/10 transition-colors"
        >
          {">"} создать фреймворк
        </Link>
        <Link
          href="/tools/create"
          className="px-4 py-2 rounded border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-colors"
        >
          {">"} создать инструмент
        </Link>
        <Link
          href="/posts/new"
          className="px-4 py-2 rounded border border-[var(--color-text-muted)] text-[var(--color-text-muted)] hover:bg-[var(--color-text-muted)]/10 transition-colors"
        >
          {">"} написать пост
        </Link>
      </div>

      {/* Фильтры */}
      <FeedFilters />

      {/* Лента + Сайдбар */}
      <div className="flex flex-col lg:flex-row gap-6 mt-6">
        {/* Лента */}
        <div className="flex-1 min-w-0">
          <InfiniteScroll
            key={`${текущийТип}-${текущаяСортировка}`}
            initialItems={лента.items}
            initialPage={1}
            hasMore={лента.hasMore}
            searchParams={searchParamsObj}
          />
        </div>

        {/* Сайдбар — компактный на мобиле, полный на десктопе */}
        <aside className="w-full lg:w-72 lg:flex-shrink-0">
          <Sidebar
            hotQuestions={горячие.map((в: any) => ({
              title: в.title,
              slug: в.slug,
            }))}
            stats={статистика}
          />
        </aside>
      </div>
    </div>
  );
}
