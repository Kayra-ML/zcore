// ============================================================
// Demo (FREE plan) için örnek veriler
// Sadece buradan yönetin — tüm sayfalar buradan okur
// ============================================================

export const DEMO_ORDERS = [
  {
    id: 'ORD-2024-0001',
    storeId: 'Trendyol',
    orderDate: Date.now() - 1 * 24 * 60 * 60 * 1000,
    date: '9 Tem 2026',
    customer: 'Ayşe Yılmaz',
    phone: '+90 532 *** ** **',
    address: 'Kadıköy, İstanbul — (Demo Adres)',
    product: 'Kablosuz Kulaklık Pro',
    quantity: 1,
    amount: '₺899.00',
    status: 'delivered',
  },
  {
    id: 'ORD-2024-0002',
    storeId: 'Hepsiburada',
    orderDate: Date.now() - 2 * 24 * 60 * 60 * 1000,
    date: '8 Tem 2026',
    customer: 'Mehmet Kaya',
    phone: '+90 555 *** ** **',
    address: 'Çankaya, Ankara — (Demo Adres)',
    product: 'Mekanik Klavye v2',
    quantity: 1,
    amount: '₺2.100.00',
    status: 'shipped',
  },
  {
    id: 'ORD-2024-0003',
    storeId: 'Trendyol',
    orderDate: Date.now() - 3 * 24 * 60 * 60 * 1000,
    date: '7 Tem 2026',
    customer: 'Zeynep Demir',
    phone: '+90 542 *** ** **',
    address: 'Konak, İzmir — (Demo Adres)',
    product: 'Ergonomik Mouse',
    quantity: 2,
    amount: '₺1.700.00',
    status: 'processing',
  },
  {
    id: 'ORD-2024-0004',
    storeId: 'Amazon',
    orderDate: Date.now() - 4 * 24 * 60 * 60 * 1000,
    date: '6 Tem 2026',
    customer: 'Ali Çelik',
    phone: '+90 538 *** ** **',
    address: 'Nilüfer, Bursa — (Demo Adres)',
    product: 'SSD 1TB Gen4',
    quantity: 1,
    amount: '₺1.800.00',
    status: 'delivered',
  },
  {
    id: 'ORD-2024-0005',
    storeId: 'Hepsiburada',
    orderDate: Date.now() - 5 * 24 * 60 * 60 * 1000,
    date: '5 Tem 2026',
    customer: 'Fatma Şahin',
    phone: '+90 506 *** ** **',
    address: 'Seyhan, Adana — (Demo Adres)',
    product: 'Spor Ayakkabı Beyaz',
    quantity: 1,
    amount: '₺1.500.00',
    status: 'shipped',
  },
  {
    id: 'ORD-2024-0006',
    storeId: 'N11',
    orderDate: Date.now() - 6 * 24 * 60 * 60 * 1000,
    date: '4 Tem 2026',
    customer: 'Burak Arslan',
    phone: '+90 530 *** ** **',
    address: 'Muratpaşa, Antalya — (Demo Adres)',
    product: 'Laptop Sırt Çantası',
    quantity: 1,
    amount: '₺950.00',
    status: 'processing',
  },
];

export const DEMO_PRODUCTS = [
  { id: 'PRD-001', name: 'Keten Gömlek Slim Fit', store: 'Trendyol', category: 'Giyim', price: '₺499.00', stock: 145 },
  { id: 'PRD-002', name: 'Mekanik Klavye v2', store: 'Hepsiburada', category: 'Elektronik', price: '₺2.100.00', stock: 89 },
  { id: 'PRD-003', name: 'Ergonomik Mouse', store: 'N11', category: 'Elektronik', price: '₺850.00', stock: 230 },
  { id: 'PRD-004', name: 'Spor Ayakkabı Beyaz', store: 'Trendyol', category: 'Ayakkabı', price: '₺1.500.00', stock: 12 },
  { id: 'PRD-005', name: 'SSD 1TB Gen4', store: 'Amazon', category: 'Donanım', price: '₺1.800.00', stock: 45 },
  { id: 'PRD-006', name: 'Nemlendirici Yüz Kremi', store: 'Hepsiburada', category: 'Kozmetik', price: '₺150.00', stock: 450 },
  { id: 'PRD-007', name: 'Deri Cüzdan', store: 'Trendyol', category: 'Aksesuar', price: '₺650.00', stock: 78 },
  { id: 'PRD-008', name: 'Laptop Sırt Çantası', store: 'Amazon', category: 'Çanta', price: '₺950.00', stock: 34 },
];

export const DEMO_METRICS = {
  revenue: '₺128.4k',
  revenueGrowth: '+12.5%',
  orders: '1.245',
  ordersGrowth: '+8.2%',
  growthRate: '%12.4',
  growthRateDelta: '-1.1%',
  pendingOrders: 45,
  shippedOrders: 89,
  deliveredOrders: 145,
};

export const DEMO_ANALYSIS = {
  chartData: [40, 70, 45, 90, 65, 100, 80],
  topProducts: [
    { name: 'Kablosuz Kulaklık Pro', sales: 124, growth: '+12%', amount: '₺4.200', down: false },
    { name: 'Mekanik Klavye v2', sales: 86, growth: '+5%', amount: '₺2.800', down: false },
    { name: 'Ergonomik Mouse', sales: 54, growth: '-2%', amount: '₺1.100', down: true },
  ],
  trafficSources: [
    { source: 'Trendyol', percentage: 45, color: 'bg-[#ffb4ab]' },
    { source: 'Hepsiburada', percentage: 35, color: 'bg-[#a078ff]' },
    { source: 'Amazon', percentage: 20, color: 'bg-[#4edea3]' },
  ],
  avgBasket: '₺84.50',
  avgBasketDelta: '+₺12.20',
};
