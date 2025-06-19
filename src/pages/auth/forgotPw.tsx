import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";

import {
  forgotPassword,
  type ForgotPasswordRequest,
} from "../../assets/common";

const ForgotPw: React.FC = () => {
  const navigate = useNavigate();

  // 입력 상태 관리
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

  // UI 상태 관리
  const [isVerificationVisible, setIsVerificationVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordCk, setShowPasswordCk] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  // Toast 메시지들
  const notifyEmptyUserId = () => {
    toast.error("아이디를 입력해주세요.", {
      toastId: "forgotpw-userid-error",
      autoClose: 2000,
    });
  };

  const notifyEmptyEmail = () => {
    toast.error("이메일을 입력해주세요.", {
      toastId: "forgotpw-email-error",
      autoClose: 2000,
    });
  };

  const notifyInvalidEmail = () => {
    toast.error("올바른 이메일 형식을 입력해주세요.", {
      toastId: "forgotpw-email-invalid",
      autoClose: 2000,
    });
  };

  const notifyEmptyVerificationCode = () => {
    toast.error("인증번호를 입력해주세요.", {
      toastId: "forgotpw-verification-error",
      autoClose: 2000,
    });
  };

  const notifyEmptyPassword = () => {
    toast.error("새 비밀번호를 입력해주세요.", {
      toastId: "forgotpw-password-error",
      autoClose: 2000,
    });
  };

  const notifyPasswordMismatch = () => {
    toast.error("비밀번호가 일치하지 않습니다.", {
      toastId: "forgotpw-password-mismatch",
      autoClose: 2000,
    });
  };

  const notifyEmailNotVerified = () => {
    toast.error("이메일 인증을 완료해주세요.", {
      toastId: "forgotpw-email-not-verified",
      autoClose: 2000,
    });
  };

  const notifyPasswordChangeSuccess = () => {
    toast.success("비밀번호가 성공적으로 변경되었습니다!", {
      toastId: "forgotpw-success",
      autoClose: 1500,
    });
  };

  // 이메일 형식 검증
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 이메일 인증 전송
  const handleSendVerification = () => {
    if (!userId.trim()) {
      notifyEmptyUserId();
      return;
    }

    if (!email.trim()) {
      notifyEmptyEmail();
      return;
    }

    if (!isValidEmail(email)) {
      notifyInvalidEmail();
      return;
    }

    setIsSendingEmail(true);
    // TODO: 실제 API 호출
    setTimeout(() => {
      toast.success("인증번호가 전송되었습니다.", {
        toastId: "verification-sent",
        autoClose: 2000,
      });
      setIsVerificationVisible(true);
      setIsSendingEmail(false);
    }, 1500);
  };

  // 인증번호 확인
  const handleVerifyCode = () => {
    if (!verificationCode.trim()) {
      notifyEmptyVerificationCode();
      return;
    }

    setIsVerifying(true);
    // TODO: 실제 API 호출
    setTimeout(() => {
      toast.success("이메일 인증이 완료되었습니다.", {
        toastId: "verification-success",
        autoClose: 2000,
      });
      setIsEmailVerified(true);
      setIsVerifying(false);
    }, 1000);
  };

  // 비밀번호 변경
  const handlePasswordChange = async () => {
    if (!isEmailVerified) {
      notifyEmailNotVerified();
      return;
    }

    if (!newPassword.trim()) {
      notifyEmptyPassword();
      return;
    }

    if (newPassword !== newPasswordConfirm) {
      notifyPasswordMismatch();
      return;
    }

    try {
      const forgotPasswordData: ForgotPasswordRequest = {
        id: userId.trim(),
        email: email.trim(),
        password: newPassword.trim(),
        passwordCk: newPasswordConfirm.trim(),
      };

      const response = await forgotPassword(forgotPasswordData);

      if (response.isSuccess) {
        notifyPasswordChangeSuccess();
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        toast.error(response.message || "비밀번호 변경에 실패했습니다.", {
          toastId: "forgotpw-error",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("비밀번호 변경 오류:", error);
      toast.error("비밀번호 변경 중 오류가 발생했습니다. 다시 시도해주세요.", {
        toastId: "forgotpw-error",
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
          onKeyPress={(e) => e.key === "Enter" && handleSendVerification()}
        />
        <div className="relative w-full">
          <input
            className="auth-input w-full"
            type="email"
            placeholder="이메일 본인 인증"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendVerification()}
          />
          <button
            className="btn btn-send"
            onClick={handleSendVerification}
            disabled={isSendingEmail}
            type="button"
          >
            {isSendingEmail ? "전송중..." : "전송"}
          </button>
        </div>
        <div
          className={`${
            isVerificationVisible ? "block" : "hidden"
          } relative w-full`}
        >
          <input
            className="auth-input w-full"
            type="text"
            placeholder="인증번호 입력"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleVerifyCode()}
          />
          <button
            className="btn btn-send"
            onClick={handleVerifyCode}
            disabled={isVerifying || isEmailVerified}
            type="button"
          >
            {isVerifying ? "인증중..." : isEmailVerified ? "완료" : "인증"}
          </button>
        </div>
        <div className="relative">
          <input
            className="auth-input"
            type={showPassword ? "text" : "password"}
            placeholder="새 비밀번호 입력"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handlePasswordChange()}
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
            placeholder="새 비밀번호 확인"
            value={newPasswordConfirm}
            onChange={(e) => setNewPasswordConfirm(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handlePasswordChange()}
          />
          <button
            className="btn-pw"
            onClick={() => setShowPasswordCk((prev) => !prev)}
            type="button"
          >
            <FontAwesomeIcon icon={showPasswordCk ? faEyeSlash : faEye} />
          </button>
        </div>

        <button className="btn-login btn" onClick={handlePasswordChange}>
          비밀번호 변경
        </button>
      </div>
    </div>
  );
};

export default ForgotPw;
