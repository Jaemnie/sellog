import React from "react";

const findId = () => {
  return (
    <div className="card-position">
      <div className="card-logo">SelLog</div>
      <div className="card">
        <input className="input" placeholder="이름" />
        <input className="input mb-2" placeholder="이메일" />

        <button className="btn-login btn">아이디 찾기</button>
      </div>
    </div>
  );
};

export default findId;
