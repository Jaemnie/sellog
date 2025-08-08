import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMagnifyingGlass, 
  faCircleXmark, 
  faTimes,
  faUser,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { useSearch } from '../../hooks/useSearch';
import type { UserProfileInfo } from '../../api/types';

interface SearchPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onUserSelect?: (user: UserProfileInfo) => void;
}

const SearchPanel: React.FC<SearchPanelProps> = ({ 
  isOpen, 
  onClose, 
  onUserSelect 
}) => {
  const {
    searchQuery,
    setSearchQuery,
    searchResult,
    isSearching,
    searchError,
    recentSearches,
    performSearch,
    clearSearchHistory,
    selectSearchTerm,
  } = useSearch();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      performSearch(searchQuery, true); // 수동 검색은 히스토리에 저장
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    // 검색어를 지우면 결과도 초기화
  };

  const handleUserClick = (user: UserProfileInfo) => {
    if (onUserSelect) {
      onUserSelect(user);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed left-0 top-0 h-screen z-50 transition-all duration-300 ease-in-out">
      <div className="flex h-full">
        {/* 확장된 검색 패널 */}
        <div 
          className="w-96 shadow-xl animate-slide-in-left navigation-search-panel relative"
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
              marginTop: '4rem'
            }}
          >
            <h2 
              className="text-xl font-bold"
              style={{ color: 'var(--color-text-primary)' }}
            >
              사용자 검색
            </h2>
            <button
              onClick={onClose}
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
                placeholder="사용자 ID를 입력하세요..."
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

          {/* 검색 결과 영역 */}
          <div className="flex-1 overflow-y-auto">
            {/* 검색 오류 */}
            {searchError && (
              <div className="p-4">
                <div 
                  className="p-3 rounded-lg text-sm"
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    color: 'var(--color-error)',
                    border: '1px solid rgba(239, 68, 68, 0.2)'
                  }}
                >
                  {searchError}
                </div>
              </div>
            )}

            {/* 검색 결과 */}
            {searchResult && (
              <div className="p-4">
                <h3 
                  className="text-sm font-semibold mb-3"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  검색 결과
                </h3>
                <button
                  onClick={() => handleUserClick(searchResult)}
                  className="flex items-center w-full p-3 text-left rounded-lg transition-all duration-200"
                  style={{ color: 'var(--color-text-primary)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-background-secondary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div className="flex-shrink-0 mr-3">
                    {searchResult.profileThumbURL ? (
                      <img
                        src={searchResult.profileThumbURL}
                        alt={`${searchResult.nickname} 프로필`}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: 'var(--color-background-secondary)' }}
                      >
                        <FontAwesomeIcon 
                          icon={faUser} 
                          className="text-lg"
                          style={{ color: 'var(--color-text-muted)' }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium truncate">{searchResult.nickname}</span>
                      <span 
                        className="text-xs"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        @{searchResult.userId}
                      </span>
                    </div>
                    <p 
                      className="text-sm mb-1 truncate"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {searchResult.userName}
                    </p>
                    {searchResult.profileMessage && (
                      <p 
                        className="text-sm mb-2 truncate"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        {searchResult.profileMessage}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      <span>점수: {searchResult.score}</span>
                      <span>게시물: {searchResult.postCount}</span>
                      <span>팔로워: {searchResult.followedCount}</span>
                    </div>
                  </div>
                </button>
              </div>
            )}

            {/* 검색어가 없을 때 - 최근 검색 */}
            {!searchQuery && !searchResult && (
              <>
                {/* 최근 검색 항목 */}
                {recentSearches.length > 0 && (
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 
                        className="text-sm font-semibold"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        최근 검색 항목
                      </h3>
                      <button
                        onClick={clearSearchHistory}
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
                    
                    <div className="space-y-2">
                      {recentSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => selectSearchTerm(search)}
                          className="flex items-center w-full p-2 text-left rounded-lg transition-all duration-200"
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
                  </div>
                )}


              </>
            )}

            {/* 검색 중 표시 */}
            {isSearching && !searchResult && (
              <div className="p-8 text-center">
                <FontAwesomeIcon 
                  icon={faSpinner} 
                  className="animate-spin text-2xl mb-2"
                  style={{ color: 'var(--color-primary)' }}
                />
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  검색 중...
                </p>
              </div>
            )}

            {/* 검색 결과 없음 */}
            {searchQuery && !isSearching && !searchResult && !searchError && (
              <div className="p-8 text-center">
                <FontAwesomeIcon 
                  icon={faUser} 
                  className="text-2xl mb-2"
                  style={{ color: 'var(--color-text-muted)' }}
                />
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  사용자 ID '{searchQuery}'를 찾을 수 없습니다.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 오버레이 (검색 패널 외부 클릭 시 닫기) */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-25 transition-opacity duration-300"
        style={{ zIndex: 40 }}
        onClick={onClose}
        aria-hidden="true"
      />
    </div>
  );
};

export default SearchPanel;
