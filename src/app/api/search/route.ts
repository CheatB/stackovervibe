import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

const РЕЗУЛЬТАТОВ_НА_СТРАНИЦУ = 20

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const запрос = searchParams.get('q')?.trim()
  const тип = searchParams.get('type') // guides | tools | questions | all
  const страница = Math.max(1, Number(searchParams.get('page')) || 1)

  if (!запрос || запрос.length < 2) {
    return NextResponse.json({ results: [], total: 0 })
  }

  const payload = await getPayloadClient()
  const результаты: Array<{
    id: number | string
    title: string
    slug: string
    type: 'guide' | 'tool' | 'question' | 'post'
    excerpt?: string | null
    url: string
  }> = []

  let итого = 0

  const искатьГайды = !тип || тип === 'guides' || тип === 'all'
  const искатьИнструменты = !тип || тип === 'tools' || тип === 'all'
  const искатьВопросы = !тип || тип === 'questions' || тип === 'all'
  const искатьПосты = !тип || тип === 'posts' || тип === 'all'

  if (искатьГайды) {
    const { docs, totalDocs } = await payload.find({
      collection: 'guides',
      where: {
        status: { equals: 'published' },
        or: [
          { title: { contains: запрос } },
          { excerpt: { contains: запрос } },
        ],
      },
      limit: РЕЗУЛЬТАТОВ_НА_СТРАНИЦУ,
      page: страница,
    })

    итого += totalDocs

    for (const гайд of docs) {
      результаты.push({
        id: гайд.id,
        title: гайд.title,
        slug: гайд.slug,
        type: 'guide',
        excerpt: гайд.excerpt,
        url: `/path/${гайд.slug}`,
      })
    }
  }

  if (искатьИнструменты) {
    const { docs, totalDocs } = await payload.find({
      collection: 'tools',
      where: {
        status: { equals: 'published' },
        or: [
          { title: { contains: запрос } },
          { shortDescription: { contains: запрос } },
        ],
      },
      limit: РЕЗУЛЬТАТОВ_НА_СТРАНИЦУ,
      page: страница,
    })

    итого += totalDocs

    for (const инструмент of docs) {
      результаты.push({
        id: инструмент.id,
        title: инструмент.title,
        slug: инструмент.slug,
        type: 'tool',
        excerpt: инструмент.shortDescription,
        url: `/tools/${инструмент.slug}`,
      })
    }
  }

  if (искатьВопросы) {
    const { docs, totalDocs } = await payload.find({
      collection: 'questions',
      where: {
        status: { in: ['published', 'closed'] },
        title: { contains: запрос },
      },
      limit: РЕЗУЛЬТАТОВ_НА_СТРАНИЦУ,
      page: страница,
    })

    итого += totalDocs

    for (const вопрос of docs) {
      результаты.push({
        id: вопрос.id,
        title: вопрос.title,
        slug: вопрос.slug,
        type: 'question',
        excerpt: null,
        url: `/questions/${вопрос.slug}`,
      })
    }
  }

  if (искатьПосты) {
    const { docs, totalDocs } = await payload.find({
      collection: 'posts',
      where: {
        status: { equals: 'published' },
        title: { contains: запрос },
      },
      limit: РЕЗУЛЬТАТОВ_НА_СТРАНИЦУ,
      page: страница,
    })

    итого += totalDocs

    for (const пост of docs) {
      результаты.push({
        id: пост.id,
        title: пост.title,
        slug: пост.slug,
        type: 'post',
        excerpt: null,
        url: `/posts/${пост.slug}`,
      })
    }
  }

  return NextResponse.json({
    results: результаты,
    total: итого,
    query: запрос,
    page: страница,
  })
}
