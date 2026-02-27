"use client";

import { useState } from "react";

interface DownloadButtonProps {
  frameworkId: string;
  slug: string;
}

export function DownloadButton({ frameworkId, slug }: DownloadButtonProps) {
  const [загрузка, setЗагрузка] = useState(false);

  const скачать = async () => {
    setЗагрузка(true);
    try {
      const ответ = await fetch(`/api/frameworks/${frameworkId}/download`, {
        method: "POST",
      });

      if (!ответ.ok) return;

      const blob = await ответ.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${slug}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setЗагрузка(false);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={скачать}
        disabled={загрузка}
        className="px-4 py-2 bg-[var(--color-secondary)] text-[var(--color-bg)] font-bold text-sm rounded font-[family-name:var(--font-code)] hover:opacity-90 transition disabled:opacity-50 neon-secondary"
      >
        {загрузка ? "> скачивание..." : "> скачать .md"}
      </button>
      <span className="text-[10px] text-[var(--color-text-muted)] font-[family-name:var(--font-code)]">
        Закинь в Claude, Cursor или любой AI
      </span>
    </div>
  );
}
