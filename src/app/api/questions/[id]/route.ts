import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { getCurrentUser } from '@/lib/auth'

/** PUT — Редактирование вопроса */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const user = await getCurrentUser(request)
  if (!user) {
    return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 })
  }

  const payload = await getPayloadClient()

  let вопрос: any
  try {
    вопрос = await payload.findByID({ collection: 'questions', id })
  } catch {
    return NextResponse.json({ error: 'Вопрос не найден' }, { status: 404 })
  }

  const авторId = typeof вопрос.author === 'object' ? вопрос.author.id : вопрос.author
  if (авторId !== user.id && user.role !== 'admin') {
    return NextResponse.json({ error: 'Нет прав на редактирование' }, { status: 403 })
  }

  let данные: { title?: string; body?: string; category?: string; tags?: string[] }
  try {
    данные = await request.json()
  } catch {
    return NextResponse.json({ error: 'Невалидный JSON' }, { status: 400 })
  }

  const обновление: Record<string, any> = {
    editedAt: new Date().toISOString(),
  }

  if (данные.title?.trim()) {
    if (данные.title.trim().length < 10) {
      return NextResponse.json({ error: 'Заголовок минимум 10 символов' }, { status: 400 })
    }
    обновление.title = данные.title.trim()
  }

  if (данные.body?.trim()) {
    if (данные.body.trim().length < 20) {
      return NextResponse.json({ error: 'Тело вопроса минимум 20 символов' }, { status: 400 })
    }
    обновление.body = {
      root: {
        type: 'root',
        children: [{ type: 'paragraph', children: [{ type: 'text', text: данные.body.trim() }] }],
      },
    }
  }

  if (данные.category !== undefined) обновление.category = данные.category || null
  if (данные.tags) обновление.tags = данные.tags

  await payload.update({ collection: 'questions', id, data: обновление })

  return NextResponse.json({ success: true })
}
