import React from "react";

interface FloatingButtonProps {
  onClick?: () => void;
  className?: string;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({
  onClick,
  className = "",
}) => {
  return (
    <div>
      <button
        className={`floating-button ${className}`}
        onClick={onClick}
        aria-label="피드 올리기"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>
    </div>
  );
};

export default FloatingButton;
