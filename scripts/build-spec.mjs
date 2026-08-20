// Builds public/openapi-app.<lang>.json = the API-App surface for the docs site,
// one file per UI language (en, tr).
//
// Source of truth is yengec-api:
//   - docs/openapi-bundled.json   (full OpenAPI spec, English)
//   - config/api-scopes.php `map` (the allowlist: "METHOD uri" -> required scope)
//
// We keep only operations whose "METHOD uri" is on the allowlist (matched by
// blanking {param} names), inject the required scope into each operation's
// description, and — for Turkish — translate the surfaces we control (info intro,
// tag names, operation summaries, scope note). Scalar's own chrome and the
// per-field schema/param text stay in the spec's source language (English).
//
// Run: npm run build-spec  (needs `php` + the sibling yengec-api checkout;
// the OUTPUT json files are committed, so the app build itself needs neither.)
import { execSync } from 'node:child_process'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { FIELD_TR } from './field-descriptions.tr.mjs'

const here = dirname(new URL(import.meta.url).pathname)
const apiRepo = resolve(here, '../../yengec-api')
const specPath = resolve(apiRepo, 'docs/openapi-bundled.json')
const scopesPath = resolve(apiRepo, 'config/api-scopes.php')

const METHODS = ['get', 'post', 'put', 'patch', 'delete']
const norm = (method, path) =>
  `${method.toUpperCase()} ${path.replace(/^\//, '').replace(/\{[^}]+\}/g, '{}')}`

if (!existsSync(specPath) || !existsSync(scopesPath)) {
  console.error(`Need sibling yengec-api checkout:\n  ${specPath}\n  ${scopesPath}`)
  process.exit(1)
}

const map = JSON.parse(
  execSync('php -r \'echo json_encode((require $argv[1])["map"]);\' ' + JSON.stringify(scopesPath), {
    encoding: 'utf8',
  }),
)
const normMap = new Map()
for (const [key, scope] of Object.entries(map)) {
  const [method, ...rest] = key.split(' ')
  normMap.set(norm(method, rest.join(' ')), scope)
}

const TAGS_TR = {
  Customer: 'Müşteri',
  Integration: 'Entegrasyon',
  'Integration Category': 'Entegrasyon Kategorisi',
  'Integration Product': 'Entegrasyon Ürünü',
  'Integration Property': 'Entegrasyon Özelliği',
  'Integration Warehouse': 'Entegrasyon Deposu',
  Order: 'Sipariş',
  'Order Shipping': 'Sipariş Kargo',
  Product: 'Ürün',
  'Product Category': 'Ürün Kategorisi',
  Report: 'Rapor',
  Tag: 'Etiket',
  Warehouse: 'Depo',
}

const SUMMARIES_TR = {
  'Bulk delete product categories': 'Toplu ürün kategorisi silme',
  'Bulk delete products': 'Toplu ürün silme',
  'Bulk restore products': 'Toplu ürün geri yükleme',
  'Bulk update customers (tags)': 'Toplu müşteri güncelleme (etiketler)',
  'Bulk update integration products': 'Toplu entegrasyon ürünü güncelleme',
  'Bulk update orders': 'Toplu sipariş güncelleme',
  'Bulk update products': 'Toplu ürün güncelleme',
  'Cancel single order': 'Tekil sipariş iptali',
  'Create a customer': 'Müşteri oluştur',
  'Create a payment for customer': 'Müşteri için ödeme oluştur',
  'Create a product category': 'Ürün kategorisi oluştur',
  'Create a tag': 'Etiket oluştur',
  'Create a warehouse': 'Depo oluştur',
  'Create order': 'Sipariş oluştur',
  'Create product': 'Ürün oluştur',
  'Create stock event': 'Stok hareketi oluştur',
  'Delete a product category': 'Ürün kategorisi sil',
  'Delete a tag': 'Etiket sil',
  'Delete order': 'Sipariş sil',
  'Generate e-invoice': 'E-fatura oluştur',
  'Get a product category': 'Ürün kategorisi getir',
  'Get a single integration product': 'Tekil entegrasyon ürünü getir',
  'Get a tag': 'Etiket getir',
  'Get a warehouse': 'Depo getir',
  'Get expenses by period': 'Döneme göre giderler',
  'Get income by period': 'Döneme göre gelirler',
  'Get integration inventory': 'Entegrasyon envanterini getir',
  'Get integration product sales report': 'Entegrasyon ürünü satış raporu',
  'Get integration statuses': 'Entegrasyon durumlarını getir',
  'Get order': 'Sipariş getir',
  'Get product': 'Ürün getir',
  'Get product images': 'Ürün görsellerini getir',
  'Get product sales report': 'Ürün satış raporu',
  'Get sale count': 'Satış adedini getir',
  'Get sales by integration': 'Entegrasyona göre satışlar',
  'Get sales by integration product category': 'Entegrasyon ürün kategorisine göre satışlar',
  'Get sales by product category': 'Ürün kategorisine göre satışlar',
  'Get total expenses': 'Toplam giderler',
  'Get total income': 'Toplam gelirler',
  'List customer payments': 'Müşteri ödemelerini listele',
  'List customers': 'Müşterileri listele',
  'List integration product categories': 'Entegrasyon ürün kategorilerini listele',
  'List integration products': 'Entegrasyon ürünlerini listele',
  'List integration properties': 'Entegrasyon özelliklerini listele',
  'List integration warehouses': 'Entegrasyon depolarını listele',
  'List orders': 'Siparişleri listele',
  'List product categories': 'Ürün kategorilerini listele',
  'List products': 'Ürünleri listele',
  'List shippable orders': 'Kargolanabilir siparişleri listele',
  'List stock events': 'Stok hareketlerini listele',
  'List tags': 'Etiketleri listele',
  'List warehouses': 'Depoları listele',
  'Print shipping slips for orders': 'Siparişler için kargo fişi yazdır',
  'Product status counts': 'Ürün durum sayıları',
  'Pull order from integration': 'Entegrasyondan sipariş çek',
  'Push orders to accounting': 'Siparişleri muhasebeye gönder',
  'Update a product category': 'Ürün kategorisi güncelle',
  'Update a single integration product': 'Tekil entegrasyon ürünü güncelle',
  'Update a tag': 'Etiket güncelle',
  'Update a warehouse': 'Depo güncelle',
  'Update order': 'Sipariş güncelle',
  'Update product': 'Ürün güncelle',
  'Update product images': 'Ürün görsellerini güncelle',
  'Update shipping': 'Kargo güncelle',
}

const INFO = {
  en: { title: 'Yengeç Developer API', description: null }, // keep source description
  tr: {
    title: 'Yengeç Geliştirici API',
    description: `Yengeç API App ile firmanızın ürün, sipariş ve stok işlemlerini programatik yönetin.

## Kimlik doğrulama
Çoğu uç nokta \`POST /v2.0/auth/token\` ile alınan bir Bearer token gerektirir:
\`\`\`
Authorization: Bearer <access_token>
\`\`\`
Her uç noktanın gerektirdiği kapsam (scope) açıklamasında belirtilmiştir.

## Sayfalama
Offset: \`?page=N&limit=N\`. Cursor: \`?limit=N&cursor=...\`.

## Yanıt zarfı
Tekil kayıt \`{ "data": { ... } }\`; listelerde \`meta.pagination\` eklenir.

## Temel URL
Üretim: \`https://api.yengec.co\` · Test: \`https://api-test.yengec.co\``,
  },
}

const scopeNote = (scope, lang) => {
  if (lang === 'tr') {
    return scope === 'api'
      ? '> **Gerekli kapsam:** herhangi bir API App anahtarı'
      : `> **Gerekli kapsam:** \`${scope}\``
  }
  return scope === 'api' ? '> **Required scope:** any API-App key' : `> **Required scope:** \`${scope}\``
}

const spec = JSON.parse(readFileSync(specPath, 'utf8'))
const matched = new Set()

// Replace every `description` string that has a Turkish translation, in place.
function deepTranslate(node) {
  if (Array.isArray(node)) {
    node.forEach(deepTranslate)
    return
  }
  if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      if (k === 'description' && typeof v === 'string' && FIELD_TR[v]) node[k] = FIELD_TR[v]
      else deepTranslate(v)
    }
  }
}

function build(lang) {
  const keptPaths = {}
  for (const [path, item] of Object.entries(spec.paths ?? {})) {
    const kept = {}
    for (const [method, op] of Object.entries(item)) {
      if (!METHODS.includes(method)) continue
      const nk = norm(method, path)
      if (!normMap.has(nk)) continue
      matched.add(nk)
      const summary = lang === 'tr' ? SUMMARIES_TR[op.summary] ?? op.summary : op.summary
      const tags = lang === 'tr' ? (op.tags ?? []).map((tg) => TAGS_TR[tg] ?? tg) : op.tags
      kept[method] = { ...op, summary, tags } // scope note injected after translation
    }
    if (Object.keys(kept).length) {
      for (const [k, v] of Object.entries(item)) if (!METHODS.includes(k)) kept[k] = v
      keptPaths[path] = kept
    }
  }

  // Deep-clone so per-lang mutations (translation, note injection) never leak
  // into the shared source spec or the other language's build.
  const out = JSON.parse(JSON.stringify({ ...spec, paths: keptPaths }))
  out.info = { ...out.info, title: INFO[lang].title }
  if (INFO[lang].description) out.info.description = INFO[lang].description
  if (Array.isArray(out.tags) && lang === 'tr') {
    // Translate tag group names; drop English tag descriptions to avoid mixed language.
    out.tags = out.tags.map(({ description, ...rest }) => ({ ...rest, name: TAGS_TR[rest.name] ?? rest.name }))
  }

  if (lang === 'tr') deepTranslate(out)

  // API-App auth is bearer-only: the Client middleware bypasses the
  // client-id/secret check for API-App tokens, so the reference must show only
  // Bearer auth (the source spec also declares apiKeyClientId/apiKeyClientSecret
  // for other, non-API-App callers — not relevant here).
  out.security = [{ bearerAuth: [] }]
  if (out.components && out.components.securitySchemes) {
    const bearer = out.components.securitySchemes.bearerAuth
    out.components.securitySchemes = bearer ? { bearerAuth: bearer } : {}
  }

  // Inject the required-scope note (after translation, so it isn't itself a
  // translation target and the underlying description is already localized).
  for (const [path, item] of Object.entries(out.paths)) {
    for (const [method, op] of Object.entries(item)) {
      if (!METHODS.includes(method)) continue
      const note = scopeNote(normMap.get(norm(method, path)), lang)
      op.description = op.description ? `${note}\n\n${op.description}` : note
    }
  }

  const outPath = resolve(here, `../public/openapi-app.${lang}.json`)
  writeFileSync(outPath, JSON.stringify(out, null, 2))
  const opCount = Object.values(keptPaths).reduce(
    (n, it) => n + Object.keys(it).filter((k) => METHODS.includes(k)).length,
    0,
  )
  console.log(`Wrote ${outPath} (${opCount} operations, ${Object.keys(keptPaths).length} paths)`)
}

build('en')
build('tr')

const missing = [...normMap.keys()].filter((k) => !matched.has(k))
if (missing.length) {
  console.log(`\nAllowlist entries with no spec operation (${missing.length}):`)
  for (const m of missing.sort()) console.log(`  - ${m}`)
}
