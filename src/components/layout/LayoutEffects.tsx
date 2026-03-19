"use client";

import ClickSpark from "@/components/animations/ClickSpark";

/** Глобальные эффекты: искры при клике (фиксированный оверлей, не оборачивает контент) */
export function LayoutEffects() {
  return (
    <ClickSpark
      sparkColor="var(--color-primary)"
      sparkCount={6}
      sparkSize={8}
    />
  );
}
