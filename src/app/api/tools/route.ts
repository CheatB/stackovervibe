import { NextRequest, NextResponse } from "next/server";
import { getPayloadClient } from "@/lib/payload";
import { getCurrentUser } from "@/lib/auth";

const ДОПУСТИМЫЕ_ТИПЫ = ["skill", "hook", "command", "rule", "plugin"];

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
    toolType: string;
    shortDescription: string;
    code?: string;
    description?: string;
    githubUrl?: string;
  };
  try {
    данные = await request.json();
  } catch {
    return NextResponse.json({ error: "Невалидный JSON" }, { status: 400 });
  }

  const { title, toolType, shortDescription, code, description, githubUrl } =
    данные;

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

  if (!ДОПУСТИМЫЕ_ТИПЫ.includes(toolType)) {
    return NextResponse.json(
      { error: "Выберите тип инструмента" },
      { status: 400 },
    );
  }

  if (!shortDescription?.trim() || shortDescription.trim().length < 10) {
    return NextResponse.json(
      { error: "Описание минимум 10 символов" },
      { status: 400 },
    );
  }

  if (shortDescription.trim().length > 500) {
    return NextResponse.json(
      { error: "Описание максимум 500 символов" },
      { status: 400 },
    );
  }

  const payload = await getPayloadClient();

  const инструмент = await payload.create({
    collection: "tools",
    data: {
      title: title.trim(),
      toolType,
      shortDescription: shortDescription.trim(),
      status: "draft",
      ...(code ? { code: code.trim() } : {}),
      ...(description
        ? {
            description: {
              root: {
                type: "root",
                children: [
                  {
                    type: "paragraph",
                    children: [{ type: "text", text: description.trim() }],
                  },
                ],
              },
            },
          }
        : {}),
      ...(githubUrl ? { githubUrl: githubUrl.trim() } : {}),
    } as any,
  });

  return NextResponse.json({
    success: true,
    slug: инструмент.slug,
    id: инструмент.id,
  });
}
