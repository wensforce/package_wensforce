"use client";

import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import LoginModal from "../components/LoginModal";
import { useRouter } from "next/navigation";
import AdminSidebar from "./components/AdminSidebar";
import { Menu } from "lucide-react";
import { useModal } from "./hooks/useModal";
export default function AdminLayout({ children }) {
  const { isLoggedIn, authLoading, user } = useAuth();
  const loginModal = useModal();
  const mobileSidebar = useModal();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    if (!isLoggedIn) loginModal.open();
  }, [authLoading, isLoggedIn]);

  useEffect(() => {
    if (!authLoading && isLoggedIn && user?.role !== "admin") {
      router.push("/dashboard");
    }
  }, [authLoading, isLoggedIn, user, router]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#FAF6EC]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#C9A24B]"></div>
      </div>
    );
  }

  if (isLoggedIn && user?.role !== "admin") {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#FAF6EC]">
      <AdminSidebar
        mobileOpen={mobileSidebar.isOpen}
        onMobileClose={() => mobileSidebar.close()}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile top bar */}
        <header className="md:hidden flex items-center gap-3 px-4 py-3 bg-[#0B1E3F] border-b border-[#1E3A6F]">
          <button
            onClick={() => mobileSidebar.open()}
            className="text-[#C9A24B] hover:text-white transition-colors"
          >
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#C9A24B] flex items-center justify-center">
              <span className="text-[#0B1E3F] font-bold text-xs">W</span>
            </div>
            <span className="text-white font-semibold text-sm">Wens Admin</span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
      {loginModal.isOpen && <LoginModal onSuccess={() => loginModal.close()} />}
    </div>
  );
}