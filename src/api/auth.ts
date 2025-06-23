// 인증 관련 API 함수들
import { apiFetch } from './client';
import type {
  ApiResponse,
  AuthTokens,
  SignUpRequest,
  LoginRequest,
  FindIdRequest,
  ForgotPasswordRequest,
  DuplicateCheckRequest
} from './types';

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