import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { getCurrentUser } from '@/lib/auth'

/** PATCH — Закрытие/открытие вопроса (только админ) */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const user = await getCurrentUser(request)
  if (!user) {
    return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 })
  }

  if (user.role !== 'admin') {
    return NextResponse.json({ error: 'Только администратор может закрывать вопросы' }, { status: 403 })
  }

  let данные: { action: 'close' | 'reopen'; closedAs?: string; closedReason?: string; linkedQuestionId?: string }
  try {
    данные = await request.json()
  } catch {
    return NextResponse.json({ error: 'Невалидный JSON' }, { status: 400 })
  }

  const payload = await getPayloadClient()

  if (данные.action === 'close') {
    await payload.update({
      collection: 'questions',
      id,
      data: {
        status: 'closed',
        ...(данные.closedAs ? { closedAs: данные.closedAs } : {}),
        ...(данные.closedReason ? { closedReason: данные.closedReason } : {}),
        ...(данные.linkedQuestionId ? { linkedQuestionId: данные.linkedQuestionId } : {}),
      },
    })
  } else if (данные.action === 'reopen') {
    await payload.update({
      collection: 'questions',
      id,
      data: {
        status: 'published',
        closedAs: null,
        closedReason: null,
      },
    })
  }

  return NextResponse.json({ success: true, action: данные.action })
}
