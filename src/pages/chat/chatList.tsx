import { useState } from "react";
const ChatList = () => {
  const [selected, setselected] = useState<"left" | "right">("left");
  return (
    <div>
      <div className="chat-box">
        <div className="flex">
          <button
            onClick={() => setselected("left")}
            className={`chat-btn-left ${
              selected === "left" ? "bg-[var(--color-primary)]" : "bg-white"
            }`}
          >
            일반 채팅 ▼
          </button>
          <button
            onClick={() => setselected("right")}
            className={`chat-btn-right ${
              selected === "right" ? "bg-[var(--color-primary)]" : "bg-white"
            }`}
          >
            거래 채팅 ▼
          </button>
        </div>
      </div>
    </div>
  );
};
export default ChatList;
