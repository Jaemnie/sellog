import React from "react";

const ForgotPw = () => {
  return (
    <div className="card-position">
      <div className="card-logo">SelLog</div>
      <div className="card">
        <input className="input" placeholder="이름" />
        <input className="input" placeholder="닉네임" />
        <input className="input" placeholder="아이디" />
        <div
          className="pb-2 text-right text-sm"
          style={{ color: "var(--color-text-secondary))" }}
        >
          중복 검사
        </div>
        <input className="input" placeholder="비밀번호" />
        <input className="input mb-3" placeholder="비밀번호 확인" />
        <input className="input" placeholder="이메일" />
        <input className="input mb-3" placeholder="주소" />

        <button className="btn-login btn">회원가입 완료</button>
      </div>
    </div>
  );
};

export default ForgotPw;
