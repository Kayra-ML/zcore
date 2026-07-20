import { useState, useEffect } from 'react';
import { Search, Package, AlertCircle, Store, Plus, Lock } from 'lucide-react';
import { useSubscription } from '../../core/auth/useSubscription';
import { DEMO_PRODUCTS } from '../../core/demo/mockData';



const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Elektronik':
    case 'Donanım':
      return '💻';
    case 'Giyim':
      return '👕';
    case 'Aksesuar':
    case 'Çanta':
      return '🎒';
    case 'Ayakkabı':
      return '👟';
    case 'Kozmetik':
      return '💄';
    default:
      return '📦';
  }
};

export default function Products() {
  const { isDemoOnly } = useSubscription();
  const isDemo = isDemoOnly();

  // Demo planda sabit mock veriler, diğer planlarda gerçek veriler (şimdilik boş)
  const allProducts = isDemo ? DEMO_PRODUCTS : [];

  const [searchTerm, setSearchTerm] = useState('');
  const [activeStore, setActiveStore] = useState('Trendyol');
  
  // Tracked products state — demo modda sabit, gerçek modda dinamik
  const MAX_LIMIT_PER_STORE = 3;
  const [trackedProducts, setTrackedProducts] = useState<Set<string>>(new Set(isDemo ? ['PRD-001', 'PRD-004'] : []));
  const [showLimitAlert, setShowLimitAlert] = useState(false);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<{ message: string, percentage: number, isComplete: boolean } | null>(null);

  useEffect(() => {
    if (window.electronAPI?.onAuthToken) {
      window.electronAPI.onAuthToken((token) => {
        setAuthSuccess(token);
        setTimeout(() => setAuthSuccess(null), 5000);
      });
    }
    
    if (window.electronAPI?.onSyncProgress) {
      window.electronAPI.onSyncProgress((data) => {
        setSyncStatus(data);
        if (data.isComplete) {
          setTimeout(() => setSyncStatus(null), 5000);
        }
      });
    }
  }, []);

  const handleAddStore = () => {
    if (window.electronAPI?.openExternal) {
      // Simulate opening web login page
      window.electronAPI.openExternal('https://zcore.app/login?source=desktop');
    } else {
      alert('Masaüstü uygulaması modunda değilsiniz.');
    }
  };

  const handleToggleTrack = (id: string, store: string) => {
    if (isDemo) return; // Demo modda toggle devre dışı
    setTrackedProducts(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        setShowLimitAlert(false);
      } else {
        const storeTrackedCount = allProducts.filter(p => p.store === store && next.has(p.id)).length;
        if (storeTrackedCount >= MAX_LIMIT_PER_STORE) {
          setShowLimitAlert(true);
          setTimeout(() => setShowLimitAlert(false), 3000);
          return prev;
        }
        next.add(id);
      }
      return next;
    });
  };

  const filteredProducts = allProducts.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStore = p.store === activeStore;
    return matchesSearch && matchesStore;
  });

  const trackedInActiveStore = allProducts.filter(p => p.store === activeStore && trackedProducts.has(p.id)).length;
  const progressPercentage = (trackedInActiveStore / MAX_LIMIT_PER_STORE) * 100;

  return (
    <div className="flex flex-col h-full space-y-6">

      {/* Demo Uyarı Bandı */}
      {isDemo && (
        <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400">
          <Lock className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">
            <span className="font-semibold">Demo Modu</span> — Gösterilen ürünler örnek içeriktir. Gerçek ürünlerinizi görmek için
            bir plan seçin ve mağazanızı bağlayın.
          </p>
        </div>
      )}

      {/* Header Area */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-light text-[#e2e2e9] tracking-tight">Ürün Yönetimi</h1>
          <p className="text-sm text-[#958ea0] mt-1">
            {isDemo
              ? 'Örnek ürünler gösteriliyor. Gerçek veriler için mağaza bağlayın.'
              : 'Önce mağazayı seçin, ardından o mağazadan sisteme dahil edilecek ürünleri belirleyin.'}
          </p>
        </div>
        
        {/* Store Quota Card */}
        <div className="flex flex-col items-end gap-3">
          <button 
            onClick={handleAddStore}
            className="bg-gradient-to-r from-[#a078ff] to-[#8a5eff] hover:from-[#8a5eff] hover:to-[#7445ff] text-white px-5 py-2 rounded-xl text-sm font-medium transition-all shadow-[0_0_20px_rgba(160,120,255,0.3)] hover:shadow-[0_0_25px_rgba(160,120,255,0.5)] flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Yeni Mağaza Bağla
          </button>
          
          <div className="bg-[#1a1b21]/40 backdrop-blur-md border border-white/5 rounded-xl p-3 min-w-[280px] shadow-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-[#a078ff] uppercase tracking-wider bg-[#a078ff]/10 px-2 py-0.5 rounded">{activeStore} Limiti</span>
              <span className="text-sm text-[#e2e2e9] font-medium">{trackedInActiveStore} / {MAX_LIMIT_PER_STORE} Ürün</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-2 mb-1 overflow-hidden">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${trackedInActiveStore >= MAX_LIMIT_PER_STORE ? 'bg-[#ffb4ab]' : 'bg-gradient-to-r from-[#a078ff] to-[#4edea3]'}`} 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-[#958ea0]">Bu mağaza için analize dahil edilebilir ürün kotanız.</p>
          </div>
        </div>
      </div>

      {/* Auth Success Banner */}
      {authSuccess && (
        <div className="bg-[#4edea3]/10 border border-[#4edea3]/20 text-[#4edea3] px-4 py-3 rounded-lg flex items-center gap-3 animate-in slide-in-from-top-2">
          <Store className="w-5 h-5 shrink-0" />
          <p className="text-sm"><strong>Mağaza Başarıyla Bağlandı!</strong> Web sitesi üzerinden gelen yetki kodu: {authSuccess.substring(0,8)}...</p>
        </div>
      )}

      {/* Sync Progress Banner */}
      {syncStatus && (
        <div className="bg-[#1a1b21]/60 border border-[#a078ff]/30 p-4 rounded-xl shadow-lg flex flex-col gap-3 animate-in slide-in-from-top-4 relative overflow-hidden">
          <div className="flex justify-between items-center z-10">
            <div className="flex items-center gap-3">
              {syncStatus.isComplete ? (
                 <div className="w-8 h-8 rounded-full bg-[#4edea3]/20 flex items-center justify-center text-[#4edea3]">
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                 </div>
              ) : (
                <div className="w-8 h-8 rounded-full border-2 border-[#a078ff] border-t-transparent animate-spin"></div>
              )}
              <div>
                <h3 className="text-sm font-semibold text-white">
                  {syncStatus.isComplete ? 'Senkronizasyon Tamamlandı' : 'Veriler Senkronize Ediliyor'}
                </h3>
                <p className="text-xs text-[#a078ff] mt-0.5">{syncStatus.message}</p>
              </div>
            </div>
            <span className="text-xl font-bold text-white/90">%{syncStatus.percentage}</span>
          </div>
          
          <div className="w-full bg-black/40 rounded-full h-2 z-10 overflow-hidden border border-white/5">
            <div 
              className={`h-full rounded-full transition-all duration-500 ease-out ${syncStatus.isComplete ? 'bg-[#4edea3]' : 'bg-gradient-to-r from-[#a078ff] to-[#8a5eff]'}`}
              style={{ width: `${syncStatus.percentage}%` }}
            ></div>
          </div>
          
          {/* Background glow */}
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#a078ff]/10 to-transparent transition-all duration-500"
            style={{ width: `${syncStatus.percentage}%` }}
          ></div>
        </div>
      )}

      {/* Limit Alert Banner */}
      {showLimitAlert && (
        <div className="bg-[#ffb4ab]/10 border border-[#ffb4ab]/20 text-[#ffb4ab] px-4 py-3 rounded-lg flex items-center gap-3 animate-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm"><strong>{activeStore} Limiti Doldu!</strong> Mevcut paketinizde bu mağaza için en fazla {MAX_LIMIT_PER_STORE} ürünü takip edebilirsiniz.</p>
        </div>
      )}

      {/* Tabs and Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#1a1b21]/40 backdrop-blur-md border border-white/5 rounded-xl p-4">
        
        <div className="flex gap-2">
          {['Trendyol', 'Hepsiburada', 'Amazon', 'N11'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveStore(tab)}
              className={`px-4 py-1.5 rounded-lg text-sm transition-colors ${
                activeStore === tab 
                  ? 'bg-white/10 text-white border border-white/10' 
                  : 'text-[#958ea0] hover:text-[#e2e2e9] hover:bg-white/5 border border-transparent'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#958ea0] w-4 h-4" />
            <input
              type="text"
              placeholder="Ürün ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-lg py-1.5 pl-9 pr-4 text-sm text-[#e2e2e9] focus:outline-none focus:border-[#a078ff]/50 transition-colors placeholder:text-[#958ea0]"
            />
          </div>
        </div>
      </div>

      {/* Product Table Container */}
      <div className="flex-1 bg-[#1a1b21]/40 backdrop-blur-md border border-white/5 rounded-2xl flex flex-col overflow-hidden shadow-xl min-h-[400px]">
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-[#1a1b21]/90 backdrop-blur-xl border-b border-white/5 z-10">
              <tr>
                <th className="py-4 px-6 text-xs font-semibold text-[#958ea0] uppercase tracking-wider w-16">Ürün</th>
                <th className="py-4 px-2 text-xs font-semibold text-[#958ea0] uppercase tracking-wider">İsim / Kategori</th>
                <th className="py-4 px-6 text-xs font-semibold text-[#958ea0] uppercase tracking-wider">Pazar Yeri</th>
                <th className="py-4 px-6 text-xs font-semibold text-[#958ea0] uppercase tracking-wider">Fiyat</th>
                <th className="py-4 px-6 text-xs font-semibold text-[#958ea0] uppercase tracking-wider">Stok</th>
                <th className="py-4 px-6 text-xs font-semibold text-[#958ea0] uppercase tracking-wider text-right">Analiz & Bildirim</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProducts.map((product) => {
                const isTracked = trackedProducts.has(product.id);
                return (
                  <tr key={product.id} className={`transition-colors group ${isTracked ? 'bg-[#a078ff]/5 hover:bg-[#a078ff]/10' : 'hover:bg-white/[0.02]'}`}>
                    <td className="py-4 px-6">
                      <div className="w-10 h-10 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center text-xl shadow-inner">
                        {getCategoryIcon(product.category)}
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-[#e2e2e9]">{product.name}</span>
                        <span className="text-xs text-[#958ea0]">{product.category}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Store className="w-3.5 h-3.5 text-[#958ea0]" />
                        <span className="text-sm text-[#cbc3d7]">{product.store}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm font-medium text-[#e2e2e9]">{product.price}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                        product.stock < 20 
                          ? 'bg-[#ffb4ab]/10 text-[#ffb4ab] border-[#ffb4ab]/20' 
                          : 'bg-white/5 text-[#cbc3d7] border-white/10'
                      }`}>
                        {product.stock} adet
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {/* Custom Toggle Switch */}
                      <button 
                        onClick={() => handleToggleTrack(product.id, product.store)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#a078ff]/50 focus:ring-offset-2 focus:ring-offset-[#1a1b21] ${
                          isTracked ? 'bg-[#4edea3]' : 'bg-white/10'
                        }`}
                      >
                        <span className="sr-only">Takip Et</span>
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            isTracked ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-[#958ea0]">
              <Package className="w-12 h-12 mb-4 opacity-50" />
              <p>Aradığınız kriterlere uygun ürün bulunamadı.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
