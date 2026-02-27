"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

interface TextCursorProps {
  text?: string;
  spacing?: number;
  followMouseDirection?: boolean;
  randomFloat?: boolean;
  exitDuration?: number;
  removalInterval?: number;
  maxPoints?: number;
  className?: string;
}

interface TrailItem {
  id: number;
  x: number;
  y: number;
  angle: number;
  randomX?: number;
  randomY?: number;
  randomRotate?: number;
}

export default function TextCursor({
  text = ">_",
  spacing = 100,
  followMouseDirection = true,
  randomFloat = true,
  exitDuration = 0.5,
  removalInterval = 30,
  maxPoints = 5,
  className = "",
}: TextCursorProps) {
  const [trail, setTrail] = useState<TrailItem[]>([]);
  const [reducedMotion, setReducedMotion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastMoveTimeRef = useRef(Date.now());
  const idCounter = useRef(0);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      setTrail((prev) => {
        let newTrail = [...prev];
        if (newTrail.length === 0) {
          newTrail.push({
            id: idCounter.current++,
            x: mouseX,
            y: mouseY,
            angle: 0,
            ...(randomFloat && {
              randomX: Math.random() * 10 - 5,
              randomY: Math.random() * 10 - 5,
              randomRotate: Math.random() * 10 - 5,
            }),
          });
        } else {
          const last = newTrail[newTrail.length - 1];
          const dx = mouseX - last.x;
          const dy = mouseY - last.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance >= spacing) {
            const rawAngle = (Math.atan2(dy, dx) * 180) / Math.PI;
            const computedAngle = followMouseDirection
              ? ((rawAngle + 180) % 360) - 180
              : 0;
            const steps = Math.floor(distance / spacing);
            for (let i = 1; i <= steps; i++) {
              const t = (spacing * i) / distance;
              newTrail.push({
                id: idCounter.current++,
                x: last.x + dx * t,
                y: last.y + dy * t,
                angle: computedAngle,
                ...(randomFloat && {
                  randomX: Math.random() * 10 - 5,
                  randomY: Math.random() * 10 - 5,
                  randomRotate: Math.random() * 10 - 5,
                }),
              });
            }
          }
        }
        if (newTrail.length > maxPoints)
          newTrail = newTrail.slice(newTrail.length - maxPoints);
        return newTrail;
      });
      lastMoveTimeRef.current = Date.now();
    };

    container.addEventListener("mousemove", handleMouseMove);
    return () => container.removeEventListener("mousemove", handleMouseMove);
  }, [spacing, followMouseDirection, randomFloat, maxPoints, reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;
    const interval = setInterval(() => {
      if (Date.now() - lastMoveTimeRef.current > 100) {
        setTrail((prev) => (prev.length > 0 ? prev.slice(1) : prev));
      }
    }, removalInterval);
    return () => clearInterval(interval);
  }, [removalInterval, reducedMotion]);

  return (
    <div ref={containerRef} className={`w-full h-full relative ${className}`}>
      {!reducedMotion && (
        <div className="absolute inset-0 pointer-events-none">
          <AnimatePresence>
            {trail.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 1, rotate: item.angle }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  x: randomFloat ? [0, item.randomX || 0, 0] : 0,
                  y: randomFloat ? [0, item.randomY || 0, 0] : 0,
                  rotate: randomFloat
                    ? [
                        item.angle,
                        item.angle + (item.randomRotate || 0),
                        item.angle,
                      ]
                    : item.angle,
                }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{
                  opacity: { duration: exitDuration, ease: "easeOut" },
                  ...(randomFloat && {
                    x: {
                      duration: 2,
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatType: "mirror" as const,
                    },
                    y: {
                      duration: 2,
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatType: "mirror" as const,
                    },
                    rotate: {
                      duration: 2,
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatType: "mirror" as const,
                    },
                  }),
                }}
                className="absolute select-none whitespace-nowrap text-lg font-[family-name:var(--font-code)] text-[var(--color-primary)]"
                style={{ left: item.x, top: item.y }}
              >
                {text}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
