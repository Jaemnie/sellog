import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { ToastContainer, toast } from "react-toastify";

interface LoginProps {
  title?: string;
}
const findStyles = {
  color: "var(--color-text-secondary)",
};

const Login: React.FC<LoginProps> = ({ title = "My App" }) => {
  const navigate = useNavigate();
  /*url 경로*/
  const join = () => {
    navigate("/join");
  };
  const findId = () => {
    navigate("/findId");
  };
  const forgotPw = () => {
    navigate("/forgotPw");
  };
  /*Toast 문구*/
  const notifyId = () => toast.error("아이디를 입력해주세요.");
  const autoClose = 1000;

  /* 비밀번호 표시 */
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="card-position">
      <div className="card-logo">SelLog</div>
      <div className="card">
        <input className="input mb-2" type="text" placeholder="아이디" />
        <div className="relative">
          <input
            className="input mb-2"
            type={showPassword ? "text" : "password"}
            placeholder="비밀번호"
          />
          <button
            className="btn-pw"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </button>
        </div>
        <ToastContainer limit={1} position="bottom-right" />
        <button className="btn-login btn" onClick={notifyId}>
          로그인
        </button>
        <button className="btn-login btn" onClick={join}>
          회원가입
        </button>
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
