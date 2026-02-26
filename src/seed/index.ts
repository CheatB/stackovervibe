/**
 * Seed-скрипт: заполняет Payload CMS контентом из Vibe Framework v4.
 *
 * Запуск: npx payload run src/seed/index.ts
 * Docker: docker compose run --rm --profile seed seed
 *
 * Создаёт:
 * - 1 admin-пользователь
 * - 8 категорий
 * - 25 тегов
 * - 8 гайдов (путь новичка)
 * - 47 инструментов (15 скиллов + 14 хуков + 18 команд)
 * - 1 страница (framework)
 * - 12 вопросов + ~18 ответов
 * - Navigation (mainMenu + footerMenu)
 * - SiteSettings
 *
 * Все записи создаются со статусом `published`.
 * Идемпотентность: проверка по slug перед вставкой.
 */

import { getPayload } from 'payload'
import config from '../../payload.config'

import { categoriesData } from './data/categories'
import { tagsData } from './data/tags'
import { guidesData } from './data/guides'
import { skillsData } from './data/tools-skills'
import { hooksData } from './data/tools-hooks'
import { commandsData } from './data/tools-commands'
import { pagesData } from './data/pages'
import { questionsData } from './data/questions'
import { mainMenuData, footerMenuData, siteSettingsData } from './data/navigation'

async function seed() {
  console.log('━━━ SEED: Запуск ━━━\n')

  const payload = await getPayload({ config })

  /* =========================================
     1. Admin-пользователь
     ========================================= */
  console.log('👤 Создаю admin-пользователя...')
  let adminId: number | string | undefined

  try {
    const existing = await payload.find({
      collection: 'users',
      where: { email: { equals: 'admin@stackovervibe.ru' } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      adminId = existing.docs[0].id
      console.log('  ⏭️  admin@stackovervibe.ru (уже есть)')
    } else {
      const admin = await payload.create({
        collection: 'users',
        data: {
          email: 'admin@stackovervibe.ru',
          password: 'ChangeMe2026!',
          role: 'admin',
          displayName: 'Stackovervibe',
        },
      })
      adminId = admin.id
      console.log('  ✅ admin@stackovervibe.ru создан')
    }
  } catch (err) {
    console.error('  ❌ Admin:', (err as Error).message)
  }
  console.log()

  /* =========================================
     2. Категории
     ========================================= */
  console.log('📁 Создаю категории...')
  const categoryMap = new Map<string, number | string>()

  for (const cat of categoriesData) {
    try {
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
     3. Теги
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
     4. Гайды
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
          seoTitle: guide.seoTitle,
          seoDescription: guide.seoDescription,
          status: 'published',
          publishedAt: new Date().toISOString(),
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
     5. Инструменты (skills + hooks + commands)
     ========================================= */
  console.log('🔧 Создаю инструменты...')
  const allTools = [...skillsData, ...hooksData, ...commandsData]
  let toolsCreated = 0
  const toolTypeCounts: Record<string, number> = {}

  for (const tool of allTools) {
    try {
      const existing = await payload.find({
        collection: 'tools',
        where: { slug: { equals: tool.slug } },
        limit: 1,
      })

      if (existing.docs.length > 0) {
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
        seoTitle: tool.seoTitle,
        seoDescription: tool.seoDescription,
        status: 'published',
        publishedAt: new Date().toISOString(),
      }

      // Доп. поля по типу инструмента
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
  console.log()

  /* =========================================
     6. Страницы
     ========================================= */
  console.log('📄 Создаю страницы...')
  let pagesCreated = 0

  for (const page of pagesData) {
    try {
      const existing = await payload.find({
        collection: 'pages',
        where: { slug: { equals: page.slug } },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        console.log(`  ⏭️  ${page.title} (уже есть)`)
        continue
      }

      await payload.create({
        collection: 'pages',
        data: {
          title: page.title,
          slug: page.slug,
          content: page.content,
          seoTitle: page.seoTitle,
          seoDescription: page.seoDescription,
        },
      })
      pagesCreated++
      console.log(`  ✅ ${page.title}`)
    } catch (err) {
      console.error(`  ❌ ${page.title}:`, (err as Error).message)
    }
  }
  console.log(`  Итого: ${pagesCreated} страниц\n`)

  /* =========================================
     7. Вопросы
     ========================================= */
  console.log('❓ Создаю вопросы...')
  let questionsCreated = 0
  let answersCreated = 0

  for (const q of questionsData) {
    try {
      const existing = await payload.find({
        collection: 'questions',
        where: { slug: { equals: q.slug } },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        console.log(`  ⏭️  ${q.title} (уже есть)`)
        continue
      }

      const tagIds = q.tagSlugs
        .map((slug) => tagMap.get(slug))
        .filter(Boolean)

      const question = await payload.create({
        collection: 'questions',
        data: {
          title: q.title,
          slug: q.slug,
          body: q.body,
          author: adminId,
          category: categoryMap.get(q.categorySlug) ?? undefined,
          tags: tagIds.length > 0 ? tagIds : undefined,
          status: 'published',
          seoTitle: q.seoTitle,
          seoDescription: q.seoDescription,
        },
      })
      questionsCreated++
      console.log(`  ✅ ${q.title}`)

      /* 8. Ответы на вопрос */
      if (q.answers && q.answers.length > 0) {
        for (const answer of q.answers) {
          try {
            await payload.create({
              collection: 'answers',
              data: {
                question: question.id,
                body: answer.body,
                author: adminId,
                isAccepted: answer.isAccepted ?? false,
              },
            })
            answersCreated++
          } catch (err) {
            console.error(`    ❌ Ответ:`, (err as Error).message)
          }
        }
      }
    } catch (err) {
      console.error(`  ❌ ${q.title}:`, (err as Error).message)
    }
  }
  console.log(`  Итого: ${questionsCreated} вопросов, ${answersCreated} ответов\n`)

  /* =========================================
     9. Navigation (global)
     ========================================= */
  console.log('🧭 Обновляю навигацию...')
  try {
    await payload.updateGlobal({
      slug: 'navigation',
      data: {
        mainMenu: mainMenuData,
        footerMenu: footerMenuData,
      },
    })
    console.log('  ✅ Navigation обновлена\n')
  } catch (err) {
    console.error('  ❌ Navigation:', (err as Error).message, '\n')
  }

  /* =========================================
     10. SiteSettings (global)
     ========================================= */
  console.log('⚙️  Обновляю настройки сайта...')
  try {
    await payload.updateGlobal({
      slug: 'site-settings',
      data: siteSettingsData,
    })
    console.log('  ✅ SiteSettings обновлены\n')
  } catch (err) {
    console.error('  ❌ SiteSettings:', (err as Error).message, '\n')
  }

  /* =========================================
     Итого
     ========================================= */
  console.log('━━━ SEED: Готово ━━━')
  console.log(`👤 Admin: ${adminId ? 'создан' : 'ошибка'}`)
  console.log(`📁 Категории: ${categoryMap.size}`)
  console.log(`🏷️  Теги: ${tagMap.size}`)
  console.log(`📖 Гайды: ${guidesCreated}`)
  console.log(`🔧 Инструменты: ${toolsCreated}`)
  console.log(`📄 Страницы: ${pagesCreated}`)
  console.log(`❓ Вопросы: ${questionsCreated}`)
  console.log(`💬 Ответы: ${answersCreated}`)
  console.log(`🧭 Navigation: обновлена`)
  console.log(`⚙️  SiteSettings: обновлены`)
  console.log('\nВсе записи созданы со статусом published.')
  console.log('Админка: /admin\n')

  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
