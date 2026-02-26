import { heading, paragraph, list, quote, codeBlock, root } from '../lexical'

export interface ToolData {
  title: string
  slug: string
  toolType: 'skill' | 'hook' | 'command'
  shortDescription: string
  categorySlug: string
  tagSlugs: string[]
  description: ReturnType<typeof root>
  seoTitle: string
  seoDescription: string
  extra?: Record<string, unknown>
}

export const commandsData: ToolData[] = [
  {
    title: '/new-project',
    slug: 'new-project-command',
    toolType: 'command',
    shortDescription:
      'Полный пайплайн создания проекта от нуля до деплоя. 7 фаз: VPS, User Spec, Tech Spec, декомпозиция, реализация, тесты, финализация.',
    categorySlug: 'protsessy',
    tagSlugs: ['commands', 'claude-code', 'vibe-coding', 'agents'],
    description: root([
      heading(2, 'Полный пайплайн создания проекта'),
      paragraph(
        'Команда **/new-project** запускает непрерывный поток из 7 фаз — от настройки сервера до работающего продукта на продакшене. Между фазами нет ручного переключения: AI сам определяет завершение и переходит к следующей.',
      ),
      list([
        'Фаза 0: VPS + Docker + Nginx + SSL',
        'Фаза 1: Глубинное интервью, User Spec',
        'Фаза 2: Техническое интервью, Tech Spec',
        'Фаза 3: Декомпозиция на задачи, wave-параллелизм',
        'Фаза 4: Реализация — Team Lead + субагенты',
        'Фаза 5: Тестирование — 14 проверок качества',
        'Фаза 6: Финализация — QA, деплой, документация',
      ]),
      paragraph(
        'Пользователь может в любой момент остановить процесс, скорректировать курс или откатиться к предыдущей фазе.',
      ),
    ]),
    seoTitle: '/new-project — создание проекта от нуля до деплоя',
    seoDescription:
      'Команда /new-project: полный пайплайн из 7 фаз. VPS, спецификации, декомпозиция, реализация, тесты, деплой.',
    extra: {
      syntax: '/new-project',
      args: 'Без аргументов. Claude запросит описание проекта в интерактивном режиме.',
    },
  },
  {
    title: '/end',
    slug: 'end-command',
    toolType: 'command',
    shortDescription:
      'Завершение сессии с сохранением прогресса. Обновляет CLAUDE.md, фиксирует незакоммиченные изменения.',
    categorySlug: 'protsessy',
    tagSlugs: ['commands', 'claude-code', 'project-knowledge'],
    description: root([
      heading(2, 'Завершение сессии с сохранением прогресса'),
      paragraph(
        'Команда **/end** корректно завершает рабочую сессию. Сохраняет прогресс в CLAUDE.md, предлагает закоммитить незакоммиченные изменения, обновляет бэклог.',
      ),
      list([
        'Обновляет секцию ПРОГРЕСС в CLAUDE.md',
        'Предлагает коммит для незакоммиченных изменений',
        'Записывает, на чём остановились и что делать дальше',
        'Обновляет бэклог, если появились новые задачи',
        'Показывает итоги: сколько сделано, сколько осталось',
      ]),
      paragraph(
        'Благодаря `/end` следующая сессия начинается с правильного контекста — не нужно вспоминать, где остановились.',
      ),
    ]),
    seoTitle: '/end — завершение сессии с сохранением прогресса',
    seoDescription:
      'Команда /end: обновление CLAUDE.md, коммит, бэклог. Корректное завершение сессии для бесшовного продолжения.',
    extra: {
      syntax: '/end',
      args: 'Без аргументов.',
    },
  },
  {
    title: '/done',
    slug: 'done-command',
    toolType: 'command',
    shortDescription:
      'Финализация задачи: AI_NOTES, cost-tracker, QA-проверки. Фиксирует что сделано и запускает финальный ревью.',
    categorySlug: 'protsessy',
    tagSlugs: ['commands', 'claude-code', 'quality-gates'],
    description: root([
      heading(2, 'Финализация задачи'),
      paragraph(
        'Команда **/done** завершает текущую задачу с полным набором финальных проверок. Записывает AI_NOTES, запускает cost-tracker, проводит QA-ревью и обновляет документацию.',
      ),
      list([
        'Записывает AI_NOTES: что сделано, какие решения приняты',
        'Запускает cost-tracker: токены, время, стоимость',
        'QA-проверки: тесты пройдены, lint чистый, типы верные',
        'Обновляет Project Knowledge если были архитектурные изменения',
        'Обновляет ПРОГРЕСС в CLAUDE.md',
      ]),
      paragraph(
        'Отличие от `/end`: `/done` фиксирует завершение конкретной задачи с проверками, `/end` — завершение всей сессии.',
      ),
    ]),
    seoTitle: '/done — финализация задачи с QA-проверками',
    seoDescription:
      'Команда /done: AI_NOTES, cost-tracker, QA-ревью. Финализация задачи с проверками качества.',
    extra: {
      syntax: '/done',
      args: 'Без аргументов. Применяется к текущей активной задаче.',
    },
  },
  {
    title: '/code-review',
    slug: 'code-review-command',
    toolType: 'command',
    shortDescription:
      'Запуск ревью кода через субагента code-reviewer. Проверяет DRY, KISS, безопасность, именование.',
    categorySlug: 'kachestvo-koda',
    tagSlugs: ['commands', 'claude-code', 'quality-gates', 'agents'],
    description: root([
      heading(2, 'Ревью кода через агента'),
      paragraph(
        'Команда **/code-review** запускает субагента code-reviewer для ревью написанного кода. Проверяет соблюдение стандартов: DRY, KISS, YAGNI, безопасность, именование, размеры функций.',
      ),
      list([
        'DRY: поиск дублирования кода',
        'KISS: выявление избыточной сложности',
        'Безопасность: SQL-инъекции, XSS, хардкод секретов',
        'Именование: понятные имена переменных и функций',
        'Размеры: функции <50 строк, файлы <500 строк',
        'Severity: Critical / Major / Minor',
      ]),
      paragraph(
        'По умолчанию ревьюит staged изменения (git diff --staged). Можно указать конкретные файлы.',
      ),
    ]),
    seoTitle: '/code-review — ревью кода через AI-агента',
    seoDescription:
      'Команда /code-review: DRY, KISS, безопасность, именование. Автоматический ревью кода через субагента.',
    extra: {
      syntax: '/code-review [файл или путь]',
      args: 'Опционально: путь к файлу или директории. По умолчанию ревьюит staged изменения.',
    },
  },
  {
    title: '/tdd',
    slug: 'tdd-command',
    toolType: 'command',
    shortDescription:
      'TDD-workflow: сначала тесты (RED), потом код (GREEN), потом рефакторинг. Пошаговый процесс через агента.',
    categorySlug: 'testirovanie',
    tagSlugs: ['commands', 'claude-code', 'tdd'],
    description: root([
      heading(2, 'TDD-workflow: тесты -> код -> рефакторинг'),
      paragraph(
        'Команда **/tdd** запускает полный TDD-цикл через субагента. Сначала пишутся тесты, которые падают (RED), потом минимальный код для прохождения (GREEN), потом рефакторинг.',
      ),
      list([
        'RED: пишем тесты для задачи — они должны падать',
        'GREEN: пишем минимальный код для прохождения тестов',
        'REFACTOR: улучшаем код, сохраняя проходящие тесты',
        'Каждый шаг валидируется: тесты запускаются автоматически',
        'Итерационный цикл для каждого сценария',
      ]),
      quote(
        'Тесты — не обуза, а навигатор. Они говорят, что делать дальше, и сигнализируют, когда ты сломал что-то.',
      ),
    ]),
    seoTitle: '/tdd — TDD-workflow через агента Claude Code',
    seoDescription:
      'Команда /tdd: RED-GREEN-REFACTOR цикл. Пошаговый TDD-процесс с автоматическим запуском тестов.',
    extra: {
      syntax: '/tdd [описание задачи]',
      args: 'Описание функциональности для TDD-цикла. Без аргументов — Claude спросит.',
    },
  },
  {
    title: '/test',
    slug: 'test-command',
    toolType: 'command',
    shortDescription:
      'Запуск тестов и анализ результатов. Показывает coverage, упавшие тесты и рекомендации по исправлению.',
    categorySlug: 'testirovanie',
    tagSlugs: ['commands', 'claude-code', 'tdd', 'quality-gates'],
    description: root([
      heading(2, 'Запуск тестов и анализ'),
      paragraph(
        'Команда **/test** запускает тесты проекта, анализирует результаты и даёт рекомендации. Автоматически определяет тест-раннер (jest, pytest, vitest) и запускает нужную команду.',
      ),
      list([
        'Автоопределение тест-раннера по конфигам проекта',
        'Запуск всех тестов или конкретных файлов',
        'Анализ coverage: какие файлы не покрыты',
        'Детальный разбор упавших тестов с предложениями фикса',
        'Проверка покрытия: минимум 80% для бизнес-логики',
      ]),
      paragraph(
        'Отличие от `/tdd`: `/test` просто запускает и анализирует, `/tdd` ведёт через полный TDD-цикл.',
      ),
    ]),
    seoTitle: '/test — запуск тестов и анализ результатов',
    seoDescription:
      'Команда /test: автоопределение тест-раннера, coverage, анализ падений. Запуск и разбор тестов в Claude Code.',
    extra: {
      syntax: '/test [путь к тестам]',
      args: 'Опционально: путь к файлу или директории с тестами. По умолчанию — все тесты.',
    },
  },
  {
    title: '/deploy',
    slug: 'deploy-command',
    toolType: 'command',
    shortDescription:
      'Деплой на VPS через Docker: сборка образа, пуш, docker-compose up. С rollback при ошибке.',
    categorySlug: 'deploj',
    tagSlugs: ['commands', 'claude-code', 'docker', 'nginx'],
    description: root([
      heading(2, 'Деплой на VPS через Docker'),
      paragraph(
        'Команда **/deploy** выполняет полный цикл деплоя: сборка Docker-образа, отправка на сервер, `docker compose up -d --build`. При ошибке — Auto-Fix Pipeline с откатом.',
      ),
      list([
        'Сборка Docker-образа (multi-stage build)',
        'Проверка env vars на сервере',
        'Деплой через `docker compose up -d --build`',
        'Health check после деплоя',
        'Auto-Fix Pipeline: макс 3 попытки, потом rollback',
        'Уведомление о результате',
      ]),
      paragraph(
        'Подключается к VPS через MCP SSH-серверы. Поддерживает staging и production окружения.',
      ),
    ]),
    seoTitle: '/deploy — деплой приложения на VPS через Docker',
    seoDescription:
      'Команда /deploy: Docker build, docker-compose, health check, rollback. Полный цикл деплоя на VPS.',
    extra: {
      syntax: '/deploy [--force] [--env staging|production]',
      args: 'Опционально: `--force` (пересборка образа без кэша), `--env staging|production` (выбор окружения, по умолчанию production).',
    },
  },
  {
    title: '/ship',
    slug: 'ship-command',
    toolType: 'command',
    shortDescription:
      'Полный Feature pipeline: brainstorm -> план -> одобрение -> реализация -> тесты -> коммит.',
    categorySlug: 'protsessy',
    tagSlugs: ['commands', 'claude-code', 'vibe-coding', 'agents'],
    description: root([
      heading(2, 'Полный Feature pipeline'),
      paragraph(
        'Команда **/ship** проводит фичу через весь цикл разработки: от brainstorm до коммита. Подключает 3-5 субагентов, запускает Quality Gates и создаёт коммит по Conventional Commits.',
      ),
      list([
        'Brainstorm: анализ задачи, вопросы, уточнения',
        'Plan Mode: план реализации с декомпозицией',
        'Approve: пользователь одобряет план',
        'Build: реализация по блокам с чекпоинтами',
        'Test: тесты для каждого блока',
        'Review: code-reviewer проверяет результат',
        'Commit: Conventional Commits формат',
      ]),
      paragraph(
        'Оптимально для задач уровня Feature (15-60 минут). Для Epic и Project используй `/new-project`.',
      ),
    ]),
    seoTitle: '/ship — полный Feature pipeline от идеи до коммита',
    seoDescription:
      'Команда /ship: brainstorm, план, реализация, тесты, ревью, коммит. Полный цикл разработки фичи.',
    extra: {
      syntax: '/ship [описание фичи]',
      args: 'Описание фичи для реализации. Без аргументов — Claude спросит.',
    },
  },
  {
    title: '/status',
    slug: 'status-command',
    toolType: 'command',
    shortDescription:
      'Статус проекта: git (ветка, изменения), Docker (контейнеры), ошибки, прогресс по задачам.',
    categorySlug: 'upravlenie',
    tagSlugs: ['commands', 'claude-code', 'docker'],
    description: root([
      heading(2, 'Статус проекта'),
      paragraph(
        'Команда **/status** показывает полную картину текущего состояния проекта: git, Docker, ошибки, прогресс. Одна команда — вся информация.',
      ),
      list([
        'Git: текущая ветка, незакоммиченные изменения, последние коммиты',
        'Docker: статус контейнеров, использование ресурсов',
        'Ошибки: последние ошибки из логов',
        'Прогресс: секция ПРОГРЕСС из CLAUDE.md',
        'Бэклог: сколько задач в очереди',
      ]),
      paragraph(
        'Полезно в начале сессии для быстрого погружения в контекст.',
      ),
    ]),
    seoTitle: '/status — статус проекта: git, Docker, ошибки',
    seoDescription:
      'Команда /status: git ветка, Docker контейнеры, ошибки, прогресс. Полная картина состояния проекта.',
    extra: {
      syntax: '/status',
      args: 'Без аргументов. Показывает статус текущего проекта.',
    },
  },
  {
    title: '/backlog',
    slug: 'backlog-command',
    toolType: 'command',
    shortDescription:
      'Управление бэклогом: просмотр, добавление задач, приоритизация через AI. Ничего не теряется.',
    categorySlug: 'upravlenie',
    tagSlugs: ['commands', 'claude-code', 'backlog'],
    description: root([
      heading(2, 'Управление бэклогом'),
      paragraph(
        'Команда **/backlog** — интерфейс к бэклогу проекта. Просмотр задач, добавление новых, AI-приоритизация через RICE-скоринг. Всё, что "потом" — живёт здесь.',
      ),
      list([
        '`/backlog` — показать текущий бэклог',
        '`/backlog add` — добавить задачу (тип, описание, приоритет)',
        '`/backlog prioritize` — AI пересортирует по RICE-скору',
        'Типы: feature, bug, tech-debt, question, idea',
        'Приоритеты: critical, high, medium, low',
      ]),
      paragraph(
        'Бэклог — это не свалка задач, а инструмент планирования. Регулярная приоритизация помогает фокусироваться на важном.',
      ),
    ]),
    seoTitle: '/backlog — управление бэклогом проекта',
    seoDescription:
      'Команда /backlog: просмотр, добавление, RICE-приоритизация. Управление задачами проекта через Claude Code.',
    extra: {
      syntax: '/backlog [add|prioritize]',
      args: 'Субкоманды: `add` (добавить задачу), `prioritize` (AI-приоритизация). Без аргументов — показать бэклог.',
    },
  },
  {
    title: '/docs',
    slug: 'docs-command',
    toolType: 'command',
    shortDescription:
      'Генерация и обновление документации: Project Knowledge, CLAUDE.md, README.md, DECISIONS.md.',
    categorySlug: 'upravlenie',
    tagSlugs: ['commands', 'claude-code', 'project-knowledge'],
    description: root([
      heading(2, 'Генерация и обновление документации'),
      paragraph(
        'Команда **/docs** генерирует или обновляет документацию проекта. Project Knowledge (4 файла), CLAUDE.md, README.md — всё по стандарту Vibe Framework.',
      ),
      list([
        'Генерация Project Knowledge: project.md, architecture.md, patterns.md, deployment.md',
        'Обновление CLAUDE.md: прогресс, ссылки, правила',
        'Генерация README.md: для людей, на русском',
        'Аудит документации: поиск устаревшей информации',
        'DECISIONS.md: лог архитектурных решений',
      ]),
      paragraph(
        'Философия: открыл документацию — понял проект без чтения кода. Нет кода в документации — только ссылки.',
      ),
    ]),
    seoTitle: '/docs — генерация документации проекта',
    seoDescription:
      'Команда /docs: Project Knowledge, CLAUDE.md, README. Генерация и обновление документации по стандарту.',
    extra: {
      syntax: '/docs [generate|audit|update]',
      args: 'Субкоманды: `generate` (создать с нуля), `audit` (проверить актуальность), `update` (обновить). По умолчанию — update.',
    },
  },
  {
    title: '/migrate',
    slug: 'migrate-command',
    toolType: 'command',
    shortDescription:
      'Создание и применение миграций БД: Alembic, Prisma Migrate, Django. С проверкой rollback.',
    categorySlug: 'instrumenty',
    tagSlugs: ['commands', 'claude-code', 'postgresql'],
    description: root([
      heading(2, 'Миграции базы данных'),
      paragraph(
        'Команда **/migrate** управляет миграциями БД. Автоопределение ORM (Alembic, Prisma, Django), создание миграций, проверка rollback, применение на dev/prod.',
      ),
      list([
        'Автоопределение системы миграций по проекту',
        'Создание новой миграции с описательным именем',
        'Проверка: `downgrade -1` -> `upgrade head` работает',
        'Применение на dev или prod с бэкапом',
        'Предупреждение при деструктивных операциях (DROP)',
      ]),
      paragraph(
        'Каждая миграция — атомарная операция. Старые миграции не редактируются. Rollback тестируется до деплоя.',
      ),
    ]),
    seoTitle: '/migrate — миграции БД: Alembic, Prisma, Django',
    seoDescription:
      'Команда /migrate: создание миграций, проверка rollback, применение. Alembic, Prisma Migrate, Django.',
    extra: {
      syntax: '/migrate [create|apply|rollback|status]',
      args: 'Субкоманды: `create` (новая миграция), `apply` (применить), `rollback` (откатить последнюю), `status` (текущее состояние).',
    },
  },
  {
    title: '/cleanup',
    slug: 'cleanup-command',
    toolType: 'command',
    shortDescription:
      'Удаление debug-кода: console.log, debugger, print(), закомментированный код. Чистка перед коммитом.',
    categorySlug: 'kachestvo-koda',
    tagSlugs: ['commands', 'claude-code', 'quality-gates'],
    description: root([
      heading(2, 'Удаление debug-кода и мёртвого кода'),
      paragraph(
        'Команда **/cleanup** ищет и удаляет отладочный код: `console.log`, `debugger`, `print()`, закомментированные блоки. Чистый код перед коммитом.',
      ),
      list([
        'JavaScript/TypeScript: `console.log`, `console.debug`, `debugger`',
        'Python: `print()`, `breakpoint()`, `pdb.set_trace()`',
        'Закомментированный код (более 3 строк подряд)',
        'Неиспользуемые импорты',
        'TODO/FIXME без привязки к бэклогу',
      ]),
      paragraph(
        'Показывает найденное и спрашивает подтверждение перед удалением. Не удаляет легитимные `console.error` и `console.warn`.',
      ),
    ]),
    seoTitle: '/cleanup — удаление debug-кода и мёртвого кода',
    seoDescription:
      'Команда /cleanup: console.log, debugger, print(), закомментированный код. Чистка проекта перед коммитом.',
    extra: {
      syntax: '/cleanup [путь]',
      args: 'Опционально: путь к файлу или директории. По умолчанию — весь проект.',
    },
  },
  {
    title: '/bug-fix',
    slug: 'bug-fix-command',
    toolType: 'command',
    shortDescription:
      'Quick Fix mode: определи баг -> исправь -> проверь -> коммить. Без brainstorm и планирования.',
    categorySlug: 'protsessy',
    tagSlugs: ['commands', 'claude-code', 'auto-fix'],
    description: root([
      heading(2, 'Quick Fix mode для багов'),
      paragraph(
        'Команда **/bug-fix** переключает Claude в режим быстрого исправления. Без brainstorm, без планирования — сразу к делу: определи -> исправь -> проверь -> коммить.',
      ),
      list([
        'Анализ ошибки: логи, стектрейс, шаги воспроизведения',
        'Локализация: в каком файле и функции проблема',
        'Исправление: минимальное изменение для фикса',
        'Проверка: тест, который ловит этот баг',
        'Коммит: `fix: описание проблемы`',
      ]),
      paragraph(
        'Оптимально для задач на 5-15 минут. Подключает максимум 1 субагента. Автоматические hooks продолжают работать.',
      ),
    ]),
    seoTitle: '/bug-fix — быстрое исправление багов',
    seoDescription:
      'Команда /bug-fix: Quick Fix mode. Определить, исправить, проверить, закоммитить — без лишних этапов.',
    extra: {
      syntax: '/bug-fix [описание бага]',
      args: 'Описание бага, ошибка из логов или ссылка на issue. Без аргументов — Claude спросит.',
    },
  },
  {
    title: '/autoformat',
    slug: 'autoformat-command',
    toolType: 'command',
    shortDescription:
      'Форматирование кода: Prettier для JS/TS, ruff для Python. Весь проект или конкретные файлы.',
    categorySlug: 'kachestvo-koda',
    tagSlugs: ['commands', 'claude-code', 'typescript'],
    description: root([
      heading(2, 'Автоформатирование кода'),
      paragraph(
        'Команда **/autoformat** запускает форматирование на весь проект или конкретные файлы. Prettier для JavaScript/TypeScript, ruff для Python.',
      ),
      list([
        'JavaScript/TypeScript: `npx prettier --write .`',
        'Python: `ruff format .` + `ruff check --fix .`',
        'Автоопределение языка по расширениям файлов',
        'Использует конфиги проекта (.prettierrc, pyproject.toml)',
        'Показывает сколько файлов изменено',
      ]),
      paragraph(
        'Отличие от хука prettier: хук срабатывает на каждый файл, `/autoformat` форматирует всё разом.',
      ),
    ]),
    seoTitle: '/autoformat — форматирование кода Prettier и ruff',
    seoDescription:
      'Команда /autoformat: Prettier для JS/TS, ruff для Python. Форматирование всего проекта или конкретных файлов.',
    extra: {
      syntax: '/autoformat [путь]',
      args: 'Опционально: путь к файлу или директории. По умолчанию — весь проект.',
    },
  },
  {
    title: '/pre-commit-check',
    slug: 'pre-commit-check-command',
    toolType: 'command',
    shortDescription:
      'Проверки перед коммитом: security scan, lint, типы, debug-код. Всё в одной команде.',
    categorySlug: 'bezopasnost',
    tagSlugs: ['commands', 'claude-code', 'quality-gates'],
    description: root([
      heading(2, 'Проверки перед коммитом'),
      paragraph(
        'Команда **/pre-commit-check** запускает полный набор проверок перед коммитом: security scan, линтинг, проверка типов, поиск debug-кода. Одна команда вместо пяти.',
      ),
      list([
        'Security: поиск захардкоженных секретов и уязвимостей',
        'Lint: ESLint, ruff — ошибки и предупреждения',
        'Types: `tsc --noEmit` или `pyright` — ошибки типов',
        'Debug: `console.log`, `debugger`, `print()` — отладочный код',
        'Format: проверка форматирования (без автоисправления)',
      ]),
      paragraph(
        'Если всё чисто — показывает "готово к коммиту". Если есть проблемы — список с severity (Critical/Major/Minor).',
      ),
    ]),
    seoTitle: '/pre-commit-check — проверки перед коммитом',
    seoDescription:
      'Команда /pre-commit-check: security, lint, типы, debug-код. Полный набор проверок перед git commit.',
    extra: {
      syntax: '/pre-commit-check',
      args: 'Без аргументов. Проверяет staged файлы (git diff --staged).',
    },
  },
  {
    title: '/typecheck',
    slug: 'typecheck-command',
    toolType: 'command',
    shortDescription:
      'Проверка типов: tsc для TypeScript, pyright для Python. Показывает ошибки с пояснениями.',
    categorySlug: 'kachestvo-koda',
    tagSlugs: ['commands', 'claude-code', 'typescript'],
    description: root([
      heading(2, 'Проверка типов'),
      paragraph(
        'Команда **/typecheck** запускает проверку типов для проекта. TypeScript — `tsc --noEmit`, Python — `pyright`. Показывает ошибки с пояснениями и предложениями по исправлению.',
      ),
      list([
        'TypeScript: `tsc --noEmit` — все ошибки типов',
        'Python: `pyright` — строгая проверка типов',
        'Автоопределение языка по конфигам проекта',
        'Пояснение каждой ошибки на понятном языке',
        'Предложения по исправлению',
      ]),
      paragraph(
        'Типы — лучший способ поймать баги до запуска. Строгая типизация обязательна для серьёзных проектов.',
      ),
    ]),
    seoTitle: '/typecheck — проверка типов tsc и pyright',
    seoDescription:
      'Команда /typecheck: tsc для TypeScript, pyright для Python. Проверка типов с пояснениями и исправлениями.',
    extra: {
      syntax: '/typecheck [путь]',
      args: 'Опционально: путь к файлу или директории. По умолчанию — весь проект.',
    },
  },
  {
    title: '/vps-setup-framework',
    slug: 'vps-setup-framework-command',
    toolType: 'command',
    shortDescription:
      'Установка Vibe Framework на VPS: hooks, skills, rules, конфиги. Полная настройка Claude Code окружения.',
    categorySlug: 'deploj',
    tagSlugs: ['commands', 'claude-code', 'vibe-coding', 'docker'],
    description: root([
      heading(2, 'Установка Vibe Framework на VPS'),
      paragraph(
        'Команда **/vps-setup-framework** устанавливает полный набор инструментов Vibe Framework на VPS: hooks, skills, rules, конфиги Claude Code. После установки AI работает с полным набором автоматизации.',
      ),
      list([
        'Установка hooks: security-scan, prettier, protect-secrets и др.',
        'Установка skills: docker-deploy, project-knowledge, code-writing',
        'Установка rules: coding-standards, security, automation',
        'Настройка MCP-серверов для SSH-доступа',
        'Конфиги Claude Code: `.claude/settings.json`',
        'Проверка установки: все компоненты на месте',
      ]),
      paragraph(
        'Запускается один раз при настройке нового VPS. После установки все hooks работают автоматически.',
      ),
    ]),
    seoTitle: '/vps-setup-framework — установка Vibe Framework на VPS',
    seoDescription:
      'Команда /vps-setup-framework: hooks, skills, rules, MCP. Полная установка Vibe Framework на VPS.',
    extra: {
      syntax: '/vps-setup-framework [IP или MCP-сервер]',
      args: 'IP-адрес VPS или имя MCP SSH-сервера. Без аргументов — Claude спросит.',
    },
  },
]
