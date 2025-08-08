import { useState, useCallback, useEffect } from 'react';
import { 
  getUserProfile, 
  type UserProfileInfo
} from '../api';

interface UseSearchReturn {
  // 검색 상태
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResult: UserProfileInfo | null;
  isSearching: boolean;
  searchError: string | null;
  
  // 검색 기록 (로컬 스토리지만 사용)
  recentSearches: string[];
  
  // 검색 액션
  performSearch: (query?: string, saveToHistory?: boolean) => Promise<void>;
  clearSearch: () => void;
  clearSearchHistory: () => void;
  
  // 유틸리티
  selectSearchTerm: (term: string) => void;
}

export const useSearch = (): UseSearchReturn => {
  // 검색 상태
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<UserProfileInfo | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  
  // 검색 기록 상태 (로컬 스토리지만 사용)
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('recentSearches');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 검색 수행 (userId로 프로필 조회)
  const performSearch = useCallback(async (query?: string, saveToHistory = true) => {
    const searchTerm = (query || searchQuery).trim();
    if (!searchTerm) {
      setSearchResult(null);
      setSearchError(null);
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    setSearchResult(null);

    try {
      const response = await getUserProfile(searchTerm);

      if (response.isSuccess && response.payload) {
        setSearchResult(response.payload);
        
        // 검색어를 로컬 스토리지에 저장 (수동 검색일 때만)
        if (saveToHistory) {
          const newRecent = [searchTerm, ...recentSearches.filter(term => term !== searchTerm)].slice(0, 10);
          setRecentSearches(newRecent);
          localStorage.setItem('recentSearches', JSON.stringify(newRecent));
        }
      } else {
        setSearchError(response.message || '사용자를 찾을 수 없습니다.');
        setSearchResult(null);
      }
    } catch (error) {
      console.error('검색 실패:', error);
      setSearchError('검색 중 오류가 발생했습니다.');
      setSearchResult(null);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery, recentSearches]);

  // 검색 초기화
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResult(null);
    setSearchError(null);
  }, []);

  // 검색 기록 전체 삭제 (로컬 스토리지만)
  const clearSearchHistory = useCallback(() => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  }, []);

  // 검색어 선택
  const selectSearchTerm = useCallback((term: string) => {
    setSearchQuery(term);
    performSearch(term);
  }, [performSearch]);

  // 실시간 검색 (디바운싱 적용)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResult(null);
      setSearchError(null);
      return;
    }

    const timeoutId = setTimeout(() => {
      performSearch(searchQuery, false); // 실시간 검색은 히스토리에 저장하지 않음
    }, 500); // 500ms 디바운싱

    return () => clearTimeout(timeoutId);
  }, [searchQuery, performSearch]);

  return {
    // 검색 상태
    searchQuery,
    setSearchQuery,
    searchResult,
    isSearching,
    searchError,
    
    // 검색 기록
    recentSearches,
    
    // 검색 액션
    performSearch,
    clearSearch,
    clearSearchHistory,
    
    // 유틸리티
    selectSearchTerm,
  };
};
