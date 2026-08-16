import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// Public developer docs SPA — no backend proxy (it renders a vendored OpenAPI
// spec and static Turkish guides). The Scalar playground calls the real API
// hosts declared in the spec's `servers` block directly.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  server: {
    port: 5175,
  },
})
