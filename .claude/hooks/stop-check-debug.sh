#!/bin/bash
# Stop hook: проверяет staged файлы на console.log/debugger/print()
# Заменяет правило из automation.md — теперь это детерминистичный хук

INPUT=$(cat)
STOP_ACTIVE=$(echo "$INPUT" | jq -r '.stop_hook_active // false')

[ "$STOP_ACTIVE" = "true" ] && exit 0

cd "$CLAUDE_PROJECT_DIR" 2>/dev/null || exit 0

# Проверяем только изменённые файлы (staged + unstaged)
CHANGED=$(git diff --name-only 2>/dev/null; git diff --cached --name-only 2>/dev/null)
[ -z "$CHANGED" ] && exit 0

WARNINGS=""

# console.log в JS/TS
JS_FILES=$(echo "$CHANGED" | grep -E '\.(ts|tsx|js|jsx)$' | sort -u)
if [ -n "$JS_FILES" ]; then
  for f in $JS_FILES; do
    [ -f "$f" ] || continue
    HITS=$(grep -n 'console\.log\|debugger' "$f" 2>/dev/null | head -3)
    if [ -n "$HITS" ]; then
      WARNINGS="$WARNINGS\n$f: $HITS"
    fi
  done
fi

# print() в Python (только голые print, не logging)
PY_FILES=$(echo "$CHANGED" | grep -E '\.py$' | sort -u)
if [ -n "$PY_FILES" ]; then
  for f in $PY_FILES; do
    [ -f "$f" ] || continue
    HITS=$(grep -n '^\s*print(' "$f" 2>/dev/null | head -3)
    if [ -n "$HITS" ]; then
      WARNINGS="$WARNINGS\n$f: $HITS"
    fi
  done
fi

if [ -n "$WARNINGS" ]; then
  REASON=$(printf "Найдены отладочные выражения в изменённых файлах:%b\nУдали их или подтверди что они нужны." "$WARNINGS")
  jq -n --arg reason "$REASON" '{
    "decision": "block",
    "reason": $reason
  }'
else
  exit 0
fi
