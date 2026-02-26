import type { CollectionConfig, CollectionBeforeChangeHook, CollectionAfterChangeHook } from 'payload'
import { транслит } from '@/lib/utils'
import { sendTelegramMessage } from '@/lib/telegram-bot'

/** Авто-slug + publishedAt при создании */
const подготовитьДанные: CollectionBeforeChangeHook = ({ data, operation }) => {
  if (!data) return data
  if (operation === 'create') {
    if (data.title && !data.slug) {
      data.slug = транслит(data.title)
    }
    if (!data.publishedAt) {
      data.publishedAt = new Date().toISOString()
    }
  }
  if (operation === 'update' && !data.editedAt) {
    data.editedAt = new Date().toISOString()
  }
  return data
}

/** TG-уведомление автору при закрытии вопроса */
const уведомитьОЗакрытии: CollectionAfterChangeHook = async ({ doc, previousDoc, operation }) => {
  if (operation !== 'update') return doc

  const былОткрыт = previousDoc?.status === 'published'
  const сталЗакрыт = doc.status === 'closed'

  if (!былОткрыт || !сталЗакрыт) return doc

  const автор = typeof doc.author === 'object' ? doc.author : null
  if (!автор?.telegramId) return doc

  const причина = doc.closedAs || 'не указана'
  await sendTelegramMessage(
    автор.telegramId,
    `🔒 Ваш вопрос «${doc.title}» закрыт.\nПричина: ${причина}`,
  )

  return doc
}

export const Questions: CollectionConfig = {
  slug: 'questions',
  admin: {
    useAsTitle: 'title',
    group: 'Контент',
    defaultColumns: ['title', 'author', 'status', 'answersCount', 'publishedAt'],
    listSearchableFields: ['title', 'slug'],
  },
  access: {
    read: ({ req }) => {
      if (req.user?.role === 'admin') return true
      return {
        status: { in: ['published', 'closed'] },
      }
    },
    create: ({ req }) => {
      if (!req.user) return false
      return !req.user.isBanned
    },
    update: ({ req }) => {
      if (req.user?.role === 'admin') return true
      if (!req.user || req.user.isBanned) return false
      return { author: { equals: req.user.id } }
    },
    delete: ({ req }) => req.user?.role === 'admin',
  },
  hooks: {
    beforeChange: [подготовитьДанные],
    afterChange: [уведомитьОЗакрытии],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Заголовок',
      maxLength: 300,
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
      name: 'body',
      type: 'richText',
      required: true,
      label: 'Тело вопроса',
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Автор',
      admin: { position: 'sidebar', readOnly: true },
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
      defaultValue: 'published',
      label: 'Статус',
      options: [
        { label: 'Опубликован', value: 'published' },
        { label: 'Закрыт', value: 'closed' },
      ],
      admin: { position: 'sidebar' },
    },
    /* Закрытие */
    {
      name: 'closedAs',
      type: 'select',
      label: 'Причина закрытия',
      options: [
        { label: 'Дубликат', value: 'duplicate' },
        { label: 'Не по теме', value: 'off-topic' },
        { label: 'Слишком широкий', value: 'too-broad' },
        { label: 'Неясный', value: 'unclear' },
        { label: 'Основан на мнении', value: 'opinion-based' },
      ],
      admin: {
        position: 'sidebar',
        condition: (data) => data?.status === 'closed',
      },
    },
    {
      name: 'closedReason',
      type: 'textarea',
      label: 'Комментарий к закрытию',
      admin: {
        position: 'sidebar',
        condition: (data) => data?.status === 'closed',
      },
    },
    {
      name: 'linkedQuestionId',
      type: 'relationship',
      relationTo: 'questions',
      label: 'Связанный вопрос (дубликат)',
      admin: {
        position: 'sidebar',
        condition: (data) => data?.closedAs === 'duplicate',
      },
    },
    /* Счётчики */
    {
      name: 'views',
      type: 'number',
      defaultValue: 0,
      label: 'Просмотры',
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'answersCount',
      type: 'number',
      defaultValue: 0,
      label: 'Ответов',
      admin: { position: 'sidebar', readOnly: true },
    },
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
    /* Даты */
    {
      name: 'editedAt',
      type: 'date',
      label: 'Дата редактирования',
      admin: { position: 'sidebar', readOnly: true },
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
  ],
}
