import { useAuth } from '../AuthContext';

// PLAN_LIMITS — her plan için mağaza sınırları ve özellik bayrakları
// FREE  (Demo)    : Mağaza eklenemez, yalnızca örnek veriler görüntülenir
// STARTER         : En fazla 3 mağaza
// PRO             : Sınırsız mağaza
const PLAN_LIMITS = {
  FREE: {
    maxStores: 0,               // Demo plan: mağaza eklenemez
    hasAdvancedAnalytics: false,
    hasPrioritySupport: false,
    isDemoOnly: true,           // Sadece mockData göster
  },
  STARTER: {
    maxStores: 3,               // Başlangıç: en fazla 3 mağaza
    hasAdvancedAnalytics: false,
    hasPrioritySupport: false,
    isDemoOnly: false,
  },
  PRO: {
    maxStores: -1,              // Profesyonel: sınırsız (-1 = limitsiz)
    hasAdvancedAnalytics: true,
    hasPrioritySupport: true,
    isDemoOnly: false,
  },
} as const;

type LimitKey = keyof typeof PLAN_LIMITS['FREE'];

export function useSubscription() {
  const { plan } = useAuth();

  // Token'dan senkron geldiği için loading gerekmez
  const isLoading = false;
  const error = null;

  const limits = PLAN_LIMITS[plan] ?? PLAN_LIMITS['FREE'];

  /** Belirtilen boolean özelliğin bu planda aktif olup olmadığını döner */
  const hasPermission = (feature: LimitKey): boolean => {
    const val = (limits as Record<LimitKey, unknown>)[feature];
    return typeof val === 'boolean' ? val : false;
  };

  /** Sayısal limiti döner; -1 sınırsız anlamına gelir */
  const getLimit = (limitName: LimitKey): number => {
    const val = (limits as Record<LimitKey, unknown>)[limitName];
    return typeof val === 'number' ? val : 0;
  };

  /** Demo planında mağaza eklenemez, sadece örnek veriler gösterilir */
  const isDemoOnly = (): boolean => limits.isDemoOnly;

  /** Mevcut mağaza sayısının limite ulaşıp ulaşmadığını kontrol eder */
  const isAtStoreLimit = (currentCount: number): boolean => {
    const max = getLimit('maxStores');
    if (max === -1) return false; // sınırsız
    return currentCount >= max;
  };

  return {
    plan,
    isLoading,
    error,
    hasPermission,
    getLimit,
    isDemoOnly,
    isAtStoreLimit,
  };
}
