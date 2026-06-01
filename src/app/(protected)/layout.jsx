"use client";

import { useInitAuth } from "@/hooks/useInitAuth";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useAuthStore } from "@/store/auth.store";
import { Loader2 } from "lucide-react";

export default function ProtectedLayout({ children }) {
  useInitAuth();
  useRequireAuth(); // redirects to /login if not authenticated
  const isInitialized = useAuthStore((s) => s.isInitialized && s.isAuthenticated);

  // Block render until the token-refresh check completes — prevents content flash
  if (!isInitialized) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#0B1E3F" }}
      >
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 30%, rgba(201,162,75,0.08) 0%, transparent 65%)",
          }}
        />
        <div className="relative flex flex-col items-center gap-5">
          <div
            className="w-14 h-14 rounded-full border flex items-center justify-center"
            style={{ borderColor: "rgba(201,162,75,0.2)" }}
          >
            <Loader2
              size={22}
              className="animate-spin"
              style={{ color: "#C9A24B" }}
            />
          </div>
          <p
            className="text-[10px] font-bold tracking-[0.5em] uppercase"
            style={{ color: "rgba(201,162,75,0.5)" }}
          >
            WENS Force
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
