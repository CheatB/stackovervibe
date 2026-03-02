import { NextRequest, NextResponse } from "next/server";
import { getPayloadClient } from "@/lib/payload";
import { lexicalToMarkdown } from "@/lib/lexical-to-markdown";

const ЛЕЙБЛЫ_ТИПОВ: Record<string, string> = {
  skill: "Скилл",
  hook: "Хук",
  command: "Команда",
  rule: "Правило",
  plugin: "Плагин",
};

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const payload = await getPayloadClient();

  let инструмент: any;
  try {
    инструмент = await payload.findByID({
      collection: "tools",
      id,
      depth: 1,
    });
  } catch {
    return NextResponse.json(
      { error: "Инструмент не найден" },
      { status: 404 },
    );
  }

  /* Инкремент downloads */
  const текущее = (инструмент.downloads as number) || 0;
  await payload.update({
    collection: "tools",
    id,
    data: { downloads: текущее + 1 } as any,
  });

  /* Собрать markdown */
  const типЛейбл = ЛЕЙБЛЫ_ТИПОВ[инструмент.toolType] || инструмент.toolType;

  const части: string[] = [
    `# ${инструмент.title}`,
    "",
    инструмент.shortDescription ? `> ${инструмент.shortDescription}` : "",
    "",
    `**Тип:** ${типЛейбл}`,
    инструмент.githubUrl ? `**GitHub:** ${инструмент.githubUrl}` : "",
    `**Источник:** https://stackovervibe.ru/tools/${инструмент.slug}`,
    "",
    "---",
    "",
  ];

  /* Описание */
  if (инструмент.description) {
    части.push(lexicalToMarkdown(инструмент.description), "");
  }

  /* Код */
  if (инструмент.code) {
    части.push("## Код", "", "```yaml", инструмент.code, "```", "");
  }

  /* Установка */
  if (инструмент.installGuide) {
    части.push(
      "## Установка",
      "",
      lexicalToMarkdown(инструмент.installGuide),
      "",
    );
  }

  /* Поля по типу */
  if (инструмент.toolType === "hook" && инструмент.hookFields) {
    const х = инструмент.hookFields;
    if (х.trigger) части.push(`**Триггер:** ${х.trigger}`);
    if (х.condition) части.push(`**Условие:** ${х.condition}`);
    if (х.hookCommand) {
      части.push("", "```bash", х.hookCommand, "```", "");
    }
  }

  if (инструмент.toolType === "command" && инструмент.commandFields) {
    const к = инструмент.commandFields;
    if (к.syntax) части.push(`**Синтаксис:** \`${к.syntax}\``);
    if (к.args) части.push(`**Аргументы:** ${к.args}`);
    части.push("");
  }

  if (инструмент.toolType === "skill" && инструмент.skillFields) {
    if (инструмент.skillFields.workflow) {
      части.push(
        "## Workflow",
        "",
        lexicalToMarkdown(инструмент.skillFields.workflow),
        "",
      );
    }
    if (инструмент.skillFields.examples) {
      части.push(
        "## Примеры",
        "",
        lexicalToMarkdown(инструмент.skillFields.examples),
        "",
      );
    }
  }

  if (инструмент.toolType === "plugin" && инструмент.pluginFields) {
    if (инструмент.pluginFields.integration) {
      части.push(
        "## Интеграция",
        "",
        lexicalToMarkdown(инструмент.pluginFields.integration),
        "",
      );
    }
    if (инструмент.pluginFields.configuration) {
      части.push(
        "## Конфигурация",
        "",
        "```json",
        инструмент.pluginFields.configuration,
        "```",
        "",
      );
    }
  }

  if (инструмент.toolType === "rule" && инструмент.ruleFields) {
    const р = инструмент.ruleFields;
    if (р.scope) части.push(`**Область:** ${р.scope}`);
    if (р.priority) части.push(`**Приоритет:** ${р.priority}`);
    части.push("");
  }

  const md = части.filter((с) => с !== "").join("\n");

  return new NextResponse(md, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="${инструмент.slug}.md"`,
    },
  });
}
