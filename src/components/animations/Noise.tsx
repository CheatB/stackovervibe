"use client";

import { useRef, useEffect, useState } from "react";

interface NoiseProps {
  patternSize?: number;
  patternRefreshInterval?: number;
  patternAlpha?: number;
  className?: string;
}

/** Шум/зернистость — ретро-терминальный эффект */
export default function Noise({
  patternSize = 250,
  patternRefreshInterval = 4,
  patternAlpha = 12,
  className = "",
}: NoiseProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let frame = 0;
    let animationId: number;

    const resize = () => {
      canvas.width = patternSize;
      canvas.height = patternSize;
    };

    const drawGrain = () => {
      const imageData = ctx.createImageData(patternSize, patternSize);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255;
        data[i] = value;
        data[i + 1] = value;
        data[i + 2] = value;
        data[i + 3] = patternAlpha;
      }
      ctx.putImageData(imageData, 0, 0);
    };

    const loop = () => {
      if (frame % patternRefreshInterval === 0) drawGrain();
      frame++;
      animationId = requestAnimationFrame(loop);
    };

    resize();
    loop();
    return () => cancelAnimationFrame(animationId);
  }, [patternSize, patternRefreshInterval, patternAlpha, reducedMotion]);

  if (reducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none fixed inset-0 w-full h-full z-[9997] ${className}`}
      style={{ imageRendering: "pixelated", opacity: 0.6 }}
      aria-hidden="true"
    />
  );
}
