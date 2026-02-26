import { heading, paragraph, list, quote, codeBlock, root } from './lexical'

/** Тип данных инструмента для seed */
export interface ToolData {
  title: string
  slug: string
  toolType: 'skill' | 'hook' | 'command' | 'rule' | 'plugin'
  shortDescription: string
  categorySlug: string
  tagSlugs: string[]
  description: ReturnType<typeof root>
  /** Доп. поля по типу */
  extra?: Record<string, unknown>
}

/* =====================================================
   СКИЛЛЫ (15 шт.)
   ===================================================== */

const skills: ToolData[] = [
  {
    title: 'Aiogram Bot',
    slug: 'aiogram-bot',
    toolType: 'skill',
    shortDescription: 'Создание Telegram-ботов на Aiogram v3 с Docker, PostgreSQL и админ-панелью',
    categorySlug: 'skills',
    tagSlugs: ['telegram', 'python', 'docker'],
    description: root([
      heading(2, 'Что делает'),
      paragraph('Скилл для создания профессиональных Telegram-ботов на **Aiogram v3**. Включает шаблон проекта, FSM-состояния, inline-клавиатуры, миграции Alembic и деплой через Docker.'),
      heading(2, 'Workflow'),
      list([
        'Клонировать starter kit',
        'Инициализировать проект: `make init-project`',
        'Создать хендлеры с роутерами',
        'Настроить миграции БД (Alembic)',
        'Сконфигурировать админ-функции',
        'Задеплоить через Docker',
      ]),
      heading(2, 'Стек'),
      list(['aiogram 3.20+', 'PostgreSQL + SQLAlchemy + Alembic', 'Docker + docker-compose', 'Redis (опционально, для FSM)']),
    ]),
    extra: {
      skillFields: {
        workflow: root([paragraph('Клон стартера → init → хендлеры → миграции → деплой.')]),
        examples: root([paragraph('Бот для учёта расходов, бот-помощник с AI, информационный бот с рассылками.')]),
      },
    },
  },
  {
    title: 'API Design',
    slug: 'api-design',
    toolType: 'skill',
    shortDescription: 'Проектирование REST/WebSocket API с версионированием и OpenAPI документацией',
    categorySlug: 'skills',
    tagSlugs: ['typescript', 'python', 'kachestvo-koda'],
    description: root([
      heading(2, 'Что делает'),
      paragraph('Проектирование REST и WebSocket API по лучшим практикам: ресурсно-ориентированные URL, версионирование, пагинация, валидация, OpenAPI-документация.'),
      heading(2, 'Ключевые принципы'),
      list([
        'Ресурсно-ориентированные URL (`/api/v1/users/:id`)',
        'HTTP-методы по назначению (GET читает, POST создаёт)',
        'Offset и cursor-based пагинация',
        'Валидация через Pydantic / Zod',
        'Rate limiting на публичных эндпоинтах',
        'OpenAPI/Swagger документация',
      ]),
    ]),
    extra: {
      skillFields: {
        workflow: root([paragraph('Определить ресурсы → URL-структура → формат ответов → валидация → документация → rate limiting.')]),
      },
    },
  },
  {
    title: 'Управление бэклогом',
    slug: 'backlog-management',
    toolType: 'skill',
    shortDescription: 'Управление бэклогом проекта: приоритизация, трекинг задач, интеграция с workflow',
    categorySlug: 'skills',
    tagSlugs: ['claude-code', 'avtomatizaciya'],
    description: root([
      heading(2, 'Что делает'),
      paragraph('Организация бэклога проекта с приоритизацией по бизнес-ценности. Задачи ранжируются по размеру (S/M/L) и приоритету (critical/high/medium/low).'),
      heading(2, 'Workflow'),
      list([
        'Организовать задачи по приоритету',
        'Оценить по бизнес-ценности + зависимости',
        'Выбрать следующую задачу',
        'Отметить выполненную',
        'Обновить project knowledge',
      ]),
    ]),
    extra: {
      skillFields: {
        workflow: root([paragraph('Приоритизация → выбор → выполнение → отметка → обновление.')]),
      },
    },
  },
  {
    title: 'Code Writing (TDD)',
    slug: 'code-writing',
    toolType: 'skill',
    shortDescription: 'Универсальные паттерны качественного кода: структура, именование, ошибки, документация',
    categorySlug: 'skills',
    tagSlugs: ['kachestvo-koda', 'testirovanie'],
    description: root([
      heading(2, 'Что делает'),
      paragraph('Скилл определяет паттерны написания качественного кода: структура файлов, именование переменных на русском (snake_case), docstrings, обработка ошибок, dependency injection.'),
      heading(2, 'Правила'),
      list([
        'Функции < 50 строк, файлы < 500 строк',
        'Именование на русском snake_case',
        'Early return + guard clauses',
        'Dependency injection вместо хардкода',
        'Docstrings на русском',
        'TDD-цикл: тесты → код → рефакторинг',
      ]),
    ]),
    extra: {
      skillFields: {
        workflow: root([paragraph('Структура файла → именование → docstrings → обработка ошибок → TDD.')]),
      },
    },
  },
  {
    title: 'Docker Deploy',
    slug: 'docker-deploy',
    toolType: 'skill',
    shortDescription: 'Docker-инфраструктура: docker-compose, Dockerfile, Nginx, SSL, health checks',
    categorySlug: 'skills',
    tagSlugs: ['docker', 'deploj'],
    description: root([
      heading(2, 'Что делает'),
      paragraph('Настройка полной Docker-инфраструктуры для деплоя: multi-stage Dockerfile, docker-compose с health checks, Nginx reverse proxy, SSL-сертификаты.'),
      heading(2, 'Workflow'),
      list([
        'Создать multi-stage Dockerfile',
        'Написать docker-compose с health checks',
        'Настроить Nginx reverse proxy',
        'Настроить SSL-сертификаты (Let\'s Encrypt)',
        'Добавить health check endpoints',
        'Мониторинг через docker stats',
      ]),
      heading(2, 'Правила'),
      list([
        '`restart: unless-stopped` для всех сервисов',
        '`depends_on` с `service_healthy`',
        'Никаких хардкоженных секретов — только .env',
        'Всегда указывать версии образов',
      ]),
    ]),
    extra: {
      skillFields: {
        workflow: root([paragraph('Dockerfile → docker-compose → Nginx → SSL → health checks → мониторинг.')]),
      },
    },
  },
  {
    title: 'Feature Execution',
    slug: 'feature-execution',
    toolType: 'skill',
    shortDescription: 'Полный pipeline реализации фичи: контекст → план → TDD → quality gates → коммит',
    categorySlug: 'skills',
    tagSlugs: ['claude-code', 'kachestvo-koda', 'avtomatizaciya'],
    description: root([
      heading(2, 'Что делает'),
      paragraph('Оркестрация полного цикла реализации фичи от чтения контекста до коммита. Team lead распределяет задачи, проверяет чекпоинты между блоками, запускает quality gates.'),
      heading(2, 'Workflow'),
      list([
        'Загрузить project knowledge',
        'Спланировать блоки с зависимостями',
        'Написать тесты (TDD)',
        'Реализовать код',
        'Anti-mirage check',
        'Quality gate review',
        'Коммит с conventional commits',
      ]),
    ]),
    extra: {
      skillFields: {
        workflow: root([paragraph('Контекст → план → TDD → код → anti-mirage → quality gate → коммит.')]),
      },
    },
  },
  {
    title: 'Frontend Design',
    slug: 'frontend-design',
    toolType: 'skill',
    shortDescription: 'Принципы веб-UI: типографика, цвета, layout, accessibility, Tailwind CSS',
    categorySlug: 'skills',
    tagSlugs: ['typescript', 'kachestvo-koda'],
    description: root([
      heading(2, 'Что делает'),
      paragraph('Гайд по проектированию веб-интерфейсов: типографика (2-3 шрифта), цветовые палитры через CSS-переменные, mobile-first layout, компонентная доступность (a11y), Tailwind CSS утилиты.'),
      heading(2, 'Ключевые правила'),
      list([
        'Тач-таргеты минимум 44x44px',
        'Контрастность минимум 4.5:1',
        'Flexbox/Grid для лейаутов',
        'CSS-переменные для цветов',
        'Mobile-first подход',
      ]),
    ]),
    extra: {
      skillFields: {
        workflow: root([paragraph('Типографика → цвета → layout → accessibility → Tailwind утилиты.')]),
      },
    },
  },
  {
    title: 'Interface Design',
    slug: 'interface-design',
    toolType: 'skill',
    shortDescription: 'Проектирование дашбордов, админ-панелей, SaaS-приложений и интерактивных инструментов',
    categorySlug: 'skills',
    tagSlugs: ['typescript', 'kachestvo-koda'],
    description: root([
      heading(2, 'Что делает'),
      paragraph('Скилл для проектирования сложных интерфейсов: дашборды, админ-панели, SaaS-приложения. Для лендингов и маркетинговых страниц используй Frontend Design.'),
    ]),
    extra: {
      skillFields: {
        workflow: root([paragraph('Анализ задачи → wireframe → компоненты → стили → интерактив.')]),
      },
    },
  },
  {
    title: 'New Project',
    slug: 'new-project-skill',
    toolType: 'skill',
    shortDescription: 'Полное создание проекта: анализ → user-spec → tech-spec → задачи → TDD-реализация',
    categorySlug: 'skills',
    tagSlugs: ['claude-code', 'avtomatizaciya'],
    description: root([
      heading(2, 'Что делает'),
      paragraph('Комплексный скилл для создания проекта с нуля. 8 фаз: сбор контекста, бизнес-brainstorming (субагент), user-spec, tech-spec, декомпозиция, TDD-реализация, Git/Deploy, документация.'),
      heading(2, 'Философия'),
      quote('2 часа планирования экономят 2 дня переделок.'),
      heading(2, 'Ключевые артефакты'),
      list([
        'docs/context.md — контекст проекта',
        'docs/user-spec.md — пользовательская спецификация',
        'docs/tech-spec.md — техническая спецификация',
        'docs/tasks.md — атомарные задачи',
        'DECISIONS.md — лог архитектурных решений',
      ]),
    ]),
    extra: {
      skillFields: {
        workflow: root([paragraph('Контекст → brainstorm → user-spec → tech-spec → задачи → TDD → деплой → docs.')]),
      },
    },
  },
  {
    title: 'Project Knowledge',
    slug: 'project-knowledge',
    toolType: 'skill',
    shortDescription: 'Навигатор по документации проекта: архитектура, паттерны, деплой, UX',
    categorySlug: 'skills',
    tagSlugs: ['claude-code'],
    description: root([
      heading(2, 'Что делает'),
      paragraph('Навигатор по документации проекта. Указывает, где что лежит: project.md для обзора, architecture.md для стека, patterns.md для правил, deployment.md для операционки.'),
      heading(2, 'Файлы'),
      list([
        '**project.md** — обзор проекта, аудитория, фичи',
        '**architecture.md** — стек, структура, зависимости',
        '**patterns.md** — паттерны и правила проекта',
        '**deployment.md** — деплой, мониторинг, env vars',
        '**ux-guidelines.md** — UI-гайдлайны (если есть)',
      ]),
    ]),
    extra: {
      skillFields: {
        workflow: root([paragraph('Читай project.md → architecture.md → patterns.md → deployment.md по необходимости.')]),
      },
    },
  },
  {
    title: 'Project Launcher',
    slug: 'project-launcher',
    toolType: 'skill',
    shortDescription: 'Системный запуск проекта: 10 шагов от инициализации до мониторинга',
    categorySlug: 'skills',
    tagSlugs: ['claude-code', 'avtomatizaciya'],
    description: root([
      heading(2, 'Что делает'),
      paragraph('Систематический запуск проекта через 10 шагов: INIT → CONTEXT → BRAINSTORM → USER-SPEC → TECH-SPEC → TASKS → TDD → DEPLOY → MONITORING → DOCS.'),
      heading(2, 'Особенности'),
      list([
        'Параллельная разработка (2-5 задач)',
        'structure.lock для контроля директорий',
        'Second Brain для хранения спецификаций',
        'Git-коммит после каждой задачи',
      ]),
    ]),
    extra: {
      skillFields: {
        workflow: root([paragraph('INIT → CONTEXT → BRAINSTORM → USER-SPEC → TECH-SPEC → TASKS → TDD → DEPLOY → MONITORING → DOCS.')]),
      },
    },
  },
  {
    title: 'Security Auditor',
    slug: 'security-auditor',
    toolType: 'skill',
    shortDescription: 'Аудит безопасности по OWASP: секреты, SQL injection, XSS, аутентификация, зависимости',
    categorySlug: 'skills',
    tagSlugs: ['bezopasnost', 'kachestvo-koda'],
    description: root([
      heading(2, 'Что делает'),
      paragraph('Комплексный аудит безопасности кода и инфраструктуры: поиск хардкоженных секретов, проверка SQL injection, XSS, валидации ввода, аутентификации, CORS, зависимостей.'),
      heading(2, 'Что проверяет'),
      list([
        'Хардкоженные секреты (grep по паттернам)',
        'SQL injection (параметризованные запросы)',
        'XSS (innerHTML vs textContent)',
        'Валидация ввода (Zod / Pydantic)',
        'Аутентификация и CORS',
        'Уязвимые зависимости (npm audit)',
        'Логирование без PII',
      ]),
    ]),
    extra: {
      skillFields: {
        workflow: root([paragraph('Секреты → SQL → XSS → валидация → auth/CORS → зависимости → логи.')]),
      },
    },
  },
  {
    title: 'Telegram Post Style',
    slug: 'telegram-post-style',
    toolType: 'skill',
    shortDescription: 'Стиль постов для Telegram-канала: живой, ироничный, с эмодзи и зачёркнутым текстом',
    categorySlug: 'skills',
    tagSlugs: ['telegram'],
    description: root([
      heading(2, 'Что делает'),
      paragraph('Написание постов для Telegram-канала в стиле «Не просто Чел»: заголовок 2-5 слов, личная история, эмодзи-буллеты, зачёркнутые шутки, рефлексия, вопрос аудитории.'),
      heading(2, 'Формат'),
      list([
        '800-1500 символов',
        'HTML-форматирование (<strong>, <s>, <em>)',
        'Разговорный тон с иронией',
        'Начинай с личной истории',
        'Заканчивай вопросом к аудитории',
      ]),
    ]),
    extra: {
      skillFields: {
        workflow: root([paragraph('Заголовок → личная история → буллеты → рефлексия → вопрос.')]),
      },
    },
  },
  {
    title: 'Testing',
    slug: 'testing-skill',
    toolType: 'skill',
    shortDescription: 'Методология тестирования: пирамида тестов, decision framework, стандарты качества',
    categorySlug: 'skills',
    tagSlugs: ['testirovanie', 'kachestvo-koda'],
    description: root([
      heading(2, 'Что делает'),
      paragraph('Методология тестирования для вайбкодера. Пирамида тестов (smoke → unit → integration → E2E), decision framework для выбора нужных тестов, стандарты качества.'),
      heading(2, 'Правила'),
      list([
        'Unit-тесты за миллисекунды, integration за секунды, E2E за минуты',
        'Мокай внешние зависимости в unit-тестах',
        'Покрытие > 80% для бизнес-логики',
        'Один тест = одна проверка',
        'Каждый тест оправдывает существование',
      ]),
    ]),
    extra: {
      skillFields: {
        workflow: root([paragraph('Определи уровень → smoke → unit → integration → E2E (по необходимости).')]),
      },
    },
  },
  {
    title: 'VPS Quick Setup',
    slug: 'vps-quick-setup',
    toolType: 'skill',
    shortDescription: 'Автоматизация настройки VPS: SSH-ключи, пользователь, интеграция с Claude Code',
    categorySlug: 'skills',
    tagSlugs: ['deploj', 'bezopasnost'],
    description: root([
      heading(2, 'Что делает'),
      paragraph('Быстрая автоматизированная настройка VPS: генерация SSH-ключей, создание init-скрипта, запуск через веб-консоль Beget, автодобавление IP в конфиг Claude.'),
      heading(2, 'Особенности'),
      list([
        'Идемпотентный скрипт (безопасно запускать повторно)',
        'Только SSH-авторизация по ключам',
        'Универсальный ключ для всех VPS',
        'Автоинтеграция с Claude Code',
      ]),
    ]),
    extra: {
      skillFields: {
        workflow: root([paragraph('SSH-ключи → init-скрипт → web-консоль Beget → IP → Claude конфиг.')]),
      },
    },
  },
]

/* =====================================================
   КОМАНДЫ (18 шт.)
   ===================================================== */

const commands: ToolData[] = [
  {
    title: '/autoformat',
    slug: 'autoformat',
    toolType: 'command',
    shortDescription: 'Автоформатирование кода: Prettier для JS/TS, Black для Python, gofmt для Go',
    categorySlug: 'commands',
    tagSlugs: ['kachestvo-koda', 'avtomatizaciya'],
    description: root([
      heading(2, 'Что делает'),
      paragraph('Запускает автоформатирование кода подходящим форматером: Prettier для JS/TS, Black + isort для Python, gofmt для Go, cargo fmt для Rust.'),
    ]),
    extra: { commandFields: { syntax: '/autoformat [путь]', args: 'Опционально: путь к директории или файлу' } },
  },
  {
    title: '/backlog',
    slug: 'backlog-command',
    toolType: 'command',
    shortDescription: 'Управление бэклогом: просмотр, добавление, приоритизация, выбор следующей задачи',
    categorySlug: 'commands',
    tagSlugs: ['claude-code', 'avtomatizaciya'],
    description: root([
      heading(2, 'Что делает'),
      paragraph('Управление бэклогом проекта. Показывает задачи по приоритетам, позволяет добавлять новые, приоритизировать и выбирать следующую задачу для работы.'),
      heading(2, 'Подкоманды'),
      list([
        '`/backlog` — показать текущее состояние',
        '`/backlog add` — добавить задачу',
        '`/backlog next` — выбрать следующую',
        '`/backlog prioritize` — пересортировать',
      ]),
    ]),
    extra: { commandFields: { syntax: '/backlog [add|next|prioritize]', args: 'Подкоманда (опционально)' } },
  },
  {
    title: '/bug-fix',
    slug: 'bug-fix',
    toolType: 'command',
    shortDescription: 'Quick Fix: анализ stack trace, поиск корня проблемы, минимальное исправление + тест',
    categorySlug: 'commands',
    tagSlugs: ['claude-code'],
    description: root([
      heading(2, 'Что делает'),
      paragraph('Анализирует ошибку (stack trace, логи, описание), находит корень проблемы, применяет минимальное исправление и добавляет тест на этот баг.'),
      paragraph('Правило: **только минимальное исправление**, не рефакторить весь файл.'),
    ]),
    extra: { commandFields: { syntax: '/bug-fix', args: 'Описание ошибки или stack trace' } },
  },
  {
    title: '/cleanup',
    slug: 'cleanup',
    toolType: 'command',
    shortDescription: 'Удаление мёртвого кода, неиспользуемых импортов, временных файлов и зависимостей',
    categorySlug: 'commands',
    tagSlugs: ['kachestvo-koda'],
    description: root([
      heading(2, 'Что делает'),
      paragraph('Находит и удаляет мёртвый код: неиспользуемые импорты, функции, закомментированный код, временные файлы, неиспользуемые зависимости. Спрашивает подтверждение перед удалением.'),
    ]),
    extra: { commandFields: { syntax: '/cleanup', args: 'Нет' } },
  },
  {
    title: '/code-review',
    slug: 'code-review',
    toolType: 'command',
    shortDescription: 'Ревью кода: безопасность, качество, производительность, тесты, типизация',
    categorySlug: 'commands',
    tagSlugs: ['kachestvo-koda', 'bezopasnost'],
    description: root([
      heading(2, 'Что делает'),
      paragraph('Проводит ревью кода по 5 категориям: безопасность (секреты, SQLi, XSS), качество (DRY, размеры), производительность (лишние циклы, N+1), тесты (покрытие), типизация (any, ошибки).'),
      paragraph('Результат: **CRITICAL** (обязательно исправить), **WARNING** (рекомендуется), **GOOD** (одобрено).'),
    ]),
    extra: { commandFields: { syntax: '/code-review', args: 'Нет' } },
  },
  {
    title: '/deploy',
    slug: 'deploy',
    toolType: 'command',
    shortDescription: 'Деплой на VPS: git pull, docker build, health check, автоматический rollback',
    categorySlug: 'commands',
    tagSlugs: ['deploj', 'docker'],
    description: root([
      heading(2, 'Что делает'),
      paragraph('Деплоит текущий проект на VPS: определяет окружение (Docker/PM2/Systemd), подключается по SSH, обновляет код, пересобирает контейнеры, проверяет health. При ошибке — до 3 попыток, потом rollback.'),
    ]),
    extra: { commandFields: { syntax: '/deploy', args: 'Нет' } },
  },
  {
    title: '/docs',
    slug: 'docs',
    toolType: 'command',
    shortDescription: 'Управление документацией: аудит, обновление, проверка консистентности',
    categorySlug: 'commands',
    tagSlugs: ['claude-code'],
    description: root([
      heading(2, 'Что делает'),
      paragraph('Управление проектной документацией. Аудит (код в документах → ссылки, generic → удалить), обновление после изменений, проверка консистентности.'),
      heading(2, 'Подкоманды'),
      list([
        '`/docs` — статус всех файлов',
        '`/docs audit` — полный аудит',
        '`/docs update` — обновить после изменений',
        '`/docs check` — проверить консистентность',
      ]),
    ]),
    extra: { commandFields: { syntax: '/docs [audit|update|check]', args: 'Подкоманда (опционально)' } },
  },
  {
    title: '/done',
    slug: 'done',
    toolType: 'command',
    shortDescription: 'Завершение фичи: DoD, обновление документации, DECISIONS.md, git commit + push',
    categorySlug: 'commands',
    tagSlugs: ['claude-code', 'git'],
    description: root([
      heading(2, 'Что делает'),
      paragraph('Завершает фичу целиком: проверяет DoD (тесты, деплой, anti-mirage), обновляет Project Knowledge, DECISIONS.md, AI_NOTES, архивирует артефакты, коммитит и пушит.'),
      paragraph('**Отличие от /end:** `/done` закрывает *фичу*, `/end` закрывает *сессию*.'),
    ]),
    extra: { commandFields: { syntax: '/done', args: 'Нет' } },
  },
  {
    title: '/end',
    slug: 'end',
    toolType: 'command',
    shortDescription: 'Завершение сессии: AI_NOTES, DECISIONS.md, лог сессии, git commit + push',
    categorySlug: 'commands',
    tagSlugs: ['claude-code', 'git'],
    description: root([
      heading(2, 'Что делает'),
      paragraph('Завершает рабочую сессию: обновляет AI_NOTES, DECISIONS.md, записывает лог сессии, отмечает выполненные задачи, коммитит и пушит.'),
    ]),
    extra: { commandFields: { syntax: '/end', args: 'Нет' } },
  },
  {
    title: '/migrate',
    slug: 'migrate',
    toolType: 'command',
    shortDescription: 'Управление миграциями БД: создание, проверка, применение, откат',
    categorySlug: 'commands',
    tagSlugs: ['baza-dannyh'],
    description: root([
      heading(2, 'Что делает'),
      paragraph('Управление миграциями БД. Поддерживает Alembic, Prisma, Django migrations. Создание, проверка безопасности (DROP, TRUNCATE), применение с подтверждением, откат с предупреждением.'),
      heading(2, 'Подкоманды'),
      list([
        '`/migrate` — статус миграций',
        '`/migrate create` — создать новую',
        '`/migrate check` — проверка безопасности',
        '`/migrate apply` — применить',
        '`/migrate rollback` — откатить',
      ]),
    ]),
    extra: { commandFields: { syntax: '/migrate [create|check|apply|rollback]', args: 'Подкоманда' } },
  },
  {
    title: '/new-project',
    slug: 'new-project-command',
    toolType: 'command',
    shortDescription: 'Полный workflow создания проекта: 8 фаз от идеи до рабочего продукта',
    categorySlug: 'commands',
    tagSlugs: ['claude-code', 'avtomatizaciya'],
    description: root([
      heading(2, 'Что делает'),
      paragraph('Запускает полный pipeline создания проекта из 8 фаз: контекст → brainstorm (субагент) → user-spec → tech-spec → задачи → TDD-реализация → Git/Deploy → документация.'),
    ]),
    extra: { commandFields: { syntax: '/new-project', args: 'Нет (интерактивный процесс)' } },
  },
  {
    title: '/pre-commit-check',
    slug: 'pre-commit-check',
    toolType: 'command',
    shortDescription: 'Проверка перед коммитом: console.log, debugger, print(), секреты в коде',
    categorySlug: 'commands',
    tagSlugs: ['git', 'bezopasnost'],
    description: root([
      heading(2, 'Что делает'),
      paragraph('Проверяет код перед коммитом: незакоммиченные файлы, отладочные `console.log`/`debugger`/`print()`, хардкоженные секреты (API_KEY, PASSWORD, TOKEN). Предлагает автоисправление.'),
    ]),
    extra: { commandFields: { syntax: '/pre-commit-check', args: 'Нет' } },
  },
  {
    title: '/ship',
    slug: 'ship',
    toolType: 'command',
    shortDescription: 'Полный цикл доставки: lint → typecheck → test → commit → push → CI/CD',
    categorySlug: 'commands',
    tagSlugs: ['git', 'deploj', 'avtomatizaciya'],
    description: root([
      heading(2, 'Что делает'),
      paragraph('Полный цикл доставки кода: предварительные проверки (lint, typecheck, тесты), git commit с Conventional Commits, push, проверка CI/CD. Автоисправление до 3 попыток.'),
      paragraph('**Правило:** НЕ пушить если тесты не прошли.'),
    ]),
    extra: { commandFields: { syntax: '/ship', args: 'Нет' } },
  },
  {
    title: '/status',
    slug: 'status',
    toolType: 'command',
    shortDescription: 'Мониторинг всех VPS: Docker, диск, RAM, load, systemd сервисы',
    categorySlug: 'commands',
    tagSlugs: ['monitoring', 'deploj'],
    description: root([
      heading(2, 'Что делает'),
      paragraph('Мониторинг всех сервисов на всех VPS: Docker-контейнеры, диск, RAM, load, systemd. Сводная таблица со статусами, предупреждения при критических значениях.'),
    ]),
    extra: { commandFields: { syntax: '/status', args: 'Нет' } },
  },
  {
    title: '/tdd',
    slug: 'tdd',
    toolType: 'command',
    shortDescription: 'TDD-workflow: RED (тест) → GREEN (код) → REFACTOR (улучшение)',
    categorySlug: 'commands',
    tagSlugs: ['testirovanie', 'kachestvo-koda'],
    description: root([
      heading(2, 'Что делает'),
      paragraph('Помогает писать код через TDD. Цикл: понять задачу → написать тест (RED) → минимальный код (GREEN) → рефакторинг. Тест пишется ПЕРВЫМ.'),
    ]),
    extra: { commandFields: { syntax: '/tdd', args: 'Описание задачи' } },
  },
  {
    title: '/test',
    slug: 'test',
    toolType: 'command',
    shortDescription: 'Запуск тестов: Jest, Vitest, Pytest, Cargo test с покрытием и watch-mode',
    categorySlug: 'commands',
    tagSlugs: ['testirovanie'],
    description: root([
      heading(2, 'Что делает'),
      paragraph('Запускает тесты подходящим фреймворком: Jest, Vitest, Pytest, Cargo test. Поддерживает запуск конкретных файлов, watch-mode и отчёт по покрытию.'),
    ]),
    extra: { commandFields: { syntax: '/test [путь]', args: 'Опционально: путь к тестам' } },
  },
  {
    title: '/typecheck',
    slug: 'typecheck',
    toolType: 'command',
    shortDescription: 'Проверка типов TypeScript: tsc --noEmit с автоисправлением простых ошибок',
    categorySlug: 'commands',
    tagSlugs: ['typescript', 'kachestvo-koda'],
    description: root([
      heading(2, 'Что делает'),
      paragraph('Проверяет типы TypeScript без компиляции (`tsc --noEmit`). Показывает ошибки с номерами строк, предлагает автоисправление простых ошибок.'),
    ]),
    extra: { commandFields: { syntax: '/typecheck', args: 'Нет' } },
  },
  {
    title: '/vps-setup-framework',
    slug: 'vps-setup-framework',
    toolType: 'command',
    shortDescription: 'Установка Vibe Framework на VPS: Claude Code CLI, плагины, MCP, хуки',
    categorySlug: 'commands',
    tagSlugs: ['deploj', 'nastrojka', 'avtomatizaciya'],
    description: root([
      heading(2, 'Что делает'),
      paragraph('Полная установка Vibe Framework на VPS: Claude Code CLI, структура `.claude/`, 12 плагинов, 4 MCP-сервера, инструменты (ruff, prettier), настройка permissions и хуков.'),
    ]),
    extra: { commandFields: { syntax: '/vps-setup-framework', args: 'Нет (интерактивная установка)' } },
  },
]

/* =====================================================
   ХУКИ (14 шт. — 13 из скриптов + auto-lint + code-simplifier)
   ===================================================== */

const hooks: ToolData[] = [
  {
    title: 'Session Start',
    slug: 'session-start',
    toolType: 'hook',
    shortDescription: 'Загружает контекст при старте: git-статус, последние коммиты, Docker-сервисы',
    categorySlug: 'hooks',
    tagSlugs: ['claude-code', 'avtomatizaciya'],
    description: root([
      heading(2, 'Что делает'),
      paragraph('При старте сессии загружает и показывает состояние проекта: текущая ветка, изменённые файлы, последние коммиты, версии инструментов, Docker-сервисы.'),
    ]),
    extra: { hookFields: { trigger: 'PreToolUse', condition: 'Начало сессии' } },
  },
  {
    title: 'Security Scan',
    slug: 'security-scan',
    toolType: 'hook',
    shortDescription: 'Блокирует SQL injection, XSS, command injection, хардкоженные секреты',
    categorySlug: 'hooks',
    tagSlugs: ['bezopasnost', 'avtomatizaciya'],
    description: root([
      heading(2, 'Что делает'),
      paragraph('Сканирует код при каждом Write/Edit на security-дыры: f-strings в SQL, innerHTML, os.system(), pickle.loads(), пароли в кавычках. Блокирует запись при обнаружении.'),
    ]),
    extra: { hookFields: { trigger: 'PreToolUse', condition: 'Write | Edit' } },
  },
  {
    title: 'Protect Secrets',
    slug: 'protect-secrets',
    toolType: 'hook',
    shortDescription: 'Блокирует редактирование .env, приватных ключей и credentials файлов',
    categorySlug: 'hooks',
    tagSlugs: ['bezopasnost', 'avtomatizaciya'],
    description: root([
      heading(2, 'Что делает'),
      paragraph('Запрещает Claude редактировать критические файлы: `.env`, `.env.local`, `.env.production`, приватные ключи (id_rsa, .pem), credentials.json. Разрешены только `.env.example`.'),
    ]),
    extra: { hookFields: { trigger: 'PreToolUse', condition: 'Write | Edit' } },
  },
  {
    title: 'Backup Before Edit',
    slug: 'backup-before-edit',
    toolType: 'hook',
    shortDescription: 'Создаёт .bak копию файла перед редактированием, чистит бэкапы старше 7 дней',
    categorySlug: 'hooks',
    tagSlugs: ['avtomatizaciya'],
    description: root([
      heading(2, 'Что делает'),
      paragraph('Перед каждым редактированием создаёт резервную копию файла в `~/.claude/backups/` с timestamp. Автоматически удаляет бэкапы старше 7 дней.'),
    ]),
    extra: { hookFields: { trigger: 'PreToolUse', condition: 'Edit' } },
  },
  {
    title: 'Destructive Guard',
    slug: 'destructive-guard',
    toolType: 'hook',
    shortDescription: 'Блокирует rm -rf /, DROP TABLE, format и другие деструктивные команды',
    categorySlug: 'hooks',
    tagSlugs: ['bezopasnost', 'avtomatizaciya'],
    description: root([
      heading(2, 'Что делает'),
      paragraph('Блокирует опасные bash-команды: `rm -rf /`, `rm -rf ~`, `rm -rf *`, DROP TABLE, TRUNCATE, format. Разрешает безопасные цели: node_modules, dist, .next.'),
    ]),
    extra: { hookFields: { trigger: 'PreToolUse', condition: 'Bash' } },
  },
  {
    title: 'Conventional Commit',
    slug: 'conventional-commit',
    toolType: 'hook',
    shortDescription: 'Проверяет формат коммит-сообщения: feat/fix/refactor/docs/test/chore',
    categorySlug: 'hooks',
    tagSlugs: ['git', 'avtomatizaciya'],
    description: root([
      heading(2, 'Что делает'),
      paragraph('Проверяет формат коммит-сообщения по стандарту Conventional Commits: `type(scope): description`. Допустимые типы: feat, fix, refactor, docs, style, test, chore, perf, ci, build, revert.'),
    ]),
    extra: { hookFields: { trigger: 'PreToolUse', condition: 'Bash: git commit' } },
  },
  {
    title: 'Branch Guard',
    slug: 'branch-guard',
    toolType: 'hook',
    shortDescription: 'Блокирует git push в main/master/production, предлагает создать PR',
    categorySlug: 'hooks',
    tagSlugs: ['git', 'bezopasnost'],
    description: root([
      heading(2, 'Что делает'),
      paragraph('Блокирует прямой `git push` в защищённые ветки (main, master, production). Предлагает создать feature-ветку и PR. Opt-in через файл `.branch-guard`.'),
    ]),
    extra: { hookFields: { trigger: 'PreToolUse', condition: 'Bash: git push' } },
  },
  {
    title: 'Prettier',
    slug: 'prettier-hook',
    toolType: 'hook',
    shortDescription: 'Автоформатирование JS/TS файлов через Prettier после каждого изменения',
    categorySlug: 'hooks',
    tagSlugs: ['typescript', 'avtomatizaciya'],
    description: root([
      heading(2, 'Что делает'),
      paragraph('Автоматически запускает Prettier на JS/TS файлах после каждого Write/Edit. Форматирование без вопросов — код всегда в едином стиле.'),
    ]),
    extra: { hookFields: { trigger: 'PostToolUse', condition: 'Write | Edit (.js, .ts, .tsx)' } },
  },
  {
    title: 'Python Lint',
    slug: 'python-lint',
    toolType: 'hook',
    shortDescription: 'Автоформатирование Python: ruff check --fix + ruff format после каждого изменения',
    categorySlug: 'hooks',
    tagSlugs: ['python', 'avtomatizaciya'],
    description: root([
      heading(2, 'Что делает'),
      paragraph('Автоматически запускает `ruff check --fix` и `ruff format` на Python-файлах после редактирования. Silent fail если ruff не установлен.'),
    ]),
    extra: { hookFields: { trigger: 'PostToolUse', condition: 'Edit (.py)' } },
  },
  {
    title: 'Reinject Context',
    slug: 'reinject-context',
    toolType: 'hook',
    shortDescription: 'Восстанавливает CLAUDE.md и git-контекст после сжатия контекстного окна',
    categorySlug: 'hooks',
    tagSlugs: ['claude-code', 'avtomatizaciya'],
    description: root([
      heading(2, 'Что делает'),
      paragraph('После compaction контекста восстанавливает критические инструкции: первые 50 строк CLAUDE.md, глобальные правила, текущую ветку и последние коммиты.'),
    ]),
    extra: { hookFields: { trigger: 'PreToolUse', condition: 'SubagentCompaction' } },
  },
  {
    title: 'Cost Tracker',
    slug: 'cost-tracker',
    toolType: 'hook',
    shortDescription: 'Логирует статистику сессии: дата, время, проект, ветка в CSV',
    categorySlug: 'hooks',
    tagSlugs: ['monitoring', 'avtomatizaciya'],
    description: root([
      heading(2, 'Что делает'),
      paragraph('При завершении сессии записывает метаданные в `~/.claude/usage-log.csv`: дата, время, проект, ветка. Показывает счётчик сессий за день.'),
    ]),
    extra: { hookFields: { trigger: 'Stop' } },
  },
  {
    title: 'Notify Done',
    slug: 'notify-done',
    toolType: 'hook',
    shortDescription: 'Отправляет macOS-уведомление когда Claude завершил работу',
    categorySlug: 'hooks',
    tagSlugs: ['avtomatizaciya'],
    description: root([
      heading(2, 'Что делает'),
      paragraph('Отправляет нативное уведомление macOS через `osascript` когда Claude завершает работу. Полезно при длительных задачах.'),
    ]),
    extra: { hookFields: { trigger: 'Stop' } },
  },
  {
    title: 'Code Simplifier',
    slug: 'code-simplifier-hook',
    toolType: 'hook',
    shortDescription: 'Анализирует и упрощает написанный код после изменения 3+ файлов',
    categorySlug: 'hooks',
    tagSlugs: ['kachestvo-koda', 'avtomatizaciya'],
    description: root([
      heading(2, 'Что делает'),
      paragraph('Prompt-хук на Stop. Если в сессии изменено 3+ файлов — запускает анализ и упрощение кода: удаление дублирования, упрощение условий, улучшение именования.'),
    ]),
    extra: { hookFields: { trigger: 'Stop', condition: '3+ изменённых файлов' } },
  },
  {
    title: 'Auto Lint',
    slug: 'auto-lint',
    toolType: 'hook',
    shortDescription: 'Универсальный автолинтинг для всех языков после каждого изменения',
    categorySlug: 'hooks',
    tagSlugs: ['kachestvo-koda', 'avtomatizaciya'],
    description: root([
      heading(2, 'Что делает'),
      paragraph('Универсальный хук автолинтинга. Определяет язык файла и запускает подходящий линтер/форматер после каждого PostToolUse.'),
    ]),
    extra: { hookFields: { trigger: 'PostToolUse' } },
  },
]

/* =====================================================
   ПРАВИЛА (10 шт.)
   ===================================================== */

const rules: ToolData[] = [
  {
    title: 'Anti-Mirage',
    slug: 'anti-mirage',
    toolType: 'rule',
    shortDescription: 'Проверка реальности: все файлы, функции, пакеты, API и env vars существуют',
    categorySlug: 'rules',
    tagSlugs: ['kachestvo-koda', 'claude-code'],
    description: root([
      heading(2, 'Что делает'),
      paragraph('Правило против «галлюцинаций» AI. Перед ссылкой на файл, функцию, пакет, поле БД или API — обязательная проверка существования.'),
      heading(2, 'Что проверять'),
      list([
        'Импорты ссылаются на существующие файлы',
        'Вызываемые функции существуют в модулях',
        'Env vars описаны в .env.example',
        'Зависимости в package.json / requirements.txt',
        'API endpoints актуальны',
      ]),
    ]),
    extra: { ruleFields: { scope: 'Все проекты', priority: 'high' } },
  },
  {
    title: 'Automation',
    slug: 'automation',
    toolType: 'rule',
    shortDescription: 'Auto-Fix Pipeline: коммит → push → CI/CD → деплой, макс 3 попытки на каждом уровне',
    categorySlug: 'rules',
    tagSlugs: ['avtomatizaciya', 'git', 'deploj'],
    description: root([
      heading(2, 'Что делает'),
      paragraph('Описывает Auto-Fix Pipeline из 4 уровней автоматического исправления ошибок: коммит упал, push отклонён, CI/CD упал, деплой упал. Максимум 3 попытки на каждом уровне.'),
    ]),
    extra: { ruleFields: { scope: 'Все проекты', priority: 'high' } },
  },
  {
    title: 'Coding Standards',
    slug: 'coding-standards',
    toolType: 'rule',
    shortDescription: 'Стандарты кода: DRY, KISS, YAGNI, именование, размеры файлов, безопасность',
    categorySlug: 'rules',
    tagSlugs: ['kachestvo-koda'],
    description: root([
      heading(2, 'Что делает'),
      paragraph('Набор стандартов кода для всех проектов: DRY, KISS, YAGNI, именование на русском, файлы < 500 строк, функции < 50 строк, правила безопасности, git workflow.'),
      heading(2, 'Ключевые правила'),
      list([
        'Код, комментарии, переменные — на русском',
        'Один файл = одна ответственность',
        'Conventional Commits: feat/fix/refactor',
        'Тесты на критический функционал (> 80% покрытие)',
      ]),
    ]),
    extra: { ruleFields: { scope: 'Все проекты', priority: 'high' } },
  },
  {
    title: 'Database',
    slug: 'database',
    toolType: 'rule',
    shortDescription: 'Правила работы с БД: миграции, параметризованные запросы, индексы, бэкапы',
    categorySlug: 'rules',
    tagSlugs: ['baza-dannyh', 'bezopasnost'],
    description: root([
      heading(2, 'Что делает'),
      paragraph('Правила работы с базой данных: атомарные миграции через систему миграций, параметризованные SQL-запросы (никакой конкатенации!), обязательные поля (id, created_at, updated_at), индексы, пагинация, транзакции, бэкапы.'),
    ]),
    extra: { ruleFields: { scope: 'Проекты с БД', priority: 'high' } },
  },
  {
    title: 'Documentation',
    slug: 'documentation',
    toolType: 'rule',
    shortDescription: 'Правила документации: без кода, без дублирования, только проектно-специфичное',
    categorySlug: 'rules',
    tagSlugs: ['claude-code'],
    description: root([
      heading(2, 'Что делает'),
      paragraph('Философия документации: открыл → понял проект без чтения кода. Без блоков кода (только ссылки), без дублирования, без generic знаний фреймворка. 4 обязательных файла: project.md, architecture.md, patterns.md, deployment.md.'),
    ]),
    extra: { ruleFields: { scope: 'Все проекты', priority: 'medium' } },
  },
  {
    title: 'Quality Gates',
    slug: 'quality-gates',
    toolType: 'rule',
    shortDescription: 'Система проверок качества: After Plan, After Code, Before Deploy',
    categorySlug: 'rules',
    tagSlugs: ['kachestvo-koda', 'avtomatizaciya'],
    description: root([
      heading(2, 'Что делает'),
      paragraph('Единая система проверки качества на 3 этапах: After Plan (архитектура), After Code (code-reviewer + anti-mirage), Before Deploy (security + infra). Severity: Critical → Major → Minor.'),
    ]),
    extra: { ruleFields: { scope: 'Feature / Epic', priority: 'high' } },
  },
  {
    title: 'Security',
    slug: 'security',
    toolType: 'rule',
    shortDescription: 'Правила безопасности: секреты, валидация, SQL injection, XSS, HTTPS, CORS',
    categorySlug: 'rules',
    tagSlugs: ['bezopasnost'],
    description: root([
      heading(2, 'Что делает'),
      paragraph('Комплексные правила безопасности: никаких хардкоженных секретов, валидация ввода (белый список), prepared statements для SQL, textContent вместо innerHTML, bcrypt для паролей, JWT с коротким TTL, rate limiting, CORS, HTTPS.'),
    ]),
    extra: { ruleFields: { scope: 'Все проекты', priority: 'high' } },
  },
  {
    title: 'Skill Quality Gate',
    slug: 'skill-quality-gate',
    toolType: 'rule',
    shortDescription: 'Обязательная проверка качества скиллов: 5 шагов, минимальный балл 85%',
    categorySlug: 'rules',
    tagSlugs: ['kachestvo-koda', 'claude-code'],
    description: root([
      heading(2, 'Что делает'),
      paragraph('Обязательный quality gate при создании или изменении скилла. 5 шагов: структурный чеклист, sub-agent ревью (code-reviewer + architect + security), тест-прогон, расчёт score, решение (PASS ≥ 85%, WARN 75-84%, FAIL < 75%).'),
    ]),
    extra: { ruleFields: { scope: 'Создание скиллов', priority: 'medium' } },
  },
  {
    title: 'Testing',
    slug: 'testing-rule',
    toolType: 'rule',
    shortDescription: 'Правила тестирования: пирамида тестов, decision framework, антипаттерны',
    categorySlug: 'rules',
    tagSlugs: ['testirovanie', 'kachestvo-koda'],
    description: root([
      heading(2, 'Что делает'),
      paragraph('Пирамида тестов (smoke → unit → integration → E2E), decision framework (нужны ли тесты для этой задачи), правило моков (unit: мокай БД; integration: реальная БД), антипаттерны, адаптивность по размеру задачи.'),
    ]),
    extra: { ruleFields: { scope: 'Все проекты', priority: 'high' } },
  },
  {
    title: 'Workflow Markers',
    slug: 'workflow-markers',
    toolType: 'rule',
    shortDescription: 'Визуальная разметка этапов работы: РЕЖИМ, ФАЗА, ЧЕКПОИНТ, AUTO-FIX, ГОТОВО',
    categorySlug: 'rules',
    tagSlugs: ['claude-code', 'avtomatizaciya'],
    description: root([
      heading(2, 'Что делает'),
      paragraph('Обязательные визуальные маркеры в начале каждого этапа работы. Режим (Quick Fix / Feature / Epic), фазы (Brainstorm → Plan → Execute → Test → Deploy), чекпоинты между блоками, маркеры Auto-Fix Pipeline.'),
    ]),
    extra: { ruleFields: { scope: 'Все проекты', priority: 'medium' } },
  },
]

/* =====================================================
   ПЛАГИНЫ (10 шт.)
   ===================================================== */

const plugins: ToolData[] = [
  {
    title: 'mgrep',
    slug: 'mgrep',
    toolType: 'plugin',
    shortDescription: 'Семантический поиск по кодовой базе: находит код по смыслу, а не только по тексту',
    categorySlug: 'plugins',
    tagSlugs: ['claude-code'],
    description: root([
      heading(2, 'Что делает'),
      paragraph('MCP-сервер для семантического поиска по кодовой базе. Находит код не только по точному совпадению текста, но и по смыслу. Незаменим для Anti-Mirage проверок.'),
    ]),
    extra: { pluginFields: { configuration: '{\n  "mcpServers": {\n    "mgrep": {\n      "command": "npx",\n      "args": ["-y", "@anthropic-ai/mgrep"]\n    }\n  }\n}' } },
  },
  {
    title: 'Code Simplifier',
    slug: 'code-simplifier-plugin',
    toolType: 'plugin',
    shortDescription: 'Анализ сложности кода и автоматическое упрощение: удаление дубликатов, рефакторинг',
    categorySlug: 'plugins',
    tagSlugs: ['kachestvo-koda'],
    description: root([
      heading(2, 'Что делает'),
      paragraph('MCP-плагин для анализа сложности кода. Находит дублирование, избыточные условия, сложные цепочки вызовов и предлагает упрощение с сохранением функциональности.'),
    ]),
    extra: { pluginFields: {} },
  },
  {
    title: 'TypeScript LSP',
    slug: 'typescript-lsp',
    toolType: 'plugin',
    shortDescription: 'Типы, автодополнение и ошибки TypeScript в реальном времени через Language Server',
    categorySlug: 'plugins',
    tagSlugs: ['typescript'],
    description: root([
      heading(2, 'Что делает'),
      paragraph('Даёт Claude доступ к TypeScript Language Server: проверка типов, автодополнение, определения, ошибки компиляции — всё в реальном времени, без ручного запуска `tsc`.'),
    ]),
    extra: { pluginFields: {} },
  },
  {
    title: 'Pyright LSP',
    slug: 'pyright-lsp',
    toolType: 'plugin',
    shortDescription: 'Типы, автодополнение и ошибки Python через Pyright Language Server',
    categorySlug: 'plugins',
    tagSlugs: ['python'],
    description: root([
      heading(2, 'Что делает'),
      paragraph('MCP-плагин для Python type checking через Pyright: проверка типов, автодополнение, определения переменных. Работает даже без аннотаций типов в коде.'),
    ]),
    extra: { pluginFields: {} },
  },
  {
    title: 'Context7',
    slug: 'context7',
    toolType: 'plugin',
    shortDescription: 'Актуальная документация библиотек: заменяет устаревшие данные из обучения модели',
    categorySlug: 'plugins',
    tagSlugs: ['claude-code'],
    description: root([
      heading(2, 'Что делает'),
      paragraph('Даёт Claude доступ к актуальной документации любых библиотек и фреймворков. Решает проблему устаревших данных: модель обучена на коде годовалой давности, а API мог измениться.'),
    ]),
    extra: {
      pluginFields: {
        configuration: '{\n  "mcpServers": {\n    "context7": {\n      "command": "npx",\n      "args": ["-y", "@context7/mcp-server"]\n    }\n  }\n}',
      },
    },
  },
  {
    title: 'Frontend Design',
    slug: 'frontend-design-plugin',
    toolType: 'plugin',
    shortDescription: 'UI/UX-паттерны и рекомендации для веб-интерфейсов',
    categorySlug: 'plugins',
    tagSlugs: ['typescript'],
    description: root([
      heading(2, 'Что делает'),
      paragraph('MCP-плагин с паттернами и рекомендациями по UI/UX: компонентные библиотеки, цветовые схемы, типографика, accessibility, responsive design.'),
    ]),
    extra: { pluginFields: {} },
  },
  {
    title: 'Security Guidance',
    slug: 'security-guidance',
    toolType: 'plugin',
    shortDescription: 'Гайды по безопасности: OWASP, best practices, уязвимости и их предотвращение',
    categorySlug: 'plugins',
    tagSlugs: ['bezopasnost'],
    description: root([
      heading(2, 'Что делает'),
      paragraph('MCP-плагин с гайдами по безопасности. OWASP Top 10, лучшие практики для разных языков, типичные уязвимости и способы предотвращения.'),
    ]),
    extra: { pluginFields: {} },
  },
  {
    title: 'PR Review Toolkit',
    slug: 'pr-review-toolkit',
    toolType: 'plugin',
    shortDescription: 'Набор инструментов для ревью PR: code review, тесты, типы, silent failures',
    categorySlug: 'plugins',
    tagSlugs: ['git', 'kachestvo-koda'],
    description: root([
      heading(2, 'Что делает'),
      paragraph('Набор агентов для ревью pull requests: code-reviewer, code-simplifier, comment-analyzer, pr-test-analyzer, silent-failure-hunter, type-design-analyzer.'),
    ]),
    extra: { pluginFields: {} },
  },
  {
    title: 'Commit Commands',
    slug: 'commit-commands',
    toolType: 'plugin',
    shortDescription: 'Git-шорткаты для быстрых операций с коммитами и ветками',
    categorySlug: 'plugins',
    tagSlugs: ['git'],
    description: root([
      heading(2, 'Что делает'),
      paragraph('MCP-плагин с git-шорткатами: быстрые коммиты, создание веток, cherry-pick, rebase — всё через короткие команды.'),
    ]),
    extra: { pluginFields: {} },
  },
  {
    title: 'Superpowers',
    slug: 'superpowers',
    toolType: 'plugin',
    shortDescription: 'Расширенные возможности Claude Code: дополнительные инструменты и интеграции',
    categorySlug: 'plugins',
    tagSlugs: ['claude-code'],
    description: root([
      heading(2, 'Что делает'),
      paragraph('MCP-плагин, расширяющий возможности Claude Code дополнительными инструментами и интеграциями. Даёт доступ к продвинутым функциям, не включённым в базовую версию.'),
    ]),
    extra: { pluginFields: {} },
  },
]

/** Все инструменты для seed */
export const toolsData: ToolData[] = [...skills, ...commands, ...hooks, ...rules, ...plugins]
