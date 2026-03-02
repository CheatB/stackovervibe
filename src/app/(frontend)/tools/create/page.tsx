"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BreadcrumbNav } from "@/components/seo/BreadcrumbNav";
import { MarkdownEditor } from "@/components/social/MarkdownEditor";

const ТИПЫ = [
  { value: "", label: "Выберите тип" },
  { value: "skill", label: "Скилл" },
  { value: "hook", label: "Хук" },
  { value: "command", label: "Команда" },
  { value: "rule", label: "Правило" },
  { value: "plugin", label: "Плагин" },
];

export default function CreateToolPage() {
  const router = useRouter();
  const [название, setНазвание] = useState("");
  const [тип, setТип] = useState("");
  const [описание, setОписание] = useState("");
  const [код, setКод] = useState("");
  const [полноеОписание, setПолноеОписание] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [отправка, setОтправка] = useState(false);
  const [ошибка, setОшибка] = useState("");

  const отправить = async (e: React.FormEvent) => {
    e.preventDefault();
    setОшибка("");
    setОтправка(true);

    try {
      const ответ = await fetch("/api/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: название,
          toolType: тип,
          shortDescription: описание,
          ...(код ? { code: код } : {}),
          ...(полноеОписание ? { description: полноеОписание } : {}),
          ...(githubUrl ? { githubUrl } : {}),
        }),
      });

      const данные = await ответ.json();

      if (!ответ.ok) {
        setОшибка(данные.error || "Ошибка при создании инструмента");
        return;
      }

      router.push(`/tools/${данные.slug}`);
    } catch {
      setОшибка("Ошибка сети");
    } finally {
      setОтправка(false);
    }
  };

  return (
    <div>
      <BreadcrumbNav
        items={[{ label: "tools", href: "/tools" }, { label: "create" }]}
      />

      <h1 className="text-2xl font-bold font-[family-name:var(--font-code)] mb-8">
        <span className="text-[var(--color-text-muted)]">$</span> new tool
      </h1>

      <form onSubmit={отправить} className="space-y-6 max-w-3xl">
        {/* Название */}
        <div>
          <label className="block text-sm text-[var(--color-text-muted)] font-[family-name:var(--font-code)] mb-2">
            Название инструмента
          </label>
          <input
            type="text"
            value={название}
            onChange={(e) => setНазвание(e.target.value)}
            placeholder="Auto-format hook для Claude Code"
            maxLength={200}
            required
            className="w-full px-4 py-3 rounded border border-[var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text)] font-[family-name:var(--font-code)] text-sm focus:border-[var(--color-accent)] outline-none transition-colors"
          />
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            {название.length}/200 символов (минимум 5)
          </p>
        </div>

        {/* Тип */}
        <div>
          <label className="block text-sm text-[var(--color-text-muted)] font-[family-name:var(--font-code)] mb-2">
            Тип инструмента
          </label>
          <select
            value={тип}
            onChange={(e) => setТип(e.target.value)}
            required
            className="w-full px-4 py-3 rounded border border-[var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text)] font-[family-name:var(--font-code)] text-sm focus:border-[var(--color-accent)] outline-none transition-colors"
          >
            {ТИПЫ.map((т) => (
              <option key={т.value} value={т.value}>
                {т.label}
              </option>
            ))}
          </select>
        </div>

        {/* Краткое описание */}
        <div>
          <label className="block text-sm text-[var(--color-text-muted)] font-[family-name:var(--font-code)] mb-2">
            Краткое описание
          </label>
          <textarea
            value={описание}
            onChange={(e) => setОписание(e.target.value)}
            placeholder="Что делает инструмент и зачем он нужен?"
            maxLength={500}
            rows={3}
            required
            className="w-full px-4 py-3 rounded border border-[var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text)] font-[family-name:var(--font-code)] text-sm focus:border-[var(--color-accent)] outline-none transition-colors resize-y"
          />
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            {описание.length}/500 символов (минимум 10)
          </p>
        </div>

        {/* Код */}
        <div>
          <label className="block text-sm text-[var(--color-text-muted)] font-[family-name:var(--font-code)] mb-2">
            Код / конфигурация (необязательно)
          </label>
          <textarea
            value={код}
            onChange={(e) => setКод(e.target.value)}
            placeholder="YAML, JSON, bash-скрипт или любой код инструмента"
            rows={8}
            className="w-full px-4 py-3 rounded border border-[var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-primary)] font-[family-name:var(--font-code)] text-sm focus:border-[var(--color-accent)] outline-none transition-colors resize-y"
          />
        </div>

        {/* Полное описание */}
        <div>
          <label className="block text-sm text-[var(--color-text-muted)] font-[family-name:var(--font-code)] mb-2">
            Подробное описание (необязательно)
          </label>
          <MarkdownEditor
            value={полноеОписание}
            onChange={setПолноеОписание}
            placeholder="Как установить, использовать, примеры, подводные камни..."
            minRows={8}
          />
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            Поддерживается Markdown.
          </p>
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
            className="w-full px-4 py-3 rounded border border-[var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text)] font-[family-name:var(--font-code)] text-sm focus:border-[var(--color-accent)] outline-none transition-colors"
          />
        </div>

        {/* Ошибка */}
        {ошибка && (
          <p className="text-sm text-[var(--color-danger)] font-[family-name:var(--font-code)]">
            ✗ {ошибка}
          </p>
        )}

        {/* Инфо */}
        <p className="text-xs text-[var(--color-text-muted)] font-[family-name:var(--font-code)]">
          Инструмент будет отправлен на модерацию перед публикацией.
        </p>

        {/* Кнопка */}
        <button
          type="submit"
          disabled={
            отправка ||
            название.trim().length < 5 ||
            !тип ||
            описание.trim().length < 10
          }
          className="px-6 py-3 bg-[var(--color-accent)] text-[var(--color-bg)] font-bold text-sm rounded font-[family-name:var(--font-code)] hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {отправка ? "> отправка..." : "> отправить инструмент"}
        </button>
      </form>
    </div>
  );
}
