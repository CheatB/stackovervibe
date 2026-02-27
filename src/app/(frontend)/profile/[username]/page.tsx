import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getUserByUsername,
  getUserPosts,
  getUserFrameworks,
} from "@/lib/payload";
import { BreadcrumbNav } from "@/components/seo/BreadcrumbNav";

interface ПараметрыСтраницы {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({
  params,
}: ПараметрыСтраницы): Promise<Metadata> {
  const { username } = await params;
  const пользователь = await getUserByUsername(username);
  if (!пользователь) return { title: "Не найдено" };

  return {
    title: пользователь.displayName || `@${username}`,
    description:
      пользователь.bio ||
      `Профиль ${пользователь.displayName || username} на Stackovervibe`,
  };
}

export default async function ProfilePage({ params }: ПараметрыСтраницы) {
  const { username } = await params;
  const пользователь = await getUserByUsername(username);

  if (!пользователь) notFound();

  const [посты, фреймворки] = await Promise.all([
    getUserPosts(пользователь.id),
    getUserFrameworks(пользователь.id),
  ]);

  /* Рейтинг — сумма лайков на всех постах */
  const рейтинг = посты.reduce((с, п) => с + ((п.likes as number) || 0), 0);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <BreadcrumbNav
        items={[{ label: "profile" }, { label: `@${username}` }]}
      />

      {/* Профиль */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 p-4 sm:p-6 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-card)]">
        {пользователь.avatarUrl && (
          <img
            src={пользователь.avatarUrl}
            alt={пользователь.displayName || username}
            className="w-20 h-20 rounded-full border-2 border-[var(--color-primary)] shrink-0"
          />
        )}
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-xl sm:text-2xl mb-1">
            {пользователь.displayName || `@${username}`}
          </h1>
          {пользователь.telegramUsername && (
            <p className="text-sm text-[var(--color-text-muted)] font-[family-name:var(--font-code)]">
              @{пользователь.telegramUsername}
            </p>
          )}
          {пользователь.bio && (
            <p className="text-sm text-[var(--color-text-muted)] mt-2">
              {пользователь.bio}
            </p>
          )}
          <div className="flex gap-4 mt-3 text-sm font-[family-name:var(--font-code)]">
            <span>
              <span className="text-[var(--color-primary)]">
                {посты.length}
              </span>{" "}
              <span className="text-[var(--color-text-muted)]">постов</span>
            </span>
            <span>
              <span className="text-[var(--color-secondary)]">
                {фреймворки.length}
              </span>{" "}
              <span className="text-[var(--color-text-muted)]">
                фреймворков
              </span>
            </span>
            <span>
              <span className="text-[var(--color-primary)]">{рейтинг}</span>{" "}
              <span className="text-[var(--color-text-muted)]">рейтинг</span>
            </span>
          </div>
        </div>
      </div>

      {/* Фреймворки */}
      <section>
        <h2 className="text-xl mb-4">Фреймворки</h2>
        {фреймворки.length === 0 ? (
          <p className="text-sm text-[var(--color-text-muted)] font-[family-name:var(--font-code)]">
            {">"} Пока нет опубликованных фреймворков
          </p>
        ) : (
          <div className="space-y-3">
            {фреймворки.map((ф) => (
              <Link
                key={ф.id}
                href={`/framework/${ф.slug}`}
                className="group flex items-center justify-between p-4 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-card)] hover:border-[var(--color-secondary)] transition-colors"
              >
                <span className="group-hover:text-[var(--color-secondary)] transition-colors">
                  {ф.title}
                </span>
                <span className="text-xs text-[var(--color-text-muted)] ml-4">
                  ↓{(ф.downloads as number) || 0}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Посты */}
      <section>
        <h2 className="text-xl mb-4">Посты</h2>
        {посты.length === 0 ? (
          <p className="text-sm text-[var(--color-text-muted)] font-[family-name:var(--font-code)]">
            {">"} Пока нет опубликованных постов
          </p>
        ) : (
          <div className="space-y-3">
            {посты.map((пост) => (
              <Link
                key={пост.id}
                href={`/posts/${пост.slug}`}
                className="group flex items-center justify-between p-4 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-card)] hover:border-[var(--color-primary)] transition-colors"
              >
                <span className="group-hover:text-[var(--color-primary)] transition-colors">
                  {пост.title}
                </span>
                <span className="text-xs text-[var(--color-text-muted)] ml-4">
                  +{(пост.likes as number) || 0}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
