import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

export const useRequireAuth = () => {
  const router = useRouter();
  const { isAuthenticated, isInitialized } = useAuthStore();

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.replace("/auth");
    }
  }, [isAuthenticated, isInitialized, router]);
};
