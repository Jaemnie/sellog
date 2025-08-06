import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';
import { isAuthenticated, logout as apiLogout, refreshTokenOnActivity } from '../api';

interface AuthContextType {
  isLoggedin: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => Promise<void>;
  updateAuthState: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedin, setLoggedin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const updateAuthState = useCallback(() => {
    setLoggedin(isAuthenticated());
    setIsLoading(false);
  }, []);

  const login = useCallback(() => {
    updateAuthState();
  }, [updateAuthState]);

  const logout = useCallback(async () => {
    await apiLogout();
    updateAuthState();
  }, [updateAuthState]);

  // 페이지 포커스/비저빌리티 변경 시 토큰 상태 확인
  const handleUserActivity = useCallback(async () => {
    if (isAuthenticated()) {
      const isValid = await refreshTokenOnActivity();
      if (!isValid) {
        // 토큰이 만료되었거나 갱신에 실패한 경우
        updateAuthState();
      }
    }
  }, [updateAuthState]);

  // 디바운스된 사용자 활동 처리
  const debouncedHandleUserActivity = useCallback(() => {
    let timeoutId: number;
    
    return () => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        handleUserActivity();
      }, 2000); // 2초 디바운스
    };
  }, [handleUserActivity])();

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

  // 페이지 포커스 이벤트 리스너 추가
  useEffect(() => {
    const handleFocus = () => {
      console.log('페이지 포커스 - 토큰 상태 확인');
      handleUserActivity();
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('페이지 비저빌리티 변경 - 토큰 상태 확인');
        handleUserActivity();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [handleUserActivity]);

  // 사용자 인터랙션 감지 이벤트 리스너 추가
  useEffect(() => {
    if (!isLoggedin) return;

    const handleClick = () => {
      debouncedHandleUserActivity();
    };

    const handleKeyDown = () => {
      debouncedHandleUserActivity();
    };

    const handleScroll = () => {
      debouncedHandleUserActivity();
    };

    // 전역 이벤트 리스너 등록
    document.addEventListener('click', handleClick, { passive: true });
    document.addEventListener('keydown', handleKeyDown, { passive: true });
    document.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('scroll', handleScroll);
    };
  }, [isLoggedin, debouncedHandleUserActivity]);

  const value = useMemo(() => ({
    isLoggedin,
    isLoading,
    login,
    logout,
    updateAuthState,
  }), [isLoggedin, isLoading, login, logout, updateAuthState]);

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