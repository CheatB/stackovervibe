import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export async function POST(request: NextRequest) {
  const payload = await getPayloadClient()

  /* Проверить авторизацию через cookie */
  const token = request.cookies.get('payload-token')?.value
  if (!token) {
    return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 })
  }

  let user
  try {
    const result = await payload.find({
      collection: 'users',
      where: {},
      limit: 1,
      overrideAccess: false,
      user: { collection: 'users', token },
    } as Parameters<typeof payload.find>[0])
    user = result.docs[0]
  } catch {
    /* Fallback: извлечь юзера из JWT */
    try {
      const headers = { Authorization: `JWT ${token}` }
      const meResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/users/me`, { headers })
      if (meResponse.ok) {
        const meData = await meResponse.json()
        user = meData.user
      }
    } catch {
      return NextResponse.json({ error: 'Невалидный токен' }, { status: 401 })
    }
  }

  if (!user) {
    return NextResponse.json({ error: 'Пользователь не найден' }, { status: 401 })
  }

  if (user.isBanned) {
    return NextResponse.json({ error: 'Аккаунт заблокирован' }, { status: 403 })
  }

  let данные: { text: string; contentType: string; contentId: string }
  try {
    данные = await request.json()
  } catch {
    return NextResponse.json({ error: 'Невалидный JSON' }, { status: 400 })
  }

  if (!данные.text?.trim() || !данные.contentType || !данные.contentId) {
    return NextResponse.json({ error: 'Заполните все поля' }, { status: 400 })
  }

  if (данные.text.length > 2000) {
    return NextResponse.json({ error: 'Комментарий слишком длинный (макс 2000 символов)' }, { status: 400 })
  }

  const комментарий = await payload.create({
    collection: 'comments',
    data: {
      text: данные.text.trim(),
      author: user.id,
      contentType: данные.contentType,
      contentId: данные.contentId,
    },
    depth: 1,
  })

  return NextResponse.json(комментарий, { status: 201 })
}
