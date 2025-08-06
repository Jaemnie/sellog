import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

import Navigation from "./navigation";
interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoggedin, logout } = useAuth();

  const [navBar, setNavBar] = useState(false);

  const handleMyPage = async () => {
    // await logout();
    navigate("/profile");
  };

  const headerStyles = {
    backgroundColor: "var(--color-background)",
    borderBottom: "1px solid var(--color-border)",
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
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <button className="text-2xl" onClick={() => setNavBar(!navBar)}>
            <FontAwesomeIcon icon={faBars} />
          </button>
          <div
            onClick={() => navigate("/home")}
            className="flex-shrink-0 cursor-pointer"
          >
            <h1
              className="text-xl sm:text-2xl font-bold absolute top-4 left-20"
              style={{ color: "var(--color-primary)" }}
            >
              SL
            </h1>
          </div>

          <nav className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => navigate("/friendList")}
              className="px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300 hover:text-primary"
              style={linkStyles}
            >
              친구 찾기
            </button>
            <button
              onClick={() => navigate("/chatList")}
              className="px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300 hover:text-primary"
              style={linkStyles}
            >
              채팅
            </button>
            <button
              onClick={isLoggedin ? handleMyPage : () => navigate("/profile")}
              className="btn btn-primary text-sm"
            >
              {isLoggedin ? "내 프로필" : "로그인"}
            </button>
          </nav>

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

      {isMenuOpen && (
        <div className="md:hidden animate-fade-in">
          <div
            className="px-2 pt-2 pb-3 space-y-1 sm:px-3"
            style={mobileMenuStyles}
          >
            <button
              onClick={() => navigate("/friendList")}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 hover:text-primary hover:bg-secondary"
              style={linkStyles}
            >
              친구 찾기
            </button>
            <button
              onClick={() => navigate("/chatList")}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 hover:text-primary hover:bg-secondary"
              style={linkStyles}
            >
              채팅
            </button>
            <button
              onClick={isLoggedin ? handleMyPage : () => navigate("/profile")}
              className="btn btn-primary w-full mt-2"
            >
              {isLoggedin ? "내 프로필" : "로그인"}
            </button>
          </div>
        </div>
      )}
      {navBar && <Navigation />}
    </header>
  );
};

export default Header;
