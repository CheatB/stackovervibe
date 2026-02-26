import { NextRequest } from 'next/server'

/** Получить текущего пользователя из cookie */
export async function getCurrentUser(request: NextRequest) {
  const token = request.cookies.get('payload-token')?.value
  if (!token) return null

  try {
    const headers = { Authorization: `JWT ${token}` }
    const meResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/users/me`,
      { headers },
    )
    if (meResponse.ok) {
      const meData = await meResponse.json()
      return meData.user ?? null
    }
  } catch {
    /* Не удалось проверить токен */
  }

  return null
}
