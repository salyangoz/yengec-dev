import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { ApiReferenceReact } from '@scalar/api-reference-react'
import '@scalar/api-reference-react/style.css'
import { useI18n } from '@/i18n'
import type { Lang } from '@/i18n/messages'

type Spec = Record<string, unknown>
type Result = { lang: Lang; content?: Spec; failed?: boolean }

// We fetch the language-specific spec ourselves and hand Scalar an inline
// `content` object with a stable per-lang `slug`, instead of letting it fetch a
// `url`. Passing a URL makes Scalar manage an async document in a persisted
// workspace store; a single failed/stale load then surfaces as
// "Document '…' could not be loaded" on later visits. Inline content is
// deterministic. State is tagged with the lang it belongs to (and only set in the
// async callback) so a language switch discards stale content without a
// synchronous setState in the effect.
export function Reference() {
  const { t, lang } = useI18n()
  const [result, setResult] = useState<Result | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch(`/openapi-app.${lang}.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then((content: Spec) => !cancelled && setResult({ lang, content }))
      .catch(() => !cancelled && setResult({ lang, failed: true }))
    return () => {
      cancelled = true
    }
  }, [lang])

  const current = result?.lang === lang ? result : null

  return (
    <div className="min-h-screen">
      <div className="flex h-12 items-center border-b border-border bg-card px-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-brand-700 hover:text-brand-600"
        >
          <ArrowLeft size={16} />
          <img src="/yengec-logo.svg" alt="Yengeç" className="h-5 w-auto" />
          <span className="text-muted">Developer Hub</span>
        </Link>
      </div>
      {current?.failed && <div className="p-10 text-error">{t.reference.failed}</div>}
      {!current && <div className="p-10 text-muted">{t.reference.loading}</div>}
      {current?.content && (
        <ApiReferenceReact
          key={lang}
          configuration={{ content: current.content, slug: `yengec-api-${lang}` }}
        />
      )}
    </div>
  )
}
