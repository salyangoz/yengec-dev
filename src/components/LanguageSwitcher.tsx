import { Languages } from 'lucide-react'
import { useI18n } from '@/i18n'
import { LANGS, LANG_LABELS } from '@/i18n/messages'
import { cn } from '@/lib/utils'

export function LanguageSwitcher() {
  const { lang, setLang, t } = useI18n()
  return (
    <div
      className="flex items-center gap-1 rounded-lg border border-border p-0.5"
      role="group"
      aria-label={t.languageLabel}
    >
      <Languages size={15} className="ml-1 mr-0.5 text-muted" aria-hidden />
      {LANGS.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          title={LANG_LABELS[code]}
          className={cn(
            'rounded-md px-2 py-1 text-xs font-semibold uppercase transition-colors',
            lang === code
              ? 'bg-brand-600 text-white'
              : 'text-muted hover:bg-brand-50 hover:text-brand-700',
          )}
        >
          {code}
        </button>
      ))}
    </div>
  )
}
