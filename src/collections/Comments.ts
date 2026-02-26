import type { CollectionConfig } from 'payload'

/** 15 минут в миллисекундах — окно редактирования */
const ОКНО_РЕДАКТИРОВАНИЯ_МС = 15 * 60 * 1000

export const Comments: CollectionConfig = {
  slug: 'comments',
  admin: {
    useAsTitle: 'text',
    group: 'Контент',
    defaultColumns: ['text', 'author', 'contentType', 'createdAt'],
  },
  access: {
    read: () => true,
    create: ({ req }) => {
      if (!req.user) return false
      return !req.user.isBanned
    },
    update: ({ req }) => {
      if (req.user?.role === 'admin') return true
      if (!req.user) return false
      /* Автор может редактировать в течение 15 минут — проверка в хуке */
      return { author: { equals: req.user.id } }
    },
    delete: ({ req }) => req.user?.role === 'admin',
  },
  hooks: {
    beforeChange: [
      ({ data, operation, originalDoc }) => {
        /* Проверка окна редактирования (15 минут) */
        if (operation === 'update' && originalDoc?.createdAt) {
          const создан = new Date(originalDoc.createdAt).getTime()
          if (Date.now() - создан > ОКНО_РЕДАКТИРОВАНИЯ_МС) {
            throw new Error('Время редактирования истекло (15 минут)')
          }
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'text',
      type: 'textarea',
      required: true,
      label: 'Текст комментария',
      maxLength: 2000,
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Автор',
      admin: { readOnly: true },
    },
    {
      name: 'contentType',
      type: 'select',
      required: true,
      label: 'Тип контента',
      options: [
        { label: 'Гайд', value: 'guide' },
        { label: 'Инструмент', value: 'tool' },
        { label: 'Пост', value: 'post' },
        { label: 'Вопрос', value: 'question' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'contentId',
      type: 'text',
      required: true,
      label: 'ID контента',
      admin: { position: 'sidebar' },
    },
  ],
}
