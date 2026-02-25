#!/bin/bash
# PostToolUse hook: автоформат после редактирования файлов
# Заменяет правило из automation.md — теперь это детерминистичный хук

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

[ -z "$FILE_PATH" ] && exit 0

cd "$CLAUDE_PROJECT_DIR" 2>/dev/null || exit 0

case "$FILE_PATH" in
  *node_modules*|*.next*|*.git*) exit 0 ;;
esac

case "$FILE_PATH" in
  *.ts|*.tsx|*.js|*.jsx|*.css|*.json)
    if command -v npx &>/dev/null && [ -f "node_modules/.bin/prettier" ]; then
      npx prettier --write "$FILE_PATH" 2>/dev/null
    fi
    ;;
  *.py)
    if command -v black &>/dev/null; then
      black -q "$FILE_PATH" 2>/dev/null
    fi
    if command -v isort &>/dev/null; then
      isort -q "$FILE_PATH" 2>/dev/null
    fi
    ;;
esac

exit 0
