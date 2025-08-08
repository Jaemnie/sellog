import React, { useState } from "react";
import { SearchPanel, SearchButton } from "../../components/Search";
import { useAuth } from "../../contexts/AuthContext";

const Navigation: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { logout, isLoggedin } = useAuth();

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      console.log("로그아웃 완료");
    } catch (error) {
      console.error("로그아웃 오류:", error);
    }
  };

  if (!isSearchOpen) {
    // 검색이 닫혀있을 때: 축소된 사이드바
    return (
      <div 
        className="fixed left-0 top-16 z-40 navigation-sidebar shadow-lg transition-all duration-300 ease-in-out"
        style={{ 
          backgroundColor: 'var(--color-background)',
          borderRight: '1px solid var(--color-border)',
          height: 'calc(100vh - 4rem)',
          width: '4rem'
        }}
      >
        <div className="w-full h-full">
          <div className="flex flex-col items-center justify-between py-4" style={{ height: '100%' }}>
            <div className="flex flex-col items-center space-y-4">
              <SearchButton onClick={handleSearchToggle} />
            </div>
            {isLoggedin && (
              <button
                onClick={handleLogout}
                className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-900 transition-colors duration-200 border border-transparent hover:border-red-300 dark:hover:border-red-600"
                title="로그아웃"
                style={{ marginBottom: '0.5rem' }}
              >
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="text-red-600 dark:text-red-400"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16,17 21,12 16,7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 검색이 열려있을 때: 확장된 검색 패널
  return (
    <>
      {/* 축소된 사이드바 */}
      <div 
        className="fixed left-0 top-16 z-40 navigation-sidebar shadow-lg transition-all duration-300 ease-in-out"
        style={{ 
          backgroundColor: 'var(--color-background)',
          borderRight: '1px solid var(--color-border)',
          height: 'calc(100vh - 4rem)',
          width: '4rem'
        }}
      >
        <div className="w-full h-full">
          <div className="flex flex-col items-center justify-between py-4" style={{ height: '100%' }}>
            <div className="flex flex-col items-center space-y-4">
              <SearchButton onClick={handleSearchToggle} isActive={true} />
            </div>
            {isLoggedin && (
              <button
                onClick={handleLogout}
                className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-900 transition-colors duration-200 border border-transparent hover:border-red-300 dark:hover:border-red-600"
                title="로그아웃"
                style={{ marginBottom: '0.5rem' }}
              >
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="text-red-600 dark:text-red-400"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16,17 21,12 16,7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 검색 패널 */}
      <SearchPanel 
        isOpen={isSearchOpen} 
        onClose={handleSearchToggle}
      />
    </>
  );
};

export default Navigation;
