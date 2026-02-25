#!/bin/bash
# PostToolUse hook: трекает изменённые файлы для отслеживания прогресса

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

cd "$CLAUDE_PROJECT_DIR" 2>/dev/null || exit 0

# Если файл есть и это не node_modules/.next
if [ -n "$FILE_PATH" ]; then
  case "$FILE_PATH" in
    *node_modules*|*.next*|*.git*) exit 0 ;;
  esac

  LOGFILE=".claude/.changed-files.log"

  # Записываем файл + время (дедупликация при записи)
  RELATIVE=$(echo "$FILE_PATH" | sed "s|$CLAUDE_PROJECT_DIR/||")
  echo "$RELATIVE" >> "$LOGFILE"
  sort -u "$LOGFILE" -o "$LOGFILE" 2>/dev/null
fi

exit 0
