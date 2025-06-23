import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { toast } from "react-toastify";

import { login, type LoginRequest } from "../../api";
import { useAuth } from "../../contexts/AuthContext";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login: updateAuthState } = useAuth();

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const handleLogin = async () => {
    if (!userId.trim()) {
      toast.error("아이디를 입력해주세요.", {
        toastId: "login-id-error",
        autoClose: 2000,
      });
      return;
    }

    if (!password.trim()) {
      toast.error("비밀번호를 입력해주세요.", {
        toastId: "login-password-error",
        autoClose: 2000,
      });
      return;
    }

    try {
      const loginData: LoginRequest = {
        userId: userId.trim(),
        password: password.trim(),
      };

      const response = await login(loginData);

      if (response.isSuccess) {
        updateAuthState();
        toast.success("로그인 성공!", {
          toastId: "login-success",
          autoClose: 1500,
        });
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        toast.error(response.message || "로그인에 실패했습니다.", {
          toastId: "login-error",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("로그인 오류:", error);
      toast.error("로그인 중 오류가 발생했습니다. 다시 시도해주세요.", {
        toastId: "login-error",
        autoClose: 3000,
      });
    }
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
          onKeyPress={(e) => e.key === "Enter" && handleLogin()}
        />
        <div className="relative">
          <input
            className="auth-input"
            type={showPassword ? "text" : "password"}
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleLogin()}
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
        <button className="btn-login btn" onClick={() => navigate("/signUp")}>
          회원가입
        </button>
        <div className="flex w-full justify-between">
          <div
            className="auth-text-link cursor-pointer"
            style={{ userSelect: "none" }}
            onClick={() => navigate("/forgotPw")}
          >
            비밀번호 변경
          </div>
          <div
            className="auth-text-link cursor-pointer"
            style={{ userSelect: "none" }}
            onClick={() => navigate("/findId")}
          >
            아이디 찾기
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
