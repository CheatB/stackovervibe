"use client";

import { useEffect, useState } from "react";

interface AdminEditButtonProps {
  collection: string;
  id: number | string;
}

/** Кнопка редактирования в Payload CMS — видна только админам */
export function AdminEditButton({ collection, id }: AdminEditButtonProps) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetch("/api/users/me", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.user?.role === "admin") setIsAdmin(true);
      })
      .catch(() => {});
  }, []);

  if (!isAdmin) return null;

  return (
    <a
      href={`/admin/collections/${collection}/${id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded border border-[var(--color-primary)]/30 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-colors font-[family-name:var(--font-code)]"
      title="Редактировать в CMS"
    >
      [edit]
    </a>
  );
}
