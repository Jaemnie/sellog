import React, { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";

const ForgotPw = () => {
  /* 비밀번호 표시 */
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordCk, setShowPasswordCk] = useState(false);
  return (
    <div className="card-position">
      <div className="card-logo">SelLog</div>
      <div className="card">
        <input className="input" type="text" placeholder="이름" />
        <input className="input" type="text" placeholder="닉네임" />
        <input className="input" type="text" placeholder="아이디" />
        <div
          className="pb-2 text-right text-sm"
          style={{ color: "var(--color-text-secondary))" }}
        >
          중복 검사
        </div>
        <div className="relative">
          <input
            className="input"
            type={showPassword ? "text" : "password"}
            placeholder="비밀번호"
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
            placeholder="비밀번호 확인"
          />
          <button
            className="btn-pw"
            onClick={() => setShowPasswordCk((prev) => !prev)}
          >
            <FontAwesomeIcon icon={showPasswordCk ? faEyeSlash : faEye} />
          </button>
        </div>

        <button className="btn-login btn">회원가입 완료</button>
      </div>
    </div>
  );
};

export default ForgotPw;
