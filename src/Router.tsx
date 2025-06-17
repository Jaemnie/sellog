import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home/homePage.tsx";
import FriendList from "./pages/social/friendList.tsx";
import ChatList from "./pages/chat/chatList.tsx";
import Login from "./pages/auth/login.tsx";
import FindId from "./pages/auth/findId.tsx";
import ForgotPw from "./pages/auth/forgotPw.tsx";
function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/friendList" element={<FriendList />}></Route>
        <Route path="/chatList" element={<ChatList />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/findId" element={<FindId />}></Route>
        <Route path="/forgotPw" element={<ForgotPw />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
