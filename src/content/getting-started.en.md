# Getting Started

This guide is for developers integrating with Yengeç through the **API App**.
The API App is a per-company add-on that lets an external application manage a company's
**products, orders and stock** in Yengeç programmatically.

> For the field-by-field request/response schema of each endpoint, see the
> **[API Reference](/reference)**. This guide explains the authentication, scopes and limits
> under which you call the API.

## 1. Authentication

Send your API token as a Bearer token on every request:

```
Authorization: Bearer <access_token>
```

The company is always part of the path (`/company/{company}/...`); the token is validated against
that company. Using it with a different company than the token belongs to returns `401`.

The token may only call endpoints on the **allowlist** (the ones shown in the API Reference). Calling
an endpoint that is not listed returns `403`.

## 2. Scopes

An API key can be granted a subset of the scopes below. A key created without an explicit scope list
receives all of them.

| Scope | Description |
|---|---|
| `integration:read` / `integration:update` | Read / update integrations |
| `integration-product:read` / `:update` / `:create` | Integration products |
| `order:read` / `:update` / `:create` | Orders |

Integration endpoints are restricted by these scopes; other endpoints (product, order, customer, …)
can be called with any API key.

## 3. Limits

Limits are determined by the company's **API package tier** (`api`, `api-growth`, `api-business`).
If several packages are active, the **most generous** tier applies to each field.

| Package code | Rate (req/min) | Monthly products | Monthly sales |
|---|---|---|---|
| _default_ | 90 | 1000 | 1000 |
| `api` | 90 | 1000 | 1000 |
| `api-growth` | 180 | 5000 | 5000 |
| `api-business` | 360 | 10000 | 10000 |

- **Rate:** requests allowed within a rolling minute. Exceeding it returns `429` + `Retry-After`.
- **Products / Sales:** only **create** calls count against the quota. Updates and stock operations
  do not consume it. The quota resets on the 1st of each month; when exhausted it returns `403`.

## 4. Error responses

| Status | When it happens |
|---|---|
| `401` | Token is orphaned/unknown, or the `{company}` in the path doesn't match the token's company. |
| `403` | Endpoint is not permitted for this token **or** the monthly create quota is exhausted. |
| `422` | Request body validation error; details in the `errors` field. |
| `429` | Per-minute rate limit exceeded. The response carries a `Retry-After` header (seconds). |

On `429`, wait the `Retry-After` seconds and retry (exponential backoff recommended).

## 5. Request / response contract

### Envelope

Single record → `{ "data": { ... } }`. Paginated list → adds `meta.pagination`:

```json
{
  "data": [ ... ],
  "meta": { "pagination": { "total": 100, "count": 20, "per_page": 20, "current_page": 1, "total_pages": 5 } }
}
```

Cursor-based lists carry `next_cursor` / `prev_cursor` in `pagination` instead of a page number.

### Pagination

- Offset: `?page=N&limit=N`
- Cursor: `?limit=N&cursor=...` (use the `next_cursor` value from the response)

### Timezone

Date/time values are stored and returned in `Europe/Istanbul` by default. To interpret them in your
own timezone, send the `X-Timezone: Europe/London` header.

## 6. Quick start

```bash
TOKEN="<api_access_token>"
COMPANY="<company_uuid>"

# Create a catalog product (uses 1 from the products quota)
curl -X POST "https://api.yengec.co/v2.0/company/$COMPANY/product" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "name": "Cotton T-Shirt - White M", "type": "basic", "is_active": true, "price": 199.90, "tax_rate": 10, "quantity": 50 }'

# Add 25 units to the product's stock (does not consume quota)
curl -X POST "https://api.yengec.co/v2.0/company/$COMPANY/product/<PRODUCT_UUID>/stock" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "quantity": 25 }'
```

For the full list of endpoints and an interactive playground, go to the **[API Reference](/reference)**.
