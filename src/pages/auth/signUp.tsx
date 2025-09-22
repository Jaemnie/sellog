import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import {
  signUp,
  checkDuplicate,
  sendEmailVerification,
  verifyEmailOtp,
  type SignUpRequest,
} from "../../api";

const SignUp: React.FC = () => {
  const navigate = useNavigate();

  const [signup, setSignup] = useState<SignUpRequest>({
    name: "",
    nickname: "",
    userId: "",
    password: "",
    email: "",
  });

  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordCk, setShowPasswordCk] = useState(false);
  const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false);
  const [isDuplicateChecked, setIsDuplicateChecked] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  
  // 이메일 인증 관련 상태
  const [otpCode, setOtpCode] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignup((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 아이디가 변경될 때만 중복 검사 상태 초기화
    if (name === "userId") {
      setIsDuplicateChecked(false);
    }
    if (name === "email") {
      setIsOtpSent(false);
      setIsEmailVerified(false);
      setOtpCode("");
    }
  };

  const handleDuplicateCheck = async () => {
    if (!signup.userId.trim()) {
      toast.error("아이디를 입력해주세요.", {
        toastId: "signup-userid-error",
        autoClose: 2000,
      });
      return;
    }

    setIsCheckingDuplicate(true);
    try {
      const response = await checkDuplicate({ userId: signup.userId });
      console.log("중복검사 응답:", response);

      if (response.isSuccess) {
        // 서버가 payload 없이 isSuccess: true로 응답하면 사용 가능
        if (response.payload?.available || !response.payload) {
          setIsDuplicateChecked(true);
          toast.success("사용 가능한 아이디입니다.", {
            toastId: "duplicate-check-success",
            autoClose: 2000,
          });
        } else {
          // payload가 있고 available이 false인 경우
          setIsDuplicateChecked(false);
          toast.error("이미 사용 중인 아이디입니다.", {
            toastId: "duplicate-check-fail",
            autoClose: 2000,
          });
        }
      } else {
        setIsDuplicateChecked(false);
        toast.error(response.message || "중복검사에 실패했습니다.", {
          toastId: "duplicate-check-fail",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("아이디 중복검사 오류:", error);
      setIsDuplicateChecked(false);

      // 409 에러 처리
      if (error instanceof Error && error.message.includes("409")) {
        toast.error("이미 사용 중인 아이디입니다.", {
          toastId: "duplicate-check-conflict",
          autoClose: 2000,
        });
      } else {
        toast.error("중복검사 중 오류가 발생했습니다. 다시 시도해주세요.", {
          toastId: "duplicate-check-error",
          autoClose: 3000,
        });
      }
    } finally {
      setIsCheckingDuplicate(false);
    }
    console.log("중복검사 : " + isDuplicateChecked);
  };


  // 인증번호 발송
  const handleSendOtp = async () => {
    if (!signup.userId.trim()) {
      toast.error("아이디를 먼저 입력해주세요.", {
        toastId: "otp-userid-error",
        autoClose: 2000,
      });
      return;
    }

    if (!signup.email.trim()) {
      toast.error("이메일을 입력해주세요.", {
        toastId: "otp-email-error",
        autoClose: 2000,
      });
      return;
    }

    setIsSendingOtp(true);
    try {
      const response = await sendEmailVerification({
        userId: signup.userId,
        email: signup.email,
      });

      if (response.isSuccess) {
        setIsOtpSent(true);
        setOtpTimer(300); // 5분 타이머
        toast.success("인증번호가 발송되었습니다.", {
          toastId: "otp-send-success",
          autoClose: 2000,
        });
        
        // 타이머 시작
        const interval = setInterval(() => {
          setOtpTimer((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              setIsOtpSent(false);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        toast.error(response.message || "인증번호 발송에 실패했습니다.", {
          toastId: "otp-send-fail",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("인증번호 발송 오류:", error);
      
      // 409 에러 처리 (이메일 중복)
      if (error instanceof Error && error.message.includes("409")) {
        toast.error("이미 사용 중인 이메일입니다.", {
          toastId: "email-duplicate-error",
          autoClose: 2000,
        });
      } else {
        toast.error("인증번호 발송 중 오류가 발생했습니다.", {
          toastId: "otp-send-error",
          autoClose: 3000,
        });
      }
    } finally {
      setIsSendingOtp(false);
    }
  };

  // 인증번호 확인
  const handleVerifyOtp = async () => {
    if (!otpCode.trim()) {
      toast.error("인증번호를 입력해주세요.", {
        toastId: "otp-code-error",
        autoClose: 2000,
      });
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const response = await verifyEmailOtp({
        userId: signup.userId,
        otp: otpCode,
      });

      if (response.isSuccess) {
        setIsEmailVerified(true);
        setOtpTimer(0);
        toast.success("이메일 인증이 완료되었습니다.", {
          toastId: "otp-verify-success",
          autoClose: 2000,
        });
      } else {
        toast.error(response.message || "인증번호가 올바르지 않습니다.", {
          toastId: "otp-verify-fail",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("인증번호 확인 오류:", error);
      toast.error("인증번호 확인 중 오류가 발생했습니다.", {
        toastId: "otp-verify-error",
        autoClose: 3000,
      });
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // 타이머 포매팅
  const formatTimer = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };
  const handleSignUp = async () => {
    if (!signup?.name.trim()) {
      toast.error("이름을 입력해주세요.", {
        toastId: "signup-name-error",
        autoClose: 2000,
      });
      return;
    }

    if (!signup?.nickname.trim()) {
      toast.error("닉네임을 입력해주세요.", {
        toastId: "signup-nickname-error",
        autoClose: 2000,
      });
      return;
    }

    if (!signup?.userId.trim()) {
      toast.error("아이디를 입력해주세요.", {
        toastId: "signup-userid-error",
        autoClose: 2000,
      });
      return;
    }

    if (!signup?.password.trim()) {
      toast.error("비밀번호를 입력해주세요.", {
        toastId: "signup-password-error",
        autoClose: 2000,
      });
      return;
    }

    if (signup?.password !== passwordConfirm) {
      toast.error("비밀번호가 일치하지 않습니다.", {
        toastId: "signup-password-mismatch",
        autoClose: 2000,
      });
      return;
    }

    if (!signup?.email.trim()) {
      toast.error("이메일을 입력해주세요.", {
        toastId: "signup-email-error",
        autoClose: 2000,
      });
      return;
    }
    if (!isEmailVerified) {
      toast.info("이메일 인증을 완료해주세요.", {
        toastId: "signup-email-verification",
        autoClose: 2000,
      });
      return;
    }

    if (!isDuplicateChecked) {
      toast.info("아이디 중복검사를 해주세요.", {
        toastId: "signup-duplicate-check",
        autoClose: 2000,
      });
      return;
    }

    setIsSigningUp(true);

    try {
      const signUpData: SignUpRequest = {
        name: signup.name.trim(),
        nickname: signup.nickname.trim(),
        userId: signup.userId.trim(),
        password: signup.password.trim(),
        email: signup.email.trim(),
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
      const errorMessage =
        error instanceof Error
          ? error.message
          : "회원가입 중 오류가 발생했습니다.";
      toast.error(errorMessage, { toastId: "signup-error", autoClose: 3000 });
    } finally {
      setIsSigningUp(false);
    }
    console.log("회원가입:" + isDuplicateChecked);
  };

  return (
    <div className="card-position">
      <div className="card-logo">SelLog</div>
      <div className="card">
        <input
          name="name"
          className="auth-input"
          type="text"
          placeholder="이름"
          value={signup?.name}
          onChange={handleChange}
          onKeyPress={(e) => e.key === "Enter" && handleSignUp()}
        />
        <input
          name="nickname"
          className="auth-input"
          type="text"
          placeholder="닉네임"
          value={signup?.nickname}
          onChange={handleChange}
          onKeyPress={(e) => e.key === "Enter" && handleSignUp()}
        />
        <div className="relative w-full">
          <input
            name="userId"
            className="auth-input w-full"
            type="text"
            placeholder="아이디"
            value={signup?.userId}
            onChange={handleChange}
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
            name="password"
            className="auth-input"
            type={showPassword ? "text" : "password"}
            placeholder="비밀번호"
            value={signup?.password}
            onChange={handleChange}
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
        <div className="relative">
          <input
            name="email"
            className="auth-input"
            type="email"
            placeholder="이메일"
            value={signup?.email}
            onChange={handleChange}
            onKeyPress={(e) => e.key === "Enter" && handleSendOtp()}
            disabled={isEmailVerified}
          />
          <button
            className="btn-duplicate-check"
            onClick={handleSendOtp}
            disabled={isSendingOtp || isEmailVerified || (isOtpSent && otpTimer > 0)}
            type="button"
          >
            {isSendingOtp ? "발송중..." : isEmailVerified ? "인증완료" : isOtpSent && otpTimer > 0 ? `재발송 (${formatTimer(otpTimer)})` : "인증"}
          </button>
        </div>
        
        {/* 인증번호 입력 및 확인 */}
        {isOtpSent && !isEmailVerified && (
          <div className="relative mb-4">
            <input
              className="auth-input"
              type="text"
              placeholder="인증번호 입력"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleVerifyOtp()}
              maxLength={6}
            />
            <button
              className="btn-duplicate-check"
              onClick={handleVerifyOtp}
              disabled={isVerifyingOtp}
              type="button"
            >
              {isVerifyingOtp ? "확인중..." : "인증확인"}
            </button>
            {otpTimer > 0 && (
              <div className="text-sm text-red-500 mt-1">
                남은 시간: {formatTimer(otpTimer)}
              </div>
            )}
          </div>
        )}
        
        {/* 이메일 인증 완료 표시 */}
        {isEmailVerified && (
          <div className="w-full mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
            ✓ 이메일 인증이 완료되었습니다.
          </div>
        )}
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
