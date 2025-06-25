import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';
import { isAuthenticated, logout as apiLogout } from '../api';

interface AuthContextType {
  isLoggedin: boolean;
  login: () => void;
  logout: () => Promise<void>;
  updateAuthState: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedin, setLoggedin] = useState<boolean>(false);

  const updateAuthState = useCallback(() => {
    setLoggedin(isAuthenticated());
  }, []);

  const login = useCallback(() => {
    updateAuthState();
  }, [updateAuthState]);

  const logout = useCallback(async () => {
    await apiLogout();
    updateAuthState();
  }, [updateAuthState]);

  useEffect(() => {
    updateAuthState();
  }, [updateAuthState]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'accessToken') {
        updateAuthState();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [updateAuthState]);

  const value = useMemo(() => ({
    isLoggedin,
    login,
    logout,
    updateAuthState,
  }), [isLoggedin, login, logout, updateAuthState]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth는 AuthProvider 내부에서 사용되어야 합니다.');
  }
  return context;
} 