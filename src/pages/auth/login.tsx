import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { toast } from "react-toastify";

interface LoginProps {
  title?: string;
}

const Login: React.FC<LoginProps> = ({ title = "My App" }) => {
  const navigate = useNavigate();
  
  // 입력 상태 관리
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
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
  
  /*Toast 메시지들*/
  const notifyEmptyId = () => {
    toast.error("아이디를 입력해주세요.", {
      toastId: "login-id-error",
      autoClose: 2000,
    });
  };
  
  const notifyEmptyPassword = () => {
    toast.error("비밀번호를 입력해주세요.", {
      toastId: "login-password-error",
      autoClose: 2000,
    });
  };
  
  const notifyLoginSuccess = () => {
    toast.success("로그인 성공!", {
      toastId: "login-success",
      autoClose: 1500,
    });
  };
  
  // 로그인 처리
  const handleLogin = () => {
    // 아이디 체크
    if (!userId.trim()) {
      notifyEmptyId();
      return;
    }
    
    // 비밀번호 체크
    if (!password.trim()) {
      notifyEmptyPassword();
      return;
    }
    
    // 실제 로그인 로직 (여기서는 성공 토스트만)
    notifyLoginSuccess();
    // TODO: 실제 로그인 API 호출
  };

  return (
    <div className="card-position">
      <div className="card-logo">SelLog</div>
      <div className="card">
                <input
          className="auth-input"
          type="text"
          placeholder="아이디"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
        />
        <div className="relative">
          <input
            className="auth-input"
            type={showPassword ? "text" : "password"}
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          />
          <button
            className="btn-pw"
            onClick={() => setShowPassword((prev) => !prev)}
            type="button"
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </button>
        </div>

        <button className="btn-login btn" onClick={handleLogin}>
          로그인
        </button>
        <button className="btn-login btn" onClick={join}>
          회원가입
        </button>
        <div className="flex w-full justify-between">
          <div
            className="auth-text-link cursor-pointer"
            style={{ userSelect: "none" }}
            onClick={forgotPw}
          >
            비밀번호 변경
          </div>
          <div
            className="auth-text-link cursor-pointer"
            style={{ userSelect: "none" }}
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
