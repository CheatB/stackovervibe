interface JsonLdProps {
  data: Record<string, unknown>
}

/**
 * Универсальный компонент для вставки JSON-LD structured data.
 * Данные формируются серверно из CMS — пользовательский ввод не попадает напрямую.
 * dangerouslySetInnerHTML — стандартный паттерн Next.js для JSON-LD.
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
