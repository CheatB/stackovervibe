"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BreadcrumbNav } from "@/components/seo/BreadcrumbNav";
import { MarkdownEditor } from "@/components/social/MarkdownEditor";

const СТЕКИ = [
  { value: "", label: "Выберите стек" },
  { value: "claude", label: "Claude" },
  { value: "cursor", label: "Cursor" },
  { value: "copilot", label: "Copilot" },
  { value: "windsurf", label: "Windsurf" },
  { value: "other", label: "Другой" },
];

const УРОВНИ = [
  { value: "", label: "Выберите уровень" },
  { value: "beginner", label: "Новичок" },
  { value: "intermediate", label: "Средний" },
  { value: "advanced", label: "Продвинутый" },
];

export default function CreateFrameworkPage() {
  const router = useRouter();
  const [название, setНазвание] = useState("");
  const [описание, setОписание] = useState("");
  const [тело, setТело] = useState("");
  const [стек, setСтек] = useState("");
  const [уровень, setУровень] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [отправка, setОтправка] = useState(false);
  const [ошибка, setОшибка] = useState("");

  const отправить = async (e: React.FormEvent) => {
    e.preventDefault();
    setОшибка("");
    setОтправка(true);

    try {
      const ответ = await fetch("/api/frameworks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: название,
          description: описание,
          body: тело,
          ...(стек ? { stack: стек } : {}),
          ...(уровень ? { level: уровень } : {}),
          ...(githubUrl ? { githubUrl } : {}),
        }),
      });

      const данные = await ответ.json();

      if (!ответ.ok) {
        setОшибка(данные.error || "Ошибка при создании фреймворка");
        return;
      }

      router.push(`/framework/${данные.slug}`);
    } catch {
      setОшибка("Ошибка сети");
    } finally {
      setОтправка(false);
    }
  };

  return (
    <div>
      <BreadcrumbNav
        items={[
          { label: "framework", href: "/framework" },
          { label: "create" },
        ]}
      />

      <h1 className="text-2xl font-bold font-[family-name:var(--font-code)] mb-8">
        <span className="text-[var(--color-text-muted)]">$</span> new framework
      </h1>

      <form onSubmit={отправить} className="space-y-6 max-w-3xl">
        {/* Название */}
        <div>
          <label className="block text-sm text-[var(--color-text-muted)] font-[family-name:var(--font-code)] mb-2">
            Название фреймворка
          </label>
          <input
            type="text"
            value={название}
            onChange={(e) => setНазвание(e.target.value)}
            placeholder="Мой AI-фреймворк для продуктивной разработки"
            maxLength={200}
            required
            className="w-full px-4 py-3 rounded border border-[var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text)] font-[family-name:var(--font-code)] text-sm focus:border-[var(--color-secondary)] outline-none transition-colors"
          />
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            {название.length}/200 символов (минимум 5)
          </p>
        </div>

        {/* Описание */}
        <div>
          <label className="block text-sm text-[var(--color-text-muted)] font-[family-name:var(--font-code)] mb-2">
            Краткое описание
          </label>
          <textarea
            value={описание}
            onChange={(e) => setОписание(e.target.value)}
            placeholder="Что делает этот фреймворк и для кого он подходит?"
            maxLength={500}
            rows={3}
            required
            className="w-full px-4 py-3 rounded border border-[var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text)] font-[family-name:var(--font-code)] text-sm focus:border-[var(--color-secondary)] outline-none transition-colors resize-y"
          />
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            {описание.length}/500 символов (минимум 10)
          </p>
        </div>

        {/* Стек + Уровень */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-[var(--color-text-muted)] font-[family-name:var(--font-code)] mb-2">
              Стек / AI-инструмент
            </label>
            <select
              value={стек}
              onChange={(e) => setСтек(e.target.value)}
              className="w-full px-4 py-3 rounded border border-[var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text)] font-[family-name:var(--font-code)] text-sm focus:border-[var(--color-secondary)] outline-none transition-colors"
            >
              {СТЕКИ.map((с) => (
                <option key={с.value} value={с.value}>
                  {с.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-[var(--color-text-muted)] font-[family-name:var(--font-code)] mb-2">
              Уровень сложности
            </label>
            <select
              value={уровень}
              onChange={(e) => setУровень(e.target.value)}
              className="w-full px-4 py-3 rounded border border-[var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text)] font-[family-name:var(--font-code)] text-sm focus:border-[var(--color-secondary)] outline-none transition-colors"
            >
              {УРОВНИ.map((у) => (
                <option key={у.value} value={у.value}>
                  {у.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* GitHub URL */}
        <div>
          <label className="block text-sm text-[var(--color-text-muted)] font-[family-name:var(--font-code)] mb-2">
            GitHub URL (необязательно)
          </label>
          <input
            type="url"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="https://github.com/user/repo"
            className="w-full px-4 py-3 rounded border border-[var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text)] font-[family-name:var(--font-code)] text-sm focus:border-[var(--color-secondary)] outline-none transition-colors"
          />
        </div>

        {/* Тело */}
        <div>
          <label className="block text-sm text-[var(--color-text-muted)] font-[family-name:var(--font-code)] mb-2">
            Содержание фреймворка
          </label>
          <MarkdownEditor
            value={тело}
            onChange={setТело}
            placeholder="Опишите ваш фреймворк. Правила, хуки, workflow, настройки — всё что нужно AI для эффективной работы."
            minRows={12}
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

        {/* Кнопка */}
        <button
          type="submit"
          disabled={
            отправка ||
            название.trim().length < 5 ||
            описание.trim().length < 10 ||
            тело.trim().length < 20
          }
          className="px-6 py-3 bg-[var(--color-secondary)] text-[var(--color-bg)] font-bold text-sm rounded font-[family-name:var(--font-code)] hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed neon-secondary"
        >
          {отправка ? "> публикация..." : "> опубликовать фреймворк"}
        </button>
      </form>
    </div>
  );
}
