import type { GlobalConfig } from 'payload'

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Навигация',
  admin: {
    group: 'Система',
  },
  fields: [
    {
      name: 'mainMenu',
      type: 'array',
      label: 'Главное меню',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Текст ссылки',
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          label: 'URL',
        },
        {
          name: 'isExternal',
          type: 'checkbox',
          defaultValue: false,
          label: 'Внешняя ссылка',
        },
      ],
    },
    {
      name: 'footerMenu',
      type: 'array',
      label: 'Меню в футере',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Текст ссылки',
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          label: 'URL',
        },
        {
          name: 'isExternal',
          type: 'checkbox',
          defaultValue: false,
          label: 'Внешняя ссылка',
        },
      ],
    },
  ],
}
