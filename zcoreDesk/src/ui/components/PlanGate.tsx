import React, { useState } from 'react';
import { usePlan, PlanType } from '../../core/AuthContext';

const PLAN_ORDER: PlanType[] = ['FREE', 'STARTER', 'PRO'];

const PLAN_DISPLAY: Record<PlanType, { name: string; price: string; color: string }> = {
  FREE: { name: 'Demo', price: 'Ücretsiz', color: '#6b7280' },
  STARTER: { name: 'Başlangıç', price: '₺299/ay', color: '#3b82f6' },
  PRO: { name: 'Profesyonel', price: '₺549/ay', color: '#10b981' },
};

interface PlanGateProps {
  requiredPlan: PlanType;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

function UpgradeModal({
  requiredPlan,
  onClose,
}: {
  requiredPlan: PlanType;
  onClose: () => void;
}) {
  const info = PLAN_DISPLAY[requiredPlan];

  const handleUpgrade = () => {
    const webUrl = import.meta.env.VITE_WEB_URL || 'https://zeraxcore.com';
    if (window.electronAPI && window.electronAPI.openExternal) {
      window.electronAPI.openExternal(`${webUrl}/#mevcut-planlar`);
    } else {
      window.open(`${webUrl}/#mevcut-planlar`, '_blank');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-sm mx-4 bg-[#111111] border border-white/10 rounded-2xl p-6 shadow-2xl">
        {/* Icon */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 mx-auto"
          style={{ backgroundColor: `${info.color}20`, border: `1px solid ${info.color}40` }}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke={info.color}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>

        <h2 className="text-white font-bold text-lg text-center mb-1">
          Plan Yükseltmesi Gerekli
        </h2>
        <p className="text-zinc-400 text-sm text-center mb-5">
          Bu özellik{' '}
          <span className="font-semibold" style={{ color: info.color }}>
            {info.name}
          </span>{' '}
          planında ({info.price}) kullanılabilir.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg border border-white/10 text-zinc-400 text-sm hover:bg-white/5 transition-colors"
          >
            İptal
          </button>
          <button
            onClick={handleUpgrade}
            className="flex-1 py-2.5 rounded-lg text-white text-sm font-medium transition-colors"
            style={{ backgroundColor: info.color }}
          >
            Planı Yükselt
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Kullanıcının planı yeterliyse children'ı render eder.
 * Yetersizse tıklandığında upgrade modal'ı gösterir.
 *
 * Kullanım:
 * <PlanGate requiredPlan="STARTER">
 *   <MağazaEklemeButonu />
 * </PlanGate>
 */
export const PlanGate: React.FC<PlanGateProps> = ({ requiredPlan, children, fallback }) => {
  const userPlan = usePlan();
  const [showModal, setShowModal] = useState(false);

  const hasAccess =
    PLAN_ORDER.indexOf(userPlan) >= PLAN_ORDER.indexOf(requiredPlan);

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  // Default: children'ı render et ama tıklanınca modal göster
  return (
    <>
      <div
        className="relative cursor-pointer"
        onClick={() => setShowModal(true)}
        title={`Bu özellik ${PLAN_DISPLAY[requiredPlan].name} planında mevcut`}
      >
        {/* Kilitli görünüm */}
        <div className="pointer-events-none opacity-40 select-none">
          {children}
        </div>
        {/* Kilit ikonu overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black/60 backdrop-blur-sm rounded-lg p-1.5">
            <svg className="w-4 h-4 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
        </div>
      </div>

      {showModal && (
        <UpgradeModal
          requiredPlan={requiredPlan}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default PlanGate;
