import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getMyProfile } from "../../api/profile";
import { getPostList } from "../../api/feed";
import { type MyProfileInfo, type PostResponse } from "../../api/types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";

const Profile = () => {
  const navigate = useNavigate();
  const [selected, setselected] = useState<"left" | "right">("left");
  const [profileData, setProfileData] = useState<MyProfileInfo | null>(null);
  const [productPosts, setProductPosts] = useState<PostResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [profileResponse, productResponse] = await Promise.all([
          getMyProfile({ type: "POST", limit: 10 }),
          getPostList({ type: "PRODUCT", limit: 10 })
        ]);

        if (profileResponse.isSuccess && profileResponse.payload) {
          setProfileData(profileResponse.payload);
        } else {
          setError(profileResponse.message || "프로필을 불러올 수 없습니다.");
        }

        if (productResponse.isSuccess && productResponse.payload) {
          setProductPosts(productResponse.payload.content);
        }
        
      } catch {
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  if (loading) {
    return (
      <div className="profile-box">
        <div className="flex justify-center items-center h-64">
          <div>프로필을 불러오는 중...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-box">
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-box">
      <div className="profile-info">
        <img
          className="profile-img mr-4"
          src={profileData?.profileURL || "https://placehold.co/600x400.png"}
          alt="프로필 이미지"
        />
        <div className="profile-count">
          <span>
            <div>{profileData?.postCount || 0}</div>
            <div className="profile-count-text">게시글</div>
          </span>
          <span>
            <div>{profileData?.productCount || 0}</div>
            <div className="profile-count-text">중고거래</div>
          </span>
          <span>
            <div>{profileData?.followedCount || 0}</div>
            <div className="profile-count-text">팔로워</div>
          </span>
          <span>
            <div>{profileData?.followCount || 0}</div>
            <div className="profile-count-text">팔로우</div>
          </span>
        </div>
      </div>
      <div className="profile-sell-box">
        <div className="profile-sell">
          {profileData?.profileMessage ? (
            <div>{profileData.profileMessage}</div>
          ) : (
            <div>프로필 메시지가 없습니다.</div>
          )}
        </div>
        <button
          className="profile-setting"
          onClick={() => navigate("/myprofile")}
        >
          <FontAwesomeIcon icon={faGear} className="profile-icon" />
        </button>
      </div>

      <div className="profile-feed-box">
        <div className="flex border-b mb-4" style={{ borderColor: 'var(--color-border)' }}>
          <button
            onClick={() => setselected("left")}
            className={`flex-1 py-3 px-4 text-center font-medium transition-all duration-200 ${
              selected === "left" 
                ? "border-b-2" 
                : "hover:bg-opacity-50"
            }`}
            style={selected === "left" 
              ? { 
                  color: 'var(--color-primary)',
                  borderBottomColor: 'var(--color-primary)'
                }
              : { 
                  color: 'var(--color-text-muted)',
                  backgroundColor: 'transparent'
                }
            }
            onMouseEnter={(e) => {
              if (selected !== "left") {
                e.currentTarget.style.backgroundColor = 'var(--color-background-secondary)';
                e.currentTarget.style.color = 'var(--color-text-secondary)';
              }
            }}
            onMouseLeave={(e) => {
              if (selected !== "left") {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--color-text-muted)';
              }
            }}
          >
            📷 일상 피드
          </button>
          <button
            onClick={() => setselected("right")}
            className={`flex-1 py-3 px-4 text-center font-medium transition-all duration-200 ${
              selected === "right" 
                ? "border-b-2" 
                : "hover:bg-opacity-50"
            }`}
            style={selected === "right" 
              ? { 
                  color: 'var(--color-primary)',
                  borderBottomColor: 'var(--color-primary)'
                }
              : { 
                  color: 'var(--color-text-muted)',
                  backgroundColor: 'transparent'
                }
            }
            onMouseEnter={(e) => {
              if (selected !== "right") {
                e.currentTarget.style.backgroundColor = 'var(--color-background-secondary)';
                e.currentTarget.style.color = 'var(--color-text-secondary)';
              }
            }}
            onMouseLeave={(e) => {
              if (selected !== "right") {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--color-text-muted)';
              }
            }}
          >
            🛒 거래 피드
          </button>
        </div>
        <div className="profile-feed">
          {selected === "left" && (
            <div className="grid grid-cols-3 gap-1">
              {profileData?.postLists?.content && profileData.postLists.content.length > 0 ? (
                profileData.postLists.content.map((post) => (
                  <div key={post.postId} className="aspect-square relative group cursor-pointer">
                    <img 
                      src={post.thumbnail || "https://placehold.co/300x300/e5e7eb/9ca3af?text=No+Image"}
                      alt="일상 피드"
                      className="w-full h-full object-cover rounded-sm"
                    />
                    <div 
                      className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-200 rounded-sm"
                      style={{ backgroundColor: 'var(--color-primary)' }}
                    ></div>
                    <div 
                      className="absolute bottom-1 right-1 text-white text-xs px-1 py-0.5 rounded"
                      style={{ 
                        backgroundColor: 'var(--color-primary)',
                        opacity: 0.9
                      }}
                    >
                      {new Date(post.createAt).toLocaleDateString()}
                    </div>
                  </div>
                ))
              ) : (
                <div 
                  className="col-span-3 flex flex-col items-center justify-center py-12"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  <div className="text-lg font-light mb-2">📷</div>
                  <div>아직 일상 게시물이 없습니다</div>
                </div>
              )}
            </div>
          )}
          {selected === "right" && (
            <div className="space-y-4">
              {productPosts.length > 0 ? (
                productPosts.map((post) => (
                  <div 
                    key={post.id} 
                    className="rounded-lg overflow-hidden transition-all duration-200 hover:transform hover:scale-[1.02]"
                    style={{ 
                      backgroundColor: 'var(--color-background)',
                      border: '1px solid var(--color-border)',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                    }}
                  >
                    <div className="aspect-square relative">
                      <img 
                        src={post.thumbnail || "https://placehold.co/400x400/e5e7eb/9ca3af?text=No+Image"}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 
                        className="font-semibold mb-2 line-clamp-2"
                        style={{ color: 'var(--color-text-primary)' }}
                      >
                        {post.title}
                      </h3>
                      {post.price && (
                        <div 
                          className="text-xl font-bold mb-2"
                          style={{ color: 'var(--color-primary)' }}
                        >
                          {post.price.toLocaleString()}원
                        </div>
                      )}
                      <div 
                        className="flex items-center justify-between text-sm"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        {post.place && <span>📍 {post.place}</span>}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div 
                  className="flex flex-col items-center justify-center py-12"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  <div className="text-lg font-light mb-2">🛒</div>
                  <div>아직 거래 게시물이 없습니다</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Profile;
