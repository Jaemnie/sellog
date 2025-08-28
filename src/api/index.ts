// API 모듈 barrel export - 명세서 기반 완전 재구성

// 타입들
export * from './types';

// 클라이언트 (공통 fetch 함수와 유틸리티)
export * from './client';

// 인증 관련 API
export * from './auth';

// 게시글 관련 API (기존 feed.ts → 게시글 전용으로 변경)
export * from './feed';

// 프로필 관련 API
export * from './profile';

// 팔로우/블락 관련 API
export * from './follow';

// 댓글 관련 API
export * from './comment';

// 리뷰 관련 API
export * from './review';

// 파일 관련 API
export * from './file';

// 검색 관련 API
export * from './search';

// 주로 사용되는 타입들 개별 export
export type {
  ApiResponse,
  AuthTokens,
  PostRequestDto,
  PostListParams,
  CommentRequest,
  ReviewRequest,
  ReviewResponse,
  CursorPageResponse,
  UnifiedSearchRequest,
  PageSearchIndex,
  MyProfileInfo,
  UserProfileInfo,
} from './types'; 