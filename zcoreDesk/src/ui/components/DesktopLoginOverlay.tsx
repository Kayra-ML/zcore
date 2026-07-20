import React from 'react';
import { useAuth } from '../../core/AuthContext';
import zcoreLogo from '../../assets/zcore-logo.png';

const DesktopLoginOverlay: React.FC = () => {
  const { token, loginWithWeb } = useAuth();

  if (token) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-white/3 blur-[120px]" />
      </div>

      <div className="w-full max-w-sm relative z-10 text-center px-6">
        {/* ZCore Marka Logosu */}
        <div className="mx-auto mb-8 flex items-center justify-center">
          <img
            src={zcoreLogo}
            alt="ZCore"
            className="w-72 h-auto object-contain"
          />
        </div>

        {/* Alt yazı */}
        <p className="text-zinc-400 text-sm mb-10 leading-relaxed">
          Masaüstü uygulamasını kullanabilmek için<br />
          ZCore web hesabınızla giriş yapın.
        </p>

        {/* Giriş Butonu */}
        <button
          onClick={loginWithWeb}
          className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 active:scale-[0.98]"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Tarayıcıda Oturum Aç
        </button>

        <p className="text-xs text-zinc-600 mt-6">
          ZCore hesabınız yoksa tarayıcı üzerinden kayıt olabilirsiniz.
        </p>
      </div>
    </div>
  );
};

export default DesktopLoginOverlay;
