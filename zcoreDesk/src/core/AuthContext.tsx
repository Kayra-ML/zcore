import React, { createContext, useContext, useEffect, useState } from 'react';

export type PlanType = 'FREE' | 'STARTER' | 'PRO';

interface AuthUser {
  userId: string;
  email: string;
  name?: string;
  plan: PlanType;
}

interface AuthContextType {
  token: string | null;
  user: AuthUser | null;
  plan: PlanType;
  logout: () => void;
  loginWithWeb: () => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  plan: 'FREE',
  logout: () => {},
  loginWithWeb: () => {},
});

export const useAuth = () => useContext(AuthContext);
export const usePlan = () => useContext(AuthContext).plan;

function parseJwt(token: string): AuthUser | null {
  try {
    const base64Payload = token.split('.')[1];
    // UTF-8 karakterleri (Türkçe harfler vb.) doğru decode etmek için:
    const payloadStr = decodeURIComponent(
      atob(base64Payload)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(payloadStr);
    return {
      userId: payload.userId,
      email: payload.email,
      name: payload.name,
      plan: (payload.plan as PlanType) || 'FREE',
    };
  } catch {
    return null;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('zcore-auth-token'));
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem('zcore-auth-token');
    return stored ? parseJwt(stored) : null;
  });

  const plan: PlanType = user?.plan || 'FREE';

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.onAuthToken((newToken: string) => {
        const parsed = parseJwt(newToken);
        setToken(newToken);
        setUser(parsed);
        localStorage.setItem('zcore-auth-token', newToken);
      });
    }
  }, []);

  const logout = () => {
    const webUrl = import.meta.env.VITE_WEB_URL || 'https://zeraxcore.com';
    // Web oturumunu da otomatik kapatan yeni sayfayı çağır
    if (window.electronAPI) {
      window.electronAPI.openExternal(`${webUrl}/desktop-signout`);
    }
    // Yerel token'ı temizle
    setToken(null);
    setUser(null);
    localStorage.removeItem('zcore-auth-token');
  };

  const loginWithWeb = () => {
    const webUrl = import.meta.env.VITE_WEB_URL || 'https://zeraxcore.com';
    // Direkt /desktop-auth sayfasına git
    // Eğer giriş yapılmamışsa, o sayfa zaten login'e yönlendirir
    // Eğer giriş yapılmışsa, direkt yetkilendirme ekranı gösterilir (stores'a gitmez)
    if (window.electronAPI) {
      window.electronAPI.openExternal(`${webUrl}/desktop-auth`);
    } else {
      window.open(`${webUrl}/desktop-auth`, '_blank');
    }
  };

  return (
    <AuthContext.Provider value={{ token, user, plan, logout, loginWithWeb }}>
      {children}
    </AuthContext.Provider>
  );
};
