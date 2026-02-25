import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Настройки сайта',
  admin: {
    group: 'Система',
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      defaultValue: 'Stackovervibe',
      label: 'Название сайта',
    },
    {
      name: 'siteDescription',
      type: 'textarea',
      label: 'Описание сайта',
      defaultValue: 'Структурированная база знаний по вайбкодингу',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Логотип',
    },
    {
      name: 'favicon',
      type: 'upload',
      relationTo: 'media',
      label: 'Favicon',
    },
    {
      name: 'yandexMetrikaId',
      type: 'text',
      label: 'Yandex.Metrika ID',
      admin: {
        description: 'Идентификатор счётчика Яндекс.Метрики',
      },
    },
    {
      name: 'gaId',
      type: 'text',
      label: 'Google Analytics ID',
      admin: {
        description: 'Идентификатор GA4 (G-XXXXXXXXXX)',
      },
    },
  ],
}
