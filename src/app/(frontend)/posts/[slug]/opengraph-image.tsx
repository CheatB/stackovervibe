import { getPostBySlug } from "@/lib/payload";
import { генерироватьOg, ogSize } from "@/lib/og-helpers";

export const alt = "Пост — Stackovervibe";
export const size = ogSize;
export const contentType = "image/png";

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const пост = await getPostBySlug(slug);

  return генерироватьOg({
    заголовок: пост?.title || slug,
    бейдж: "ПОСТ",
    цветБейджа: "#888888",
    slug,
    путь: "posts",
  });
}
