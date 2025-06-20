/* 로그인 상태 저장소*/
import type { ReactNode } from "react";
import React, { createContext, useContext, useState } from "react";

/* createContext 타입 명시해야함 */
export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthContextType {
  isLoggedin: boolean;
  logIn: () => void;
  logOut: () => void;
}
export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedin, setLoggedIn] = useState(false);
  const logIn = () => setLoggedIn(true);
  const logOut = () => setLoggedIn(false);

  return (
    <AuthContext.Provider value={{ isLoggedin, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}
