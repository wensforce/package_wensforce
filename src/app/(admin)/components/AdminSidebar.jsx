"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  MapPin,
  Package,
  Wrench,
  Wallet,
  LogOut,
  ArrowLeft,
  ShieldCheck,
  X,
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useAuth } from "@/app/auth/hooks/useAuth";

const NAV_GROUPS = [
  {
    label: "Main",
    items: [
      { href: "/admin",               label: "Dashboard",     icon: LayoutDashboard },
      { href: "/admin/users",         label: "All Users",     icon: Users           },
      { href: "/admin/subscriptions", label: "Subscriptions", icon: CreditCard      },
      { href: "/admin/trips",         label: "All Trips",     icon: MapPin          },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/packages", label: "Packages", icon: Package },
      { href: "/admin/services", label: "Services", icon: Wrench  },
    ],
  },
  {
    label: "Finance",
    items: [
      { href: "/admin/payments", label: "Payments", icon: Wallet },
    ],
  },
];

export default function AdminSidebar({ open, onClose, user }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  async function handleLogout() {
    await logout();
  }

  function isActive(href) {
    return href === "/admin"
      ? pathname === "/admin"
      : pathname.startsWith(href);
  }

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col transition-transform duration-300 ease-in-out ${
        open ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}
      style={{
        backgroundColor: "var(--adm-sidebar-bg)",
        borderRight: "1px solid var(--adm-sidebar-border)",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center justify-between h-14 px-5 shrink-0 border-b"
        style={{ borderColor: "var(--adm-sidebar-border)" }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{
              background: "rgba(201,162,75,0.14)",
              border: "1px solid var(--adm-gold-border)",
            }}
          >
            <ShieldCheck size={15} style={{ color: "#C9A24B" }} />
          </div>
          <div>
            <p className="text-xs font-bold leading-none" style={{ color: "rgba(255,255,255,0.82)" }}>WENS Force</p>
            <p
              className="text-[9px] font-bold tracking-[0.38em] uppercase mt-0.5"
              style={{ color: "#C9A24B" }}
            >
              Admin
            </p>
          </div>
        </div>

        {/* Mobile close */}
        <button
          className="lg:hidden w-7 h-7 flex items-center justify-center rounded-lg"
            style={{ background: "rgba(255,255,255,0.07)" }}
          onClick={onClose}
        >
          <X size={13} style={{ color: "rgba(255,255,255,0.4)" }} />
        </button>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {NAV_GROUPS.map(({ label, items }) => (
          <div key={label}>
            <p
              className="text-[9px] font-bold tracking-[0.42em] uppercase px-3 mb-1.5"
              style={{ color: "var(--adm-sidebar-text)" }}
            >
              {label}
            </p>
            <div className="space-y-0.5">
              {items.map(({ href, label: itemLabel, icon: Icon }) => {
                const active = isActive(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={onClose}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
                    style={
                      active
                        ? {
                            background: "var(--adm-sidebar-active-bg)",
                            color: "var(--adm-sidebar-active-text)",
                            border: "1px solid var(--adm-sidebar-active-border)",
                          }
                        : {
                            color: "var(--adm-sidebar-text)",
                            border: "1px solid transparent",
                          }
                    }
                  >
                    <Icon size={15} className="shrink-0" />
                    {itemLabel}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Divider */}
      <div
        className="mx-4 h-px"
        style={{ background: "rgba(255,255,255,0.05)" }}
      />

      {/* Footer actions */}
      <div className="shrink-0 p-3 space-y-0.5">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150"
          style={{ color: "rgba(255,255,255,0.32)", border: "1px solid transparent" }}
        >
          <ArrowLeft size={15} className="shrink-0" />
          Member Portal
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 hover:bg-red-500/5"
          style={{ color: "rgba(239,68,68,0.55)", border: "1px solid transparent" }}
        >
          <LogOut size={15} className="shrink-0" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
