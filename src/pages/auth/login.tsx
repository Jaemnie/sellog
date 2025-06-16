import React from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

interface LoginProps {
  title?: string;
}
const findStyles = {
  color: "var(--color-text-secondary)",
};
const Login: React.FC<LoginProps> = ({ title = "My App" }) => {
  const navigate = useNavigate();

  const join = () => {
    navigate("/join");
  };
  const findId = () => {
    navigate("/findId");
  };
  const notifyId = () => toast("아이디를 입력해주세요.");
  const forgotPw = () => {
    navigate("/forgotPw");
  };

  return (
    <div className="card-position">
      <div className="card-logo">SelLog</div>
      <div className="card">
        <input className="input mb-2" placeholder="아이디" />
        <input className="input mb-2" placeholder="비밀번호" />
        <button className="btn-login btn" onClick={join}>
          회원가입
        </button>
        <button className="btn-login btn" onClick={notifyId}>
          로그인
        </button>
        <ToastContainer />
        <div className="flex w-full ">
          <div
            className="flex w-5/6 text-sm"
            style={findStyles}
            onClick={forgotPw}
          >
            비밀번호 변경
          </div>
          <div
            className="flex justify-end w-full text-sm"
            style={findStyles}
            onClick={findId}
          >
            아이디 찾기
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
