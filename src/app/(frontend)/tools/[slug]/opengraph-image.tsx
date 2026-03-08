import { getToolBySlug } from "@/lib/payload";
import { генерироватьOg, ogSize } from "@/lib/og-helpers";

export const alt = "Инструмент — Stackovervibe";
export const size = ogSize;
export const contentType = "image/png";

const ТИП_ЦВЕТ: Record<string, string> = {
  skill: "#00ff41",
  hook: "#00ffff",
  command: "#ff6b00",
  rule: "#ff4444",
  plugin: "#f59e0b",
};

const ТИП_ЛЕЙБЛ: Record<string, string> = {
  skill: "СКИЛЛ",
  hook: "ХУК",
  command: "КОМАНДА",
  rule: "ПРАВИЛО",
  plugin: "ПЛАГИН",
};

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const инструмент = await getToolBySlug(slug);
  const тип = инструмент?.toolType || "skill";

  return генерироватьOg({
    заголовок: инструмент?.title || slug,
    описание: инструмент?.shortDescription || undefined,
    бейдж: ТИП_ЛЕЙБЛ[тип] || тип,
    цветБейджа: ТИП_ЦВЕТ[тип] || "#00ff41",
    slug,
    путь: "tools",
  });
}
