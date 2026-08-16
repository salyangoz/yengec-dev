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

## Deploy

Two options — pick one.

### Option A — Cloudflare Pages (recommended for a static SPA)

Connect the GitHub repo in the Cloudflare dashboard (**Workers & Pages → Create → Pages → Connect to
Git**) and use:

| Setting | Value |
|---|---|
| Framework preset | None (Vite) |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | `20` (from `.nvmrc`, or set `NODE_VERSION=20`) |

SPA routing is handled by `public/_redirects` (`/* /index.html 200`). CF Pages auto-builds on every
push to the production branch and gives preview URLs for PRs. Point a custom domain
(e.g. `developers.yengec.co`) at the Pages project in the dashboard. `npm run build-spec` is a
dev-time step (needs php + yengec-api); the committed `public/openapi-app.*.json` is what CF builds.

### Option B — Self-hosted k8s (nginx)

Static build served by nginx (`Dockerfile` → `nginx.conf`), Docker Hub image
`salyangoz/yengec-developer-hub:latest`, `k8s/` manifests (Deployment/Service/Ingress/HPA),
ingress host `developers.yengec.co`. CI in `.github/workflows/production-deploy.yml` (push to
`production`). **Ops prerequisites:** DNS for `developers.yengec.co`, the `app-runner` self-hosted
runner (or a dedicated one), and the `DOCKER_USERNAME`/`DOCKER_PAT`/`SLACK_WEBHOOK` secrets. If you go
with Cloudflare Pages, the `Dockerfile`/`nginx.conf`/`k8s/`/`production-deploy.yml` files are optional
and can be removed.
