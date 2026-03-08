/**
 * FAQ-секция с JSON-LD FAQPage schema.
 * LLM-поисковики и Google People Also Ask извлекают Q&A напрямую.
 */
import { JsonLd } from "./JsonLd";

interface FaqItem {
  вопрос: string;
  ответ: string;
}

export function FaqSection({ элементы }: { элементы: FaqItem[] }) {
  if (элементы.length === 0) return null;

  return (
    <section className="mt-12 pt-8 border-t border-[var(--color-border)]">
      <h2 id="faq" className="text-xl mb-6">
        Частые вопросы
      </h2>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: элементы.map((э) => ({
            "@type": "Question",
            name: э.вопрос,
            acceptedAnswer: {
              "@type": "Answer",
              text: э.ответ,
            },
          })),
        }}
      />
      <dl className="space-y-4">
        {элементы.map((э, i) => (
          <div
            key={i}
            className="border border-[var(--color-border)] rounded p-4 bg-[var(--color-surface)]"
          >
            <dt className="font-bold text-[var(--color-primary)] mb-2">
              {э.вопрос}
            </dt>
            <dd className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
              {э.ответ}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
