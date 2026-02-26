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

export const hooksData: ToolData[] = [
  {
    title: 'session-start',
    slug: 'session-start',
    toolType: 'hook',
    shortDescription:
      'Загружает контекст проекта при старте сессии: CLAUDE.md, прогресс, текущие задачи. AI сразу знает, где остановился.',
    categorySlug: 'protsessy',
    tagSlugs: ['hooks', 'claude-code', 'project-knowledge'],
    description: root([
      heading(2, 'Загрузка контекста при старте сессии'),
      paragraph(
        'Хук **session-start** срабатывает при каждом запуске Claude Code и загружает контекст проекта. AI читает CLAUDE.md, секцию ПРОГРЕСС, текущие задачи и принятые решения — не тратит время на "вхождение".',
      ),
      list([
        'Читает `CLAUDE.md` — правила и текущий прогресс',
        'Загружает `docs/tasks-detailed.md` — следующая задача',
        'Восстанавливает контекст предыдущей сессии',
        'Работает автоматически, без участия пользователя',
      ]),
      paragraph(
        'Благодаря этому хуку каждая сессия начинается с правильного контекста. Особенно важно для проектов с длинной историей.',
      ),
    ]),
    seoTitle: 'session-start — загрузка контекста при старте сессии',
    seoDescription:
      'Хук session-start: автоматическая загрузка CLAUDE.md, прогресса и задач. AI знает контекст проекта с первой секунды.',
    extra: {
      trigger: 'PreToolUse',
      condition: 'Первое обращение к любому инструменту в сессии',
      hookCommand:
        '#!/bin/bash\n# session-start.sh\n# Загружает CLAUDE.md и прогресс проекта\nif [ -f "$PROJECT_DIR/CLAUDE.md" ]; then\n  cat "$PROJECT_DIR/CLAUDE.md"\nfi\nif [ -f "$PROJECT_DIR/docs/tasks-detailed.md" ]; then\n  head -100 "$PROJECT_DIR/docs/tasks-detailed.md"\nfi',
    },
  },
  {
    title: 'security-scan',
    slug: 'security-scan',
    toolType: 'hook',
    shortDescription:
      'Автоматическое сканирование кода на SQL-инъекции, XSS и другие уязвимости при каждом Write/Edit.',
    categorySlug: 'bezopasnost',
    tagSlugs: ['hooks', 'claude-code', 'quality-gates'],
    description: root([
      heading(2, 'Сканирование безопасности кода'),
      paragraph(
        'Хук **security-scan** срабатывает после каждой записи или редактирования файла. Ищет типичные уязвимости: конкатенация строк в SQL, небезопасная вставка HTML, захардкоженные секреты.',
      ),
      list([
        'SQL Injection: шаблонные строки в SQL-запросах, `.format()`, конкатенация',
        'XSS: небезопасная вставка пользовательского HTML без санитизации',
        'Code Injection: динамическое выполнение кода, `Function()`',
        'Secrets: паттерны API-ключей (`sk-...`, `ghp_...`, `AKIA...`)',
        'Небезопасные функции: `pickle.loads()`, `yaml.load()` без Loader',
      ]),
      paragraph(
        'Если находит проблему — блокирует операцию и показывает предупреждение. Часть Quality Gates — работает автоматически.',
      ),
    ]),
    seoTitle: 'security-scan — автоматический поиск уязвимостей в коде',
    seoDescription:
      'Хук security-scan: автоматическое сканирование на SQLi, XSS, утечки секретов при каждом изменении кода.',
    extra: {
      trigger: 'PostToolUse',
      condition: 'Write или Edit на любом файле с кодом (.ts, .js, .py, .tsx, .jsx)',
      hookCommand:
        '#!/bin/bash\n# security-scan.sh\n# Сканирует файл на типичные уязвимости\nFILE="$FILEPATH"\n\n# SQL Injection\ngrep -n \'f".*SELECT\\|f".*INSERT\\|f".*UPDATE\\|f".*DELETE\' "$FILE" && echo "WARN: Possible SQL injection"\n\n# Hardcoded secrets\ngrep -n \'sk-[a-zA-Z0-9]\\{20\\}\\|ghp_[a-zA-Z0-9]\\{36\\}\\|AKIA[A-Z0-9]\\{16\\}\' "$FILE" && echo "CRITICAL: Hardcoded secret"',
    },
  },
  {
    title: 'protect-secrets',
    slug: 'protect-secrets',
    toolType: 'hook',
    shortDescription:
      'Блокирует запись файлов с секретами: .env, токены, пароли, приватные ключи. Не даёт случайно закоммитить.',
    categorySlug: 'bezopasnost',
    tagSlugs: ['hooks', 'claude-code', 'quality-gates'],
    description: root([
      heading(2, 'Защита секретов от записи'),
      paragraph(
        'Хук **protect-secrets** блокирует операции Write/Edit на файлах, содержащих секреты. `.env`, файлы с токенами, приватные ключи — всё под защитой.',
      ),
      list([
        'Блокирует запись в `.env` файлы (кроме `.env.example`)',
        'Детектирует паттерны: `API_KEY=значение`, `PASSWORD=значение`',
        'Защищает приватные ключи: `*.pem`, `*.key`, `id_rsa`',
        'Проверяет `.gitignore` — секреты должны быть в списке',
        'Разрешает запись только после явного подтверждения пользователя',
      ]),
      quote(
        'Лучше десять ложных срабатываний, чем один слитый API-ключ в публичный репозиторий.',
      ),
    ]),
    seoTitle: 'protect-secrets — защита секретов от случайной записи',
    seoDescription:
      'Хук protect-secrets: блокирует запись .env, токенов, паролей. Защита от случайного коммита секретов в git.',
    extra: {
      trigger: 'PostToolUse',
      condition: 'Write или Edit на файлах: .env, *.pem, *.key, id_rsa',
      hookCommand:
        '#!/bin/bash\n# protect-secrets.sh\nFILE="$FILEPATH"\nBASE=$(basename "$FILE")\n\n# Блокировать .env файлы (кроме .env.example)\nif [[ "$BASE" == .env* && "$BASE" != ".env.example" ]]; then\n  echo "BLOCKED: Нельзя записывать в $BASE"\n  exit 1\nfi\n\n# Блокировать приватные ключи\nif [[ "$BASE" == *.pem || "$BASE" == *.key || "$BASE" == "id_rsa" ]]; then\n  echo "BLOCKED: Нельзя записывать приватные ключи"\n  exit 1\nfi',
    },
  },
  {
    title: 'backup-before-edit',
    slug: 'backup-before-edit',
    toolType: 'hook',
    shortDescription:
      'Создаёт бэкап файла перед каждым редактированием. Если что-то пойдёт не так — можно откатиться.',
    categorySlug: 'kachestvo-koda',
    tagSlugs: ['hooks', 'claude-code'],
    description: root([
      heading(2, 'Бэкап перед редактированием'),
      paragraph(
        'Хук **backup-before-edit** создаёт копию файла перед тем, как Claude его отредактирует. Простая страховка от неудачных изменений — файл можно восстановить из `.backups/`.',
      ),
      list([
        'Создаёт копию в `.backups/` с временной меткой',
        'Работает только для Edit (не для Write нового файла)',
        'Хранит последние 5 версий каждого файла',
        'Старые бэкапы автоматически удаляются',
        'Не бэкапит `node_modules`, `.git`, бинарные файлы',
      ]),
      paragraph(
        'В связке с git это двойная страховка: бэкап для быстрого отката, git для истории.',
      ),
    ]),
    seoTitle: 'backup-before-edit — бэкап файлов перед редактированием',
    seoDescription:
      'Хук backup-before-edit: автоматический бэкап файла перед каждым Edit. Быстрый откат если что-то пошло не так.',
    extra: {
      trigger: 'PreToolUse',
      condition: 'Edit на любом файле (кроме node_modules, .git, бинарных)',
      hookCommand:
        '#!/bin/bash\n# backup-before-edit.sh\nFILE="$FILEPATH"\nBACKUP_DIR="$PROJECT_DIR/.backups"\n\n# Пропускаем ненужное\n[[ "$FILE" == *node_modules* || "$FILE" == *.git/* ]] && exit 0\n\nmkdir -p "$BACKUP_DIR"\nTIMESTAMP=$(date +%Y%m%d_%H%M%S)\nBASE=$(basename "$FILE")\ncp "$FILE" "$BACKUP_DIR/${BASE}.${TIMESTAMP}.bak"\n\n# Оставляем только последние 5 бэкапов\nls -t "$BACKUP_DIR/${BASE}".*.bak 2>/dev/null | tail -n +6 | xargs rm -f 2>/dev/null',
    },
  },
  {
    title: 'destructive-guard',
    slug: 'destructive-guard',
    toolType: 'hook',
    shortDescription:
      'Блокирует деструктивные bash-команды: rm -rf, DROP TABLE, git reset --hard. Спрашивает подтверждение.',
    categorySlug: 'bezopasnost',
    tagSlugs: ['hooks', 'claude-code', 'quality-gates'],
    description: root([
      heading(2, 'Защита от деструктивных команд'),
      paragraph(
        'Хук **destructive-guard** перехватывает опасные bash-команды до их выполнения. `rm -rf /`, `DROP TABLE`, `git reset --hard` — всё блокируется с запросом подтверждения.',
      ),
      list([
        '`rm -rf` с опасными путями: `/`, `~`, `$HOME`, `.`',
        'SQL: `DROP TABLE`, `DROP DATABASE`, `TRUNCATE`',
        'Git: `reset --hard`, `push --force`, `clean -fd`, `branch -D`',
        'Docker: `system prune -a`, `volume rm` без подтверждения',
        'Системные: `chmod -R 777`, `mkfs`, `dd if=`',
      ]),
      paragraph(
        'Срабатывает только на реально опасные команды. Обычный `rm file.txt` проходит свободно.',
      ),
    ]),
    seoTitle: 'destructive-guard — защита от rm -rf и DROP TABLE',
    seoDescription:
      'Хук destructive-guard: блокирует rm -rf, DROP TABLE, git reset --hard. Защита от случайного удаления данных.',
    extra: {
      trigger: 'PreToolUse',
      condition: 'Bash с деструктивными командами: rm -rf, DROP, git reset --hard',
      hookCommand:
        '#!/bin/bash\n# destructive-guard.sh\nCMD="$COMMAND"\n\n# Проверяем опасные паттерны\nif echo "$CMD" | grep -qE \'rm\\s+-rf\\s+(/|~|\\$HOME|\\.)\\b\'; then\n  echo "BLOCKED: rm -rf на опасном пути"\n  exit 1\nfi\n\nif echo "$CMD" | grep -qiE \'DROP\\s+(TABLE|DATABASE)|TRUNCATE\'; then\n  echo "BLOCKED: Деструктивная SQL-операция"\n  exit 1\nfi\n\nif echo "$CMD" | grep -qE \'git\\s+(reset\\s+--hard|push\\s+--force|clean\\s+-fd)\'; then\n  echo "BLOCKED: Деструктивная git-операция"\n  exit 1\nfi',
    },
  },
  {
    title: 'conventional-commit',
    slug: 'conventional-commit',
    toolType: 'hook',
    shortDescription:
      'Проверяет формат коммит-сообщения: feat/fix/refactor/docs/test/chore. Блокирует нестандартные коммиты.',
    categorySlug: 'kachestvo-koda',
    tagSlugs: ['hooks', 'claude-code', 'quality-gates'],
    description: root([
      heading(2, 'Проверка формата коммитов'),
      paragraph(
        'Хук **conventional-commit** проверяет, что сообщение коммита соответствует Conventional Commits. Только `feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:` — ничего другого.',
      ),
      list([
        '`feat:` — новая функциональность',
        '`fix:` — исправление бага',
        '`refactor:` — рефакторинг без изменения поведения',
        '`docs:` — документация',
        '`test:` — тесты',
        '`chore:` — рутина (зависимости, конфиги)',
      ]),
      paragraph(
        'Блокирует коммит, если формат неверный. Показывает правильный формат и предлагает исправить.',
      ),
    ]),
    seoTitle: 'conventional-commit — проверка формата коммит-сообщений',
    seoDescription:
      'Хук conventional-commit: проверяет формат feat/fix/refactor/docs/test/chore. Стандартизация коммитов.',
    extra: {
      trigger: 'PreToolUse',
      condition: 'Bash: git commit с сообщением',
      hookCommand:
        '#!/bin/bash\n# conventional-commit.sh\nMSG="$COMMIT_MESSAGE"\n\n# Проверяем формат: тип: описание\nif ! echo "$MSG" | grep -qE \'^(feat|fix|refactor|docs|test|chore):\\s+.+\'; then\n  echo "BLOCKED: Неверный формат коммита"\n  echo "Формат: feat|fix|refactor|docs|test|chore: описание"\n  echo "Пример: feat: добавить авторизацию через Telegram"\n  exit 1\nfi',
    },
  },
  {
    title: 'branch-guard',
    slug: 'branch-guard',
    toolType: 'hook',
    shortDescription:
      'Блокирует прямой push в main/master. Предлагает создать PR через GitHub CLI.',
    categorySlug: 'bezopasnost',
    tagSlugs: ['hooks', 'claude-code', 'quality-gates'],
    description: root([
      heading(2, 'Защита main/master ветки'),
      paragraph(
        'Хук **branch-guard** блокирует прямой `git push` в ветки `main` и `master`. Все изменения должны проходить через Pull Request — это стандарт защищённых веток.',
      ),
      list([
        'Блокирует `git push origin main` и `git push origin master`',
        'Блокирует `git push --force` на защищённые ветки',
        'Предлагает создать PR: `gh pr create`',
        'Разрешает push в feature-ветки без ограничений',
        'Можно обойти по явному запросу пользователя',
      ]),
      paragraph(
        'Работает как дополнение к GitHub Branch Protection Rules. Даже если на GitHub не настроена защита — хук не пустит.',
      ),
    ]),
    seoTitle: 'branch-guard — защита main от прямого push',
    seoDescription:
      'Хук branch-guard: блокирует push в main/master. Все изменения через Pull Request для защиты стабильной ветки.',
    extra: {
      trigger: 'PreToolUse',
      condition: 'Bash: git push в main или master',
      hookCommand:
        '#!/bin/bash\n# branch-guard.sh\nCMD="$COMMAND"\n\n# Проверяем push в защищённые ветки\nif echo "$CMD" | grep -qE \'git\\s+push\\s+(origin\\s+)?(main|master)\\b\'; then\n  echo "BLOCKED: Прямой push в main/master запрещён"\n  echo "Создай PR: gh pr create --title описание"\n  exit 1\nfi\n\n# Блокируем force push\nif echo "$CMD" | grep -qE \'git\\s+push\\s+--force\'; then\n  BRANCH=$(git branch --show-current)\n  if [[ "$BRANCH" == "main" || "$BRANCH" == "master" ]]; then\n    echo "BLOCKED: force push в $BRANCH запрещён"\n    exit 1\n  fi\nfi',
    },
  },
  {
    title: 'prettier',
    slug: 'prettier',
    toolType: 'hook',
    shortDescription:
      'Автоформатирование JavaScript и TypeScript файлов через Prettier после каждого Write/Edit.',
    categorySlug: 'kachestvo-koda',
    tagSlugs: ['hooks', 'claude-code', 'typescript'],
    description: root([
      heading(2, 'Автоформатирование JS/TS'),
      paragraph(
        'Хук **prettier** запускает Prettier после каждой записи или редактирования `.js`, `.ts`, `.tsx`, `.jsx` файлов. Код всегда отформатирован единообразно — без споров о стиле.',
      ),
      list([
        'Срабатывает на `.js`, `.ts`, `.tsx`, `.jsx` файлы',
        'Использует конфиг проекта (`.prettierrc` / `prettier.config.js`)',
        'Работает тихо — просто форматирует, не спрашивая',
        'Если Prettier не установлен — хук пропускается без ошибки',
        'Не трогает файлы из `.prettierignore`',
      ]),
      paragraph(
        'Один из самых полезных хуков. Код от AI часто приходит с непоследовательным форматированием — Prettier это исправляет автоматически.',
      ),
    ]),
    seoTitle: 'prettier — автоформатирование JS/TS в Claude Code',
    seoDescription:
      'Хук prettier: автоматическое форматирование JavaScript и TypeScript после каждого изменения. Единый стиль кода.',
    extra: {
      trigger: 'PostToolUse',
      condition: 'Write или Edit на файлах .js, .ts, .tsx, .jsx',
      hookCommand:
        '#!/bin/bash\n# prettier hook\nFILE="$FILEPATH"\n\n# Проверяем расширение\nif [[ "$FILE" == *.js || "$FILE" == *.ts || "$FILE" == *.tsx || "$FILE" == *.jsx ]]; then\n  if command -v npx &> /dev/null; then\n    npx prettier --write "$FILE" 2>/dev/null\n  fi\nfi',
    },
  },
  {
    title: 'python-lint',
    slug: 'python-lint',
    toolType: 'hook',
    shortDescription:
      'Автоформатирование Python-файлов через ruff (format + isort) после каждого Write/Edit.',
    categorySlug: 'kachestvo-koda',
    tagSlugs: ['hooks', 'claude-code'],
    description: root([
      heading(2, 'Автоформатирование Python'),
      paragraph(
        'Хук **python-lint** запускает `ruff format` и `ruff check --fix` после каждого изменения `.py` файла. Ruff — быстрый линтер и форматтер на Rust, заменяющий black + isort + flake8.',
      ),
      list([
        'Форматирование через `ruff format` (совместим с Black)',
        'Автоисправление через `ruff check --fix` (isort, unused imports)',
        'Скорость: в 10-100x быстрее Black и flake8',
        'Конфигурируется через `pyproject.toml` или `ruff.toml`',
        'Пропускает файлы из `.ruffignore`',
      ]),
      paragraph(
        'Ruff стал стандартом для Python-проектов в 2025-2026 благодаря скорости и единому инструменту для всего.',
      ),
    ]),
    seoTitle: 'python-lint — автоформатирование Python через ruff',
    seoDescription:
      'Хук python-lint: ruff format + ruff check --fix после каждого изменения .py файла. Быстрый линтинг Python.',
    extra: {
      trigger: 'PostToolUse',
      condition: 'Write или Edit на файлах .py',
      hookCommand:
        '#!/bin/bash\n# python-lint.sh\nFILE="$FILEPATH"\n\nif [[ "$FILE" == *.py ]]; then\n  if command -v ruff &> /dev/null; then\n    ruff format "$FILE" 2>/dev/null\n    ruff check --fix "$FILE" 2>/dev/null\n  fi\nfi',
    },
  },
  {
    title: 'reinject-context',
    slug: 'reinject-context',
    toolType: 'hook',
    shortDescription:
      'Восстанавливает контекст после compaction (сжатия). Подгружает текущую задачу, активные файлы и прогресс.',
    categorySlug: 'protsessy',
    tagSlugs: ['hooks', 'claude-code', 'vibe-coding'],
    description: root([
      heading(2, 'Восстановление контекста после compaction'),
      paragraph(
        'Хук **reinject-context** срабатывает при Notification о SubagentCompaction. Когда Claude сжимает контекст для экономии окна — этот хук возвращает критическую информацию: текущую задачу, прогресс и активные файлы.',
      ),
      list([
        'Восстанавливает секцию ПРОГРЕСС из CLAUDE.md',
        'Подгружает текущую задачу из tasks-detailed.md',
        'Список активных (изменённых) файлов текущей сессии',
        'Принятые решения и контекст — чтобы не повторять ошибки',
        'Работает автоматически при каждом compaction',
      ]),
      quote(
        'Без этого хука Claude после compaction забывает, что делал. С ним — продолжает как ни в чём не бывало.',
      ),
    ]),
    seoTitle: 'reinject-context — восстановление контекста после compaction',
    seoDescription:
      'Хук reinject-context: подгрузка прогресса, задач и файлов после сжатия контекста. AI не теряет нить разработки.',
    extra: {
      trigger: 'Notification',
      condition: 'SubagentCompaction — сжатие контекста субагентом',
      hookCommand:
        '#!/bin/bash\n# reinject-context.sh\necho "=== CONTEXT REINJECT ==="\n\n# Текущий прогресс\nif [ -f "$PROJECT_DIR/CLAUDE.md" ]; then\n  grep -A 50 "## ПРОГРЕСС" "$PROJECT_DIR/CLAUDE.md"\nfi\n\n# Текущая задача\nif [ -f "$PROJECT_DIR/docs/tasks-detailed.md" ]; then\n  grep -B 2 -A 10 "\\[ \\]" "$PROJECT_DIR/docs/tasks-detailed.md" | head -20\nfi\n\n# Изменённые файлы\ngit diff --name-only 2>/dev/null',
    },
  },
  {
    title: 'cost-tracker',
    slug: 'cost-tracker',
    toolType: 'hook',
    shortDescription:
      'Показывает статистику сессии при завершении: токены, время работы, примерная стоимость.',
    categorySlug: 'protsessy',
    tagSlugs: ['hooks', 'claude-code', 'opus', 'sonnet'],
    description: root([
      heading(2, 'Статистика сессии'),
      paragraph(
        'Хук **cost-tracker** срабатывает при завершении сессии (Stop) и показывает статистику: сколько токенов потрачено, сколько времени заняла работа, примерная стоимость в долларах.',
      ),
      list([
        'Количество входных и выходных токенов',
        'Время работы сессии',
        'Примерная стоимость (Opus vs Sonnet rates)',
        'Количество вызовов инструментов',
        'Помогает оптимизировать расходы на AI',
      ]),
      paragraph(
        'Cost-awareness — один из ключевых паттернов вайбкодера. Opus для сложного, Sonnet для рутины, не грузи лишний контекст.',
      ),
    ]),
    seoTitle: 'cost-tracker — статистика и стоимость сессии Claude Code',
    seoDescription:
      'Хук cost-tracker: токены, время, стоимость сессии. Контроль расходов при работе с Claude Code.',
    extra: {
      trigger: 'Stop',
      condition: 'Завершение сессии Claude Code',
      hookCommand:
        '#!/bin/bash\n# cost-tracker.sh\nEND_TIME=$(date +%s)\nDURATION=$((END_TIME - ${SESSION_START:-$END_TIME}))\nMINUTES=$((DURATION / 60))\n\necho "SESSION STATS"\necho "Время: ${MINUTES}мин"\necho "Файлов изменено: $(git diff --name-only 2>/dev/null | wc -l)"',
    },
  },
  {
    title: 'notify-done',
    slug: 'notify-done',
    toolType: 'hook',
    shortDescription:
      'Отправляет уведомление о завершении задачи при остановке сессии. Полезно для длинных задач в tmux.',
    categorySlug: 'protsessy',
    tagSlugs: ['hooks', 'claude-code'],
    description: root([
      heading(2, 'Уведомление о завершении'),
      paragraph(
        'Хук **notify-done** срабатывает при завершении сессии и отправляет уведомление. Когда Claude работает в tmux на длинной задаче — ты узнаешь о завершении, даже если переключился на другое.',
      ),
      list([
        'macOS: нативное уведомление через `osascript`',
        'Linux: `notify-send` для десктопа',
        'Terminal: bell-сигнал для любой платформы',
        'Telegram: опциональное уведомление в бота',
        'Показывает краткий итог: что было сделано',
      ]),
      paragraph(
        'Особенно полезно при работе с Agent Teams, когда задача может выполняться 30-60 минут.',
      ),
    ]),
    seoTitle: 'notify-done — уведомление о завершении задачи',
    seoDescription:
      'Хук notify-done: уведомление при завершении сессии. macOS, Linux, Telegram — узнай о результате даже из другого окна.',
    extra: {
      trigger: 'Stop',
      condition: 'Завершение сессии Claude Code',
      hookCommand:
        '#!/bin/bash\n# notify-done.sh\n\n# Terminal bell\nprintf "\\a"\n\n# macOS notification\nif command -v osascript &> /dev/null; then\n  osascript -e \'display notification "Задача завершена" with title "Claude Code"\'\nfi\n\n# Linux notification\nif command -v notify-send &> /dev/null; then\n  notify-send "Claude Code" "Задача завершена"\nfi',
    },
  },
  {
    title: 'code-simplifier',
    slug: 'code-simplifier',
    toolType: 'hook',
    shortDescription:
      'Анализирует и упрощает написанный код при завершении сессии. Срабатывает после изменения 3+ файлов.',
    categorySlug: 'kachestvo-koda',
    tagSlugs: ['hooks', 'claude-code', 'quality-gates'],
    description: root([
      heading(2, 'Автоматическое упрощение кода'),
      paragraph(
        'Хук **code-simplifier** срабатывает при завершении сессии, если было изменено 3 и более файлов. Анализирует написанный код на сложность и предлагает упрощения: разбиение длинных функций, удаление дублирования, улучшение именования.',
      ),
      list([
        'Функции >50 строк — предложение разбить',
        'Файлы >500 строк — предложение вынести модули',
        'Дублирование кода — предложение DRY-рефакторинга',
        'Сложные условия — guard clauses, early return',
        'Magic numbers — вынести в константы',
      ]),
      paragraph(
        'Не правит код автоматически — только предлагает. Финальное решение за разработчиком. Работает как мягкий code-reviewer.',
      ),
    ]),
    seoTitle: 'code-simplifier — автоматическое упрощение кода',
    seoDescription:
      'Хук code-simplifier: анализ сложности, DRY-рефакторинг, разбиение функций. Автоматический ревью при завершении сессии.',
    extra: {
      trigger: 'Stop',
      condition: 'Изменено 3+ файлов за сессию',
      hookCommand:
        '#!/bin/bash\n# code-simplifier (prompt-based hook)\n# Срабатывает при Stop после изменения 3+ файлов\n\nCHANGED=$(git diff --name-only 2>/dev/null | wc -l)\nif [ "$CHANGED" -ge 3 ]; then\n  echo "code-simplifier: $CHANGED файлов изменено"\n  git diff --name-only 2>/dev/null\nfi',
    },
  },
  {
    title: 'auto-lint',
    slug: 'auto-lint',
    toolType: 'hook',
    shortDescription:
      'Универсальный автолинтинг для всех языков: определяет тип файла и запускает подходящий линтер.',
    categorySlug: 'kachestvo-koda',
    tagSlugs: ['hooks', 'claude-code', 'typescript'],
    description: root([
      heading(2, 'Автолинтинг для всех языков'),
      paragraph(
        'Хук **auto-lint** — универсальный линтер, который определяет тип файла и запускает подходящий инструмент. TypeScript — ESLint, Python — ruff, Go — gofmt, Rust — rustfmt.',
      ),
      list([
        'TypeScript/JavaScript: ESLint + Prettier',
        'Python: ruff format + ruff check',
        'Go: gofmt + go vet',
        'Rust: rustfmt + clippy',
        'CSS/SCSS: stylelint (если установлен)',
        'Определяет линтер автоматически по расширению файла',
      ]),
      paragraph(
        'Работает как "зонтичный" хук поверх специализированных (prettier, python-lint). Если специализированный хук уже сработал — auto-lint пропускает файл.',
      ),
    ]),
    seoTitle: 'auto-lint — универсальный автолинтинг для всех языков',
    seoDescription:
      'Хук auto-lint: ESLint, ruff, gofmt, rustfmt — автоматический выбор линтера по типу файла. Универсальное форматирование.',
    extra: {
      trigger: 'PostToolUse',
      condition: 'Write или Edit на любом файле с кодом',
      hookCommand:
        '#!/bin/bash\n# auto-lint — универсальный линтер\nFILE="$FILEPATH"\nEXT="${FILE##*.}"\n\ncase "$EXT" in\n  ts|tsx|js|jsx)\n    command -v npx &> /dev/null && npx eslint --fix "$FILE" 2>/dev/null\n    ;;\n  py)\n    command -v ruff &> /dev/null && ruff format "$FILE" 2>/dev/null\n    ;;\n  go)\n    command -v gofmt &> /dev/null && gofmt -w "$FILE" 2>/dev/null\n    ;;\n  rs)\n    command -v rustfmt &> /dev/null && rustfmt "$FILE" 2>/dev/null\n    ;;\nesac',
    },
  },
]
