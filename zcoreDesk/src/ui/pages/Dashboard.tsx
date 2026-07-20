import { useState, useEffect, useCallback } from 'react';
import { ShoppingBag, TrendingUp, TrendingDown, Store, Plus, Banknote, Lock, Info, RefreshCw } from 'lucide-react';
import { useSubscription } from '../../core/auth/useSubscription';
import PremiumFeature from '../components/PremiumFeature';
import StoreConnectionWizard from '../components/stores/StoreConnectionWizard';
import { DEMO_METRICS } from '../../core/demo/mockData';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../core/AuthContext';

// Demo planında gösterilecek örnek mağazalar (gerçek değil)
const DEMO_STORES = [
  { id: 'd1', name: 'Trendyol (Demo)', isDemo: true },
  { id: 'd2', name: 'Hepsiburada (Demo)', isDemo: true },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { plan, hasPermission, isDemoOnly, isAtStoreLimit, getLimit, isLoading } = useSubscription();

  const isDemo = isDemoOnly();

  // Gerçek mağazaları Electron'dan çek
  const [realStores, setRealStores] = useState<{
    id: string; platform: string; name: string; supplierId: string; addedAt: number;
  }[]>([]);
  const [showWizard, setShowWizard] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [chartRange, setChartRange] = useState<'1H' | '1A' | '1Y'>('1A');

  const [realMetrics, setRealMetrics] = useState({
    revenue: '₺0.00',
    revenueGrowth: '%0',
    orders: '0',
    ordersGrowth: '%0',
    growthRate: '—',
    growthRateDelta: '',
    pendingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    topProducts: [] as any[],
  });

  const loadStores = useCallback(async () => {
    if (isDemo || !window.electronAPI?.getStores) return;
    const res = await window.electronAPI.getStores();
    if (res.success && res.data) setRealStores(res.data);
  }, [isDemo]);

  const loadMetrics = useCallback(async () => {
    if (isDemo || !window.electronAPI?.getOrders) return;
    const res = await window.electronAPI.getOrders(token || '');
    if (res.success && res.data) {
      const orders = res.data;
      
      let totalRev = 0;
      let pending = 0;
      let shipped = 0;
      let delivered = 0;

      orders.forEach((o: any) => {
        // Parse amount e.g. "₺120.50" or number
        let val = 0;
        if (typeof o.amount === 'string') {
          val = parseFloat(o.amount.replace(/[^0-9,.-]/g, '').replace(',', '.'));
        } else if (typeof o.grossAmount === 'number') {
          val = o.grossAmount;
        } else if (typeof o.amount === 'number') {
          val = o.amount;
        }
        if (!isNaN(val)) totalRev += val;

        if (o.status === 'processing') pending++;
        else if (o.status === 'shipped') shipped++;
        else if (o.status === 'delivered') delivered++;
      });

      const prodMap = new Map();
      orders.forEach((o: any) => {
        const name = o.product || 'Bilinmeyen Ürün';
        let val = typeof o.amount === 'string' ? parseFloat(o.amount.replace(/[^0-9,.-]/g, '').replace(',', '.')) : o.grossAmount || o.amount || 0;
        const cur = prodMap.get(name) || { name, sales: 0, totalAmount: 0 };
        cur.sales += (o.quantity || 1);
        if (!isNaN(val)) cur.totalAmount += val;
        prodMap.set(name, cur);
      });

      const topProducts = Array.from(prodMap.values())
        .sort((a, b) => b.totalAmount - a.totalAmount) // Gelire göre sırala
        .slice(0, 5)
        .map(p => ({
          name: p.name,
          sales: p.sales,
          amount: `₺${p.totalAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        }));

      setRealMetrics({
        revenue: `₺${totalRev.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        revenueGrowth: '+%0', // TODO: Geçmiş dönem hesabı
        orders: orders.length.toString(),
        ordersGrowth: '+%0',
        growthRate: '—',
        growthRateDelta: '',
        pendingOrders: pending,
        shippedOrders: shipped,
        deliveredOrders: delivered,
        topProducts,
      });
    }
  }, [isDemo, token]);

  useEffect(() => { 
    loadStores(); 
    loadMetrics();
  }, [loadStores, loadMetrics]);

  // FREE planında demo mağazaları göster, diğerlerinde gerçek mağazaları
  const displayedStores = isDemo ? DEMO_STORES : realStores;
  const currentStoreCount = isDemo ? 0 : realStores.length;

  // Metrikleri planla eşle: FREE=demo, diğerleri=gerçek API verisi
  const metrics = isDemo ? DEMO_METRICS : realMetrics;

  const handleAddStore = () => {
    if (isDemo) return;
    setShowWizard(true);
  };

  const handleManualSync = async () => {
    if (!token || !window.electronAPI?.syncAllStores) return;
    setSyncing(true);
    await window.electronAPI.syncAllStores(token);
    setSyncing(false);
    loadMetrics(); // Sync bitince metrikleri tazele
  };

  const getDynamicDates = () => {
    const now = new Date();
    const dates = [];
    if (chartRange === '1H') {
      for (let i = 4; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        dates.push(d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }));
      }
    } else if (chartRange === '1Y') {
      for (let i = 4; i >= 0; i--) {
        const d = new Date(now);
        d.setMonth(d.getMonth() - (i * 2.5)); 
        dates.push(d.toLocaleDateString('tr-TR', { month: 'short', year: '2-digit' }));
      }
    } else {
      // 1A (default)
      for (let i = 4; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - (i * 7));
        dates.push(d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }));
      }
    }
    return dates;
  };
  const dynamicDates = getDynamicDates();

  return (
    <div className="max-w-[1600px] mx-auto flex flex-col gap-8 relative z-10">

      {/* Demo Plan Uyarı Bandı */}
      {isDemo && (
        <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400">
          <Info className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">
            <span className="font-semibold">Demo Modu</span> — Gösterilen tüm veriler ve mağazalar örnek içeriktir.
            Gerçek verilerinizi görmek için{' '}
            <button
              onClick={() => navigate('/plans')}
              className="underline underline-offset-2 hover:text-amber-200 transition-colors font-medium"
            >
              bir plan seçin
            </button>
            .
          </p>
        </div>
      )}

      {/* Summary Metrics (Bento Style) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric 1 */}
        <div className="bg-[#1a1b21]/40 backdrop-blur-md border border-white/5 rounded-xl p-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#4edea3]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-[#958ea0] mb-1 uppercase tracking-wider">Dönem Geliri</p>
              <h2 className="text-4xl font-bold text-[#e2e2e9] tracking-tight">{metrics.revenue}</h2>
            </div>
            <div className="p-2 bg-[#4edea3]/10 rounded-lg">
              <Banknote className="text-[#4edea3] w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center text-[#4edea3] text-sm font-medium bg-[#4edea3]/10 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-4 h-4 mr-1" />
              {metrics.revenueGrowth}
            </span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#1a1b21]/40 backdrop-blur-md border border-white/5 rounded-xl p-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#adc6ff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-[#958ea0] mb-1 uppercase tracking-wider">Dönem Siparişleri</p>
              <div className="flex items-baseline gap-2">
                <h2 className="text-4xl font-bold text-[#e2e2e9] tracking-tight">{metrics.orders}</h2>
                <span className="text-sm font-medium text-[#958ea0]">adet</span>
              </div>
            </div>
            <div className="p-2 bg-[#adc6ff]/10 rounded-lg">
              <ShoppingBag className="text-[#adc6ff] w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center text-[#4edea3] text-sm font-medium bg-[#4edea3]/10 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-4 h-4 mr-1" />
              {metrics.ordersGrowth}
            </span>
            <span className="text-sm text-[#494454]">geçen aya göre</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#1a1b21]/40 backdrop-blur-md border border-white/5 rounded-xl p-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#4edea3]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-[#958ea0] mb-1 uppercase tracking-wider">Büyüme Oranı</p>
              <h2 className="text-4xl font-bold text-[#e2e2e9] tracking-tight">{metrics.growthRate}</h2>
            </div>
            <div className="p-2 bg-[#4edea3]/10 rounded-lg">
              <TrendingUp className="text-[#4edea3] w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center text-[#ffb4ab] text-sm font-medium bg-[#ffb4ab]/10 px-2 py-0.5 rounded-full">
              <TrendingDown className="w-4 h-4 mr-1" />
              {metrics.growthRateDelta}
            </span>
            <span className="text-sm text-[#494454]">geçen aya göre</span>
          </div>
        </div>
      </div>

      {/* Main Chart Area Wrapped in PremiumFeature */}
      <PremiumFeature
        isLocked={!hasPermission('hasAdvancedAnalytics')}
        message="Gelişmiş analitik grafikleri PRO pakete özeldir."
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
          {/* Chart Section */}
          <div className="lg:col-span-2 bg-[#1a1b21]/40 backdrop-blur-md border border-white/5 rounded-xl p-6 min-h-[400px] flex flex-col relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold text-[#e2e2e9]">Satış Performansı</h3>
              <div className="flex gap-2">
                {['1H', '1A', '1Y'].map(range => (
                  <button 
                    key={range}
                    onClick={() => setChartRange(range as '1H' | '1A' | '1Y')}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors border ${
                      chartRange === range 
                        ? 'bg-[#d0bcff]/20 text-white border-[#d0bcff]/30 shadow-[0_0_15px_rgba(208,188,255,0.2)]' 
                        : 'bg-white/5 text-[#cbc3d7] border-transparent hover:bg-white/10'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            {/* Faux Chart Representation (CSS/SVG) */}
            <div className="flex-1 relative w-full mt-4 flex items-end border-b border-white/10 pb-2">
              {/* Y-Axis Labels */}
              <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-[#958ea0] py-2 pr-4 z-10 w-12 border-r border-white/5 bg-[#0A0B0E]/50 backdrop-blur-sm">
                <span>₺150k</span>
                <span>₺100k</span>
                <span>₺50k</span>
                <span>0</span>
              </div>

              {/* Chart Content Area */}
              <div className="ml-12 w-full h-full relative">
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  <div className="w-full border-t border-white/5"></div>
                  <div className="w-full border-t border-white/5"></div>
                  <div className="w-full border-t border-white/5"></div>
                  <div className="w-full border-t border-white/5"></div>
                </div>

                <div className="absolute bottom-0 left-0 w-full h-[80%] overflow-hidden">
                  <div className="absolute bottom-0 left-0 w-full h-full" style={{ background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%)', clipPath: 'polygon(0 100%, 0 60%, 10% 50%, 20% 70%, 30% 40%, 40% 55%, 50% 20%, 60% 30%, 70% 10%, 80% 40%, 90% 25%, 100% 5%, 100% 100%)' }}></div>
                  <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 100">
                    <path d="M0,60 L100,50 L200,70 L300,40 L400,55 L500,20 L600,30 L700,10 L800,40 L900,25 L1000,5" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" style={{ filter: 'drop-shadow(0px 8px 8px rgba(255, 255, 255, 0.4))' }}></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* X-Axis Labels */}
            <div className="ml-12 flex justify-between text-xs text-[#958ea0] pt-4 px-2">
              {dynamicDates.map((date, i) => <span key={i}>{date}</span>)}
            </div>
          </div>

          {/* Top Products Section (Revenue Based) */}
          <div className="bg-[#1a1b21]/40 backdrop-blur-md border border-white/5 rounded-xl p-6 min-h-[400px] flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-semibold text-[#e2e2e9]">En Çok Satanlar</h3>
                <p className="text-sm text-[#958ea0]">Gelire göre (Ciro)</p>
              </div>
              <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                <ShoppingBag className="w-5 h-5 text-[#4edea3]" />
              </div>
            </div>
            
            <div className="flex flex-col gap-4 overflow-y-auto">
              {(metrics.topProducts && metrics.topProducts.length > 0) ? metrics.topProducts.map((product: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-8 h-8 rounded-lg bg-[#2a2b36] border border-white/10 flex items-center justify-center font-bold text-[#e2e2e9] shrink-0 text-sm">
                      {i + 1}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-medium text-[#e2e2e9] truncate" title={product.name}>{product.name}</h4>
                      <span className="text-xs text-[#958ea0]">{product.sales} adet sipariş</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <div className="text-sm font-bold text-[#4edea3]">{product.amount}</div>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-[#958ea0] text-center mt-10">Henüz ürün verisi yok.</p>
              )}
            </div>
          </div>
        </div>
      </PremiumFeature>

      {/* My Stores Section */}
      <div className="bg-[#1a1b21]/40 backdrop-blur-md border border-white/5 rounded-xl overflow-hidden flex flex-col mb-8 p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-semibold text-[#e2e2e9]">Mağazalarım</h3>
            {isDemo && (
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/15 text-amber-400 border border-amber-500/20">
                <Lock className="w-3 h-3" />
                Demo
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-white/5 rounded-full text-xs text-[#958ea0] border border-white/10">
              Mevcut Plan: <strong className="text-emerald-400">{plan}</strong>
            </span>
            {!isDemo && (
              <span className="text-sm text-[#958ea0]">
                {currentStoreCount}
                {getLimit('maxStores') !== -1
                  ? ` / ${getLimit('maxStores')}`
                  : ''}{' '}
                Mağaza
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          {displayedStores.map((store) => (
            <div
              key={store.id}
              className={`w-64 h-32 border rounded-xl flex flex-col items-center justify-center gap-3 group shadow-sm transition-colors ${
                'isDemo' in store && store.isDemo
                  ? 'bg-amber-500/5 border-amber-500/15 cursor-default'
                  : 'bg-white/5 border-white/10 hover:bg-white/10 cursor-pointer'
              }`}
            >
              <Store className={`w-8 h-8 ${'isDemo' in store && store.isDemo ? 'text-amber-500/50' : 'text-white/80 group-hover:scale-110'} transition-transform`} />
              <span className={`font-medium text-sm ${'isDemo' in store && store.isDemo ? 'text-amber-500/70' : 'text-[#e2e2e9]'}`}>
                {store.name}
              </span>
              {'platform' in store && (
                <span className="text-[10px] text-zinc-500 bg-white/5 px-2 py-0.5 rounded-full">
                  {(store as any).platform}
                </span>
              )}
            </div>
          ))}

          {/* Mağaza Ekleme Butonu */}
          {!isLoading && (
            isDemo ? (
              /* Demo plan: kilitli kart */
              <button
                onClick={() => navigate('/plans')}
                className="w-64 h-32 bg-white/[0.02] border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center gap-2 p-4 text-center group hover:border-amber-500/30 hover:bg-amber-500/5 transition-all duration-200"
                title="Demo planda mağaza eklenemez. Plan seçin."
              >
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-amber-500/30 transition-colors">
                  <Lock className="w-5 h-5 text-zinc-500 group-hover:text-amber-500/60 transition-colors" />
                </div>
                <span className="text-zinc-500 text-sm font-medium group-hover:text-amber-500/70 transition-colors">Mağaza Ekle</span>
                <span className="text-zinc-600 text-xs">Demo planda kullanılamaz</span>
              </button>
            ) : isAtStoreLimit(currentStoreCount) ? (
              /* Limit doldu */
              <div className="w-64 h-32 bg-yellow-500/10 border border-dashed border-yellow-500/30 rounded-xl flex flex-col items-center justify-center gap-2 p-4 text-center cursor-not-allowed">
                <Store className="w-6 h-6 text-yellow-500/50 mb-1" />
                <span className="text-yellow-500/80 font-medium text-sm">Limit Doldu</span>
                <span className="text-[#958ea0] text-xs">
                  {plan === 'STARTER' ? 'Daha fazla mağaza için PRO pakete geçin.' : 'Maksimum mağaza limitine ulaştınız.'}
                </span>
              </div>
            ) : (
              /* Normal ekleme butonu */
              <button
                onClick={handleAddStore}
                className="w-64 h-32 bg-white/5 border border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center gap-3 hover:bg-white/10 hover:border-white/40 transition-colors cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <Plus className="w-5 h-5 text-white/80 group-hover:rotate-90 transition-transform duration-300" />
                </div>
                <span className="text-white/80 font-medium">Ekle</span>
              </button>
            )
          )}
        </div>
      </div>

      {/* Mağaza Bağlama Sihirbazı (yalnızca yetkili planlarda) */}
      {showWizard && !isDemo && (
        <StoreConnectionWizard
          onClose={() => setShowWizard(false)}
          onStoreAdded={() => {
            setShowWizard(false);
            loadStores(); // Mağaza listesini yenile
          }}
        />
      )}
    </div>
  );
}
