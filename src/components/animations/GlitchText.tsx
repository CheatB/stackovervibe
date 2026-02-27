"use client";

import { useEffect, useState, useRef } from "react";

interface GlitchTextProps {
  children: React.ReactNode;
  /** Текст для data-text (псевдо-элементы глитча). Если не указан, берётся из children (если string) */
  text?: string;
  className?: string;
  /** Скорость глитч-цикла (мс). 0 = только при hover */
  speed?: number;
  /** Авто-глитч с интервалом */
  autoGlitch?: boolean;
  autoGlitchInterval?: number;
}

/** Улучшенный CSS глитч-эффект с рандомным смещением */
export default function GlitchText({
  children,
  text,
  className = "",
  speed = 0,
  autoGlitch = false,
  autoGlitchInterval = 3000,
}: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const dataText =
    text ?? (typeof children === "string" ? children : undefined);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (!autoGlitch || reducedMotion) return;
    const interval = setInterval(() => {
      setIsGlitching(true);
      timeoutRef.current = setTimeout(
        () => setIsGlitching(false),
        speed || 300,
      );
    }, autoGlitchInterval);
    return () => {
      clearInterval(interval);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [autoGlitch, autoGlitchInterval, speed, reducedMotion]);

  if (reducedMotion) {
    return <span className={className}>{children}</span>;
  }

  return (
    <span
      className={`glitch ${className} ${isGlitching ? "glitching" : ""}`}
      data-text={dataText}
      onMouseEnter={() => setIsGlitching(true)}
      onMouseLeave={() => setIsGlitching(false)}
    >
      {children}
    </span>
  );
}
