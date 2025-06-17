import React, { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";

const ForgotPw = () => {
  /* 이메일 본인 인증 전송 버튼 클릭 시 하단에 인증 번호 입력 input 태그 생성*/
  const [isVisible, setIsvisible] = useState(false);

  /* 비밀번호 표시 */
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordCk, setShowPasswordCk] = useState(false);

  return (
    <div className="card-position">
      <div className="card-logo">SelLog</div>
      <div className="card">
        <input className="input" type="text" placeholder="아이디" />
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
        <div className="relative">
          <input
            className="input"
            type={showPassword ? "text" : "password"}
            placeholder="새 비밀번호 입력"
          />
          <button
            className="btn-pw top-5"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </button>
        </div>
        <div className="relative">
          <input
            className="input mb-4"
            type={showPasswordCk ? "text" : "password"}
            placeholder="새 비밀번호 확인"
          />
          <button
            className="btn-pw"
            onClick={() => setShowPasswordCk((prev) => !prev)}
          >
            <FontAwesomeIcon icon={showPasswordCk ? faEyeSlash : faEye} />
          </button>
        </div>

        <button className="btn-login btn">비밀번호 변경</button>
      </div>
    </div>
  );
};
export default ForgotPw;
