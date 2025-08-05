// 프로필 관련 API 함수들
import { apiFetch } from "./client";
import type { ApiResponse, MyProfileInfo } from "./types";

// ============================
// 프로필 API 함수들
// ============================
export async function getMyProfile(): Promise<ApiResponse<MyProfileInfo>> {
  const userId = sessionStorage.getItem("userId");
  if (!userId) {
    throw new Error("로그인이 필요합니다.");
  }

  const response = await apiFetch<ApiResponse<MyProfileInfo>>(
    `/api/profile/${userId}`,
    {
      method: "GET",
    }
  );
  return response;
}

export async function updateMyProfile(
  userData: MyProfileInfo
): Promise<ApiResponse<MyProfileInfo>> {
  const userId = sessionStorage.getItem("userId");
  if (!userId) {
    throw new Error("로그인이 필요합니다.");
  }
  const response = await apiFetch<ApiResponse<MyProfileInfo>>(`/api/profile`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  return response;
}
