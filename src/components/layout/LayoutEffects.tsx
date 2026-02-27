"use client";

import ClickSpark from "@/components/animations/ClickSpark";

/** Обёртка для глобальных эффектов: искры при клике */
export function LayoutEffects({ children }: { children: React.ReactNode }) {
  return (
    <ClickSpark sparkColor="var(--color-primary)" sparkCount={6} sparkSize={8}>
      {children}
    </ClickSpark>
  );
}
