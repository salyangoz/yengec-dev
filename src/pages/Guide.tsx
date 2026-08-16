import { useMemo } from 'react'
import guideTr from '@/content/getting-started.tr.md?raw'
import guideEn from '@/content/getting-started.en.md?raw'
import { renderMarkdown } from '@/lib/markdown'
import { useI18n } from '@/i18n'
import type { Lang } from '@/i18n/messages'

const guides: Record<Lang, string> = { tr: guideTr, en: guideEn }

export function Guide() {
  const { lang } = useI18n()
  const html = useMemo(() => renderMarkdown(guides[lang]), [lang])
  return <article className="prose max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
}
