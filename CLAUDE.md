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

## Ключевые правила
- Язык контента: русский
- Дизайн: тёмная тема, ретро-хакер 80-х (Hackerman / Kung Fury)
- SEO — главный канал трафика, оптимизация на максимум
- CMS-панель с первой версии (для будущего UGC)
- Фреймворк переписывается — контент будет обновлённой версией
- Код, комментарии, переменные — на русском

---

## ПРОГРЕСС (обновляй после каждого блока!)

**Фаза:** 5 — Выполнение
**Этап:** 1 — Инфраструктура + Каркас
**Следующая задача:** 6.4-6.5 (требует деплой) или деплой на VPS

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

### Заблокировано (ждёт DNS):
- [ ] 1.6.1 DNS A-запись stackovervibe.ru → 109.172.36.108 (Иван настраивает)
- [ ] 1.6.3 certbot SSL (после DNS)
- [ ] 1.6.6 Проверка https://stackovervibe.ru

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

### Не сделано (требует деплой/CMS):
- [ ] 6.4 Финальное тестирование (Lighthouse, broken links, mobile, SEO — после деплоя)
- [ ] 6.5 Первичный контент (категории, теги, гайды, инструменты — через CMS после деплоя)
- [ ] og-default.png заменить на реальную картинку 1200x630

---

## Workflow: начало каждой сессии

1. Прочитай ЭТОТ ФАЙЛ — секцию ПРОГРЕСС
2. Прочитай docs/tasks-detailed.md — найди следующую задачу
3. Начни работу с первой незавершённой задачи
4. После каждого блока (1.X):
   - Коммит с описательным сообщением
   - Обнови секцию ПРОГРЕСС в этом файле
   - Предложи `/clear` если контекст >70%

## Compaction Rules
При сжатии контекста ОБЯЗАТЕЛЬНО сохранять:
- Секцию ПРОГРЕСС целиком
- Номер следующей задачи
- Что именно делали в текущей сессии
- Принятые решения и ПОЧЕМУ
