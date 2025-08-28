import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

interface UseAuthGuardReturn {
  checkAuth: (action: () => void, message?: string) => void;
  isLoginModalOpen: boolean;
  loginModalMessage: string;
  closeLoginModal: () => void;
}

export const useAuthGuard = (): UseAuthGuardReturn => {
  const { isLoggedin } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginModalMessage, setLoginModalMessage] = useState("");

  const checkAuth = (action: () => void, message?: string) => {
    if (isLoggedin) {
      // 로그인된 상태면 바로 액션 실행
      action();
    } else {
      // 로그인되지 않은 상태면 모달 표시
      setLoginModalMessage(message || "로그인이 필요한 기능입니다.");
      setIsLoginModalOpen(true);
    }
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
    setLoginModalMessage("");
  };

  return {
    checkAuth,
    isLoginModalOpen,
    loginModalMessage,
    closeLoginModal,
  };
};
