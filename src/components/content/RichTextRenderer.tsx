import {
  RichText,
  defaultJSXConverters,
} from "@payloadcms/richtext-lexical/react";
import type { JSXConvertersFunction } from "@payloadcms/richtext-lexical/react";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import { CodeBlock } from "./CodeBlock";

/** Кастомные конвертеры для ретро-стиля Stackovervibe */
const jsxConverters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
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
