import React, { useState } from "react";

const findId = () => {
  const [isVisible, setIsvisible] = useState(false);
  return (
    <div className="card-position">
      <div className="card-logo">SelLog</div>
      <div className="card">
        <input className="input" type="text" placeholder="이름" />
        <div className="relative w-full">
          <input
            className="input mb-3 w-full"
            type="email"
            placeholder="이메일 본인 인증"
          />
          <button className="btn btn-send" onClick={() => setIsvisible(true)}>
            전송
          </button>
        </div>
        <div className={`${isVisible ? "block" : "hidden"} relative w-full`}>
          <input
            className="input mb-3 w-full"
            type="email"
            placeholder="번호 입력"
          />
          <button className="btn btn-send">인증</button>
        </div>
        <button className="btn-login btn">아이디 찾기</button>
      </div>
    </div>
  );
};

export default findId;
