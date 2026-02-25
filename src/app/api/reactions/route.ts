import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export async function POST(request: NextRequest) {
  let данные: { contentType: string; contentId: string; type: 'like' | 'dislike'; fingerprint: string }
  try {
    данные = await request.json()
  } catch {
    return NextResponse.json({ error: 'Невалидный JSON' }, { status: 400 })
  }

  const { contentType, contentId, type, fingerprint } = данные

  if (!contentType || !contentId || !type || !fingerprint) {
    return NextResponse.json({ error: 'Отсутствуют обязательные поля' }, { status: 400 })
  }

  if (!['guide', 'tool', 'post'].includes(contentType)) {
    return NextResponse.json({ error: 'Неизвестный тип контента' }, { status: 400 })
  }

  if (!['like', 'dislike'].includes(type)) {
    return NextResponse.json({ error: 'Неизвестный тип реакции' }, { status: 400 })
  }

  const payload = await getPayloadClient()

  /* Проверка дублей */
  const { docs: существующие } = await payload.find({
    collection: 'reactions',
    where: {
      contentType: { equals: contentType },
      contentId: { equals: contentId },
      fingerprint: { equals: fingerprint },
    },
    limit: 1,
  })

  if (существующие.length > 0) {
    return NextResponse.json({ error: 'Уже голосовал' }, { status: 409 })
  }

  /* Создать реакцию */
  await payload.create({
    collection: 'reactions',
    data: { contentType, contentId, type, fingerprint },
  })

  /* Обновить счётчик на документе */
  const коллекция = contentType === 'guide' ? 'guides' : contentType === 'tool' ? 'tools' : 'posts'
  const поле = type === 'like' ? 'likes' : 'dislikes'

  try {
    const документ = await payload.findByID({ collection: коллекция, id: contentId })
    const текущее = (документ[поле] as number) || 0
    await payload.update({
      collection: коллекция,
      id: contentId,
      data: { [поле]: текущее + 1 },
    })
  } catch {
    /* Документ не найден — игнорируем, реакция уже сохранена */
  }

  return NextResponse.json({ success: true })
}
