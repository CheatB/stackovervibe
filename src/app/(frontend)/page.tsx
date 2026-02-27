import { getFeedPage, getHotQuestions, getSiteStats } from '@/lib/payload'
import { JsonLd } from '@/components/seo/JsonLd'
import { FeedFilters } from '@/components/FeedFilters'
import { InfiniteScroll } from '@/components/InfiniteScroll'
import { Sidebar } from '@/components/Sidebar'

const САЙТ_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

const ASCII_LOGO = `
 ███████╗████████╗ █████╗  ██████╗██╗  ██╗
 ██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
 ███████╗   ██║   ███████║██║     █████╔╝
 ╚════██║   ██║   ██╔══██║██║     ██╔═██╗
 ███████║   ██║   ██║  ██║╚██████╗██║  ██╗
 ╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝
      O V E R V I B E`.trimStart()

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; sort?: string }>
}) {
  const { type, sort } = await searchParams
  const текущийТип = type || 'all'
  const текущаяСортировка = sort || 'new'

  const [лента, горячие, статистика] = await Promise.all([
    getFeedPage({ type: текущийТип, sort: текущаяСортировка, page: 1, limit: 20 }),
    getHotQuestions(5),
    getSiteStats(),
  ])

  const searchParamsObj: Record<string, string> = {}
  if (текущийТип !== 'all') searchParamsObj.type = текущийТип
  if (текущаяСортировка !== 'new') searchParamsObj.sort = текущаяСортировка

  return (
    <div>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Stackovervibe',
          url: САЙТ_URL,
          description: 'Структурированная база знаний по вайбкодингу.',
          potentialAction: {
            '@type': 'SearchAction',
            target: `${САЙТ_URL}/search?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        }}
      />

      <h1 className="sr-only">Stackovervibe — база знаний по вайбкодингу</h1>

      {/* ASCII Logo */}
      <section className="text-center mb-8 pt-4">
        <pre
          className="text-[var(--color-primary)] text-[0.35rem] sm:text-[0.5rem] md:text-xs leading-tight font-[family-name:var(--font-code)] neon-text select-none overflow-hidden"
          aria-hidden="true"
        >
          {ASCII_LOGO}
        </pre>
        <p className="text-sm text-[var(--color-text-muted)] mt-3 font-[family-name:var(--font-code)]">
          база знаний по вайбкодингу // гайды, инструменты, вопросы
        </p>
      </section>

      {/* Разделитель */}
      <div className="text-center text-[var(--color-border)] font-[family-name:var(--font-code)] text-xs select-none mb-6 overflow-hidden">
        ════════════════════════════════════════
      </div>

      {/* Фильтры */}
      <FeedFilters />

      {/* Лента + Сайдбар */}
      <div className="flex flex-col lg:flex-row gap-6 mt-6">
        {/* Лента */}
        <div className="flex-1 min-w-0">
          <InfiniteScroll
            initialItems={лента.items}
            initialPage={1}
            hasMore={лента.hasMore}
            searchParams={searchParamsObj}
          />
        </div>

        {/* Сайдбар — компактный на мобиле, полный на десктопе */}
        <aside className="w-full lg:w-72 lg:flex-shrink-0">
          <Sidebar
            hotQuestions={горячие.map((в: any) => ({
              title: в.title,
              slug: в.slug,
            }))}
            stats={статистика}
          />
        </aside>
      </div>
    </div>
  )
}
