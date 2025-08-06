// API 클라이언트 - 공통 fetch 함수와 기본 설정
import type { ApiResponse, AuthTokens } from "./types";

// ============================
// 기본 설정
// ============================
const API_BASE_URL = import.meta.env.VITE_API_URL;

// ============================
// 헬퍼 함수
// ============================
function notifyAuthStateChange() {
  // Context가 감지할 수 있도록 storage 이벤트 발생
  window.dispatchEvent(
    new StorageEvent("storage", {
      key: "accessToken",
      newValue: sessionStorage.getItem("accessToken"),
      url: window.location.href,
    })
  );
}

// ============================
// 토큰 관련 헬퍼 함수들
// ============================

/**
 * 토큰의 만료 시간을 반환합니다
 */
export function getTokenExpirationTime(): number | null {
  const token = getAccessToken();
  if (!token) return null;
  
  try {
    const parts = token.split('.');
    if (parts.length !== 3 || !parts[1]) return null;
    
    const payload = JSON.parse(atob(parts[1]));
    return payload.exp * 1000; // 밀리초로 변환
  } catch (error) {
    console.error('토큰 파싱 실패:', error);
    return null;
  }
}

/**
 * 토큰이 곧 만료되는지 확인합니다
 */
export function isTokenExpiringSoon(thresholdMinutes = 5): boolean {
  const expirationTime = getTokenExpirationTime();
  if (!expirationTime) return false;
  
  const thresholdMs = thresholdMinutes * 60 * 1000;
  return (expirationTime - Date.now()) < thresholdMs;
}

/**
 * 토큰이 만료되었는지 확인합니다
 */
export function isTokenExpired(): boolean {
  const expirationTime = getTokenExpirationTime();
  if (!expirationTime) return true;
  
  return Date.now() >= expirationTime;
}

/**
 * 사용자 활동이 감지되었을 때 토큰 상태를 확인하고 필요시 갱신합니다
 */
export async function refreshTokenOnActivity(): Promise<boolean> {
  // 토큰이 없거나 이미 만료된 경우
  if (!getAccessToken() || isTokenExpired()) {
    return false;
  }

  // 토큰이 곧 만료되는 경우에만 갱신
  if (isTokenExpiringSoon()) {
    console.log('사용자 활동 감지 - 토큰 갱신 시도');
    return await tryRefreshToken();
  }

  return true;
}

async function tryRefreshToken(): Promise<boolean> {
  try {
    const response = await refreshToken();
    if (response.isSuccess && response.payload) {
      sessionStorage.setItem("accessToken", response.payload.accessToken);
      notifyAuthStateChange();
      return true;
    }
    return false;
  } catch (error) {
    console.error("토큰 재발급 실패:", error);
    return false;
  }
}

async function refreshToken(): Promise<ApiResponse<AuthTokens>> {
  // refreshToken은 httpOnly 쿠키로 자동 전송됨
  return apiFetch<ApiResponse<AuthTokens>>("/auth/refresh", {
    method: "POST",
  });
}

export function isAuthenticated(): boolean {
  return !!sessionStorage.getItem("accessToken");
}

export function getAccessToken(): string | null {
  return sessionStorage.getItem("accessToken");
}

// ============================
// 공통 fetch 함수
// ============================
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // 중요한 API 호출(POST, PUT, DELETE) 전에 토큰 상태 확인
  const method = options.method?.toUpperCase();
  const isMutationRequest = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method || 'GET');
  
  if (isMutationRequest && getAccessToken()) {
    console.log(`${method} 요청 전 토큰 상태 확인`);
    const isValid = await refreshTokenOnActivity();
    if (!isValid && !endpoint.includes('/auth/')) {
      // 인증 관련 엔드포인트가 아닌 경우에만 로그인 페이지로 리다이렉트
      sessionStorage.removeItem("accessToken");
      notifyAuthStateChange();
      window.location.href = "/login";
      throw new Error("Token expired - redirecting to login");
    }
  }

  const token = sessionStorage.getItem("accessToken");

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // 토큰이 있으면 Authorization 헤더 추가
  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: "include", // 쿠키 자동 전송
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // 401 에러 시 토큰 재발급 시도
    if (response.status === 401) {
      const refreshed = await tryRefreshToken();
      if (refreshed) {
        // 토큰 재발급 성공 시 재시도
        const newToken = sessionStorage.getItem("accessToken");
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${newToken}`,
        };
        const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, config);
        return (await retryResponse.json()) as T;
      }
      // 토큰 재발급 실패 시 로그인 페이지로 리다이렉트
      sessionStorage.removeItem("accessToken");
      notifyAuthStateChange();
      window.location.href = "/login";
      throw new Error("Authentication failed");
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error("API 요청 실패:", error);
    throw error;
  }
}
