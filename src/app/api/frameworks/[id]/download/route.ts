import { NextRequest, NextResponse } from "next/server";
import { getPayloadClient } from "@/lib/payload";
import { lexicalToMarkdown } from "@/lib/lexical-to-markdown";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const payload = await getPayloadClient();

  let фреймворк: any;
  try {
    фреймворк = await payload.findByID({
      collection: "frameworks",
      id,
      depth: 1,
    });
  } catch {
    return NextResponse.json({ error: "Фреймворк не найден" }, { status: 404 });
  }

  /* Инкремент downloads */
  const текущее = (фреймворк.downloads as number) || 0;
  await payload.update({
    collection: "frameworks",
    id,
    data: { downloads: текущее + 1 },
  });

  /* Собрать markdown */
  const авторИмя =
    typeof фреймворк.author === "object"
      ? фреймворк.author.displayName ||
        фреймворк.author.telegramUsername ||
        "Аноним"
      : "Аноним";

  const стек = фреймворк.stack ? `**Стек:** ${фреймворк.stack}` : "";
  const уровень = фреймворк.level ? `**Уровень:** ${фреймворк.level}` : "";
  const мета = [стек, уровень].filter(Boolean).join(" | ");

  const тело = lexicalToMarkdown(фреймворк.body);

  const md = [
    `# ${фреймворк.title}`,
    "",
    `> ${фреймворк.description}`,
    "",
    мета ? `${мета}\n` : "",
    `**Автор:** ${авторИмя}`,
    фреймворк.githubUrl ? `**GitHub:** ${фреймворк.githubUrl}` : "",
    `**Источник:** https://stackovervibe.ru/framework/${фреймворк.slug}`,
    "",
    "---",
    "",
    тело,
  ]
    .filter((строка) => строка !== "")
    .join("\n");

  return new NextResponse(md, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="${фреймворк.slug}.md"`,
    },
  });
}
