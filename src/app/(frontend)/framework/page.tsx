import type { Metadata } from 'next'
import { getPayloadClient } from '@/lib/payload'
import { generatePageMetadata } from '@/lib/seo'
import { RichTextRenderer } from '@/components/content/RichTextRenderer'
import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav'

export async function generateMetadata(): Promise<Metadata> {
  const страница = await getFrameworkPage()
  if (!страница) return { title: 'Фреймворк' }

  return generatePageMetadata({
    title: страница.seoTitle || 'Фреймворк',
    description: страница.seoDescription || 'Методология работы с ИИ-ассистентами',
    url: '/framework',
  })
}

async function getFrameworkPage() {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'framework' } },
    limit: 1,
  })
  return docs[0] ?? null
}

export default async function FrameworkPage() {
  const страница = await getFrameworkPage()

  if (!страница) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl md:text-4xl">Фреймворк</h1>
        <div className="p-8 border border-[var(--color-border)] rounded-lg text-center">
          <p className="text-[var(--color-text-muted)] font-[family-name:var(--font-code)]">
            {'>'} Контент загружается... Создайте страницу с slug &quot;framework&quot; в CMS.
          </p>
        </div>
      </div>
    )
  }

  return (
    <article className="max-w-3xl mx-auto space-y-8">
      <BreadcrumbNav items={[{ label: 'framework' }]} />
      <h1 className="text-3xl md:text-4xl">{страница.title}</h1>
      {страница.content && <RichTextRenderer content={страница.content} />}
    </article>
  )
}
