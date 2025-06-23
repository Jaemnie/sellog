// API 통신을 위한 공통 함수 모음

// ============================
// 기본 설정
// ============================
const API_BASE_URL = import.meta.env.VITE_API_URL;

// ============================
// 공통 타입 정의
// ============================
export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  payload?: T;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// ============================
// 인증 관련 타입
// ============================
export interface SignUpRequest {
  name: string;
  nickname: string;
  userId: string;
  password: string;
  email: string;
}

export interface LoginRequest {
  userId: string;
  password: string;
}

export interface FindIdRequest {
  username: string;
  email: string;
}

export interface ForgotPasswordRequest {
  id: string;
  email: string;
  password: string;
  passwordCk: string;
}

export interface DuplicateCheckRequest {
  userId: string;
}

// ============================
// 헬퍼 함수
// ============================
function notifyAuthStateChange() {
  // Context가 감지할 수 있도록 storage 이벤트 발생
  window.dispatchEvent(new StorageEvent('storage', {
    key: 'accessToken',
    newValue: localStorage.getItem('accessToken'),
    url: window.location.href
  }));
}

// ============================
// 공통 fetch 함수
// ============================
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("accessToken");

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
    credentials: 'include', // 쿠키 자동 전송
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // 401 에러 시 토큰 재발급 시도
    if (response.status === 401) {
      const refreshed = await tryRefreshToken();
      if (refreshed) {
        // 토큰 재발급 성공 시 재시도
        const newToken = localStorage.getItem("accessToken");
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${newToken}`,
        };
        const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, config);
        return (await retryResponse.json()) as T;
      }
      // 토큰 재발급 실패 시 로그인 페이지로 리다이렉트
      localStorage.removeItem("accessToken");
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

// ============================
// 인증 API 함수들
// ============================
export async function signUp(
  userData: SignUpRequest
): Promise<ApiResponse<AuthTokens>> {
  return apiFetch<ApiResponse<AuthTokens>>("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export async function login(
  userData: LoginRequest
): Promise<ApiResponse<AuthTokens>> {
  const response = await apiFetch<ApiResponse<AuthTokens>>("/auth/login", {
    method: "POST",
    body: JSON.stringify(userData),
  });

  // 로그인 성공 시 accessToken만 localStorage에 저장
  // refreshToken은 서버에서 httpOnly 쿠키로 설정됨
  if (response.isSuccess && response.payload) {
    localStorage.setItem("accessToken", response.payload.accessToken);
    notifyAuthStateChange();
  }

  return response;
}

export async function refreshToken(): Promise<ApiResponse<AuthTokens>> {
  // refreshToken은 httpOnly 쿠키로 자동 전송됨
  return apiFetch<ApiResponse<AuthTokens>>("/auth/refresh", {
    method: "POST",
  });
}

export async function findId(
  userData: FindIdRequest
): Promise<ApiResponse<string>> {
  return apiFetch<ApiResponse<string>>("/auth/find", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export async function forgotPassword(
  userData: ForgotPasswordRequest
): Promise<ApiResponse<void>> {
  return apiFetch<ApiResponse<void>>("/auth/pwchange", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export async function checkDuplicate(
  userData: DuplicateCheckRequest
): Promise<ApiResponse<{ available: boolean }>> {
  return apiFetch<ApiResponse<{ available: boolean }>>("/auth/checkId", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export async function logout(): Promise<void> {
  try {
    await apiFetch("/auth/logout", {
      method: "POST",
    });
  } catch (error) {
    console.error("로그아웃 API 요청 실패:", error);
  } finally {
    // accessToken만 localStorage에서 제거
    // refreshToken은 서버에서 쿠키 삭제 처리
    localStorage.removeItem("accessToken");
    notifyAuthStateChange();
  }
}

// ============================
// 헬퍼 함수들
// ============================
async function tryRefreshToken(): Promise<boolean> {
  try {
    const response = await refreshToken();
    if (response.isSuccess && response.payload) {
      localStorage.setItem("accessToken", response.payload.accessToken);
      notifyAuthStateChange();
      return true;
    }
    return false;
  } catch (error) {
    console.error("토큰 재발급 실패:", error);
    return false;
  }
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem("accessToken");
}

export function getAccessToken(): string | null {
  return localStorage.getItem("accessToken");
}
