import { useState, useEffect, useCallback, useRef } from 'react';
import { unifiedSearch, getAutocompleteSuggestions, groupSearchResultsByType } from '../api/search';
import type { 
  UnifiedSearchRequest, 
  PageSearchIndex, 
  SearchIndex 
} from '../api/types';

interface UseUnifiedSearchReturn {
  // 검색 상태
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearching: boolean;
  searchError: string | null;
  
  // 검색 결과
  searchResults: PageSearchIndex | null;
  groupedResults: {
    users: SearchIndex[];
    posts: SearchIndex[];
    products: SearchIndex[];
  } | null;
  
  // 자동완성
  suggestions: string[];
  isSuggestionsLoading: boolean;
  
  // 검색 히스토리
  recentSearches: string[];
  
  // 검색 필터
  searchFilter: 'ALL' | 'USER' | 'POST' | 'PRODUCT';
  setSearchFilter: (filter: 'ALL' | 'USER' | 'POST' | 'PRODUCT') => void;
  
  // 함수들
  performSearch: (options?: Partial<UnifiedSearchRequest>) => Promise<void>;
  clearSearch: () => void;
  clearSearchHistory: () => void;
  selectSearchTerm: (term: string) => void;
}

const STORAGE_KEY = 'unified_search_history';
const MAX_HISTORY_ITEMS = 10;
const SUGGESTION_DEBOUNCE_MS = 300;

export function useUnifiedSearch(): UseUnifiedSearchReturn {
  // 기본 상태
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<PageSearchIndex | null>(null);
  const [groupedResults, setGroupedResults] = useState<{
    users: SearchIndex[];
    posts: SearchIndex[];
    products: SearchIndex[];
  } | null>(null);
  
  // 자동완성 상태
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);
  
  // 검색 히스토리
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  
  // 검색 필터
  const [searchFilter, setSearchFilter] = useState<'ALL' | 'USER' | 'POST' | 'PRODUCT'>('ALL');
  
  // refs for debouncing
  const suggestionTimeoutRef = useRef<number | undefined>(undefined);
  const searchAbortControllerRef = useRef<AbortController | undefined>(undefined);

  // 검색 히스토리 저장
  const saveSearchHistory = useCallback((searches: string[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(searches));
    } catch (error) {
      console.warn('검색 히스토리 저장 실패:', error);
    }
  }, []);

  // 검색 히스토리에 추가
  const addToSearchHistory = useCallback((term: string) => {
    const trimmedTerm = term.trim();
    if (!trimmedTerm) return;

    setRecentSearches(prev => {
      const filtered = prev.filter(item => item !== trimmedTerm);
      const updated = [trimmedTerm, ...filtered].slice(0, MAX_HISTORY_ITEMS);
      saveSearchHistory(updated);
      return updated;
    });
  }, [saveSearchHistory]);

  // 자동완성 제안 가져오기 (디바운스 적용)
  const fetchSuggestions = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    setIsSuggestionsLoading(true);
    try {
      const suggestions = await getAutocompleteSuggestions({ query: query.trim(), limit: 5 });
      setSuggestions(suggestions);
    } catch (error) {
      console.error('자동완성 제안 가져오기 실패:', error);
      setSuggestions([]);
    } finally {
      setIsSuggestionsLoading(false);
    }
  }, []);

  // 검색 쿼리 변경 시 자동완성 처리
  useEffect(() => {
    if (suggestionTimeoutRef.current) {
      window.clearTimeout(suggestionTimeoutRef.current);
    }

    if (searchQuery.trim()) {
      suggestionTimeoutRef.current = window.setTimeout(() => {
        fetchSuggestions(searchQuery);
      }, SUGGESTION_DEBOUNCE_MS);
    } else {
      setSuggestions([]);
    }

    return () => {
      if (suggestionTimeoutRef.current) {
        window.clearTimeout(suggestionTimeoutRef.current);
      }
    };
  }, [searchQuery, fetchSuggestions]);

  // 통합 검색 수행
  const performSearch = useCallback(async (options: Partial<UnifiedSearchRequest> = {}) => {
    const keyword = options.keyword || searchQuery.trim();
    if (!keyword) return;

    // 이전 검색 요청 취소
    if (searchAbortControllerRef.current) {
      searchAbortControllerRef.current.abort();
    }

    setIsSearching(true);
    setSearchError(null);
    
    // 새로운 AbortController 생성
    searchAbortControllerRef.current = new AbortController();

    try {
      const searchParams: UnifiedSearchRequest = {
        keyword,
        targetType: searchFilter === 'ALL' ? undefined : searchFilter,
        page: 0,
        size: 20,
        sortBy: 'RELEVANCE',
        ...options
      };

      const response = await unifiedSearch(searchParams);
      const results = response.payload;
      
      // 요청이 취소되지 않았다면 결과 설정
      if (!searchAbortControllerRef.current?.signal.aborted && results) {
        setSearchResults(results);
        setGroupedResults(groupSearchResultsByType(results));
        
        // 검색 히스토리에 추가 (수동 검색인 경우만)
        if (!options.keyword) {
          addToSearchHistory(keyword);
        }
      }
    } catch (error) {
      if (!searchAbortControllerRef.current?.signal.aborted) {
        console.error('통합 검색 실패:', error);
        const errorMessage = error instanceof Error ? error.message : '검색 중 오류가 발생했습니다.';
        setSearchError(errorMessage);
        setSearchResults(null);
        setGroupedResults(null);
      }
    } finally {
      if (!searchAbortControllerRef.current?.signal.aborted) {
        setIsSearching(false);
      }
    }
  }, [searchQuery, searchFilter, addToSearchHistory]);

  // 검색 초기화
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults(null);
    setGroupedResults(null);
    setSearchError(null);
    setSuggestions([]);
    
    // 진행 중인 요청들 취소
    if (searchAbortControllerRef.current) {
      searchAbortControllerRef.current.abort();
    }
    if (suggestionTimeoutRef.current) {
      window.clearTimeout(suggestionTimeoutRef.current);
    }
  }, []);

  // 검색 히스토리 초기화
  const clearSearchHistory = useCallback(() => {
    setRecentSearches([]);
    saveSearchHistory([]);
  }, [saveSearchHistory]);

  // 검색어 선택 (히스토리나 자동완성에서)
  const selectSearchTerm = useCallback((term: string) => {
    setSearchQuery(term);
    performSearch({ keyword: term });
  }, [performSearch]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (searchAbortControllerRef.current) {
        searchAbortControllerRef.current.abort();
      }
      if (suggestionTimeoutRef.current) {
        window.clearTimeout(suggestionTimeoutRef.current);
      }
    };
  }, []);

  return {
    // 검색 상태
    searchQuery,
    setSearchQuery,
    isSearching,
    searchError,
    
    // 검색 결과
    searchResults,
    groupedResults,
    
    // 자동완성
    suggestions,
    isSuggestionsLoading,
    
    // 검색 히스토리
    recentSearches,
    
    // 검색 필터
    searchFilter,
    setSearchFilter,
    
    // 함수들
    performSearch,
    clearSearch,
    clearSearchHistory,
    selectSearchTerm
  };
}
