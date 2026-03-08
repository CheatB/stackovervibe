import { getQuestionBySlug } from "@/lib/payload";
import { генерироватьOg, ogSize } from "@/lib/og-helpers";

export const alt = "Вопрос — Stackovervibe";
export const size = ogSize;
export const contentType = "image/png";

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const вопрос = await getQuestionBySlug(slug);

  return генерироватьOg({
    заголовок: вопрос?.title || slug,
    бейдж: "ВОПРОС",
    цветБейджа: "#ff6b00",
    slug,
    путь: "questions",
  });
}
