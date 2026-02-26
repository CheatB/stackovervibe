import { heading, paragraph, list, quote, codeBlock, hr, root } from '../lexical'

export interface AnswerData {
  body: ReturnType<typeof root>
  isAccepted: boolean
}

export interface QuestionData {
  title: string
  slug: string
  categorySlug: string
  tagSlugs: string[]
  body: ReturnType<typeof root>
  seoTitle: string
  seoDescription: string
  answers: AnswerData[]
}

export const questionsData: QuestionData[] = [
  // ─── 1. Что такое вайбкодинг ───
  {
    title: 'Что такое вайбкодинг и чем отличается от обычного программирования?',
    slug: 'chto-takoe-vajbkoding-otlichiya',
    categorySlug: 'osnovy',
    tagSlugs: ['vibe-coding', 'claude-code'],
    seoTitle: 'Что такое вайбкодинг — отличия от программирования',
    seoDescription:
      'Вайбкодинг — создание приложений с AI. Чем отличается от классического программирования, концепция Мозг+Руки и почему это не замена, а усиление.',
    body: root([
      paragraph(
        'Часто слышу термин «вайбкодинг» — кто-то говорит, что это будущее разработки, кто-то называет модным словом для копипасты из ChatGPT.',
      ),
      paragraph(
        'Хочется понять: **что конкретно** стоит за этим понятием и чем оно принципиально отличается от обычного программирования?',
      ),
    ]),
    answers: [
      {
        isAccepted: true,
        body: root([
          paragraph(
            'Вайбкодинг — это подход к созданию приложений, при котором **AI пишет код, а ты проектируешь**. Ключевая концепция: **Мозг + Руки**.',
          ),
          heading(3, 'Мозг (Фреймворк)'),
          paragraph(
            'Ты решаешь *что* делать: описываешь архитектуру в `CLAUDE.md`, задаёшь правила в `rules/`, определяешь workflow-маркеры. Это стратегия — ЧТО проверять, КОГДА запускать, КАКОЙ режим выбрать.',
          ),
          heading(3, 'Руки (Инструменты)'),
          paragraph(
            'AI выполняет *как* делать: hooks, agents, plugins, skills, commands — конкретные инструменты, которые сканируют, форматируют, ревьюят и пишут код.',
          ),
          hr(),
          paragraph(
            'Главное отличие от классического программирования: ты не пишешь каждую строку вручную, а **управляешь процессом**. Чистый промпт-инжиниринг (простыня текста в ChatGPT) не работает — контекстное окно конечно, модель «забывает» правила, нет гарантий выполнения. Вайбкодинг решает это через автоматизацию: hooks работают автоматически, агенты подключаются по требованию, plugins дают доступ к реальным данным.',
          ),
          quote(
            'Вайбкодинг — это не замена программиста, а его усиление. Ты остаёшься мозгом, AI становится руками.',
          ),
        ]),
      },
    ],
  },

  // ─── 2. Как начать вайбкодить с нуля ───
  {
    title: 'Как начать вайбкодить с нуля?',
    slug: 'kak-nachat-vajbkodit-s-nulya',
    categorySlug: 'osnovy',
    tagSlugs: ['vibe-coding', 'claude-code'],
    seoTitle: 'Как начать вайбкодить — пошаговый гайд',
    seoDescription:
      'Пошаговый план старта в вайбкодинге: установка Claude Code, настройка CLAUDE.md, основы терминала и первый проект с AI.',
    body: root([
      paragraph(
        'Хочу попробовать вайбкодинг, но не понимаю с чего начать. Нужен ли опыт программирования? Какие инструменты ставить?',
      ),
      paragraph(
        'Интересует конкретный пошаговый план — от нуля до первого рабочего проекта.',
      ),
    ]),
    answers: [
      {
        isAccepted: true,
        body: root([
          paragraph(
            'Опыт программирования **не обязателен**, но базовое понимание терминала и структуры проекта сильно поможет. Вот пошаговый план:',
          ),
          heading(3, 'Шаг 1: Установи инструменты'),
          list([
            '**Claude Code** — CLI от Anthropic (основной инструмент)',
            '**VS Code** или любой редактор — для просмотра кода',
            '**Git** — для контроля версий (Claude сам коммитит)',
            '**Docker** — для деплоя (не обязательно на старте)',
          ]),
          heading(3, 'Шаг 2: Создай CLAUDE.md'),
          paragraph(
            'Это файл в корне проекта, который описывает правила для AI. Минимум: название проекта, стек, ссылка на документацию. `CLAUDE.md` — это НЕ простыня на 500 строк, а указатель на Project Knowledge.',
          ),
          heading(3, 'Шаг 3: Начни с маленького проекта'),
          paragraph(
            'Не берись сразу за SaaS на 50 экранов. Начни с бота, лендинга или CLI-утилиты. Команда `/new-project` запускает полный пайплайн: от спецификации до деплоя.',
          ),
          heading(3, 'Шаг 4: Освой 4 уровня работы'),
          list([
            '**Фикс** (5-15 мин) — быстро почини баг: `/bug-fix`',
            '**Фича** (15-60 мин) — brainstorm, план, реализация: `/ship`',
            '**Эпик** (1-4 часа) — wave-параллелизм, команда агентов',
            '**Проект** (дни) — полный пайплайн с нуля: `/new-project`',
          ]),
          quote(
            'Главное правило: промпт = конкретика. Не «сделай авторизацию», а конкретный стек, файлы, формат токенов.',
          ),
        ]),
      },
    ],
  },

  // ─── 3. Opus vs Sonnet ───
  {
    title: 'Opus vs Sonnet — когда какую модель использовать?',
    slug: 'opus-vs-sonnet-kogda-kakuyu-model',
    categorySlug: 'osnovy',
    tagSlugs: ['opus', 'sonnet', 'claude-code'],
    seoTitle: 'Opus vs Sonnet — выбор модели Claude Code',
    seoDescription:
      'Сравнение Opus и Sonnet в Claude Code: когда использовать какую модель, стоимость, use cases. Opus думает, Sonnet пишет, Haiku проверяет.',
    body: root([
      paragraph(
        'В Claude Code есть Opus, Sonnet и Haiku. Opus стоит в 5 раз дороже — когда его использование оправдано?',
      ),
      paragraph(
        'Хочу понять стратегию выбора модели, чтобы не переплачивать за рутину и не экономить на архитектуре.',
      ),
    ]),
    answers: [
      {
        isAccepted: true,
        body: root([
          paragraph('Золотое правило: **Opus думает, Sonnet пишет, Haiku проверяет.**'),
          heading(3, 'Когда Opus (дорогая)'),
          list([
            'Архитектура и планирование — проектирование системы с нуля',
            'Сложная логика — запутанные бизнес-правила, edge cases',
            'Код-ревью — глубокий анализ по 10 измерениям',
            'Team Lead в агентных командах — координация субагентов',
          ]),
          heading(3, 'Когда Sonnet (базовая, в 5 раз дешевле)'),
          list([
            'Рутинная реализация — CRUD, хендлеры, миграции',
            'Написание тестов — по TDD-якорям из спецификации',
            'Субагенты (Teammates) — параллельное выполнение задач в волнах',
            'Простой рефакторинг — переименование, вынос функций',
          ]),
          heading(3, 'Когда Haiku (самая дешёвая)'),
          list([
            'Простые правки — опечатки, форматирование',
            'Быстрые проверки — линтинг, валидация формата',
            'Автоматические хуки — работа не требующая «мышления»',
          ]),
          hr(),
          paragraph(
            'На практике: PM (Plan Mode) на Opus формирует план, потом передаёт его команде на Sonnet через Delegate Mode (Shift+Tab). Это экономит до 80% бюджета без потери качества.',
          ),
        ]),
      },
    ],
  },

  // ─── 4. Hooks в Claude Code ───
  {
    title: 'Что такое hooks в Claude Code и зачем они нужны?',
    slug: 'chto-takoe-hooks-v-claude-code',
    categorySlug: 'instrumenty',
    tagSlugs: ['hooks', 'claude-code'],
    seoTitle: 'Hooks в Claude Code — автоматизация разработки',
    seoDescription:
      'Hooks в Claude Code: PreToolUse, PostToolUse, Stop. 14 хуков для автоформатирования, защиты секретов и проверки безопасности.',
    body: root([
      paragraph(
        'Читаю про hooks в Claude Code — вроде это автоматические триггеры, но не понимаю, чем они отличаются от обычных правил в `CLAUDE.md`.',
      ),
      paragraph(
        'Какие hooks бывают, как они работают и зачем нужны, если можно просто написать инструкцию в промпте?',
      ),
    ]),
    answers: [
      {
        isAccepted: true,
        body: root([
          paragraph(
            'Ключевое отличие: правила в `CLAUDE.md` — это просьба, а hooks — это **гарантия**. Модель может проигнорировать инструкцию, но hook сработает всегда.',
          ),
          heading(3, 'Три типа триггеров'),
          list([
            '**PreToolUse** — ДО выполнения действия (блокировка, проверка)',
            '**PostToolUse** — ПОСЛЕ действия (форматирование, логирование)',
            '**Stop** — при завершении сессии (отчёт, проверка)',
          ]),
          heading(3, 'Полный каталог (14 хуков)'),
          list([
            '`session-start.sh` — загрузка контекста при старте сессии',
            '`security-scan.sh` — сканирование на SQLi, XSS при каждом Write/Edit',
            '`protect-secrets.sh` — блокировка записи .env, токенов, паролей',
            '`backup-before-edit.sh` — бэкап файла перед редактированием',
            '`destructive-guard.sh` — блокировка `rm -rf`, `DROP TABLE`',
            '`conventional-commit.sh` — проверка формата коммит-сообщения',
            '`branch-guard.sh` — блокировка push в main/master',
            '`prettier` — автоформатирование JS/TS',
            '`python-lint.sh` — автоформатирование Python (ruff)',
            '`reinject-context.sh` — восстановление контекста после compaction',
            '`cost-tracker.sh` — статистика сессии (токены, время, стоимость)',
            '`notify-done.sh` — уведомление о завершении задачи',
            '`code-simplifier` — анализ и упрощение кода после 3+ файлов',
            '`auto-lint` — автолинтинг для всех языков',
          ]),
          paragraph(
            'Hooks настраиваются в `.claude/settings.json` проекта. Каждый hook — это bash-скрипт, который получает контекст действия и может его заблокировать или модифицировать.',
          ),
        ]),
      },
    ],
  },

  // ─── 5. Quality Gates ───
  {
    title: 'Как настроить Quality Gates для проекта?',
    slug: 'kak-nastroit-quality-gates',
    categorySlug: 'kachestvo-koda',
    tagSlugs: ['quality-gates', 'claude-code'],
    seoTitle: 'Quality Gates — проверки качества кода',
    seoDescription:
      'Quality Gates в Vibe Framework: матрица ЧТО/ЧЕМ/КОГДА, severity levels, правило 3 попыток. Настройка автоматических проверок.',
    body: root([
      paragraph(
        'Хочу настроить автоматические проверки качества — чтобы код проходил ревью, безопасность проверялась, и миражи ловились до коммита.',
      ),
      paragraph('Как устроена система Quality Gates и что нужно настроить?'),
    ]),
    answers: [
      {
        isAccepted: true,
        body: root([
          paragraph(
            'Quality Gates — это матрица проверок, привязанных к конкретным этапам. Часть работает автоматически (hooks), часть вызывается явно (agents).',
          ),
          heading(3, 'Матрица: ЧТО / ЧЕМ / КОГДА'),
          list([
            '**Безопасность кода** — `security-scan.sh` + `security-auditor` — каждый Write/Edit (авто)',
            '**Защита секретов** — `protect-secrets.sh` — каждый Write/Edit (авто)',
            '**Форматирование** — `prettier` / `ruff` — каждый Write/Edit (авто)',
            '**Типы** — `typescript-lsp` / `pyright-lsp` — постоянно (авто)',
            '**Код-ревью** — `code-reviewer` — после кода >20 строк (по вызову)',
            '**Anti-mirage** — `mgrep` / `reality-checker` — перед ссылкой на файл (по правилу)',
            '**Тесты** — `tdd-guide` — Feature / Epic (по вызову)',
          ]),
          heading(3, 'Правило трёх попыток'),
          paragraph(
            'На каждом уровне валидации максимум **3 итерации**: валидация, findings, fix. Если после третьей попытки проблемы остаются — эскалация к человеку. Принцип: лучше ложно-положительное, чем пропущенная ошибка.',
          ),
          heading(3, 'Severity (уровни серьёзности)'),
          list([
            '**Critical** — обязательно исправить, re-verify после',
            '**Major** — исправить, не блокирует, но нужно',
            '**Minor** — исправить если быстро (<2 мин), иначе в техдолг',
          ]),
          paragraph(
            'Пользователь может пропустить проверку командой «skip review», но anti-mirage check **никогда** не пропускается — слишком дёшев и слишком ценен.',
          ),
        ]),
      },
    ],
  },

  // ─── 6. Anti-Mirage ───
  {
    title: 'Что такое Anti-Mirage и как бороться с галлюцинациями?',
    slug: 'chto-takoe-anti-mirage-gallyucinacii',
    categorySlug: 'bezopasnost',
    tagSlugs: ['anti-mirage', 'claude-code'],
    seoTitle: 'Anti-Mirage — борьба с галлюцинациями AI',
    seoDescription:
      'Anti-Mirage: типы миражей AI (файлы, функции, API, пакеты, поля БД), правила проверки реальности и интеграция в workflow.',
    body: root([
      paragraph(
        'Claude регулярно ссылается на несуществующие файлы и функции. Иногда изобретает пакеты, которых нет в npm. Как с этим бороться системно?',
      ),
    ]),
    answers: [
      {
        isAccepted: true,
        body: root([
          paragraph(
            'Anti-Mirage — набор правил, которые **предотвращают** галлюцинации до того, как они попадут в код. Claude любит «фантазировать» — это его главная слабость при генерации кода.',
          ),
          heading(3, 'Типичные миражи'),
          list([
            '**Несуществующий файл** — «Отредактируй `src/utils/helpers.py`» (его нет)',
            '**Несуществующая функция** — «Вызови `user.get_full_name()`» (метода нет, он называется `get_name`)',
            '**Устаревший API** — «Используй `requests.get_async()`» (нет такого метода)',
            '**Фантомный пакет** — «Установи `fastapi-cache3`» (не существует в PyPI)',
            '**Фантомное поле БД** — «WHERE user.role = admin» (поля `role` нет в схеме)',
          ]),
          heading(3, 'Правила проверки'),
          list([
            'Перед ссылкой на **файл** — `mgrep` или `ls`/`find`',
            'Перед вызовом **функции** — `mgrep "functionName"` в кодовой базе',
            'Перед импортом **пакета** — проверить `package.json`/`pyproject.toml`',
            'Перед ссылкой на **поле БД** — проверить schema/migrations',
            'Перед использованием **API** — документация через `context7`',
            'Перед упоминанием **конфига** — проверить `.env.example`',
          ]),
          heading(3, 'Интеграция'),
          paragraph(
            'Добавь правила в `rules/anti-mirage.md` проекта. Anti-mirage check выполняется автоматически как часть Quality Gates и **никогда не пропускается** — даже по команде skip review. Это слишком дёшево и слишком ценно.',
          ),
        ]),
      },
    ],
  },

  // ─── 7. Wave-параллелизм ───
  {
    title: 'Как организовать работу агентов параллельно (Wave)?',
    slug: 'kak-organizovat-rabotu-agentov-wave',
    categorySlug: 'upravlenie',
    tagSlugs: ['wave-parallelism', 'agents', 'claude-code'],
    seoTitle: 'Wave-параллелизм — параллельная разработка',
    seoDescription:
      'Wave-параллелизм в Vibe Framework: группировка задач по зависимостям, Lead на Opus координирует, Teammates на Sonnet выполняют.',
    body: root([
      paragraph(
        'Слышал про wave-параллелизм в Vibe Framework — вроде это способ запускать несколько агентов одновременно для ускорения разработки.',
      ),
      paragraph(
        'Как это устроено на практике? Как группировать задачи и координировать агентов?',
      ),
    ]),
    answers: [
      {
        isAccepted: true,
        body: root([
          paragraph(
            'Wave-параллелизм — это способ **ускорить разработку в 2-4 раза**, запуская независимые задачи одновременно через субагентов.',
          ),
          heading(3, 'Принцип'),
          paragraph(
            'Задачи группируются в **волны (waves)** по зависимостям. Задачи внутри одной волны не зависят друг от друга — значит, их можно выполнять параллельно.',
          ),
          codeBlock(
            'Wave 1: Инфраструктура (БД, модели, базовая структура)\n  task-001, task-002, task-003 [параллельно]\n\nWave 2: Ядро бизнес-логики\n  task-004, task-005 [параллельно]\n\nWave 3: API / Handlers\n  task-006, task-007, task-008 [параллельно]\n\nWave 4: Интеграция и UI\n  task-009, task-010 [параллельно]\n\nWave 5 (финальная): Тестирование + QA + Deploy\n  task-011, task-012, task-013 [последовательно]',
            'text',
          ),
          heading(3, 'Роли'),
          list([
            '**Lead (Opus)** — читает tech-spec, строит execution plan, координирует',
            '**Teammates (Sonnet)** — загружают свой task + контекст, пишут код, коммитят',
            '**Ревьюеры** — проверяют diff каждого Teammate (макс 3 раунда)',
          ]),
          paragraph(
            'Экономия: Teammates на Sonnet стоят ~5x дешевле Opus. Lead координирует, рутину делегирует. Delegate Mode (Shift+Tab) переключает Claude Code в режим оркестрации.',
          ),
          quote(
            'Задачи внутри волны должны быть независимы друг от друга — это ключевое правило параллелизма.',
          ),
        ]),
      },
    ],
  },

  // ─── 8. Деплой через Docker ───
  {
    title: 'Как деплоить проект на VPS через Docker?',
    slug: 'kak-deploit-proekt-na-vps-docker',
    categorySlug: 'deploj',
    tagSlugs: ['docker', 'nginx', 'ssl'],
    seoTitle: 'Деплой на VPS через Docker — полный гайд',
    seoDescription:
      'Деплой на VPS: docker-compose, Nginx reverse proxy, SSL через certbot, GitHub Actions CI/CD. Пошаговая инструкция.',
    body: root([
      paragraph(
        'Написал проект, хочу задеплоить на VPS. Слышал, что Docker + Nginx + SSL — это стандартный стек. Как это всё связать вместе?',
      ),
    ]),
    answers: [
      {
        isAccepted: true,
        body: root([
          paragraph(
            'В Vibe Framework деплой — это **Фаза 0** нового проекта. Стандартный стек: Docker + Nginx reverse proxy + Let\'s Encrypt SSL + GitHub Actions CI/CD.',
          ),
          heading(3, 'Шаг 1: Docker-compose'),
          paragraph(
            'Описываешь сервисы в `docker-compose.yml`: app, postgres, redis. Каждый сервис — отдельный контейнер. `env_file: .env` для секретов, `volumes` для персистентных данных.',
          ),
          heading(3, 'Шаг 2: Nginx как reverse proxy'),
          paragraph(
            'Nginx стоит «впереди» Docker и проксирует запросы на контейнер. Конфиг в `/etc/nginx/sites-available/`: `proxy_pass http://localhost:PORT`, заголовки `X-Real-IP`, `X-Forwarded-For`, `X-Forwarded-Proto`.',
          ),
          heading(3, 'Шаг 3: SSL через certbot'),
          codeBlock(
            '# После настройки DNS A-записи:\ncertbot --nginx -d project.example.com\n\n# Автообновление уже настроено через systemd timer',
            'bash',
          ),
          heading(3, 'Шаг 4: CI/CD через GitHub Actions'),
          paragraph(
            'Workflow на push в main: `actions/checkout` -> SSH на VPS через `appleboy/ssh-action` -> `git pull && docker compose up -d --build`. Секреты (VPS_HOST, VPS_SSH_KEY) хранятся в GitHub Secrets.',
          ),
          heading(3, 'Безопасность VPS'),
          list([
            'Создай пользователя `deploy` (не root!)',
            'SSH только по ключу, `PasswordAuthentication no`',
            'UFW: deny incoming, allow ssh/80/443',
            'fail2ban для защиты от брутфорса',
          ]),
        ]),
      },
    ],
  },

  // ─── 9. TDD с Claude Code ───
  {
    title: 'TDD с Claude Code — реально ли?',
    slug: 'tdd-s-claude-code-realno-li',
    categorySlug: 'testirovanie',
    tagSlugs: ['tdd', 'claude-code'],
    seoTitle: 'TDD с Claude Code — тесты перед кодом',
    seoDescription:
      'TDD с AI: как Claude Code поддерживает цикл Red-Green-Refactor, TDD-якоря в спецификациях, команда /tdd и пирамида тестов.',
    body: root([
      paragraph(
        'TDD — это когда тесты пишешь ДО кода. Но если AI пишет код, зачем ему тесты перед реализацией? Не проще ли написать код, а потом сгенерировать тесты?',
      ),
      paragraph(
        'Кто-нибудь реально практикует TDD с Claude Code?',
      ),
    ]),
    answers: [
      {
        isAccepted: true,
        body: root([
          paragraph(
            'TDD с AI работает **даже лучше**, чем без него. Причина: тесты — это **якоря**, которые не дают модели уплыть в галлюцинации.',
          ),
          heading(3, 'Как это работает'),
          list([
            '**TDD-якоря** прописываются прямо в tech-spec, ещё на этапе планирования',
            'Команда `/tdd` запускает TDD-workflow через агента `tdd-guide`',
            'Цикл: напиши тест (RED) -> напиши код (GREEN) -> рефакторинг',
          ], true),
          heading(3, 'Почему TDD важен именно с AI'),
          paragraph(
            'Без тестов AI генерирует код, который *выглядит* правильно, но может содержать subtle bugs. Тесты фиксируют ожидаемое поведение ДО реализации — AI вынужден писать код, который проходит конкретные проверки.',
          ),
          heading(3, 'Пирамида тестов'),
          list([
            '**Unit** (много) — вся бизнес-логика, функции с расчётами и валидацией',
            '**Integration** (средне) — все эндпоинты, БД, внешние сервисы',
            '**E2E** (мало) — 3-5 критичных пользовательских сценариев',
            '**Smoke** (минимум) — приложение запускается, ключевые эндпоинты отвечают',
          ]),
          paragraph(
            'Правило: если >3 моков в unit-тесте — скорее всего нужен integration-тест. Один тест = одна проверка. Каждый тест **оправдывает своё существование** — ловит ошибку, которую не ловят другие.',
          ),
        ]),
      },
    ],
  },

  // ─── 10. Как написать свой skill ───
  {
    title: 'Как написать свой skill для Claude Code?',
    slug: 'kak-napisat-svoj-skill-claude-code',
    categorySlug: 'instrumenty',
    tagSlugs: ['skills', 'claude-code'],
    seoTitle: 'Создание skill для Claude Code — SKILL.md',
    seoDescription:
      'Как создать свой навык для Claude Code: структура SKILL.md, metadata, workflow, примеры, quality gate на 85%. Пошаговая инструкция.',
    body: root([
      paragraph(
        'Хочу создать свой skill для Claude Code — например, для генерации Telegram-ботов по шаблону. Как правильно оформить SKILL.md, чтобы он работал стабильно?',
      ),
    ]),
    answers: [
      {
        isAccepted: true,
        body: root([
          paragraph(
            'Skill — это специализированный навык Claude Code, оформленный как `SKILL.md`. Хороший skill должен набрать минимум **85% по формуле качества**.',
          ),
          heading(3, 'Формула качества'),
          codeBlock(
            'Score = 70\n  + 10 (если >= 2 конкретных примера ввода/вывода)\n  +  5 (если есть framework/структура)\n  +  5 (если self-contained — без внешних зависимостей)\n  +  5 (если есть чёткий workflow)\n  +  5 (бонус за секцию "Приоритет при конфликтах")\n= итого (макс 100)',
            'text',
          ),
          heading(3, 'Что должен содержать SKILL.md'),
          list([
            '**Frontmatter** — name и description (description «пушит» использование)',
            '**Минимум 2 примера** — конкретный ввод и конкретный вывод',
            '**Секция workflow** — пошаговый процесс, НЕ абстрактные рекомендации',
            '**Приоритет при конфликтах** — как вести себя при противоречиях',
            '**Нет внешних зависимостей** — скилл работает без MCP-серверов и коннекторов',
          ]),
          heading(3, 'Что снижает качество'),
          list([
            'Зависимость от внешних источников (CONNECTORS.md, MCP серверы)',
            'Отсутствие примеров вывода — модель не понимает ожидаемый формат',
            'Абстрактные инструкции вместо конкретных шагов',
            'Размер > 500 строк (используй `references/` для деталей)',
          ]),
          paragraph(
            'После создания автоматически запускается Quality Gate: структурный чеклист, sub-agent ревью (code-reviewer + architect + security-reviewer) и тест-прогон.',
          ),
        ]),
      },
    ],
  },

  // ─── 11. Управление бэклогом ───
  {
    title: 'Как управлять бэклогом проекта через /backlog?',
    slug: 'kak-upravlyat-beklogom-backlog',
    categorySlug: 'upravlenie',
    tagSlugs: ['backlog', 'commands', 'claude-code'],
    seoTitle: 'Бэклог проекта в Claude Code — /backlog',
    seoDescription:
      'Управление бэклогом в Vibe Framework: BACKLOG.md, 7 типов задач, приоритизация, триггеры и команда /backlog.',
    body: root([
      paragraph(
        'Постоянно натыкаюсь на идеи и задачи, которые «потом сделаю». Через неделю забываю. Как организовать бэклог, чтобы ничего не терялось?',
      ),
    ]),
    answers: [
      {
        isAccepted: true,
        body: root([
          paragraph(
            'Паттерн #11 из Vibe Framework: **всё, что «потом» — в бэклог**. Нерешённый вопрос, отложенный тест, идея на будущее — ничего не теряется.',
          ),
          heading(3, 'Команды'),
          list([
            '`/backlog` — показать весь бэклог',
            '`/backlog add [описание]` — добавить элемент',
            '`/backlog done [ID]` — отметить выполненным',
            '`/backlog filter [type]` — фильтр по типу',
            '`/backlog prioritize` — ИИ проанализирует и предложит приоритеты',
          ]),
          heading(3, '7 типов элементов'),
          list([
            '**решение** — нерешённый вопрос, требующий выбора (какую БД для аналитики)',
            '**фича** — отложенная функциональность (OAuth через Google)',
            '**тест** — отложенный тип тестирования (нагрузочные тесты)',
            '**баг** — известный некритичный баг (кнопка съезжает на мобилке)',
            '**улучшение** — рефакторинг, оптимизация (переписать кэш на Redis Streams)',
            '**идея** — непроработанная идея (может, добавить Telegram-бота?)',
            '**долг** — технический долг (заменить raw SQL на ORM)',
          ]),
          heading(3, 'Когда попадает в бэклог'),
          paragraph(
            'Фаза 1 (User Spec) — вопросы без ответа. Фаза 2 (Tech Spec) — отложенные решения. Фаза 5 (Тестирование) — неактуальные сейчас типы тестов. И в любой момент — идеи, замечания, желания вне текущего scope.',
          ),
          paragraph(
            'Файл `backlog/BACKLOG.md` в репозитории. Три секции приоритета: высокий, средний, низкий. Плюс секция «Выполнено» для истории.',
          ),
        ]),
      },
    ],
  },

  // ─── 12. Синхронизация фреймворка между VPS ───
  {
    title: 'Как синхронизировать фреймворк между несколькими VPS?',
    slug: 'kak-sinhronizirovat-frejmvork-mezhdu-vps',
    categorySlug: 'deploj',
    tagSlugs: ['claude-code', 'docker'],
    seoTitle: 'Синхронизация конфига Claude Code между VPS',
    seoDescription:
      'Как синхронизировать настройки Claude Code между VPS: git-репозиторий для конфига, sync.sh, pull/push, rsync для hooks.',
    body: root([
      paragraph(
        'У меня несколько VPS — на каждом свой проект с Claude Code. Хочу, чтобы глобальные правила, hooks и skills были одинаковыми на всех серверах.',
      ),
      paragraph(
        'Как организовать синхронизацию без ручного копирования файлов?',
      ),
    ]),
    answers: [
      {
        isAccepted: true,
        body: root([
          paragraph(
            'Стандартный подход: **git-репозиторий для конфигурации** + скрипт синхронизации.',
          ),
          heading(3, 'Структура'),
          paragraph(
            'Глобальные настройки Claude Code живут в `~/.claude/` и `~/.claude-config/`. Создай git-репозиторий `claude-config` с правилами, hooks, skills и скриптом `sync.sh`.',
          ),
          heading(3, 'Скрипт синхронизации'),
          codeBlock(
            '# Получить свежую конфигурацию:\ncd ~/.claude-config && git pull && bash sync.sh pull\n\n# Отправить локальные изменения:\ncd ~/.claude-config && bash sync.sh push',
            'bash',
          ),
          heading(3, 'Что sync.sh делает'),
          list([
            '`pull` — копирует rules/, hooks/, skills/ из репозитория в `~/.claude/`',
            '`push` — собирает локальные изменения и коммитит в репозиторий',
            'rsync для hooks — бинарные скрипты, которые нельзя просто git pull',
            'Симлинки для CLAUDE.md — глобальный конфиг одинаковый на всех VPS',
          ]),
          heading(3, 'Что синхронизировать'),
          list([
            '**Глобальные rules/** — coding-standards, security, anti-mirage',
            '**Hooks/** — security-scan, protect-secrets, prettier',
            '**Skills/** — шаблоны проектов, deploy-навыки',
            '**CLAUDE.md** (глобальный) — общие правила для всех проектов',
          ]),
          paragraph(
            'Проектные настройки (`.claude/settings.json`, проектный `CLAUDE.md`) остаются локальными — они специфичны для каждого проекта и живут в его git-репозитории.',
          ),
        ]),
      },
    ],
  },
]
