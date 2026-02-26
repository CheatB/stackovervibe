/**
 * Seed-скрипт: заполняет Payload CMS контентом через Local API.
 *
 * Запуск: npx tsx src/seed/index.ts
 *
 * Создаёт:
 * - 7 категорий
 * - 15 тегов
 * - 14 гайдов (6 путь новичка + 8 фреймворк)
 * - 67 инструментов (15 скиллов + 18 команд + 14 хуков + 10 правил + 10 плагинов)
 *
 * Все записи создаются со статусом `draft`.
 */

import { getPayload } from 'payload'
import config from '../../payload.config'
import { categoriesData } from './categories'
import { tagsData } from './tags'
import { guidesData } from './guides'
import { toolsData } from './tools'

async function seed() {
  console.log('━━━ SEED: Запуск ━━━\n')

  const payload = await getPayload({ config })

  /* =========================================
     1. Категории
     ========================================= */
  console.log('📁 Создаю категории...')
  const categoryMap = new Map<string, number | string>()

  for (const cat of categoriesData) {
    try {
      // Проверка: уже существует?
      const existing = await payload.find({
        collection: 'categories',
        where: { slug: { equals: cat.slug } },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        categoryMap.set(cat.slug, existing.docs[0].id)
        console.log(`  ⏭️  ${cat.title} (уже есть)`)
        continue
      }

      const created = await payload.create({
        collection: 'categories',
        data: cat,
      })
      categoryMap.set(cat.slug, created.id)
      console.log(`  ✅ ${cat.title}`)
    } catch (err) {
      console.error(`  ❌ ${cat.title}:`, (err as Error).message)
    }
  }
  console.log(`  Итого: ${categoryMap.size} категорий\n`)

  /* =========================================
     2. Теги
     ========================================= */
  console.log('🏷️  Создаю теги...')
  const tagMap = new Map<string, number | string>()

  for (const tag of tagsData) {
    try {
      const existing = await payload.find({
        collection: 'tags',
        where: { slug: { equals: tag.slug } },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        tagMap.set(tag.slug, existing.docs[0].id)
        continue
      }

      const created = await payload.create({
        collection: 'tags',
        data: tag,
      })
      tagMap.set(tag.slug, created.id)
    } catch (err) {
      console.error(`  ❌ ${tag.title}:`, (err as Error).message)
    }
  }
  console.log(`  ✅ ${tagMap.size} тегов\n`)

  /* =========================================
     3. Гайды
     ========================================= */
  console.log('📖 Создаю гайды...')
  let guidesCreated = 0

  for (const guide of guidesData) {
    try {
      const existing = await payload.find({
        collection: 'guides',
        where: { slug: { equals: guide.slug } },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        console.log(`  ⏭️  ${guide.title} (уже есть)`)
        continue
      }

      await payload.create({
        collection: 'guides',
        data: {
          title: guide.title,
          slug: guide.slug,
          content: guide.content,
          excerpt: guide.excerpt,
          pathOrder: guide.pathOrder,
          category: categoryMap.get(guide.categorySlug) ?? undefined,
          status: 'draft',
        },
      })
      guidesCreated++
      console.log(`  ✅ [${guide.pathOrder}] ${guide.title}`)
    } catch (err) {
      console.error(`  ❌ ${guide.title}:`, (err as Error).message)
    }
  }
  console.log(`  Итого: ${guidesCreated} гайдов создано\n`)

  /* =========================================
     4. Инструменты
     ========================================= */
  console.log('🔧 Создаю инструменты...')
  let toolsCreated = 0
  const toolTypeCounts: Record<string, number> = {}

  for (const tool of toolsData) {
    try {
      const existing = await payload.find({
        collection: 'tools',
        where: { slug: { equals: tool.slug } },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        console.log(`  ⏭️  ${tool.title} (уже есть)`)
        continue
      }

      const tagIds = tool.tagSlugs
        .map((slug) => tagMap.get(slug))
        .filter(Boolean)

      const data: Record<string, unknown> = {
        title: tool.title,
        slug: tool.slug,
        toolType: tool.toolType,
        shortDescription: tool.shortDescription,
        description: tool.description,
        category: categoryMap.get(tool.categorySlug) ?? undefined,
        tags: tagIds.length > 0 ? tagIds : undefined,
        status: 'draft',
      }

      // Доп. поля по типу
      if (tool.extra) {
        for (const [key, value] of Object.entries(tool.extra)) {
          data[key] = value
        }
      }

      await payload.create({
        collection: 'tools',
        data,
      })
      toolsCreated++
      toolTypeCounts[tool.toolType] = (toolTypeCounts[tool.toolType] ?? 0) + 1

      // Лог по 10-м
      if (toolsCreated % 10 === 0) {
        console.log(`  ... ${toolsCreated} инструментов создано`)
      }
    } catch (err) {
      console.error(`  ❌ ${tool.title}:`, (err as Error).message)
    }
  }

  console.log(`  ✅ ${toolsCreated} инструментов создано:`)
  for (const [type, count] of Object.entries(toolTypeCounts)) {
    console.log(`     ${type}: ${count}`)
  }

  /* =========================================
     Итого
     ========================================= */
  console.log('\n━━━ SEED: Готово ━━━')
  console.log(`Категории: ${categoryMap.size}`)
  console.log(`Теги: ${tagMap.size}`)
  console.log(`Гайды: ${guidesCreated}`)
  console.log(`Инструменты: ${toolsCreated}`)
  console.log('\nВсе записи созданы со статусом draft.')
  console.log('Публикуйте через CMS: /admin\n')

  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
