// hooks/useInitAuth.js
"use client";
import { useEffect } from "react";
import { authApi } from "@/api/auth.api.js";
import { useAuthStore } from "@/store/auth.store.js";
import { tokenManager } from "@/lib/tokenManager.js";

export const useInitAuth = () => {
  const { setAuth, clearAuth, setInitialized, isInitialized } = useAuthStore();

  useEffect(() => {
    if (isInitialized) return; // already done (e.g. just logged in) — skip redundant call
    const restore = async () => {
      try {
        const { data } = await authApi.getProfile();

        tokenManager.set(data.accessToken);
        setAuth(data?.data);
      } catch {
        clearAuth();
      } finally {
        setInitialized();
      }
    };

    restore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
