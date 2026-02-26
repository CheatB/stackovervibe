import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type { Where } from 'payload'

export async function getPayloadClient() {
  return getPayload({ config: configPromise })
}

/** Получить опубликованные гайды пути новичка (pathOrder > 0) */
export async function getPathGuides() {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'guides',
    where: {
      status: { equals: 'published' },
      pathOrder: { greater_than: 0 },
    },
    sort: 'pathOrder',
    limit: 100,
  })
  return docs
}

/** Получить гайд по slug */
export async function getGuideBySlug(slug: string) {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'guides',
    where: {
      slug: { equals: slug },
      status: { equals: 'published' },
    },
    limit: 1,
  })
  return docs[0] ?? null
}

/** Получить опубликованные инструменты с опциональными фильтрами */
export async function getTools(filters?: {
  toolType?: string
  category?: string
}) {
  const payload = await getPayloadClient()

  const where: Where = {
    status: { equals: 'published' },
  }

  if (filters?.toolType) {
    where.toolType = { equals: filters.toolType }
  }

  if (filters?.category) {
    where['category.slug'] = { equals: filters.category }
  }

  const { docs } = await payload.find({
    collection: 'tools',
    where,
    sort: '-publishedAt',
    limit: 100,
  })
  return docs
}

/** Получить инструмент по slug */
export async function getToolBySlug(slug: string) {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'tools',
    where: {
      slug: { equals: slug },
      status: { equals: 'published' },
    },
    limit: 1,
    depth: 2,
  })
  return docs[0] ?? null
}

/** Получить связанные инструменты (та же категория, исключая текущий) */
export async function getRelatedTools(toolId: number | string, categoryId?: number | string) {
  if (!categoryId) return []

  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'tools',
    where: {
      status: { equals: 'published' },
      id: { not_equals: toolId },
      category: { equals: categoryId },
    },
    limit: 4,
  })
  return docs
}

/** Получить опубликованные посты с пагинацией */
export async function getPosts(страница = 1, лимит = 10) {
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'posts',
    where: { status: { equals: 'published' } },
    sort: '-publishedAt',
    page: страница,
    limit: лимит,
    depth: 1,
  })
}

/** Получить пост по slug */
export async function getPostBySlug(slug: string) {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'posts',
    where: {
      slug: { equals: slug },
      status: { equals: 'published' },
    },
    limit: 1,
    depth: 2,
  })
  return docs[0] ?? null
}

/** Получить комментарии к контенту */
export async function getComments(contentType: string, contentId: string) {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'comments',
    where: {
      contentType: { equals: contentType },
      contentId: { equals: contentId },
    },
    sort: '-createdAt',
    limit: 100,
    depth: 1,
  })
  return docs
}

/** Получить посты пользователя */
export async function getUserPosts(userId: number | string) {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'posts',
    where: {
      author: { equals: userId },
      status: { equals: 'published' },
    },
    sort: '-publishedAt',
    limit: 100,
  })
  return docs
}

/** Получить пользователя по Telegram username */
export async function getUserByUsername(username: string) {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'users',
    where: { telegramUsername: { equals: username } },
    limit: 1,
  })
  return docs[0] ?? null
}

/** Получить все категории */
export async function getCategories() {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'categories',
    limit: 100,
    sort: 'title',
  })
  return docs
}

/* ═══════════════ Questions ═══════════════ */

/** Получить вопросы с пагинацией */
export async function getQuestions(страница = 1, лимит = 20) {
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'questions',
    where: { status: { in: ['published', 'closed'] } },
    sort: '-publishedAt',
    page: страница,
    limit: лимит,
    depth: 1,
  })
}

/** Получить вопрос по slug */
export async function getQuestionBySlug(slug: string) {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'questions',
    where: {
      slug: { equals: slug },
      status: { in: ['published', 'closed'] },
    },
    limit: 1,
    depth: 2,
  })
  return docs[0] ?? null
}

/** Горячие вопросы (больше всего ответов + лайков за последние 7 дней) */
export async function getHotQuestions(лимит = 5) {
  const payload = await getPayloadClient()
  const неделюНазад = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const { docs } = await payload.find({
    collection: 'questions',
    where: {
      status: { equals: 'published' },
      publishedAt: { greater_than: неделюНазад },
    },
    sort: '-answersCount',
    limit: лимит,
    depth: 0,
  })

  /* Если мало свежих — добрать из всех */
  if (docs.length < лимит) {
    const { docs: все } = await payload.find({
      collection: 'questions',
      where: { status: { equals: 'published' } },
      sort: '-likes',
      limit: лимит,
      depth: 0,
    })
    const ids = new Set(docs.map((d) => d.id))
    for (const д of все) {
      if (!ids.has(д.id) && docs.length < лимит) docs.push(д)
    }
  }

  return docs
}

/* ═══════════════ Answers ═══════════════ */

/** Ответы на вопрос (принятый сверху, потом по голосам) */
export async function getAnswersByQuestion(questionId: number | string) {
  const payload = await getPayloadClient()

  /* Сначала принятый */
  const { docs: принятые } = await payload.find({
    collection: 'answers',
    where: {
      question: { equals: questionId },
      isAccepted: { equals: true },
    },
    limit: 1,
    depth: 1,
  })

  /* Потом остальные по голосам */
  const { docs: остальные } = await payload.find({
    collection: 'answers',
    where: {
      question: { equals: questionId },
      isAccepted: { not_equals: true },
    },
    sort: '-likes',
    limit: 100,
    depth: 1,
  })

  return [...принятые, ...остальные]
}

/* ═══════════════ Tags ═══════════════ */

/** Получить тег по slug */
export async function getTagBySlug(slug: string) {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'tags',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  return docs[0] ?? null
}

/** Получить все теги */
export async function getAllTags() {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'tags',
    limit: 500,
    sort: 'title',
  })
  return docs
}

/* ═══════════════ Feed ═══════════════ */

/** Тип элемента ленты */
export interface FeedItem {
  id: number | string
  type: 'guide' | 'tool' | 'question' | 'post'
  title: string
  slug: string
  url: string
  excerpt: string
  votes: number
  views: number
  answersCount: number
  tags: Array<{ title: string; slug: string }>
  author: { displayName?: string; telegramUsername?: string } | null
  publishedAt: string
  hasAcceptedAnswer: boolean
}

/** Получить страницу ленты (SSR) */
export async function getFeedPage(options: {
  type?: string
  sort?: string
  page?: number
  limit?: number
}) {
  const { type = 'all', sort = 'new', page = 1, limit = 20 } = options
  const payload = await getPayloadClient()

  const запросы: Promise<FeedItem[]>[] = []

  const нужныГайды = type === 'all' || type === 'guide'
  const нужныИнструменты = type === 'all' || type === 'tool'
  const нужныВопросы = type === 'all' || type === 'question'
  const нужныПосты = type === 'all' || type === 'post'

  if (нужныГайды) {
    запросы.push(
      payload.find({
        collection: 'guides',
        where: { status: { equals: 'published' } },
        limit: 100,
        depth: 1,
      }).then(({ docs }) =>
        docs.map((г): FeedItem => ({
          id: г.id,
          type: 'guide',
          title: г.title,
          slug: г.slug,
          url: `/path/${г.slug}`,
          excerpt: (г.excerpt as string) || '',
          votes: ((г.likes as number) || 0) - ((г.dislikes as number) || 0),
          views: (г as any).views || 0,
          answersCount: 0,
          tags: [],
          author: null,
          publishedAt: (г.publishedAt as string) || (г.createdAt as string),
          hasAcceptedAnswer: false,
        })),
      ),
    )
  }

  if (нужныИнструменты) {
    запросы.push(
      payload.find({
        collection: 'tools',
        where: { status: { equals: 'published' } },
        limit: 100,
        depth: 1,
      }).then(({ docs }) =>
        docs.map((и): FeedItem => ({
          id: и.id,
          type: 'tool',
          title: и.title,
          slug: и.slug,
          url: `/tools/${и.slug}`,
          excerpt: (и.shortDescription as string) || '',
          votes: ((и.likes as number) || 0) - ((и.dislikes as number) || 0),
          views: (и as any).views || 0,
          answersCount: 0,
          tags: Array.isArray(и.tags) ? и.tags.filter((t: any) => typeof t === 'object').map((t: any) => ({ title: t.title, slug: t.slug })) : [],
          author: null,
          publishedAt: (и.publishedAt as string) || (и.createdAt as string),
          hasAcceptedAnswer: false,
        })),
      ),
    )
  }

  if (нужныВопросы) {
    запросы.push(
      payload.find({
        collection: 'questions',
        where: { status: { in: ['published', 'closed'] } },
        limit: 100,
        depth: 1,
      }).then(({ docs }) =>
        docs.map((в): FeedItem => {
          const автор = typeof в.author === 'object' ? в.author : null
          return {
            id: в.id,
            type: 'question',
            title: в.title,
            slug: в.slug,
            url: `/questions/${в.slug}`,
            excerpt: '',
            votes: ((в.likes as number) || 0) - ((в.dislikes as number) || 0),
            views: (в.views as number) || 0,
            answersCount: (в.answersCount as number) || 0,
            tags: Array.isArray(в.tags) ? в.tags.filter((t: any) => typeof t === 'object').map((t: any) => ({ title: t.title, slug: t.slug })) : [],
            author: автор ? { displayName: (автор as any).displayName, telegramUsername: (автор as any).telegramUsername } : null,
            publishedAt: (в.publishedAt as string) || (в.createdAt as string),
            hasAcceptedAnswer: false,
          }
        }),
      ),
    )
  }

  if (нужныПосты) {
    запросы.push(
      payload.find({
        collection: 'posts',
        where: { status: { equals: 'published' } },
        limit: 100,
        depth: 1,
      }).then(({ docs }) =>
        docs.map((п): FeedItem => {
          const автор = typeof п.author === 'object' ? п.author : null
          return {
            id: п.id,
            type: 'post',
            title: п.title,
            slug: п.slug,
            url: `/posts/${п.slug}`,
            excerpt: '',
            votes: ((п.likes as number) || 0) - ((п.dislikes as number) || 0),
            views: (п as any).views || 0,
            answersCount: 0,
            tags: Array.isArray(п.tags) ? п.tags.filter((t: any) => typeof t === 'object').map((t: any) => ({ title: t.title, slug: t.slug })) : [],
            author: автор ? { displayName: (автор as any).displayName, telegramUsername: (автор as any).telegramUsername } : null,
            publishedAt: (п.publishedAt as string) || (п.createdAt as string),
            hasAcceptedAnswer: false,
          }
        }),
      ),
    )
  }

  const результаты = (await Promise.all(запросы)).flat()

  /* Сортировка */
  if (sort === 'hot') {
    /* Формула: (votes * 2 + answersCount * 3 + views) / (возраст в часах + 2) */
    const сейчас = Date.now()
    результаты.sort((a, b) => {
      const scoreA = (a.votes * 2 + a.answersCount * 3 + a.views) / ((сейчас - new Date(a.publishedAt).getTime()) / 3600000 + 2)
      const scoreB = (b.votes * 2 + b.answersCount * 3 + b.views) / ((сейчас - new Date(b.publishedAt).getTime()) / 3600000 + 2)
      return scoreB - scoreA
    })
  } else if (sort === 'top') {
    результаты.sort((a, b) => b.votes - a.votes)
  } else {
    результаты.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  }

  /* Пагинация */
  const начало = (page - 1) * limit
  const страница = результаты.slice(начало, начало + limit)
  const всего = результаты.length

  return {
    items: страница,
    totalItems: всего,
    totalPages: Math.ceil(всего / limit),
    page,
    hasMore: начало + limit < всего,
  }
}

/** Статистика сайта для сайдбара */
export async function getSiteStats() {
  const payload = await getPayloadClient()

  const [гайды, инструменты, вопросы, посты] = await Promise.all([
    payload.count({ collection: 'guides', where: { status: { equals: 'published' } } }),
    payload.count({ collection: 'tools', where: { status: { equals: 'published' } } }),
    payload.count({ collection: 'questions', where: { status: { in: ['published', 'closed'] } } }),
    payload.count({ collection: 'posts', where: { status: { equals: 'published' } } }),
  ])

  return {
    guides: гайды.totalDocs,
    tools: инструменты.totalDocs,
    questions: вопросы.totalDocs,
    posts: посты.totalDocs,
  }
}
