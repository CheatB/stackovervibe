"use client";

import { useState } from "react";

export function CopyButton({ code }: { code: string }) {
  const [скопировано, setСкопировано] = useState(false);

  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(code);
        setСкопировано(true);
        setTimeout(() => setСкопировано(false), 2000);
      }}
      className="px-3 py-1 text-xs rounded border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-colors"
    >
      {скопировано ? "Скопировано!" : "Копировать"}
    </button>
  );
}
