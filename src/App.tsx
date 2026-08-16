import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { Home } from '@/pages/Home'
import { Guide } from '@/pages/Guide'
import { useI18n } from '@/i18n'

// Scalar is a large bundle — load it only when the reference route is visited so
// the landing/guide pages stay light.
const Reference = lazy(() =>
  import('@/pages/Reference').then((m) => ({ default: m.Reference })),
)

export default function App() {
  const { t } = useI18n()
  return (
    <BrowserRouter>
      <Routes>
        {/* Reference renders full-bleed (Scalar owns its own chrome) */}
        <Route
          path="/reference"
          element={
            <Suspense fallback={<div className="p-10 text-muted">{t.reference.loading}</div>}>
              <Reference />
            </Suspense>
          }
        />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/guide" element={<Guide />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
