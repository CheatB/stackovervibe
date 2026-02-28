# Stackovervibe — Project Rules

База знаний по вайбкодингу. Ретро-хакерский стиль 80-х. SEO-first.

## Документация
- Обзор проекта → docs/project-knowledge/project.md
- Архитектура → docs/project-knowledge/architecture.md
- Паттерны → docs/project-knowledge/patterns.md
- Деплой → docs/project-knowledge/deployment.md
- Бэклог задач → docs/tasks.md
- Атомарные задачи → docs/tasks-detailed.md
- User-Spec → docs/user-spec.md
- Tech-Spec → docs/tech-spec.md

## Домен
stackovervibe.ru

## Ветка по умолчанию
main


## Setup

```bash
npm ci
npm run dev        # Payload + Next.js dev
npm run build      # Продакшен сборка
npm run lint       # ESLint
```

## Ключевые правила
- Язык контента: русский
- Дизайн: тёмная тема, ретро-хакер 80-х (Hackerman / Kung Fury)
- SEO — главный канал трафика, оптимизация на максимум
- CMS-панель с первой версии (для будущего UGC)
- Фреймворк переписывается — контент будет обновлённой версией
- Код, комментарии, переменные — на русском

---

## ПРОГРЕСС (обновляй после каждого блока!)

**Фаза:** 10 завершена + OpenClaw API доступ
**Этап:** Всё задеплоено
**Следующая задача:** —

### Фаза 10: Обогащение контента — ГОТОВО
- [x] 10.1 enrich-tools.ts — скрипт обновления через Payload local API
- [x] 10.2 content/skills.ts — 15 скиллов (1242 строки)
- [x] 10.3 content/hooks.ts — 14 хуков (1766 строк)
- [x] 10.4 content/commands.ts — 18 команд (1870 строк)
- [x] 10.5 content/guides.ts — 8 гайдов (1339 строк)
- [x] 10.6 TypeScript check — 0 ошибок
- [x] 10.7 Запуск enrich-tools.ts — 47/47 инструментов + 8/8 гайдов, 0 ошибок
- [x] 10.8 Проверка рендера — stackovervibe.ru 200 OK, страницы отдают контент
- [x] 10.9 Коммит + деплой на прод (CI/CD 2m10s, enrich на проде 47/47 + 8/8)

### Фаза 11: REST API + OpenClaw интеграция — ГОТОВО
- [x] 11.1 Fix REST API 500 — serverURL + rename [...payload] → [...slug]
- [x] 11.2 API-ключи (useAPIKey) в Users коллекции
- [x] 11.3 Пользователь openclaw@stackovervibe.ru (ID 4, admin, API key)
- [x] 11.4 Инструкция на OpenClaw: ~/.claude/rules/stackovervibe-api.md (206 строк)
- [x] 11.5 API key в ~/.env на OpenClaw

### Выполнено:
- [x] 1.1 Инициализация проекта (1.1.1–1.1.5)
- [x] 1.2 Docker (1.2.1–1.2.3 — контейнеры работают, app + postgres)
- [x] 1.3 Tailwind + шрифты + стили (1.3.1–1.3.5)
- [x] 1.4 Базовый layout (1.4.1–1.4.4)
- [x] 1.5 Git + GitHub (init, коммит, repo, push)
- [x] 1.6.2 Nginx конфиг (HTTP-only, установлен в sites-enabled)
- [x] 1.6.4 Nginx проксирует на :3000
- [x] 2.1 Categories + Tags (досрочно)
- [x] 2.2 Media (досрочно)
- [x] 2.3 Guides коллекция (досрочно)
- [x] 2.4 Tools коллекция (досрочно)
- [x] 2.7 Pages коллекция (досрочно)
- [x] Globals: Navigation, SiteSettings (досрочно)

- [x] 1.6.1 DNS A-запись stackovervibe.ru → 109.172.36.108
- [x] 1.6.3 certbot SSL (Let's Encrypt, auto-renew)
- [x] 1.6.5 Docker containers running (app + postgres)
- [x] 1.6.6 https://stackovervibe.ru — работает!

- [x] 2.8 RichTextRenderer (Lexical → React)
- [x] 2.9 CodeBlock (терминальный стиль, копирование, скачивание)
- [x] 2.10 Главная страница (hero + блоки)
- [x] 2.11 Путь новичка (/path + карточки)
- [x] 2.12 Шаг пути (/path/[slug] + prev/next навигация)
- [x] 2.13 Каталог инструментов (/tools + фильтры)
- [x] 2.14 Страница инструмента (/tools/[slug] + связанные)
- [x] 2.15 Фреймворк (/framework из CMS)
- [x] 2.16 Поиск (/search + API + поле в Header)

- [x] 3.1 SEO-хелпер generatePageMetadata (OG + Twitter Card)
- [x] 3.2 JSON-LD (WebSite + SearchAction, Article, HowTo, BreadcrumbList)
- [x] 3.3 sitemap.ts + robots.ts
- [x] 3.4 Open Graph (дефолтный og-default.png, OG в metadata)
- [x] 3.5 BreadcrumbNav (стиль ~/path/to/page) на всех страницах

- [x] 4.1 UI-компоненты (Button, Card, Input/Textarea, Badge, Select)
- [x] 4.2 Ретро-хакерский лендинг (ASCII-арт hero, блоки ~/path, Header terminal, Footer ASCII)
- [x] 4.3 CSS-эффекты (CRT-скенлайны, глитч, neon glow, мигающий курсор, typewriter, reduced-motion)
- [x] 4.4 Адаптивная вёрстка (mobile-first, бургер-меню [=]/[x], мобильные стили)

- [x] 5.1 Коллекция Posts (модерация, slug-транслитерация, TG-уведомления автору)
- [x] 5.2 Коллекция Comments (15-мин окно редактирования)
- [x] 5.3 Коллекция Reactions (дедупликация по fingerprint)
- [x] 5.4 API /api/auth/telegram (HMAC-SHA256, rate limit 10/мин, JWT httpOnly 7 дней)
- [x] 5.5 API /api/reactions (лайк/дизлайк с дедупликацией)
- [x] 5.6 API /api/comments (авторизация, бан-чек, валидация 2000 символов)
- [x] 5.7 lib/telegram.ts (верификация подписи) + telegram-bot.ts (уведомления)
- [x] 5.8 Страницы: /posts (листинг + пагинация), /posts/[slug], /profile/[username]
- [x] 5.9 Компоненты: ReactionButtons, CommentList, ShareButtons, TelegramLoginWidget
- [x] 5.10 Интеграция реакций/комментариев на /path/[slug] и /tools/[slug]

- [x] 6.1 Аналитика (YandexMetrika + GoogleAnalytics с consent check)
- [x] 6.2 Cookie-баннер (localStorage, один показ, принять/отклонить)
- [x] 6.3 Политика конфиденциальности (/privacy)

### Epic: SO-style Feed + Q&A (Фаза 7)
- [x] 7.1 Questions коллекция (status, closedAs, views, answersCount, likes, dislikes, slug, SEO)
- [x] 7.2 Answers коллекция (isAccepted, голоса, hookи для answersCount)
- [x] 7.3 Views API (/api/views, in-memory дедупликация по IP)
- [x] 7.4 Feed API (/api/feed, агрегация guides+tools+questions+posts)
- [x] 7.5 Tags расширены (description, SEO-поля)
- [x] 7.6 Reactions/Comments расширены (question/answer типы)
- [x] 7.7 Shared утилиты (транслит → utils.ts, дата → date.ts, auth → auth.ts)
- [x] 7.8 Компоненты: FeedCard, FeedFilters, InfiniteScroll, Sidebar
- [x] 7.9 MarkdownEditor + AnswerCard + ViewsTracker
- [x] 7.10 Главная переделана (ASCII лого → фильтры → лента + сайдбар)
- [x] 7.11 Q&A: /questions (список), /questions/ask, /questions/[slug] (вопрос+ответы)
- [x] 7.12 Q&A: /questions/[slug]/edit, API закрытия/принятия ответа
- [x] 7.13 Tag pages: /tags/[slug]
- [x] 7.14 SEO: JSON-LD QAPage, canonical URL, sitemap (questions/posts/tags)
- [x] 7.15 Search расширен (questions + posts)
- [x] 7.16 Navigation обновлена (header + footer + mobile)
- [x] 7.17 ViewsTracker на path/[slug], tools/[slug], posts/[slug], questions/[slug]
- [x] 7.18 Docker build + deploy на VPS
- [x] 7.19 Payload миграции (Questions + Answers + новые поля)

### Фаза 8: React Bits анимации
- [x] 8.1 Установка зависимостей (motion, gsap, ogl)
- [x] 8.2 14 анимационных компонентов (DecryptedText, GlitchText, ClickSpark, Noise, FaultyTerminal, AnimatedContent, BlurText, StarBorder, ElectricBorder, CountUp, ScrollVelocity, PixelTransition, GridMotion, TextCursor)
- [x] 8.3 CSS: StarBorder keyframes, GlitchText .glitching, reduced-motion правила
- [x] 8.4 Интеграция: HeroSection (GlitchText+DecryptedText+FaultyTerminal), LayoutEffects (ClickSpark+Noise), SidebarStats (CountUp), AnimatedContent на PathStepCard/ToolCard, BlurText на заголовках, ScrollVelocity на главной, ElectricBorder на CTA, FooterGrid (GridMotion)
- [x] 8.5 TypeScript check + Docker build — пройдены

### Фаза 9: Frameworks UGC-каталог AI-методологий
- [x] 9.1 Коллекция Frameworks (title, slug, description, body, author, tags, stack, level, githubUrl, status, views, likes, dislikes, downloads)
- [x] 9.2 Reactions + Comments расширены типом 'framework'
- [x] 9.3 API: POST /api/frameworks, PUT /api/frameworks/[id], POST /api/frameworks/[id]/download
- [x] 9.4 lexical-to-markdown.ts — конвертер Lexical AST → Markdown
- [x] 9.5 Data layer: getFrameworks, getFrameworkBySlug, getPopularFrameworks, getUserFrameworks, getSiteStats + frameworks
- [x] 9.6 Feed: getFeedPage + frameworks, FeedItem type 'framework' + downloads
- [x] 9.7 Страницы: /framework (листинг), /framework/create, /framework/[slug] (детали + JSON-LD), /framework/[slug]/edit
- [x] 9.8 DownloadButton — скачивание .md с подсказкой "Закинь в Claude, Cursor или любой AI"
- [x] 9.9 FeedCard + FeedFilters — framework тип, downloads вместо answers
- [x] 9.10 Search API — поиск frameworks (title + description)
- [x] 9.11 Sitemap — frameworks URLs
- [x] 9.12 Sidebar — описание "AI-методологии", SidebarStats + frameworks count
- [x] 9.13 Profile — секция "Фреймворки" + счётчик
- [x] 9.14 Views + Reactions API — framework тип
- [x] 9.15 Миграция Payload (20260227_182730)
- [x] 9.16 TypeScript 0 ошибок, Docker build pass

### Деплой
- [x] .env восстановлен на проде (109.172.36.108)
- [x] Docker containers запущены на проде
- [x] https://stackovervibe.ru — 200 OK с SSL

### Не сделано:
- [ ] 6.4 Финальное тестирование (Lighthouse, broken links, mobile, SEO)
- [ ] 6.5 Первичный контент (категории, теги, гайды, инструменты — через CMS)
- [ ] og-default.png заменить на реальную картинку 1200x630

---

## Workflow: начало каждой сессии

1. Прочитай ЭТОТ ФАЙЛ — секцию ПРОГРЕСС
2. Прочитай docs/tasks-detailed.md — найди следующую задачу
3. Начни работу с первой незавершённой задачи
4. После каждого блока (1.X):
   - Коммит с описательным сообщением
   - Обнови секцию ПРОГРЕСС в этом файле
   - Предложи clear если контекст >70%

## Compaction Rules
При сжатии контекста ОБЯЗАТЕЛЬНО сохранять:
- Секцию ПРОГРЕСС целиком
- Номер следующей задачи
- Что именно делали в текущей сессии
- Принятые решения и ПОЧЕМУ
