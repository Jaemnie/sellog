import { Header } from "./assets/common";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/home/homePage";
import FriendList from "./pages/social/friendList";
import ChatList from "./pages/chat/chatList";
import Login from "./pages/auth/login";
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
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
