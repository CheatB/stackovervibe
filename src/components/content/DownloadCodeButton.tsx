"use client";

export function DownloadCodeButton({
  code,
  filename,
}: {
  code: string;
  filename: string;
}) {
  return (
    <button
      onClick={() => {
        const blob = new Blob([code], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
      }}
      className="px-3 py-1 text-xs rounded border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] transition-colors"
    >
      Скачать
    </button>
  );
}
