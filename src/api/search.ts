// 검색 관련 API 함수들
import { apiFetch } from "./client";
import type {
  ApiResponse,
  UnifiedSearchRequest,
  PageSearchIndex,
  AutocompleteParams,
} from "./types";

// ============================
// 검색 API 함수들
// ============================

/**
 * 통합 검색
 * API 명세서의 "/api/search" 엔드포인트 구현
 */
export async function unifiedSearch(
  request: UnifiedSearchRequest
): Promise<ApiResponse<PageSearchIndex>> {
  const searchParams = new URLSearchParams();
  
  // 필수 파라미터
  searchParams.append("keyword", request.keyword);
  
  // 선택적 파라미터들
  if (request.targetType) searchParams.append("targetType", request.targetType);
  if (request.searchOnlyFriends !== undefined) {
    searchParams.append("searchOnlyFriends", request.searchOnlyFriends.toString());
  }
  if (request.sortBy) searchParams.append("sortBy", request.sortBy);
  if (request.page !== undefined) searchParams.append("page", request.page.toString());
  if (request.size !== undefined) searchParams.append("size", request.size.toString());

  const response = await apiFetch<ApiResponse<PageSearchIndex>>(
    `/api/search?${searchParams.toString()}`,
    {
      method: "GET",
    }
  );
  return response;
}

/**
 * 검색어 자동완성 추천
 * API 명세서의 "/api/search/suggestions/autocomplete" 엔드포인트 구현
 */
export async function getAutocompleteSuggestions(
  params: AutocompleteParams
): Promise<string[]> {
  const searchParams = new URLSearchParams();
  searchParams.append("query", params.query);
  if (params.limit !== undefined) {
    searchParams.append("limit", params.limit.toString());
  }

  // API 명세서에 따르면 직접 string[] 배열을 반환
  const response = await apiFetch<string[]>(
    `/api/search/suggestions/autocomplete?${searchParams.toString()}`,
    {
      method: "GET",
    }
  );
  return response;
}

// ============================
// 헬퍼 함수들 (기존 유지)
// ============================

/**
 * 검색 결과 타입별 필터링 헬퍼 함수
 */
export function filterSearchResultsByType(
  results: PageSearchIndex,
  type: 'USER' | 'POST' | 'PRODUCT'
): PageSearchIndex {
  return {
    ...results,
    content: results.content.filter(item => item.sourceType === type),
    numberOfElements: results.content.filter(item => item.sourceType === type).length
  };
}

/**
 * 검색 결과를 타입별로 그룹화하는 헬퍼 함수
 */
export function groupSearchResultsByType(results: PageSearchIndex) {
  const grouped = {
    users: results.content.filter(item => item.sourceType === 'USER'),
    posts: results.content.filter(item => item.sourceType === 'POST'),
    products: results.content.filter(item => item.sourceType === 'PRODUCT')
  };

  return grouped;
}
