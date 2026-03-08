import {
  RichText,
  defaultJSXConverters,
} from "@payloadcms/richtext-lexical/react";
import type { JSXConvertersFunction } from "@payloadcms/richtext-lexical/react";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import { CodeBlock } from "./CodeBlock";

/** Транслит для id заголовков (якоря для ToC) */
function транслитId(text: string): string {
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

/** Кастомные конвертеры для ретро-стиля Stackovervibe */
const jsxConverters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  // Заголовки с id для якорных ссылок (ToC + LLM-чанкинг)
  heading: ({ node, nodesToJSX }: any) => {
    const Tag = node.tag || "h2";
    const текст = node.children?.map((c: any) => c.text ?? "").join("") ?? "";
    const id = транслитId(текст);
    return <Tag id={id}>{nodesToJSX({ nodes: node.children })}</Tag>;
  },
  // Стандартная Lexical code-нода (type: "code") → наш CodeBlock
  code: ({
    node,
  }: {
    node: { children?: Array<{ text?: string }>; language?: string };
  }) => {
    const текст = node.children?.map((c) => c.text ?? "").join("") ?? "";
    return <CodeBlock code={текст} language={node.language} />;
  },
  // Кастомные Payload блоки
  blocks: {
    ...("blocks" in defaultConverters
      ? (defaultConverters.blocks as Record<string, unknown>)
      : {}),
    code: ({
      node,
    }: {
      node: { fields: { code: string; language?: string; filename?: string } };
    }) => (
      <CodeBlock
        code={node.fields.code}
        language={node.fields.language}
        filename={node.fields.filename}
      />
    ),
  },
});

interface RichTextRendererProps {
  content: SerializedEditorState;
  className?: string;
}

export function RichTextRenderer({
  content,
  className,
}: RichTextRendererProps) {
  if (!content) return null;

  return (
    <div className={`prose prose-invert max-w-none ${className ?? ""}`}>
      <RichText converters={jsxConverters} data={content} />
    </div>
  );
}
