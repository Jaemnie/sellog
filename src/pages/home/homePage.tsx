
import { FloatingButton } from "../../assets/common";

const Home = () => {
  // 목업 데이터
  const mockPosts = [
    {
      id: 1,
      user: {
        name: "민성",
        profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
      },
      createdAt: "1일전",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
      hashtag: "일상",
      likes: 50,
      content: "Chill guy 하는중 ~ 좋은하루~",
      comments: [
        {
          id: 1,
          user: "친구 이름 A",
          content: "와! 멋진 사진이다"
        }
      ]
    },
    {
      id: 2,
      user: {
        name: "지은",
        profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b08c?w=150&h=150&fit=crop&crop=face"
      },
      createdAt: "2시간전",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop",
      hashtag: "맛집",
      likes: 32,
      content: "오늘 발견한 숨은 맛집! 파스타가 정말 맛있어요 🍝",
      comments: [
        {
          id: 1,
          user: "맛집러버",
          content: "어디에요? 저도 가고 싶어요!"
        },
        {
          id: 2,
          user: "민성",
          content: "다음에 같이 가요~"
        }
      ]
    },
    {
      id: 3,
      user: {
        name: "현우",
        profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
      },
      createdAt: "5시간전",
      image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=400&fit=crop",
      hashtag: "여행",
      likes: 89,
      content: "제주도 여행 중입니다! 날씨가 너무 좋아요 ☀️🌊",
      comments: [
        {
          id: 1,
          user: "여행조아",
          content: "제주도 좋죠~ 맛있는 것도 많이 드세요!"
        }
      ]
    }
  ];

  return (
    <div className="feed-container">
      <div className="feed-header-padding">
        <div className="feed-wrapper">
          {mockPosts.map((post) => (
            <div key={post.id} className="feed-post-card">
              {/* 포스트 헤더 */}
              <div className="feed-post-header">
                <div className="feed-user-info">
                  <div className="feed-profile-image">
                    <img 
                      src={post.user.profileImage} 
                      alt={post.user.name}
                    />
                  </div>
                  <div>
                    <p className="feed-user-name">
                      {post.user.name}
                    </p>
                    <p className="feed-post-time">
                      {post.createdAt}
                    </p>
                  </div>
                </div>
                {/* 더보기 버튼 */}
                <button className="feed-more-button">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
              </div>

              {/* 메인 이미지 */}
              <div className="feed-main-image">
                <img 
                  src={post.image} 
                  alt="포스트 이미지"
                />
                {/* 해시태그 배지 */}
                <div className="feed-hashtag-badge">
                  #{post.hashtag}
                </div>
              </div>

              {/* 포스트 내용 */}
              <div className="feed-post-content">
                {/* 좋아요 섹션 */}
                <div className="feed-actions">
                  <button className="feed-like-button">
                    <div className="feed-like-icon-wrapper">
                      <svg className="feed-like-icon" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="feed-like-count">
                      {post.likes}
                    </span>
                  </button>

                  {/* 공유 버튼 */}
                  <button className="feed-share-button">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                  </button>
                </div>

                {/* 포스트 텍스트 */}
                <p className="feed-post-text">
                  {post.content}
                </p>

                {/* 댓글 섹션 */}
                <div className="feed-comments-section">
                  <div className="feed-comments-header">
                    <h3 className="feed-comments-title">
                      댓글
                    </h3>
                    <span className="feed-comments-count">
                      {post.comments.length}개
                    </span>
                  </div>
                  
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="feed-comment-item">
                      <div className="feed-comment-content">
                        <div className="feed-comment-avatar">
                          <img 
                            src={`https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face`}
                            alt={comment.user}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                        <div className="feed-comment-text-wrapper">
                          <p className="feed-comment-user">
                            {comment.user}
                          </p>
                          <p className="feed-comment-text">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* 댓글 작성 영역 */}
                  <div className="feed-comment-input-section">
                    <div className="feed-comment-input-wrapper">
                      <div className="feed-comment-input-avatar">
                        <img 
                          src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=40&h=40&fit=crop&crop=face"
                          alt="내 프로필"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="댓글을 입력하세요..."
                        className="feed-comment-input"
                      />
                      <button className="feed-comment-submit">
                        게시
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* 피드 올리기 플로팅 버튼 */}
      <FloatingButton 
        onClick={() => {
          // TODO: 피드 올리기 기능 구현 (API 연결 시)
          console.log('피드 올리기 버튼 클릭됨');
        }}
      />
    </div>
  );
};

export default Home;
