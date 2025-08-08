import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

interface SearchButtonProps {
  onClick: () => void;
  className?: string;
  isActive?: boolean;
}

const SearchButton: React.FC<SearchButtonProps> = ({ 
  onClick, 
  className = '',
  isActive = false 
}) => {
  return (
    <button
      onClick={onClick}
      className={`p-3 rounded-lg transition-all duration-200 hover:transform hover:scale-105 ${className}`}
      style={{
        color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
        backgroundColor: isActive ? 'rgba(245, 158, 11, 0.1)' : 'transparent'
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = 'var(--color-background-secondary)';
          e.currentTarget.style.color = 'var(--color-primary)';
        } else {
          e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.2)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = 'var(--color-text-secondary)';
        } else {
          e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.1)';
        }
      }}
      aria-label={isActive ? "검색 닫기" : "검색 열기"}
    >
      <FontAwesomeIcon icon={faMagnifyingGlass} className="text-xl" />
    </button>
  );
};

export default SearchButton;
