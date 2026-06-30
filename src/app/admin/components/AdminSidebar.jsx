"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  CreditCard,
  Package,
  Wrench,
  Users,
  ChevronLeft,
  ChevronRight,
  LogOut,
  X,
  Hash,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { authApi } from "./auth.api";
const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
  { label: "Payments", href: "/admin/payments", icon: CreditCard },
  { label: "Packages", href: "/admin/packages", icon: Package },
  { label: "Services", href: "/admin/services", icon: Wrench },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Coupons", href: "/admin/coupons", icon: Hash },
  { label: "Subscriptions", href: "/admin/subscriptions", icon: CalendarCheck },
  { label: "Trips", href: "/admin/trips", icon: CalendarCheck },
];

function SidebarContent({ collapsed, setCollapsed, onClose, isMobile }) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    authApi.logout().finally(() => {
      logout();
      if (isMobile) onClose();
      router.push("/");
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center justify-between px-4 py-5 border-b border-[#1E3A6F]"
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
            <img src="/Logo.png" alt="Wens Logo" />
          </div>
          {(!collapsed || isMobile) && (
            <span className="text-white font-semibold text-sm tracking-wide whitespace-nowrap">
              Wens Admin
            </span>
          )}
        </div>
        {isMobile && (
          <button
            onClick={onClose}
            className="text-[#A0AEC0] hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </Link>

      {/* Nav Items */}
      <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
        <ul className="space-y-1 px-2">
          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive =
              pathname === href || pathname.startsWith(href + "/");
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={isMobile ? onClose : undefined}
                  title={collapsed && !isMobile ? label : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                    ${
                      isActive
                        ? "bg-[#C9A24B] text-[#0B1E3F]"
                        : "text-[#A0AEC0] hover:bg-[#1E3A6F] hover:text-white"
                    }`}
                >
                  <Icon size={18} className="flex-shrink-0" />
                  {(!collapsed || isMobile) && (
                    <span className="text-sm font-medium whitespace-nowrap">
                      {label}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="px-2 pb-2 border-t border-[#1E3A6F] pt-2">
        <button
          onClick={handleLogout}
          title={collapsed && !isMobile ? "Logout" : undefined}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#A0AEC0] hover:bg-red-900/30 hover:text-red-400 transition-all duration-200"
        >
          <LogOut size={18} className="flex-shrink-0" />
          {(!collapsed || isMobile) && (
            <span className="text-sm font-medium">Logout</span>
          )}
        </button>
      </div>

      {/* Collapse Button — desktop only */}
      {!isMobile && (
        <div className="px-2 pb-4">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#1E3A6F] text-[#C9A24B] hover:bg-[#C9A24B] hover:text-[#0B1E3F] transition-all duration-200"
          >
            {collapsed ? (
              <ChevronRight size={16} />
            ) : (
              <>
                <ChevronLeft size={16} />
                <span className="text-xs font-medium">Collapse</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default function AdminSidebar({ mobileOpen, onMobileClose }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0B1E3F] border-r border-[#1E3A6F] transform transition-transform duration-300 md:hidden
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <SidebarContent
          collapsed={false}
          setCollapsed={() => {}}
          onClose={onMobileClose}
          isMobile
        />
      </aside>

      {/* Desktop sidebar */}
      <aside
        style={{ width: collapsed ? 68 : 240 }}
        className="hidden md:flex flex-col h-screen bg-[#0B1E3F] border-r border-[#1E3A6F] transition-all duration-300 flex-shrink-0"
      >
        <SidebarContent
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          onClose={() => {}}
          isMobile={false}
        />
      </aside>
    </>
  );
}
