"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BreadcrumbNav } from "@/components/seo/BreadcrumbNav";
import { MarkdownEditor } from "@/components/social/MarkdownEditor";

export default function NewPostPage() {
  const router = useRouter();
  const [заголовок, setЗаголовок] = useState("");
  const [контент, setКонтент] = useState("");
  const [отправка, setОтправка] = useState(false);
  const [ошибка, setОшибка] = useState("");

  const отправить = async (e: React.FormEvent) => {
    e.preventDefault();
    setОшибка("");
    setОтправка(true);

    try {
      const ответ = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: заголовок, content: контент }),
      });

      const данные = await ответ.json();

      if (!ответ.ok) {
        setОшибка(данные.error || "Ошибка при создании поста");
        return;
      }

      router.push(`/posts/${данные.slug}`);
    } catch {
      setОшибка("Ошибка сети");
    } finally {
      setОтправка(false);
    }
  };

  return (
    <div>
      <BreadcrumbNav
        items={[{ label: "posts", href: "/posts" }, { label: "new" }]}
      />

      <h1 className="text-2xl font-bold font-[family-name:var(--font-code)] mb-8">
        <span className="text-[var(--color-text-muted)]">$</span> new post
      </h1>

      <form onSubmit={отправить} className="space-y-6 max-w-3xl">
        {/* Заголовок */}
        <div>
          <label className="block text-sm text-[var(--color-text-muted)] font-[family-name:var(--font-code)] mb-2">
            Заголовок
          </label>
          <input
            type="text"
            value={заголовок}
            onChange={(e) => setЗаголовок(e.target.value)}
            placeholder="Как я настроил Claude Code для своего проекта"
            maxLength={300}
            required
            className="w-full px-4 py-3 rounded border border-[var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text)] font-[family-name:var(--font-code)] text-sm focus:border-[var(--color-primary)] outline-none transition-colors"
          />
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            {заголовок.length}/300 символов (минимум 5)
          </p>
        </div>

        {/* Контент */}
        <div>
          <label className="block text-sm text-[var(--color-text-muted)] font-[family-name:var(--font-code)] mb-2">
            Контент
          </label>
          <MarkdownEditor
            value={контент}
            onChange={setКонтент}
            placeholder="Расскажите о вашем опыте, находке или идее..."
            minRows={10}
          />
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            Минимум 20 символов. Поддерживается Markdown.
          </p>
        </div>

        {/* Ошибка */}
        {ошибка && (
          <p className="text-sm text-[var(--color-danger)] font-[family-name:var(--font-code)]">
            ✗ {ошибка}
          </p>
        )}

        {/* Инфо */}
        <p className="text-xs text-[var(--color-text-muted)] font-[family-name:var(--font-code)]">
          Пост будет отправлен на модерацию перед публикацией.
        </p>

        {/* Кнопка */}
        <button
          type="submit"
          disabled={
            отправка ||
            заголовок.trim().length < 5 ||
            контент.trim().length < 20
          }
          className="px-6 py-3 bg-[var(--color-primary)] text-[var(--color-bg)] font-bold text-sm rounded font-[family-name:var(--font-code)] hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed neon-primary"
        >
          {отправка ? "> отправка..." : "> опубликовать пост"}
        </button>
      </form>
    </div>
  );
}
