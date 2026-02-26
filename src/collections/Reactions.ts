import type { CollectionConfig } from 'payload'

export const Reactions: CollectionConfig = {
  slug: 'reactions',
  admin: {
    group: 'Система',
    defaultColumns: ['contentType', 'contentId', 'type', 'createdAt'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => false,
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
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
        { label: 'Ответ', value: 'answer' },
      ],
    },
    {
      name: 'contentId',
      type: 'text',
      required: true,
      label: 'ID контента',
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      label: 'Тип реакции',
      options: [
        { label: 'Лайк', value: 'like' },
        { label: 'Дизлайк', value: 'dislike' },
      ],
    },
    {
      name: 'fingerprint',
      type: 'text',
      required: true,
      label: 'Отпечаток',
      admin: { readOnly: true },
    },
  ],
}
