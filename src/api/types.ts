// API 관련 타입 정의 모음 - API 명세서 기반으로 완전 재작성

// ============================
// 공통 타입 정의
// ============================
export interface ApiResponse<T = unknown> {
  isSuccess: boolean;
  code: string;
  message: string;
  payload?: T;
}

export interface RestResponseVoid {
  isSuccess: boolean;
  code: string;
  message: string;
  payload?: void;
}

// 공통 열거형
export type PostType = 'POST' | 'PRODUCT';
export type FileType = 'POST' | 'CHAT' | 'PROFILE';
export type Gender = 'MALE' | 'FEMALE' | 'NONE';
export type AccountVisibility = 'PUBLIC' | 'PRIVATE';

// ============================
// 커서 페이지네이션 타입
// ============================
export interface CursorPageParams {
  lastCreateAt?: string;
  lastId?: string;
  limit?: number;
}

export interface CursorPageResponse<T> {
  content: T[];
  hasNext: boolean;
  nextGroupId?: string;
  nextCreateAt?: string;
  nextId?: string;
}

// ============================
// 인증 관련 타입
// ============================
export interface UserRegisterDto {
  name: string;
  nickname: string;
  userId: string;
  password: string;
  email: string;
}

export interface UserLoginDto {
  userId: string;
  password: string;
}

export interface UserFindIdDto {
  username: string;
  email: string;
}

export interface UserPasswordDto {
  userId: string;
  email: string;
  password: string;
}

export interface CheckIdDto {
  userId: string;
}

export interface UserDeleteDto {
  userId: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  userId: string;
}

// ============================
// 게시글 관련 타입
// ============================
export interface PostRequestDto {
  type?: PostType;
  title?: string;
  userId?: string;
  contents?: string;
  thumbnail?: string;
  tagNames?: string[];
  latitude?: number;
  longitude?: number;
  place?: string;
  price?: number;
  isPublic?: boolean;
}

export interface PostListParams extends CursorPageParams {
  type?: PostType;
}

// ============================
// 팔로우/블락 관련 타입
// ============================
export interface OtherUserIdRequest {
  otherId: string;
}

export interface FollowerListParams extends CursorPageParams {
  userId: string;
}

export type BlockListParams = CursorPageParams;

// ============================
// 댓글 관련 타입
// ============================
export interface CommentRequest {
  content: string;
}

export interface CommentListParams extends CursorPageParams {
  lastGroupId?: string;
}

export interface CommentCreateParams {
  parentId?: string;
}

// ============================
// 리뷰 관련 타입
// ============================
export interface ReviewRequest {
  content: string;
  rating: number; // 1~5
}

export interface ReviewResponse {
  reviewId: string;
  content: string;
  rating: number;
  authorNickname: string;
  authorProfileImage: string;
  authorId: string;
  createdAt: string;
}

export type ReviewListParams = CursorPageParams;

// ============================
// 파일 관련 타입
// ============================
export interface FileUploadParams {
  fileType: FileType;
}

// ============================
// 프로필 관련 타입
// ============================
export interface UserProfileRequest {
  profileThumbURL?: string;
  profileURL?: string;
  userName?: string;
  nickname?: string;
  gender?: Gender;
  profileMessage?: string;
  birthDay?: string;
  email?: string;
  phoneNumber?: string;
  userAddress?: string;
  latitude?: number;
  longitude?: number;
  accountVisibility?: AccountVisibility;
}

export interface UserProfileParams extends CursorPageParams {
  type?: string;
}

// ============================
// 검색 관련 타입
// ============================
export interface UnifiedSearchRequest {
  keyword: string;
  targetType?: string;
  searchOnlyFriends?: boolean;
  sortBy?: string;
  page?: number;
  size?: number;
}

export interface AutocompleteParams {
  query: string;
  limit?: number;
}

// 지오메트리 관련 타입 (복잡하지만 명세서에 있음)
export interface Point {
  x: number;
  y: number;
  // 기타 속성들은 필요시 추가
}

export interface SearchIndex {
  id: string;
  sourceId: string;
  sourceType: string;
  fullTextContent: string;
  mainTitle: string;
  subContent?: string;
  thumbnailUrl?: string;
  createdAt: string;
  likeCount: number;
  authorId: string;
  authorNickname: string;
  locationPoint?: Point;
  price?: number;
}

export interface PageableObject {
  paged: boolean;
  pageNumber: number;
  pageSize: number;
  offset: number;
  sort: SortObject;
  unpaged: boolean;
}

export interface SortObject {
  sorted: boolean;
  empty: boolean;
  unsorted: boolean;
}

export interface PageSearchIndex {
  totalElements: number;
  totalPages: number;
  pageable: PageableObject;
  size: number;
  content: SearchIndex[];
  number: number;
  sort: SortObject;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// ============================
// 레거시 타입 (호환성을 위해 유지)
// ============================
export interface MyProfileInfo {
  profileThumbURL: string;
  profileURL: string;
  userId: string;
  userName: string;
  nickname: string;
  gender: string;
  profileMessage: string;
  birthDay: string;
  email: string;
  phoneNumber: string;
  userAddress: string;
  score: number;
  postCount: number;
  productCount: number;
  followCount: number;
  followedCount: number;
}

export interface UserProfileInfo {
  profileThumbURL: string;
  profileURL: string;
  userId: string;
  userName: string;
  nickname: string;
  gender: string;
  profileMessage: string;
  birthDay: string;
  score: number;
  postCount: number;
  productCount: number;
  followCount: number;
  followedCount: number;
}

// ============================
// API 응답 타입 정의 
// ============================

// 게시글 응답 타입
export interface PostResponse {
  id: string;
  type: PostType;
  title: string;
  userId: string;
  contents: string;
  thumbnail?: string;
  tagNames?: string[];
  latitude?: number;
  longitude?: number;
  place?: string;
  price?: number;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  likeCount: number;
  dislikeCount: number;
  viewCount: number;
  commentCount: number;
}

// 댓글 응답 타입
export interface CommentResponse {
  id: string;
  postId: string;
  parentId?: string;
  groupId: string;
  content: string;
  authorId: string;
  authorNickname: string;
  authorProfileImage?: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  replyCount: number;
}

// 팔로우/블락 사용자 응답 타입
export interface UserBasicResponse {
  userId: string;
  nickname: string;
  profileThumbURL?: string;
  profileMessage?: string;
  isFollowing?: boolean;
  isBlocked?: boolean;
  createdAt: string;
}

// 파일 업로드 응답 타입
export interface FileUploadResponse {
  fileHash: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  contentType: string;
  uploadedAt: string;
}

// 좋아요/싫어요 토글 응답 타입
export interface LikeToggleResponse {
  isLiked: boolean;
  likeCount: number;
  dislikeCount: number;
}

// 호환성을 위한 별칭
export type SignUpRequest = UserRegisterDto;
export type LoginRequest = UserLoginDto;
export type FindIdRequest = UserFindIdDto;
export type ForgotPasswordRequest = UserPasswordDto;
export type DuplicateCheckRequest = CheckIdDto;
