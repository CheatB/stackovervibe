# Stackovervibe — Tech-Spec

## Статус
Черновик. Ожидает согласования.

---

## 1. Стек технологий

| Компонент | Решение | Почему |
|-----------|---------|--------|
| Фреймворк | **Next.js 15 (App Router)** | SSR/SSG/ISR — гибкий рендеринг под SEO. React экосистема. Metadata API для SEO из коробки |
| CMS | **Payload CMS 3.x** | Встраивается в Next.js (один проект, один деплой). Rich-editor (Lexical), роли, access control, REST API — всё из коробки |
| БД | **PostgreSQL 16** | Надёжная, бесплатная, полнотекстовый поиск, нативная поддержка Payload |
| ORM | **Drizzle** (через Payload) | Payload использует Drizzle под капотом с PostgreSQL — type-safe запросы |
| Стили | **Tailwind CSS 4** + кастомный CSS | Быстрая вёрстка, хорошо для тёмной темы. Глитч/CRT/неон — отдельные CSS-анимации |
| Язык | **TypeScript** | Типизация, автодополнение, меньше багов |
| Rich-editor (CMS) | **Lexical** (через Payload) | Встроен в Payload, кастомные блоки кода, медиа |
| Rich-editor (UGC) | **Простой Markdown-редактор** | Для пользовательских постов — легковесный, с превью и вставкой кода |
| Поиск | **PostgreSQL Full-Text Search** | Для MVP достаточно. При росте → MeiliSearch |
| Авторизация | **Telegram Login Widget** + Payload Auth | Виджет на странице, данные проверяются на сервере, сессия через Payload |
| Аналитика | **Yandex.Metrika** + **Google Analytics 4** | Подключаются скриптами, без зависимостей |
| Контейнеризация | **Docker + Docker Compose** | App + PostgreSQL в контейнерах |
| Веб-сервер | **Nginx** | Reverse proxy, SSL, кэширование статики, gzip |
| SSL | **Let's Encrypt (certbot)** | Бесплатный, автообновление |
| Менеджер пакетов | **pnpm** | Быстрый, экономит место |

---

## 2. Архитектура

### Общая схема

```
[Браузер] → [Nginx :443] → [Next.js + Payload :3000] → [PostgreSQL :5432]
                                                        → [Файловая система (uploads)]
```

Одно приложение, один контейнер (Next.js + Payload CMS), одна БД.

### Структура проекта

```
stackovervibe/
├── src/
│   ├── app/                    # Next.js App Router — страницы
│   │   ├── (frontend)/         # Публичные страницы
│   │   │   ├── page.tsx        # Главная (лендинг)
│   │   │   ├── path/           # Путь новичка
│   │   │   ├── tools/          # Каталог инструментов
│   │   │   ├── posts/          # Пользовательские посты
│   │   │   ├── framework/      # Описание фреймворка
│   │   │   ├── search/         # Поиск
│   │   │   ├── profile/        # Профили пользователей
│   │   │   ├── auth/           # Telegram авторизация
│   │   │   └── privacy/        # Политика конфиденциальности
│   │   ├── (payload)/          # Payload Admin UI
│   │   │   └── admin/          # CMS-панель (/admin)
│   │   ├── api/                # API routes
│   │   │   ├── [...payload]/   # Payload REST API
│   │   │   ├── search/         # Эндпоинт поиска
│   │   │   ├── reactions/      # Лайки/дизлайки
│   │   │   └── auth/telegram/  # Telegram auth callback
│   │   ├── layout.tsx          # Root layout (тёмная тема, шрифты, аналитика)
│   │   └── sitemap.ts          # Динамический sitemap.xml
│   ├── collections/            # Payload collections (модели данных)
│   │   ├── Users.ts
│   │   ├── Guides.ts
│   │   ├── Tools.ts
│   │   ├── Posts.ts
│   │   ├── Comments.ts
│   │   ├── Categories.ts
│   │   ├── Tags.ts
│   │   ├── Media.ts
│   │   └── Pages.ts
│   ├── globals/                # Payload globals
│   │   ├── SiteSettings.ts
│   │   └── Navigation.ts
│   ├── components/             # React-компоненты
│   │   ├── layout/             # Header, Footer, Sidebar
│   │   ├── ui/                 # Кнопки, карточки, инпуты
│   │   ├── content/            # CodeBlock, RichText renderer
│   │   ├── effects/            # Глитч, CRT, неон, ASCII-арт
│   │   ├── seo/                # MetaTags, JsonLd, OpenGraph
│   │   └── social/             # Comments, Reactions, ShareButtons
│   ├── lib/                    # Утилиты
│   │   ├── telegram.ts         # Проверка Telegram auth
│   │   ├── search.ts           # Полнотекстовый поиск
│   │   └── seo.ts              # SEO-хелперы
│   └── styles/                 # Глобальные стили
│       ├── globals.css         # Tailwind + кастомные стили
│       └── effects.css         # CRT, глитч, неон анимации
├── public/                     # Статические файлы
│   ├── fonts/                  # Шрифты
│   ├── ascii/                  # ASCII-арт ассеты
│   └── downloads/              # Скачиваемые конфиги (статические)
├── payload.config.ts           # Конфиг Payload CMS
├── next.config.ts              # Конфиг Next.js
├── tailwind.config.ts          # Конфиг Tailwind
├── docker-compose.yml
├── Dockerfile
├── nginx/
│   └── stackovervibe.conf
├── .env.example
└── package.json
```

---

## 3. Модели данных (Payload Collections)

### 3.1. Users (auth collection)

| Поле | Тип | Описание |
|------|-----|----------|
| email | email | Обязательно (Payload auth требует), авто-генерируем из telegramId |
| telegramId | number | ID пользователя в Telegram (unique) |
| telegramUsername | text | Username из Telegram |
| displayName | text | Отображаемое имя из Telegram |
| avatarUrl | text | URL аватарки из Telegram |
| role | select | admin / user |
| isBanned | checkbox | Забанен ли |
| bio | textarea | Описание (опционально) |

Роли:
- **admin** — полный доступ к CMS, модерация, управление
- **user** — создание постов, комментирование

### 3.2. Guides (гайды — путь новичка + статьи)

| Поле | Тип | Описание |
|------|-----|----------|
| title | text | Заголовок |
| slug | text | URL-слаг (unique) |
| content | richText | Контент (Lexical editor) |
| excerpt | textarea | Краткое описание (для карточек и SEO) |
| category | relationship → Categories | Категория |
| pathOrder | number | Порядковый номер в "пути новичка" (0 = не входит) |
| seoTitle | text | Кастомный SEO-заголовок |
| seoDescription | textarea | Кастомное SEO-описание |
| ogImage | upload → Media | Картинка для соцсетей |
| likes | number | Счётчик лайков |
| dislikes | number | Счётчик дизлайков |
| status | select | draft / published |
| publishedAt | date | Дата публикации |

### 3.3. Tools (каталог инструментов)

| Поле | Тип | Описание |
|------|-----|----------|
| title | text | Название инструмента |
| slug | text | URL-слаг (unique) |
| toolType | select | skill / hook / command / rule |
| description | richText | Полное описание |
| shortDescription | textarea | Краткое описание (для карточек) |
| code | code / textarea | Основной код инструмента |
| installGuide | richText | Инструкция по установке |
| commonProblems | richText | Частые проблемы и решения |
| githubUrl | text | Ссылка на GitHub (опционально) |
| downloadFiles | upload → Media (hasMany) | Скачиваемые файлы |
| category | relationship → Categories | Категория |
| tags | relationship → Tags (hasMany) | Теги |
| seoTitle | text | SEO-заголовок |
| seoDescription | textarea | SEO-описание |
| likes | number | Счётчик лайков |
| dislikes | number | Счётчик дизлайков |
| status | select | draft / published |
| publishedAt | date | Дата публикации |

Специфичные поля в зависимости от toolType (условные группы):
- **skill**: workflow, примеры использования
- **hook**: триггер (PreToolUse / PostToolUse / Stop), условие, команда
- **command**: синтаксис вызова, аргументы
- **rule**: область применения, приоритет

### 3.4. Posts (UGC — пользовательские посты)

| Поле | Тип | Описание |
|------|-----|----------|
| title | text | Заголовок |
| slug | text | URL-слаг (auto-generated, unique) |
| content | richText | Контент (упрощённый editor на фронте, Lexical в CMS) |
| author | relationship → Users | Автор |
| category | relationship → Categories | Категория |
| tags | relationship → Tags (hasMany) | Теги |
| status | select | draft / pending / published / rejected |
| rejectionReason | select | spam / low_quality / duplicate / off_topic / harmful |
| rejectionComment | textarea | Комментарий модератора |
| likes | number | Счётчик лайков |
| dislikes | number | Счётчик дизлайков |
| seoTitle | text | Auto-generated из title |
| seoDescription | textarea | Auto-generated из контента |
| publishedAt | date | Дата публикации (при одобрении) |

Access control:
- **read**: published — все; draft/pending — только автор; rejected — автор + admin
- **create**: авторизованные пользователи (не забаненные)
- **update**: автор (пока статус draft или pending); admin — всегда
- **delete**: admin

### 3.5. Comments

| Поле | Тип | Описание |
|------|-----|----------|
| text | textarea | Текст комментария |
| author | relationship → Users | Автор |
| contentType | select | guide / tool / post |
| contentId | text | ID страницы (полиморфная связь) |

Access control:
- **read**: все
- **create**: авторизованные (не забаненные)
- **update**: автор (первые 15 минут)
- **delete**: admin

### 3.6. Categories

| Поле | Тип | Описание |
|------|-----|----------|
| title | text | Название категории |
| slug | text | URL-слаг |
| description | textarea | Описание |

### 3.7. Tags

| Поле | Тип | Описание |
|------|-----|----------|
| title | text | Название тега |
| slug | text | URL-слаг |

### 3.8. Media

Стандартная Payload media collection:
- Изображения (webp, jpg, png)
- Файлы для скачивания (json, yaml, md, txt, zip)
- Auto-resize для изображений (thumbnail, card, og)

### 3.9. Pages (статические страницы)

| Поле | Тип | Описание |
|------|-----|----------|
| title | text | Заголовок |
| slug | text | URL-слаг |
| content | richText | Контент |
| seoTitle | text | SEO-заголовок |
| seoDescription | textarea | SEO-описание |

Для: политика конфиденциальности, описание фреймворка, about.

### Globals

**SiteSettings**: название сайта, описание, лого, favicon, ID метрики/аналитики.

**Navigation**: главное меню, футер.

---

## 4. Маршрутизация и рендеринг

| Маршрут | Рендеринг | Описание |
|---------|-----------|----------|
| `/` | SSG | Главная — лендинг |
| `/path` | SSG | Путь новичка — список шагов |
| `/path/[slug]` | SSG (ISR) | Отдельный шаг пути |
| `/tools` | SSG (ISR) | Каталог инструментов (фильтры: type, category) |
| `/tools/[slug]` | SSG (ISR) | Отдельный инструмент |
| `/posts` | ISR (60s) | Все посты (с пагинацией) |
| `/posts/[slug]` | ISR (60s) | Отдельный пост |
| `/posts/new` | SSR (auth) | Создать пост (форма с editor) |
| `/posts/[slug]/edit` | SSR (auth) | Редактировать пост |
| `/framework` | SSG | Описание фреймворка |
| `/search` | SSR | Полнотекстовый поиск |
| `/profile/[username]` | SSR | Профиль пользователя |
| `/auth/telegram` | SSR | Обработка Telegram auth |
| `/privacy` | SSG | Политика конфиденциальности |
| `/admin/*` | CSR | Payload CMS панель |
| `/api/*` | API | REST endpoints (Payload + кастомные) |

**ISR (Incremental Static Regeneration)**: страница генерируется статически, но обновляется в фоне через заданный интервал. Компромисс между скоростью и актуальностью.

---

## 5. SEO-стратегия

### 5.1. Техническое SEO

- **SSG/ISR** для всех контентных страниц — мгновенная загрузка
- **sitemap.xml** — динамическая генерация из всех published страниц
- **robots.txt** — разрешить индексацию всех публичных страниц, закрыть /admin, /api
- **Canonical URLs** на каждой странице
- **hreflang** — подготовка к будущей английской версии (пока только ru)

### 5.2. On-page SEO (каждая страница)

- `<title>`: "{Заголовок} — Stackovervibe" (60 символов макс.)
- `<meta description>`: уникальное описание (150-160 символов)
- Open Graph: og:title, og:description, og:image, og:url, og:type
- Twitter Card: summary_large_image
- JSON-LD: Article, HowTo, BreadcrumbList, WebSite (SearchAction)
- Семантическая вёрстка: h1-h6, article, nav, main, section
- Alt-тексты на всех изображениях
- Ленивая загрузка изображений (native `loading="lazy"`)

### 5.3. Контентное SEO

- Одна страница = один поисковой запрос (кластер)
- URL-структура: `/tools/claude-code-hooks-setup` (читаемые слаги на русском транслите)
- Хлебные крошки на всех внутренних страницах
- Внутренняя перелинковка: "связанные инструменты", "следующий шаг"
- Время загрузки < 2 секунды (Core Web Vitals)

### 5.4. Целевые запросы (примеры)

- "вайбкодинг", "как начать вайбкодить"
- "claude code настройка", "claude code хуки"
- "cursor настройка для вайбкодинга"
- "ai кодинг инструменты", "ии помощник программиста"

---

## 6. Дизайн-система

### 6.1. Цветовая палитра

```
Фон:         #0a0a0a (почти чёрный)
Фон карточек: #111111
Primary:     #00ff41 (matrix green — главный акцент)
Secondary:   #ff00ff (неон-маджента)
Accent:      #00ffff (циан)
Текст:       #e0e0e0 (светло-серый)
Текст muted: #888888
Danger:      #ff3333
Бордеры:     #1a1a1a
```

### 6.2. Типографика

- **Заголовки**: `'Space Mono'` или `'VT323'` — моноширинный, ретро
- **Основной текст**: `'Inter'` — читаемый, современный
- **Код**: `'JetBrains Mono'` — лигатуры, отличная читаемость кода

### 6.3. Визуальные эффекты

- **CRT-скенлайны**: полупрозрачный overlay с горизонтальными линиями
- **Глитч-эффект**: на заголовках при hover (CSS clip-path + transform)
- **Неоновое свечение**: box-shadow на карточках и кнопках
- **ASCII-арт**: декоративные элементы в шапке/подвале
- **Мигающий курсор**: в элементах типа "терминал"
- **Pixelated бордеры**: стилизованные рамки
- **Скенлайн-анимация**: при загрузке страницы — "сканирование" сверху вниз

### 6.4. Компоненты

- **Карточка инструмента**: тёмный фон, неоновый бордер, иконка типа, заголовок, описание
- **Блок кода**: терминал-стиль (зелёный текст на чёрном), кнопки "Копировать" / "Скачать"
- **Кнопки**: с неоновым свечением при hover, глитч на click
- **Навигация**: верхний бар в стиле терминала (> stackovervibe ~ $)
- **Footer**: ASCII-арт + ссылки
- **Хлебные крошки**: стиль файловой системы (~/path/to/page)

---

## 7. Авторизация через Telegram

### 7.1. Флоу

1. Пользователь нажимает "Войти через Telegram" на сайте
2. Открывается **Telegram Login Widget** (встроенный виджет от Telegram)
3. Пользователь подтверждает авторизацию в Telegram
4. Виджет возвращает данные: id, first_name, last_name, username, photo_url, auth_date, hash
5. Данные отправляются на `/api/auth/telegram`
6. Сервер **проверяет hash** через HMAC-SHA256 с bot token
7. Сервер создаёт/обновляет пользователя в Payload (Users collection)
8. Payload создаёт JWT-сессию
9. Пользователь авторизован

### 7.2. Telegram-бот

- Нужен бот для Login Widget (создать через @BotFather)
- Бот также используется для **уведомлений**: одобрение/отклонение постов
- Bot API: отправка сообщений пользователям

### 7.3. Безопасность

- Проверка hash обязательна (защита от подделки)
- Проверка auth_date (не старше 1 часа)
- JWT токены с коротким TTL (24 часа) + refresh
- Rate limiting на auth endpoint

---

## 8. Полнотекстовый поиск

### MVP: PostgreSQL FTS

```sql
-- Поисковой индекс (GIN) по заголовкам и контенту
CREATE INDEX idx_search ON guides USING GIN(
  to_tsvector('russian', title || ' ' || content)
);

-- Запрос
SELECT * FROM guides
WHERE to_tsvector('russian', title || ' ' || content)
  @@ plainto_tsquery('russian', 'хуки claude code');
```

Поиск по: Guides + Tools + Posts (union).

Endpoint: `GET /api/search?q=запрос&type=all|guides|tools|posts&page=1`

### После MVP: MeiliSearch

Если PostgreSQL FTS станет медленным или недостаточным — добавить MeiliSearch как отдельный контейнер. Синхронизация через Payload hooks (afterChange).

---

## 9. Лайки / дизлайки

### Механизм

- **Без авторизации** — анонимные реакции
- Дедупликация: fingerprint (hash IP + User-Agent) хранится в отдельной таблице `reactions`
- Клиент сохраняет голос в localStorage (UI-блокировка повторного нажатия)
- Сервер проверяет fingerprint и отклоняет дубли

### Endpoint

```
POST /api/reactions
Body: { contentType: "guide", contentId: "abc123", type: "like", fingerprint: "sha256..." }
Response: { likes: 42, dislikes: 3 }
```

---

## 10. Инфраструктура

### 10.1. Docker Compose

```yaml
services:
  app:
    build: .
    restart: unless-stopped
    ports:
      - "127.0.0.1:3000:3000"
    env_file: .env
    depends_on:
      postgres:
        condition: service_healthy
    volumes:
      - uploads:/app/uploads

  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: stackovervibe
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  pgdata:
  uploads:
```

### 10.2. Dockerfile

```dockerfile
FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

### 10.3. Nginx

```nginx
server {
    listen 443 ssl http2;
    server_name stackovervibe.ru www.stackovervibe.ru;

    ssl_certificate /etc/letsencrypt/live/stackovervibe.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/stackovervibe.ru/privkey.pem;

    # Gzip
    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;

    # Статика — долгий кэш
    location /_next/static/ {
        proxy_pass http://127.0.0.1:3000;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    # Uploads (медиа)
    location /uploads/ {
        proxy_pass http://127.0.0.1:3000;
        expires 30d;
    }

    # Всё остальное
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Redirect HTTP → HTTPS
server {
    listen 80;
    server_name stackovervibe.ru www.stackovervibe.ru;
    return 301 https://$server_name$request_uri;
}
```

---

## 11. Переменные окружения

```bash
# App
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://stackovervibe.ru
PAYLOAD_SECRET=<random-32-chars>

# Database
DATABASE_URL=postgresql://user:password@postgres:5432/stackovervibe
POSTGRES_USER=stackovervibe
POSTGRES_PASSWORD=<strong-password>

# Telegram
TELEGRAM_BOT_TOKEN=<bot-token-from-botfather>
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=<bot-username>

# Analytics
NEXT_PUBLIC_YANDEX_METRIKA_ID=<id>
NEXT_PUBLIC_GA_ID=<id>

# Admin
PAYLOAD_ADMIN_EMAIL=admin@stackovervibe.ru
PAYLOAD_ADMIN_PASSWORD=<strong-password>
```

---

## 12. Производительность и кэширование

- **SSG страницы**: генерируются на билде, мгновенная отдача
- **ISR**: revalidate каждые 60 секунд для динамичных страниц
- **Nginx**: кэш статики (365 дней для /_next/static/, 30 дней для медиа)
- **Изображения**: автоматический resize через Payload (thumbnail, card, og), формат WebP
- **Шрифты**: self-hosted (не Google Fonts), preload в head
- **JS bundle**: tree-shaking, dynamic imports для тяжёлых компонентов (эффекты)
- **Цель**: Lighthouse 90+ по всем метрикам

---

## 13. Безопасность

- **Input validation**: zod-схемы на всех API-эндпоинтах
- **CSRF**: Payload использует CSRF-токены
- **Rate limiting**: на auth, поиск, реакции, комментарии
- **Helmet**: security headers (CSP, X-Frame-Options, etc.)
- **SQL injection**: Drizzle ORM — параметризованные запросы
- **XSS**: React по умолчанию экранирует; Rich Text рендерится через санитайзер
- **Секреты**: только в .env, никогда в коде
- **Telegram auth**: проверка HMAC-SHA256 hash на сервере
- **CORS**: только stackovervibe.ru

---

## 14. Cookies и конфиденциальность

- Баннер cookies при первом визите
- Страница `/privacy` — политика конфиденциальности
- Аналитика подключается только после согласия (consent mode)

---

## 15. Этапы реализации (высокоуровневый план)

### Этап 1: Инфраструктура + Каркас (~2-3 часа)
- Инициализация Next.js + Payload CMS + PostgreSQL
- Docker Compose, Dockerfile
- Настройка Tailwind, шрифты, глобальные стили
- Базовый layout (шапка, подвал, навигация)
- Деплой на VPS (Nginx, SSL, DNS)

### Этап 2: Контентная часть (~3-4 часа)
- Collections: Guides, Tools, Categories, Tags, Media, Pages
- CMS-панель: кастомизация admin UI
- Страницы: главная, путь новичка, каталог инструментов, фреймворк
- Блоки кода: копирование, скачивание, подсветка синтаксиса
- Полнотекстовый поиск

### Этап 3: SEO (~1-2 часа)
- Metadata API на всех страницах
- JSON-LD structured data
- Sitemap.xml, robots.txt
- Open Graph изображения
- Хлебные крошки

### Этап 4: Дизайн-сессия (~2-3 часа)
- Ретро-хакерский дизайн (через frontend-design скилл)
- CRT/глитч/неон эффекты
- ASCII-арт элементы
- Адаптивная вёрстка (mobile-first)

### Этап 5: UGC + Социал (~3-4 часа)
- Telegram авторизация (бот + виджет + серверная проверка)
- Collection: Users, Posts, Comments
- Фронт: создание/редактирование постов (Markdown editor)
- Модерация в CMS (одобрение/отклонение)
- Уведомления через TG-бота
- Лайки/дизлайки
- Комментарии
- Профили пользователей
- Кнопки шаринга

### Этап 6: Аналитика + Финал (~1 час)
- Yandex.Metrika + Google Analytics
- Cookies-баннер
- Политика конфиденциальности
- Финальное тестирование
- Наполнение первичным контентом

**Итого: ~12-17 часов работы**

---

## Решения и альтернативы

| Решение | Выбрано | Альтернатива | Почему так |
|---------|---------|-------------|-----------|
| CMS | Payload 3.x | Strapi, WordPress, custom | Один проект с Next.js, TypeScript, бесплатный |
| БД | PostgreSQL | MongoDB, SQLite | FTS из коробки, Payload поддерживает, надёжная |
| Стили | Tailwind | CSS Modules, styled-components | Быстрая вёрстка, хорошая экосистема |
| UGC editor | Markdown | Lexical, TipTap | Простой, достаточный для кода + текст |
| Поиск | PostgreSQL FTS | MeiliSearch, Algolia | Бесплатно, достаточно для MVP |
| Auth | Telegram Widget | NextAuth, custom OAuth | Целевая аудитория в TG, простая интеграция |
| Деплой | Docker + Nginx | Vercel, Railway | Свой VPS, полный контроль, бесплатно |
