import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Система',
  },
  upload: {
    mimeTypes: [
      'image/webp',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/svg+xml',
      'application/json',
      'application/x-yaml',
      'text/markdown',
      'text/plain',
      'application/zip',
    ],
    imageSizes: [
      {
        name: 'thumbnail',
        width: 150,
        height: 150,
        position: 'centre',
      },
      {
        name: 'card',
        width: 600,
        height: 400,
        position: 'centre',
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        position: 'centre',
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Alt-текст',
    },
  ],
}
