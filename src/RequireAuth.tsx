/* 비공개 라우트 보호 컴포넌트 
    사용자가 로그인하지 않은 상태라면 특정 페이지 접근 막음*/
import { useNavigate } from "react-router-dom";
import { useEffect, type JSX } from "react";
import { toast } from "react-toastify";
import { useAuth } from "./contexts/AuthContext";

export const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const navigate = useNavigate();
  const { isLoggedin, isLoading } = useAuth();
  
  useEffect(() => {
    // 로딩이 완료되고 로그인되지 않은 상태일 때만 리다이렉트
    if (!isLoading && !isLoggedin) {
      toast.error("로그인이 필요한 서비스입니다.", {
        toastId: "auth-required",
        autoClose: 2000,
      });
      navigate("/login", { replace: true });
    }
  }, [isLoggedin, isLoading, navigate]);

  // 로딩 중이거나 로그인되지 않은 상태에서는 아무것도 렌더링하지 않음
  if (isLoading || !isLoggedin) {
    return null;
  }

  return children;
};
