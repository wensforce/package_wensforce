"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import DashboardHeader from "./components/DashboardHeader";
import PhoneSearchForm from "./components/PhoneSearchForm";
import BookingsList, { EmptyState } from "./components/BookingsList";
import SupportFooter from "./components/SupportFooter";

/** Normalise a phone string to the last 10 digits for comparison. */
function normalisePhone(raw = "") {
  return raw.replace(/\D/g, "").slice(-10);
}

export default function DashboardPage() {
  const [phone, setPhone] = useState("");
  const [allBookings, setAllBookings] = useState([]);
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /* Load persisted bookings from localStorage once on mount */
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("wens_bookings") ?? "[]");
      setAllBookings(Array.isArray(stored) ? stored : []);
    } catch {
      setAllBookings([]);
    }
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    const query = normalisePhone(phone);
    if (query.length < 6) return;

    setIsLoading(true);
    setSearched(true);

    /* Small artificial delay so the loader registers — avoids UI flash */
    setTimeout(() => {
      const matched = allBookings.filter((b) => {
        const stored = normalisePhone(b.customerPhone ?? b.customer_phone ?? "");
        return stored.endsWith(query) || query.endsWith(stored);
      });
      setResults(matched);
      setIsLoading(false);
    }, 500);
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0B1E3F" }}>
      {/* ── Background decorations ── */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(201,162,75,0.035) 1px, transparent 0)",
          backgroundSize: "44px 44px",
        }}
      />
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-96 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(201,162,75,0.09) 0%, transparent 70%)",
        }}
      />
      <div
        className="fixed bottom-0 right-0 w-80 h-80 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 100% 100%, rgba(201,162,75,0.04) 0%, transparent 60%)",
        }}
      />

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <DashboardHeader />

        <PhoneSearchForm
          phone={phone}
          onChange={setPhone}
          onSubmit={handleSearch}
          isLoading={isLoading}
        />

        {/* ── Results area ── */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ border: "1px solid rgba(201,162,75,0.2)" }}
            >
              <Loader2 size={20} className="animate-spin" style={{ color: "#C9A24B" }} />
            </div>
            <p className="text-white/25 text-sm">Looking up your bookings…</p>
          </div>
        ) : !searched ? (
          <EmptyState searched={false} />
        ) : results.length === 0 ? (
          <EmptyState searched={true} />
        ) : (
          <BookingsList bookings={results} />
        )}

        <SupportFooter />
      </div>
    </div>
  );
}

