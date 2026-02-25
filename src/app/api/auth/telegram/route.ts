import { NextRequest, NextResponse } from 'next/server'
import { verifyTelegramAuth, type TelegramAuthData } from '@/lib/telegram'
import { getPayloadClient } from '@/lib/payload'

/** Rate limit: хранилище в памяти (IP → timestamp[]) */
const запросыПоIP = new Map<string, number[]>()
const ЛИМИТ = 10
const ОКНО_МС = 60_000

function проверитьЛимит(ip: string): boolean {
  const сейчас = Date.now()
  const записи = (запросыПоIP.get(ip) ?? []).filter((t) => сейчас - t < ОКНО_МС)
  if (записи.length >= ЛИМИТ) return false
  записи.push(сейчас)
  запросыПоIP.set(ip, записи)
  return true
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'

  if (!проверитьЛимит(ip)) {
    return NextResponse.json({ error: 'Слишком много запросов' }, { status: 429 })
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN
  if (!botToken) {
    return NextResponse.json({ error: 'Telegram не настроен' }, { status: 500 })
  }

  let данные: TelegramAuthData
  try {
    данные = await request.json()
  } catch {
    return NextResponse.json({ error: 'Невалидный JSON' }, { status: 400 })
  }

  if (!verifyTelegramAuth(данные, botToken)) {
    return NextResponse.json({ error: 'Невалидная подпись' }, { status: 401 })
  }

  const payload = await getPayloadClient()

  /* Найти или создать пользователя */
  const { docs: существующие } = await payload.find({
    collection: 'users',
    where: { telegramId: { equals: данные.id } },
    limit: 1,
  })

  const displayName = [данные.first_name, данные.last_name].filter(Boolean).join(' ')
  const email = `tg_${данные.id}@stackovervibe.local`
  /* Случайный пароль для Payload auth (вход только через TG) */
  const password = crypto.randomUUID() + crypto.randomUUID()

  let userId: number | string

  if (существующие.length > 0) {
    /* Обновить данные */
    const user = существующие[0]
    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        displayName,
        telegramUsername: данные.username ?? undefined,
        avatarUrl: данные.photo_url ?? undefined,
      },
    })
    userId = user.id
  } else {
    /* Создать нового */
    const user = await payload.create({
      collection: 'users',
      data: {
        email,
        password,
        telegramId: данные.id,
        telegramUsername: данные.username ?? undefined,
        displayName,
        avatarUrl: данные.photo_url ?? undefined,
        role: 'user',
      },
    })
    userId = user.id
  }

  /* Обновить пароль и залогинить — для TG-пользователей пароль всегда пересоздаётся */
  await payload.update({
    collection: 'users',
    id: userId,
    data: { password },
  })

  const { token } = await payload.login({
    collection: 'users',
    data: { email, password },
  })

  const response = NextResponse.json({ success: true, userId })

  /* JWT в httpOnly cookie */
  response.cookies.set('payload-token', token || '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 дней
  })

  return response
}
