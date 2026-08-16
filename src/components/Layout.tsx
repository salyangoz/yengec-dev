import { NavLink, Outlet, Link } from 'react-router-dom'
import { BookOpen, Code2, Home as HomeIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useI18n } from '@/i18n'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

export function Layout() {
  const { t } = useI18n()
  const nav = [
    { to: '/', label: t.nav.overview, icon: HomeIcon, end: true },
    { to: '/guide', label: t.nav.guide, icon: BookOpen, end: false },
    { to: '/reference', label: t.nav.reference, icon: Code2, end: false },
  ]

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-border bg-card/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/yengec-logo.svg" alt="Yengeç" className="h-6 w-auto" />
            <span className="border-l border-border pl-2.5 text-sm font-semibold text-muted">
              Developer Hub
            </span>
          </Link>
          <nav className="ml-auto flex items-center gap-1">
            {nav.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-muted hover:bg-brand-50/60 hover:text-brand-700',
                  )
                }
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
          </nav>
          <LanguageSwitcher />
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-10">
        <Outlet />
      </main>
      <footer className="border-t border-border py-6 text-center text-sm text-muted">
        {t.footer}
      </footer>
    </div>
  )
}
