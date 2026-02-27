import { NextRequest, NextResponse } from "next/server";
import { getPayloadClient } from "@/lib/payload";

/** In-memory дедупликация по IP (сбрасывается при рестарте — ОК для MVP) */
const просмотрено = new Map<string, number>();

/** Очистка старых записей каждые 10 минут */
const ВРЕМЯ_ЖИЗНИ = 10 * 60 * 1000;
setInterval(() => {
  const сейчас = Date.now();
  for (const [ключ, время] of просмотрено) {
    if (сейчас - время > ВРЕМЯ_ЖИЗНИ) просмотрено.delete(ключ);
  }
}, ВРЕМЯ_ЖИЗНИ);

const КОЛЛЕКЦИИ: Record<string, string> = {
  guide: "guides",
  tool: "tools",
  post: "posts",
  question: "questions",
  framework: "frameworks",
};

export async function POST(request: NextRequest) {
  let данные: { contentType: string; contentId: string };
  try {
    данные = await request.json();
  } catch {
    return NextResponse.json({ error: "Невалидный JSON" }, { status: 400 });
  }

  const { contentType, contentId } = данные;

  if (!contentType || !contentId) {
    return NextResponse.json(
      { error: "Отсутствуют обязательные поля" },
      { status: 400 },
    );
  }

  const коллекция = КОЛЛЕКЦИИ[contentType];
  if (!коллекция) {
    return NextResponse.json(
      { error: "Неизвестный тип контента" },
      { status: 400 },
    );
  }

  /* Дедупликация по IP */
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const ключ = `${ip}:${contentType}:${contentId}`;

  if (просмотрено.has(ключ)) {
    return NextResponse.json({ success: true, deduplicated: true });
  }
  просмотрено.set(ключ, Date.now());

  /* Инкремент views */
  try {
    const payload = await getPayloadClient();
    const документ = await payload.findByID({
      collection: коллекция,
      id: contentId,
    });
    const текущее = ((документ as any).views as number) || 0;
    await payload.update({
      collection: коллекция,
      id: contentId,
      data: { views: текущее + 1 },
    });
  } catch {
    /* Документ не найден — игнорируем */
  }

  return NextResponse.json({ success: true });
}
