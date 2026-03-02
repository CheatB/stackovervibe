import { NextRequest, NextResponse } from "next/server";
import { getPayloadClient } from "@/lib/payload";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) {
    return NextResponse.json(
      { error: "Необходима авторизация" },
      { status: 401 },
    );
  }

  if (user.isBanned) {
    return NextResponse.json(
      { error: "Аккаунт заблокирован" },
      { status: 403 },
    );
  }

  let данные: { title: string; content: string };
  try {
    данные = await request.json();
  } catch {
    return NextResponse.json({ error: "Невалидный JSON" }, { status: 400 });
  }

  const { title, content } = данные;

  if (!title?.trim() || title.trim().length < 5) {
    return NextResponse.json(
      { error: "Заголовок минимум 5 символов" },
      { status: 400 },
    );
  }

  if (title.trim().length > 300) {
    return NextResponse.json(
      { error: "Заголовок максимум 300 символов" },
      { status: 400 },
    );
  }

  if (!content?.trim() || content.trim().length < 20) {
    return NextResponse.json(
      { error: "Контент минимум 20 символов" },
      { status: 400 },
    );
  }

  const payload = await getPayloadClient();

  const пост = await payload.create({
    collection: "posts",
    data: {
      title: title.trim(),
      content: {
        root: {
          type: "root",
          children: [
            {
              type: "paragraph",
              children: [{ type: "text", text: content.trim() }],
            },
          ],
        },
      },
      author: user.id,
      status: "pending",
    } as any,
  });

  return NextResponse.json({
    success: true,
    slug: пост.slug,
    id: пост.id,
  });
}
