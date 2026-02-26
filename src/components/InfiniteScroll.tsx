"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { FeedCard, type FeedItem } from "@/components/cards/FeedCard";

interface InfiniteScrollProps {
  initialItems: FeedItem[];
  fetchUrl?: string;
  initialPage?: number;
  hasMore: boolean;
  searchParams?: Record<string, string>;
}

export function InfiniteScroll({
  initialItems,
  fetchUrl = "/api/feed",
  initialPage = 1,
  hasMore: начальноеЕстьЕщё,
  searchParams = {},
}: InfiniteScrollProps) {
  const [элементы, setЭлементы] = useState<FeedItem[]>(initialItems);
  const [страница, setСтраница] = useState(initialPage);
  const [загружается, setЗагружается] = useState(false);
  const [естьЕщё, setЕстьЕщё] = useState(начальноеЕстьЕщё);
  const [ошибка, setОшибка] = useState<string | null>(null);

  const sentinelRef = useRef<HTMLDivElement>(null);

  /** Загрузить следующую страницу */
  const загрузитьЕщё = useCallback(async () => {
    if (загружается || !естьЕщё) return;

    setЗагружается(true);
    setОшибка(null);

    try {
      const параметры = new URLSearchParams({
        ...searchParams,
        page: String(страница + 1),
      });

      const ответ = await fetch(`${fetchUrl}?${параметры.toString()}`);
      if (!ответ.ok) throw new Error("Ошибка загрузки");

      const данные = await ответ.json();
      const новыеЭлементы: FeedItem[] = данные.items ?? [];

      setЭлементы((пред) => [...пред, ...новыеЭлементы]);
      setСтраница((п) => п + 1);
      setЕстьЕщё(данные.hasMore ?? false);
    } catch {
      setОшибка("Не удалось загрузить. Попробуйте снова.");
    } finally {
      setЗагружается(false);
    }
  }, [загружается, естьЕщё, страница, fetchUrl, searchParams]);

  /** IntersectionObserver — следим за sentinel-элементом */
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const наблюдатель = new IntersectionObserver(
      (записи) => {
        if (записи[0].isIntersecting && естьЕщё && !загружается) {
          загрузитьЕщё();
        }
      },
      { rootMargin: "200px" },
    );

    наблюдатель.observe(sentinel);
    return () => наблюдатель.unobserve(sentinel);
  }, [загрузитьЕщё, естьЕщё, загружается]);

  return (
    <div className="space-y-3">
      {/* Список карточек */}
      {элементы.map((элемент) => (
        <FeedCard key={`${элемент.type}-${элемент.id}`} элемент={элемент} />
      ))}

      {/* Элемент-триггер для IntersectionObserver */}
      <div ref={sentinelRef} className="h-4" />

      {/* Спиннер загрузки */}
      {загружается && (
        <div className="py-4 font-[family-name:var(--font-code)] text-sm text-[var(--color-text-muted)]">
          <span className="text-[var(--color-primary)]">&gt;</span> загрузка
          <span className="animate-[blink_1s_step-end_infinite]">_</span>
        </div>
      )}

      {/* Ошибка */}
      {ошибка && (
        <div className="py-4 font-[family-name:var(--font-code)] text-sm">
          <span className="text-[var(--color-danger)]">! {ошибка}</span>
          <button
            onClick={загрузитьЕщё}
            className="ml-3 text-[var(--color-primary)] hover:underline"
          >
            повторить
          </button>
        </div>
      )}

      {/* Конец ленты */}
      {!естьЕщё && !загружается && элементы.length > 0 && (
        <div className="py-4 font-[family-name:var(--font-code)] text-sm text-[var(--color-text-muted)] text-center border-t border-[var(--color-border)]">
          <span className="text-[var(--color-primary)]">~</span> конец ленты
        </div>
      )}

      {/* Пустая лента */}
      {!естьЕщё && !загружается && элементы.length === 0 && (
        <div className="py-8 font-[family-name:var(--font-code)] text-sm text-[var(--color-text-muted)] text-center">
          <span className="text-[var(--color-primary)]">&gt;</span> Нет
          элементов по выбранным фильтрам
        </div>
      )}
    </div>
  );
}
