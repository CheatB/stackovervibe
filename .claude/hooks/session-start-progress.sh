#!/bin/bash
# SessionStart hook: при старте/возобновлении/compaction напоминает прочитать прогресс

INPUT=$(cat)
SOURCE=$(echo "$INPUT" | jq -r '.source // "startup"')

cd "$CLAUDE_PROJECT_DIR" 2>/dev/null || exit 0

# Читаем секцию ПРОГРЕСС из CLAUDE.md
if [ -f "CLAUDE.md" ]; then
  # Извлекаем блок от "## ПРОГРЕСС" до следующего "---" или "## "
  PROGRESS=$(sed -n '/^## ПРОГРЕСС/,/^---$/p' CLAUDE.md | head -30)

  if [ -n "$PROGRESS" ]; then
    case "$SOURCE" in
      startup|resume)
        echo "=== АВТОНАПОМИНАНИЕ (SessionStart: $SOURCE) ==="
        echo "$PROGRESS"
        echo ""
        echo "Прочитай docs/tasks-detailed.md для деталей следующей задачи."
        echo "=== КОНЕЦ НАПОМИНАНИЯ ==="
        ;;
      compact)
        echo "=== КОНТЕКСТ ПОСЛЕ COMPACTION ==="
        echo "$PROGRESS"
        echo ""
        echo "Контекст был сжат. Продолжай с задачи, указанной выше."
        echo "=== КОНЕЦ ==="
        ;;
      clear)
        echo "=== НОВЫЙ КОНТЕКСТ (после /clear) ==="
        echo "$PROGRESS"
        echo ""
        echo "Контекст очищен. Начни с чтения следующей задачи из docs/tasks-detailed.md."
        echo "=== КОНЕЦ ==="
        ;;
    esac
  fi
fi

exit 0
