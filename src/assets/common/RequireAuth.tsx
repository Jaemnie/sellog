/* 비공개 라우트 보호 컴포넌트 
    사용자가 로그인하지 않은 상태라면 특정 페이지 접근 막음*/
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

import type { JSX } from "react";

export const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { isLoggedin } = useAuth();
  const location = useLocation();

  if (!isLoggedin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};
