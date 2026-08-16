# Yengeç Developer Hub

Public developer documentation for the Yengeç **API App** — the endpoints an external
integration may call. Multi-language (Turkish default + English). Built with the same stack as the `owl` app
(**Vite + React 19 + TypeScript + Tailwind CSS v4**), rendering the API reference with
[Scalar](https://github.com/scalar/scalar) and static Turkish guides.

## Stack

- Vite + React 19 + TypeScript, Tailwind CSS v4 (`@theme` tokens in `src/index.css` ↔ `src/lib/design-tokens.ts`; palette from **yengec-app**)
- i18n: lightweight custom context (`src/i18n/`), default Turkish + English, extensible
- Routing: React Router v7 · Icons: Lucide · Markdown: `marked` + `dompurify`
- API reference: `@scalar/api-reference-react` over `public/openapi-app.<lang>.json` (per language)
- Path alias `@/` → `src/`

## Commands

```bash
npm install
npm run dev        # http://localhost:5175
npm run build      # tsc -b && vite build -> dist/
npm run preview
npm run lint
npm run build-spec # regenerate public/openapi-app.<lang>.json (needs php + sibling yengec-api)
```

## The OpenAPI spec (`public/openapi-app.<lang>.json`)

One filtered spec per UI language. Each is the **filtered** API-App surface: the operations in
`yengec-api`'s OpenAPI spec whose `METHOD path` is in `config/api-scopes.php`'s allowlist (matched by
blanking `{param}` names), with the required scope injected into each operation. `build-spec` also
**translates** the surfaces we control per language (info/intro, tag names, operation summaries, scope
note); Scalar's chrome and per-field schema/param text stay English. Source of truth is `yengec-api`;
run `npm run build-spec` to regenerate.

> Coverage note: some allowlisted endpoints aren't in the hand-maintained OpenAPI spec yet
> (customer show/update/delete, orders summary/patch, cargo, a few v1 integration-order and
> product-list routes). They need authoring in `yengec-api/docs/paths/*.yaml` to appear here.

## Deploy — Cloudflare Pages

Deployed via **Cloudflare Pages**, connected to this repo (**Workers & Pages → Create → Pages →
Connect to Git**):

| Setting | Value |
|---|---|
| Production branch | `master` |
| Framework preset | None (Vite) |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | `20` (from `.nvmrc`, or set `NODE_VERSION=20`) |

- SPA routing (`/guide`, `/reference`) is handled by Cloudflare's static-assets
  `not_found_handling: "single-page-application"` — do **not** add a `_redirects` `/* /index.html`
  rule; the Workers assets runtime rejects it as an infinite loop.
- Cloudflare auto-builds on every push to `master` and gives preview URLs for PRs.
- Custom domain: **`dev.yengec.co`** (Pages project → Custom domains).
- `npm run build-spec` is a dev-time step (needs php + yengec-api); the committed
  `public/openapi-app.*.json` is what CF builds — CF needs neither php nor yengec-api.

CI (`.github/workflows/test.yml`) runs lint + build on PRs.
