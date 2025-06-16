import React from "react";
const findStyles = {
  color: "var(--color-text-secondary)",
};
const Login = () => {
  return (
    <div className="fixed w-[400px] h-[300px] top-2/5 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div
        className="p-10 text-7xl font-bold"
        style={{ color: "var(--color-primary)" }}
      >
        SelLog
      </div>
      <div className="card">
        <input className="input flex my-2" placeholder="아이디" />
        <input className="input flex my-2" placeholder="비밀번호" />
        <button className="btn-login btn">회원가입</button>
        <button className="btn-login btn">로그인</button>
        <div className="flex w-full ">
          <div className="flex w-5/6 text-sm" style={findStyles}>
            비밀번호 찾기
          </div>
          <div className="flex justify-end w-full text-sm" style={findStyles}>
            아이디 찾기
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
