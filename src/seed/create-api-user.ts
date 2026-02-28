/**
 * Создание/обновление пользователя с API-ключом
 * Запуск: COMPOSE_PROFILES=seed docker compose run --rm seed npx tsx src/seed/create-api-user.ts
 */
import { getPayload } from "payload";
import config from "../../payload.config";
import crypto from "crypto";

async function createApiUser() {
  const payload = await getPayload({ config });

  const email = "openclaw@stackovervibe.ru";
  const apiKey = crypto.randomBytes(24).toString("hex");

  // Проверяем, не существует ли уже
  const { docs } = await payload.find({
    collection: "users",
    where: { email: { equals: email } },
    limit: 1,
  });

  if (docs.length > 0) {
    // Обновляем API key
    await payload.update({
      collection: "users",
      id: docs[0].id,
      data: {
        enableAPIKey: true,
        apiKey,
        role: "admin",
      },
    });
    console.log(`Пользователь обновлён: ${email}`);
    console.log(`API Key: ${apiKey}`);
  } else {
    const user = await payload.create({
      collection: "users",
      data: {
        email,
        password: crypto.randomBytes(16).toString("hex"),
        displayName: "Иван Никифорович",
        role: "admin",
        enableAPIKey: true,
        apiKey,
      },
    });
    console.log(`Пользователь создан: ${user.id} ${email}`);
    console.log(`API Key: ${apiKey}`);
  }

  process.exit(0);
}

createApiUser().catch((e) => {
  console.error("Ошибка:", e.message);
  process.exit(1);
});
