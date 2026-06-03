"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

export const useRequireAdmin = () => {
  const router = useRouter();
  const { isAuthenticated, isInitialized, user } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) return;
    console.log("Auth state:", { isAuthenticated, user });
    if (!isAuthenticated || user?.role !== "admin") {
      router.replace("/auth");
    }
  }, [isAuthenticated, isInitialized, user, router]);
};
