import { useState, useEffect, useRef } from 'react';
import { Bell, LogOut, ChevronDown, Crown } from 'lucide-react';
import logoImg from '../../assets/logo.png';
import { useAuth, usePlan } from '../../core/AuthContext';

const PLAN_STYLES = {
  FREE:    { label: 'Demo',          className: 'text-zinc-400 bg-zinc-800 border-zinc-700' },
  STARTER: { label: 'Başlangıç',     className: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
  PRO:     { label: 'Profesyonel',   className: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
};

export default function TopNavBar() {
  const { user, logout } = useAuth();
  const plan = usePlan();

  const openPricing = () => {
    const webUrl = import.meta.env.VITE_WEB_URL || 'https://zeraxcore.com';
    if (window.electronAPI && window.electronAPI.openExternal) {
      window.electronAPI.openExternal(`${webUrl}/#mevcut-planlar`);
    } else {
      window.open(`${webUrl}/#mevcut-planlar`, '_blank');
    }
  };

  const [time, setTime] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }));
      setDateStr(now.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Dropdown dışına tıklandığında kapat
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const planStyle = PLAN_STYLES[plan] || PLAN_STYLES.FREE;

  // Kullanıcının baş harflerini al (avatar için)
  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? '?';

  return (
    <header className="bg-[#0A0B0E] fixed top-8 left-0 w-full h-16 border-b border-white/5 shadow-sm flex justify-between items-center pl-0 pr-4 z-40 app-region-drag">
      {/* Logo */}
      <div className="w-20 h-full flex justify-center items-center app-region-no-drag">
        <img src={logoImg} alt="ZCore Logo" className="w-16 h-16 object-contain scale-[1.8] ml-10 rounded-xl" />
      </div>

      {/* Orta — Saat & Tarih */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-4">
        <div className="hidden md:flex items-center gap-5 bg-white/5 border border-white/5 px-8 py-1 rounded-full backdrop-blur-md">
          <span className="text-sm font-light text-white/90">{time}</span>
          <div className="w-px h-4 bg-white/10" />
          <h1 className="text-sm font-light text-[#e2e2e9]">{dateStr}</h1>
        </div>
        <div className="md:hidden flex items-center gap-3 bg-white/5 border border-white/5 px-6 py-1 rounded-full backdrop-blur-md">
          <span className="text-xs font-light text-white/90">{time}</span>
          <div className="w-px h-3 bg-white/10" />
          <h1 className="text-xs font-light text-[#e2e2e9]">{dateStr}</h1>
        </div>
      </div>

      {/* Sağ — Bildirim + Profil */}
      <div className="flex items-center gap-2 app-region-no-drag">
        {/* Bildirim Butonu */}
        <button className="p-2 text-[#cbc3d7] hover:bg-white/10 rounded-full transition-all duration-200">
          <Bell className="w-5 h-5" />
        </button>

        {/* Profil Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setProfileOpen(prev => !prev)}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-white/5 transition-all duration-200"
          >
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs font-bold select-none">
              {initials}
            </div>

            {/* İsim + Plan (masaüstünde göster) */}
            <div className="hidden md:block text-left">
              <p className="text-xs font-medium text-white leading-tight">
                {user?.name || user?.email?.split('@')[0] || 'Kullanıcı'}
              </p>
              <span
                onClick={(e) => { e.stopPropagation(); openPricing(); }}
                className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border cursor-pointer hover:opacity-80 transition-opacity ${planStyle.className}`}
              >
                {planStyle.label}
              </span>
            </div>

            <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menü */}
          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-[#111111] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
              {/* Kullanıcı Bilgisi */}
              <div className="px-4 py-3 border-b border-white/[0.06]">
                <p className="text-sm font-medium text-white truncate">
                  {user?.name || 'Kullanıcı'}
                </p>
                <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
                <span className={`inline-block mt-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full border ${planStyle.className}`}>
                  {planStyle.label} Plan
                </span>
              </div>

              {/* Planlarım */}
              <button
                onClick={() => {
                  setProfileOpen(false);
                  openPricing();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-zinc-300 hover:bg-white/5 transition-colors border-b border-white/[0.06]"
              >
                <Crown className="w-4 h-4 text-emerald-400" />
                Planlar & Fiyatlar
              </button>

              {/* Çıkış Yap */}
              <button
                onClick={() => {
                  setProfileOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Hesaptan Çıkış Yap
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
