"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  LayoutDashboard,
  CreditCard,
  MapPin,
  PlusCircle,
  History,
  Star,
  Bell,
} from "lucide-react";
import OverviewTab from "./components/tabs/OverviewTab";
import SubscriptionsTab from "./components/tabs/SubscriptionsTab";
import TripsTab from "./components/tabs/TripsTab";
import RequestTripTab from "./components/tabs/RequestTripTab";
import TripHistoryTab from "./components/tabs/TripHistoryTab";
import BenefitsTab from "./components/tabs/BenefitsTab";

const TABS = [
  { id: "overview",       label: "Overview",      icon: LayoutDashboard },
  { id: "subscriptions",  label: "Subscriptions", icon: CreditCard       },
  { id: "trips",          label: "My Trips",      icon: MapPin           },
  { id: "request",        label: "Request Trip",  icon: PlusCircle       },
  { id: "history",        label: "Trip History",  icon: History          },
  { id: "benefits",       label: "Benefits",      icon: Star             },
];

const TAB_MAP = {
  overview:      OverviewTab,
  subscriptions: SubscriptionsTab,
  trips:         TripsTab,
  request:       RequestTripTab,
  history:       TripHistoryTab,
  benefits:      BenefitsTab,
};

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const ActiveComponent = TAB_MAP[activeTab];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0B1E3F" }}>
      {/* ── Background decorations ── */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(201,162,75,0.03) 1px, transparent 0)",
          backgroundSize: "44px 44px",
        }}
      />
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-125 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(201,162,75,0.08) 0%, transparent 65%)",
        }}
      />
      <div
        className="fixed bottom-0 right-0 w-96 h-96 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 100% 100%, rgba(201,162,75,0.04) 0%, transparent 60%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        {/* ── Top bar ── */}
        <div
          className="flex items-center justify-between py-5 border-b"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/30 hover:text-white/60 text-xs font-medium tracking-wide transition-colors group"
          >
            <ArrowLeft
              size={13}
              className="transition-transform group-hover:-translate-x-0.5"
            />
            Home
          </Link>

          <div className="flex items-center gap-2">
            <p
              className="text-[10px] font-bold tracking-[0.4em] uppercase"
              style={{ color: "#C9A24B" }}
            >
              WENS Force
            </p>
            <span className="text-white/15 text-xs">·</span>
            <p className="text-[10px] text-white/30 tracking-widest uppercase">
              Member Portal
            </p>
          </div>

          <button
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-white/5"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <Bell size={14} style={{ color: "rgba(255,255,255,0.35)" }} />
          </button>
        </div>

        {/* ── Greeting ── */}
        <div className="py-8 sm:py-10">
          <p
            className="text-[10px] font-bold tracking-[0.5em] uppercase mb-2"
            style={{ color: "#C9A24B" }}
          >
            Good day, Member
          </p>
          <h1
            className="text-3xl sm:text-4xl font-bold text-white"
            style={{ fontFamily: "var(--font-playfair, serif)" }}
          >
            Your Dashboard
          </h1>
        </div>

        {/* ── Tab Navigation ── */}
        <div className="mb-8">
          <div
            className="flex gap-1.5 overflow-x-auto pb-0.5"
            style={{ scrollbarWidth: "none" }}
          >
            {TABS.map(({ id, label, icon: Icon }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide whitespace-nowrap transition-all duration-200 shrink-0"
                  style={
                    isActive
                      ? {
                          background: "rgba(201,162,75,0.14)",
                          border: "1px solid rgba(201,162,75,0.32)",
                          color: "#C9A24B",
                        }
                      : {
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(255,255,255,0.07)",
                          color: "rgba(255,255,255,0.38)",
                        }
                  }
                >
                  <Icon size={13} />
                  {label}
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <div
            className="mt-4 h-px w-full"
            style={{
              background:
                "linear-gradient(90deg, rgba(201,162,75,0.28) 0%, rgba(201,162,75,0.05) 55%, transparent 100%)",
            }}
          />
        </div>

        {/* ── Tab Content ── */}
        <div className="pb-20">
          <ActiveComponent onNavigate={setActiveTab} />
        </div>
      </div>
    </div>
  );
}

