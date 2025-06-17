import React, { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  autoClose?: number;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}

const [showToast, setShowToast] = useState(false);

const notifyId = () => {
  // 로그인 로직 실행
  // 로그인 성공 시 Toast 보여주기
  setShowToast(true);
};

const positionClasses = {
  "top-right": "fixed top-4 right-4",
  "top-left": "top-4 left-4",
  "bottom-right": "fixed bottom-4 right-4",
  "bottom-left": "bottom-4 left-4",
};

const Toast: React.FC<ToastProps> = ({
  message,
  autoClose = 3000,
  position = "top-right",
}) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), autoClose);
    return () => clearTimeout(timer);
  }, [autoClose]);

  if (!show) return null;

  return (
    <div
      className={`fixed ${positionClasses[position]} bg-black text-white px-4 py-2 rounded shadow-lg`}
    >
      {message}
    </div>
  );
};

export default Toast;
