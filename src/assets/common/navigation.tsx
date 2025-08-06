import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faCircleXmark, faTimes } from "@fortawesome/free-solid-svg-icons";

const Navigation: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches] = useState(["React", "TypeScript", "JavaScript", "CSS"]);

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setSearchQuery("");
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleClearAllRecent = () => {
    // 추후 구현: 최근 검색 기록 모두 삭제
    console.log("모든 검색 기록 삭제");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("검색:", searchQuery);
      // 추후 구현: 실제 검색 로직
    }
  };

  if (!isSearchOpen) {
    // 검색이 닫혀있을 때: 축소된 사이드바
    return (
      <div 
        className="fixed left-0 top-16 h-screen z-40 navigation-sidebar shadow-lg transition-all duration-300 ease-in-out"
        style={{ 
          backgroundColor: 'var(--color-background)',
          borderRight: '1px solid var(--color-border)'
        }}
      >
        <div className="w-16 h-full">
          <div className="flex flex-col items-center py-4">
            <button
              onClick={handleSearchToggle}
              className="p-3 rounded-lg transition-all duration-200 hover:transform hover:scale-105"
              style={{
                color: 'var(--color-text-secondary)',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-background-secondary)';
                e.currentTarget.style.color = 'var(--color-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--color-text-secondary)';
              }}
              aria-label="검색 열기"
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} className="text-xl" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 검색이 열려있을 때: 확장된 검색 패널
  return (
    <div className="fixed left-0 top-0 h-screen z-50 transition-all duration-300 ease-in-out">
      <div className="flex h-full">
        {/* 축소된 사이드바 */}
        <div 
          className="w-16 shadow-lg navigation-sidebar relative"
          style={{
            backgroundColor: 'var(--color-background)',
            borderRight: '1px solid var(--color-border)',
            zIndex: 50
          }}
        >
          <div className="flex flex-col items-center py-4" style={{ paddingTop: '5rem' }}>
            <button
              onClick={handleSearchToggle}
              className="p-3 rounded-lg transition-all duration-200"
              style={{
                color: 'var(--color-primary)',
                backgroundColor: 'rgba(245, 158, 11, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.1)';
              }}
              aria-label="검색 닫기"
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} className="text-xl" />
            </button>
          </div>
        </div>

        {/* 확장된 검색 패널 */}
        <div 
          className="w-80 shadow-xl animate-slide-in-left navigation-search-panel relative"
          style={{
            backgroundColor: 'var(--color-background)',
            borderRight: '1px solid var(--color-border)',
            zIndex: 50
          }}
        >
          {/* 헤더 */}
          <div 
            className="flex items-center justify-between p-4"
            style={{ 
              borderBottom: '1px solid var(--color-border)',
              marginTop: '4rem' // 헤더 높이만큼 마진 추가
            }}
          >
            <h2 
              className="text-xl font-bold"
              style={{ color: 'var(--color-text-primary)' }}
            >
              검색
            </h2>
            <button
              onClick={handleSearchToggle}
              className="p-2 rounded-lg transition-all duration-200"
              style={{ color: 'var(--color-text-muted)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-background-secondary)';
                e.currentTarget.style.color = 'var(--color-text-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--color-text-muted)';
              }}
              aria-label="검색 패널 닫기"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          {/* 검색 입력 영역 */}
          <div className="p-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 pr-10 rounded-lg focus:outline-none transition-all duration-200 navigation-search-input"
                style={{
                  backgroundColor: 'var(--color-background-secondary)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-primary)'
                }}
                placeholder="검색어를 입력하세요..."
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200"
                  style={{ color: 'var(--color-text-muted)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--color-text-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--color-text-muted)';
                  }}
                  aria-label="검색어 지우기"
                >
                  <FontAwesomeIcon icon={faCircleXmark} />
                </button>
              )}
            </form>
          </div>

          {/* 구분선 */}
          <div 
            className="mx-4"
            style={{ borderBottom: '1px solid var(--color-border)' }}
          ></div>

          {/* 최근 검색 항목 */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 
                className="text-sm font-semibold"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                최근 검색 항목
              </h3>
              <button
                onClick={handleClearAllRecent}
                className="text-xs hover:underline transition-colors duration-200"
                style={{ color: 'var(--color-text-muted)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--color-text-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--color-text-muted)';
                }}
              >
                모두 지우기
              </button>
            </div>
            
            {recentSearches.length > 0 ? (
              <div className="space-y-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => setSearchQuery(search)}
                    className="flex items-center w-full p-2 text-left rounded-lg transition-all duration-200 navigation-recent-item"
                    style={{ color: 'var(--color-text-secondary)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-background-secondary)';
                      e.currentTarget.style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    <FontAwesomeIcon 
                      icon={faMagnifyingGlass} 
                      className="mr-3 transition-colors duration-200"
                      style={{ color: 'var(--color-text-muted)' }}
                    />
                    <span className="flex-1 text-sm">{search}</span>
                  </button>
                ))}
              </div>
            ) : (
              <p 
                className="text-sm text-center py-4"
                style={{ color: 'var(--color-text-muted)' }}
              >
                최근 검색 기록이 없습니다
              </p>
            )}
          </div>

          {/* 검색 제안 또는 추가 기능 영역 */}
          <div 
            className="p-4"
            style={{ borderTop: '1px solid var(--color-border)' }}
          >
            <h3 
              className="text-sm font-semibold mb-2"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              인기 검색어
            </h3>
            <div className="flex flex-wrap gap-2">
              {["React", "JavaScript", "CSS", "TypeScript"].map((tag, index) => (
                <button
                  key={index}
                  onClick={() => setSearchQuery(tag)}
                  className="px-3 py-1 text-xs rounded-full transition-all duration-200 navigation-tag"
                  style={{
                    backgroundColor: 'var(--color-background-secondary)',
                    color: 'var(--color-text-secondary)',
                    border: '1px solid var(--color-border)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                    e.currentTarget.style.color = 'var(--color-background)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-background-secondary)';
                    e.currentTarget.style.color = 'var(--color-text-secondary)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 오버레이 (검색 패널 외부 클릭 시 닫기) */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-25 transition-opacity duration-300"
        style={{ zIndex: 40 }}
        onClick={handleSearchToggle}
        aria-hidden="true"
      />
    </div>
  );
};

export default Navigation;
