import { NextRequest, NextResponse } from "next/server";
import { getPayloadClient } from "@/lib/payload";
import { getCurrentUser } from "@/lib/auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
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

  const payload = await getPayloadClient();

  /* Проверить владельца */
  const фреймворк = await payload.findByID({ collection: "frameworks", id });
  const авторId =
    typeof фреймворк.author === "object"
      ? (фреймворк.author as any).id
      : фреймворк.author;
  if (user.role !== "admin" && String(авторId) !== String(user.id)) {
    return NextResponse.json(
      { error: "Нет прав на редактирование" },
      { status: 403 },
    );
  }

  let данные: {
    title?: string;
    description?: string;
    body?: string;
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

  const обновление: Record<string, unknown> = {};

  if (данные.title !== undefined) {
    if (данные.title.trim().length < 5 || данные.title.trim().length > 200) {
      return NextResponse.json(
        { error: "Название: 5-200 символов" },
        { status: 400 },
      );
    }
    обновление.title = данные.title.trim();
  }

  if (данные.description !== undefined) {
    if (
      данные.description.trim().length < 10 ||
      данные.description.trim().length > 500
    ) {
      return NextResponse.json(
        { error: "Описание: 10-500 символов" },
        { status: 400 },
      );
    }
    обновление.description = данные.description.trim();
  }

  if (данные.body !== undefined) {
    if (данные.body.trim().length < 20) {
      return NextResponse.json(
        { error: "Содержание минимум 20 символов" },
        { status: 400 },
      );
    }
    обновление.body = {
      root: {
        type: "root",
        children: [
          {
            type: "paragraph",
            children: [{ type: "text", text: данные.body.trim() }],
          },
        ],
      },
    };
  }

  if (данные.stack) обновление.stack = данные.stack;
  if (данные.level) обновление.level = данные.level;
  if (данные.githubUrl !== undefined)
    обновление.githubUrl = данные.githubUrl.trim();
  if (данные.tags) обновление.tags = данные.tags;

  await payload.update({
    collection: "frameworks",
    id,
    data: обновление,
  });

  return NextResponse.json({ success: true });
}
