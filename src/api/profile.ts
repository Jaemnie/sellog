// 프로필 관련 API 함수들
import { apiFetch } from "./client";
import type { 
  ApiResponse, 
  MyProfileInfo, 
  UserProfileInfo,
  UserProfileParams,
  FileUploadResponse
} from "./types";
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
/**
 * 프로필 이미지 파일 업로드
 */
export async function uploadProfileImage(
  file: File
): Promise<ApiResponse<FileUploadResponse>> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiFetch<ApiResponse<FileUploadResponse>>("/api/file?fileType=PROFILE", {
    method: "POST",
    body: formData,
    // FormData 사용 시 Content-Type 헤더를 설정하지 않음 (브라우저가 자동 설정)
    headers: undefined,
  });
  return response;
}

/**
 * 상대 프로필 조회 (회원용)
 * @param userId - 조회할 사용자 ID
 * @param params - 조회 파라미터 (게시글 타입, 페이징 등)
 * @returns 상대방의 프로필 정보
 */
export async function getUserProfile(
  userId: string,
  params?: UserProfileParams
): Promise<ApiResponse<UserProfileInfo>> {
  if (!userId) {
    throw new Error("사용자 ID가 필요합니다.");
  }

  const searchParams = new URLSearchParams();
  if (params?.type) searchParams.append("type", params.type);
  if (params?.lastCreateAt) searchParams.append("lastCreateAt", params.lastCreateAt);
  if (params?.lastId) searchParams.append("lastId", params.lastId);
  if (params?.limit) searchParams.append("limit", params.limit.toString());

  const url = `/api/profile/${userId}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

  const response = await apiFetch<ApiResponse<UserProfileInfo>>(url, {
    method: "GET",
  });
  return response;
}

/**
 * 프로필 조회 (비회원용)
 * @param userId - 조회할 사용자 ID
 * @param params - 조회 파라미터 (게시글 타입, 페이징 등)
 * @returns 공개 프로필 정보 (개인정보 미포함)
 */
export async function getUserProfilePreview(
  userId: string,
  params?: UserProfileParams
): Promise<ApiResponse<UserProfileInfo>> {
  if (!userId) {
    throw new Error("사용자 ID가 필요합니다.");
  }

  const searchParams = new URLSearchParams();
  if (params?.type) searchParams.append("type", params.type);
  if (params?.lastCreateAt) searchParams.append("lastCreateAt", params.lastCreateAt);
  if (params?.lastId) searchParams.append("lastId", params.lastId);
  if (params?.limit) searchParams.append("limit", params.limit.toString());

  const url = `/api/preview/${userId}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

  const response = await apiFetch<ApiResponse<UserProfileInfo>>(url, {
    method: "GET",
  });
  return response;
}
