# Başlangıç Rehberi

Bu rehber, Yengeç'e **API App** üzerinden entegrasyon geliştiren yazılımcılar içindir.
API App; bir firmanın (company) Yengeç hesabındaki **ürün, sipariş ve stok** işlemlerini
programatik olarak yönetmesini sağlayan, firma bazında etkinleştirilen bir eklentidir.

> Her uç noktanın alan-alan tam istek/yanıt şeması için **[API Referansı](/reference)** sayfasına
> bakın. Bu rehber, API'yi hangi kimlik doğrulama, kapsam ve limitler altında çağıracağınızı anlatır.

## 1. Kimlik doğrulama

Elinizdeki API token'ını her istekte Bearer token olarak gönderin:

```
Authorization: Bearer <access_token>
```

Firma her zaman yolun (path) bir parçasıdır (`/company/{company}/...`); token bu firmaya karşı
doğrulanır. Token'ın ait olduğu firmadan farklı bir firma ile kullanılırsa `401` döner.

Token, yalnızca **izin verilen uç noktalar** listesindeki (API Referansı'nda görünen) çağrıları
yapabilir. Listede olmayan bir uç nokta çağrılırsa `403` döner.

## 2. Kapsamlar (scopes)

Bir API anahtarına aşağıdaki kapsamların bir alt kümesi atanabilir. Anahtar bir kapsam listesi
olmadan üretilirse tüm kapsamları alır.

| Kapsam | Açıklama |
|---|---|
| `integration:read` / `integration:update` | Entegrasyon okuma / güncelleme |
| `integration-product:read` / `:update` / `:create` | Entegrasyon ürünleri |
| `order:read` / `:update` / `:create` | Siparişler |

Entegrasyon uç noktaları bu kapsamlara göre kısıtlanır; ürün, sipariş, müşteri gibi diğer
uç noktalar herhangi bir API anahtarıyla çağrılabilir.

## 3. Limitler

Limitler firmanın **API paket kademesine** göre belirlenir (`api`, `api-growth`, `api-business`).
Birden çok aktif paket varsa her alan için **en cömert** kademe geçerlidir.

| Paket kodu | Hız (istek/dakika) | Aylık ürün | Aylık satış |
|---|---|---|---|
| _default_ | 90 | 1000 | 1000 |
| `api` | 90 | 1000 | 1000 |
| `api-growth` | 180 | 5000 | 5000 |
| `api-business` | 360 | 10000 | 10000 |

- **Hız (rate):** kayan bir dakika içinde izin verilen istek sayısı. Aşılırsa `429` + `Retry-After`.
- **Ürün / Satış:** yalnızca **oluşturma** çağrıları kotadan düşer. Güncelleme ve stok işlemleri
  kotayı tüketmez. Kota her ayın 1'inde sıfırlanır; dolduğunda `403` döner.

## 4. Hata yanıtları

| Durum | Ne zaman oluşur |
|---|---|
| `401` | Token sahipsiz/bilinmiyor ya da yoldaki `{company}` token'ın firmasıyla eşleşmiyor. |
| `403` | Uç nokta bu token için izinli değil **veya** aylık oluşturma kotası dolmuş. |
| `422` | İstek gövdesi doğrulama hatası; ayrıntı `errors` alanında. |
| `429` | Dakikalık istek limiti aşılmış. Yanıt `Retry-After` başlığı taşır (saniye). |

`429` alındığında `Retry-After` saniyesi kadar bekleyip tekrar deneyin (exponential backoff önerilir).

## 5. İstek / yanıt sözleşmesi

### Zarf (envelope)

Tek kayıt → `{ "data": { ... } }`. Sayfalı liste → `meta.pagination` eklenir:

```json
{
  "data": [ ... ],
  "meta": { "pagination": { "total": 100, "count": 20, "per_page": 20, "current_page": 1, "total_pages": 5 } }
}
```

Cursor tabanlı listelerde `pagination`, sayfa numarası yerine `next_cursor` / `prev_cursor` taşır.

### Sayfalama

- Offset: `?page=N&limit=N`
- Cursor: `?limit=N&cursor=...` (yanıttaki `next_cursor` değerini kullanın)

### Saat dilimi

Tarih/zaman değerleri varsayılan olarak `Europe/Istanbul` ile saklanır ve döner. Kendi saat
diliminize göre yorumlanması için `X-Timezone: Europe/London` başlığını gönderin.

## 6. Hızlı başlangıç

```bash
TOKEN="<api_access_token>"
COMPANY="<company_uuid>"

# Katalog ürünü oluştur (products kotasından 1 düşer)
curl -X POST "https://api.yengec.co/v2.0/company/$COMPANY/product" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "name": "Pamuklu Tişört - Beyaz M", "type": "basic", "is_active": true, "price": 199.90, "tax_rate": 10, "quantity": 50 }'

# Ürünün stoğuna 25 adet ekle (kota tüketmez)
curl -X POST "https://api.yengec.co/v2.0/company/$COMPANY/product/<PRODUCT_UUID>/stock" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "quantity": 25 }'
```

Tüm uç noktaların tam listesi ve interaktif deneme için **[API Referansı](/reference)** sayfasına geçin.
