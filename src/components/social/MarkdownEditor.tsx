"use client";

import { useState, useRef, KeyboardEvent } from "react";

interface MarkdownEditorProps {
  value: string;
  onChange: (значение: string) => void;
  placeholder?: string;
  minRows?: number;
}

/** Очистить HTML от потенциально опасных тегов и атрибутов */
function очиститьHTML(html: string): string {
  return (
    html
      // Удалить script-теги и содержимое
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      // Удалить все on*-обработчики событий
      .replace(/\son\w+\s*=\s*["'][^"']*["']/gi, "")
      .replace(/\son\w+\s*=\s*[^\s>]*/gi, "")
      // Удалить javascript: ссылки
      .replace(/href\s*=\s*["']\s*javascript:[^"']*["']/gi, 'href="#"')
      // Удалить опасные теги (iframe, object, embed и т.д.)
      .replace(
        /<(iframe|object|embed|form|input|button|select|textarea|meta|link|base)[^>]*>/gi,
        "",
      )
  );
}

/** Простая конвертация markdown в HTML без сторонних библиотек */
function конвертироватьМаркдаун(текст: string): string {
  // Экранировать HTML-спецсимволы в исходном тексте
  const экранированный = текст
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const результат = экранированный
    // Блоки кода (```)
    .replace(
      /```([\s\S]*?)```/g,
      '<pre style="background:var(--color-bg);border:1px solid var(--color-border);border-radius:4px;padding:12px;overflow-x:auto;margin:8px 0"><code>$1</code></pre>',
    )
    // Инлайн-код
    .replace(
      /`([^`]+)`/g,
      '<code style="background:var(--color-bg);border:1px solid var(--color-border);padding:1px 4px;border-radius:3px;color:var(--color-primary);font-size:0.875em">$1</code>',
    )
    // Жирный
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    // Курсив
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    // Ссылки — только http/https
    .replace(
      /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
      '<a href="$2" style="color:var(--color-accent);text-decoration:underline" target="_blank" rel="noopener noreferrer">$1</a>',
    )
    // Заголовки H3
    .replace(
      /^### (.+)$/gm,
      '<h3 style="font-size:1rem;font-weight:bold;margin:16px 0 4px">$1</h3>',
    )
    // Заголовки H2
    .replace(
      /^## (.+)$/gm,
      '<h2 style="font-size:1.125rem;font-weight:bold;margin:16px 0 4px">$1</h2>',
    )
    // Заголовки H1
    .replace(
      /^# (.+)$/gm,
      '<h1 style="font-size:1.25rem;font-weight:bold;margin:16px 0 8px">$1</h1>',
    )
    // Элементы маркированного списка
    .replace(
      /^[-*] (.+)$/gm,
      '<li style="margin-left:16px;list-style-type:disc">$1</li>',
    )
    // Нумерованные элементы
    .replace(
      /^\d+\. (.+)$/gm,
      '<li style="margin-left:16px;list-style-type:decimal">$1</li>',
    )
    // Переносы строк
    .replace(/\n/g, "<br />");

  return результат;
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Напишите текст... (поддерживается markdown)",
  minRows = 6,
}: MarkdownEditorProps) {
  const [режим, setРежим] = useState<"редактор" | "превью">("редактор");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /** Вставить 2 пробела при нажатии Tab */
  const обработатьКлавишу = (событие: KeyboardEvent<HTMLTextAreaElement>) => {
    if (событие.key === "Tab") {
      событие.preventDefault();
      const начало = событие.currentTarget.selectionStart;
      const конец = событие.currentTarget.selectionEnd;
      const новоеЗначение = value.slice(0, начало) + "  " + value.slice(конец);
      onChange(новоеЗначение);

      // Восстановить позицию курсора после ре-рендера
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = начало + 2;
          textareaRef.current.selectionEnd = начало + 2;
        }
      });
    }
  };

  // Конвертируем markdown и дополнительно очищаем HTML
  const превьюHTML = очиститьHTML(конвертироватьМаркдаун(value));

  return (
    <div className="border border-[var(--color-border)] rounded-lg overflow-hidden">
      {/* Шапка с кнопками переключения */}
      <div className="flex items-center gap-1 px-3 py-2 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
        <button
          type="button"
          onClick={() => setРежим("редактор")}
          className={`px-3 py-1 text-xs rounded border transition-colors font-[family-name:var(--font-code)] ${
            режим === "редактор"
              ? "border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-primary)]/10"
              : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-text-muted)]"
          }`}
        >
          Редактор
        </button>
        <button
          type="button"
          onClick={() => setРежим("превью")}
          className={`px-3 py-1 text-xs rounded border transition-colors font-[family-name:var(--font-code)] ${
            режим === "превью"
              ? "border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-primary)]/10"
              : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-text-muted)]"
          }`}
        >
          Превью
        </button>
        <span className="ml-auto text-xs text-[var(--color-text-muted)] font-[family-name:var(--font-code)]">
          markdown
        </span>
      </div>

      {/* Редактор */}
      {режим === "редактор" && (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(е) => onChange(е.target.value)}
          onKeyDown={обработатьКлавишу}
          placeholder={placeholder}
          rows={minRows}
          className="w-full px-4 py-3 bg-[var(--color-bg-card)] text-[var(--color-text)] text-sm font-[family-name:var(--font-code)] outline-none resize-y focus:bg-[var(--color-bg)] transition-colors placeholder:text-[var(--color-text-muted)]"
        />
      )}

      {/* Превью — HTML очищен от XSS */}
      {режим === "превью" && (
        <div
          className="px-4 py-3 text-sm text-[var(--color-text)]"
          style={{ minHeight: `${minRows * 1.5}rem` }}
          // HTML очищен: экранированы спецсимволы, удалены script/event-handlers/js-ссылки
          // nosec: контент проходит через очиститьHTML() перед рендером
          dangerouslySetInnerHTML={{
            __html:
              превьюHTML ||
              '<span style="color:var(--color-text-muted)">Нет контента для отображения</span>',
          }}
        />
      )}
    </div>
  );
}
