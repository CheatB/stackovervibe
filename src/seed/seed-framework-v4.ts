/**
 * Создание фреймворка "Vibe Framework v4" и удаление старого "Вайбкодинг с нуля"
 * Запуск: docker compose exec app npx tsx src/seed/seed-framework-v4.ts
 */
import { getPayload } from "payload";
import config from "../../payload.config";
import { readFileSync } from "fs";
import { mdToLexical } from "./md-to-lexical";

async function seedFrameworkV4() {
  const payload = await getPayload({ config });

  // Читаем markdown файл
  const md = readFileSync("./src/seed/vibe-framework-v4.md", "utf-8");

  // Убираем заголовок первого уровня — используем его отдельно
  const lines = md.split("\n");
  const titleLineIdx = lines.findIndex((l) => l.startsWith("# "));
  const contentLines = titleLineIdx >= 0
    ? [...lines.slice(0, titleLineIdx), ...lines.slice(titleLineIdx + 1)]
    : lines;
  const body = mdToLexical(contentLines.join("\n"));

  // Ищем теги
  const нужныеТеги = ["vibe-coding", "claude-code", "skills", "hooks", "commands"];
  const { docs: найденныеТеги } = await payload.find({
    collection: "tags",
    where: { slug: { in: нужныеТеги } },
    limit: 10,
  });
  const tagIds = найденныеТеги.map((t) => t.id);
  console.log(`Теги: найдено ${tagIds.length} из ${нужныеТеги.length}`);

  // Ищем admin-пользователя
  const { docs: users } = await payload.find({
    collection: "users",
    where: { role: { equals: "admin" } },
    limit: 1,
  });
  const authorId = users[0]?.id || 1;

  const slug = "vibe-framework-v4";
  const data = {
    title: "Vibe Framework v4 — полная методология вайбкодинга",
    slug,
    description:
      "Комплексная методология разработки проектов с AI: от идеи до деплоя. 7 фаз, Security Pipeline, Quality Gates, Anti-Mirage, инфраструктура. Проверено на 6 реальных проектах.",
    body: body as unknown as Record<string, unknown>,
    stack: "claude" as const,
    level: "intermediate" as const,
    tags: tagIds.length > 0 ? tagIds : undefined,
    seoTitle: "Vibe Framework v4 — полная методология вайбкодинга с AI",
    seoDescription:
      "Комплексная методология: 7 фаз от идеи до деплоя, Quality Gates, Anti-Mirage, Security Pipeline, инфраструктура. Проверено на 6 проектах.",
    status: "published" as const,
  };

  // Проверяем, существует ли уже
  const { docs } = await payload.find({
    collection: "frameworks",
    where: { slug: { equals: slug } },
    limit: 1,
  });

  if (docs.length > 0) {
    await payload.update({
      collection: "frameworks",
      id: docs[0].id,
      data,
    });
    console.log(`✅ Фреймворк обновлён: ${slug} (id: ${docs[0].id})`);
  } else {
    const doc = await payload.create({
      collection: "frameworks",
      data: { ...data, author: authorId },
    });
    console.log(`✅ Фреймворк создан: ${doc.slug} (id: ${doc.id})`);
  }

  // Удаляем старый фреймворк "Вайбкодинг с нуля"
  const { docs: oldDocs } = await payload.find({
    collection: "frameworks",
    where: { slug: { equals: "vibecoding-methodology" } },
    limit: 1,
  });

  if (oldDocs.length > 0) {
    await payload.delete({
      collection: "frameworks",
      id: oldDocs[0].id,
    });
    console.log(`🗑️ Старый фреймворк удалён: vibecoding-methodology (id: ${oldDocs[0].id})`);
  } else {
    console.log("ℹ️ Старый фреймворк vibecoding-methodology не найден — возможно уже удалён");
  }

  process.exit(0);
}

seedFrameworkV4().catch((e) => {
  console.error("❌ Ошибка:", e.message);
  process.exit(1);
});
