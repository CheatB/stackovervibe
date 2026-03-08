/**
 * Оглавление статьи — извлекает H2/H3 из Lexical JSON.
 * Серверный компонент. Помогает LLM чанковать контент по секциям.
 */

interface LexicalNode {
  type: string;
  tag?: string;
  children?: Array<{ text?: string }>;
}

interface LexicalContent {
  root?: {
    children?: LexicalNode[];
  };
}

interface ЭлементОглавления {
  id: string;
  text: string;
  level: 2 | 3;
}

function транслит(text: string): string {
  const карта: Record<string, string> = {
    а: "a",
    б: "b",
    в: "v",
    г: "g",
    д: "d",
    е: "e",
    ё: "yo",
    ж: "zh",
    з: "z",
    и: "i",
    й: "j",
    к: "k",
    л: "l",
    м: "m",
    н: "n",
    о: "o",
    п: "p",
    р: "r",
    с: "s",
    т: "t",
    у: "u",
    ф: "f",
    х: "h",
    ц: "c",
    ч: "ch",
    ш: "sh",
    щ: "shch",
    ъ: "",
    ы: "y",
    ь: "",
    э: "e",
    ю: "yu",
    я: "ya",
  };
  return text
    .toLowerCase()
    .split("")
    .map((c) => карта[c] ?? c)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function извлечьОглавление(content: LexicalContent): ЭлементОглавления[] {
  const элементы: ЭлементОглавления[] = [];
  const ноды = content?.root?.children ?? [];

  for (const нода of ноды) {
    if (нода.type === "heading" && (нода.tag === "h2" || нода.tag === "h3")) {
      const text = нода.children?.map((c) => c.text ?? "").join("") ?? "";
      if (text) {
        элементы.push({
          id: транслит(text),
          text,
          level: нода.tag === "h2" ? 2 : 3,
        });
      }
    }
  }

  return элементы;
}

export function TableOfContents({ content }: { content: LexicalContent }) {
  const элементы = извлечьОглавление(content);

  if (элементы.length < 3) return null;

  return (
    <nav
      aria-label="Оглавление"
      className="border border-[var(--color-border)] rounded p-4 mb-8 bg-[var(--color-surface)]"
    >
      <p className="text-sm font-bold text-[var(--color-muted)] mb-2 uppercase tracking-wider">
        Содержание
      </p>
      <ul className="space-y-1 text-sm">
        {элементы.map((э) => (
          <li key={э.id} className={э.level === 3 ? "ml-4" : ""}>
            <a
              href={`#${э.id}`}
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] no-underline transition-colors"
            >
              {э.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
