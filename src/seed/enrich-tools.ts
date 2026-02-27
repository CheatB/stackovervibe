/**
 * Скрипт обогащения контента: обновляет description, seoTitle, seoDescription
 * для существующих инструментов и гайдов в Payload CMS.
 *
 * Запуск: npx tsx src/seed/enrich-tools.ts
 * Docker: docker compose exec app npx tsx src/seed/enrich-tools.ts
 *
 * Что делает:
 * - Читает обогащённый контент из src/seed/content/
 * - Находит записи по slug в Payload CMS
 * - Обновляет description (Lexical JSON), seoTitle, seoDescription
 * - Не трогает остальные поля (статус, категории, теги, даты)
 *
 * Идемпотентен: можно запускать повторно.
 */

import { getPayload } from "payload";
import config from "../../payload.config";

import { enrichedSkills } from "./content/skills";
import { enrichedHooks } from "./content/hooks";
import { enrichedCommands } from "./content/commands";
import { enrichedGuides } from "./content/guides";

async function enrich() {
  console.log("━━━ ENRICH: Обогащение контента ━━━\n");

  const payload = await getPayload({ config });

  /* =========================================
     1. Инструменты (skills + hooks + commands)
     ========================================= */
  const allTools = [...enrichedSkills, ...enrichedHooks, ...enrichedCommands];
  let toolsUpdated = 0;
  let toolsSkipped = 0;
  let toolsErrors = 0;

  console.log(`Инструменты: ${allTools.length} записей для обновления...\n`);

  for (const tool of allTools) {
    try {
      const { docs } = await payload.find({
        collection: "tools",
        where: { slug: { equals: tool.slug } },
        limit: 1,
      });

      if (docs.length === 0) {
        console.log(`  [SKIP] ${tool.slug} — не найден в БД`);
        toolsSkipped++;
        continue;
      }

      await payload.update({
        collection: "tools",
        id: docs[0].id,
        data: {
          description: tool.description as unknown as Record<string, unknown>,
          seoTitle: tool.seoTitle,
          seoDescription: tool.seoDescription,
        },
      });
      toolsUpdated++;

      if (toolsUpdated % 10 === 0) {
        console.log(`  ... ${toolsUpdated} инструментов обновлено`);
      }
    } catch (err) {
      console.error(`  [ERR] ${tool.slug}:`, (err as Error).message);
      toolsErrors++;
    }
  }

  console.log(
    `\nИнструменты: ${toolsUpdated} обновлено, ${toolsSkipped} пропущено, ${toolsErrors} ошибок\n`,
  );

  /* =========================================
     2. Гайды
     ========================================= */
  let guidesUpdated = 0;
  let guidesSkipped = 0;
  let guidesErrors = 0;

  console.log(`Гайды: ${enrichedGuides.length} записей для обновления...\n`);

  for (const guide of enrichedGuides) {
    try {
      const { docs } = await payload.find({
        collection: "guides",
        where: { slug: { equals: guide.slug } },
        limit: 1,
      });

      if (docs.length === 0) {
        console.log(`  [SKIP] ${guide.slug} — не найден в БД`);
        guidesSkipped++;
        continue;
      }

      await payload.update({
        collection: "guides",
        id: docs[0].id,
        data: {
          content: guide.content as unknown as Record<string, unknown>,
          seoTitle: guide.seoTitle,
          seoDescription: guide.seoDescription,
        },
      });
      guidesUpdated++;
      console.log(`  [OK] ${guide.slug}`);
    } catch (err) {
      console.error(`  [ERR] ${guide.slug}:`, (err as Error).message);
      guidesErrors++;
    }
  }

  console.log(
    `\nГайды: ${guidesUpdated} обновлено, ${guidesSkipped} пропущено, ${guidesErrors} ошибок\n`,
  );

  /* =========================================
     Итого
     ========================================= */
  console.log("━━━ ENRICH: Готово ━━━");
  console.log(`Инструменты: ${toolsUpdated}/${allTools.length}`);
  console.log(`Гайды: ${guidesUpdated}/${enrichedGuides.length}`);

  const totalErrors = toolsErrors + guidesErrors;
  if (totalErrors > 0) {
    console.log(`\nОшибки: ${totalErrors}. Проверь логи выше.`);
  }

  process.exit(totalErrors > 0 ? 1 : 0);
}

enrich().catch((err) => {
  console.error("Enrich failed:", err);
  process.exit(1);
});
