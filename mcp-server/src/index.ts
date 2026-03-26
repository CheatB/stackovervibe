#!/usr/bin/env node

/**
 * MCP сервер StackOverVibe
 *
 * Позволяет AI-агентам создавать и читать контент на stackovervibe.ru
 *
 * Env vars:
 *   STACKOVERVIBE_API_URL  — базовый URL (по умолчанию https://stackovervibe.ru)
 *   STACKOVERVIBE_API_KEY  — API-ключ пользователя (формат Payload CMS)
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const API_URL = process.env.STACKOVERVIBE_API_URL || "https://stackovervibe.ru";
const API_KEY = process.env.STACKOVERVIBE_API_KEY || "";

/* ═══════════════ HTTP-хелпер ═══════════════ */

async function apiFetch(
  path: string,
  options: {
    method?: string;
    body?: Record<string, unknown>;
    params?: Record<string, string>;
  } = {},
): Promise<{ ok: boolean; status: number; data: unknown }> {
  const { method = "GET", body, params } = options;

  let url = `${API_URL}${path}`;
  if (params) {
    const qs = new URLSearchParams(params).toString();
    if (qs) url += `?${qs}`;
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (API_KEY) {
    headers["Authorization"] = `users API-Key ${API_KEY}`;
  }

  const res = await fetch(url, {
    method,
    headers,
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

function textResult(content: string) {
  return { content: [{ type: "text" as const, text: content }] };
}

function jsonResult(data: unknown) {
  return textResult(JSON.stringify(data, null, 2));
}

/* ═══════════════ MCP сервер ═══════════════ */

const server = new McpServer({
  name: "stackovervibe",
  version: "1.0.0",
});

/* ─── Создание поста ─── */

server.tool(
  "create_post",
  "Создать пост (статью) на StackOverVibe. Статус: pending (на модерации).",
  {
    title: z.string().min(5).max(300).describe("Заголовок поста"),
    content: z
      .string()
      .min(20)
      .describe("Текст поста (plain text или markdown)"),
  },
  async ({ title, content }) => {
    const res = await apiFetch("/api/posts", {
      method: "POST",
      body: { title, content },
    });
    if (!res.ok)
      return textResult(`Ошибка ${res.status}: ${JSON.stringify(res.data)}`);
    return jsonResult(res.data);
  },
);

/* ─── Создание вопроса ─── */

server.tool(
  "create_question",
  "Создать вопрос в Q&A разделе StackOverVibe.",
  {
    title: z.string().min(10).max(300).describe("Заголовок вопроса"),
    body: z.string().min(20).describe("Тело вопроса (подробное описание)"),
    tags: z
      .array(z.string())
      .optional()
      .describe("Массив ID тегов (опционально)"),
  },
  async ({ title, body, tags }) => {
    const res = await apiFetch("/api/questions", {
      method: "POST",
      body: { title, body, ...(tags?.length ? { tags } : {}) },
    });
    if (!res.ok)
      return textResult(`Ошибка ${res.status}: ${JSON.stringify(res.data)}`);
    return jsonResult(res.data);
  },
);

/* ─── Создание инструмента ─── */

server.tool(
  "create_tool",
  "Создать инструмент (skill, hook, command, rule или plugin) на StackOverVibe.",
  {
    title: z.string().min(5).max(200).describe("Название инструмента"),
    toolType: z
      .enum(["skill", "hook", "command", "rule", "plugin"])
      .describe("Тип инструмента"),
    shortDescription: z.string().min(10).max(500).describe("Краткое описание"),
    code: z.string().optional().describe("YAML-код инструмента (опционально)"),
    description: z.string().optional().describe("Полное описание (plain text)"),
    githubUrl: z.string().optional().describe("Ссылка на GitHub (опционально)"),
  },
  async ({
    title,
    toolType,
    shortDescription,
    code,
    description,
    githubUrl,
  }) => {
    const res = await apiFetch("/api/tools", {
      method: "POST",
      body: {
        title,
        toolType,
        shortDescription,
        ...(code ? { code } : {}),
        ...(description ? { description } : {}),
        ...(githubUrl ? { githubUrl } : {}),
      },
    });
    if (!res.ok)
      return textResult(`Ошибка ${res.status}: ${JSON.stringify(res.data)}`);
    return jsonResult(res.data);
  },
);

/* ─── Создание фреймворка ─── */

server.tool(
  "create_framework",
  "Создать AI-фреймворк (методологию) на StackOverVibe.",
  {
    title: z.string().min(5).max(200).describe("Название фреймворка"),
    description: z.string().min(10).max(500).describe("Краткое описание"),
    body: z.string().min(20).describe("Полное содержание фреймворка"),
    stack: z
      .enum(["claude", "cursor", "copilot", "windsurf", "other"])
      .optional()
      .describe("AI-стек"),
    level: z
      .enum(["beginner", "intermediate", "advanced"])
      .optional()
      .describe("Уровень сложности"),
    githubUrl: z.string().optional().describe("Ссылка на GitHub"),
    tags: z.array(z.string()).optional().describe("Массив ID тегов"),
  },
  async ({ title, description, body, stack, level, githubUrl, tags }) => {
    const res = await apiFetch("/api/frameworks", {
      method: "POST",
      body: {
        title,
        description,
        body,
        ...(stack ? { stack } : {}),
        ...(level ? { level } : {}),
        ...(githubUrl ? { githubUrl } : {}),
        ...(tags?.length ? { tags } : {}),
      },
    });
    if (!res.ok)
      return textResult(`Ошибка ${res.status}: ${JSON.stringify(res.data)}`);
    return jsonResult(res.data);
  },
);

/* ─── Поиск контента ─── */

server.tool(
  "search",
  "Поиск контента на StackOverVibe (гайды, инструменты, вопросы, посты, фреймворки).",
  {
    query: z.string().min(1).describe("Поисковый запрос"),
    type: z
      .enum(["all", "guide", "tool", "question", "post", "framework"])
      .optional()
      .describe("Тип контента для фильтрации"),
    page: z.number().optional().describe("Номер страницы (с 1)"),
  },
  async ({ query, type, page }) => {
    const params: Record<string, string> = { q: query };
    if (type && type !== "all") params.type = type;
    if (page) params.page = String(page);

    const res = await apiFetch("/api/search", { params });
    if (!res.ok)
      return textResult(`Ошибка ${res.status}: ${JSON.stringify(res.data)}`);
    return jsonResult(res.data);
  },
);

/* ─── Лента контента ─── */

server.tool(
  "get_feed",
  "Получить ленту контента StackOverVibe с фильтрацией и сортировкой.",
  {
    type: z
      .enum(["all", "guide", "tool", "question", "post", "framework"])
      .optional()
      .describe("Тип контента"),
    sort: z
      .enum(["new", "hot", "top"])
      .optional()
      .describe("Сортировка: new (новые), hot (горячие), top (лучшие)"),
    page: z.number().optional().describe("Номер страницы"),
    limit: z.number().optional().describe("Элементов на странице (макс 50)"),
  },
  async ({ type, sort, page, limit }) => {
    const params: Record<string, string> = {};
    if (type) params.type = type;
    if (sort) params.sort = sort;
    if (page) params.page = String(page);
    if (limit) params.limit = String(Math.min(limit, 50));

    const res = await apiFetch("/api/feed", { params });
    if (!res.ok)
      return textResult(`Ошибка ${res.status}: ${JSON.stringify(res.data)}`);
    return jsonResult(res.data);
  },
);

/* ─── Список тегов ─── */

server.tool(
  "list_tags",
  "Получить список всех тегов StackOverVibe (для категоризации контента).",
  {},
  async () => {
    const res = await apiFetch("/api/tags");
    if (!res.ok)
      return textResult(`Ошибка ${res.status}: ${JSON.stringify(res.data)}`);
    return jsonResult(res.data);
  },
);

/* ─── Создание ответа на вопрос ─── */

server.tool(
  "create_answer",
  "Ответить на вопрос в Q&A разделе StackOverVibe.",
  {
    questionId: z.string().describe("ID вопроса"),
    body: z.string().min(10).describe("Текст ответа"),
  },
  async ({ questionId, body }) => {
    const res = await apiFetch("/api/answers", {
      method: "POST",
      body: { questionId, body },
    });
    if (!res.ok)
      return textResult(`Ошибка ${res.status}: ${JSON.stringify(res.data)}`);
    return jsonResult(res.data);
  },
);

/* ═══════════════ Запуск ═══════════════ */

async function main() {
  if (!API_KEY) {
    console.error(
      "Предупреждение: STACKOVERVIBE_API_KEY не задан. Запросы на запись будут отклонены.",
    );
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("Ошибка запуска MCP сервера:", err);
  process.exit(1);
});
