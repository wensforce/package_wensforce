"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import api, { getAccessToken, setTokens, clearTokens } from "../axios/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // TODO: After backend deploye ────────────────────────────────
  // useEffect(() => {
  //   api
  //     .get("/auth/me")
  //     .then(({ data }) => {
  //       if (data?.data) {
  //         setUser(data.data);
  //         setIsLoggedIn(true);
  //       }
  //     })
  //     .catch(() => {
  //       // Not logged in — leave state as default
  //     })
  //     .finally(() => {
  //       setAuthLoading(false);
  //     });
  // }, []);

  // ── Login: store tokens + set user ───────────────────────────────────────
  const login = useCallback((accessToken, userData = {}) => {
    setTokens(accessToken);
    setUser(userData);
    setIsLoggedIn(true);
  }, []);

  // ── Logout: clear tokens + reset state ───────────────────────────────────
  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
    setIsLoggedIn(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, user, login, logout, setUser, setIsLoggedIn, authLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
