import { getPayloadClient } from "@/lib/payload";

const САЙТ_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

/** Экранирование спец-символов XML */
function escapeXml(текст: string): string {
  return текст
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const payload = await getPayloadClient();

  const [посты, вопросы, гайды] = await Promise.all([
    payload.find({
      collection: "posts",
      where: { status: { equals: "published" } },
      limit: 50,
      sort: "-publishedAt",
      select: {
        title: true,
        slug: true,
        publishedAt: true,
        author: true,
      },
    }),
    payload.find({
      collection: "questions",
      where: { status: { in: ["published", "closed"] } },
      limit: 20,
      sort: "-createdAt",
      select: { title: true, slug: true, createdAt: true, author: true },
    }),
    payload.find({
      collection: "guides",
      where: { status: { equals: "published" } },
      limit: 20,
      sort: "-updatedAt",
      select: {
        title: true,
        slug: true,
        excerpt: true,
        updatedAt: true,
      },
    }),
  ]);

  const элементы: {
    title: string;
    link: string;
    description: string;
    pubDate: string;
    author: string;
  }[] = [];

  for (const п of посты.docs) {
    const авторОбъект =
      typeof п.author === "object" && п.author ? п.author : null;
    const автор =
      (авторОбъект as Record<string, string> | null)?.displayName ||
      "Stackovervibe";
    элементы.push({
      title: п.title,
      link: `${САЙТ_URL}/posts/${п.slug}`,
      description: ((п as Record<string, unknown>).excerpt as string) || "",
      pubDate: new Date(
        (п.publishedAt as string) ||
          ((п as Record<string, unknown>).createdAt as string),
      ).toUTCString(),
      author: автор,
    });
  }

  for (const в of вопросы.docs) {
    const авторОбъект =
      typeof в.author === "object" && в.author ? в.author : null;
    const автор =
      (авторОбъект as Record<string, string> | null)?.displayName ||
      "Stackovervibe";
    элементы.push({
      title: `Вопрос: ${в.title}`,
      link: `${САЙТ_URL}/questions/${в.slug}`,
      description: "",
      pubDate: new Date(в.createdAt as string).toUTCString(),
      author: автор,
    });
  }

  for (const г of гайды.docs) {
    элементы.push({
      title: г.title,
      link: `${САЙТ_URL}/path/${г.slug}`,
      description: (г.excerpt as string) || "",
      pubDate: new Date(г.updatedAt as string).toUTCString(),
      author: "Stackovervibe",
    });
  }

  // Сортируем по дате — новые первыми
  элементы.sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime(),
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Stackovervibe — Вайбкодинг</title>
    <link>${САЙТ_URL}</link>
    <description>Гайды, инструменты и Q&amp;A по вайбкодингу с Claude Code, Cursor AI и другими AI-ассистентами.</description>
    <language>ru</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${САЙТ_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${элементы
  .map(
    (э) => `    <item>
      <title>${escapeXml(э.title)}</title>
      <link>${э.link}</link>
      <guid isPermaLink="true">${э.link}</guid>
      <pubDate>${э.pubDate}</pubDate>
      <author>${escapeXml(э.author)}</author>${э.description ? `\n      <description>${escapeXml(э.description)}</description>` : ""}
    </item>`,
  )
  .join("\n")}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
