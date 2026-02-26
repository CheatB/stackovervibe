"use client";

import { useEffect } from "react";

interface ViewsTrackerProps {
  contentType: string;
  contentId: string;
}

/**
 * Компонент-невидимка: при монтировании отправляет просмотр на API.
 * Fire-and-forget — ошибки игнорируются намеренно.
 */
export function ViewsTracker({ contentType, contentId }: ViewsTrackerProps) {
  useEffect(() => {
    fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contentType, contentId }),
    }).catch(() => {
      // Намеренно игнорируем — это некритичный трекинг
    });
  }, [contentType, contentId]);

  return null;
}
