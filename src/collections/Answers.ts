import type { CollectionConfig, CollectionAfterChangeHook, CollectionAfterDeleteHook, CollectionBeforeChangeHook } from 'payload'

/** Инкремент answersCount при создании ответа */
const инкрементОтветов: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  if (operation !== 'create') return doc

  const questionId = typeof doc.question === 'object' ? doc.question.id : doc.question
  if (!questionId) return doc

  try {
    const вопрос = await req.payload.findByID({ collection: 'questions', id: questionId })
    await req.payload.update({
      collection: 'questions',
      id: questionId,
      data: { answersCount: ((вопрос as any).answersCount || 0) + 1 },
    })
  } catch { /* вопрос не найден */ }

  return doc
}

/** Декремент answersCount при удалении ответа */
const декрементОтветов: CollectionAfterDeleteHook = async ({ doc, req }) => {
  const questionId = typeof doc.question === 'object' ? doc.question.id : doc.question
  if (!questionId) return doc

  try {
    const вопрос = await req.payload.findByID({ collection: 'questions', id: questionId })
    const текущее = (вопрос as any).answersCount || 0
    await req.payload.update({
      collection: 'questions',
      id: questionId,
      data: { answersCount: Math.max(0, текущее - 1) },
    })
  } catch { /* вопрос не найден */ }

  return doc
}

/** Установить editedAt при обновлении */
const обновитьДату: CollectionBeforeChangeHook = ({ data, operation }) => {
  if (operation === 'update' && data) {
    data.editedAt = new Date().toISOString()
  }
  if (operation === 'create' && data && !data.publishedAt) {
    data.publishedAt = new Date().toISOString()
  }
  return data
}

export const Answers: CollectionConfig = {
  slug: 'answers',
  admin: {
    group: 'Контент',
    defaultColumns: ['question', 'author', 'isAccepted', 'likes', 'createdAt'],
  },
  access: {
    read: () => true,
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
    beforeChange: [обновитьДату],
    afterChange: [инкрементОтветов],
    afterDelete: [декрементОтветов],
  },
  fields: [
    {
      name: 'question',
      type: 'relationship',
      relationTo: 'questions',
      required: true,
      label: 'Вопрос',
      admin: { readOnly: true },
    },
    {
      name: 'body',
      type: 'richText',
      required: true,
      label: 'Тело ответа',
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
      name: 'isAccepted',
      type: 'checkbox',
      defaultValue: false,
      label: 'Принятый ответ',
      admin: { position: 'sidebar' },
    },
    /* Счётчики */
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
  ],
}
