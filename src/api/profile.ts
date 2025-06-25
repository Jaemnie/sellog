// 프로필 관련 API 함수들
import { apiFetch } from "./client";
import type { ApiResponse, MyProfileInfo } from "./types";

// ============================
// 프로필 API 함수들
// ============================
export async function getProfile(): Promise<ApiResponse<MyProfileInfo>> {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    throw new Error("로그인이 필요합니다.");
  }
  
  const response = await apiFetch<ApiResponse<MyProfileInfo>>(
    `/api/${userId}/profile`,
    {
      method: "GET",
    }
  );
  return response;
}