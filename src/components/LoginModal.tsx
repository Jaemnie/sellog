import React from "react";
import { useNavigate } from "react-router-dom";
import { X, LogIn, UserPlus } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

const LoginModal: React.FC<LoginModalProps> = ({ 
  isOpen, 
  onClose, 
  message = "로그인이 필요한 기능입니다." 
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogin = () => {
    onClose();
    navigate("/login");
  };

  const handleSignUp = () => {
    onClose();
    navigate("/signUp");
  };

  return (
    <>
      {/* 배경 오버레이 */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* 모달 컨테이너 */}
        <div 
          className="bg-background border border-border rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 모달 헤더 */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <LogIn className="w-5 h-5 text-primary-foreground" />
              </div>
              <h2 className="text-xl font-bold text-text-primary">로그인 필요</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-background-secondary transition-colors"
            >
              <X className="w-5 h-5 text-text-muted" />
            </button>
          </div>

          {/* 모달 내용 */}
          <div className="p-6 text-center">
            <p className="text-text-secondary mb-6 leading-relaxed">
              {message}
              <br />
              <span className="text-sm text-text-muted">
                로그인하시거나 새 계정을 만들어 주세요.
              </span>
            </p>

            {/* 액션 버튼들 */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleLogin}
                className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary-hover transition-all"
              >
                <LogIn className="w-4 h-4" />
                로그인
              </button>
              
              <button
                onClick={handleSignUp}
                className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-background border border-border text-text-primary rounded-xl font-medium hover:bg-background-secondary hover:border-border-secondary transition-all"
              >
                <UserPlus className="w-4 h-4" />
                회원가입
              </button>
            </div>

            {/* 취소 버튼 */}
            <button
              onClick={onClose}
              className="w-full mt-4 py-2 text-text-muted text-sm hover:text-text-secondary transition-colors"
            >
              나중에 하기
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginModal;
