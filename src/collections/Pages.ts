import type { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    group: 'Система',
    defaultColumns: ['title', 'slug'],
    listSearchableFields: ['title', 'slug'],
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
      label: 'Контент',
    },
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
