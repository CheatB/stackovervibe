import type { CollectionConfig, CollectionAfterChangeHook } from 'payload'
import { sendTelegramMessage } from '@/lib/telegram-bot'
import { транслит } from '@/lib/utils'

/** Уведомления автору при смене статуса поста */
const уведомитьАвтора: CollectionAfterChangeHook = async ({ doc, previousDoc, operation }) => {
  if (operation !== 'update') return doc

  const новыйСтатус = doc.status
  const старыйСтатус = previousDoc?.status

  if (новыйСтатус === старыйСтатус) return doc

  /* Получить Telegram ID автора */
  const автор = typeof doc.author === 'object' ? doc.author : null
  if (!автор?.telegramId) return doc

  if (новыйСтатус === 'published') {
    await sendTelegramMessage(
      автор.telegramId,
      `✅ Ваш пост «${doc.title}» опубликован!\nhttps://${process.env.NEXT_PUBLIC_SITE_URL}/posts/${doc.slug}`,
    )
  } else if (новыйСтатус === 'rejected') {
    const причина = doc.rejectionReason || 'не указана'
    const комментарий = doc.rejectionComment ? `\n${doc.rejectionComment}` : ''
    await sendTelegramMessage(
      автор.telegramId,
      `❌ Пост «${doc.title}» отклонён.\nПричина: ${причина}${комментарий}`,
    )
  }

  return doc
}


export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    group: 'Контент',
    defaultColumns: ['title', 'author', 'status', 'publishedAt'],
    listSearchableFields: ['title', 'slug'],
  },
  access: {
    read: ({ req }) => {
      if (req.user?.role === 'admin') return true
      if (req.user) {
        return {
          or: [
            { status: { equals: 'published' } },
            { author: { equals: req.user.id } },
          ],
        } as import('payload').Where
      }
      return { status: { equals: 'published' } }
    },
    create: ({ req }) => {
      if (!req.user) return false
      return !req.user.isBanned
    },
    update: ({ req }) => {
      if (req.user?.role === 'admin') return true
      if (!req.user || req.user.isBanned) return false
      return {
        and: [
          { author: { equals: req.user.id } },
          { status: { in: ['draft', 'pending'] } },
        ],
      } as import('payload').Where
    },
    delete: ({ req }) => req.user?.role === 'admin',
  },
  hooks: {
    afterChange: [уведомитьАвтора],
    beforeChange: [
      ({ data, operation }) => {
        if (operation === 'create' && data?.title && !data?.slug) {
          data.slug = транслит(data.title)
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Заголовок',
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      label: 'URL-слаг',
      admin: {
        position: 'sidebar',
        description: 'Генерируется автоматически из заголовка',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      label: 'Контент',
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Автор',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      label: 'Категория',
      admin: { position: 'sidebar' },
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      label: 'Теги',
      admin: { position: 'sidebar' },
    },
    /* Статус */
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      label: 'Статус',
      options: [
        { label: 'Черновик', value: 'draft' },
        { label: 'На модерации', value: 'pending' },
        { label: 'Опубликован', value: 'published' },
        { label: 'Отклонён', value: 'rejected' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'rejectionReason',
      type: 'select',
      label: 'Причина отклонения',
      options: [
        { label: 'Не по теме', value: 'off-topic' },
        { label: 'Низкое качество', value: 'low-quality' },
        { label: 'Спам', value: 'spam' },
        { label: 'Дубликат', value: 'duplicate' },
        { label: 'Другое', value: 'other' },
      ],
      admin: {
        position: 'sidebar',
        condition: (data) => data?.status === 'rejected',
      },
    },
    {
      name: 'rejectionComment',
      type: 'textarea',
      label: 'Комментарий модератора',
      admin: {
        position: 'sidebar',
        condition: (data) => data?.status === 'rejected',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Дата публикации',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
    /* SEO */
    {
      name: 'seoTitle',
      type: 'text',
      label: 'SEO-заголовок',
      admin: { position: 'sidebar' },
    },
    {
      name: 'seoDescription',
      type: 'textarea',
      label: 'SEO-описание',
      admin: { position: 'sidebar' },
    },
    /* Просмотры */
    {
      name: 'views',
      type: 'number',
      defaultValue: 0,
      label: 'Просмотры',
      admin: { position: 'sidebar', readOnly: true },
    },
    /* Реакции */
    {
      name: 'likes',
      type: 'number',
      defaultValue: 0,
      label: 'Лайки',
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'dislikes',
      type: 'number',
      defaultValue: 0,
      label: 'Дизлайки',
      admin: { position: 'sidebar', readOnly: true },
    },
  ],
}
