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
