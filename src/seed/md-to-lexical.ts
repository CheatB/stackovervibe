/**
 * Конвертер Markdown → Lexical JSON
 * Используется seed-скриптами для импорта .md контента в Payload CMS
 */
import { heading, paragraph, codeBlock, list, quote, hr, root } from "./lexical";

export function mdToLexical(markdown: string) {
  const lines = markdown.split("\n");
  const nodes: unknown[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Пустая строка — пропускаем
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Горизонтальная линия
    if (/^---+\s*$/.test(line)) {
      nodes.push(hr());
      i++;
      continue;
    }

    // Заголовок
    const headingMatch = line.match(/^(#{1,6})\s+(.+)/);
    if (headingMatch) {
      const level = headingMatch[1].length as 1 | 2 | 3 | 4 | 5 | 6;
      nodes.push(heading(level, headingMatch[2].trim()));
      i++;
      continue;
    }

    // Блок кода
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim() || "text";
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      if (i < lines.length) i++; // пропустить закрывающий ```
      nodes.push(codeBlock(codeLines.join("\n"), lang));
      continue;
    }

    // Цитата
    if (line.startsWith("> ")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("> ")) {
        quoteLines.push(lines[i].slice(2));
        i++;
      }
      nodes.push(quote(quoteLines.join(" ")));
      continue;
    }

    // Таблица (конвертируем в code block для сохранения форматирования)
    if (line.includes("|") && line.trim().startsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].includes("|") && lines[i].trim().startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      nodes.push(codeBlock(tableLines.join("\n"), "text"));
      continue;
    }

    // Нумерованный список
    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, ""));
        i++;
      }
      nodes.push(list(items, true));
      continue;
    }

    // Маркированный список
    if (/^[-*]\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*]\s/, ""));
        i++;
      }
      nodes.push(list(items, false));
      continue;
    }

    // Чеклист (- [ ] / - [x])
    if (/^- \[[ x]\]\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^- \[[ x]\]\s/.test(lines[i])) {
        const checked = lines[i].startsWith("- [x]");
        const text = lines[i].replace(/^- \[[ x]\]\s/, "");
        items.push((checked ? "✅ " : "⬜ ") + text);
        i++;
      }
      nodes.push(list(items, false));
      continue;
    }

    // Параграф (собираем многострочные)
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].startsWith("#") &&
      !lines[i].startsWith("```") &&
      !lines[i].startsWith("> ") &&
      !lines[i].startsWith("- ") &&
      !lines[i].startsWith("* ") &&
      !/^\d+\.\s/.test(lines[i]) &&
      !/^---+\s*$/.test(lines[i]) &&
      !(lines[i].includes("|") && lines[i].trim().startsWith("|")) &&
      !/^- \[[ x]\]\s/.test(lines[i])
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length > 0) {
      nodes.push(paragraph(paraLines.join(" ")));
    }
  }

  return root(nodes);
}
