import React, { useState } from "react";

/*기본 공통 fetch 함수*/
export async function apiFetch<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const defaultHeaders = {
    "Content-Type": "application/json",
  };
  const response = await fetch(url, {
    headers: {
      ...defaultHeaders,
    },
  });
  const data = (await response.json()) as T;
  return data;
}

/*공통 API 응답 제네릭*/
export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  payload?: T;
}

/*회원가입 */
export interface SignUpRequest {
  name: string;
  nickname: string;
  userId: string;
  password: string;
  email: string;
}
export type SignUpResponse = ApiResponse<SignUpRequest>;

export async function signUp(
  userData: SignUpRequest
): Promise<ApiResponse<AuthTokens>> {
  return apiFetch<ApiResponse<AuthTokens>>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}
/*로그인*/
export interface LoginRequest {
  userId: number;
  password: string;
}
export type LoginResponse = ApiResponse<LoginRequest>;

export async function login(
  userData: LoginRequest
): Promise<ApiResponse<AuthTokens>> {
  return apiFetch<ApiResponse<AuthTokens>>("/auth/login", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}
/*토큰 정보*/
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
export type AuthTokensResponse = ApiResponse<AuthTokens>;

/*토큰 재발급*/
export interface RefreshTokenRequest {
  refreshToken: string;
}
export type RefreshTokenResponse = ApiResponse<RefreshTokenRequest>;

export async function refreshToken(
  userData: RefreshTokenRequest
): Promise<ApiResponse<RefreshTokenRequest>> {
  return apiFetch<ApiResponse<RefreshTokenRequest>>("/auth/refresh", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

/*아이디찾기*/
export interface findIdRequest {
  username: string;
  email: string;
}
export type findIdResponse = ApiResponse<findIdRequest>;

export async function findIdResponse(
  userData: findIdRequest
): Promise<ApiResponse<findIdRequest>> {
  return apiFetch<ApiResponse<findIdRequest>>("/auth/find", {
    method: "post",
    body: JSON.stringify(userData),
  });
}

/*비밀번호변경*/
export interface forgotPwRequest {
  id: string;
  email: string;
  password: string;
  passwordCk: string;
}
export type forgotPwResponse = ApiResponse<forgotPwRequest>;

export async function forgotPwResponse(
  userData: forgotPwRequest
): Promise<ApiResponse<forgotPwResponse>> {
  return apiFetch<ApiResponse<forgotPwResponse>>("/auth/pwchange", {
    method: "post",
    body: JSON.stringify(userData),
  });
}
