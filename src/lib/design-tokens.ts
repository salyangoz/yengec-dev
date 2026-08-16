/**
 * JS-side design tokens (for dynamic styles). Keep in sync with the @theme
 * block in src/index.css. Palette sourced from yengec-app.
 */
export const tokens = {
  colors: {
    brand: {
      50: '#eef7fb',
      100: '#d5eaf4',
      500: '#1a7ba6',
      600: '#096fa0',
      700: '#0a5980',
    },
    secondary: '#f33c42',
    coral: '#f58e3d',
    success: '#379595',
    warning: '#f27411',
    error: '#c7353a',
    background: '#f6f5f3',
    foreground: '#1f1f1f',
    muted: '#8b8b8b',
    border: '#e5e2dd',
  },
} as const
