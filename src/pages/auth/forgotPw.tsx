import React from "react";

const ForgotPw = () => {
  return (
    <div className="card-position">
      <div className="card-logo">SelLog</div>
      <div className="card">
        <input className="input" placeholder="이름" />
        <input className="input mb-3" placeholder="아이디" />

        <input className="input" placeholder="새 비밀번호" />
        <input className="input mb-3" placeholder="새 비밀번호 확인" />

        <button className="btn-login btn">비밀번호 변경</button>
      </div>
    </div>
  );
};
export default ForgotPw;
