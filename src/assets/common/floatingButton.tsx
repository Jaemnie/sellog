import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit3, ShoppingBag } from "lucide-react";
import { useAuthGuard } from "../../hooks";
import LoginModal from "../../components/LoginModal";

interface FloatingButtonProps {
  onClick?: () => void;
  className?: string;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({
  onClick,
  className = "",
}) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  
  // 인증 가드 훅
  const { checkAuth, isLoginModalOpen, loginModalMessage, closeLoginModal } = useAuthGuard();

  const handleMainClick = () => {
    setIsOpen(!isOpen);
    onClick?.();
  };

  const handleSubMenuClick = (path: string) => {
    checkAuth(() => {
      setIsOpen(false);
      navigate(path);
    }, "글을 작성하려면 로그인이 필요해요! ✍️");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* 배경 오버레이 */}
      {isOpen && (
        <div
          className="fixed inset-0 -z-10"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 서브 메뉴 */}
      <div
        className={`flex flex-col gap-3 mb-16 transition-all duration-300 ease-out ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        {/* 중고거래 버튼 */}
        <button
          onClick={() => handleSubMenuClick("/sellfeed")}
          className="group flex items-center gap-2 bg-background border border-border rounded-full px-3 py-2 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center text-white group-hover:bg-green-600 transition-colors">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <span className="text-text-primary font-medium text-sm whitespace-nowrap">중고거래</span>
        </button>

        {/* 일반 피드 버튼 */}
        <button
          onClick={() => handleSubMenuClick("/postfeed")}
          className="group flex items-center gap-2 bg-background border border-border rounded-full px-3 py-2 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center text-white group-hover:bg-blue-600 transition-colors">
            <Edit3 className="w-4 h-4" />
          </div>
          <span className="text-text-primary font-medium text-sm whitespace-nowrap">일상 공유</span>
        </button>
      </div>

      {/* 메인 플로팅 버튼   */}
      <button
        className={`floating-text-button ${className} transition-all duration-300 ${
          isOpen ? "bg-red-500 hover:bg-red-600" : "bg-primary hover:bg-primary-hover"
        }`}
        onClick={handleMainClick}
        aria-label="글쓰기"
      >
        <Plus 
          className={`w-5 h-5 transition-transform duration-300 ${
            isOpen ? "rotate-45" : "rotate-0"
          }`}
        />
        <span className="font-medium">
          {isOpen ? "닫기" : "글쓰기"}
        </span>
      </button>
      
      {/* 로그인 모달 */}
      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        message={loginModalMessage}
      />
    </div>
  );
};

export default FloatingButton;