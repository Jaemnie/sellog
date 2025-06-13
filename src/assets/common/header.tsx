import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = "My App" }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const home = () => {
    navigate("/home");
  };
  const friendList = () => {
    navigate("/friendList");
  };
  const chatClick = () => {
    navigate("/chatList");
  };
  const login = () => {
    navigate("/login");
  };
  const headerStyles = {
    backgroundColor: "var(--color-background)",
    borderBottom: "1px solid var(--color-border)",
  };

  const titleStyles = {
    color: "var(--color-text-primary)",
  };

  const linkStyles = {
    color: "var(--color-text-secondary)",
  };

  const mobileMenuStyles = {
    backgroundColor: "var(--color-background)",
    borderTop: "1px solid var(--color-border)",
  };
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 shadow-md"
      style={headerStyles}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* SL 로고 */}
          <div onClick={home} className="flex-shrink-0 ">
            <h1
              className="text-xl sm:text-2xl font-bold"
              style={{ color: "var(--color-primary)" }}
            >
              SL
            </h1>
          </div>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden md:flex items-center space-x-4">
            <button
              onClick={friendList}
              className="px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300 hover:text-primary"
              style={linkStyles}
            >
              친구 찾기
            </button>
            <button
              onClick={chatClick}
              className="px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300 hover:text-primary"
              style={linkStyles}
            >
              채팅
            </button>
            <button onClick={login} className="btn btn-primary text-sm">
              로그인
            </button>
          </nav>

          {/* 모바일 메뉴 버튼 */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md transition-colors duration-300 focus:outline-none hover:text-primary hover:bg-secondary"
              style={linkStyles}
            >
              <span className="sr-only">메뉴 열기</span>
              {!isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {isMenuOpen && (
        <div className="md:hidden animate-fade-in">
          <div
            className="px-2 pt-2 pb-3 space-y-1 sm:px-3"
            style={mobileMenuStyles}
          >
            <button
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 hover:text-primary hover:bg-secondary"
              style={linkStyles}
            >
              친구 찾기
            </button>
            <button
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 hover:text-primary hover:bg-secondary"
              style={linkStyles}
            >
              채팅
            </button>
            <button className="btn btn-primary w-full mt-2">로그인</button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
