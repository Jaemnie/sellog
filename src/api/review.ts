// 리뷰 관련 API 함수들
import { apiFetch } from "./client";
import type { 
  ApiResponse, 
  ReviewRequest,
  ReviewResponse,
  ReviewListParams,
  CursorPageResponse,
  RestResponseVoid
} from "./types";

// ============================
// 리뷰 API 함수들
// ============================

/**
 * 리뷰 목록 조회
 */
export async function getReviewList(
  postId: string, 
  params?: ReviewListParams
): Promise<ApiResponse<CursorPageResponse<ReviewResponse>>> {
  const searchParams = new URLSearchParams();
  
  if (params?.lastCreateAt) searchParams.append("lastCreateAt", params.lastCreateAt);
  if (params?.lastId) searchParams.append("lastId", params.lastId);
  if (params?.limit) searchParams.append("limit", params.limit.toString());

  const url = `/review/${postId}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
  
  return apiFetch<ApiResponse<CursorPageResponse<ReviewResponse>>>(url, {
    method: "GET",
  });
}

/**
 * 리뷰 작성
 */
export async function createReview(
  postId: string,
  reviewData: ReviewRequest
): Promise<RestResponseVoid> {
  return apiFetch<RestResponseVoid>(`/review/${postId}`, {
    method: "POST",
    body: JSON.stringify(reviewData),
  });
}

/**
 * 리뷰 수정
 */
export async function updateReview(
  reviewId: string,
  reviewData: ReviewRequest
): Promise<RestResponseVoid> {
  return apiFetch<RestResponseVoid>(`/review/${reviewId}`, {
    method: "PATCH",
    body: JSON.stringify(reviewData),
  });
}

/**
 * 리뷰 삭제
 */
export async function deleteReview(reviewId: string): Promise<RestResponseVoid> {
  return apiFetch<RestResponseVoid>(`/review/${reviewId}`, {
    method: "DELETE",
  });
}
