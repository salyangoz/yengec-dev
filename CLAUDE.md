# CLAUDE.md

Guidance for Claude Code when working in `yengec-developer-hub`.

## What this is

Public, **multi-language** developer documentation for the Yengeç **API App** surface — it shows only
the endpoints an external API-App token may call. Part of the Yengeç workspace (see the root
`../CLAUDE.md`). Deliberately built on the **same stack as the `../../owl/app`** project.

## Stack & conventions (mirror `owl/app`)

- **Vite + React 19 + TypeScript**, **Tailwind CSS v4**. Design tokens live in the `@theme` block of
  `src/index.css` and mirror `src/lib/design-tokens.ts` — **keep both in sync**.
- Routing: **React Router v7**. Icons: **lucide-react**. Class merge helper: `cn()` in `src/lib/utils.ts`.
- Markdown guides: authored in `src/content/*.md`, imported with `?raw`, rendered via
  `src/lib/markdown.ts` (`marked` + `dompurify`).
- Path alias **`@/` → `src/`**.
- **No backend/auth**: this is a static docs SPA. Do not add JWT/tenant routing. The Scalar playground
  calls the real API hosts from the spec's `servers` block directly.
- **Colors** are taken from **yengec-app** (`assets/scss/_variables.scss`): primary `#096fa0`,
  secondary `#f33c42`, bg `#f6f5f3`, text `#1f1f1f`, etc. Tokens live in `src/index.css` `@theme` ↔
  `src/lib/design-tokens.ts` — keep both in sync.

## i18n (multi-language)

Lightweight custom i18n (no library), default **Turkish**, secondary **English**; extensible.
- UI strings: `src/i18n/messages.ts` (`tr` is the source of truth for the `Messages` shape; every
  other locale must supply the same keys). Add a language: extend `LANGS` + add its `Messages` object.
- Access via `useI18n()` → `{ lang, setLang, t }`; components read `t.<section>.<key>` (type-checked).
- Guides are per-language markdown: `src/content/getting-started.<lang>.md`, selected in `Guide.tsx`.
- Choice persists in `localStorage` (`yengec-hub-lang`) and sets `<html lang>`. Switcher in the header.
- The **API reference is localized too**: `Reference.tsx` loads `public/openapi-app.<lang>.json`, and
  `build-spec` translates the surfaces we control per language — info/intro, tag names, operation
  summaries, the injected scope note, and **field/parameter/response descriptions**
  (`scripts/field-descriptions.tr.mjs`, keyed by the English source string; unmapped → English
  fallback). **Only Scalar's own chrome** (buttons, section labels like "Responses") stays English —
  Scalar has no locale option.
- To add a locale to the reference: add its code + `Messages` in `src/i18n/`, then add its tag/summary
  maps + intro in `scripts/build-spec.mjs` and re-run `npm run build-spec`.
- All user-facing copy must exist in **every** locale; code/comments stay English.

## The spec is generated, not hand-edited

`public/openapi-app.<lang>.json` (one per UI language) is the **API-App allowlist ∩ yengec-api OpenAPI
spec**, with per-language translation of the surfaces we control. Do not edit these by hand — run
`npm run build-spec` (`scripts/build-spec.mjs`; needs `php` + the sibling yengec-api checkout). It reads
`yengec-api/docs/openapi-bundled.json` + `config/api-scopes.php` `map`. To expose a new endpoint: add
it to the allowlist in `yengec-api`, ensure it is documented in `yengec-api/docs/paths/*.yaml`,
re-bundle, then `npm run build-spec` (and add its Turkish summary to the map in build-spec).

## Commands

```bash
npm run dev        # :5175
npm run build      # tsc -b && vite build
npm run lint
npm run build-spec # regenerate public/openapi-app.<lang>.json
```

## Language

All code, comments, and commit messages in **English**. User-facing UI copy is **multi-language** via
i18n (see above) — default Turkish, plus English; every string must be provided in all locales.
