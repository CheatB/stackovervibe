import { CopyButton } from "./CopyButton";
import { DownloadCodeButton } from "./DownloadCodeButton";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

export function CodeBlock({
  code,
  language = "text",
  filename,
}: CodeBlockProps) {
  return (
    <div className="my-6 rounded-lg border border-[var(--color-border)] overflow-hidden bg-[#0d0d0d]">
      {/* Шапка — терминальный стиль */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#111] border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2 min-w-0 mr-2">
          {/* Кружки терминала */}
          <span className="w-3 h-3 rounded-full bg-[#ff5f56] flex-shrink-0" />
          <span className="w-3 h-3 rounded-full bg-[#ffbd2e] flex-shrink-0" />
          <span className="w-3 h-3 rounded-full bg-[#27c93f] flex-shrink-0" />
          {filename && (
            <span className="ml-2 text-xs text-[var(--color-text-muted)] font-[family-name:var(--font-code)] truncate">
              {filename}
            </span>
          )}
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <CopyButton code={code} />
          {filename && (
            <DownloadCodeButton
              code={code}
              filename={filename || `code.${language}`}
            />
          )}
        </div>
      </div>

      {/* Код */}
      <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
        <code className="font-[family-name:var(--font-code)] text-[var(--color-primary)]">
          {code}
        </code>
      </pre>
    </div>
  );
}
