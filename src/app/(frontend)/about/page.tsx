import type { Metadata } from "next";
import Link from "next/link";
import { generatePageMetadata } from "@/lib/seo";
import { BreadcrumbNav } from "@/components/seo/BreadcrumbNav";
import { JsonLd } from "@/components/seo/JsonLd";
import { getSiteStats } from "@/lib/payload";

export const revalidate = 3600;

const САЙТ_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = generatePageMetadata({
  title: "О проекте Stackovervibe",
  description:
    "Stackovervibe — открытая база знаний по вайбкодингу. Кто мы, зачем создали проект и как он помогает начать кодить с AI.",
  url: "/about",
});

export default async function AboutPage() {
  const статистика = await getSiteStats();

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "О проекте Stackovervibe",
          url: `${САЙТ_URL}/about`,
          mainEntity: {
            "@type": "Organization",
            name: "Stackovervibe",
            url: САЙТ_URL,
            description:
              "Открытая база знаний по вайбкодингу — гайды, инструменты, фреймворки.",
            foundingDate: "2025",
            sameAs: ["https://t.me/CheatB", "https://github.com/CheatB"],
          },
        }}
      />

      <BreadcrumbNav items={[{ label: "about" }]} />

      <h1 className="text-3xl md:text-4xl">О проекте</h1>

      <div className="space-y-6 text-[var(--color-text-muted)] leading-relaxed">
        <section>
          <h2 className="text-xl text-[var(--color-text)] mb-3">
            Что такое Stackovervibe
          </h2>
          <p>
            Stackovervibe — открытая база знаний по вайбкодингу. Мы собираем
            пошаговые гайды, инструменты (скиллы, хуки, команды), фреймворки и
            ответы на вопросы — всё, что нужно для работы с AI-ассистентами:
            Claude, Cursor, Copilot и другими.
          </p>
        </section>

        <section>
          <h2 className="text-xl text-[var(--color-text)] mb-3">
            Зачем мы это делаем
          </h2>
          <p>
            Вайбкодинг — новый подход к разработке, где AI пишет код, а человек
            направляет процесс. Информация разрозненна: часть в Twitter-тредах,
            часть в YouTube-видео, часть в закрытых чатах. Stackovervibe
            собирает это в одном месте — структурированно, на русском, с
            возможностью скачать и сразу использовать.
          </p>
        </section>

        <section>
          <h2 className="text-xl text-[var(--color-text)] mb-3">
            Что здесь есть
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4">
            <div className="p-3 border border-[var(--color-border)] rounded-lg text-center">
              <div className="text-2xl font-bold text-[var(--color-primary)] font-[family-name:var(--font-code)]">
                {статистика.guides}
              </div>
              <div className="text-xs">гайдов</div>
            </div>
            <div className="p-3 border border-[var(--color-border)] rounded-lg text-center">
              <div className="text-2xl font-bold text-[var(--color-secondary)] font-[family-name:var(--font-code)]">
                {статистика.tools}
              </div>
              <div className="text-xs">инструментов</div>
            </div>
            <div className="p-3 border border-[var(--color-border)] rounded-lg text-center">
              <div className="text-2xl font-bold text-[var(--color-accent)] font-[family-name:var(--font-code)]">
                {статистика.frameworks}
              </div>
              <div className="text-xs">фреймворков</div>
            </div>
            <div className="p-3 border border-[var(--color-border)] rounded-lg text-center">
              <div className="text-2xl font-bold text-[var(--color-text)] font-[family-name:var(--font-code)]">
                {статистика.questions}
              </div>
              <div className="text-xs">вопросов</div>
            </div>
            <div className="p-3 border border-[var(--color-border)] rounded-lg text-center">
              <div className="text-2xl font-bold text-[var(--color-text)] font-[family-name:var(--font-code)]">
                {статистика.posts}
              </div>
              <div className="text-xs">постов</div>
            </div>
          </div>
          <p>
            Весь контент можно скачать в .md формате и использовать в Claude,
            Cursor или любом AI-ассистенте.
          </p>
        </section>

        <section>
          <h2 className="text-xl text-[var(--color-text)] mb-3">Автор</h2>
          <p>
            Проект создан{" "}
            <a
              href="https://t.me/CheatB"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-primary)] hover:underline"
            >
              @CheatB
            </a>{" "}
            — разработчиком и энтузиастом AI-инструментов. Весь сайт, включая
            этот текст, создан методом вайбкодинга с Claude.
          </p>
        </section>

        <section>
          <h2 className="text-xl text-[var(--color-text)] mb-3">
            Как помочь проекту
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <Link
                href="/questions/ask"
                className="text-[var(--color-primary)] hover:underline"
              >
                Задай вопрос
              </Link>{" "}
              — сообщество поможет
            </li>
            <li>
              <Link
                href="/framework/create"
                className="text-[var(--color-primary)] hover:underline"
              >
                Поделись фреймворком
              </Link>{" "}
              — расскажи о своей методологии
            </li>
            <li>
              <Link
                href="/tools/create"
                className="text-[var(--color-primary)] hover:underline"
              >
                Добавь инструмент
              </Link>{" "}
              — скилл, хук или команду
            </li>
            <li>
              <a
                href="https://github.com/CheatB"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-primary)] hover:underline"
              >
                GitHub
              </a>{" "}
              — исходный код проекта открыт
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
