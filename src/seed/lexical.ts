/**
 * Хелперы для построения Lexical JSON (SerializedEditorState)
 * Используются seed-скриптом для создания richText контента в Payload CMS
 */

/* Форматы текста (битовые флаги Lexical) */
const FORMAT_BOLD = 1
const FORMAT_ITALIC = 2
const FORMAT_CODE = 16

/** Текстовый узел */
function textNode(text: string, format = 0) {
  return {
    type: 'text',
    text,
    format,
    detail: 0,
    mode: 'normal' as const,
    style: '',
    version: 1,
  }
}

/** Парсит markdown-подобную разметку в массив текстовых узлов */
function parseInline(text: string) {
  const nodes: ReturnType<typeof textNode>[] = []
  // Регулярка: **bold**, *italic*, `code`
  const regex = /\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    // Текст до совпадения
    if (match.index > lastIndex) {
      nodes.push(textNode(text.slice(lastIndex, match.index)))
    }

    if (match[1]) {
      // **bold**
      nodes.push(textNode(match[1], FORMAT_BOLD))
    } else if (match[2]) {
      // *italic*
      nodes.push(textNode(match[2], FORMAT_ITALIC))
    } else if (match[3]) {
      // `code`
      nodes.push(textNode(match[3], FORMAT_CODE))
    }

    lastIndex = match.index + match[0].length
  }

  // Остаток текста
  if (lastIndex < text.length) {
    nodes.push(textNode(text.slice(lastIndex)))
  }

  // Если пусто — хотя бы пустой текст
  if (nodes.length === 0) {
    nodes.push(textNode(text))
  }

  return nodes
}

/** Базовые свойства элементного узла */
function elementBase() {
  return {
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
  }
}

/** Заголовок (h1-h6) */
export function heading(level: 1 | 2 | 3 | 4 | 5 | 6, text: string) {
  return {
    type: 'heading',
    tag: `h${level}` as `h${typeof level}`,
    children: parseInline(text),
    ...elementBase(),
  }
}

/** Параграф с поддержкой **bold**, *italic*, `code` */
export function paragraph(text: string) {
  return {
    type: 'paragraph',
    children: parseInline(text),
    textFormat: 0,
    textStyle: '',
    ...elementBase(),
  }
}

/** Блок кода */
export function codeBlock(code: string, language = 'typescript') {
  return {
    type: 'code',
    language,
    children: [textNode(code)],
    ...elementBase(),
  }
}

/** Маркированный список */
export function list(items: string[], ordered = false) {
  return {
    type: 'list',
    listType: ordered ? 'number' : 'bullet',
    tag: ordered ? 'ol' : 'ul',
    start: 1,
    children: items.map((item, i) => ({
      type: 'listitem',
      children: parseInline(item),
      value: i + 1,
      ...elementBase(),
    })),
    ...elementBase(),
  }
}

/** Цитата */
export function quote(text: string) {
  return {
    type: 'quote',
    children: parseInline(text),
    ...elementBase(),
  }
}

/** Горизонтальная линия */
export function hr() {
  return {
    type: 'horizontalrule',
    version: 1,
  }
}

/** Оборачивает массив узлов в корневой объект Lexical (SerializedEditorState) */
export function root(children: unknown[]) {
  return {
    root: {
      type: 'root',
      children,
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  }
}
