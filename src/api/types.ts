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
  userId: string;
}
export interface MyProfileInfo {
  profileThumbURL: string;
  profileURL: string;
  userId: string;
  userName: string;
  nickname: string;
  gender: string;
  profileMessage: string;
  birthDay: string;
  email: string;
  phoneNumber: string;
  userAddress: string;
  score: number;
  postCount: number;
  productCount: number;
  followCount: number;
  followedCount: number;
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
