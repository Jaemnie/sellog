// 댓글 관련 API 함수들
import { apiFetch } from "./client";
import type { 
  ApiResponse, 
  CommentRequest,
  CommentResponse,
  CommentListParams,
  CommentCreateParams,
  CursorPageResponse
} from "./types";

// ============================
// 댓글 API 함수들
// ============================

/**
 * 댓글 목록 조회
 */
export async function getCommentList(
  postId: string, 
  params?: CommentListParams
): Promise<ApiResponse<CursorPageResponse<CommentResponse>>> {
  const searchParams = new URLSearchParams();
  
  if (params?.lastGroupId) searchParams.append("lastGroupId", params.lastGroupId);
  if (params?.lastCreateAt) searchParams.append("lastCreateAt", params.lastCreateAt);
  if (params?.lastId) searchParams.append("lastId", params.lastId);
  if (params?.limit) searchParams.append("limit", params.limit.toString());

  const url = `/api/comment/${postId}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
  
  return apiFetch<ApiResponse<CursorPageResponse<CommentResponse>>>(url, {
    method: "GET",
  });
}

/**
 * 댓글 작성 (일반 댓글 및 대댓글)
 */
export async function createComment(
  postId: string,
  commentData: CommentRequest,
  params?: CommentCreateParams
): Promise<ApiResponse<CommentResponse>> {
  const searchParams = new URLSearchParams();
  
  if (params?.parentId) searchParams.append("parentId", params.parentId);

  const url = `/api/comment/${postId}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
  
  return apiFetch<ApiResponse<CommentResponse>>(url, {
    method: "POST",
    body: JSON.stringify(commentData),
  });
}

/**
 * 댓글 수정
 */
export async function updateComment(
  commentId: string,
  commentData: CommentRequest
): Promise<ApiResponse<CommentResponse>> {
  return apiFetch<ApiResponse<CommentResponse>>(`/api/comment/${commentId}`, {
    method: "PATCH",
    body: JSON.stringify(commentData),
  });
}

/**
 * 댓글 삭제
 */
export async function deleteComment(commentId: string): Promise<ApiResponse<void>> {
  return apiFetch<ApiResponse<void>>(`/api/comment/${commentId}`, {
    method: "DELETE",
  });
}
