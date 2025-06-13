import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home/homePage.tsx";
import FriendList from "./pages/social/friendList.tsx";
import ChatList from "./pages/chat/chatList.tsx";
import Login from "./pages/auth/login.tsx";
function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/friendList" element={<FriendList />}></Route>
        <Route path="/chatList" element={<ChatList />}></Route>
        <Route path="/login" element={<Login />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
