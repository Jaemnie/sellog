// API 관련 타입 정의 모음

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