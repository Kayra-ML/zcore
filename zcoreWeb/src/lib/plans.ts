export type PlanType = 'FREE' | 'STARTER' | 'PRO';

export interface PlanFeatures {
  maxProducts: number;
  maxStores: number;
  reports: boolean;
  excelExport: boolean;
  pdfExport: boolean;
  prioritySupport: boolean;
  emailSupport: boolean;
  profitAnalysis: boolean;
  stockAlerts: boolean;
}

export const PLAN_LIMITS: Record<PlanType, PlanFeatures> = {
  FREE: {
    maxProducts: 0,
    maxStores: 0,
    reports: false,
    excelExport: false,
    pdfExport: false,
    prioritySupport: false,
    emailSupport: false,
    profitAnalysis: false,
    stockAlerts: false,
  },
  STARTER: {
    maxProducts: 50,
    maxStores: 2,
    reports: true,
    excelExport: false,
    pdfExport: false,
    prioritySupport: false,
    emailSupport: true,
    profitAnalysis: true,
    stockAlerts: true,
  },
  PRO: {
    maxProducts: 250,
    maxStores: 5,
    reports: true,
    excelExport: true,
    pdfExport: true,
    prioritySupport: true,
    emailSupport: true,
    profitAnalysis: true,
    stockAlerts: true,
  },
};

export const PLAN_NAMES: Record<PlanType, string> = {
  FREE: 'Demo',
  STARTER: 'Başlangıç',
  PRO: 'Profesyonel',
};

export const PLAN_PRICES: Record<PlanType, number> = {
  FREE: 0,
  STARTER: 299,
  PRO: 549,
};

export function hasFeature(plan: PlanType, feature: keyof PlanFeatures): boolean {
  return Boolean(PLAN_LIMITS[plan][feature]);
}

export function canAddStore(plan: PlanType, currentStoreCount: number): boolean {
  return currentStoreCount < PLAN_LIMITS[plan].maxStores;
}

export function canAddProduct(plan: PlanType, currentProductCount: number): boolean {
  return currentProductCount < PLAN_LIMITS[plan].maxProducts;
}

// Plan hiyerarşisi: FREE < STARTER < PRO
const PLAN_ORDER: PlanType[] = ['FREE', 'STARTER', 'PRO'];

export function isPlanAtLeast(userPlan: PlanType, requiredPlan: PlanType): boolean {
  return PLAN_ORDER.indexOf(userPlan) >= PLAN_ORDER.indexOf(requiredPlan);
}
