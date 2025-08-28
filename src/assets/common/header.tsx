import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faUser, faUsers, faComments, faSignOutAlt, faSignInAlt, faFilter } from "@fortawesome/free-solid-svg-icons";
import { useUnifiedSearch } from "../../hooks/useUnifiedSearch";
import type { SearchIndex } from "../../api/types";
interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoggedin, logout } = useAuth();
  
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    groupedResults,
    isSearching,
    searchError,
    suggestions,
    recentSearches,
    searchFilter,
    setSearchFilter,
    performSearch,
    clearSearchHistory,
    selectSearchTerm,
  } = useUnifiedSearch();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      console.log("로그아웃 완료");
    } catch (error) {
      console.error("로그아웃 오류:", error);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      performSearch();
      setIsSearchFocused(false);
    }
  };



  const handleResultClick = (item: SearchIndex) => {
    // 타입에 따라 다른 페이지로 이동
    switch (item.sourceType) {
      case 'USER':
        navigate(`/profile/${item.authorId}`);
        break;
      case 'POST':
        navigate(`/post/${item.sourceId}`);
        break;
      case 'PRODUCT':
        navigate(`/product/${item.sourceId}`);
        break;
    }
    setIsSearchFocused(false);
  };

  const headerStyles = {
    backgroundColor: "var(--color-background)",
    borderBottom: "1px solid var(--color-border)",
  };

  const mobileMenuStyles = {
    backgroundColor: "var(--color-background)",
    borderTop: "1px solid var(--color-border)",
  };

  const showSearchResults = isSearchFocused && (searchQuery || suggestions.length > 0 || recentSearches.length > 0 || searchResults);

  return (
    <>
    <header
      className="fixed top-0 left-0 right-0 z-50 shadow-md"
      style={headerStyles}
    >
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
            {/* 로고 */}
          <div
            onClick={() => navigate("/home")}
            className="flex-shrink-0 cursor-pointer"
          >
            <h1
                className="text-xl sm:text-2xl font-bold"
              style={{ color: "var(--color-primary)" }}
            >
              SelLog
            </h1>
          </div>

            {/* 중앙 검색창 */}
            <div className="flex-1 max-w-lg mx-4 sm:mx-6">
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className="relative">
                  <FontAwesomeIcon 
                    icon={faMagnifyingGlass} 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={(e) => {
                      // 검색 결과 클릭을 위해 약간의 지연 추가
                      setTimeout(() => {
                        if (!e.currentTarget.contains(document.activeElement)) {
                          setIsSearchFocused(false);
                        }
                      }, 200);
                    }}
                    className="w-full h-9 pl-10 pr-3 rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    style={{
                      backgroundColor: 'var(--color-background-secondary)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text-primary)'
                    }}
                    placeholder="검색..."
                  />

                </div>
              </form>
            </div>

            {/* 우측 사용자 메뉴 */}
            <div className="relative">
              {isLoggedin ? (
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                  onBlur={(e) => {
                    setTimeout(() => {
                      if (!e.currentTarget.contains(document.activeElement)) {
                        setIsUserMenuOpen(false);
                      }
                    }, 200);
                  }}
                >
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    <FontAwesomeIcon 
                      icon={faUser} 
                      className="text-white text-sm"
                    />
                  </div>
                  <svg 
                    className={`w-4 h-4 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200"
                  style={{ 
                    backgroundColor: 'var(--color-primary)',
                    color: 'white'
                  }}
                >
                  <FontAwesomeIcon icon={faSignInAlt} />
                  <span className="hidden sm:inline">로그인</span>
                </button>
              )}

              {/* 드롭다운 메뉴 */}
              {isLoggedin && isUserMenuOpen && (
                <div 
                  className="absolute right-0 top-full mt-2 w-48 rounded-lg shadow-lg z-50"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    border: '1px solid var(--color-border)'
                  }}
                >
                  <div className="py-2">
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setIsUserMenuOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      <FontAwesomeIcon icon={faUser} className="mr-3" />
                      내 프로필
                    </button>
            <button
                      onClick={() => {
                        navigate("/friendList");
                        setIsUserMenuOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      <FontAwesomeIcon icon={faUsers} className="mr-3" />
              친구 찾기
            </button>
            <button
                      onClick={() => {
                        navigate("/chatList");
                        setIsUserMenuOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      <FontAwesomeIcon icon={faComments} className="mr-3" />
              채팅
            </button>
                    <hr 
                      className="my-2" 
                      style={{ borderColor: 'var(--color-border)' }}
                    />
            <button
                      onClick={() => {
                        handleLogout();
                        setIsUserMenuOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-left hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 text-red-600 dark:text-red-400"
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} className="mr-3" />
                      로그아웃
            </button>
                  </div>
                </div>
              )}
            </div>

            {/* 모바일 메뉴 */}
          <div className="md:hidden">
              {isLoggedin ? (
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    <FontAwesomeIcon 
                      icon={faUser} 
                      className="text-white text-sm"
                    />
                  </div>
                </button>
              ) : (
                <button
                  onClick={() => navigate("/profile")}
                  className="flex items-center p-2 rounded-lg transition-colors duration-200"
                  style={{ 
                    backgroundColor: 'var(--color-primary)',
                    color: 'white'
                  }}
                >
                  <FontAwesomeIcon icon={faSignInAlt} />
                </button>
              )}
            </div>
        </div>
      </div>

        {/* 모바일 드롭다운 메뉴 */}
        {isLoggedin && isMenuOpen && (
        <div className="md:hidden animate-fade-in">
          <div
            className="px-2 pt-2 pb-3 space-y-1 sm:px-3"
            style={mobileMenuStyles}
          >
            <button
                onClick={() => {
                  navigate("/profile");
                  setIsMenuOpen(false);
                }}
                className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                style={{ color: 'var(--color-text-primary)' }}
              >
                <FontAwesomeIcon icon={faUser} className="mr-3" />
                내 프로필
              </button>
              <button
                onClick={() => {
                  navigate("/friendList");
                  setIsMenuOpen(false);
                }}
                className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                style={{ color: 'var(--color-text-primary)' }}
              >
                <FontAwesomeIcon icon={faUsers} className="mr-3" />
              친구 찾기
            </button>
            <button
                onClick={() => {
                  navigate("/chatList");
                  setIsMenuOpen(false);
                }}
                className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                style={{ color: 'var(--color-text-primary)' }}
              >
                <FontAwesomeIcon icon={faComments} className="mr-3" />
              채팅
            </button>
              <hr 
                className="my-2" 
                style={{ borderColor: 'var(--color-border)' }}
              />
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="mr-3" />
                로그아웃
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 통합 검색 결과 드롭다운 */}
      {showSearchResults && (
        <div 
          className="fixed top-16 left-1/2 transform -translate-x-1/2 z-40 w-full max-w-lg mx-auto"
          style={{ paddingLeft: '1rem', paddingRight: '1rem' }}
        >
          <div 
            className="mt-1 rounded-lg shadow-lg max-h-96 overflow-y-auto"
            style={{
              backgroundColor: 'var(--color-background)',
              border: '1px solid var(--color-border)'
            }}
          >
            {/* 검색 필터 */}
            {searchQuery && (
              <div className="p-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
                <div className="flex items-center gap-2 overflow-x-auto">
                  <FontAwesomeIcon icon={faFilter} className="text-gray-400 flex-shrink-0" />
                  {(['ALL', 'USER', 'POST', 'PRODUCT'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setSearchFilter(filter)}
                      className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition-colors duration-200 ${
                        searchFilter === filter
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {filter === 'ALL' ? '전체' : 
                       filter === 'USER' ? '사용자' : 
                       filter === 'POST' ? '게시글' : '상품'}
                    </button>
                  ))}
                </div>
              </div>
            )}

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

            {/* 자동완성 제안 */}
            {searchQuery && suggestions.length > 0 && !searchResults && (
              <div className="p-2">
                <h3 className="px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
                  추천 검색어
                </h3>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => selectSearchTerm(suggestion)}
                    className="flex items-center w-full p-2 text-left rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                  >
                    <FontAwesomeIcon 
                      icon={faMagnifyingGlass} 
                      className="mr-3 text-gray-400"
                    />
                    <span className="text-sm">{suggestion}</span>
                  </button>
                ))}
              </div>
            )}

            {/* 통합 검색 결과 */}
            {searchResults && groupedResults && (
              <div className="p-2">
                {/* 사용자 결과 */}
                {groupedResults.users.length > 0 && (
                  <div className="mb-3">
                    <h3 className="px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
                      사용자
                    </h3>
                    {groupedResults.users.slice(0, 3).map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleResultClick(item)}
                        className="flex items-center w-full p-2 text-left rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                      >
                        <div className="flex-shrink-0 mr-3">
                          {item.thumbnailUrl ? (
                            <img
                              src={item.thumbnailUrl}
                              alt={item.authorNickname}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                              <FontAwesomeIcon icon={faUser} className="text-gray-400 text-xs" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{item.mainTitle}</div>
                          <div className="text-xs text-gray-500 truncate">{item.subContent}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* 게시글 결과 */}
                {groupedResults.posts.length > 0 && (
                  <div className="mb-3">
                    <h3 className="px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
                      게시글
                    </h3>
                    {groupedResults.posts.slice(0, 3).map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleResultClick(item)}
                        className="flex items-center w-full p-2 text-left rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                      >
                        <div className="flex-shrink-0 mr-3">
                          {item.thumbnailUrl ? (
                            <img
                              src={item.thumbnailUrl}
                              alt={item.mainTitle}
                              className="w-8 h-8 rounded object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                              <FontAwesomeIcon icon={faMagnifyingGlass} className="text-gray-400 text-xs" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{item.mainTitle}</div>
                          <div className="text-xs text-gray-500 truncate">
                            by {item.authorNickname} · 👍 {item.likeCount}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* 상품 결과 */}
                {groupedResults.products.length > 0 && (
                  <div className="mb-3">
                    <h3 className="px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
                      상품
                    </h3>
                    {groupedResults.products.slice(0, 3).map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleResultClick(item)}
                        className="flex items-center w-full p-2 text-left rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                      >
                        <div className="flex-shrink-0 mr-3">
                          {item.thumbnailUrl ? (
                            <img
                              src={item.thumbnailUrl}
                              alt={item.mainTitle}
                              className="w-8 h-8 rounded object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                              <span className="text-xs">💰</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{item.mainTitle}</div>
                          <div className="text-xs text-gray-500 truncate">
                            {item.price?.toLocaleString()}원 · by {item.authorNickname}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* 더 보기 버튼 */}
                {searchResults.totalElements > 0 && (
                  <div className="px-2 py-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
                    <button
                      onClick={() => {
                        navigate(`/search?q=${encodeURIComponent(searchQuery)}&type=${searchFilter}`);
                        setIsSearchFocused(false);
                      }}
                      className="w-full p-2 text-center text-sm text-blue-500 hover:text-blue-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                    >
                      모든 결과 보기 ({searchResults.totalElements}개)
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 검색 중 */}
            {isSearching && (
              <div className="p-8 text-center">
                <div className="text-gray-500">검색 중...</div>
              </div>
            )}

            {/* 최근 검색 */}
            {!searchQuery && !searchResults && recentSearches.length > 0 && (
              <div className="p-2">
                <div className="flex items-center justify-between px-2 py-1 mb-2">
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    최근 검색
                  </h3>
                  <button
                    onClick={clearSearchHistory}
                    className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    모두 지우기
                  </button>
                </div>
                {recentSearches.slice(0, 5).map((search, index) => (
            <button
                    key={index}
                    onClick={() => selectSearchTerm(search)}
                    className="flex items-center w-full p-2 text-left rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                  >
                    <FontAwesomeIcon 
                      icon={faMagnifyingGlass} 
                      className="mr-3 text-gray-400"
                    />
                    <span className="text-sm">{search}</span>
            </button>
                ))}
              </div>
            )}

            {/* 검색 결과 없음 */}
            {searchQuery && !isSearching && !suggestions.length && !searchResults && !searchError && (
              <div className="p-8 text-center">
                <div className="text-gray-500 text-sm">
                  '{searchQuery}'에 대한 검색 결과가 없습니다.
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 검색 결과 오버레이 (외부 클릭 시 닫기) */}
      {showSearchResults && (
        <div 
          className="fixed inset-0 z-30"
          onClick={() => setIsSearchFocused(false)}
        />
      )}

      {/* 사용자 메뉴 오버레이 (외부 클릭 시 닫기) */}
      {isUserMenuOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Header;
