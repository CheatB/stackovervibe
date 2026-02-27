/**
 * Скрипт: рандомизация publishedAt для всех публикаций.
 * Устанавливает случайные даты в пределах последней недели.
 *
 * Запуск: npx payload run src/seed/randomize-dates.ts
 */

import { getPayload } from "payload";
import config from "../../payload.config";

const КОЛЛЕКЦИИ = ["guides", "tools", "questions", "posts"] as const;

async function randomizeDates() {
  const payload = await getPayload({ config });
  const сейчас = Date.now();
  const НЕДЕЛЯ = 7 * 24 * 60 * 60 * 1000;

  for (const коллекция of КОЛЛЕКЦИИ) {
    const { docs } = await payload.find({
      collection: коллекция,
      limit: 200,
      depth: 0,
    });

    console.log(`${коллекция}: ${docs.length} записей`);

    for (const док of docs) {
      const случайноеВремя = сейчас - Math.floor(Math.random() * НЕДЕЛЯ);
      const новаяДата = new Date(случайноеВремя).toISOString();

      await payload.update({
        collection: коллекция,
        id: док.id,
        data: {
          publishedAt: новаяДата,
        } as any,
      });
    }

    console.log(`✓ ${коллекция}: даты обновлены`);
  }

  console.log("Готово!");
  process.exit(0);
}

randomizeDates().catch((e) => {
  console.error("Ошибка:", e);
  process.exit(1);
});
