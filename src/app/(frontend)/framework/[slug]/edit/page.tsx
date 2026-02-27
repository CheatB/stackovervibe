"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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

export default function EditFrameworkPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [id, setId] = useState("");
  const [название, setНазвание] = useState("");
  const [описание, setОписание] = useState("");
  const [тело, setТело] = useState("");
  const [стек, setСтек] = useState("");
  const [уровень, setУровень] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [загрузка, setЗагрузка] = useState(true);
  const [отправка, setОтправка] = useState(false);
  const [ошибка, setОшибка] = useState("");

  useEffect(() => {
    const загрузить = async () => {
      try {
        const ответ = await fetch(
          `/api/frameworks?where[slug][equals]=${slug}&depth=0`,
          {
            headers: { "Content-Type": "application/json" },
          },
        );
        if (!ответ.ok) {
          setОшибка("Фреймворк не найден");
          return;
        }
        /* Payload REST API: GET /api/frameworks?where[slug][equals]=... */
        const данные = await ответ.json();
        const ф = данные.docs?.[0];
        if (!ф) {
          setОшибка("Фреймворк не найден");
          return;
        }
        setId(String(ф.id));
        setНазвание(ф.title || "");
        setОписание(ф.description || "");
        setСтек(ф.stack || "");
        setУровень(ф.level || "");
        setGithubUrl(ф.githubUrl || "");
        /* Тело — пока оставляем пустым, пользователь переписывает */
        setТело("");
      } catch {
        setОшибка("Ошибка загрузки");
      } finally {
        setЗагрузка(false);
      }
    };
    загрузить();
  }, [slug]);

  const отправить = async (e: React.FormEvent) => {
    e.preventDefault();
    setОшибка("");
    setОтправка(true);

    try {
      const данныеДляОтправки: Record<string, string> = {
        title: название,
        description: описание,
      };
      if (тело.trim()) данныеДляОтправки.body = тело;
      if (стек) данныеДляОтправки.stack = стек;
      if (уровень) данныеДляОтправки.level = уровень;
      данныеДляОтправки.githubUrl = githubUrl;

      const ответ = await fetch(`/api/frameworks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(данныеДляОтправки),
      });

      const результат = await ответ.json();

      if (!ответ.ok) {
        setОшибка(результат.error || "Ошибка при обновлении");
        return;
      }

      router.push(`/framework/${slug}`);
    } catch {
      setОшибка("Ошибка сети");
    } finally {
      setОтправка(false);
    }
  };

  if (загрузка) {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--color-text-muted)] font-[family-name:var(--font-code)]">
          {">"} загрузка...
        </p>
      </div>
    );
  }

  return (
    <div>
      <BreadcrumbNav
        items={[
          { label: "framework", href: "/framework" },
          { label: slug, href: `/framework/${slug}` },
          { label: "edit" },
        ]}
      />

      <h1 className="text-2xl font-bold font-[family-name:var(--font-code)] mb-8">
        <span className="text-[var(--color-text-muted)]">$</span> edit framework
      </h1>

      <form onSubmit={отправить} className="space-y-6 max-w-3xl">
        <div>
          <label className="block text-sm text-[var(--color-text-muted)] font-[family-name:var(--font-code)] mb-2">
            Название
          </label>
          <input
            type="text"
            value={название}
            onChange={(e) => setНазвание(e.target.value)}
            maxLength={200}
            required
            className="w-full px-4 py-3 rounded border border-[var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text)] font-[family-name:var(--font-code)] text-sm focus:border-[var(--color-secondary)] outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm text-[var(--color-text-muted)] font-[family-name:var(--font-code)] mb-2">
            Описание
          </label>
          <textarea
            value={описание}
            onChange={(e) => setОписание(e.target.value)}
            maxLength={500}
            rows={3}
            required
            className="w-full px-4 py-3 rounded border border-[var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text)] font-[family-name:var(--font-code)] text-sm focus:border-[var(--color-secondary)] outline-none transition-colors resize-y"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-[var(--color-text-muted)] font-[family-name:var(--font-code)] mb-2">
              Стек
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
              Уровень
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

        <div>
          <label className="block text-sm text-[var(--color-text-muted)] font-[family-name:var(--font-code)] mb-2">
            GitHub URL
          </label>
          <input
            type="url"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="https://github.com/user/repo"
            className="w-full px-4 py-3 rounded border border-[var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text)] font-[family-name:var(--font-code)] text-sm focus:border-[var(--color-secondary)] outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm text-[var(--color-text-muted)] font-[family-name:var(--font-code)] mb-2">
            Новое содержание (оставьте пустым чтобы не менять)
          </label>
          <MarkdownEditor
            value={тело}
            onChange={setТело}
            placeholder="Оставьте пустым чтобы сохранить текущее содержание"
            minRows={8}
          />
        </div>

        {ошибка && (
          <p className="text-sm text-[var(--color-danger)] font-[family-name:var(--font-code)]">
            ✗ {ошибка}
          </p>
        )}

        <button
          type="submit"
          disabled={
            отправка ||
            название.trim().length < 5 ||
            описание.trim().length < 10
          }
          className="px-6 py-3 bg-[var(--color-secondary)] text-[var(--color-bg)] font-bold text-sm rounded font-[family-name:var(--font-code)] hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed neon-secondary"
        >
          {отправка ? "> обновление..." : "> сохранить изменения"}
        </button>
      </form>
    </div>
  );
}
