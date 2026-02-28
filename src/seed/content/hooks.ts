import {
  heading,
  paragraph,
  codeBlock,
  list,
  quote,
  hr,
  root,
} from "../lexical";

export interface EnrichedContent {
  slug: string;
  description: ReturnType<typeof root>;
  seoTitle: string;
  seoDescription: string;
}

export const enrichedHooks: EnrichedContent[] = [
  // ─── 1. session-start ──────────────────────────────────────────────────────
  {
    slug: "session-start",
    description: root([
      heading(2, "Простым языком"),
      paragraph(
        "Хук — это скрипт, который запускается автоматически в нужный момент. Не ты его вызываешь, он сам срабатывает. Как будильник: ты его настроил один раз — он делает своё дело каждый день.",
      ),
      paragraph(
        "Каждый раз когда ты открываешь Claude Code — он не помнит что было вчера. Этот хук как записка на мониторе. Он автоматически напоминает Claude где ты остановился и что делать дальше. Тебе ничего не нужно делать — просто установи один раз.",
      ),
      hr(),
      heading(2, "Что делает"),
      paragraph(
        "Хук **session-start** автоматически загружает контекст проекта при старте каждой сессии Claude Code. AI читает `CLAUDE.md`, секцию ПРОГРЕСС и ближайшую незакрытую задачу из `tasks-detailed.md` — и сразу знает, на чём остановился.",
      ),
      paragraph(
        "Без этого хука каждая сессия начинается с нуля: AI не знает архитектуру проекта, принятые решения и текущий статус разработки. С хуком — контекст восстанавливается за секунды без участия пользователя.",
      ),
      heading(3, "Когда срабатывает"),
      paragraph(
        "**Триггер:** `PreToolUse` — перед первым вызовом любого инструмента в сессии. **Условие:** файл `CLAUDE.md` существует в корне проекта. **Действие:** читает CLAUDE.md целиком, затем первые 100 строк tasks-detailed.md (если есть).",
      ),
      hr(),
      heading(2, "Установка"),
      list(
        [
          "Добавь конфиг в `.claude/settings.json` проекта (см. блок ниже)",
          "Создай скрипт `~/.claude/hooks/session-start.sh` и сделай его исполняемым: `chmod +x session-start.sh`",
          "Проверь: запусти новую сессию Claude Code и убедись, что AI сразу знает прогресс",
        ],
        true,
      ),
      heading(3, "Конфиг settings.json"),
      codeBlock(
        `{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": ".*",
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/hooks/session-start.sh"
          }
        ]
      }
    ]
  }
}`,
        "json",
      ),
      heading(3, "Скрипт хука"),
      codeBlock(
        `#!/bin/bash
# session-start.sh — загрузка контекста при старте сессии
# Срабатывает один раз: при первом вызове инструмента в сессии

LOCK_FILE="/tmp/claude-session-started-$$"
if [ -f "$LOCK_FILE" ]; then
  exit 0
fi
touch "$LOCK_FILE"

PROJECT_DIR="\${CLAUDE_PROJECT_DIR:-$(pwd)}"
echo "=== ЗАГРУЗКА КОНТЕКСТА ПРОЕКТА ==="

if [ -f "$PROJECT_DIR/CLAUDE.md" ]; then
  echo "--- CLAUDE.md ---"
  cat "$PROJECT_DIR/CLAUDE.md"
fi

if [ -f "$PROJECT_DIR/docs/tasks-detailed.md" ]; then
  echo ""
  echo "--- СЛЕДУЮЩИЕ ЗАДАЧИ ---"
  head -100 "$PROJECT_DIR/docs/tasks-detailed.md"
fi

if git -C "$PROJECT_DIR" rev-parse --is-inside-work-tree &>/dev/null; then
  CHANGED=$(git -C "$PROJECT_DIR" diff --name-only 2>/dev/null)
  if [ -n "$CHANGED" ]; then
    echo ""
    echo "--- НЕЗАКОММИЧЕННЫЕ ИЗМЕНЕНИЯ ---"
    echo "$CHANGED"
  fi
fi`,
        "bash",
      ),
      hr(),
      heading(2, "Примеры работы"),
      paragraph(
        "Хук срабатывает при первом вызове любого инструмента — Read, Edit, Bash и других. Он не блокирует работу, только выводит контекст.",
      ),
      heading(3, "Что пропускает"),
      list([
        "Повторные вызовы в той же сессии (lock-файл)",
        "Проекты без `CLAUDE.md` в корне",
        "Вызовы из субагентов (не основная сессия)",
      ]),
      heading(3, "Что обрабатывает"),
      list([
        "Первый вызов инструмента после запуска `claude` — читает весь CLAUDE.md",
        "Наличие незакоммиченных файлов — показывает список",
        "Наличие tasks-detailed.md — показывает первые задачи",
      ]),
      hr(),
      heading(2, "Настройка под себя"),
      paragraph(
        "Хук можно расширить для конкретного проекта: добавить чтение `.env.example`, вывод последних коммитов или статуса CI/CD. Главное — не перегружать вывод, иначе AI потратит токены на чтение лишнего.",
      ),
      list([
        "`head -N` — ограничь количество строк из tasks-detailed.md",
        "Добавь `git log --oneline -5` для последних коммитов",
        "Добавь `cat .env.example` чтобы AI знал доступные переменные",
        "Используй `CLAUDE_SKIP_CONTEXT=1` для быстрых сессий без загрузки",
      ]),
      quote(
        "Хороший session-start — как планёрка на 30 секунд. Не лекция, не молчание — ровно столько, чтобы начать работать.",
      ),
    ]),
    seoTitle: "session-start: загрузка контекста Claude Code",
    seoDescription:
      "Хук session-start автоматически читает CLAUDE.md и задачи при старте. AI знает прогресс проекта с первой секунды без ручного объяснения.",
  },

  // ─── 2. security-scan ──────────────────────────────────────────────────────
  {
    slug: "security-scan",
    description: root([
      heading(2, "Простым языком"),
      paragraph(
        "Представь охранника на воротах: перед тем как выпустить машину, он заглядывает в багажник. Этот хук делает то же самое с твоим кодом — проверяет каждый файл после изменения, не спрятал ли AI туда что-нибудь опасное.",
      ),
      paragraph(
        "Раньше ты мог случайно закоммитить файл с паролями или небезопасным кодом. Теперь хук сразу говорит об этом — прямо в терминале, до коммита.",
      ),
      hr(),
      heading(2, "Что делает"),
      paragraph(
        "Хук **security-scan** сканирует каждый изменённый файл на типичные уязвимости безопасности. SQL-инъекции через конкатенацию строк, небезопасная вставка HTML без санитизации, захардкоженные секреты — всё это обнаруживается до того, как код попадёт в репозиторий.",
      ),
      paragraph(
        "AI-модели иногда генерируют небезопасный код — особенно при работе с запросами к БД и пользовательским вводом. Этот хук — последний рубеж перед коммитом.",
      ),
      heading(3, "Когда срабатывает"),
      paragraph(
        "**Триггер:** `PostToolUse` — после каждого `Write` или `Edit`. **Условие:** файл с расширением `.ts`, `.tsx`, `.js`, `.jsx`, `.py`. **Действие:** grep-поиск по паттернам уязвимостей, вывод предупреждения при обнаружении.",
      ),
      hr(),
      heading(2, "Установка"),
      list(
        [
          "Добавь в `.claude/settings.json` конфиг для `PostToolUse` (см. блок ниже)",
          "Создай `~/.claude/hooks/security-scan.sh` и установи права `chmod +x`",
          "Проверь: создай файл с SQL-конкатенацией и убедись, что хук выводит предупреждение",
        ],
        true,
      ),
      heading(3, "Конфиг settings.json"),
      codeBlock(
        `{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/hooks/security-scan.sh"
          }
        ]
      }
    ]
  }
}`,
        "json",
      ),
      heading(3, "Скрипт хука"),
      codeBlock(
        `#!/bin/bash
# security-scan.sh — сканирование файла на уязвимости
# PostToolUse: Write | Edit

FILE="\${CLAUDE_TOOL_INPUT_PATH:-}"
[ -z "$FILE" ] && exit 0

case "$FILE" in
  *.ts|*.tsx|*.js|*.jsx|*.py) ;;
  *) exit 0 ;;
esac

WARN=0

# SQL Injection: конкатенация строк в запросах
if grep -nqE 'f"[^"]*SELECT|f"[^"]*INSERT|f"[^"]*UPDATE' "$FILE" 2>/dev/null; then
  echo "WARN [security-scan] Возможная SQL-инъекция: $FILE"
  WARN=1
fi

# XSS: небезопасное присваивание HTML без санитизации
XSS_PATTERN="innerHTML\s*=|dangerously.*HTML"
if grep -nqE "$XSS_PATTERN" "$FILE" 2>/dev/null; then
  echo "WARN [security-scan] Небезопасная вставка HTML: $FILE"
  WARN=1
fi

# Захардкоженные секреты
if grep -nqE 'sk-[a-zA-Z0-9]{20,}|ghp_[a-zA-Z0-9]{36}|AKIA[A-Z0-9]{16}' "$FILE" 2>/dev/null; then
  echo "CRITICAL [security-scan] Захардкоженный секрет: $FILE"
  WARN=1
fi

# Python: небезопасный yaml и pickle
if [[ "$FILE" == *.py ]]; then
  if grep -nqE 'yaml\.load\(' "$FILE" 2>/dev/null; then
    echo "WARN [security-scan] yaml.load без SafeLoader: $FILE"
    WARN=1
  fi
  if grep -nqE 'pickle\.loads?\(' "$FILE" 2>/dev/null; then
    echo "WARN [security-scan] Небезопасный pickle.load: $FILE"
    WARN=1
  fi
fi

if [ "$WARN" -eq 0 ]; then
  echo "OK [security-scan] $FILE"
fi`,
        "bash",
      ),
      hr(),
      heading(2, "Примеры работы"),
      paragraph(
        "Хук не блокирует операцию — только выводит предупреждения в консоль. AI видит вывод и обязан исправить проблему до коммита.",
      ),
      heading(3, "Что пропускает"),
      list([
        "Файлы без кода: `.md`, `.json`, `.yaml`, `.env.example`",
        "Файлы в `node_modules`, `dist`, `.next`",
        "Намеренные паттерны с комментарием `# nosec`",
      ]),
      heading(3, "Что обнаруживает"),
      list([
        "SQL через f-строки Python: конкатенация запросов с переменными",
        "Захардкоженные OpenAI ключи формата `sk-proj-...`",
        "Небезопасная вставка HTML в DOM без санитизации",
        "`yaml.load()` без явного `Loader=yaml.SafeLoader`",
        "Небезопасный `pickle.load` из ненадёжных источников",
      ]),
      hr(),
      heading(2, "Настройка под себя"),
      paragraph(
        "Добавляй собственные паттерны в grep-выражения под свой стек.",
      ),
      list([
        "Расширяй паттерны grep под свой стек",
        "Добавь `# nosec` комментарий для ложных срабатываний",
        "Замени вывод предупреждения на `exit 2` для критических паттернов",
        "Настрой список расширений через переменную `SCAN_EXTENSIONS`",
      ]),
      quote(
        "Security через страх не работает. Security через автоматику — работает. Один grep в хуке дешевле одного инцидента.",
      ),
    ]),
    seoTitle: "security-scan: поиск уязвимостей в коде автоматически",
    seoDescription:
      "Хук security-scan сканирует на SQL-инъекции, XSS, захардкоженные секреты после каждого Edit. Часть Quality Gates при вайбкодинге.",
  },

  // ─── 3. protect-secrets ────────────────────────────────────────────────────
  {
    slug: "protect-secrets",
    description: root([
      heading(2, "Простым языком"),
      paragraph(
        "В файле `.env` хранятся пароли и ключи доступа — это как сейф. AI иногда пытается туда что-то записать, думая что помогает. Этот хук как замок на сейфе — блокирует любую попытку записи в секретные файлы.",
      ),
      paragraph(
        "Раньше AI мог перезаписать твой `.env` и ты терял настройки. Теперь хук говорит: стоп, это запрещено, поменяй вручную.",
      ),
      hr(),
      heading(2, "Что делает"),
      paragraph(
        "Хук **protect-secrets** блокирует любую запись в файлы, содержащие секреты: `.env`, `*.pem`, `*.key`, `id_rsa`. Если AI попытается записать в такой файл — операция прерывается с объяснением.",
      ),
      paragraph(
        'Это не про безопасность кода, а про защиту от случайного изменения или перезаписи секретных файлов. AI иногда предлагает "обновить .env" — этот хук блокирует такую попытку.',
      ),
      heading(3, "Когда срабатывает"),
      paragraph(
        "**Триггер:** `PreToolUse` — до операций `Write` и `Edit`. **Условие:** имя файла совпадает с паттерном секретных файлов. **Действие:** выход с кодом 2 блокирует операцию.",
      ),
      hr(),
      heading(2, "Установка"),
      list(
        [
          "Добавь конфиг `PreToolUse` в `.claude/settings.json`",
          "Создай `~/.claude/hooks/protect-secrets.sh` с правами `chmod +x`",
          "Проверь: попроси AI записать что-то в `.env` — должен получить отказ",
        ],
        true,
      ),
      heading(3, "Конфиг settings.json"),
      codeBlock(
        `{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/hooks/protect-secrets.sh"
          }
        ]
      }
    ]
  }
}`,
        "json",
      ),
      heading(3, "Скрипт хука"),
      codeBlock(
        `#!/bin/bash
# protect-secrets.sh — блокировка записи секретных файлов
# PreToolUse: Write | Edit

FILE="\${CLAUDE_TOOL_INPUT_PATH:-}"
[ -z "$FILE" ] && exit 0

BASE=$(basename "$FILE")
BLOCKED_NAMES=(".env" ".env.local" ".env.production" ".env.staging" ".secrets")

for BLOCKED in "\${BLOCKED_NAMES[@]}"; do
  if [ "$BASE" = "$BLOCKED" ]; then
    echo "BLOCKED [protect-secrets] Запись в $BASE запрещена."
    echo "Измени файл вручную: nano $FILE"
    exit 2
  fi
done

case "$BASE" in
  *.pem|*.key|*.p12|*.pfx)
    echo "BLOCKED [protect-secrets] Приватный ключ: $BASE"
    exit 2
    ;;
  id_rsa|id_ed25519|id_ecdsa)
    echo "BLOCKED [protect-secrets] SSH приватный ключ: $BASE"
    exit 2
    ;;
esac

if grep -qE '^(API_KEY|SECRET|PASSWORD|TOKEN)=' "$FILE" 2>/dev/null; then
  echo "WARN [protect-secrets] Файл содержит секреты: $BASE"
  echo "Убедись, что $BASE указан в .gitignore"
fi

exit 0`,
        "bash",
      ),
      hr(),
      heading(2, "Примеры работы"),
      paragraph(
        "Хук блокирует Write и Edit с кодом выхода 2 — операция не выполняется.",
      ),
      heading(3, "Что пропускает"),
      list([
        "`.env.example` — шаблон без реальных значений",
        "`.env.test` — если добавлен в список исключений",
        "Чтение файлов (Read) — хук только на Write/Edit",
      ]),
      heading(3, "Что блокирует"),
      list([
        "Запись в `.env`, `.env.local`, `.env.production`",
        "Редактирование `*.pem`, `*.key` файлов",
        "Создание или изменение SSH-ключей `id_rsa`, `id_ed25519`",
        "Файлы с явными паттернами секретов в содержимом",
      ]),
      hr(),
      heading(2, "Настройка под себя"),
      list([
        "Добавь `credentials.json`, `service-account.json` для Google Cloud",
        "Добавь `~/.aws/credentials` для AWS CLI",
        "Для разрешения записи в сессии: переменная `ALLOW_SECRET_WRITE=1`",
        "Веди лог блокированных попыток в файл для аудита",
      ]),
      quote(
        "Лучше десять ложных срабатываний, чем один API-ключ в публичном репозитории. GitHub сканирует пуши на секреты — но хук остановит раньше.",
      ),
    ]),
    seoTitle: "protect-secrets: защита .env от записи Claude Code",
    seoDescription:
      "Хук protect-secrets блокирует запись в .env, *.pem, id_rsa. Защита секретов от случайного изменения или коммита через AI.",
  },

  // ─── 4. backup-before-edit ─────────────────────────────────────────────────
  {
    slug: "backup-before-edit",
    description: root([
      heading(2, "Простым языком"),
      paragraph(
        "Перед тем как AI правит твой файл, хук делает его копию — как черновик перед чистовиком. Если AI напортачил, ты находишь копию в папке `.backups/` и восстанавливаешь одной командой.",
      ),
      paragraph(
        "Раньше после неудачного редактирования нужно было вспоминать как откатить изменения через git. Теперь есть папка с копиями: зашёл, скопировал нужную версию — и дело сделано.",
      ),
      hr(),
      heading(2, "Что делает"),
      paragraph(
        "Хук **backup-before-edit** создаёт копию файла с временной меткой в директории `.backups/` перед каждым редактированием. Если AI неудачно изменил файл — есть бэкап для быстрого восстановления без `git stash` и `git checkout`.",
      ),
      paragraph(
        "Особенно полезен при рефакторинге больших файлов или экспериментах. Хранит последние 5 версий каждого файла — старые удаляются автоматически.",
      ),
      heading(3, "Когда срабатывает"),
      paragraph(
        "**Триггер:** `PreToolUse` — до операции `Edit` (не `Write`). **Условие:** файл существует и не в `node_modules`, `.git`, `dist`. **Действие:** копирует файл в `.backups/` с временной меткой.",
      ),
      hr(),
      heading(2, "Установка"),
      list(
        [
          "Добавь конфиг `PreToolUse` на `Edit` в `.claude/settings.json`",
          "Создай скрипт `~/.claude/hooks/backup-before-edit.sh` с правами `chmod +x`",
          "Добавь `.backups/` в `.gitignore` проекта",
        ],
        true,
      ),
      heading(3, "Конфиг settings.json"),
      codeBlock(
        `{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit",
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/hooks/backup-before-edit.sh"
          }
        ]
      }
    ]
  }
}`,
        "json",
      ),
      heading(3, "Скрипт хука"),
      codeBlock(
        `#!/bin/bash
# backup-before-edit.sh — бэкап файла перед редактированием
# PreToolUse: Edit

FILE="\${CLAUDE_TOOL_INPUT_PATH:-}"
[ -z "$FILE" ] && exit 0
[ ! -f "$FILE" ] && exit 0

case "$FILE" in
  */node_modules/*|*/.git/*|*/dist/*|*/.next/*|*/build/*) exit 0 ;;
esac

FILE_SIZE=$(stat -c%s "$FILE" 2>/dev/null || stat -f%z "$FILE" 2>/dev/null || echo 0)
if [ "$FILE_SIZE" -gt 5242880 ]; then
  exit 0
fi

PROJECT_DIR=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
BACKUP_DIR="$PROJECT_DIR/.backups"
mkdir -p "$BACKUP_DIR"

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BASE=$(basename "$FILE")
BACKUP_PATH="$BACKUP_DIR/\${BASE}.\${TIMESTAMP}.bak"

cp "$FILE" "$BACKUP_PATH"
echo "BACKUP [backup-before-edit] $BACKUP_PATH"

ls -t "$BACKUP_DIR/\${BASE}."*.bak 2>/dev/null | tail -n +6 | xargs rm -f 2>/dev/null

exit 0`,
        "bash",
      ),
      hr(),
      heading(2, "Примеры работы"),
      paragraph("Восстановление файла из бэкапа — одна команда:"),
      codeBlock(
        `# Смотрим список бэкапов
ls .backups/auth.ts.*.bak

# Восстанавливаем конкретную версию
cp .backups/auth.ts.20260227_143022.bak src/auth.ts

# Берём самый свежий бэкап
ls -t .backups/auth.ts.*.bak | head -1 | xargs -I{} cp {} src/auth.ts`,
        "bash",
      ),
      heading(3, "Что пропускает"),
      list([
        "`Write` — только новые файлы, бэкапить нечего",
        "Файлы в `node_modules`, `dist`, `.next`, `.git`",
        "Бинарные файлы и файлы больше 5MB",
      ]),
      heading(3, "Что обрабатывает"),
      list([
        "Каждый `Edit` на существующем файле — создаёт `.bak`",
        "Множественные правки одного файла — несколько версий с метками",
        "Автоочистка: оставляет только 5 последних бэкапов на файл",
      ]),
      hr(),
      heading(2, "Настройка под себя"),
      list([
        "Измени `tail -n +6` на `tail -n +N` для другого лимита версий",
        "Используй `~/.claude-backups/` для централизованного хранения",
        "Добавь фильтр по расширениям: бэкапить только `.ts`, `.py`, `.go`",
        "Интегрируй с rsync для зеркалирования бэкапов на другой диск",
      ]),
      quote(
        "git — это история, бэкап — это страховка. git помогает когда ты коммитишь. Бэкап помогает когда ты нет.",
      ),
    ]),
    seoTitle: "backup-before-edit: бэкап файлов перед Edit в Claude Code",
    seoDescription:
      "Хук backup-before-edit создаёт копию файла в .backups/ перед каждым Edit. Хранит 5 версий, быстрый откат без git stash.",
  },

  // ─── 5. destructive-guard ──────────────────────────────────────────────────
  {
    slug: "destructive-guard",
    description: root([
      heading(2, "Простым языком"),
      paragraph(
        "Некоторые команды в терминале необратимы. Удалил не ту папку — данных больше нет. AI иногда уверенно предлагает такие команды. Этот хук как красная кнопка с крышкой: команда блокируется и тебе объясняют почему.",
      ),
      paragraph(
        "Раньше AI мог выполнить опасную команду сам. Теперь хук перехватывает её и говорит: выполни вручную если уверен. Это даёт тебе секунду подумать.",
      ),
      hr(),
      heading(2, "Что делает"),
      paragraph(
        "Хук **destructive-guard** перехватывает деструктивные bash-команды до их выполнения и блокирует их. `rm -rf /`, `DROP TABLE`, `git reset --hard`, `docker system prune -a` — всё это требует явного подтверждения или блокируется полностью.",
      ),
      paragraph(
        'AI иногда предлагает "очистить" что-то слишком агрессивно. Этот хук — страховка от команд, которые нельзя отменить.',
      ),
      heading(3, "Когда срабатывает"),
      paragraph(
        "**Триггер:** `PreToolUse` — до выполнения `Bash`. **Условие:** команда содержит деструктивные паттерны. **Действие:** выход с кодом 2 блокирует выполнение.",
      ),
      hr(),
      heading(2, "Установка"),
      list(
        [
          "Добавь конфиг `PreToolUse` на `Bash` в `.claude/settings.json`",
          "Создай `~/.claude/hooks/destructive-guard.sh` с правами `chmod +x`",
          "Проверь: попроси AI выполнить `rm -rf ./temp` — должен получить предупреждение",
        ],
        true,
      ),
      heading(3, "Конфиг settings.json"),
      codeBlock(
        `{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/hooks/destructive-guard.sh"
          }
        ]
      }
    ]
  }
}`,
        "json",
      ),
      heading(3, "Скрипт хука"),
      codeBlock(
        `#!/bin/bash
# destructive-guard.sh — блокировка деструктивных команд
# PreToolUse: Bash

CMD="\${CLAUDE_TOOL_INPUT_COMMAND:-}"
[ -z "$CMD" ] && exit 0

BLOCKED=0

if echo "$CMD" | grep -qE 'rm\s+(-rf?|-f?r)\s+(/|~|\$HOME)'; then
  echo "BLOCKED [destructive-guard] rm -rf на корневом пути"
  BLOCKED=1
fi

if echo "$CMD" | grep -qiE '\bDROP\s+(TABLE|DATABASE|SCHEMA)\b'; then
  echo "BLOCKED [destructive-guard] DROP TABLE/DATABASE — нужен бэкап"
  BLOCKED=1
fi

if echo "$CMD" | grep -qiE '\bTRUNCATE\s+TABLE\b'; then
  echo "BLOCKED [destructive-guard] TRUNCATE TABLE — необратимо"
  BLOCKED=1
fi

if echo "$CMD" | grep -qE 'git\s+reset\s+--hard'; then
  echo "BLOCKED [destructive-guard] git reset --hard потеряет незакоммиченные изменения"
  BLOCKED=1
fi

if echo "$CMD" | grep -qE 'git\s+clean\s+(-fd|-df)'; then
  echo "BLOCKED [destructive-guard] git clean -fd удалит неотслеживаемые файлы"
  BLOCKED=1
fi

if echo "$CMD" | grep -qE 'docker\s+system\s+prune\s+-a'; then
  echo "BLOCKED [destructive-guard] docker system prune -a удалит ВСЕ образы"
  BLOCKED=1
fi

if echo "$CMD" | grep -qE 'chmod\s+-R\s+777'; then
  echo "BLOCKED [destructive-guard] chmod -R 777 опасно"
  BLOCKED=1
fi

if [ "$BLOCKED" -eq 1 ]; then
  echo "Если уверен — выполни команду вручную в терминале"
  exit 2
fi

exit 0`,
        "bash",
      ),
      hr(),
      heading(2, "Примеры работы"),
      heading(3, "Что пропускает"),
      list([
        "`rm file.txt` — удаление конкретного файла",
        "`git reset HEAD~1` — без `--hard` (staged изменения сохранятся)",
        "`docker rmi my-image` — удаление конкретного образа",
        "`DROP INDEX` — удаление индекса не деструктивно",
      ]),
      heading(3, "Что блокирует"),
      list([
        "`rm -rf /`, `rm -rf ~` — корневые пути",
        "`DROP TABLE users`, `DROP DATABASE prod`",
        "`git reset --hard HEAD~5` — потеря незакоммиченной работы",
        "`docker system prune -a --volumes` — полная очистка",
        "`chmod -R 777 /var/www`",
      ]),
      hr(),
      heading(2, "Настройка под себя"),
      list([
        "Добавь `kubectl delete namespace` для K8s-проектов",
        "Добавь `terraform destroy` для инфраструктурных проектов",
        "Замени `exit 2` на интерактивный вопрос для некритичных команд",
        "Веди лог заблокированных команд для аудита",
      ]),
      quote(
        "Опасные команды должны требовать усилий. Если команда необратима — пусть её выполняет человек с открытыми глазами.",
      ),
    ]),
    seoTitle: "destructive-guard: блокировка rm -rf и DROP TABLE",
    seoDescription:
      "Хук destructive-guard останавливает деструктивные команды до выполнения: rm -rf, DROP TABLE, git reset --hard, docker prune.",
  },

  // ─── 6. conventional-commit ────────────────────────────────────────────────
  {
    slug: "conventional-commit",
    description: root([
      heading(2, "Простым языком"),
      paragraph(
        'Коммит — это сохранение изменений в истории проекта. К нему пишут описание что сделано. Если описывать как попало — через месяц история выглядит как мусор: "fix", "изменил", "WIP". Этот хук заставляет писать по формату.',
      ),
      paragraph(
        "Раньше AI писал коммиты как ему вздумается. Теперь хук блокирует коммит без правильного формата и подсказывает как надо. Выглядит как: `feat: добавить авторизацию` или `fix: исправить кнопку`.",
      ),
      hr(),
      heading(2, "Что делает"),
      paragraph(
        'Хук **conventional-commit** проверяет каждое коммит-сообщение на соответствие спецификации Conventional Commits. Только `feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:` — ничего другого. Случайные "WIP", "fix bug", "изменения" не пройдут.',
      ),
      paragraph(
        "Стандартные коммиты важны не только для красоты: они дают возможность автогенерации CHANGELOG, семантического версионирования и понятной истории проекта.",
      ),
      heading(3, "Когда срабатывает"),
      paragraph(
        "**Триггер:** `PreToolUse` — до выполнения `Bash` с `git commit`. **Условие:** команда содержит `git commit -m`. **Действие:** проверка regex, блокировка при несоответствии.",
      ),
      hr(),
      heading(2, "Установка"),
      list(
        [
          "Добавь конфиг `PreToolUse` на `Bash` в `.claude/settings.json`",
          "Создай `~/.claude/hooks/conventional-commit.sh` с правами `chmod +x`",
          'Проверь: попроси AI сделать коммит с сообщением "fix bug" — должен получить ошибку',
        ],
        true,
      ),
      heading(3, "Конфиг settings.json"),
      codeBlock(
        `{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/hooks/conventional-commit.sh"
          }
        ]
      }
    ]
  }
}`,
        "json",
      ),
      heading(3, "Скрипт хука"),
      codeBlock(
        `#!/bin/bash
# conventional-commit.sh — проверка формата коммит-сообщения
# PreToolUse: Bash

CMD="\${CLAUDE_TOOL_INPUT_COMMAND:-}"

if ! echo "$CMD" | grep -qE 'git\s+commit'; then
  exit 0
fi

MSG=$(echo "$CMD" | grep -oP '(?<=-m ")[^"]+' | head -1)

if [ -z "$MSG" ]; then
  exit 0
fi

TYPES="feat|fix|refactor|docs|test|chore|style|perf|ci|build|revert"

if ! echo "$MSG" | grep -qP "^(\${TYPES})(\([a-zA-Z0-9-]+\))?!?: .{3,}"; then
  echo "BLOCKED [conventional-commit] Неверный формат коммита"
  echo ""
  echo "Ожидаемый формат: тип: описание"
  echo "Разрешённые типы: feat fix refactor docs test chore style perf ci build revert"
  echo ""
  echo "Примеры:"
  echo "  feat: добавить авторизацию через Telegram"
  echo "  fix(auth): исправить валидацию JWT токена"
  exit 2
fi

echo "OK [conventional-commit] Формат корректен"
exit 0`,
        "bash",
      ),
      hr(),
      heading(2, "Примеры работы"),
      heading(3, "Что пропускает"),
      list([
        "`feat: добавить авторизацию через Telegram` — корректный формат",
        "`fix(auth): исправить валидацию JWT` — с scope в скобках",
        "`refactor!: переписать API` — breaking change с `!`",
        "`chore: обновить зависимости` — рутинные задачи",
      ]),
      heading(3, "Что блокирует"),
      list([
        '"fix bug" — нет типа с двоеточием',
        '"WIP" — незавершённая работа в коммите',
        '"изменения" — неинформативное сообщение',
        '"update: что-то" — тип `update` не разрешён',
      ]),
      hr(),
      heading(2, "Настройка под себя"),
      list([
        "Добавь `hotfix|security` в переменную `TYPES`",
        "Убери типы которые команда не использует",
        "Настрой минимальную длину описания (сейчас 3 символа)",
        "Добавь проверку максимальной длины строки (рекомендуется 72 символа)",
      ]),
      quote(
        "История git — это документация проекта. Conventional Commits делают её читаемой через год, не только через день.",
      ),
    ]),
    seoTitle: "conventional-commit: валидация git коммитов в Claude Code",
    seoDescription:
      "Хук conventional-commit проверяет формат feat/fix/refactor/docs/test/chore. Стандарт Conventional Commits для автогенерации CHANGELOG.",
  },

  // ─── 7. branch-guard ───────────────────────────────────────────────────────
  {
    slug: "branch-guard",
    description: root([
      heading(2, "Простым языком"),
      paragraph(
        "В разработке есть главная ветка кода — обычно `main`. Это то что работает в продакшене, на реальном сайте. Прямо туда писать опасно: одна ошибка — и сайт сломан. Этот хук блокирует попытку записать прямо в `main`.",
      ),
      paragraph(
        "Раньше AI мог запушить изменения прямо в основную ветку. Теперь хук говорит: нет, сначала создай отдельную ветку, потом Pull Request — чтобы кто-то проверил перед слиянием.",
      ),
      hr(),
      heading(2, "Что делает"),
      paragraph(
        "Хук **branch-guard** блокирует прямой `git push` в ветки `main` и `master`. Все изменения должны проходить через Pull Request. Работает как дополнение к GitHub Branch Protection Rules — даже если защита на GitHub не настроена, хук не пустит.",
      ),
      paragraph(
        "AI иногда уверенно пишет `git push origin main` как само собой разумеющееся. Этот хук добавляет трение в правильном месте.",
      ),
      heading(3, "Когда срабатывает"),
      paragraph(
        "**Триггер:** `PreToolUse` — до выполнения `Bash`. **Условие:** команда содержит `git push` в `main` или `master`. **Действие:** блокировка с предложением создать PR через `gh pr create`.",
      ),
      hr(),
      heading(2, "Установка"),
      list(
        [
          "Добавь конфиг `PreToolUse` на `Bash` в `.claude/settings.json`",
          "Создай `~/.claude/hooks/branch-guard.sh` с правами `chmod +x`",
          "Убедись, что установлен GitHub CLI: `gh --version`",
        ],
        true,
      ),
      heading(3, "Конфиг settings.json"),
      codeBlock(
        `{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/hooks/branch-guard.sh"
          }
        ]
      }
    ]
  }
}`,
        "json",
      ),
      heading(3, "Скрипт хука"),
      codeBlock(
        `#!/bin/bash
# branch-guard.sh — защита main/master от прямого push
# PreToolUse: Bash

CMD="\${CLAUDE_TOOL_INPUT_COMMAND:-}"

if ! echo "$CMD" | grep -qE 'git\s+push'; then
  exit 0
fi

CURRENT_BRANCH=$(git branch --show-current 2>/dev/null)
PROTECTED="main|master|production|release"

if echo "$CMD" | grep -qE "git\s+push\s+(origin\s+)?(\${PROTECTED})\b"; then
  echo "BLOCKED [branch-guard] Прямой push в защищённую ветку запрещён"
  echo ""
  echo "Вместо push в main — создай PR:"
  echo "  git push origin $CURRENT_BRANCH"
  echo "  gh pr create --title 'описание' --base main"
  exit 2
fi

if echo "$CMD" | grep -qE 'git\s+push\s+(--force|-f)\b'; then
  if echo "$CURRENT_BRANCH" | grep -qE "^(\${PROTECTED})$"; then
    echo "BLOCKED [branch-guard] force push в $CURRENT_BRANCH запрещён"
    echo "Используй: git push --force-with-lease"
    exit 2
  fi
  echo "WARN [branch-guard] force push в $CURRENT_BRANCH — убедись что это нужно"
fi

exit 0`,
        "bash",
      ),
      hr(),
      heading(2, "Примеры работы"),
      heading(3, "Что пропускает"),
      list([
        "`git push origin feature/auth` — feature-ветка проходит свободно",
        "`git push origin dev` — dev-ветка не защищена по умолчанию",
        "`git push --force-with-lease` — безопасный force (допустим)",
      ]),
      heading(3, "Что блокирует"),
      list([
        "`git push origin main` — прямой push в main",
        "`git push origin master` — прямой push в master",
        "`git push --force origin main` — force push в защищённую ветку",
      ]),
      hr(),
      heading(2, "Настройка под себя"),
      list([
        "Добавь `staging|release` в переменную `PROTECTED`",
        "Настрой список через переменную окружения `PROTECTED_BRANCHES`",
        "Интегрируй с `gh api` для проверки Branch Protection Rules из GitHub",
      ]),
      quote(
        "main — это прод. В прод — через ревью. Хук не про бюрократию, а про то чтобы никогда не делать hotfix в 3 ночи потому что кто-то запушил напрямую.",
      ),
    ]),
    seoTitle: "branch-guard: защита main/master от прямого push",
    seoDescription:
      "Хук branch-guard блокирует git push origin main. Все изменения через PR. Работает совместно с GitHub Branch Protection Rules.",
  },

  // ─── 8. prettier ───────────────────────────────────────────────────────────
  {
    slug: "prettier",
    description: root([
      heading(2, "Простым языком"),
      paragraph(
        "Форматирование — это как расставить пробелы, отступы и переносы в коде. AI иногда пишет код с непоследовательным стилем: где-то одинарные кавычки, где-то двойные, где-то лишние пробелы. Prettier наводит порядок автоматически.",
      ),
      paragraph(
        "Раньше ты тратил время на ручное приведение кода к единому стилю. Теперь каждый раз как AI пишет код — Prettier сразу причёсывает его. Ты даже не замечаешь этот процесс.",
      ),
      hr(),
      heading(2, "Что делает"),
      paragraph(
        "Хук **prettier** автоматически форматирует JavaScript и TypeScript файлы через Prettier после каждого `Write` или `Edit`. Код от AI приходит с непоследовательным форматированием — хук это исправляет без запроса.",
      ),
      paragraph(
        "Prettier — опиниэйтед форматтер: он не обсуждает стиль, он его навязывает. Это преимущество в командной работе и при работе с AI — споров о форматировании нет вообще.",
      ),
      heading(3, "Когда срабатывает"),
      paragraph(
        "**Триггер:** `PostToolUse` — после `Write` или `Edit`. **Условие:** расширение `.js`, `.ts`, `.jsx`, `.tsx`, `.css`, `.json`. **Действие:** `npx prettier --write` тихо форматирует файл.",
      ),
      hr(),
      heading(2, "Установка"),
      list(
        [
          "Установи Prettier в проект: `npm install --save-dev prettier`",
          "Создай `.prettierrc` в корне проекта с конфигом (см. блок ниже)",
          "Добавь хук `PostToolUse` в `.claude/settings.json`",
          "Создай `~/.claude/hooks/prettier.sh` с правами `chmod +x`",
        ],
        true,
      ),
      heading(3, "Конфиг settings.json"),
      codeBlock(
        `{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/hooks/prettier.sh"
          }
        ]
      }
    ]
  }
}`,
        "json",
      ),
      heading(3, "Скрипт хука"),
      codeBlock(
        `#!/bin/bash
# prettier.sh — автоформатирование JS/TS файлов
# PostToolUse: Write | Edit

FILE="\${CLAUDE_TOOL_INPUT_PATH:-}"
[ -z "$FILE" ] && exit 0

case "$FILE" in
  *.js|*.jsx|*.ts|*.tsx|*.css|*.scss|*.json|*.mdx) ;;
  *) exit 0 ;;
esac

case "$FILE" in
  */node_modules/*|*/dist/*|*/.next/*) exit 0 ;;
esac

if ! npx prettier --version &>/dev/null 2>&1; then
  exit 0
fi

npx prettier --write "$FILE" 2>/dev/null
exit 0`,
        "bash",
      ),
      paragraph("Рекомендуемый `.prettierrc` для TypeScript-проекта:"),
      codeBlock(
        `{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf"
}`,
        "json",
      ),
      hr(),
      heading(2, "Примеры работы"),
      heading(3, "Что пропускает"),
      list([
        "Файлы в `node_modules`, `dist`, `.next` — автоматически",
        "Файлы в `.prettierignore` — уважает конфиг",
        "Файлы без известного расширения: `.sh`, `.py`, `.go`",
        "Проекты без Prettier — хук тихо пропускает",
      ]),
      heading(3, "Что форматирует"),
      list([
        "`.ts`, `.tsx` — TypeScript и React-компоненты",
        "`.js`, `.jsx` — JavaScript",
        "`.css`, `.scss` — стили",
        "`.json` — JSON-файлы (кроме `package-lock.json`)",
        "`.mdx` — MDX-документы",
      ]),
      hr(),
      heading(2, "Настройка под себя"),
      list([
        "Добавь расширения в `case` внутри скрипта под нужды проекта",
        "Создай `.prettierignore` для исключения генерируемых файлов",
        "Используй `prettier --check` вместо `--write` для режима только-проверки",
        "Комбинируй с ESLint через `eslint-config-prettier` для совместимости",
      ]),
      quote(
        "Форматирование кода — не вопрос вкуса, когда есть автоматика. Prettier форматирует, AI пишет логику, человек думает об архитектуре.",
      ),
    ]),
    seoTitle: "prettier: автоформатирование JS/TS в Claude Code",
    seoDescription:
      "Хук prettier запускает Prettier после каждого Write/Edit. Единый стиль кода автоматически. Поддержка .prettierrc конфига проекта.",
  },

  // ─── 9. python-lint ────────────────────────────────────────────────────────
  {
    slug: "python-lint",
    description: root([
      heading(2, "Простым языком"),
      paragraph(
        "В Python есть правила как писать код — называются PEP 8. AI их знает, но не всегда соблюдает: импорты в беспорядке, лишние пробелы, устаревший синтаксис. Ruff — инструмент который исправляет всё это за миллисекунды.",
      ),
      paragraph(
        "Этот хук запускает ruff автоматически после каждого изменения Python-файла. Тебе ничего не нужно делать — код всегда чистый и по стандарту.",
      ),
      hr(),
      heading(2, "Что делает"),
      paragraph(
        "Хук **python-lint** запускает `ruff format` и `ruff check --fix` после каждого изменения `.py` файла. Ruff — линтер и форматтер на Rust, который заменяет сразу black, isort и flake8. В 10-100 раз быстрее предшественников.",
      ),
      paragraph(
        "Python-код от AI часто имеет неупорядоченные импорты, лишние пробелы и нарушения PEP 8. Ruff исправляет всё это за миллисекунды.",
      ),
      heading(3, "Когда срабатывает"),
      paragraph(
        "**Триггер:** `PostToolUse` — после `Write` или `Edit`. **Условие:** расширение `.py`. **Действие:** `ruff format` для форматирования, `ruff check --fix` для автоисправления нарушений.",
      ),
      hr(),
      heading(2, "Установка"),
      list(
        [
          "Установи ruff: `pip install ruff` или `uv add ruff --dev`",
          "Создай `pyproject.toml` с конфигом ruff (см. блок ниже)",
          "Добавь хук `PostToolUse` в `.claude/settings.json`",
          "Создай `~/.claude/hooks/python-lint.sh` с правами `chmod +x`",
        ],
        true,
      ),
      heading(3, "Конфиг settings.json"),
      codeBlock(
        `{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/hooks/python-lint.sh"
          }
        ]
      }
    ]
  }
}`,
        "json",
      ),
      heading(3, "Скрипт хука"),
      codeBlock(
        `#!/bin/bash
# python-lint.sh — форматирование Python через ruff
# PostToolUse: Write | Edit

FILE="\${CLAUDE_TOOL_INPUT_PATH:-}"
[ -z "$FILE" ] && exit 0

[[ "$FILE" != *.py ]] && exit 0

case "$FILE" in
  */.venv/*|*/venv/*|*/__pycache__/*) exit 0 ;;
esac

if ! command -v ruff &>/dev/null; then
  echo "SKIP [python-lint] ruff не установлен: pip install ruff"
  exit 0
fi

ruff format "$FILE" 2>/dev/null
ruff check --fix --select I,F401,UP,E,W "$FILE" 2>/dev/null

exit 0`,
        "bash",
      ),
      paragraph("Рекомендуемый конфиг `pyproject.toml`:"),
      codeBlock(
        `[tool.ruff]
line-length = 100
target-version = "py311"

[tool.ruff.lint]
select = ["E", "F", "I", "UP", "W"]
ignore = ["E501"]

[tool.ruff.format]
quote-style = "double"
indent-style = "space"`,
        "text",
      ),
      hr(),
      heading(2, "Примеры работы"),
      heading(3, "Что пропускает"),
      list([
        "Файлы в `.venv`, `venv`, `__pycache__`",
        "Файлы в `migrations/` если добавлен как исключение в `ruff.toml`",
        "Проекты без ruff — хук выводит подсказку по установке",
      ]),
      heading(3, "Что исправляет"),
      list([
        "Неупорядоченные импорты — сортировка через isort (правило `I`)",
        "Неиспользуемые импорты — удаление `F401`",
        "Устаревший синтаксис — modernize через `UP` (f-строки вместо format)",
        "PEP 8 нарушения: пробелы, отступы, пустые строки (`E`, `W`)",
        "Форматирование как Black: кавычки, запятые, скобки",
      ]),
      hr(),
      heading(2, "Настройка под себя"),
      list([
        "Добавь `noqa: F401` на строку для отключения конкретного правила",
        "Настрой `per-file-ignores` для тестовых файлов",
        "Добавь `--unsafe-fixes` для агрессивного автоисправления",
        "Используй `ruff check --diff` для просмотра изменений перед применением",
      ]),
      quote(
        "Ruff — это black + isort + flake8 в одном бинарнике на Rust. Скорость такая, что форматирование перестаёт ощущаться как задержка.",
      ),
    ]),
    seoTitle: "python-lint: ruff format + check в Claude Code",
    seoDescription:
      "Хук python-lint запускает ruff format и ruff check --fix после каждого изменения .py. Замена black, isort и flake8 в одном инструменте.",
  },

  // ─── 10. reinject-context ──────────────────────────────────────────────────
  {
    slug: "reinject-context",
    description: root([
      heading(2, "Простым языком"),
      paragraph(
        "При очень длинной работе Claude сжимает свою память, чтобы освободить место для новых мыслей. После этого он может забыть что делал. Это как если тебя разбудить посреди сложного дела — нужно напомнить с чего начали.",
      ),
      paragraph(
        "Этот хук срабатывает сразу после такого сжатия и восстанавливает контекст: что за проект, какая задача, какие файлы менялись. Claude продолжает работу как ни в чём не бывало.",
      ),
      hr(),
      heading(2, "Что делает"),
      paragraph(
        "Хук **reinject-context** срабатывает при `SubagentCompaction` — когда Claude сжимает контекст для освобождения окна. После compaction AI теряет детали текущей задачи. Этот хук восстанавливает критическую информацию: прогресс, текущую задачу, список изменённых файлов.",
      ),
      paragraph(
        "Без этого хука после compaction AI иногда забывает что делал и начинает с начала. С ним — продолжает разработку с правильным контекстом.",
      ),
      heading(3, "Когда срабатывает"),
      paragraph(
        "**Триггер:** `Notification` с типом `SubagentCompaction`. **Условие:** срабатывает автоматически. **Действие:** выводит прогресс из CLAUDE.md, следующую задачу, список незакоммиченных файлов.",
      ),
      hr(),
      heading(2, "Установка"),
      list(
        [
          "Добавь конфиг `Notification` в `.claude/settings.json`",
          "Создай `~/.claude/hooks/reinject-context.sh` с правами `chmod +x`",
          "Убедись, что CLAUDE.md проекта содержит секцию `## ПРОГРЕСС`",
        ],
        true,
      ),
      heading(3, "Конфиг settings.json"),
      codeBlock(
        `{
  "hooks": {
    "Notification": [
      {
        "matcher": "SubagentCompaction",
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/hooks/reinject-context.sh"
          }
        ]
      }
    ]
  }
}`,
        "json",
      ),
      heading(3, "Скрипт хука"),
      codeBlock(
        `#!/bin/bash
# reinject-context.sh — восстановление контекста после compaction
# Notification: SubagentCompaction

PROJECT_DIR="\${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"

echo "=== REINJECT CONTEXT AFTER COMPACTION ==="
echo ""

if [ -f "$PROJECT_DIR/CLAUDE.md" ]; then
  echo "--- ТЕКУЩИЙ ПРОГРЕСС ---"
  awk '/^## ПРОГРЕСС/,/^## [^П]/' "$PROJECT_DIR/CLAUDE.md" | head -40
fi

if [ -f "$PROJECT_DIR/docs/tasks-detailed.md" ]; then
  echo ""
  echo "--- СЛЕДУЮЩАЯ ЗАДАЧА ---"
  grep -A 10 "- \[ \]" "$PROJECT_DIR/docs/tasks-detailed.md" | head -15
fi

if git -C "$PROJECT_DIR" rev-parse --is-inside-work-tree &>/dev/null; then
  echo ""
  echo "--- ИЗМЕНЁННЫЕ ФАЙЛЫ ---"
  git -C "$PROJECT_DIR" diff --name-only 2>/dev/null
  git -C "$PROJECT_DIR" diff --cached --name-only 2>/dev/null
fi

echo ""
echo "=== ПРОДОЛЖАЙ РАБОТУ С ТОГО МЕСТА ==="
exit 0`,
        "bash",
      ),
      hr(),
      heading(2, "Примеры работы"),
      paragraph(
        "Compaction — автоматический процесс. При длинных сессиях (50+ ходов) он срабатывает несколько раз. Каждый раз хук восстанавливает контекст.",
      ),
      heading(3, "Что пропускает"),
      list([
        "Обычные уведомления (не SubagentCompaction)",
        "Сессии без CLAUDE.md — выводит только изменённые файлы",
        "Проекты не в git-репозитории — пропускает секцию с файлами",
      ]),
      heading(3, "Что восстанавливает"),
      list([
        "Секцию ПРОГРЕСС из CLAUDE.md — фаза разработки, что сделано",
        "Первую незакрытую задачу из tasks-detailed.md",
        "Список незакоммиченных и staged файлов",
        "Ориентир для продолжения без повторного объяснения",
      ]),
      hr(),
      heading(2, "Настройка под себя"),
      list([
        "Добавь чтение `docs/ai-notes/block-N.md` для контекста текущего блока",
        "Добавь `git log --oneline -3` для последних коммитов",
        "Добавь `cat .env.example` если AI работает с конфигурацией",
        "Ограничь объём через `head -N` чтобы не перегружать контекст",
      ]),
      quote(
        "Compaction — это не баг, это фича. Но только если у тебя есть хук для восстановления. Иначе это амнезия посреди разработки.",
      ),
    ]),
    seoTitle: "reinject-context: контекст после compaction Claude Code",
    seoDescription:
      "Хук reinject-context восстанавливает прогресс и задачи после SubagentCompaction. AI не теряет нить разработки при длинных сессиях.",
  },

  // ─── 11. cost-tracker ──────────────────────────────────────────────────────
  {
    slug: "cost-tracker",
    description: root([
      heading(2, "Простым языком"),
      paragraph(
        "Claude Code стоит денег — каждый запрос это токены. Легко потратить несколько часов и не понять: а что вообще было сделано? Этот хук при завершении сессии показывает итог: сколько длилась работа, сколько коммитов, какие файлы.",
      ),
      paragraph(
        "Это как квитанция на кассе: заплатил — получи чек. Видишь: 47 минут, 4 коммита, 8 файлов. Хорошая сессия или нет — сам решаешь.",
      ),
      hr(),
      heading(2, "Что делает"),
      paragraph(
        "Хук **cost-tracker** показывает статистику сессии при её завершении: количество изменённых файлов, продолжительность работы, количество коммитов. Помогает осознанно тратить токены и выбирать между Opus и Sonnet.",
      ),
      paragraph(
        "Cost-awareness — один из ключевых паттернов вайбкодера. Нужно знать: эта сессия стоила X — оно того стоило?",
      ),
      heading(3, "Когда срабатывает"),
      paragraph(
        "**Триггер:** `Stop` — при завершении сессии Claude Code. **Условие:** всегда. **Действие:** выводит статистику в консоль.",
      ),
      hr(),
      heading(2, "Установка"),
      list(
        [
          "Добавь конфиг `Stop` в `.claude/settings.json`",
          "Создай `~/.claude/hooks/cost-tracker.sh` с правами `chmod +x`",
          "Для точного учёта времени: сохраняй метку старта через `PreToolUse` (опционально)",
        ],
        true,
      ),
      heading(3, "Конфиг settings.json"),
      codeBlock(
        `{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/hooks/cost-tracker.sh"
          }
        ]
      }
    ]
  }
}`,
        "json",
      ),
      heading(3, "Скрипт хука"),
      codeBlock(
        `#!/bin/bash
# cost-tracker.sh — статистика завершённой сессии
# Stop: при выходе из Claude Code

PROJECT_DIR="\${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"

echo ""
echo "━━━ SESSION STATS ━━━"

START_FILE="/tmp/claude-session-start-\${PPID}"
if [ -f "$START_FILE" ]; then
  START=$(cat "$START_FILE")
  END=$(date +%s)
  DURATION=$((END - START))
  MINUTES=$((DURATION / 60))
  SECONDS=$((DURATION % 60))
  echo "Время:      \${MINUTES}мин \${SECONDS}сек"
  rm -f "$START_FILE"
fi

if git -C "$PROJECT_DIR" rev-parse --is-inside-work-tree &>/dev/null; then
  CHANGED=$(git -C "$PROJECT_DIR" diff --name-only 2>/dev/null | wc -l | tr -d ' ')
  STAGED=$(git -C "$PROJECT_DIR" diff --cached --name-only 2>/dev/null | wc -l | tr -d ' ')
  COMMITS=$(git -C "$PROJECT_DIR" log --oneline --since="3 hours ago" 2>/dev/null | wc -l | tr -d ' ')

  echo "Изменено:   \${CHANGED} файлов (незакоммиченных)"
  echo "Staged:     \${STAGED} файлов"
  echo "Коммитов:   \${COMMITS} за последние 3 часа"

  if [ "$COMMITS" -gt 0 ]; then
    echo ""
    echo "Коммиты сессии:"
    git -C "$PROJECT_DIR" log --oneline --since="3 hours ago" 2>/dev/null
  fi
fi

BACKUPS=$(ls "$PROJECT_DIR/.backups/"*.bak 2>/dev/null | wc -l | tr -d ' ')
if [ "$BACKUPS" -gt 0 ]; then
  echo "Бэкапов:    \${BACKUPS} файлов в .backups/"
fi

echo "━━━━━━━━━━━━━━━━━━━"
echo ""`,
        "bash",
      ),
      hr(),
      heading(2, "Примеры работы"),
      paragraph("Пример вывода при завершении продуктивной сессии:"),
      codeBlock(
        `━━━ SESSION STATS ━━━
Время:      47мин 23сек
Изменено:   0 файлов (незакоммиченных)
Staged:     0 файлов
Коммитов:   4 за последние 3 часа

Коммиты сессии:
a3f91c2 feat: добавить страницу /framework/[slug]
b12e4d7 feat: API для скачивания фреймворка
c98a1f3 fix: TypeScript ошибки в DownloadButton
d45b2e1 chore: миграция Payload для Frameworks
━━━━━━━━━━━━━━━━━━━`,
        "text",
      ),
      heading(3, "Что показывает"),
      list([
        "Продолжительность сессии (минуты и секунды)",
        "Количество незакоммиченных изменений",
        "Количество staged файлов",
        "Список коммитов за последние 3 часа",
        "Количество бэкапов если используется backup-before-edit",
      ]),
      hr(),
      heading(2, "Настройка под себя"),
      list([
        "Добавь запись статистики в `~/.claude-sessions.log` для анализа трендов",
        "Интегрируй с Telegram ботом для уведомления о завершении со статистикой",
        "Добавь вывод размера `node_modules` если он рос в сессии",
        "Комбинируй с notify-done для звука и статистики одновременно",
      ]),
      quote(
        "Нельзя управлять тем, что не измеряешь. cost-tracker — это дашборд вайбкодера: был ли я продуктивен сегодня?",
      ),
    ]),
    seoTitle: "cost-tracker: статистика сессии Claude Code",
    seoDescription:
      "Хук cost-tracker показывает время работы, файлы, коммиты при завершении сессии. Контроль продуктивности и расходов Claude Code.",
  },

  // ─── 12. notify-done ───────────────────────────────────────────────────────
  {
    slug: "notify-done",
    description: root([
      heading(2, "Простым языком"),
      paragraph(
        "Когда даёшь AI сложную задачу, она может выполняться 30-60 минут. Ты уходишь пить чай или работать над другим — и периодически возвращаешься проверять: закончил или нет? Этот хук сам тебя позовёт когда всё готово.",
      ),
      paragraph(
        "Настраивается на всплывающее уведомление на компьютере или сообщение в Telegram. AI закончил — ты получил сигнал. Можно спокойно заниматься своими делами.",
      ),
      hr(),
      heading(2, "Что делает"),
      paragraph(
        "Хук **notify-done** отправляет уведомление при завершении сессии Claude Code. Когда AI работает в tmux на длинной задаче — ты узнаешь о завершении, даже если переключился на другое окно или вкладку.",
      ),
      paragraph(
        "Особенно полезен при работе с Agent Teams: задача может выполняться 30-60 минут. Без уведомления — сидишь и периодически проверяешь. С уведомлением — занимаешься своим делом.",
      ),
      heading(3, "Когда срабатывает"),
      paragraph(
        "**Триггер:** `Stop` — при завершении сессии. **Условие:** всегда. **Действие:** terminal bell + системное уведомление (macOS/Linux) + опционально Telegram.",
      ),
      hr(),
      heading(2, "Установка"),
      list(
        [
          "Добавь конфиг `Stop` в `.claude/settings.json`",
          "Создай `~/.claude/hooks/notify-done.sh` с правами `chmod +x`",
          "Для Telegram: создай бота через @BotFather и добавь токен в `~/.bashrc`",
        ],
        true,
      ),
      heading(3, "Конфиг settings.json"),
      codeBlock(
        `{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/hooks/notify-done.sh"
          }
        ]
      }
    ]
  }
}`,
        "json",
      ),
      heading(3, "Скрипт хука"),
      codeBlock(
        `#!/bin/bash
# notify-done.sh — уведомление о завершении сессии
# Stop: при выходе из Claude Code

PROJECT_DIR="\${CLAUDE_PROJECT_DIR:-$(pwd)}"
PROJECT_NAME=$(basename "$PROJECT_DIR")

COMMITS=0
if git -C "$PROJECT_DIR" rev-parse --is-inside-work-tree &>/dev/null; then
  COMMITS=$(git -C "$PROJECT_DIR" log --oneline --since="3 hours ago" 2>/dev/null | wc -l | tr -d ' ')
fi

MSG="Проект: $PROJECT_NAME | Коммитов: $COMMITS"

printf "\a"

if command -v osascript &>/dev/null; then
  osascript -e "display notification \"$MSG\" with title \"Claude Code завершил\" sound name \"Glass\""
fi

if command -v notify-send &>/dev/null; then
  notify-send "Claude Code завершил" "$MSG" --icon=terminal --urgency=normal
fi

if [ -n "$TELEGRAM_BOT_TOKEN" ] && [ -n "$TELEGRAM_CHAT_ID" ]; then
  curl -s -X POST \
    "https://api.telegram.org/bot\${TELEGRAM_BOT_TOKEN}/sendMessage" \
    -d "chat_id=\${TELEGRAM_CHAT_ID}" \
    -d "text=Claude Code завершил%0A\${MSG}" \
    --max-time 5 >/dev/null 2>&1
fi

exit 0`,
        "bash",
      ),
      hr(),
      heading(2, "Примеры работы"),
      heading(3, "Что пропускает"),
      list([
        "Промежуточные остановки — только финальный Stop",
        "Уведомления в headless-режиме без дисплея",
        "Telegram — только если переменные окружения настроены",
      ]),
      heading(3, "Что отправляет"),
      list([
        "macOS: нативное уведомление со звуком Glass и именем проекта",
        "Linux: `notify-send` с иконкой терминала",
        "Terminal: bell-сигнал для tmux и screen",
        "Telegram: текстовое сообщение если бот настроен",
      ]),
      hr(),
      heading(2, "Настройка под себя"),
      list([
        "Добавь Slack webhook через curl POST-запрос",
        "Добавь Discord webhook аналогично Telegram",
        "Настрой разные звуки для успеха и ошибки через osascript",
        "Добавь `CLAUDE_NOTIFY=0` для отключения уведомлений в конкретной сессии",
      ]),
      quote(
        "Лучший способ быть продуктивным — не сидеть и ждать AI. notify-done решает эту проблему одним хуком.",
      ),
    ]),
    seoTitle: "notify-done: уведомление о завершении Claude Code сессии",
    seoDescription:
      "Хук notify-done отправляет уведомление при завершении: macOS, Linux, Telegram. Узнай о результате работы AI из любого окна.",
  },

  // ─── 13. code-simplifier ───────────────────────────────────────────────────
  {
    slug: "code-simplifier",
    description: root([
      heading(2, "Простым языком"),
      paragraph(
        "AI склонен усложнять код: пишет длинные функции, использует магические числа вместо понятных названий, делает файлы слишком большими. После большой сессии это незаметно. Хук замечает это за тебя.",
      ),
      paragraph(
        "После работы с 3 и более файлами хук проверяет: нет ли чего-то слишком раздутого? Не правит сам — просто говорит: вот здесь стоит посмотреть. Ты сам решаешь исправлять сейчас или записать на потом.",
      ),
      hr(),
      heading(2, "Что делает"),
      paragraph(
        "Хук **code-simplifier** срабатывает при завершении сессии, если было изменено 3 и более файлов. Анализирует написанный код на сложность и формирует список для ревью: длинные функции, дублирование, магические числа.",
      ),
      paragraph(
        "Не правит код автоматически — только указывает на проблемы. Финальное решение за разработчиком. Это мягкий code-reviewer на выходе из сессии.",
      ),
      heading(3, "Когда срабатывает"),
      paragraph(
        "**Триггер:** `Stop` — при завершении сессии. **Условие:** изменено 3+ файлов за сессию. **Действие:** статический анализ изменённых файлов, вывод списка потенциальных улучшений.",
      ),
      hr(),
      heading(2, "Установка"),
      list(
        [
          "Добавь конфиг `Stop` в `.claude/settings.json`",
          "Создай `~/.claude/hooks/code-simplifier.sh` с правами `chmod +x`",
          "Установи `cloc` для точного подсчёта строк кода (опционально)",
        ],
        true,
      ),
      heading(3, "Конфиг settings.json"),
      codeBlock(
        `{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/hooks/code-simplifier.sh"
          }
        ]
      }
    ]
  }
}`,
        "json",
      ),
      heading(3, "Скрипт хука"),
      codeBlock(
        `#!/bin/bash
# code-simplifier.sh — анализ сложности кода после сессии
# Stop: при изменении 3+ файлов

PROJECT_DIR="\${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"

CHANGED_FILES=$(git -C "$PROJECT_DIR" diff --name-only 2>/dev/null)
CHANGED_COUNT=$(echo "$CHANGED_FILES" | grep -c '.' 2>/dev/null || echo 0)

if [ "$CHANGED_COUNT" -lt 3 ]; then
  exit 0
fi

echo ""
echo "━━━ CODE SIMPLIFIER ━━━"
echo "Проверяю $CHANGED_COUNT изменённых файлов..."
echo ""

ISSUES=0

while IFS= read -r FILE; do
  [ -z "$FILE" ] && continue
  FULL_PATH="$PROJECT_DIR/$FILE"
  [ ! -f "$FULL_PATH" ] && continue

  case "$FILE" in
    *.ts|*.tsx|*.js|*.jsx|*.py|*.go) ;;
    *) continue ;;
  esac

  LINES=$(wc -l < "$FULL_PATH" 2>/dev/null || echo 0)

  if [ "$LINES" -gt 500 ]; then
    echo "WARN $FILE — $LINES строк (>500). Рассмотри разбиение на модули."
    ISSUES=$((ISSUES + 1))
  fi

  MAGIC=$(grep -nE '\b[2-9][0-9]{2,}\b' "$FULL_PATH" 2>/dev/null | grep -v '//' | head -3)
  if [ -n "$MAGIC" ]; then
    echo "MINOR $FILE — магические числа (вынеси в константы):"
    echo "$MAGIC" | sed 's/^/  /'
    ISSUES=$((ISSUES + 1))
  fi

done <<< "$CHANGED_FILES"

if [ "$ISSUES" -eq 0 ]; then
  echo "Всё чисто. Код выглядит хорошо."
else
  echo ""
  echo "Найдено $ISSUES потенциальных улучшений"
  echo "Исправлять необязательно прямо сейчас — запиши как техдолг"
fi

echo "━━━━━━━━━━━━━━━━━━━━━━"
echo ""`,
        "bash",
      ),
      hr(),
      heading(2, "Примеры работы"),
      paragraph("Пример вывода после сессии с 5 изменёнными файлами:"),
      codeBlock(
        `━━━ CODE SIMPLIFIER ━━━
Проверяю 5 изменённых файлов...

WARN src/collections/Frameworks.ts — 612 строк (>500). Рассмотри разбиение на модули.
MINOR src/lib/data.ts — магические числа (вынеси в константы):
  187:  const LIMIT = 1000
  234:  if (views > 500) {

Найдено 2 потенциальных улучшений
Исправлять необязательно прямо сейчас — запиши как техдолг
━━━━━━━━━━━━━━━━━━━━━━`,
        "text",
      ),
      heading(3, "Что пропускает"),
      list([
        "Сессии с менее чем 3 изменёнными файлами",
        "Файлы без кода: `.md`, `.json`, `.env.example`",
        "Числа 0 и 1 — не считаются magic numbers",
        "Числа в комментариях (строки с `//`)",
      ]),
      heading(3, "Что анализирует"),
      list([
        "Файлы больше 500 строк — предложение модульного разбиения",
        "Магические числа больше 99 — предложение вынести в константы",
        "Список файлов выводится в порядке изменений из git diff",
      ]),
      hr(),
      heading(2, "Настройка под себя"),
      list([
        "Измени порог файлов: `500` на нужное значение",
        "Добавь проверку функций через `awk` для подсчёта строк в функциях",
        "Добавь запись результатов в `docs/ai-notes/` как техдолг",
        "Интегрируй с `jscpd` для поиска дублирования кода",
      ]),
      quote(
        "Код не становится проще сам по себе. code-simplifier — это напоминание смотреть назад, а не только вперёд.",
      ),
    ]),
    seoTitle: "code-simplifier: анализ сложности кода при завершении",
    seoDescription:
      "Хук code-simplifier анализирует изменённые файлы на длинные функции, magic numbers, большие файлы. Мягкий code review при Stop.",
  },

  // ─── 14. auto-lint ─────────────────────────────────────────────────────────
  {
    slug: "auto-lint",
    description: root([
      heading(2, "Простым языком"),
      paragraph(
        "Линтер — это инструмент который проверяет код на ошибки и несоответствия стилю. Для TypeScript один линтер, для Python другой, для Go третий. Этот хук работает как диспетчер: смотрит на расширение файла и сам выбирает нужный инструмент.",
      ),
      paragraph(
        "Ты пишешь код на нескольких языках — хук покрывает все сразу. Изменил Python-файл — запускается ruff. Изменил TypeScript — запускается ESLint. Настраивается один раз, работает для всего проекта.",
      ),
      hr(),
      heading(2, "Что делает"),
      paragraph(
        "Хук **auto-lint** — универсальный линтер, который определяет тип файла по расширению и запускает подходящий инструмент. TypeScript — ESLint, Python — ruff, Go — gofmt, Rust — rustfmt, CSS — stylelint. Один хук для всего стека.",
      ),
      paragraph(
        'Работает как "зонтичный" хук поверх специализированных (prettier, python-lint). Если специализированный хук уже запущен — auto-lint дополняет его ESLint-проверками, которые prettier не делает.',
      ),
      heading(3, "Когда срабатывает"),
      paragraph(
        "**Триггер:** `PostToolUse` — после `Write` или `Edit`. **Условие:** любой файл с кодом. **Действие:** определяет расширение → запускает соответствующий линтер с `--fix` флагом.",
      ),
      hr(),
      heading(2, "Установка"),
      list(
        [
          "Установи нужные линтеры для своего стека (см. список ниже)",
          "Добавь конфиг `PostToolUse` в `.claude/settings.json`",
          "Создай `~/.claude/hooks/auto-lint.sh` с правами `chmod +x`",
          "Проверь: измени файл и убедись что линтер запускается",
        ],
        true,
      ),
      heading(3, "Конфиг settings.json"),
      codeBlock(
        `{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/hooks/auto-lint.sh"
          }
        ]
      }
    ]
  }
}`,
        "json",
      ),
      heading(3, "Скрипт хука"),
      codeBlock(
        `#!/bin/bash
# auto-lint.sh — универсальный линтер по расширению файла
# PostToolUse: Write | Edit

FILE="\${CLAUDE_TOOL_INPUT_PATH:-}"
[ -z "$FILE" ] && exit 0

case "$FILE" in
  */node_modules/*|*/dist/*|*/.next/*|*/build/*|*/.venv/*|*/venv/*)
    exit 0
    ;;
esac

EXT="\${FILE##*.}"

case "$EXT" in
  ts|tsx)
    if command -v npx &>/dev/null; then
      ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
      if ls "$ROOT/eslint.config."* "$ROOT/.eslintrc."* &>/dev/null 2>&1; then
        npx eslint --fix "$FILE" 2>/dev/null || true
      fi
    fi
    ;;
  js|jsx|mjs|cjs)
    command -v npx &>/dev/null && npx eslint --fix "$FILE" 2>/dev/null || true
    ;;
  py)
    if command -v ruff &>/dev/null; then
      ruff format "$FILE" 2>/dev/null
      ruff check --fix "$FILE" 2>/dev/null || true
    fi
    ;;
  go)
    command -v gofmt &>/dev/null && gofmt -w "$FILE" 2>/dev/null
    command -v go &>/dev/null && go vet "$FILE" 2>/dev/null || true
    ;;
  rs)
    command -v rustfmt &>/dev/null && rustfmt "$FILE" 2>/dev/null
    ;;
  css|scss)
    if command -v npx &>/dev/null; then
      npx prettier --write "$FILE" 2>/dev/null
      npx stylelint --fix "$FILE" 2>/dev/null || true
    fi
    ;;
  sh|bash)
    command -v shellcheck &>/dev/null && shellcheck "$FILE" 2>/dev/null || true
    ;;
  *) exit 0 ;;
esac

exit 0`,
        "bash",
      ),
      paragraph("Установка линтеров для разных языков:"),
      codeBlock(
        `# TypeScript / JavaScript
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin

# Python
pip install ruff
# или через uv
uv add ruff --dev

# Go — встроен в toolchain, дополнительно:
go install golang.org/x/tools/cmd/goimports@latest

# Rust — встроен в rustup:
rustup component add rustfmt clippy

# CSS
npm install --save-dev stylelint stylelint-config-standard

# Shell
apt install shellcheck   # Debian/Ubuntu
brew install shellcheck  # macOS`,
        "bash",
      ),
      hr(),
      heading(2, "Примеры работы"),
      heading(3, "Что пропускает"),
      list([
        "Файлы в `node_modules`, `dist`, `.next`, `venv` — автоматически",
        "Языки без установленного линтера — хук тихо пропускает",
        "Файлы без известного расширения",
        "Markdown и JSON — только prettier если настроен отдельно",
      ]),
      heading(3, "Что обрабатывает"),
      list([
        "TypeScript/TSX — ESLint с `--fix` (ошибки типов, unused vars)",
        "Python — ruff format + check (как black + isort + flake8)",
        "Go — gofmt форматирование + go vet проверка",
        "Rust — rustfmt форматирование",
        "CSS/SCSS — prettier + stylelint",
        "Shell — shellcheck статический анализ",
      ]),
      hr(),
      heading(2, "Настройка под себя"),
      paragraph(
        "Добавляй новые языки в `case` блок. Для монорепо с несколькими языками — это единственный хук который нужен.",
      ),
      list([
        "Добавь `rb` для Ruby через `rubocop --auto-correct`",
        "Добавь `php` через `php-cs-fixer fix`",
        "Добавь `kt` для Kotlin через `ktlint --format`",
        "Добавь `java` через `google-java-format -i`",
      ]),
      quote(
        "Один хук для всего стека — это не компромисс, это принцип. Меньше конфигурации, больше единообразия.",
      ),
    ]),
    seoTitle: "auto-lint: универсальный линтер для TypeScript, Python, Go",
    seoDescription:
      "Хук auto-lint определяет язык по расширению и запускает ESLint, ruff, gofmt или rustfmt. Единый хук для всего стека в Claude Code.",
  },
];
