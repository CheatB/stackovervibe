import { NextRequest } from "next/server";

/** Получить текущего пользователя из cookie или API-ключа */
export async function getCurrentUser(request: NextRequest) {
  const token = request.cookies.get("payload-token")?.value;
  const authHeader = request.headers.get("authorization");

  let authorization: string | null = null;

  if (token) {
    authorization = `JWT ${token}`;
  } else if (authHeader) {
    authorization = authHeader;
  }

  if (!authorization) return null;

  try {
    const meResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/users/me`,
      { headers: { Authorization: authorization } },
    );
    if (meResponse.ok) {
      const meData = await meResponse.json();
      return meData.user ?? null;
    }
  } catch {
    /* Не удалось проверить токен */
  }

  return null;
}
