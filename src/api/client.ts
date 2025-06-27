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
