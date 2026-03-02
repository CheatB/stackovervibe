import type { CollectionConfig } from "payload";

export const Tools: CollectionConfig = {
  slug: "tools",
  admin: {
    useAsTitle: "title",
    group: "Контент",
    defaultColumns: ["title", "toolType", "category", "status", "publishedAt"],
    listSearchableFields: ["title", "slug", "shortDescription"],
  },
  access: {
    read: ({ req }) => {
      if (req.user?.role === "admin") return true;
      return { status: { equals: "published" } };
    },
    create: ({ req }) => req.user?.role === "admin",
    update: ({ req }) => req.user?.role === "admin",
    delete: ({ req }) => req.user?.role === "admin",
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      label: "Название",
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      label: "URL-слаг",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "toolType",
      type: "select",
      required: true,
      label: "Тип инструмента",
      options: [
        { label: "Скилл", value: "skill" },
        { label: "Хук", value: "hook" },
        { label: "Команда", value: "command" },
        { label: "Правило", value: "rule" },
        { label: "Плагин", value: "plugin" },
      ],
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "shortDescription",
      type: "textarea",
      label: "Краткое описание",
      admin: {
        description: "Для карточек каталога",
      },
    },
    {
      name: "description",
      type: "richText",
      label: "Полное описание",
    },
    {
      name: "code",
      type: "code",
      label: "Код инструмента",
      admin: {
        language: "yaml",
        description: "Основной код/конфиг инструмента",
      },
    },
    {
      name: "installGuide",
      type: "richText",
      label: "Инструкция по установке",
    },
    {
      name: "commonProblems",
      type: "richText",
      label: "Частые проблемы",
    },
    {
      name: "githubUrl",
      type: "text",
      label: "Ссылка на GitHub",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "downloadFiles",
      type: "upload",
      relationTo: "media",
      hasMany: true,
      label: "Файлы для скачивания",
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      label: "Категория",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "tags",
      type: "relationship",
      relationTo: "tags",
      hasMany: true,
      label: "Теги",
      admin: {
        position: "sidebar",
      },
    },
    /* Условные группы по типу инструмента */
    {
      name: "skillFields",
      type: "group",
      label: "Параметры скилла",
      admin: {
        condition: (data) => data?.toolType === "skill",
      },
      fields: [
        {
          name: "workflow",
          type: "richText",
          label: "Workflow",
        },
        {
          name: "examples",
          type: "richText",
          label: "Примеры использования",
        },
      ],
    },
    {
      name: "hookFields",
      type: "group",
      label: "Параметры хука",
      admin: {
        condition: (data) => data?.toolType === "hook",
      },
      fields: [
        {
          name: "trigger",
          type: "select",
          label: "Триггер",
          options: [
            { label: "PreToolUse", value: "PreToolUse" },
            { label: "PostToolUse", value: "PostToolUse" },
            { label: "Stop", value: "Stop" },
          ],
        },
        {
          name: "condition",
          type: "text",
          label: "Условие",
        },
        {
          name: "hookCommand",
          type: "code",
          label: "Команда",
        },
      ],
    },
    {
      name: "commandFields",
      type: "group",
      label: "Параметры команды",
      admin: {
        condition: (data) => data?.toolType === "command",
      },
      fields: [
        {
          name: "syntax",
          type: "text",
          label: "Синтаксис вызова",
        },
        {
          name: "args",
          type: "textarea",
          label: "Аргументы",
        },
      ],
    },
    {
      name: "ruleFields",
      type: "group",
      label: "Параметры правила",
      admin: {
        condition: (data) => data?.toolType === "rule",
      },
      fields: [
        {
          name: "scope",
          type: "text",
          label: "Область применения",
        },
        {
          name: "priority",
          type: "select",
          label: "Приоритет",
          options: [
            { label: "Высокий", value: "high" },
            { label: "Средний", value: "medium" },
            { label: "Низкий", value: "low" },
          ],
        },
      ],
    },
    {
      name: "pluginFields",
      type: "group",
      label: "Параметры плагина",
      admin: {
        condition: (data) => data?.toolType === "plugin",
      },
      fields: [
        {
          name: "integration",
          type: "richText",
          label: "Интеграция",
        },
        {
          name: "configuration",
          type: "code",
          label: "Пример конфигурации",
        },
      ],
    },
    /* SEO */
    {
      name: "seoTitle",
      type: "text",
      label: "SEO-заголовок",
      admin: { position: "sidebar" },
    },
    {
      name: "seoDescription",
      type: "textarea",
      label: "SEO-описание",
      admin: { position: "sidebar" },
    },
    /* Просмотры */
    {
      name: "views",
      type: "number",
      defaultValue: 0,
      label: "Просмотры",
      admin: { position: "sidebar", readOnly: true },
    },
    /* Скачивания */
    {
      name: "downloads",
      type: "number",
      defaultValue: 0,
      label: "Скачивания",
      admin: { position: "sidebar", readOnly: true },
    },
    /* Реакции */
    {
      name: "likes",
      type: "number",
      defaultValue: 0,
      label: "Лайки",
      admin: { position: "sidebar", readOnly: true },
    },
    {
      name: "dislikes",
      type: "number",
      defaultValue: 0,
      label: "Дизлайки",
      admin: { position: "sidebar", readOnly: true },
    },
    /* Статус */
    {
      name: "status",
      type: "select",
      defaultValue: "draft",
      label: "Статус",
      options: [
        { label: "Черновик", value: "draft" },
        { label: "Опубликован", value: "published" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "publishedAt",
      type: "date",
      label: "Дата публикации",
      admin: {
        position: "sidebar",
        date: { pickerAppearance: "dayAndTime" },
      },
    },
  ],
};
