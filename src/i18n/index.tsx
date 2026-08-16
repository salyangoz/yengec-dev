import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { LANGS, messages, type Lang, type Messages } from './messages'

const STORAGE_KEY = 'yengec-hub-lang'

function isLang(value: string | null): value is Lang {
  return value !== null && (LANGS as readonly string[]).includes(value)
}

function detectInitialLang(): Lang {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (isLang(stored)) return stored
  return navigator.language.toLowerCase().startsWith('en') ? 'en' : 'tr'
}

interface I18nValue {
  lang: Lang
  setLang: (lang: Lang) => void
  t: Messages
}

const I18nContext = createContext<I18nValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectInitialLang)

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const setLang = (next: Lang) => {
    localStorage.setItem(STORAGE_KEY, next)
    setLangState(next)
  }

  return (
    <I18nContext.Provider value={{ lang, setLang, t: messages[lang] }}>
      {children}
    </I18nContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
