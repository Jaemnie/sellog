import { Header } from "./assets/common";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/home/homePage";
import FriendList from "./pages/social/friendList";
import ChatList from "./pages/chat/chatList";
import Login from "./pages/auth/login";
import Join from "./pages/auth/singUp";
import FindId from "./pages/auth/findId";
import ForgotPw from "./pages/auth/forgotPw";

function App() {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <BrowserRouter>
        <Header title="Sellog" />

        {/* 헤더가 fixed이므로 padding-top 추가 */}

        <Routes>
          <Route path="/home" element={<Home />}></Route>
          <Route path="/friendList" element={<FriendList />}></Route>
          <Route path="/chatList" element={<ChatList />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/join" element={<Join />}></Route>
          <Route path="/findId" element={<FindId />}></Route>
          <Route path="/forgotPw" element={<ForgotPw />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
