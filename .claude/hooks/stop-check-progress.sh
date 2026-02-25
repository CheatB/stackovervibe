#!/bin/bash
# Stop hook: проверяет незакоммиченные изменения и напоминает обновить прогресс
# Блокирует завершение если есть несохранённая работа

INPUT=$(cat)
STOP_ACTIVE=$(echo "$INPUT" | jq -r '.stop_hook_active // false')

# Защита от бесконечного цикла — если хук уже активен, пропускаем
if [ "$STOP_ACTIVE" = "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR" 2>/dev/null || exit 0

# Считаем изменённые файлы (staged + unstaged, без node_modules и .next)
CHANGED=$(git diff --name-only 2>/dev/null; git diff --cached --name-only 2>/dev/null; git ls-files --others --exclude-standard 2>/dev/null)
CHANGED_CODE=$(echo "$CHANGED" | grep -v '^$' | grep -vE '(node_modules|\.next|\.env$)' | sort -u)
CHANGED_COUNT=$(echo "$CHANGED_CODE" | grep -c .)

# Если нет изменений — всё ок
if [ "$CHANGED_COUNT" -eq 0 ]; then
  exit 0
fi

# Проверяем, обновлён ли CLAUDE.md в этой пачке изменений
CLAUDE_MD_UPDATED=$(echo "$CHANGED_CODE" | grep -c "CLAUDE.md")

REASONS=""

if [ "$CLAUDE_MD_UPDATED" -eq 0 ] && [ "$CHANGED_COUNT" -gt 3 ]; then
  REASONS="Обнови секцию ПРОГРЕСС в CLAUDE.md (изменено $CHANGED_COUNT файлов, но CLAUDE.md не обновлён)."
fi

# Проверяем, есть ли незакоммиченные изменения кода (не только доки)
CODE_FILES=$(echo "$CHANGED_CODE" | grep -E '\.(ts|tsx|js|jsx|py|css|json)$' | grep -c .)
if [ "$CODE_FILES" -gt 5 ]; then
  REASONS="$REASONS Много незакоммиченных файлов кода ($CODE_FILES шт). Предложи коммит."
fi

if [ -n "$REASONS" ]; then
  jq -n --arg reason "$REASONS" '{
    "decision": "block",
    "reason": $reason
  }'
else
  exit 0
fi
