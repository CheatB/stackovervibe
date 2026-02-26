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

export const skillsData: ToolData[] = [
  {
    title: 'aiogram-bot',
    slug: 'aiogram-bot',
    toolType: 'skill',
    shortDescription:
      'Скилл для создания Telegram-ботов на Aiogram v3. Генерирует структуру проекта, хендлеры, FSM, инлайн-кнопки и интеграцию с базой данных.',
    categorySlug: 'instrumenty',
    tagSlugs: ['skills', 'claude-code', 'vibe-coding'],
    description: root([
      heading(2, 'Telegram-боты на Aiogram v3'),
      paragraph(
        'Скилл **aiogram-bot** содержит готовые шаблоны и паттерны для создания Telegram-ботов на Python с использованием Aiogram v3. Включает настроенную структуру проекта, FSM для диалогов, middleware и обработку ошибок.',
      ),
      list([
        'Генерация структуры бота: handlers, middlewares, keyboards, states',
        'FSM-диалоги с валидацией пользовательского ввода',
        'Инлайн и reply клавиатуры с callback-обработчиками',
        'Интеграция с PostgreSQL через SQLAlchemy async',
        'Docker-конфиг для деплоя бота на VPS',
      ]),
      paragraph(
        'Claude подключает этот скилл автоматически, когда задача связана с Telegram-ботами. Все шаблоны адаптированы под Aiogram v3 — старые версии не поддерживаются.',
      ),
    ]),
    seoTitle: 'aiogram-bot — скилл для Telegram-ботов на Aiogram v3',
    seoDescription:
      'Скилл aiogram-bot для Claude Code: создание Telegram-ботов на Aiogram v3. Структура проекта, FSM, клавиатуры, интеграция с БД.',
    extra: {
      workflow: root([
        heading(3, 'Workflow'),
        list(
          [
            'Claude анализирует задачу и определяет тип бота (утилита, магазин, Q&A)',
            'Генерируется структура: `bot/handlers/`, `bot/keyboards/`, `bot/states/`',
            'Создаются хендлеры для каждого сценария с FSM-состояниями',
            'Настраивается middleware: логирование, rate-limit, авторизация',
            'Добавляется `docker-compose.yml` + `.env.example` для деплоя',
          ],
          true,
        ),
      ]),
      examples: root([
        heading(3, 'Примеры использования'),
        paragraph('Создай Telegram-бота для записи на стрижку с выбором мастера и даты.'),
        paragraph(
          'Сделай бота-помощника для управления задачами: добавление, удаление, список, напоминания.',
        ),
      ]),
    },
  },
  {
    title: 'telegram-post-style',
    slug: 'telegram-post-style',
    toolType: 'skill',
    shortDescription:
      'Скилл для написания постов в Telegram-канал. Определяет тон, структуру и форматирование — от заголовка до CTA.',
    categorySlug: 'protsessy',
    tagSlugs: ['skills', 'vibe-coding'],
    description: root([
      heading(2, 'Стиль постов для Telegram-канала'),
      paragraph(
        'Скилл **telegram-post-style** задаёт формат и тон публикаций в Telegram. Claude пишет посты в указанном стиле: живой язык, конкретика, короткие абзацы, markdown-разметка.',
      ),
      list([
        'Структура: цепляющий заголовок + суть + детали + CTA',
        'Форматирование: **жирный** для ключевых мыслей, `код` для терминов',
        'Длина: 500-1500 символов (оптимум для Telegram)',
        'Тон: экспертный, но без занудства — как объясняешь другу',
      ]),
      quote(
        'Хороший пост в Telegram — это не статья. Это мысль, которую хочется переслать.',
      ),
    ]),
    seoTitle: 'telegram-post-style — стиль постов для Telegram-канала',
    seoDescription:
      'Скилл telegram-post-style: как Claude пишет посты для Telegram-каналов. Тон, структура, форматирование и CTA.',
    extra: {
      workflow: root([
        heading(3, 'Workflow'),
        list(
          [
            'Определи тему и ключевую мысль поста',
            'Claude генерирует заголовок (цепляющий, без кликбейта)',
            'Основной текст: короткие абзацы, конкретные примеры',
            'CTA в конце: вопрос, ссылка или призыв к обсуждению',
            'Финальная полировка: убираем воду, добавляем эмодзи-маркеры',
          ],
          true,
        ),
      ]),
      examples: root([
        heading(3, 'Примеры использования'),
        paragraph('Напиши пост про hooks в Claude Code — почему они лучше правил в CLAUDE.md'),
        paragraph('Сделай анонс нового проекта для Telegram-канала о вайбкодинге'),
      ]),
    },
  },
  {
    title: 'new-project',
    slug: 'new-project',
    toolType: 'skill',
    shortDescription:
      'Шаблон нового проекта: структура директорий, конфиги, Docker, git, CLAUDE.md и Project Knowledge.',
    categorySlug: 'protsessy',
    tagSlugs: ['skills', 'claude-code', 'project-knowledge', 'docker'],
    description: root([
      heading(2, 'Шаблон нового проекта'),
      paragraph(
        'Скилл **new-project** генерирует полную структуру проекта с нуля. Включает конфиги, Docker, git-инициализацию, CLAUDE.md и шаблоны Project Knowledge.',
      ),
      list([
        'Структура проекта по стандарту Vibe Framework',
        '`CLAUDE.md` с секцией ПРОГРЕСС и ссылками на docs',
        '`docker-compose.yml` + `Dockerfile` (multi-stage build)',
        '`.env.example` со всеми переменными окружения',
        'Project Knowledge: `project.md`, `architecture.md`, `patterns.md`, `deployment.md`',
        '`backlog/BACKLOG.md` — шаблон бэклога',
      ]),
      paragraph(
        'Используется командой `/new-project` как стартовая точка для фазы 0. Claude адаптирует шаблон под конкретный стек и тип проекта.',
      ),
    ]),
    seoTitle: 'new-project — шаблон нового проекта Vibe Framework',
    seoDescription:
      'Скилл new-project: генерация структуры проекта. Docker, CLAUDE.md, Project Knowledge, git, конфиги — всё из коробки.',
    extra: {
      workflow: root([
        heading(3, 'Workflow'),
        list(
          [
            'Claude спрашивает стек: язык, фреймворк, база данных',
            'Генерируется дерево директорий по стандарту',
            'Создаются конфиги: `tsconfig.json`, `package.json`, `.eslintrc`, `.prettierrc`',
            'Docker: `Dockerfile` + `docker-compose.yml` + `.dockerignore`',
            'Документация: CLAUDE.md + Project Knowledge шаблоны',
          ],
          true,
        ),
      ]),
      examples: root([
        heading(3, 'Примеры использования'),
        paragraph('Создай проект на Next.js 15 + Payload CMS + PostgreSQL для блога.'),
        paragraph('Новый проект: FastAPI + SQLAlchemy + Redis, Telegram-бот для доставки еды.'),
      ]),
    },
  },
  {
    title: 'project-launcher',
    slug: 'project-launcher',
    toolType: 'skill',
    shortDescription:
      'Полный пайплайн /new-project: от настройки VPS до деплоя через 7 фаз. Оркестрирует весь процесс создания проекта.',
    categorySlug: 'protsessy',
    tagSlugs: ['skills', 'claude-code', 'vibe-coding', 'agents'],
    description: root([
      heading(2, 'Полный пайплайн создания проекта'),
      paragraph(
        'Скилл **project-launcher** реализует команду `/new-project` — непрерывный поток из 7 фаз: от настройки VPS до финального деплоя. Оркестрирует субагентов, валидаторов и Quality Gates.',
      ),
      list([
        'Фаза 0: Подготовка инфраструктуры (VPS, Docker, Nginx, SSL)',
        'Фаза 1: User Spec — глубинное интервью с бизнес-аналитиком',
        'Фаза 2: Tech Spec — техническое интервью с системным аналитиком',
        'Фаза 3: Декомпозиция на задачи (wave-параллелизм)',
        'Фаза 4: Реализация (Team Lead + субагенты на Sonnet)',
        'Фаза 5: Тестирование (14 проверок)',
        'Фаза 6: Финализация (QA + Deploy + Docs)',
      ]),
      quote(
        'Одна команда — весь проект. ИИ сам переключает фазы, показывая результат для подтверждения.',
      ),
    ]),
    seoTitle: 'project-launcher — полный пайплайн создания проекта',
    seoDescription:
      'Скилл project-launcher: 7 фаз от VPS до деплоя. User Spec, Tech Spec, декомпозиция, реализация, тесты — всё автоматически.',
    extra: {
      workflow: root([
        heading(3, 'Workflow'),
        list(
          [
            'Пользователь вызывает `/new-project` и описывает идею',
            'Фаза 0: VPS настройка (если нужна) или подготовка Docker',
            'Фаза 1-2: Бизнес- и системный аналитик проводят глубинное интервью',
            'Фаза 3: task-creator разбивает на задачи, dependency-validator проверяет',
            'Фаза 4: Team Lead распределяет задачи по волнам, субагенты пишут код',
            'Фаза 5-6: тесты → QA → деплой → документация',
          ],
          true,
        ),
      ]),
      examples: root([
        heading(3, 'Примеры использования'),
        paragraph('/new-project — хочу сделать SaaS для учёта расходов с Telegram-ботом'),
        paragraph('/new-project — база знаний по вайбкодингу в ретро-хакерском стиле'),
      ]),
    },
  },
  {
    title: 'project-knowledge',
    slug: 'project-knowledge',
    toolType: 'skill',
    shortDescription:
      'Создание и обновление документации проекта: project.md, architecture.md, patterns.md, deployment.md.',
    categorySlug: 'upravlenie',
    tagSlugs: ['skills', 'project-knowledge', 'claude-code'],
    description: root([
      heading(2, 'Документация проекта'),
      paragraph(
        'Скилл **project-knowledge** генерирует и поддерживает актуальную документацию проекта. 4 обязательных файла — единый источник правды, который AI читает при каждой сессии.',
      ),
      list([
        '`project.md` — что и зачем: проблема, аудитория, ключевые фичи, MVP scope',
        '`architecture.md` — как устроено: стек (и ПОЧЕМУ), структура, модель данных',
        '`patterns.md` — как работаем: git workflow, стандарты кода, тестирование',
        '`deployment.md` — как деплоим: VPS, Docker, CI/CD, мониторинг',
      ]),
      paragraph(
        'Философия: открыл документацию — понял проект без чтения кода. Никакого кода в документации, только ссылки на файлы.',
      ),
    ]),
    seoTitle: 'project-knowledge — документация проекта для AI',
    seoDescription:
      'Скилл project-knowledge: project.md, architecture.md, patterns.md, deployment.md. Единый источник правды о проекте.',
    extra: {
      workflow: root([
        heading(3, 'Workflow'),
        list(
          [
            'Claude анализирует кодовую базу и существующую документацию',
            'Генерирует/обновляет 4 файла Project Knowledge',
            'Убирает блоки кода — только ссылки на файлы с номерами строк',
            'Удаляет дублирование — информация в ОДНОМ месте',
            'Каждый файл < 5KB, секция > 80 строк → выносит в отдельный файл',
          ],
          true,
        ),
      ]),
      examples: root([
        heading(3, 'Примеры использования'),
        paragraph('Сгенерируй Project Knowledge для текущего проекта.'),
        paragraph('Обнови architecture.md — мы добавили Redis и WebSocket.'),
      ]),
    },
  },
  {
    title: 'feature-execution',
    slug: 'feature-execution',
    toolType: 'skill',
    shortDescription:
      'Team Lead оркестрирует параллельные задачи. Wave-параллелизм: группировка по зависимостям, субагенты на Sonnet.',
    categorySlug: 'upravlenie',
    tagSlugs: ['skills', 'agents', 'wave-parallelism', 'claude-code'],
    description: root([
      heading(2, 'Team Lead: оркестрация задач'),
      paragraph(
        'Скилл **feature-execution** превращает Claude в Team Lead, который координирует параллельное выполнение задач. Opus думает, Sonnet пишет код — каждый делает то, что умеет лучше.',
      ),
      list([
        'Wave-параллелизм: группировка задач по зависимостям в волны',
        'Субагенты на Sonnet выполняют задачи параллельно (5x дешевле Opus)',
        'Чекпоинты между волнами: проверка, интеграция, следующая волна',
        'Контроль качества: code-reviewer проверяет каждый блок',
        'Эскалация к человеку после 3 неудачных попыток',
      ]),
      paragraph(
        'Используется автоматически на уровне Epic и Feature. Для Quick Fix субагенты не подключаются.',
      ),
    ]),
    seoTitle: 'feature-execution — Team Lead оркестрация задач',
    seoDescription:
      'Скилл feature-execution: wave-параллелизм, субагенты на Sonnet, чекпоинты. Team Lead координирует разработку.',
    extra: {
      workflow: root([
        heading(3, 'Workflow'),
        list(
          [
            'Team Lead получает список задач с зависимостями',
            'Группирует задачи в волны (wave 1: без зависимостей, wave 2: зависят от wave 1...)',
            'Запускает субагентов параллельно для каждой волны',
            'Чекпоинт: ревью, интеграция, тесты',
            'Следующая волна или эскалация при проблемах',
          ],
          true,
        ),
      ]),
      examples: root([
        heading(3, 'Примеры использования'),
        paragraph('Реализуй 12 задач из tech-spec параллельно с wave-декомпозицией.'),
        paragraph('Добавь авторизацию + профиль + настройки — разбей на волны и выполни.'),
      ]),
    },
  },
  {
    title: 'code-writing',
    slug: 'code-writing',
    toolType: 'skill',
    shortDescription:
      'TDD-цикл разработки: план -> тесты -> код -> ревью. Сначала пишем тесты (RED), потом код (GREEN), потом рефакторим.',
    categorySlug: 'kachestvo-koda',
    tagSlugs: ['skills', 'tdd', 'claude-code', 'quality-gates'],
    description: root([
      heading(2, 'TDD-цикл: plan -> tests -> code -> reviews'),
      paragraph(
        'Скилл **code-writing** задаёт цикл разработки через TDD. Код не пишется без тестов, тесты не пишутся без плана. Каждый шаг проходит через ревью.',
      ),
      list([
        'Plan: Claude анализирует задачу и составляет план реализации',
        'Tests (RED): пишет тесты, которые пока падают',
        'Code (GREEN): пишет минимальный код для прохождения тестов',
        'Refactor: убирает дублирование, улучшает читаемость',
        'Review: code-reviewer + anti-mirage проверяют результат',
      ]),
      quote(
        'Тесты сразу — в той же сессии, до перехода к следующей задаче. Не откладывай.',
      ),
    ]),
    seoTitle: 'code-writing — TDD-цикл разработки в Claude Code',
    seoDescription:
      'Скилл code-writing: TDD-подход в вайбкодинге. План, тесты (RED), код (GREEN), рефакторинг, ревью.',
    extra: {
      workflow: root([
        heading(3, 'Workflow'),
        list(
          [
            'Анализ задачи: что нужно сделать, какие edge cases',
            'Написание тестов: каждый тест проверяет одну вещь',
            'Запуск тестов — убедиться, что они падают (RED)',
            'Написание минимального кода для прохождения тестов (GREEN)',
            'Рефакторинг: DRY, KISS, чистый код',
            'Ревью: code-reviewer проверяет результат',
          ],
          true,
        ),
      ]),
      examples: root([
        heading(3, 'Примеры использования'),
        paragraph('Напиши функцию расчёта скидки с TDD-подходом.'),
        paragraph('Реализуй API авторизации через TDD: тесты -> код -> ревью.'),
      ]),
    },
  },
  {
    title: 'testing',
    slug: 'testing',
    toolType: 'skill',
    shortDescription:
      'Стратегия тестирования проекта: пирамида тестов, покрытие, когда какие тесты писать и как избежать избыточности.',
    categorySlug: 'testirovanie',
    tagSlugs: ['skills', 'tdd', 'quality-gates', 'claude-code'],
    description: root([
      heading(2, 'Стратегия тестирования'),
      paragraph(
        'Скилл **testing** определяет стратегию тестирования для проекта. Пирамида тестов, decision framework для выбора типа тестов, правила моков и защита от избыточного тестирования.',
      ),
      list([
        'Smoke-тесты: фреймворк работает, env vars доступны (при setup)',
        'Unit-тесты: бизнес-логика, валидация, трансформация данных',
        'Интеграционные: API-эндпоинты, работа с БД, внешние сервисы',
        'E2E: топ 3-5 критичных сценариев (авторизация, платежи)',
        'Decision framework: нужны ли тесты? Какого уровня?',
      ]),
      paragraph(
        'Правило моков: unit — мокаем БД и API, integration — реальная тестовая БД, E2E — всё реальное. Если >3 моков в unit-тесте — нужен integration.',
      ),
    ]),
    seoTitle: 'testing — стратегия тестирования проекта',
    seoDescription:
      'Скилл testing: пирамида тестов, decision framework, правила моков. Когда и какие тесты писать в вайбкодинге.',
    extra: {
      workflow: root([
        heading(3, 'Workflow'),
        list(
          [
            'Claude анализирует задачу через decision framework',
            'Определяет нужный уровень: unit / integration / E2E',
            'Пишет тесты по пирамиде: много unit, среднее integration, мало E2E',
            'Проверяет покрытие: минимум 80% для бизнес-логики',
            'Удаляет избыточные тесты: если удаление не снижает уверенность — тест лишний',
          ],
          true,
        ),
      ]),
      examples: root([
        heading(3, 'Примеры использования'),
        paragraph('Составь стратегию тестирования для API на FastAPI с PostgreSQL.'),
        paragraph('Какие тесты нужны для нового модуля оплаты?'),
      ]),
    },
  },
  {
    title: 'api-design',
    slug: 'api-design',
    toolType: 'skill',
    shortDescription:
      'Проектирование REST и WebSocket API: эндпоинты, схемы, валидация, версионирование, документация.',
    categorySlug: 'instrumenty',
    tagSlugs: ['skills', 'claude-code', 'typescript'],
    description: root([
      heading(2, 'Проектирование REST/WebSocket API'),
      paragraph(
        'Скилл **api-design** помогает спроектировать API до написания кода. Эндпоинты, схемы запросов/ответов, коды ошибок, валидация и документация — всё в одном месте.',
      ),
      list([
        'REST: ресурсо-ориентированные URL, правильные HTTP-методы',
        'Схемы: request/response body с типами и валидацией',
        'Ошибки: стандартизированный формат, коды и сообщения',
        'Пагинация: offset или cursor-based для больших списков',
        'Версионирование: `/api/v1/` для обратной совместимости',
        'WebSocket: события, подписки, reconnect-стратегия',
      ]),
      paragraph(
        'Claude генерирует полную спецификацию API, которую можно использовать для тестов и документации.',
      ),
    ]),
    seoTitle: 'api-design — проектирование REST и WebSocket API',
    seoDescription:
      'Скилл api-design: REST-эндпоинты, схемы, валидация, пагинация, WebSocket. Проектирование API до написания кода.',
    extra: {
      workflow: root([
        heading(3, 'Workflow'),
        list(
          [
            'Определение ресурсов и их связей',
            'Проектирование эндпоинтов: URL, методы, параметры',
            'Описание request/response schemas с типами',
            'Определение кодов ошибок и сообщений',
            'Выбор стратегии пагинации и фильтрации',
            'Генерация документации (OpenAPI / Swagger)',
          ],
          true,
        ),
      ]),
      examples: root([
        heading(3, 'Примеры использования'),
        paragraph('Спроектируй REST API для маркетплейса: товары, заказы, пользователи.'),
        paragraph('Нужен WebSocket API для чата с историей сообщений и уведомлениями.'),
      ]),
    },
  },
  {
    title: 'frontend-design',
    slug: 'frontend-design',
    toolType: 'skill',
    shortDescription:
      'UI/UX-дизайн и паттерны: компоненты, layout, адаптивность, доступность, анимации.',
    categorySlug: 'instrumenty',
    tagSlugs: ['skills', 'claude-code', 'typescript', 'vibe-coding'],
    description: root([
      heading(2, 'UI/UX-дизайн и паттерны'),
      paragraph(
        'Скилл **frontend-design** содержит паттерны и рекомендации для создания пользовательских интерфейсов. Компоненты, layout, адаптивность, доступность — всё, что нужно фронтендеру.',
      ),
      list([
        'Компонентный подход: атомарный дизайн (atoms → molecules → organisms)',
        'Layout: CSS Grid + Flexbox, mobile-first адаптивность',
        'Доступность: семантический HTML, ARIA, keyboard navigation',
        'Анимации: `reduced-motion` для чувствительных пользователей',
        'Тёмная тема: CSS переменные, системные предпочтения',
      ]),
      paragraph(
        'Claude подключает этот скилл для задач, связанных с UI. Работает в связке с `interface-design` для полного покрытия.',
      ),
    ]),
    seoTitle: 'frontend-design — UI/UX-дизайн и паттерны',
    seoDescription:
      'Скилл frontend-design: компоненты, layout, адаптивность, доступность, анимации. UI/UX-паттерны для вайбкодинга.',
    extra: {
      workflow: root([
        heading(3, 'Workflow'),
        list(
          [
            'Анализ макета или описания интерфейса',
            'Декомпозиция на компоненты: атомы → молекулы → организмы',
            'Выбор layout-стратегии: Grid, Flexbox, позиционирование',
            'Реализация адаптивности: mobile-first, breakpoints',
            'Проверка доступности: семантика, контрастность, навигация',
          ],
          true,
        ),
      ]),
      examples: root([
        heading(3, 'Примеры использования'),
        paragraph('Сделай dashboard с сайдбаром, картами метрик и графиками.'),
        paragraph('Нужна карточка товара: фото, цена, кнопка "Купить", адаптивная.'),
      ]),
    },
  },
  {
    title: 'interface-design',
    slug: 'interface-design',
    toolType: 'skill',
    shortDescription:
      'Проектирование пользовательских интерфейсов: user flows, wireframes, информационная архитектура, навигация.',
    categorySlug: 'instrumenty',
    tagSlugs: ['skills', 'claude-code', 'vibe-coding'],
    description: root([
      heading(2, 'Проектирование интерфейсов'),
      paragraph(
        'Скилл **interface-design** отвечает за высокоуровневое проектирование интерфейсов. Не код и компоненты, а user flows, информационная архитектура и навигация.',
      ),
      list([
        'User flows: путь пользователя от входа до целевого действия',
        'Информационная архитектура: структура контента, иерархия',
        'Навигация: главное меню, breadcrumbs, поиск, фильтры',
        'Wireframes: низкодетальные макеты экранов',
        'Микровзаимодействия: состояния кнопок, загрузка, ошибки',
      ]),
      paragraph(
        'Работает в связке с `frontend-design`: сначала проектируем (interface-design), потом реализуем (frontend-design).',
      ),
    ]),
    seoTitle: 'interface-design — проектирование интерфейсов',
    seoDescription:
      'Скилл interface-design: user flows, wireframes, информационная архитектура. Проектирование UI до реализации.',
    extra: {
      workflow: root([
        heading(3, 'Workflow'),
        list(
          [
            'Определение целевых действий пользователя',
            'Построение user flow: шаги, ветвления, ошибки',
            'Проектирование информационной архитектуры',
            'Создание wireframes (текстовое описание экранов)',
            'Определение навигации и переходов между экранами',
          ],
          true,
        ),
      ]),
      examples: root([
        heading(3, 'Примеры использования'),
        paragraph('Спроектируй user flow для регистрации через Telegram и onboarding.'),
        paragraph('Нужна информационная архитектура для базы знаний с категориями и тегами.'),
      ]),
    },
  },
  {
    title: 'security-auditor',
    slug: 'security-auditor',
    toolType: 'skill',
    shortDescription:
      'OWASP-методология аудита безопасности: сканирование кода, поиск уязвимостей, рекомендации по исправлению.',
    categorySlug: 'bezopasnost',
    tagSlugs: ['skills', 'claude-code', 'quality-gates'],
    description: root([
      heading(2, 'Аудит безопасности по OWASP'),
      paragraph(
        'Скилл **security-auditor** проводит аудит кода по методологии OWASP. Сканирует на типичные уязвимости: SQL-инъекции, XSS, захардкоженные секреты, небезопасные зависимости.',
      ),
      list([
        'SQL Injection: поиск конкатенации строк в SQL-запросах',
        'XSS: проверка санитизации пользовательского ввода',
        'Secrets: поиск API-ключей, токенов, паролей в коде',
        'Dependencies: `npm audit` / `pip-audit` на уязвимости',
        'Auth: проверка JWT, session, CORS, rate limiting',
        'Input validation: белые списки вместо чёрных',
      ]),
      paragraph(
        'Подключается автоматически в Quality Gate 2 для security-sensitive кода (авторизация, платежи, работа с данными).',
      ),
    ]),
    seoTitle: 'security-auditor — OWASP аудит безопасности кода',
    seoDescription:
      'Скилл security-auditor: сканирование на SQLi, XSS, утечки секретов. OWASP-методология аудита для вайбкодинга.',
    extra: {
      workflow: root([
        heading(3, 'Workflow'),
        list(
          [
            'Сканирование кодовой базы на паттерны уязвимостей',
            'Проверка зависимостей через `npm audit` / `pip-audit`',
            'Анализ конфигов: CORS, CSP, rate limiting',
            'Проверка обработки ошибок (не утекают ли стектрейсы)',
            'Генерация отчёта: Critical / Major / Minor',
            'Рекомендации по исправлению с примерами',
          ],
          true,
        ),
      ]),
      examples: root([
        heading(3, 'Примеры использования'),
        paragraph('Проведи аудит безопасности перед деплоем на продакшен.'),
        paragraph('Проверь модуль авторизации на уязвимости.'),
      ]),
    },
  },
  {
    title: 'backlog-management',
    slug: 'backlog-management',
    toolType: 'skill',
    shortDescription:
      'Управление бэклогом проекта: добавление задач, приоритизация, статусы, типы. Всё, что "потом" — в бэклог.',
    categorySlug: 'upravlenie',
    tagSlugs: ['skills', 'backlog', 'claude-code', 'vibe-coding'],
    description: root([
      heading(2, 'Управление бэклогом'),
      paragraph(
        'Скилл **backlog-management** реализует систему бэклога из Vibe Framework. Нерешённый вопрос — в бэклог. Отложенный тест — в бэклог. Идея на будущее — в бэклог. Ничего не теряется.',
      ),
      list([
        'Типы: `feature`, `bug`, `tech-debt`, `question`, `idea`',
        'Приоритеты: `critical`, `high`, `medium`, `low`',
        'Статусы: `new`, `in-progress`, `blocked`, `done`',
        'Приоритизация через AI: RICE-скоринг (Reach, Impact, Confidence, Effort)',
        'Привязка к фазам проекта: что делать сейчас, что отложить',
      ]),
      paragraph(
        'Бэклог живёт в `backlog/BACKLOG.md` и обновляется после каждого блока задач. Команды `/backlog`, `/backlog add`, `/backlog prioritize`.',
      ),
    ]),
    seoTitle: 'backlog-management — управление бэклогом проекта',
    seoDescription:
      'Скилл backlog-management: задачи, приоритизация RICE, статусы. Бэклог проекта в вайбкодинге — ничего не теряется.',
    extra: {
      workflow: root([
        heading(3, 'Workflow'),
        list(
          [
            'Ввод задачи: тип, описание, приоритет',
            'Приоритизация: RICE-скоринг или ручной приоритет',
            'Группировка: по фазам, модулям, типам',
            'Ревью бэклога: еженедельно или перед новой фазой',
            'Перенос в задачи: из бэклога → в `tasks.md` текущей волны',
          ],
          true,
        ),
      ]),
      examples: root([
        heading(3, 'Примеры использования'),
        paragraph('/backlog add feature "Добавить экспорт в PDF" --priority high'),
        paragraph('/backlog prioritize — AI пересортирует бэклог по RICE-скору'),
      ]),
    },
  },
  {
    title: 'docker-deploy',
    slug: 'docker-deploy',
    toolType: 'skill',
    shortDescription:
      'Деплой на VPS через Docker: multi-stage build, docker-compose, Nginx reverse proxy, SSL, health checks.',
    categorySlug: 'deploj',
    tagSlugs: ['skills', 'docker', 'nginx', 'ssl'],
    description: root([
      heading(2, 'Деплой на VPS через Docker'),
      paragraph(
        'Скилл **docker-deploy** покрывает весь процесс деплоя: от `Dockerfile` до работающего приложения за Nginx с SSL. Multi-stage build для минимального образа, health checks, автоматический рестарт.',
      ),
      list([
        'Dockerfile: multi-stage build (build → production, минимальный образ)',
        'docker-compose.yml: app + postgres + redis (если нужен)',
        'Nginx: reverse proxy на Docker-контейнер, gzip, кэширование статики',
        'SSL: Let\'s Encrypt через certbot, автообновление',
        'Health checks: `/health` эндпоинт, `restart: unless-stopped`',
        'Volumes: данные БД, загруженные файлы, логи',
      ]),
      paragraph(
        'Используется командой `/deploy` и в Фазе 6 пайплайна `/new-project`. Поддерживает rollback через `git revert` + пересборку.',
      ),
    ]),
    seoTitle: 'docker-deploy — деплой на VPS через Docker',
    seoDescription:
      'Скилл docker-deploy: Dockerfile, docker-compose, Nginx, SSL. Полный деплой приложения на VPS через Docker.',
    extra: {
      workflow: root([
        heading(3, 'Workflow'),
        list(
          [
            'Создание/обновление `Dockerfile` (multi-stage build)',
            'Настройка `docker-compose.yml` с сервисами',
            'Конфигурация Nginx: reverse proxy + SSL',
            'Деплой: `docker compose up -d --build`',
            'Проверка: health check, логи, статус контейнеров',
            'При ошибке: Auto-Fix Pipeline (макс 3 попытки → revert)',
          ],
          true,
        ),
      ]),
      examples: root([
        heading(3, 'Примеры использования'),
        paragraph('Задеплой текущий проект на VPS 109.172.36.108 через Docker.'),
        paragraph('Обнови деплой: пересобери образ и рестартни контейнеры.'),
      ]),
    },
  },
  {
    title: 'vps-quick-setup',
    slug: 'vps-quick-setup',
    toolType: 'skill',
    shortDescription:
      'Быстрая настройка VPS: безопасность, Docker, Nginx, SSL, файрвол, fail2ban — за одну сессию.',
    categorySlug: 'deploj',
    tagSlugs: ['skills', 'docker', 'nginx', 'ssl'],
    description: root([
      heading(2, 'Быстрая настройка VPS'),
      paragraph(
        'Скилл **vps-quick-setup** настраивает VPS с нуля за одну сессию. Безопасность, Docker, Nginx как reverse proxy, SSL через Let\'s Encrypt — всё по чеклисту.',
      ),
      list([
        'Безопасность: отключение root-логина, SSH по ключу, fail2ban',
        'Файрвол: UFW с правилами для SSH (22), HTTP (80), HTTPS (443)',
        'Docker + docker-compose v2: установка и настройка',
        'Nginx: установка, базовый конфиг, sites-enabled',
        'SSL: certbot, автообновление через cron',
        'Пользователь `deploy` с sudo-правами',
      ]),
      paragraph(
        'Используется в Фазе 0 пайплайна `/new-project`. Подключается через MCP SSH-серверы к VPS.',
      ),
    ]),
    seoTitle: 'vps-quick-setup — настройка VPS за одну сессию',
    seoDescription:
      'Скилл vps-quick-setup: безопасность, Docker, Nginx, SSL, fail2ban. Настройка VPS с нуля для деплоя приложений.',
    extra: {
      workflow: root([
        heading(3, 'Workflow'),
        list(
          [
            'Подключение к VPS через SSH (MCP-сервер)',
            'Обновление системы: `apt update && apt upgrade`',
            'Создание пользователя `deploy`, настройка SSH-ключей',
            'Установка Docker + docker-compose',
            'Настройка UFW: SSH, HTTP, HTTPS',
            'Установка Nginx + certbot для SSL',
            'Проверка: все сервисы работают, порты открыты',
          ],
          true,
        ),
      ]),
      examples: root([
        heading(3, 'Примеры использования'),
        paragraph('Настрой новый VPS 45.92.174.136 для деплоя Python-приложения.'),
        paragraph('Подготовь сервер: Docker, Nginx, SSL для домена myapp.ru.'),
      ]),
    },
  },
]
