import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { findId, type FindIdRequest } from "../../assets/common";

const FindId: React.FC = () => {
  const navigate = useNavigate();

  // 입력 상태 관리
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  // UI 상태 관리
  const [isVerificationVisible, setIsVerificationVisible] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [foundUserId, setFoundUserId] = useState("");

  // Toast 메시지들
  const notifyEmptyName = () => {
    toast.error("이름을 입력해주세요.", {
      toastId: "findid-name-error",
      autoClose: 2000,
    });
  };

  const notifyEmptyEmail = () => {
    toast.error("이메일을 입력해주세요.", {
      toastId: "findid-email-error",
      autoClose: 2000,
    });
  };

  const notifyInvalidEmail = () => {
    toast.error("올바른 이메일 형식을 입력해주세요.", {
      toastId: "findid-email-invalid",
      autoClose: 2000,
    });
  };

  const notifyEmptyVerificationCode = () => {
    toast.error("인증번호를 입력해주세요.", {
      toastId: "findid-verification-error",
      autoClose: 2000,
    });
  };

  const notifyEmailNotVerified = () => {
    toast.error("이메일 인증을 완료해주세요.", {
      toastId: "findid-email-not-verified",
      autoClose: 2000,
    });
  };

  // 이메일 형식 검증
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 이메일 인증 전송
  const handleSendVerification = () => {
    if (!name.trim()) {
      notifyEmptyName();
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
      setIsVerifying(false);
      // 인증 성공 후 아이디 찾기 실행
      handleFindId();
    }, 1000);
  };

  // 아이디 찾기
  const handleFindId = async () => {
    if (!name.trim()) {
      notifyEmptyName();
      return;
    }

    if (!isVerificationVisible) {
      notifyEmailNotVerified();
      return;
    }

    try {
      const findIdData: FindIdRequest = {
        username: name.trim(),
        email: email.trim(),
      };

      const response = await findId(findIdData);

      if (response.isSuccess && response.payload) {
        setFoundUserId(response.payload);
        toast.success(`아이디를 찾았습니다: ${response.payload}`, {
          toastId: "findid-success",
          autoClose: 3000,
        });

        // 3초 후 로그인 페이지로 이동
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        toast.error(response.message || "아이디를 찾을 수 없습니다.", {
          toastId: "findid-error",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("아이디 찾기 오류:", error);
      toast.error("아이디 찾기 중 오류가 발생했습니다. 다시 시도해주세요.", {
        toastId: "findid-error",
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
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
            disabled={isVerifying}
            type="button"
          >
            {isVerifying ? "인증중..." : "인증"}
          </button>
        </div>

        {foundUserId && (
          <div className="auth-result-box auth-result-success">
            <strong>찾은 아이디: {foundUserId}</strong>
          </div>
        )}

        <button className="btn-login btn" onClick={handleFindId}>
          아이디 찾기
        </button>
      </div>
    </div>
  );
};

export default FindId;
