import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { getCurrentUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request)
  if (!user) {
    return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 })
  }

  if (user.isBanned) {
    return NextResponse.json({ error: 'Аккаунт заблокирован' }, { status: 403 })
  }

  let данные: { title: string; body: string; category?: string; tags?: string[] }
  try {
    данные = await request.json()
  } catch {
    return NextResponse.json({ error: 'Невалидный JSON' }, { status: 400 })
  }

  const { title, body, category, tags } = данные

  if (!title?.trim() || title.trim().length < 10) {
    return NextResponse.json({ error: 'Заголовок минимум 10 символов' }, { status: 400 })
  }

  if (!body?.trim() || body.trim().length < 20) {
    return NextResponse.json({ error: 'Тело вопроса минимум 20 символов' }, { status: 400 })
  }

  if (title.trim().length > 300) {
    return NextResponse.json({ error: 'Заголовок максимум 300 символов' }, { status: 400 })
  }

  const payload = await getPayloadClient()

  const вопрос = await payload.create({
    collection: 'questions',
    data: {
      title: title.trim(),
      body: {
        root: {
          type: 'root',
          children: [{ type: 'paragraph', children: [{ type: 'text', text: body.trim() }] }],
        },
      },
      author: user.id,
      ...(category ? { category } : {}),
      ...(tags?.length ? { tags } : {}),
    },
  })

  return NextResponse.json({ success: true, slug: вопрос.slug, id: вопрос.id })
}
