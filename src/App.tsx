import { Header } from "./assets/common";
import { RequireAuth } from "./RequireAuth";
import "./App.css";
import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Home from "./pages/home/homePage";
import FriendList from "./pages/social/friendList";
import ChatList from "./pages/chat/chatList";
import Login from "./pages/auth/login";
import SignUp from "./pages/auth/signUp";
import FindId from "./pages/auth/findId";
import ForgotPw from "./pages/auth/forgotPw";

import Profile from "./assets/common/profile";
import Myprofile from "./assets/common/myprofile";

import PostForm from "./assets/post/postForm";
import SellForm from "./assets/post/sellForm";

// 루트 리다이렉트 컴포넌트
function RootRedirect() {
  const { isLoggedin, isLoading } = useAuth();
  const location = useLocation();
  
  // 이미 특정 경로에 있다면 리다이렉트하지 않음
  if (location.pathname !== '/') {
    return null;
  }
  
  if (isLoading) {
    return null; // 로딩 중에는 아무것도 하지 않음
  }
  
  // 로그인되어 있으면 홈으로, 아니면 로그인 페이지로
  return <Navigate to={isLoggedin ? "/home" : "/login"} replace />;
}

function AppContent() {
  return (
    <>
      <Header title="Sellog" />
      <Routes>
        {/* 루트 경로 처리 */}
        <Route path="/" element={<RootRedirect />} />

        {/* 공개 라우트 */}
        <Route path="/login" element={<Login />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/findId" element={<FindId />} />
        <Route path="/forgotPw" element={<ForgotPw />} />
        <Route path="/home" element={<Home />} />
        <Route path="/chatList" element={<ChatList />} />

        {/* 비공개 라우트 */}
        <Route
          path="/friendList"
          element={
            <RequireAuth>
              <FriendList />
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />
        <Route
          path="/myprofile"
          element={
            <RequireAuth>
              <Myprofile />
            </RequireAuth>
          }
        />
        <Route
          path="/postfeed"
          element={
            <RequireAuth>
              <PostForm />
            </RequireAuth>
          }
        />
        <Route
          path="/sellfeed"
          element={
            <RequireAuth>
              <SellForm />
            </RequireAuth>
          }
        />
      </Routes>

      {/* 전역 Toast Container */}
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        limit={3}
      />
    </>
  );
}

function App() {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;