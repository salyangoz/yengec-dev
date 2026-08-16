import { marked } from 'marked'
import DOMPurify from 'dompurify'

marked.setOptions({ gfm: true, breaks: false })

/**
 * Renders trusted, in-repo Turkish markdown guides to sanitized HTML. The
 * source is authored by us (not user input), but we still sanitize so a stray
 * raw-HTML snippet in a guide can never inject script.
 */
export function renderMarkdown(md: string): string {
  const raw = marked.parse(md, { async: false }) as string
  return DOMPurify.sanitize(raw)
}
