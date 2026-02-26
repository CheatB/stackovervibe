"use client";

import { useState } from "react";
import { форматДату } from "@/lib/date";

interface Автор {
  displayName?: string | null;
  telegramUsername?: string | null;
}

interface AnswerData {
  id: number | string;
  /** HTML-тело ответа из CMS (Payload Lexical renderer) */
  body: string;
  author: Автор | null;
  isAccepted: boolean;
  likes: number;
  dislikes: number;
  editedAt?: string | null;
  publishedAt: string;
}

interface AnswerCardProps {
  answer: AnswerData;
  isQuestionAuthor: boolean;
  onAccept?: (id: number | string) => void;
}

/**
 * Базовая очистка HTML от потенциально опасных конструкций.
 * Тело ответа приходит из CMS, но на всякий случай — санируем.
 */
function очиститьHTML(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/\son\w+\s*=\s*["'][^"']*["']/gi, "")
    .replace(/\son\w+\s*=\s*[^\s>]*/gi, "")
    .replace(/href\s*=\s*["']\s*javascript:[^"']*["']/gi, 'href="#"')
    .replace(/<(iframe|object|embed|meta|base)[^>]*>/gi, "");
}

export function AnswerCard({
  answer,
  isQuestionAuthor,
  onAccept,
}: AnswerCardProps) {
  const [лайки, setЛайки] = useState(answer.likes);
  const [дизлайки, setДизлайки] = useState(answer.dislikes);
  const [голосовал, setГолосовал] = useState(false);
  const [принимается, setПринимается] = useState(false);

  const имяАвтора =
    answer.author?.displayName || answer.author?.telegramUsername || "Аноним";

  const отредактировано =
    answer.editedAt && answer.editedAt !== answer.publishedAt;

  /** Проголосовать через API реакций */
  const голосовать = async (тип: "like" | "dislike") => {
    if (голосовал) return;

    const fingerprint = `${navigator.userAgent}_${screen.width}x${screen.height}`;

    const ответ = await fetch("/api/reactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contentType: "answer",
        contentId: String(answer.id),
        type: тип,
        fingerprint,
      }),
    });

    if (ответ.ok) {
      if (тип === "like") setЛайки((п) => п + 1);
      else setДизлайки((п) => п + 1);
      setГолосовал(true);
    }
  };

  /** Принять ответ как лучший */
  const принятьОтвет = async () => {
    if (принимается) return;
    setПринимается(true);
    try {
      onAccept?.(answer.id);
    } finally {
      setПринимается(false);
    }
  };

  const итоговыйСчёт = лайки - дизлайки;
  const безопасноеТело = очиститьHTML(answer.body);

  return (
    <div
      className={`flex gap-4 p-4 rounded-lg border transition-colors ${
        answer.isAccepted
          ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5"
          : "border-[var(--color-border)] bg-[var(--color-bg-card)]"
      }`}
    >
      {/* Вертикальное голосование */}
      <div className="flex flex-col items-center gap-1 min-w-[40px] font-[family-name:var(--font-code)] text-sm">
        <button
          onClick={() => голосовать("like")}
          disabled={голосовал}
          title="Полезный ответ"
          className={`w-8 h-8 flex items-center justify-center rounded border transition-colors ${
            голосовал
              ? "border-[var(--color-border)] text-[var(--color-text-muted)] opacity-50 cursor-not-allowed"
              : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
          }`}
        >
          ▲
        </button>

        <span
          className={`text-base font-bold ${
            итоговыйСчёт > 0
              ? "text-[var(--color-primary)]"
              : итоговыйСчёт < 0
                ? "text-[var(--color-danger)]"
                : "text-[var(--color-text-muted)]"
          }`}
        >
          {итоговыйСчёт}
        </span>

        <button
          onClick={() => голосовать("dislike")}
          disabled={голосовал}
          title="Бесполезный ответ"
          className={`w-8 h-8 flex items-center justify-center rounded border transition-colors ${
            голосовал
              ? "border-[var(--color-border)] text-[var(--color-text-muted)] opacity-50 cursor-not-allowed"
              : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-danger)] hover:text-[var(--color-danger)]"
          }`}
        >
          ▼
        </button>

        {answer.isAccepted && (
          <span
            title="Принятый ответ"
            className="mt-1 text-[var(--color-primary)] text-lg"
          >
            ✓
          </span>
        )}
      </div>

      {/* Тело ответа */}
      <div className="flex-1 min-w-0">
        {/* Очищенный HTML из CMS */}
        <div
          className="prose prose-invert prose-sm max-w-none text-[var(--color-text)] mb-3"
          dangerouslySetInnerHTML={{ __html: безопасноеТело }}
        />

        {/* Метаданные */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-[var(--color-border)]">
          <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] font-[family-name:var(--font-code)]">
            <span>{имяАвтора}</span>
            <span>·</span>
            <time dateTime={answer.publishedAt}>
              {форматДату(answer.publishedAt)}
            </time>
            {отредактировано && answer.editedAt && (
              <span>· изменён {форматДату(answer.editedAt)}</span>
            )}
          </div>

          {isQuestionAuthor && !answer.isAccepted && (
            <button
              onClick={принятьОтвет}
              disabled={принимается}
              className="px-3 py-1 text-xs rounded border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-colors font-[family-name:var(--font-code)] disabled:opacity-50"
            >
              {принимается ? "..." : "✓ Принять ответ"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
