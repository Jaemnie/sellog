//피드 관련 API 함수들
import { apiFetch } from "./client";
import type { ApiResponse, Feed } from "./types";

// ============================
// 피드 API 함수들
// ============================
export async function getFeed(userData: Feed): Promise<ApiResponse<Feed>> {
  const response = await apiFetch<ApiResponse<Feed>>(`/api/post`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  return response;
}
