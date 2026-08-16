import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  Code2,
  Boxes,
  ShoppingCart,
  Users,
  Truck,
  Store,
  BarChart3,
} from 'lucide-react'
import { useI18n } from '@/i18n'

export function Home() {
  const { t } = useI18n()

  const cards = [
    { to: '/guide', icon: BookOpen, ...t.home.cards.guide },
    { to: '/reference', icon: Code2, ...t.home.cards.reference },
  ]
  const capabilities = [
    { icon: Boxes, ...t.home.capabilities.products },
    { icon: ShoppingCart, ...t.home.capabilities.orders },
    { icon: Users, ...t.home.capabilities.customers },
    { icon: Truck, ...t.home.capabilities.cargo },
    { icon: Store, ...t.home.capabilities.integrations },
    { icon: BarChart3, ...t.home.capabilities.reports },
  ]

  return (
    <div>
      <section className="mb-12">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-brand-600">
          {t.home.eyebrow}
        </p>
        <h1 className="mb-4 text-4xl font-bold tracking-tight">{t.home.title}</h1>
        <p className="max-w-2xl text-lg leading-relaxed text-muted">{t.home.intro}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/guide"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 font-medium text-white transition-colors hover:bg-brand-700"
          >
            {t.home.ctaGuide} <ArrowRight size={18} />
          </Link>
          <Link
            to="/reference"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 font-medium text-foreground transition-colors hover:bg-brand-50"
          >
            {t.home.ctaReference}
          </Link>
        </div>
      </section>

      <section className="mb-12 grid gap-4 sm:grid-cols-2">
        {cards.map(({ to, icon: Icon, title, desc }) => (
          <Link
            key={to}
            to={to}
            className="group rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
          >
            <Icon className="mb-3 text-brand-600" size={24} />
            <h2 className="mb-1 flex items-center gap-1 text-lg font-semibold">
              {title}
              <ArrowRight
                size={16}
                className="opacity-0 transition-opacity group-hover:opacity-100"
              />
            </h2>
            <p className="text-sm text-muted">{desc}</p>
          </Link>
        ))}
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">{t.home.capabilitiesTitle}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex gap-3 rounded-lg border border-border bg-card p-4">
              <Icon className="mt-0.5 shrink-0 text-brand-600" size={20} />
              <div>
                <h3 className="font-medium">{title}</h3>
                <p className="text-sm text-muted">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
