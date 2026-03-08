import { getFrameworkBySlug } from "@/lib/payload";
import { генерироватьOg, ogSize } from "@/lib/og-helpers";

export const alt = "Фреймворк — Stackovervibe";
export const size = ogSize;
export const contentType = "image/png";

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const фреймворк = await getFrameworkBySlug(slug);

  return генерироватьOg({
    заголовок: фреймворк?.title || slug,
    описание: (фреймворк as any)?.description || undefined,
    бейдж: "ФРЕЙМВОРК",
    цветБейджа: "#00ffff",
    slug,
    путь: "framework",
  });
}
