// 파일 관련 API 함수들
import { apiFetch } from "./client";
import type { 
  ApiResponse, 
  FileType,
  FileUploadResponse
} from "./types";

// ============================
// 파일 API 함수들
// ============================

/**
 * 단일 파일 업로드
 */
export async function uploadFile(
  file: File,
  fileType: FileType
): Promise<ApiResponse<FileUploadResponse>> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiFetch<ApiResponse<FileUploadResponse>>(`/api/file?fileType=${fileType}`, {
    method: "POST",
    body: formData,
    // FormData 사용 시 Content-Type 헤더를 설정하지 않음 (브라우저가 자동 설정)
    headers: undefined,
  });
  return response;
}

/**
 * 복수 파일 업로드
 */
export async function uploadMultipleFiles(
  files: File[],
  fileType: FileType
): Promise<ApiResponse<FileUploadResponse>> {
  const formData = new FormData();
  
  // 파일 배열을 FormData에 추가
  files.forEach(file => {
    formData.append("files", file);
  });

  const response = await apiFetch<ApiResponse<FileUploadResponse>>(`/api/file/multi?fileType=${fileType}`, {
    method: "POST",
    body: formData,
    // FormData 사용 시 Content-Type 헤더를 설정하지 않음 (브라우저가 자동 설정)
    headers: undefined,
  });
  return response;
}

/**
 * 파일 삭제
 */
export async function deleteFile(fileHash: string): Promise<ApiResponse<void>> {
  return apiFetch<ApiResponse<void>>(`/api/file/${fileHash}`, {
    method: "DELETE",
  });
}
