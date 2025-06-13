import { Header } from "./assets/common";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Test from "./assets/test/test";
import ChatList from "./assets/chat/chatList";
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
          <Route path="/test" element={<Test />}></Route>
          <Route path="/chatList" element={<ChatList />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
