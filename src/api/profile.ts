// 프로필 관련 API 함수들
import { apiFetch } from "./client";
import type { ApiResponse, MyProfileInfo, UserProfileInfo } from "./types";

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
//프로필 사진 변경
export async function updateProfileImg(
  userData: MyProfileInfo
): Promise<ApiResponse<MyProfileInfo>> {
  const response = await apiFetch<ApiResponse<MyProfileInfo>>(`/api/file`, {
    method: "POST",
    body: JSON.stringify(userData),
  });
  return response;
}

/**
 * 상대 프로필 조회 (회원용)
 * @param userId - 조회할 사용자 ID
 * @returns 상대방의 프로필 정보
 */
export async function getUserProfile(userId: string): Promise<ApiResponse<UserProfileInfo>> {
  if (!userId) {
    throw new Error("사용자 ID가 필요합니다.");
  }

  const response = await apiFetch<ApiResponse<UserProfileInfo>>(
    `/api/profile/${userId}`,
    {
      method: "GET",
    }
  );
  return response;
}