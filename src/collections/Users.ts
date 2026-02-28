import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  auth: {
    useAPIKey: true,
  },
  admin: {
    useAsTitle: "email",
    group: "Система",
    defaultColumns: ["email", "displayName", "role"],
  },
  access: {
    read: () => true,
    create: ({ req }) => req.user?.role === "admin",
    update: ({ req, id }) => {
      if (req.user?.role === "admin") return true;
      return req.user?.id === id;
    },
    delete: ({ req }) => req.user?.role === "admin",
  },
  fields: [
    {
      name: "telegramId",
      type: "number",
      unique: true,
      label: "Telegram ID",
      admin: { readOnly: true },
    },
    {
      name: "telegramUsername",
      type: "text",
      label: "Telegram Username",
      admin: { readOnly: true },
    },
    {
      name: "displayName",
      type: "text",
      label: "Отображаемое имя",
    },
    {
      name: "avatarUrl",
      type: "text",
      label: "URL аватарки",
      admin: { readOnly: true },
    },
    {
      name: "role",
      type: "select",
      defaultValue: "user",
      label: "Роль",
      options: [
        { label: "Администратор", value: "admin" },
        { label: "Пользователь", value: "user" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "isBanned",
      type: "checkbox",
      defaultValue: false,
      label: "Забанен",
      admin: { position: "sidebar" },
    },
    {
      name: "bio",
      type: "textarea",
      label: "О себе",
    },
  ],
};
