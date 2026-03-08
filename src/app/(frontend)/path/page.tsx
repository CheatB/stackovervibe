import type { Metadata } from "next";
import { getPathGuides } from "@/lib/payload";

export const revalidate = 60;
import { PathStepCard } from "@/components/cards/PathStepCard";
import { BreadcrumbNav } from "@/components/seo/BreadcrumbNav";
import AnimatedContent from "@/components/animations/AnimatedContent";
import BlurText from "@/components/animations/BlurText";

const САЙТ_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "Как начать вайбкодить — пошаговый путь с нуля",
  description:
    "Пошаговый гайд по вайбкодингу: от установки Claude/Cursor до первого проекта. 8 шагов от нуля до рабочей среды — без воды, по делу.",
  alternates: { canonical: `${САЙТ_URL}/path` },
};

export default async function PathPage() {
  const гайды = await getPathGuides();

  return (
    <div className="space-y-8">
      <BreadcrumbNav items={[{ label: "path" }]} />
      <div>
        <h1 className="text-3xl md:text-4xl mb-4">
          <BlurText text="Как начать вайбкодить" delay={80} />
        </h1>
        <p className="text-[var(--color-text-muted)] max-w-2xl">
          Пошаговый гайд по вайбкодингу с нуля — от установки инструментов до
          первого проекта. Проходи по порядку, каждый шаг строится на
          предыдущем.
        </p>
      </div>

      {гайды.length === 0 ? (
        <div className="p-8 border border-[var(--color-border)] rounded-lg text-center">
          <p className="text-[var(--color-text-muted)] font-[family-name:var(--font-code)]">
            {">"} Гайды загружаются... Скоро здесь появится контент.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {гайды.map((гайд, индекс) => (
            <AnimatedContent
              key={гайд.id}
              delay={индекс * 0.1}
              direction="vertical"
              distance={30}
            >
              <PathStepCard
                номерШага={индекс + 1}
                заголовок={гайд.title}
                описание={гайд.excerpt}
                slug={гайд.slug}
              />
            </AnimatedContent>
          ))}
        </div>
      )}
    </div>
  );
}
