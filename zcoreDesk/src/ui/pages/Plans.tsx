import { Check, Zap, Star, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePlan } from '../../core/AuthContext';

const PLANS = [
  {
    id: 'FREE' as const,
    name: 'Demo',
    subtitle: 'Deneme & Keşif',
    price: '₺0',
    period: '/ay',
    color: '#6b7280',
    gradientFrom: 'from-zinc-600/20',
    gradientTo: 'to-zinc-800/10',
    borderColor: 'border-zinc-700/50',
    icon: Star,
    iconBg: 'bg-zinc-700/30',
    features: [
      '1 Mağaza bağlantısı',
      'Temel sipariş görünümü',
      'Temel ürün yönetimi',
      'Topluluk desteği',
    ],
    disabledFeatures: [
      'Gelişmiş analitik',
      'Çoklu mağaza',
      'Öncelikli destek',
      'API erişimi',
    ],
    cta: 'Mevcut Plan',
    ctaClass: 'bg-zinc-700/50 text-zinc-400 cursor-default border border-zinc-600/50',
  },
  {
    id: 'STARTER' as const,
    name: 'Başlangıç',
    subtitle: 'Büyüyen işletmeler için',
    price: '₺299',
    period: '/ay',
    color: '#3b82f6',
    gradientFrom: 'from-blue-600/20',
    gradientTo: 'to-blue-900/10',
    borderColor: 'border-blue-500/30',
    icon: Zap,
    iconBg: 'bg-blue-500/20',
    features: [
      '3 Mağaza bağlantısı',
      'Gelişmiş sipariş yönetimi',
      'Stok takibi',
      'E-posta desteği',
    ],
    disabledFeatures: [
      'Sınırsız mağaza',
      'Gelişmiş analitik',
      'API erişimi',
    ],
    cta: 'Başlangıca Yükselt',
    ctaClass: 'bg-blue-600 hover:bg-blue-500 text-white border border-blue-500/50',
    popular: false,
  },
  {
    id: 'PRO' as const,
    name: 'Profesyonel',
    subtitle: 'Profesyoneller için tam güç',
    price: '₺549',
    period: '/ay',
    color: '#10b981',
    gradientFrom: 'from-emerald-600/20',
    gradientTo: 'to-emerald-900/10',
    borderColor: 'border-emerald-500/30',
    icon: Crown,
    iconBg: 'bg-emerald-500/20',
    features: [
      'Sınırsız mağaza bağlantısı',
      'Gelişmiş analitik & raporlar',
      'Öncelikli 7/24 destek',
      'Tam API erişimi',
      'Özel entegrasyonlar',
      'Takım üyeleri ekle',
    ],
    disabledFeatures: [],
    cta: "Pro'ya Yükselt",
    ctaClass: 'bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500/50',
    popular: true,
  },
];

export default function Plans() {
  const navigate = useNavigate();
  const currentPlan = usePlan();

  const handleUpgrade = (_planId: 'STARTER' | 'PRO') => {
    const webUrl = import.meta.env.VITE_WEB_URL || 'https://zeraxcore.com';
    if (window.electronAPI && window.electronAPI.openExternal) {
      window.electronAPI.openExternal(`${webUrl}/pricing`);
    } else {
      window.open(`${webUrl}/pricing`, '_blank');
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-8 relative z-10 pb-12">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-medium mb-4">
          <Crown className="w-3.5 h-3.5" />
          Mevcut Planlar
        </div>
        <h2 className="text-3xl font-bold text-[#e2e2e9] mb-3">
          İşletmeniz için doğru planı seçin
        </h2>
        <p className="text-[#958ea0] text-base max-w-xl mx-auto">
          İhtiyaçlarınıza göre esnek fiyatlandırma. İstediğiniz zaman yükseltebilir veya düşürebilirsiniz.
        </p>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {PLANS.map((plan) => {
          const isCurrentPlan = currentPlan === plan.id;
          const Icon = plan.icon;

          return (
            <div
              key={plan.id}
              className={`relative bg-[#1a1b21]/60 backdrop-blur-md border rounded-2xl p-6 flex flex-col gap-5 transition-all duration-300 ${plan.borderColor} ${
                isCurrentPlan ? 'shadow-lg' : 'hover:translate-y-[-2px]'
              } ${plan.popular && !isCurrentPlan ? 'shadow-lg shadow-emerald-500/10' : ''}`}
              style={isCurrentPlan ? { boxShadow: `0 0 0 1px ${plan.color}60, 0 8px 32px ${plan.color}15` } : {}}
            >
              {/* Popular Badge */}
              {plan.popular && !isCurrentPlan && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white shadow-lg"
                  style={{ backgroundColor: plan.color }}
                >
                  ⭐ En Popüler
                </div>
              )}

              {/* Current Plan Badge */}
              {isCurrentPlan && (
                <div
                  className="absolute -top-3 right-4 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg"
                  style={{ backgroundColor: plan.color }}
                >
                  ✓ Mevcut Plan
                </div>
              )}

              {/* Background Gradient */}
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${plan.gradientFrom} ${plan.gradientTo} opacity-40 pointer-events-none`}
              />

              {/* Icon & Name */}
              <div className="relative flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${plan.iconBg} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" style={{ color: plan.color }} />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-base leading-tight">{plan.name}</h3>
                  <p className="text-[#958ea0] text-xs">{plan.subtitle}</p>
                </div>
              </div>

              {/* Price */}
              <div className="relative">
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold text-[#e2e2e9] leading-none">{plan.price}</span>
                  <span className="text-[#958ea0] text-sm mb-1">{plan.period}</span>
                </div>
              </div>

              {/* Divider */}
              <div className="relative border-t border-white/[0.06]" />

              {/* Features */}
              <div className="relative flex flex-col gap-2.5 flex-1">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2.5">
                    <div
                      className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${plan.color}20` }}
                    >
                      <Check className="w-2.5 h-2.5" style={{ color: plan.color }} />
                    </div>
                    <span className="text-[#cbc3d7] text-sm">{feature}</span>
                  </div>
                ))}
                {plan.disabledFeatures.map((feature) => (
                  <div key={feature} className="flex items-center gap-2.5 opacity-30">
                    <div className="w-4 h-4 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-px bg-zinc-500" />
                    </div>
                    <span className="text-zinc-500 text-sm line-through">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <button
                onClick={() => {
                  if (!isCurrentPlan && plan.id !== 'FREE') {
                    handleUpgrade(plan.id);
                  }
                }}
                disabled={isCurrentPlan || plan.id === 'FREE'}
                className={`relative w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95 ${plan.ctaClass}`}
              >
                {isCurrentPlan ? '✓ Mevcut Plan' : plan.cta}
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer Note */}
      <div className="text-center">
        <p className="text-[#494454] text-sm">
          Plan yükseltmeleri web sitemiz üzerinden işlenir.{' '}
          <button
            onClick={() => navigate('/')}
            className="text-[#958ea0] hover:text-[#e2e2e9] transition-colors underline underline-offset-2"
          >
            Ana sayfaya dön
          </button>
        </p>
      </div>
    </div>
  );
}
