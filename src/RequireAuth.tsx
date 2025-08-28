/* 비공개 라우트 보호 컴포넌트 
    사용자가 로그인하지 않은 상태라면 특정 페이지 접근 막음*/
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, type JSX } from "react";
import { toast } from "react-toastify";
import { useAuth } from "./contexts/AuthContext";

export const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedin, isLoading } = useAuth();
  const hasShownToast = useRef(false);
  
  useEffect(() => {
    // 로딩이 완료되고 로그인되지 않은 상태일 때만 리다이렉트
    if (!isLoading && !isLoggedin) {
      // 이미 로그인 관련 페이지에 있다면 토스트를 표시하지 않음
      const isAuthPage = ['/login', '/signUp', '/findId', '/forgotPw'].includes(location.pathname);
      
      if (!isAuthPage && !hasShownToast.current) {
        toast.error("로그인이 필요한 서비스입니다.", {
          toastId: "auth-required",
          autoClose: 2000,
        });
        hasShownToast.current = true;
      }
      
      navigate("/login", { replace: true });
    }
  }, [isLoggedin, isLoading, navigate, location.pathname]);

  // 로그인 상태가 변경되면 토스트 표시 플래그 리셋
  useEffect(() => {
    if (isLoggedin) {
      hasShownToast.current = false;
    }
  }, [isLoggedin]);

  // 로딩 중이거나 로그인되지 않은 상태에서는 아무것도 렌더링하지 않음
  if (isLoading || !isLoggedin) {
    return null;
  }

  return children;
};
