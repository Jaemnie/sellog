import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import {
  signUp,
  checkDuplicate,
  type SignUpRequest,
} from "../../api";

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordCk, setShowPasswordCk] = useState(false);
  const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false);
  const [isDuplicateChecked, setIsDuplicateChecked] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);

  const handleUserIdChange = (value: string) => {
    setUserId(value);
    setIsDuplicateChecked(false);
  };

  const handleDuplicateCheck = async () => {
    if (!userId.trim()) {
      toast.error("아이디를 입력해주세요.", {
        toastId: "signup-userid-error",
        autoClose: 2000,
      });
      return;
    }

    setIsCheckingDuplicate(true);
    try {
      const response = await checkDuplicate({ userId });

      if (response.isSuccess) {
        setIsDuplicateChecked(true);
        toast.success("사용 가능한 아이디입니다.", {
          toastId: "duplicate-check-success",
          autoClose: 2000,
        });
      } else {
        setIsDuplicateChecked(false);
        toast.error("이미 사용 중인 아이디입니다.", {
          toastId: "duplicate-check-fail",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("아이디 중복검사 오류:", error);
      toast.error("중복검사 중 오류가 발생했습니다. 다시 시도해주세요.", {
        toastId: "duplicate-check-error",
        autoClose: 3000,
      });
      setIsDuplicateChecked(false);
    } finally {
      setIsCheckingDuplicate(false);
    }
  };

  const handleSignUp = async () => {
    if (!name.trim()) {
      toast.error("이름을 입력해주세요.", { toastId: "signup-name-error", autoClose: 2000 });
      return;
    }

    if (!nickname.trim()) {
      toast.error("닉네임을 입력해주세요.", { toastId: "signup-nickname-error", autoClose: 2000 });
      return;
    }

    if (!userId.trim()) {
      toast.error("아이디를 입력해주세요.", { toastId: "signup-userid-error", autoClose: 2000 });
      return;
    }

    if (!password.trim()) {
      toast.error("비밀번호를 입력해주세요.", { toastId: "signup-password-error", autoClose: 2000 });
      return;
    }

    if (password !== passwordConfirm) {
      toast.error("비밀번호가 일치하지 않습니다.", { toastId: "signup-password-mismatch", autoClose: 2000 });
      return;
    }

    if (!email.trim()) {
      toast.error("이메일을 입력해주세요.", { toastId: "signup-email-error", autoClose: 2000 });
      return;
    }

    if (!isDuplicateChecked) {
      toast.info("아이디 중복검사를 해주세요.", { toastId: "signup-duplicate-check", autoClose: 2000 });
      return;
    }

    setIsSigningUp(true);

    try {
      const signUpData: SignUpRequest = {
        name: name.trim(),
        nickname: nickname.trim(),
        userId: userId.trim(),
        password: password.trim(),
        email: email.trim(),
      };

      const response = await signUp(signUpData);

      if (response.isSuccess) {
        toast.success("회원가입이 완료되었습니다!", {
          toastId: "signup-success",
          autoClose: 1500,
        });

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        throw new Error(response.message || "회원가입에 실패했습니다.");
      }
    } catch (error) {
      console.error("회원가입 오류:", error);
      const errorMessage = error instanceof Error ? error.message : "회원가입 중 오류가 발생했습니다.";
      toast.error(errorMessage, { toastId: "signup-error", autoClose: 3000 });
    } finally {
      setIsSigningUp(false);
    }
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
          onKeyPress={(e) => e.key === "Enter" && handleSignUp()}
        />
        <input
          className="auth-input"
          type="text"
          placeholder="닉네임"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSignUp()}
        />
        <div className="relative w-full">
          <input
            className="auth-input w-full"
            type="text"
            placeholder="아이디"
            value={userId}
            onChange={(e) => handleUserIdChange(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleDuplicateCheck()}
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
            onKeyPress={(e) => e.key === "Enter" && handleSignUp()}
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
            className="auth-input"
            type={showPasswordCk ? "text" : "password"}
            placeholder="비밀번호 확인"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSignUp()}
          />
          <button
            className="btn-pw"
            onClick={() => setShowPasswordCk((prev) => !prev)}
            type="button"
          >
            <FontAwesomeIcon icon={showPasswordCk ? faEyeSlash : faEye} />
          </button>
        </div>

        <input
          className="auth-input mb-4"
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSignUp()}
        />

        <button
          className="btn-login btn"
          onClick={handleSignUp}
          disabled={isSigningUp}
        >
          {isSigningUp ? "회원가입 중..." : "회원가입 완료"}
        </button>
      </div>
    </div>
  );
};

export default SignUp;
