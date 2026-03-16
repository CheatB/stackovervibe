const САЙТ_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const INDEXNOW_KEY = process.env.INDEXNOW_KEY;

/**
 * Уведомляет поисковики (Яндекс, Bing) о новых/обновлённых URL через IndexNow.
 * Вызывать из afterChange хуков Payload CMS.
 */
export async function уведомитьIndexNow(urls: string[]): Promise<void> {
  if (!INDEXNOW_KEY || urls.length === 0) return;

  const полныеUrl = urls.map((u) =>
    u.startsWith("http") ? u : `${САЙТ_URL}${u}`,
  );

  try {
    await fetch("https://yandex.com/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host: new URL(САЙТ_URL).host,
        key: INDEXNOW_KEY,
        urlList: полныеUrl,
      }),
    });
  } catch {
    // Не блокируем основной процесс при ошибке IndexNow
  }
}
