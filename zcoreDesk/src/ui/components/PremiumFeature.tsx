import React from 'react';
import { Lock } from 'lucide-react';

interface PremiumFeatureProps {
  children: React.ReactNode;
  isLocked: boolean;
  message?: string;
  onUpgradeClick?: () => void;
}

export default function PremiumFeature({ 
  children, 
  isLocked, 
  message = "Bu özellik PRO pakete özeldir.",
  onUpgradeClick
}: PremiumFeatureProps) {
  
  if (!isLocked) {
    return <>{children}</>;
  }

  return (
    <div className="relative group overflow-hidden rounded-xl">
      {/* Orijinal içeriği blur'lu şekilde gösteriyoruz */}
      <div className="filter blur-[3px] opacity-40 pointer-events-none transition-all duration-300">
        {children}
      </div>
      
      {/* Üzerine binen Kilit Ekranı */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#111111]/60 backdrop-blur-sm p-4 text-center">
        <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center mb-3">
          <Lock className="w-6 h-6 text-yellow-500" />
        </div>
        <p className="text-white font-medium mb-4">{message}</p>
        
        <button 
          onClick={onUpgradeClick || (() => {
            const webUrl = import.meta.env.VITE_WEB_URL || 'https://zeraxcore.com';
            if (window.electronAPI && window.electronAPI.openExternal) {
              window.electronAPI.openExternal(`${webUrl}/#mevcut-planlar`);
            } else {
              window.open(`${webUrl}/#mevcut-planlar`, '_blank');
            }
          })}
          className="px-5 py-2.5 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-bold rounded-lg shadow-lg shadow-yellow-500/20 transition-all hover:scale-105 active:scale-95"
        >
          Paketi Yükselt
        </button>
      </div>
    </div>
  );
}
