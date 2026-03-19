"use client";

import React, { useRef, useEffect, useCallback, useState } from "react";

interface ClickSparkProps {
  sparkColor?: string;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
  easing?: "linear" | "ease-in" | "ease-out" | "ease-in-out";
  extraScale?: number;
}

interface Spark {
  x: number;
  y: number;
  angle: number;
  startTime: number;
}

/** Фиксированный оверлей для искр при клике — не оборачивает контент */
export default function ClickSpark({
  sparkColor = "var(--color-primary)",
  sparkSize = 10,
  sparkRadius = 15,
  sparkCount = 8,
  duration = 400,
  easing = "ease-out",
  extraScale = 1.0,
}: ClickSparkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparksRef = useRef<Spark[]>([]);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const getResolvedColor = useCallback((): string => {
    if (sparkColor.startsWith("var(")) {
      const el = document.documentElement;
      const varName = sparkColor.replace("var(", "").replace(")", "").trim();
      return getComputedStyle(el).getPropertyValue(varName).trim() || "#00ff41";
    }
    return sparkColor;
  }, [sparkColor]);

  /** Ресайз canvas под viewport */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  const easeFunc = useCallback(
    (t: number) => {
      switch (easing) {
        case "linear":
          return t;
        case "ease-in":
          return t * t;
        case "ease-in-out":
          return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        default:
          return t * (2 - t);
      }
    },
    [easing],
  );

  const animatingRef = useRef(false);

  const startAnimation = useCallback(() => {
    if (animatingRef.current || reducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    animatingRef.current = true;
    const resolvedColor = getResolvedColor();

    const draw = (timestamp: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      sparksRef.current = sparksRef.current.filter((spark) => {
        const elapsed = timestamp - spark.startTime;
        if (elapsed >= duration) return false;
        const progress = elapsed / duration;
        const eased = easeFunc(progress);
        const distance = eased * sparkRadius * extraScale;
        const lineLength = sparkSize * (1 - eased);
        const x1 = spark.x + distance * Math.cos(spark.angle);
        const y1 = spark.y + distance * Math.sin(spark.angle);
        const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
        const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

        ctx.strokeStyle = resolvedColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        return true;
      });

      if (sparksRef.current.length > 0) {
        requestAnimationFrame(draw);
      } else {
        animatingRef.current = false;
      }
    };
    requestAnimationFrame(draw);
  }, [
    sparkSize,
    sparkRadius,
    duration,
    easeFunc,
    extraScale,
    reducedMotion,
    getResolvedColor,
  ]);

  /** Слушаем клики на document — не мешаем выделению текста */
  useEffect(() => {
    if (reducedMotion) return;

    const handleClick = (e: MouseEvent) => {
      // Пропускаем если пользователь выделяет текст
      const selection = window.getSelection();
      if (selection && selection.toString().length > 0) return;

      const canvas = canvasRef.current;
      if (!canvas) return;
      const now = performance.now();
      const newSparks: Spark[] = Array.from({ length: sparkCount }, (_, i) => ({
        x: e.clientX,
        y: e.clientY,
        angle: (2 * Math.PI * i) / sparkCount,
        startTime: now,
      }));
      sparksRef.current.push(...newSparks);
      startAnimation();
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [sparkCount, startAnimation, reducedMotion]);

  if (reducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9998]"
      aria-hidden="true"
    />
  );
}
