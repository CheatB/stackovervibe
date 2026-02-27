"use client";

import CountUp from "@/components/animations/CountUp";

interface SidebarStatsProps {
  stats: {
    guides: number;
    tools: number;
    questions: number;
    posts: number;
  };
}

/** Статистика в сайдбаре с анимацией CountUp */
export function SidebarStats({ stats }: SidebarStatsProps) {
  const строки = [
    {
      лейбл: "гайды",
      значение: stats.guides,
      цвет: "text-[var(--color-primary)]",
    },
    {
      лейбл: "инструменты",
      значение: stats.tools,
      цвет: "text-[var(--color-secondary)]",
    },
    {
      лейбл: "вопросы",
      значение: stats.questions,
      цвет: "text-[var(--color-accent)]",
    },
    {
      лейбл: "посты",
      значение: stats.posts,
      цвет: "text-[var(--color-text)]",
    },
  ];

  return (
    <div className="p-3 space-y-1.5 font-[family-name:var(--font-code)] text-sm">
      {строки.map((строка) => (
        <div key={строка.лейбл} className="flex justify-between">
          <span className="text-[var(--color-text-muted)]">{строка.лейбл}</span>
          <span className={строка.цвет}>
            <CountUp to={строка.значение} duration={1.5} />
          </span>
        </div>
      ))}
    </div>
  );
}
