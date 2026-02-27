import type { CollectionConfig, CollectionBeforeChangeHook } from "payload";
import { транслит } from "@/lib/utils";

/** Авто-slug + publishedAt при создании, editedAt при обновлении */
const подготовитьДанные: CollectionBeforeChangeHook = ({ data, operation }) => {
  if (!data) return data;
  if (operation === "create") {
    if (data.title && !data.slug) {
      data.slug = транслит(data.title);
    }
    if (!data.publishedAt) {
      data.publishedAt = new Date().toISOString();
    }
  }
  if (operation === "update") {
    data.editedAt = new Date().toISOString();
  }
  return data;
};

export const Frameworks: CollectionConfig = {
  slug: "frameworks",
  admin: {
    useAsTitle: "title",
    group: "Контент",
    defaultColumns: [
      "title",
      "author",
      "stack",
      "level",
      "status",
      "downloads",
      "publishedAt",
    ],
    listSearchableFields: ["title", "slug", "description"],
  },
  access: {
    read: ({ req }) => {
      if (req.user?.role === "admin") return true;
      return { status: { equals: "published" } };
    },
    create: ({ req }) => {
      if (!req.user) return false;
      return !req.user.isBanned;
    },
    update: ({ req }) => {
      if (req.user?.role === "admin") return true;
      if (!req.user || req.user.isBanned) return false;
      return { author: { equals: req.user.id } };
    },
    delete: ({ req }) => req.user?.role === "admin",
  },
  hooks: {
    beforeChange: [подготовитьДанные],
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      label: "Название",
      maxLength: 200,
    },
    {
      name: "slug",
      type: "text",
      unique: true,
      label: "URL-слаг",
      admin: {
        position: "sidebar",
        description: "Генерируется автоматически из названия",
      },
    },
    {
      name: "description",
      type: "textarea",
      required: true,
      label: "Краткое описание",
      maxLength: 500,
    },
    {
      name: "body",
      type: "richText",
      required: true,
      label: "Содержание фреймворка",
    },
    {
      name: "author",
      type: "relationship",
      relationTo: "users",
      required: true,
      label: "Автор",
      admin: { position: "sidebar", readOnly: true },
    },
    {
      name: "tags",
      type: "relationship",
      relationTo: "tags",
      hasMany: true,
      label: "Теги",
      admin: { position: "sidebar" },
    },
    {
      name: "stack",
      type: "select",
      label: "Стек / AI-инструмент",
      options: [
        { label: "Claude", value: "claude" },
        { label: "Cursor", value: "cursor" },
        { label: "Copilot", value: "copilot" },
        { label: "Windsurf", value: "windsurf" },
        { label: "Другой", value: "other" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "level",
      type: "select",
      label: "Уровень сложности",
      options: [
        { label: "Новичок", value: "beginner" },
        { label: "Средний", value: "intermediate" },
        { label: "Продвинутый", value: "advanced" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "githubUrl",
      type: "text",
      label: "GitHub URL",
      admin: { position: "sidebar" },
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
    /* Счётчики */
    {
      name: "views",
      type: "number",
      defaultValue: 0,
      label: "Просмотры",
      admin: { position: "sidebar", readOnly: true },
    },
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
    {
      name: "downloads",
      type: "number",
      defaultValue: 0,
      label: "Скачивания",
      admin: { position: "sidebar", readOnly: true },
    },
    /* Даты */
    {
      name: "editedAt",
      type: "date",
      label: "Дата редактирования",
      admin: { position: "sidebar", readOnly: true },
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
  ],
};
