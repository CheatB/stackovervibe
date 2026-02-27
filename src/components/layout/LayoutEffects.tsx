"use client";

import ClickSpark from "@/components/animations/ClickSpark";
import Noise from "@/components/animations/Noise";

/** Обёртка для глобальных эффектов: искры при клике + шум */
export function LayoutEffects({ children }: { children: React.ReactNode }) {
  return (
    <ClickSpark sparkColor="var(--color-primary)" sparkCount={6} sparkSize={8}>
      {children}
      <Noise patternAlpha={10} patternRefreshInterval={5} />
    </ClickSpark>
  );
}
