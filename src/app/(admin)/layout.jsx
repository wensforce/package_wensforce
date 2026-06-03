"use client";

import { useState } from "react";
import { Loader2, Menu, Bell } from "lucide-react";
import { useInitAuth } from "@/hooks/useInitAuth";
import { useRequireAdmin } from "@/hooks/useRequireAdmin";
import { useAuthStore } from "@/store/auth.store";
import AdminSidebar from "./components/AdminSidebar";

export default function AdminLayout({ children }) {
  useInitAuth();
  useRequireAdmin();

  const { isInitialized, isAuthenticated, user } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isReady = isInitialized && isAuthenticated && user?.role === "admin";

  if (!isReady) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#0B1E3F" }}
      >
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 30%, rgba(201,162,75,0.07) 0%, transparent 65%)",
          }}
        />
        <div className="relative flex flex-col items-center gap-5">
          <div
            className="w-14 h-14 rounded-full border flex items-center justify-center"
            style={{ borderColor: "rgba(201,162,75,0.2)" }}
          >
            <Loader2 size={22} className="animate-spin" style={{ color: "#C9A24B" }} />
          </div>
          <p
            className="text-[10px] font-bold tracking-[0.5em] uppercase"
            style={{ color: "rgba(201,162,75,0.5)" }}
          >
            Admin Portal
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#0B1E3F" }}>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: "rgba(0,0,0,0.65)" }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
      />

      {/* Content column */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        {/* Top bar */}
        <header
          className="sticky top-0 z-30 flex items-center h-14 px-5 gap-3 border-b"
          style={{
            backgroundColor: "rgba(11,30,63,0.97)",
            borderColor: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Mobile hamburger */}
          <button
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={15} style={{ color: "rgba(255,255,255,0.5)" }} />
          </button>

          <div className="flex-1" />

          {/* Bell */}
          <button
            className="w-9 h-9 flex items-center justify-center rounded-xl"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <Bell size={14} style={{ color: "rgba(255,255,255,0.4)" }} />
          </button>

          {/* User chip */}
          <div
            className="flex items-center gap-2.5 pl-3 border-l"
            style={{ borderColor: "rgba(255,255,255,0.07)" }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
              style={{
                background: "rgba(201,162,75,0.18)",
                color: "#C9A24B",
                border: "1px solid rgba(201,162,75,0.28)",
              }}
            >
              {user?.name?.charAt(0)?.toUpperCase() ?? "A"}
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-semibold text-white/70 leading-none">
                {user?.name ?? "Admin"}
              </p>
              <p
                className="text-[9px] tracking-[0.35em] uppercase font-bold mt-0.5"
                style={{ color: "#C9A24B" }}
              >
                Administrator
              </p>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-5 sm:p-7 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
