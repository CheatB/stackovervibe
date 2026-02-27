"use client";

import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import type { CSSProperties } from "react";

interface PixelTransitionProps {
  firstContent: React.ReactNode | string;
  secondContent: React.ReactNode | string;
  gridSize?: number;
  pixelColor?: string;
  animationStepDuration?: number;
  once?: boolean;
  className?: string;
  style?: CSSProperties;
  aspectRatio?: string;
}

export default function PixelTransition({
  firstContent,
  secondContent,
  gridSize = 7,
  pixelColor = "var(--color-primary)",
  animationStepDuration = 0.3,
  once = false,
  aspectRatio = "100%",
  className = "",
  style = {},
}: PixelTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pixelGridRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLDivElement>(null);
  const delayedCallRef = useRef<gsap.core.Tween | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const pixelGridEl = pixelGridRef.current;
    if (!pixelGridEl) return;
    while (pixelGridEl.firstChild)
      pixelGridEl.removeChild(pixelGridEl.firstChild);
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const pixel = document.createElement("div");
        pixel.classList.add("pixelated-pixel", "absolute", "hidden");
        pixel.style.backgroundColor = pixelColor;
        const size = 100 / gridSize;
        pixel.style.width = `${size}%`;
        pixel.style.height = `${size}%`;
        pixel.style.left = `${col * size}%`;
        pixel.style.top = `${row * size}%`;
        pixelGridEl.appendChild(pixel);
      }
    }
  }, [gridSize, pixelColor]);

  const animatePixels = (activate: boolean) => {
    setIsActive(activate);
    const pixelGridEl = pixelGridRef.current;
    const activeEl = activeRef.current;
    if (!pixelGridEl || !activeEl) return;
    const pixels =
      pixelGridEl.querySelectorAll<HTMLDivElement>(".pixelated-pixel");
    if (!pixels.length) return;
    gsap.killTweensOf(pixels);
    if (delayedCallRef.current) delayedCallRef.current.kill();
    gsap.set(pixels, { display: "none" });
    const staggerDuration = animationStepDuration / pixels.length;
    gsap.to(pixels, {
      display: "block",
      duration: 0,
      stagger: { each: staggerDuration, from: "random" },
    });
    delayedCallRef.current = gsap.delayedCall(animationStepDuration, () => {
      activeEl.style.display = activate ? "block" : "none";
      activeEl.style.pointerEvents = activate ? "none" : "";
    });
    gsap.to(pixels, {
      display: "none",
      duration: 0,
      delay: animationStepDuration,
      stagger: { each: staggerDuration, from: "random" },
    });
  };

  const isTouchDevice =
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0);

  if (reducedMotion) {
    return (
      <div
        className={`relative overflow-hidden rounded-lg border border-[var(--color-border)] ${className}`}
        style={style}
      >
        <div style={{ paddingTop: aspectRatio }} />
        <div className="absolute inset-0 w-full h-full">{firstContent}</div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`${className} bg-[var(--color-bg-card)] rounded-lg border border-[var(--color-border)] relative overflow-hidden`}
      style={style}
      onMouseEnter={
        !isTouchDevice ? () => !isActive && animatePixels(true) : undefined
      }
      onMouseLeave={
        !isTouchDevice
          ? () => isActive && !once && animatePixels(false)
          : undefined
      }
      onClick={
        isTouchDevice
          ? () =>
              isActive && !once ? animatePixels(false) : animatePixels(true)
          : undefined
      }
      tabIndex={0}
    >
      <div style={{ paddingTop: aspectRatio }} />
      <div className="absolute inset-0 w-full h-full" aria-hidden={isActive}>
        {firstContent}
      </div>
      <div
        ref={activeRef}
        className="absolute inset-0 w-full h-full z-[2]"
        style={{ display: "none" }}
        aria-hidden={!isActive}
      >
        {secondContent}
      </div>
      <div
        ref={pixelGridRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-[3]"
      />
    </div>
  );
}
