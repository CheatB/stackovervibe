import { notFound } from "next/navigation";
import Link from "next/link";
import { getFrameworkBySlug } from "@/lib/payload";
import { generatePageMetadata } from "@/lib/seo";
import { BreadcrumbNav } from "@/components/seo/BreadcrumbNav";
import { RichTextRenderer } from "@/components/content/RichTextRenderer";
import { ReactionButtons } from "@/components/social/ReactionButtons";
import { CommentList } from "@/components/social/CommentList";
import { ShareButtons } from "@/components/social/ShareButtons";
import { ViewsTracker } from "@/components/ViewsTracker";
import { DownloadButton } from "@/components/DownloadButton";
import { JsonLd } from "@/components/seo/JsonLd";
import { форматДату } from "@/lib/date";

const СТЕК_ЛЕЙБЛЫ: Record<string, string> = {
  claude: "Claude",
  cursor: "Cursor",
  copilot: "Copilot",
  windsurf: "Windsurf",
  other: "Другой",
};

const УРОВЕНЬ_ЛЕЙБЛЫ: Record<string, string> = {
  beginner: "Новичок",
  intermediate: "Средний",
  advanced: "Продвинутый",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const фреймворк = await getFrameworkBySlug(slug);
  if (!фреймворк) return {};

  return generatePageMetadata({
    title: (фреймворк.seoTitle as string) || фреймворк.title,
    description:
      (фреймворк.seoDescription as string) ||
      (фреймворк.description as string) ||
      `Фреймворк: ${фреймворк.title}`,
    url: `/framework/${фреймворк.slug}`,
    type: "article",
  });
}

export default async function FrameworkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const фреймворк = (await getFrameworkBySlug(slug)) as any;
  if (!фреймворк) notFound();

  const автор = typeof фреймворк.author === "object" ? фреймворк.author : null;
  const авторИмя = автор?.displayName || автор?.telegramUsername || "Аноним";
  const теги = Array.isArray(фреймворк.tags)
    ? фреймворк.tags.filter((t: any) => typeof t === "object")
    : [];
  const isРедактирован =
    фреймворк.editedAt && фреймворк.editedAt !== фреймворк.createdAt;

  return (
    <div className="max-w-3xl mx-auto">
      <ViewsTracker contentType="framework" contentId={String(фреймворк.id)} />

      {/* JSON-LD CreativeWork */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: фреймворк.title,
          description: фреймворк.description,
          author: { "@type": "Person", name: авторИмя },
          datePublished: фреймворк.publishedAt || фреймворк.createdAt,
          dateModified:
            фреймворк.editedAt || фреймворк.publishedAt || фреймворк.createdAt,
          url: `https://stackovervibe.ru/framework/${фреймворк.slug}`,
          interactionStatistic: [
            {
              "@type": "InteractionCounter",
              interactionType: "https://schema.org/LikeAction",
              userInteractionCount: фреймворк.likes || 0,
            },
            {
              "@type": "InteractionCounter",
              interactionType: "https://schema.org/DownloadAction",
              userInteractionCount: фреймворк.downloads || 0,
            },
          ],
        }}
      />

      <BreadcrumbNav
        items={[
          { label: "framework", href: "/framework" },
          { label: фреймворк.slug },
        ]}
      />

      {/* Заголовок */}
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold mb-3">
          {фреймворк.title}
        </h1>

        {/* Бейджи */}
        <div className="flex flex-wrap gap-2 mb-3">
          {фреймворк.stack && (
            <span className="px-2 py-0.5 text-xs rounded bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] border border-[var(--color-secondary)]/20 font-[family-name:var(--font-code)]">
              {СТЕК_ЛЕЙБЛЫ[фреймворк.stack] || фреймворк.stack}
            </span>
          )}
          {фреймворк.level && (
            <span className="px-2 py-0.5 text-xs rounded bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/20 font-[family-name:var(--font-code)]">
              {УРОВЕНЬ_ЛЕЙБЛЫ[фреймворк.level] || фреймворк.level}
            </span>
          )}
        </div>

        {/* Описание */}
        <p className="text-[var(--color-text-muted)] mb-3">
          {фреймворк.description}
        </p>

        {/* Мета */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--color-text-muted)] font-[family-name:var(--font-code)]">
          <span>
            опубликован{" "}
            {форматДату(фреймворк.publishedAt || фреймворк.createdAt)}
          </span>
          {isРедактирован && (
            <span>изменён {форматДату(фреймворк.editedAt)}</span>
          )}
          <span>просмотров: {фреймворк.views || 0}</span>
          <span>скачиваний: {фреймворк.downloads || 0}</span>
        </div>
      </div>

      {/* Тело */}
      <div className="mb-6 pb-6 border-b border-[var(--color-border)]">
        <div className="prose-custom mb-4">
          {фреймворк.body && <RichTextRenderer content={фреймворк.body} />}
        </div>

        {/* GitHub */}
        {фреймворк.githubUrl && (
          <div className="mb-4">
            <a
              href={фреймворк.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-[var(--color-primary)] hover:underline font-[family-name:var(--font-code)]"
            >
              {">"} GitHub репозиторий ↗
            </a>
          </div>
        )}

        {/* Теги */}
        {теги.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {теги.map((тег: any) => (
              <Link
                key={тег.slug}
                href={`/tags/${тег.slug}`}
                className="px-2 py-0.5 text-xs rounded bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/20 hover:bg-[var(--color-accent)]/20 transition-colors font-[family-name:var(--font-code)]"
              >
                {тег.title}
              </Link>
            ))}
          </div>
        )}

        {/* Действия: скачать, реакции, автор */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <DownloadButton
              frameworkId={String(фреймворк.id)}
              slug={фреймворк.slug}
            />
            <ReactionButtons
              contentType="framework"
              contentId={String(фреймворк.id)}
              likes={фреймворк.likes || 0}
              dislikes={фреймворк.dislikes || 0}
            />
          </div>
          <div className="flex items-center gap-3">
            <ShareButtons
              url={`/framework/${фреймворк.slug}`}
              title={фреймворк.title}
            />
            <div className="text-xs text-[var(--color-text-muted)] font-[family-name:var(--font-code)]">
              {автор && (
                <Link
                  href={`/profile/${автор.telegramUsername || автор.id}`}
                  className="hover:text-[var(--color-primary)]"
                >
                  @{авторИмя}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Комментарии */}
      <CommentList contentType="framework" contentId={String(фреймворк.id)} />
    </div>
  );
}
