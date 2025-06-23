/* 비공개 라우트 보호 컴포넌트 
    사용자가 로그인하지 않은 상태라면 특정 페이지 접근 막음*/
import { useNavigate } from "react-router-dom";
import { useEffect, type JSX } from "react";
import { toast } from "react-toastify";
import { useAuth } from "./contexts/AuthContext";

export const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const navigate = useNavigate();
  const { isLoggedin } = useAuth();

  useEffect(() => {
    if (!isLoggedin) {
      toast.error("로그인이 필요한 서비스입니다.", {
        toastId: "auth-required",
        autoClose: 2000,
      });
      navigate("/login", { replace: true });
    }
  }, [isLoggedin, navigate]);
  
  if (!isLoggedin) {
    return null;
  }
  
  return children;
}; 