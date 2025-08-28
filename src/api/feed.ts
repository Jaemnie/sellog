// 게시글 관련 API 함수들
import { apiFetch } from "./client";
import type { 
  ApiResponse, 
  PostRequestDto, 
  PostListParams,
  CursorPageResponse,
  PostResponse,
  LikeToggleResponse
} from "./types";

// ============================
// 게시글 API 함수들
// ============================

/**
 * 게시글 목록 조회
 */
export async function getPostList(params?: PostListParams): Promise<ApiResponse<CursorPageResponse<PostResponse>>> {
  const searchParams = new URLSearchParams();
  
  if (params?.type) searchParams.append("type", params.type);
  if (params?.lastCreateAt) searchParams.append("lastCreateAt", params.lastCreateAt);
  if (params?.lastId) searchParams.append("lastId", params.lastId);
  if (params?.limit) searchParams.append("limit", params.limit.toString());

  const url = `/api/post${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
  
  return apiFetch<ApiResponse<CursorPageResponse<PostResponse>>>(url, {
    method: "GET",
  });
}

/**
 * 게시글 작성
 */
export async function createPost(postData: PostRequestDto): Promise<ApiResponse<PostResponse>> {
  return apiFetch<ApiResponse<PostResponse>>("/api/post", {
    method: "POST",
    body: JSON.stringify(postData),
  });
}

/**
 * 게시글 단일 조회
 */
export async function getPost(postId: string): Promise<ApiResponse<PostResponse>> {
  return apiFetch<ApiResponse<PostResponse>>(`/api/post/${postId}`, {
    method: "GET",
  });
}

/**
 * 게시글 수정
 */
export async function updatePost(postId: string, postData: PostRequestDto): Promise<ApiResponse<PostResponse>> {
  return apiFetch<ApiResponse<PostResponse>>(`/api/post/${postId}`, {
    method: "PATCH",
    body: JSON.stringify(postData),
  });
}

/**
 * 게시글 삭제
 */
export async function deletePost(postId: string): Promise<ApiResponse<void>> {
  return apiFetch<ApiResponse<void>>(`/api/post/${postId}`, {
    method: "DELETE",
  });
}

/**
 * 게시글 좋아요 토글
 */
export async function toggleLike(postId: string): Promise<ApiResponse<LikeToggleResponse>> {
  return apiFetch<ApiResponse<LikeToggleResponse>>(`/api/post/${postId}/like`, {
    method: "PATCH",
  });
}

/**
 * 게시글 싫어요 토글
 */
export async function toggleDislike(postId: string): Promise<ApiResponse<LikeToggleResponse>> {
  return apiFetch<ApiResponse<LikeToggleResponse>>(`/api/post/${postId}/dislike`, {
    method: "PATCH",
  });
}
