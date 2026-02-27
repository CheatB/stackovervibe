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

  let данные: {
    title: string;
    description: string;
    body: string;
    stack?: string;
    level?: string;
    githubUrl?: string;
    tags?: string[];
  };
  try {
    данные = await request.json();
  } catch {
    return NextResponse.json({ error: "Невалидный JSON" }, { status: 400 });
  }

  const { title, description, body, stack, level, githubUrl, tags } = данные;

  if (!title?.trim() || title.trim().length < 5) {
    return NextResponse.json(
      { error: "Название минимум 5 символов" },
      { status: 400 },
    );
  }

  if (title.trim().length > 200) {
    return NextResponse.json(
      { error: "Название максимум 200 символов" },
      { status: 400 },
    );
  }

  if (!description?.trim() || description.trim().length < 10) {
    return NextResponse.json(
      { error: "Описание минимум 10 символов" },
      { status: 400 },
    );
  }

  if (description.trim().length > 500) {
    return NextResponse.json(
      { error: "Описание максимум 500 символов" },
      { status: 400 },
    );
  }

  if (!body?.trim() || body.trim().length < 20) {
    return NextResponse.json(
      { error: "Содержание минимум 20 символов" },
      { status: 400 },
    );
  }

  const payload = await getPayloadClient();

  const фреймворк = await payload.create({
    collection: "frameworks",
    data: {
      title: title.trim(),
      description: description.trim(),
      body: {
        root: {
          type: "root",
          children: [
            {
              type: "paragraph",
              children: [{ type: "text", text: body.trim() }],
            },
          ],
        },
      },
      author: user.id,
      status: "published",
      ...(stack ? { stack } : {}),
      ...(level ? { level } : {}),
      ...(githubUrl ? { githubUrl: githubUrl.trim() } : {}),
      ...(tags?.length ? { tags } : {}),
    },
  });

  return NextResponse.json({
    success: true,
    slug: фреймворк.slug,
    id: фреймворк.id,
  });
}
