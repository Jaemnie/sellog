import { Header } from "./assets/common";
import { RequireAuth } from "./assets/common/RequireAuth";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AuthContext, AuthProvider } from "./contexts/AuthContext";
import Home from "./pages/home/homePage";
import FriendList from "./pages/social/friendList";
import ChatList from "./pages/chat/chatList";
import Login from "./pages/auth/login";
import SignUp from "./pages/auth/signUp";
import FindId from "./pages/auth/findId";
import ForgotPw from "./pages/auth/forgotPw";

import axios from "axios";

axios.defaults.withCredentials = true;

function App() {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <BrowserRouter>
        <AuthProvider>
          <Header title="Sellog" />

          {/* 헤더가 fixed이므로 padding-top 추가 */}

          <Routes>
            {/* 공개 라우트 */}
            <Route path="/home" element={<Home />}></Route>
            <Route path="/friendList" element={<FriendList />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/signUp" element={<SignUp />}></Route>
            <Route path="/findId" element={<FindId />}></Route>
            <Route path="/forgotPw" element={<ForgotPw />}></Route>

            {/* 비공개 라우트 */}
            <Route
              path="/chatList"
              element={
                <RequireAuth>
                  <ChatList />
                </RequireAuth>
              }
            ></Route>
          </Routes>

          {/* 전역 Toast Container */}
          <ToastContainer
            position="top-center"
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
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
