"use client";

import { useRouter, useSearchParams } from "next/navigation";

/** Типы контента для фильтрации */
const ТИПЫ_КОНТЕНТА = [
  { value: "", label: "Все" },
  { value: "guide", label: "Гайды" },
  { value: "tool", label: "Инструменты" },
  { value: "question", label: "Вопросы" },
  { value: "post", label: "Посты" },
];

/** Варианты сортировки */
const ВАРИАНТЫ_СОРТИРОВКИ = [
  { value: "new", label: "Новое" },
  { value: "hot", label: "Горячее" },
  { value: "top", label: "Лучшее" },
];

export function FeedFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const текущийТип = searchParams.get("type") ?? "";
  const текущаяСортировка = searchParams.get("sort") ?? "new";

  /** Обновить один query-параметр, остальные сохранить */
  const обновитьПараметр = (ключ: string, значение: string) => {
    const параметры = new URLSearchParams(searchParams.toString());
    if (значение && значение !== "new") {
      параметры.set(ключ, значение);
    } else if (ключ === "sort" && значение === "new") {
      параметры.delete(ключ);
    } else if (!значение) {
      параметры.delete(ключ);
    } else {
      параметры.set(ключ, значение);
    }
    // Сбросить на первую страницу при смене фильтра
    параметры.delete("page");
    router.push(`/?${параметры.toString()}`);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Десктоп: кнопки типов */}
      <div className="hidden sm:flex gap-1">
        {ТИПЫ_КОНТЕНТА.map((тип) => (
          <button
            key={тип.value}
            onClick={() => обновитьПараметр("type", тип.value)}
            className={`px-3 py-1.5 text-sm rounded border transition-colors font-[family-name:var(--font-code)] ${
              текущийТип === тип.value
                ? "border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-primary)]/10"
                : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-text-muted)]"
            }`}
          >
            {тип.label}
          </button>
        ))}
      </div>

      {/* Мобильный: выпадающий список типов */}
      <select
        value={текущийТип}
        onChange={(e) => обновитьПараметр("type", e.target.value)}
        className="sm:hidden flex-1 px-3 py-1.5 text-sm rounded border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:border-[var(--color-primary)] outline-none font-[family-name:var(--font-code)]"
      >
        {ТИПЫ_КОНТЕНТА.map((тип) => (
          <option key={тип.value} value={тип.value}>
            {тип.label}
          </option>
        ))}
      </select>

      {/* Сортировка — прижата к правому краю через ml-auto */}
      <select
        value={текущаяСортировка}
        onChange={(e) => обновитьПараметр("sort", e.target.value)}
        className="ml-auto px-3 py-1.5 text-sm rounded border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:border-[var(--color-primary)] outline-none font-[family-name:var(--font-code)]"
      >
        {ВАРИАНТЫ_СОРТИРОВКИ.map((вариант) => (
          <option key={вариант.value} value={вариант.value}>
            {вариант.label} ▾
          </option>
        ))}
      </select>
    </div>
  );
}
