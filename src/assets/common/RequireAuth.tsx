/* 비공개 라우트 보호 컴포넌트 
    사용자가 로그인하지 않은 상태라면 특정 페이지 접근 막음*/
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import { useEffect, type JSX, useState } from "react";

export const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const navigate = useNavigate();
  const [isLoggedin, setLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("로그인을 하고 이용해주세요");
      navigate("/login", { replace: true });
    }
  }, []);
  return children;
};
