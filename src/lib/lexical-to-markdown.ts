/** Конвертер Lexical AST → Markdown для скачивания фреймворков */

interface LexicalNode {
  type: string;
  text?: string;
  children?: LexicalNode[];
  tag?: string;
  format?: number | string;
  listType?: string;
  value?: number;
  url?: string;
  language?: string;
  fields?: { language?: string };
}

/** Извлечь текст из inline-нодов (text, link и т.д.) */
function извлечьТекст(ноды: LexicalNode[]): string {
  return ноды
    .map((нода) => {
      if (нода.type === "text") {
        let текст = нода.text || "";
        const формат = typeof нода.format === "number" ? нода.format : 0;
        if (формат & 1) текст = `**${текст}**`; /* bold */
        if (формат & 2) текст = `*${текст}*`; /* italic */
        if (формат & 8) текст = `\`${текст}\``; /* code */
        if (формат & 4) текст = `~~${текст}~~`; /* strikethrough */
        return текст;
      }
      if (нода.type === "link" || нода.type === "autolink") {
        const дети = нода.children ? извлечьТекст(нода.children) : "";
        return `[${дети}](${нода.url || ""})`;
      }
      if (нода.type === "linebreak") return "\n";
      if (нода.children) return извлечьТекст(нода.children);
      return нода.text || "";
    })
    .join("");
}

/** Конвертировать блочные ноды в markdown */
function конвертироватьНоды(ноды: LexicalNode[], уровеньОтступа = 0): string {
  const строки: string[] = [];

  for (const нода of ноды) {
    switch (нода.type) {
      case "paragraph": {
        const текст = нода.children ? извлечьТекст(нода.children) : "";
        строки.push(текст);
        строки.push("");
        break;
      }
      case "heading": {
        const уровень = нода.tag ? parseInt(нода.tag.replace("h", ""), 10) : 2;
        const хеши = "#".repeat(уровень);
        const текст = нода.children ? извлечьТекст(нода.children) : "";
        строки.push(`${хеши} ${текст}`);
        строки.push("");
        break;
      }
      case "list": {
        if (нода.children) {
          const элементы = конвертироватьСписок(
            нода.children,
            нода.listType || "bullet",
            уровеньОтступа,
          );
          строки.push(элементы);
          строки.push("");
        }
        break;
      }
      case "quote": {
        const текст = нода.children ? извлечьТекст(нода.children) : "";
        строки.push(`> ${текст}`);
        строки.push("");
        break;
      }
      case "code": {
        const язык = нода.language || нода.fields?.language || "";
        const текст = нода.children ? извлечьТекст(нода.children) : "";
        строки.push(`\`\`\`${язык}`);
        строки.push(текст);
        строки.push("```");
        строки.push("");
        break;
      }
      case "horizontalrule": {
        строки.push("---");
        строки.push("");
        break;
      }
      default: {
        if (нода.children) {
          строки.push(конвертироватьНоды(нода.children, уровеньОтступа));
        }
      }
    }
  }

  return строки.join("\n");
}

/** Конвертировать элементы списка */
function конвертироватьСписок(
  элементы: LexicalNode[],
  типСписка: string,
  отступ: number,
): string {
  const строки: string[] = [];
  let номер = 1;

  for (const элемент of элементы) {
    if (элемент.type === "listitem") {
      const префиксОтступа = "  ".repeat(отступ);
      const маркер = типСписка === "number" ? `${номер}.` : "-";
      const текст = элемент.children ? извлечьТекст(элемент.children) : "";
      строки.push(`${префиксОтступа}${маркер} ${текст}`);
      номер++;
    }
  }

  return строки.join("\n");
}

/** Главная функция: Lexical JSON → Markdown */
export function lexicalToMarkdown(содержимое: any): string {
  if (!содержимое?.root?.children) return "";
  return конвертироватьНоды(содержимое.root.children).trim();
}
