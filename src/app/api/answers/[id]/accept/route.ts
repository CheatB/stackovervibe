import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { getCurrentUser } from '@/lib/auth'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const user = await getCurrentUser(request)
  if (!user) {
    return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 })
  }

  const payload = await getPayloadClient()

  let ответ: any
  try {
    ответ = await payload.findByID({ collection: 'answers', id, depth: 1 })
  } catch {
    return NextResponse.json({ error: 'Ответ не найден' }, { status: 404 })
  }

  const questionId = typeof ответ.question === 'object' ? ответ.question.id : ответ.question
  let вопрос: any
  try {
    вопрос = await payload.findByID({ collection: 'questions', id: questionId })
  } catch {
    return NextResponse.json({ error: 'Вопрос не найден' }, { status: 404 })
  }

  const авторВопроса = typeof вопрос.author === 'object' ? вопрос.author.id : вопрос.author
  if (авторВопроса !== user.id && user.role !== 'admin') {
    return NextResponse.json({ error: 'Только автор вопроса может принять ответ' }, { status: 403 })
  }

  const новоеЗначение = !ответ.isAccepted

  /* Снять принятие с других ответов */
  if (новоеЗначение) {
    const { docs: другиеПринятые } = await payload.find({
      collection: 'answers',
      where: {
        question: { equals: questionId },
        isAccepted: { equals: true },
      },
      limit: 10,
    })
    for (const д of другиеПринятые) {
      await payload.update({ collection: 'answers', id: д.id, data: { isAccepted: false } })
    }
  }

  await payload.update({ collection: 'answers', id, data: { isAccepted: новоеЗначение } })

  return NextResponse.json({ success: true, isAccepted: новоеЗначение })
}
