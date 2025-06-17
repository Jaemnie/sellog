import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  
  // 입력 상태 관리
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  
  // UI 상태 관리
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordCk, setShowPasswordCk] = useState(false);
  const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false);
  const [isDuplicateChecked, setIsDuplicateChecked] = useState(false);
  
  // Toast 메시지들
  const notifyEmptyName = () => {
    toast.error("이름을 입력해주세요.", {
      toastId: "signup-name-error",
      autoClose: 2000,
    });
  };
  
  const notifyEmptyNickname = () => {
    toast.error("닉네임을 입력해주세요.", {
      toastId: "signup-nickname-error",
      autoClose: 2000,
    });
  };
  
  const notifyEmptyUserId = () => {
    toast.error("아이디를 입력해주세요.", {
      toastId: "signup-userid-error",
      autoClose: 2000,
    });
  };
  
  const notifyEmptyPassword = () => {
    toast.error("비밀번호를 입력해주세요.", {
      toastId: "signup-password-error",
      autoClose: 2000,
    });
  };
  
  const notifyPasswordMismatch = () => {
    toast.error("비밀번호가 일치하지 않습니다.", {
      toastId: "signup-password-mismatch",
      autoClose: 2000,
    });
  };
  
  const notifyDuplicateCheck = () => {
    toast.info("아이디 중복검사를 해주세요.", {
      toastId: "signup-duplicate-check",
      autoClose: 2000,
    });
  };
  
  const notifySignupSuccess = () => {
    toast.success("회원가입이 완료되었습니다!", {
      toastId: "signup-success",
      autoClose: 1500,
    });
  };
  
  // 아이디 중복 검사
  const handleDuplicateCheck = () => {
    if (!userId.trim()) {
      notifyEmptyUserId();
      return;
    }
    
    setIsCheckingDuplicate(true);
    // TODO: 실제 API 호출
    setTimeout(() => {
      toast.success("사용 가능한 아이디입니다.", {
        toastId: "duplicate-check-success",
        autoClose: 2000,
      });
      setIsCheckingDuplicate(false);
      setIsDuplicateChecked(true);
    }, 1000);
  };
  
  // 회원가입 처리
  const handleSignUp = () => {
    // 유효성 검사
    if (!name.trim()) {
      notifyEmptyName();
      return;
    }
    
    if (!nickname.trim()) {
      notifyEmptyNickname();
      return;
    }
    
    if (!userId.trim()) {
      notifyEmptyUserId();
      return;
    }
    
    if (!password.trim()) {
      notifyEmptyPassword();
      return;
    }
    
    if (password !== passwordConfirm) {
      notifyPasswordMismatch();
      return;
    }
    
    if (!isDuplicateChecked) {
      notifyDuplicateCheck();
      return;
    }
    
    // 실제 회원가입 로직
    notifySignupSuccess();
    // TODO: 실제 API 호출 후 성공시 로그인 페이지로 이동
    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

  return (
    <div className="card-position">
      <div className="card-logo">SelLog</div>
      <div className="card">
        <input 
          className="auth-input" 
          type="text" 
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSignUp()}
        />
        <input 
          className="auth-input" 
          type="text" 
          placeholder="닉네임"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSignUp()}
        />
        <div className="relative w-full">
          <input 
            className="auth-input w-full" 
            type="text" 
            placeholder="아이디"
            value={userId}
            onChange={(e) => {
              setUserId(e.target.value);
              setIsDuplicateChecked(false);
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleDuplicateCheck()}
          />
          <button
            className="btn-duplicate-check"
            onClick={handleDuplicateCheck}
            disabled={isCheckingDuplicate}
            type="button"
          >
            {isCheckingDuplicate ? "확인중..." : "중복검사"}
          </button>
        </div>
        <div className="relative">
          <input
            className="auth-input"
            type={showPassword ? "text" : "password"}
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSignUp()}
          />
          <button
            className="btn-pw top-5"
            onClick={() => setShowPassword((prev) => !prev)}
            type="button"
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </button>
        </div>
        <div className="relative">
          <input
            className="auth-input mb-4"
            type={showPasswordCk ? "text" : "password"}
            placeholder="비밀번호 확인"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSignUp()}
          />
          <button
            className="btn-pw"
            onClick={() => setShowPasswordCk((prev) => !prev)}
            type="button"
          >
            <FontAwesomeIcon icon={showPasswordCk ? faEyeSlash : faEye} />
          </button>
        </div>

        <button className="btn-login btn" onClick={handleSignUp}>
          회원가입 완료
        </button>
      </div>
    </div>
  );
};

export default SignUp;
