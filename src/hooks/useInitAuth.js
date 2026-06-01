// hooks/useAuth.js
"use client";
import { useEffect } from "react";
import { authApi } from "@/api/auth.api.js";
import { useAuthStore } from "@/store/auth.store.js";
import { tokenManager } from "@/lib/tokenManager.js";

export const useInitAuth = () => {
  const { setAuth, clearAuth, setInitialized } = useAuthStore();

  useEffect(() => {
    const restore = async () => {
      try {
        const { data } = await authApi.refresh();
        tokenManager.set(data.accessToken);
        setAuth(data.user);
      } catch {
        clearAuth();
      } finally {
        setInitialized();
      }
    };

    restore();
  }, []);
};