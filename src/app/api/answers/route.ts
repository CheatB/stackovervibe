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

  let данные: { questionId: string | number; body: string }
  try {
    данные = await request.json()
  } catch {
    return NextResponse.json({ error: 'Невалидный JSON' }, { status: 400 })
  }

  const { questionId, body } = данные

  if (!questionId) {
    return NextResponse.json({ error: 'Не указан вопрос' }, { status: 400 })
  }

  if (!body?.trim() || body.trim().length < 10) {
    return NextResponse.json({ error: 'Ответ минимум 10 символов' }, { status: 400 })
  }

  const payload = await getPayloadClient()

  /* Проверить что вопрос открыт */
  try {
    const вопрос = await payload.findByID({ collection: 'questions', id: questionId })
    if ((вопрос as any).status === 'closed') {
      return NextResponse.json({ error: 'Вопрос закрыт' }, { status: 400 })
    }
  } catch {
    return NextResponse.json({ error: 'Вопрос не найден' }, { status: 404 })
  }

  const ответ = await payload.create({
    collection: 'answers',
    data: {
      question: questionId,
      body: {
        root: {
          type: 'root',
          children: [{ type: 'paragraph', children: [{ type: 'text', text: body.trim() }] }],
        },
      },
      author: user.id,
    },
  })

  return NextResponse.json({ success: true, id: ответ.id })
}
