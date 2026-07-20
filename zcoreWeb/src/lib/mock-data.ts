// ============================================================
// Zcore — Mock Data
// ============================================================

export type ProductStatus = "healthy" | "risk" | "loss" | "critical";

export interface Product {
  id: string;
  name: string;
  sku: string;
  salePrice: number;
  cost: number;
  commission: number;
  shipping: number;
  stock: number;
  last30Sales: number;
  netProfit: number;
  margin: number;
  minSafePrice: number;
  status: ProductStatus;
}

export interface Report {
  id: string;
  title: string;
  date: string;
  type: "PDF" | "Excel";
  status: "ready" | "processing" | "failed";
  size: string;
}

export interface DashboardStat {
  label: string;
  value: string;
  change?: string;
  changeType?: "up" | "down" | "neutral";
  color: "green" | "yellow" | "red" | "white";
}

export interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  cta: string;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface SidebarMenuItem {
  label: string;
  href: string;
  icon: string;
}

// ============================================================
// PRODUCTS
// ============================================================
export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Kadın Oversize Hoodie",
    sku: "WH-OVR-001",
    salePrice: 349,
    cost: 145,
    commission: 31.41,
    shipping: 14,
    stock: 82,
    last30Sales: 41,
    netProfit: 158.59,
    margin: 45.4,
    minSafePrice: 218,
    status: "healthy",
  },
  {
    id: "2",
    name: "Erkek Slim Fit Chino",
    sku: "MP-CHN-002",
    salePrice: 199,
    cost: 102,
    commission: 17.91,
    shipping: 14,
    stock: 14,
    last30Sales: 22,
    netProfit: 65.09,
    margin: 32.7,
    minSafePrice: 158,
    status: "healthy",
  },
  {
    id: "3",
    name: "Bluetooth Kulaklık Pro",
    sku: "EL-BT-003",
    salePrice: 549,
    cost: 320,
    commission: 65.88,
    shipping: 14,
    stock: 5,
    last30Sales: 18,
    netProfit: 149.12,
    margin: 27.2,
    minSafePrice: 448,
    status: "critical",
  },
  {
    id: "4",
    name: "Cilt Bakım Seti 5'li",
    sku: "SK-SET-004",
    salePrice: 289,
    cost: 198,
    commission: 43.35,
    shipping: 14,
    stock: 37,
    last30Sales: 8,
    netProfit: 33.65,
    margin: 11.6,
    minSafePrice: 278,
    status: "risk",
  },
  {
    id: "5",
    name: "Ahşap Kahve Sehpası",
    sku: "FN-CFF-005",
    salePrice: 459,
    cost: 310,
    commission: 55.08,
    shipping: 24,
    stock: 19,
    last30Sales: 6,
    netProfit: 69.92,
    margin: 15.2,
    minSafePrice: 415,
    status: "risk",
  },
  {
    id: "6",
    name: "Spor Koşu Ayakkabısı",
    sku: "SH-RUN-006",
    salePrice: 279,
    cost: 195,
    commission: 33.48,
    shipping: 14,
    stock: 3,
    last30Sales: 29,
    netProfit: 36.52,
    margin: 13.1,
    minSafePrice: 262,
    status: "critical",
  },
  {
    id: "7",
    name: "Paslanmaz Termos 500ml",
    sku: "KT-TRM-007",
    salePrice: 149,
    cost: 72,
    commission: 17.88,
    shipping: 9,
    stock: 120,
    last30Sales: 64,
    netProfit: 50.12,
    margin: 33.6,
    minSafePrice: 114,
    status: "healthy",
  },
  {
    id: "8",
    name: "USB-C Hub 7'li",
    sku: "EL-USB-008",
    salePrice: 199,
    cost: 158,
    commission: 23.88,
    shipping: 14,
    stock: 22,
    last30Sales: 11,
    netProfit: 3.12,
    margin: 1.6,
    minSafePrice: 214,
    status: "loss",
  },
  {
    id: "9",
    name: "Yün Kaşmir Şal",
    sku: "AC-KSM-009",
    salePrice: 399,
    cost: 288,
    commission: 47.88,
    shipping: 14,
    stock: 41,
    last30Sales: 3,
    netProfit: 49.12,
    margin: 12.3,
    minSafePrice: 374,
    status: "risk",
  },
  {
    id: "10",
    name: "Oyuncu Mouse Pad XL",
    sku: "GM-MPD-010",
    salePrice: 89,
    cost: 38,
    commission: 10.68,
    shipping: 9,
    stock: 88,
    last30Sales: 47,
    netProfit: 31.32,
    margin: 35.2,
    minSafePrice: 64,
    status: "healthy",
  },
  {
    id: "11",
    name: "Bebek Tulum Seti 3'lü",
    sku: "BB-TLM-011",
    salePrice: 169,
    cost: 142,
    commission: 20.28,
    shipping: 14,
    stock: 9,
    last30Sales: 14,
    netProfit: -7.28,
    margin: -4.3,
    minSafePrice: 196,
    status: "loss",
  },
  {
    id: "12",
    name: "Deri Laptop Çantası",
    sku: "BG-LPT-012",
    salePrice: 649,
    cost: 320,
    commission: 77.88,
    shipping: 24,
    stock: 28,
    last30Sales: 9,
    netProfit: 227.12,
    margin: 35.0,
    minSafePrice: 462,
    status: "healthy",
  },
  {
    id: "13",
    name: "Protein Shake Shaker",
    sku: "SP-SHK-013",
    salePrice: 79,
    cost: 68,
    commission: 9.48,
    shipping: 9,
    stock: 0,
    last30Sales: 22,
    netProfit: -7.48,
    margin: -9.5,
    minSafePrice: 102,
    status: "loss",
  },
  {
    id: "14",
    name: "Dekoratif Mumluk Seti",
    sku: "DK-MUM-014",
    salePrice: 219,
    cost: 89,
    commission: 26.28,
    shipping: 14,
    stock: 56,
    last30Sales: 31,
    netProfit: 89.72,
    margin: 40.9,
    minSafePrice: 155,
    status: "healthy",
  },
  {
    id: "15",
    name: "Çocuk Bisikleti 20\"",
    sku: "KD-BSK-015",
    salePrice: 899,
    cost: 760,
    commission: 107.88,
    shipping: 44,
    stock: 7,
    last30Sales: 4,
    netProfit: -12.88,
    margin: -1.4,
    minSafePrice: 970,
    status: "loss",
  },
];

// ============================================================
// REPORTS
// ============================================================
export const mockReports: Report[] = [
  {
    id: "r1",
    title: "Haziran 2025 — Kâr/Zarar Analizi",
    date: "2025-06-30",
    type: "PDF",
    status: "ready",
    size: "2.4 MB",
  },
  {
    id: "r2",
    title: "Haziran 2025 — Stok Risk Raporu",
    date: "2025-06-30",
    type: "Excel",
    status: "ready",
    size: "1.1 MB",
  },
  {
    id: "r3",
    title: "Mayıs 2025 — Aylık Performans",
    date: "2025-05-31",
    type: "PDF",
    status: "ready",
    size: "3.2 MB",
  },
  {
    id: "r4",
    title: "Mayıs 2025 — Minimum Güvenli Fiyat",
    date: "2025-05-31",
    type: "Excel",
    status: "ready",
    size: "0.8 MB",
  },
  {
    id: "r5",
    title: "Nisan 2025 — Ürün Bazlı Marj",
    date: "2025-04-30",
    type: "PDF",
    status: "ready",
    size: "2.9 MB",
  },
  {
    id: "r6",
    title: "Temmuz 2025 — Anlık Durum",
    date: "2025-07-04",
    type: "Excel",
    status: "processing",
    size: "—",
  },
];

// ============================================================
// DASHBOARD STATS
// ============================================================
export const mockStats: DashboardStat[] = [
  {
    label: "Toplam Ürün",
    value: "300",
    change: "+12 bu ay",
    changeType: "up",
    color: "white",
  },
  {
    label: "Riskli Ürün",
    value: "42",
    change: "+5 bu ay",
    changeType: "down",
    color: "yellow",
  },
  {
    label: "Zarar Eden Ürün",
    value: "11",
    change: "-2 bu ay",
    changeType: "up",
    color: "red",
  },
  {
    label: "Ortalama Marj",
    value: "%18.4",
    change: "+1.2pp",
    changeType: "up",
    color: "green",
  },
  {
    label: "Kritik Stok",
    value: "12",
    change: "Acil yenileme",
    changeType: "neutral",
    color: "yellow",
  },
  {
    label: "Güvenli Fiyat Altında",
    value: "27",
    change: "Zarar riski var",
    changeType: "down",
    color: "red",
  },
];

// ============================================================
// SIDEBAR MENU
// ============================================================
export const mockSidebarMenu: SidebarMenuItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Excel Yükle", href: "/upload", icon: "Upload" },
  { label: "Ürünler", href: "/products", icon: "Package" },
  { label: "Analizler", href: "/dashboard", icon: "BarChart2" },
  { label: "Raporlar", href: "/reports", icon: "FileText" },
  { label: "Mağazalar", href: "/dashboard", icon: "Store" },
  { label: "Ayarlar", href: "/settings", icon: "Settings" },
];

// ============================================================
// PRICING
// ============================================================
export const mockPricingPlans: PricingPlan[] = [
  {
    name: "Demo",
    price: "Ücretsiz",
    period: "",
    description: "Sistemi test etmek ve arayüzü keşfetmek için.",
    features: [
      "Dashboard görüntüleme",
      "Demo siparişleri görüntüleme",
      "Demo ürünleri görüntüleme",
      "Ürün takip sistemi örneği",
      "Kâr alarmı örneği",
      "Stok uyarısı örneği",
      "Mağazalar sayfası ön izlemesi",
      "Rapor ekranı ön izlemesi",
      "Bildirim merkezi ön izlemesi",
      "Tema ve arayüz deneyimi",
    ],
    cta: "Hemen İncele",
  },
  {
    name: "Başlangıç",
    price: "₺299",
    period: "/ay",
    description: "Küçük satıcılar için temel takip ve analiz paketi.",
    features: [
      "Toplam 50 ürün takibi",
      "2 mağaza bağlantısı",
      "Komisyon sonrası kâr analizi",
      "Stok ve kâr alarmı",
      "Aylık genel analiz raporu",
      "3 aylık durum analiz raporu ve çıktı alma",
      "E-posta desteği",
    ],
    cta: "Ücretsiz Başla",
  },
  {
    name: "Profesyonel",
    price: "₺549",
    period: "/ay",
    description: "Büyüyen mağazalar için gelişmiş analitik ve öncelikli destek.",
    features: [
      "Toplam 250 ürün takibi",
      "5 mağaza bağlantısı",
      "Komisyon sonrası kâr analizi",
      "Stok ve kâr alarmı",
      "PDF + Excel rapor",
      "Öncelikli e-posta desteği",
    ],
    isPopular: true,
    cta: "10 Gün Ücretsiz Dene",
  },
];

// ============================================================
// FEATURES
// ============================================================
export const mockFeatures: Feature[] = [
  {
    icon: "TrendingUp",
    title: "Gerçek Kâr Analizi",
    description:
      "Komisyon, kargo ve ürün maliyetlerini dikkate alarak takip ettiğiniz ürünlerin gerçek net kârını görün.",
  },
  {
    icon: "Bell",
    title: "Kâr Alarmı",
    description:
      "Kâr marjı düşen veya zarar ettirme riski olan ürünleri erken fark edin, fiyat ve maliyet kararlarınızı zamanında alın.",
  },
  {
    icon: "ShieldCheck",
    title: "Güvenli Mağaza Bağlantısı",
    description:
      "Pazaryeri şifrenizi paylaşmadan mağazanızı resmi bağlantı bilgileriyle ZCore'a güvenli şekilde bağlayın.",
  },
  {
    icon: "Package",
    title: "Stok Takibi",
    description:
      "Takip ettiğiniz ürünlerin stok durumunu izleyin, kritik seviyeye düşen ürünleri tek panelden görün.",
  },
  {
    icon: "Sliders",
    title: "Ürün Takip Limiti",
    description:
      "Mevcut planınıza göre analiz edilecek, bildirime dahil edilecek ve kontrol altında tutulacak ürünleri siz seçin.",
  },
  {
    icon: "BarChart3",
    title: "Sade Raporlar",
    description:
      "Satış, stok, kâr ve risk durumlarını karmaşık ekranlara boğulmadan anlaşılır raporlarla takip edin.",
  },
];

// ============================================================
// HOW IT WORKS
// ============================================================
export const mockHowItWorks = [
  {
    step: "01",
    title: "Pazaryerinizi Seçin",
    description:
      "Panelinizden 'Mağaza Ekle' butonuna tıklayarak satış yaptığınız platformu (Trendyol, Hepsiburada vb.) seçin.",
  },
  {
    step: "02",
    title: "Bilgileri Kopyalayın",
    description:
      "Pazaryeri satıcı panelinize girip, entegrasyon ayarları sayfasındaki tüm metni farenizle seçip kopyalayın (Ctrl+C).",
  },
  {
    step: "03",
    title: "Panodan Otomatik Alın",
    description:
      "ZCore'a dönüp 'Panodan Al ve Bağlan' butonuna basın. Akıllı botumuz yapıştırdığınız metnin içinden şifreleri saniyeler içinde ayıklasın.",
  },
  {
    step: "04",
    title: "Analize Başlayın",
    description:
      "Mağazanız anında sisteme bağlandı! Artık canlı sipariş, stok riskleri ve gerçek kârlılık analizlerinizi tek panelden yönetebilirsiniz.",
  },
];

// ============================================================
// COLUMN MAPPINGS (upload page)
// ============================================================
export const mockColumnMappings = [
  { systemField: "Ürün Adı", excelColumn: "Ürün / Ürün Adı" },
  { systemField: "SKU", excelColumn: "Stok Kodu" },
  { systemField: "Satış Fiyatı", excelColumn: "Fiyat" },
  { systemField: "Ürün Maliyeti", excelColumn: "Maliyet (KDV hariç)" },
  { systemField: "Komisyon", excelColumn: "Platform Komisyonu" },
  { systemField: "Kargo", excelColumn: "Kargo Ücreti" },
  { systemField: "Stok Adedi", excelColumn: "Mevcut Stok" },
  { systemField: "Son 30 Gün Satış", excelColumn: "30g Satış Adedi" },
];
