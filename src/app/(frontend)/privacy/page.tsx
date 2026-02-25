import type { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/seo'
import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav'

export const metadata: Metadata = generatePageMetadata({
  title: 'Политика конфиденциальности',
  description: 'Политика конфиденциальности Stackovervibe — как мы собираем и используем данные.',
  url: '/privacy',
})

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <BreadcrumbNav items={[{ label: 'privacy' }]} />

      <h1 className="text-3xl">Политика конфиденциальности</h1>

      <div className="space-y-6 text-sm leading-relaxed text-[var(--color-text-muted)]">
        <section>
          <h2 className="text-lg text-[var(--color-text)] mb-2">1. Какие данные собираем</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Telegram-авторизация:</strong> имя, username, фото профиля, Telegram ID.
              Используется для создания аккаунта и отображения профиля.
            </li>
            <li>
              <strong>Cookies:</strong> техническая cookie для сессии авторизации (payload-token).
            </li>
            <li>
              <strong>Аналитика:</strong> при вашем согласии — Яндекс.Метрика и Google Analytics
              для анализа посещаемости (анонимные данные).
            </li>
            <li>
              <strong>Комментарии и посты:</strong> текст, дата, привязка к аккаунту.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg text-[var(--color-text)] mb-2">2. Как используем</h2>
          <p>
            Данные используются для работы сайта: авторизация, отображение профиля,
            модерация контента, аналитика посещаемости. Мы не продаём и не передаём
            персональные данные третьим лицам.
          </p>
        </section>

        <section>
          <h2 className="text-lg text-[var(--color-text)] mb-2">3. Cookies</h2>
          <p>
            Сайт использует только необходимые cookies (сессия авторизации).
            Аналитические cookies загружаются только после вашего явного согласия через баннер.
          </p>
        </section>

        <section>
          <h2 className="text-lg text-[var(--color-text)] mb-2">4. Ваши права</h2>
          <p>
            Вы можете запросить удаление вашего аккаунта и всех связанных данных,
            написав нам в Telegram. Аналитические cookies можно отклонить через баннер.
          </p>
        </section>

        <section>
          <h2 className="text-lg text-[var(--color-text)] mb-2">5. Контакт</h2>
          <p>
            По вопросам о данных:{' '}
            <a
              href="https://t.me/CheatB"
              className="text-[var(--color-primary)] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              @CheatB в Telegram
            </a>
          </p>
        </section>

        <p className="text-xs pt-4 border-t border-[var(--color-border)]">
          Последнее обновление: {new Date().toLocaleDateString('ru-RU')}
        </p>
      </div>
    </div>
  )
}
