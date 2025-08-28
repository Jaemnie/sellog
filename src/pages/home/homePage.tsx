import { useEffect, useState } from "react";
import { FloatingButton } from "../../assets/common";
import { getPostList, toggleLike } from "../../api/feed";
import type { PostResponse } from "../../api/types";
import { toast } from "react-toastify";
import { Loader2, Heart, Share2, MessageCircle, MoreHorizontal } from "lucide-react";
import { useAuthGuard } from "../../hooks";
import LoginModal from "../../components/LoginModal";

const Home = () => {
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const [lastCreateAt, setLastCreateAt] = useState<string>();
  const [lastId, setLastId] = useState<string>();
  
  // 인증 가드 훅
  const { checkAuth, isLoginModalOpen, loginModalMessage, closeLoginModal } = useAuthGuard();

  // 초기 피드 로드
  const loadFeed = async (isMore = false) => {
    try {
      if (isMore) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

      const params = {
        limit: 10,
        ...(isMore && lastCreateAt && lastId && {
          lastCreateAt,
          lastId,
        }),
      };

      const response = await getPostList(params);
      
      if (response.isSuccess && response.payload) {
        const { content, hasNext: newHasNext, nextCreateAt, nextId } = response.payload;
        
        if (isMore) {
          setPosts(prev => [...prev, ...content]);
        } else {
          setPosts(content);
        }
        
        setHasNext(newHasNext);
        setLastCreateAt(nextCreateAt);
        setLastId(nextId);
      } else {
        toast.error("피드를 불러오는데 실패했습니다.");
      }
    } catch (error) {
      console.error("피드 로드 에러:", error);
      toast.error("피드를 불러오는데 실패했습니다.");
    } finally {
      if (isMore) {
        setIsLoadingMore(false);
      } else {
        setIsLoading(false);
      }
    }
  };

  // 좋아요 토글
  const handleLikeToggle = (postId: string) => {
    checkAuth(async () => {
      try {
        const response = await toggleLike(postId);
        
        if (response.isSuccess && response.payload) {
          setPosts(prev => 
            prev.map(post => 
              post.id === postId 
                ? { 
                    ...post, 
                    likeCount: response.payload!.likeCount,
                    // TODO: 좋아요 상태 업데이트 (API에서 제공하는 isLiked 사용)
                  }
                : post
            )
          );
        } else {
          toast.error("좋아요 처리에 실패했습니다.");
        }
      } catch (error) {
        console.error("좋아요 토글 에러:", error);
        toast.error("좋아요 처리에 실패했습니다.");
      }
    }, "좋아요를 누르려면 로그인이 필요해요! 💕");
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "방금 전";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}일 전`;
    
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // 초기 로드
  useEffect(() => {
    loadFeed();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 더보기 로드
  const handleLoadMore = () => {
    if (hasNext && !isLoadingMore) {
      loadFeed(true);
    }
  };

  if (isLoading) {
    return (
      <div className="feed-container">
        <div className="feed-header-padding">
          <div className="feed-wrapper">
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-2 text-text-secondary">피드를 불러오는 중...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="feed-container">
      <div className="feed-header-padding">
        <div className="feed-wrapper">
          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <MessageCircle className="w-16 h-16 text-text-muted mb-4" />
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                아직 게시물이 없습니다
              </h3>
              <p className="text-text-secondary mb-6">
                첫 번째 게시물을 작성해보세요!
              </p>
            </div>
          ) : (
            <>
              {posts.map((post) => (
                <div key={post.id} className="feed-post-card">
                  {/* 포스트 헤더 */}
                  <div className="feed-post-header">
                    <div className="feed-user-info">
                      <div className="feed-profile-image">
                        <img 
                          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                          alt={post.userId} 
                        />
                      </div>
                      <div>
                        <p className="feed-user-name">{post.userId}</p>
                        <p className="feed-post-time">{formatDate(post.createdAt)}</p>
                      </div>
                    </div>
                    {/* 더보기 버튼 */}
                    <button className="feed-more-button">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>

                  {/* 메인 이미지 */}
                  {post.thumbnail && (
                    <div className="feed-main-image">
                      <img src={post.thumbnail} alt="포스트 이미지" />
                      {/* 해시태그 배지 */}
                      {post.tagNames && post.tagNames.length > 0 && (
                        <div className="feed-hashtag-badge">
                          {post.tagNames[0]}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 포스트 내용 */}
                  <div className="feed-post-content">
                    {/* 좋아요 섹션 */}
                    <div className="feed-actions">
                      <button 
                        className="feed-like-button"
                        onClick={() => handleLikeToggle(post.id)}
                      >
                        <div className="feed-like-icon-wrapper">
                          <Heart className="feed-like-icon" />
                        </div>
                        <span className="feed-like-count">{post.likeCount}</span>
                      </button>

                      {/* 공유 버튼 */}
                      <button className="feed-share-button">
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>

                    {/* 포스트 텍스트 */}
                    <p className="feed-post-text">{post.contents}</p>

                    {/* 위치 정보 */}
                    {post.place && (
                      <p className="text-sm text-text-muted mt-2">📍 {post.place}</p>
                    )}

                    {/* 가격 정보 (판매 게시글인 경우) */}
                    {post.type === "PRODUCT" && post.price && (
                      <p className="text-lg font-bold text-primary mt-2">
                        {new Intl.NumberFormat('ko-KR').format(post.price)}원
                      </p>
                    )}

                    {/* 댓글 섹션 */}
                    <div className="feed-comments-section">
                      <div className="feed-comments-header">
                        <h3 className="feed-comments-title">댓글</h3>
                        <span className="feed-comments-count">
                          {post.commentCount}개
                        </span>
                      </div>

                      {/* TODO: 댓글 목록 API 연결 */}
                      
                      {/* 댓글 작성 영역 */}
                      <div className="feed-comment-input-section">
                        <div className="feed-comment-input-wrapper">
                          <div className="feed-comment-input-avatar">
                            <img
                              src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=40&h=40&fit=crop&crop=face"
                              alt="내 프로필"
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                          <input
                            type="text"
                            placeholder="댓글을 입력하세요..."
                            className="feed-comment-input"
                            onClick={() => checkAuth(() => {}, "댓글을 작성하려면 로그인이 필요해요! ✍️")}
                          />
                          <button 
                            className="feed-comment-submit"
                            onClick={() => checkAuth(() => {}, "댓글을 작성하려면 로그인이 필요해요! ✍️")}
                          >
                            게시
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* 더보기 버튼 */}
              {hasNext && (
                <div className="flex justify-center py-8">
                  <button
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoadingMore ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        로딩 중...
                      </>
                    ) : (
                      "더보기"
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* 피드 올리기 플로팅 버튼 */}
      <FloatingButton />
      
      {/* 로그인 모달 */}
      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        message={loginModalMessage}
      />
    </div>
  );
};

export default Home;