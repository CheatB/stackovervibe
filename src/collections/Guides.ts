import type { CollectionConfig } from 'payload'

export const Guides: CollectionConfig = {
  slug: 'guides',
  admin: {
    useAsTitle: 'title',
    group: 'Контент',
    defaultColumns: ['title', 'category', 'status', 'pathOrder', 'publishedAt'],
    listSearchableFields: ['title', 'slug', 'excerpt'],
  },
  access: {
    read: ({ req }) => {
      if (req.user?.role === 'admin') return true
      return { status: { equals: 'published' } }
    },
    create: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
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
      required: true,
      unique: true,
      label: 'URL-слаг',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      label: 'Контент',
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Краткое описание',
      admin: {
        description: 'Для карточек и SEO (150-160 символов)',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      label: 'Категория',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'pathOrder',
      type: 'number',
      defaultValue: 0,
      label: 'Порядок в пути новичка',
      admin: {
        position: 'sidebar',
        description: '0 = не входит в путь',
      },
    },
    {
      name: 'ogImage',
      type: 'upload',
      relationTo: 'media',
      label: 'OG-изображение',
      admin: {
        position: 'sidebar',
      },
    },
    /* SEO */
    {
      name: 'seoTitle',
      type: 'text',
      label: 'SEO-заголовок',
      admin: {
        position: 'sidebar',
        description: 'По умолчанию — title',
      },
    },
    {
      name: 'seoDescription',
      type: 'textarea',
      label: 'SEO-описание',
      admin: {
        position: 'sidebar',
      },
    },
    /* Реакции */
    {
      name: 'likes',
      type: 'number',
      defaultValue: 0,
      label: 'Лайки',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'dislikes',
      type: 'number',
      defaultValue: 0,
      label: 'Дизлайки',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    /* Статус */
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      label: 'Статус',
      options: [
        { label: 'Черновик', value: 'draft' },
        { label: 'Опубликован', value: 'published' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Дата публикации',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
  ],
}
