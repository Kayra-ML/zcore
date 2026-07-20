import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, Settings, TrendingUp } from 'lucide-react';

export default function Sidebar() {
  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center gap-1 w-full relative group hover:bg-white/5 transition-all duration-300 active:scale-95 py-2 ${
      isActive ? 'bg-white/5' : ''
    }`;

  const getIconClass = ({ isActive }: { isActive: boolean }) =>
    `w-6 h-6 transition-colors ${isActive ? 'text-white/90' : 'text-white/60 group-hover:text-white/90'}`;

  return (
    <nav className="hidden md:flex bg-[#1a1b21]/30 backdrop-blur-xl fixed left-0 top-24 h-[calc(100%-6rem)] w-20 shadow-none flex-col items-center pt-2 pb-8 gap-8 z-40 border-r border-white/5">
      {/* Navigation Links */}
      <div className="flex flex-col gap-8 w-full items-center flex-1">
        <NavLink to="/" className={getNavClass}>
          {({ isActive }) => (
            <>
              <LayoutDashboard className={getIconClass({ isActive })} />
              <span className={`text-[10px] absolute -bottom-4 whitespace-nowrap transition-colors ${isActive ? 'text-white/90' : 'text-white/60 group-hover:text-white/90'}`}>Dashboard</span>
            </>
          )}
        </NavLink>
        
        <NavLink to="/analysis" className={getNavClass}>
          {({ isActive }) => (
            <>
              <TrendingUp className={getIconClass({ isActive })} />
              <span className={`text-[10px] absolute -bottom-4 whitespace-nowrap transition-colors ${isActive ? 'text-white/90' : 'text-white/60 group-hover:text-white/90'}`}>Analiz</span>
            </>
          )}
        </NavLink>
        
        <NavLink to="/orders" className={getNavClass}>
          {({ isActive }) => (
            <>
              <ShoppingCart className={getIconClass({ isActive })} />
              <span className={`text-[10px] absolute -bottom-4 whitespace-nowrap transition-colors ${isActive ? 'text-white/90' : 'text-white/60 group-hover:text-white/90'}`}>Siparişler</span>
            </>
          )}
        </NavLink>
        
        <NavLink to="/products" className={getNavClass}>
          {({ isActive }) => (
            <>
              <Package className={getIconClass({ isActive })} />
              <span className={`text-[10px] absolute -bottom-4 whitespace-nowrap transition-colors ${isActive ? 'text-white/90' : 'text-white/60 group-hover:text-white/90'}`}>Ürünler</span>
            </>
          )}
        </NavLink>
        
      </div>

      {/* Bottom Settings */}
      <NavLink to="/settings" className="flex flex-col items-center w-full group hover:bg-white/5 transition-all duration-300 active:scale-95 py-2 mt-auto">
        {({ isActive }) => (
          <Settings className={getIconClass({ isActive })} />
        )}
      </NavLink>
    </nav>
  );
}
