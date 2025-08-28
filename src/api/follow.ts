// 팔로우/블락 관련 API 함수들
import { apiFetch } from "./client";
import type { 
  ApiResponse, 
  OtherUserIdRequest,
  FollowerListParams,
  BlockListParams,
  CursorPageResponse,
  UserBasicResponse
} from "./types";

// ============================
// 팔로우 관련 API 함수들
// ============================

/**
 * 팔로워 목록 조회
 */
export async function getFollowerList(params: FollowerListParams): Promise<ApiResponse<CursorPageResponse<UserBasicResponse>>> {
  const searchParams = new URLSearchParams();
  
  searchParams.append("userId", params.userId);
  if (params.lastCreateAt) searchParams.append("lastCreateAt", params.lastCreateAt);
  if (params.lastId) searchParams.append("lastId", params.lastId);
  if (params.limit) searchParams.append("limit", params.limit.toString());

  const url = `/api/followers?${searchParams.toString()}`;
  
  return apiFetch<ApiResponse<CursorPageResponse<UserBasicResponse>>>(url, {
    method: "GET",
  });
}

/**
 * 팔로우 추가
 */
export async function addFollower(userData: OtherUserIdRequest): Promise<ApiResponse<void>> {
  return apiFetch<ApiResponse<void>>("/api/followers", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

/**
 * 팔로우 해제
 */
export async function removeFollower(otherId: string): Promise<ApiResponse<void>> {
  return apiFetch<ApiResponse<void>>(`/api/followers/${otherId}`, {
    method: "DELETE",
  });
}

// ============================
// 블락 관련 API 함수들
// ============================

/**
 * 차단 목록 조회
 */
export async function getBlockList(params?: BlockListParams): Promise<ApiResponse<CursorPageResponse<UserBasicResponse>>> {
  const searchParams = new URLSearchParams();
  
  if (params?.lastCreateAt) searchParams.append("lastCreateAt", params.lastCreateAt);
  if (params?.lastId) searchParams.append("lastId", params.lastId);
  if (params?.limit) searchParams.append("limit", params.limit.toString());

  const url = `/api/blocks${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
  
  return apiFetch<ApiResponse<CursorPageResponse<UserBasicResponse>>>(url, {
    method: "GET",
  });
}

/**
 * 차단 추가
 */
export async function addBlock(userData: OtherUserIdRequest): Promise<ApiResponse<void>> {
  return apiFetch<ApiResponse<void>>("/api/blocks", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

/**
 * 차단 해제
 */
export async function removeBlock(otherId: string): Promise<ApiResponse<void>> {
  return apiFetch<ApiResponse<void>>(`/api/blocks/${otherId}`, {
    method: "DELETE",
  });
}
