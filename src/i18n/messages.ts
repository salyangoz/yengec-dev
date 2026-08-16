export const LANGS = ['tr', 'en'] as const
export type Lang = (typeof LANGS)[number]

export const LANG_LABELS: Record<Lang, string> = {
  tr: 'Türkçe',
  en: 'English',
}

const tr = {
  nav: {
    overview: 'Genel Bakış',
    guide: 'Başlangıç Rehberi',
    reference: 'API Referansı',
  },
  home: {
    eyebrow: 'Yengeç Developer Hub',
    title: "API App ile Yengeç'e entegre olun",
    intro:
      "Bu dokümantasyon, harici uygulamaların API App üzerinden Yengeç'teki ürün, sipariş ve stok işlemlerini yönetmesi içindir. Aşağıda yalnızca API App tokenının erişebildiği uç noktalar listelenir.",
    ctaGuide: 'Rehbere başla',
    ctaReference: 'API Referansı',
    cards: {
      guide: {
        title: 'Başlangıç Rehberi',
        desc: 'Kimlik doğrulama, kapsamlar (scopes), limitler ve hızlı başlangıç örnekleri.',
      },
      reference: {
        title: 'API Referansı',
        desc: 'API App ile çağırabileceğiniz tüm uç noktaların interaktif dökümü.',
      },
    },
    capabilitiesTitle: 'Neler yapabilirsiniz?',
    capabilities: {
      products: {
        title: 'Ürün & stok yönetimi',
        desc: 'Ürün oluşturun, güncelleyin ve stok hareketlerini yönetin.',
      },
      orders: {
        title: 'Sipariş yönetimi',
        desc: 'Sipariş oluşturun, güncelleyin, iptal edin; fatura ve kargo süreçlerini yürütün.',
      },
      customers: {
        title: 'Müşteri yönetimi',
        desc: 'Müşteri kayıtlarını, ödemelerini ve etiketlerini yönetin.',
      },
      cargo: {
        title: 'Kargo & gönderi',
        desc: 'Kargo oluşturun, iptal edin ve gönderi durumunu takip edin.',
      },
      reports: {
        title: 'Raporlar',
        desc: 'Satış, gelir, gider ve ürün raporlarına erişin.',
      },
    },
  },
  reference: {
    loading: 'Yükleniyor…',
    failed: 'API dokümanı yüklenemedi. Lütfen sayfayı yenileyin.',
  },
  footer: 'Yengeç · API App entegrasyon dokümantasyonu',
  languageLabel: 'Dil',
}

// `tr` is intentionally NOT `as const`: Messages must have string-typed fields
// so other locales can supply their own copy.
export type Messages = typeof tr

const en: Messages = {
  nav: {
    overview: 'Overview',
    guide: 'Getting Started',
    reference: 'API Reference',
  },
  home: {
    eyebrow: 'Yengeç Developer Hub',
    title: 'Integrate with Yengeç using the API App',
    intro:
      "This documentation is for external applications that manage a company's products, orders and stock in Yengeç through the API App. Only the endpoints an API App token can reach are listed here.",
    ctaGuide: 'Start the guide',
    ctaReference: 'API Reference',
    cards: {
      guide: {
        title: 'Getting Started',
        desc: 'Authentication, scopes, limits and quick-start examples.',
      },
      reference: {
        title: 'API Reference',
        desc: 'Interactive listing of every endpoint the API App can call.',
      },
    },
    capabilitiesTitle: 'What you can do',
    capabilities: {
      products: {
        title: 'Products & stock',
        desc: 'Create and update products and manage stock movements.',
      },
      orders: {
        title: 'Order management',
        desc: 'Create, update and cancel orders; run invoicing and shipping flows.',
      },
      customers: {
        title: 'Customer management',
        desc: 'Manage customer records, payments and tags.',
      },
      cargo: {
        title: 'Cargo & shipping',
        desc: 'Create and cancel cargo and track shipment status.',
      },
      reports: {
        title: 'Reports',
        desc: 'Access sales, income, expense and product reports.',
      },
    },
  },
  reference: {
    loading: 'Loading…',
    failed: 'The API document could not be loaded. Please refresh the page.',
  },
  footer: 'Yengeç · API App integration documentation',
  languageLabel: 'Language',
}

export const messages: Record<Lang, Messages> = { tr, en }
