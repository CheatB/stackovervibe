import { notFound } from "next/navigation";
import Link from "next/link";
import { getQuestionBySlug, getAnswersByQuestion } from "@/lib/payload";

export const revalidate = 60;
import { generatePageMetadata } from "@/lib/seo";
import { BreadcrumbNav } from "@/components/seo/BreadcrumbNav";
import { RichTextRenderer } from "@/components/content/RichTextRenderer";
import { ReactionButtons } from "@/components/social/ReactionButtons";
import { CommentList } from "@/components/social/CommentList";
import { AnswerForm } from "./AnswerForm";
import { ViewsTracker } from "@/components/ViewsTracker";
import { JsonLd } from "@/components/seo/JsonLd";
import { AdminEditButton } from "@/components/ui/AdminEditButton";
import { форматДату } from "@/lib/date";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const вопрос = await getQuestionBySlug(slug);
  if (!вопрос) return {};

  return generatePageMetadata({
    title: вопрос.title,
    description: (вопрос.seoDescription as string) || `Вопрос: ${вопрос.title}`,
    url: `/questions/${вопрос.slug}`,
    type: "article",
  });
}

export default async function QuestionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const вопрос = (await getQuestionBySlug(slug)) as any;
  if (!вопрос) notFound();

  const ответы = await getAnswersByQuestion(вопрос.id);

  const автор = typeof вопрос.author === "object" ? вопрос.author : null;
  const авторИмя = автор?.displayName || автор?.telegramUsername || "Аноним";
  const теги = Array.isArray(вопрос.tags)
    ? вопрос.tags.filter((t: any) => typeof t === "object")
    : [];

  const isЗакрыт = вопрос.status === "closed";
  const isРедактирован =
    вопрос.editedAt && вопрос.editedAt !== вопрос.createdAt;

  /* Найти принятый ответ для JSON-LD */
  const принятыйОтвет = (ответы as any[]).find((о) => о.isAccepted);

  return (
    <div>
      <ViewsTracker contentType="question" contentId={String(вопрос.id)} />

      {/* JSON-LD QAPage */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "QAPage",
          mainEntity: {
            "@type": "Question",
            name: вопрос.title,
            text: вопрос.title,
            dateCreated: вопрос.publishedAt || вопрос.createdAt,
            author: { "@type": "Person", name: авторИмя },
            answerCount: ответы.length,
            upvoteCount: вопрос.likes || 0,
            ...(принятыйОтвет
              ? {
                  acceptedAnswer: {
                    "@type": "Answer",
                    dateCreated:
                      принятыйОтвет.publishedAt || принятыйОтвет.createdAt,
                    author: {
                      "@type": "Person",
                      name:
                        typeof принятыйОтвет.author === "object"
                          ? принятыйОтвет.author.displayName ||
                            принятыйОтвет.author.telegramUsername ||
                            "Аноним"
                          : "Аноним",
                    },
                    upvoteCount: принятыйОтвет.likes || 0,
                    text: "Принятый ответ",
                  },
                }
              : {}),
          },
        }}
      />

      <BreadcrumbNav
        items={[
          { label: "questions", href: "/questions" },
          { label: вопрос.slug, href: `/questions/${вопрос.slug}` },
        ]}
      />

      {/* Заголовок */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <h1 className="text-xl md:text-2xl font-bold">{вопрос.title}</h1>
          <AdminEditButton collection="questions" id={вопрос.id} />
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--color-text-muted)] font-[family-name:var(--font-code)]">
          <span>
            задан {форматДату(вопрос.publishedAt || вопрос.createdAt)}
          </span>
          {isРедактирован && <span>изменён {форматДату(вопрос.editedAt)}</span>}
          <span>просмотров: {вопрос.views || 0}</span>
          <span>ответов: {вопрос.answersCount || 0}</span>
        </div>
      </div>

      {/* Закрыт? */}
      {isЗакрыт && (
        <div className="mb-6 p-4 border border-[var(--color-danger)]/30 rounded bg-[var(--color-danger)]/5">
          <p className="text-sm text-[var(--color-danger)] font-[family-name:var(--font-code)]">
            🔒 Вопрос закрыт{вопрос.closedAs ? `: ${вопрос.closedAs}` : ""}
          </p>
          {вопрос.closedReason && (
            <p className="text-xs text-[var(--color-text-muted)] mt-1">
              {вопрос.closedReason}
            </p>
          )}
        </div>
      )}

      {/* Тело вопроса */}
      <div className="mb-6 pb-6 border-b border-[var(--color-border)]">
        <div className="prose-custom mb-4">
          {вопрос.body && <RichTextRenderer content={вопрос.body} />}
        </div>

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

        {/* Автор + реакции */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <ReactionButtons
            contentType="question"
            contentId={String(вопрос.id)}
            likes={вопрос.likes || 0}
            dislikes={вопрос.dislikes || 0}
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

      {/* Комментарии к вопросу */}
      <CommentList contentType="question" contentId={String(вопрос.id)} />

      {/* Ответы */}
      <div className="mt-8">
        <h2 className="text-lg font-bold font-[family-name:var(--font-code)] mb-4">
          <span className="text-[var(--color-text-muted)]">
            {ответы.length}
          </span>{" "}
          {ответы.length === 1 ? "ответ" : "ответов"}
        </h2>

        {(ответы as any[]).length > 0 ? (
          <div className="space-y-4">
            {(ответы as any[]).map((ответ) => {
              const ответАвтор =
                typeof ответ.author === "object" ? ответ.author : null;
              const ответАвторИмя =
                ответАвтор?.displayName ||
                ответАвтор?.telegramUsername ||
                "Аноним";
              const ответРедактирован =
                ответ.editedAt && ответ.editedAt !== ответ.createdAt;
              return (
                <div
                  key={ответ.id}
                  className={`flex gap-4 p-4 rounded-lg border ${
                    ответ.isAccepted
                      ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5"
                      : "border-[var(--color-border)] bg-[var(--color-bg-card)]"
                  }`}
                >
                  <div className="flex flex-col items-center gap-1 min-w-[40px]">
                    {ответ.isAccepted && (
                      <span
                        title="Принятый ответ"
                        className="text-[var(--color-primary)] text-lg"
                      >
                        ✓
                      </span>
                    )}
                    <ReactionButtons
                      contentType="answer"
                      contentId={String(ответ.id)}
                      likes={ответ.likes || 0}
                      dislikes={ответ.dislikes || 0}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    {ответ.body && <RichTextRenderer content={ответ.body} />}
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[var(--color-border)] text-xs text-[var(--color-text-muted)] font-[family-name:var(--font-code)]">
                      <span>{ответАвторИмя}</span>
                      <span>·</span>
                      <span>
                        {форматДату(ответ.publishedAt || ответ.createdAt)}
                      </span>
                      {ответРедактирован && (
                        <span>· изменён {форматДату(ответ.editedAt)}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-[var(--color-text-muted)] font-[family-name:var(--font-code)]">
            Пока нет ответов. Будь первым!
          </p>
        )}
      </div>

      {/* Форма ответа */}
      {!isЗакрыт && (
        <div className="mt-8">
          <AnswerForm questionId={String(вопрос.id)} />
        </div>
      )}
    </div>
  );
}
