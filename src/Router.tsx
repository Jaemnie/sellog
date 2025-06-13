import { BrowserRouter, Route, Routes } from "react-router-dom";
import Test from "./assets/test/test.tsx";
import ChatList from "./assets/chat/chatList.tsx";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/test" element={<Test />}></Route>
        <Route path="/chatList" element={<ChatList />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
