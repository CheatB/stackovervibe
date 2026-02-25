import crypto from 'crypto'

interface TelegramAuthData {
  id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
  auth_date: number
  hash: string
}

/** Проверка HMAC-SHA256 подписи Telegram Login Widget */
export function verifyTelegramAuth(data: TelegramAuthData, botToken: string): boolean {
  const { hash, ...остальное } = data

  /* auth_date не старше 1 часа */
  const сейчас = Math.floor(Date.now() / 1000)
  if (сейчас - data.auth_date > 3600) return false

  /* Сортированная строка key=value для проверки */
  const проверочнаяСтрока = Object.entries(остальное)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('\n')

  const секретныйКлюч = crypto.createHash('sha256').update(botToken).digest()
  const hmac = crypto.createHmac('sha256', секретныйКлюч).update(проверочнаяСтрока).digest('hex')

  return hmac === hash
}

export type { TelegramAuthData }
