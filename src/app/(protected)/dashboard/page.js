"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LogOut,
  ShoppingBag,
  Navigation,
  Package,
  CreditCard,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../axios/axios";

import ActivePackages from "./dashboard-components/ActivePackages";
import TripHistory from "./dashboard-components/TripHistory";
import PackageHistory from "./dashboard-components/PackageHistory";
import PaymentHistory from "./dashboard-components/PaymentHistory";
// ── Tab config ────────────────────────────────────────────────────────────────
const TABS = [
  { id: "active",   label: "Active Packages",  icon: <ShoppingBag size={14} /> },
  { id: "trips",    label: "Trip History",      icon: <Navigation  size={14} /> },
  { id: "packages", label: "Package History",   icon: <Package     size={14} /> },
  { id: "payments", label: "Payment History",   icon: <CreditCard  size={14} /> },
];

// ── Page ──────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("active");

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      logout();
      router.push("/");
    }
  };

  return (
    <>
      {/* ── Gold scrollbar — scoped to tab nav + trip table ── */}
      <style>{`
        .wf-hscroll {
          overflow-x: auto;
          scrollbar-width: thin;
          scrollbar-color: #c9a24b transparent;
        }
        .wf-hscroll::-webkit-scrollbar {
          height: 3px;
        }
        .wf-hscroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .wf-hscroll::-webkit-scrollbar-thumb {
          background: #c9a24b;
          border-radius: 9999px;
        }
      `}</style>

      <div className="min-h-screen" style={{ background: "var(--color-cream)" }}>

        {/* ── Sticky header ── */}
        <header
          className="sticky top-0 z-40 border-b backdrop-blur-sm"
          style={{
            background: "rgba(250,246,236,0.92)",
            borderColor: "var(--color-border)",
          }}
        >
          <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-7 h-7 flex-shrink-0">
                <img
                  src="/Logo.png"
                  alt="WENS Force"
                  className="w-full h-full object-contain"
                />
              </div>
              <span
                className="text-base font-semibold"
                style={{
                  color: "var(--color-navy)",
                  fontFamily: "var(--font-playfair)",
                }}
              >
                WENS Force
              </span>
            </Link>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex cursor-pointer items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all hover:opacity-70"
              style={{
                color: "var(--color-text-secondary)",
                border: "1px solid var(--color-border)",
                background: "var(--color-white)",
              }}
            >
              <LogOut size={12} />
              Sign out
            </button>
          </div>
        </header>

        {/* ── Main ── */}
        <main className="max-w-5xl mx-auto px-5 py-8 space-y-6">

          {/* Greeting */}
          <div className="space-y-0.5">
            <p className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>
              Welcome back
            </p>
            <h1
              className="text-3xl font-bold"
              style={{
                color: "var(--color-navy)",
                fontFamily: "var(--font-playfair)",
              }}
            >
              {user?.name ?? user?.phone ?? "Member"}
            </h1>
            {user?.phone && user?.name && (
              <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                {user.phone}
              </p>
            )}
          </div>

          {/* ── Tab nav — always-visible gold scrollbar ── */}
          <div
            className="wf-hscroll flex items-center gap-1 p-1 rounded-2xl"
            style={{
              background: "var(--color-white)",
              border: "1px solid var(--color-border)",
              paddingBottom: "6px", /* breathing room for the scrollbar */
            }}
          >
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex cursor-pointer  items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0"
                style={
                  activeTab === tab.id
                    ? { background: "var(--color-navy)", color: "var(--color-white)" }
                    : { color: "var(--color-text-secondary)" }
                }
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── Tab content ── */}
          {activeTab === "active"   && <ActivePackages />}
          {activeTab === "trips"    && <TripHistory />}
        {activeTab === "packages" && <PackageHistory />} 
          {activeTab === "payments" && <PaymentHistory />} 

        </main>
      </div>
    </>
  );
}