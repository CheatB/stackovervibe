import { getGuideBySlug } from "@/lib/payload";
import { генерироватьOg, ogSize } from "@/lib/og-helpers";

export const alt = "Гайд — Stackovervibe";
export const size = ogSize;
export const contentType = "image/png";

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const гайд = await getGuideBySlug(slug);

  return генерироватьOg({
    заголовок: гайд?.title || slug,
    описание: гайд?.excerpt || undefined,
    бейдж: "ГАЙД",
    цветБейджа: "#00ff41",
    slug,
    путь: "path",
  });
}
