"use client";

import { useState, useEffect } from "react";
import { Loader2, CreditCard } from "lucide-react";
import PhoneSearchForm from "../PhoneSearchForm";
import BookingsList, { EmptyState } from "../BookingsList";

function normalisePhone(raw = "") {
  return raw.replace(/\D/g, "").slice(-10);
}

export default function SubscriptionsTab() {
  const [phone, setPhone] = useState("");
  const [allBookings, setAllBookings] = useState([]);
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    <div>
      {/* Section header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: "rgba(201,162,75,0.12)",
              border: "1px solid rgba(201,162,75,0.22)",
            }}
          >
            <CreditCard size={16} style={{ color: "#C9A24B" }} />
          </div>
          <div>
            <p
              className="text-[10px] font-bold tracking-[0.45em] uppercase"
              style={{ color: "#C9A24B" }}
            >
              Membership Plans
            </p>
            <h2
              className="text-2xl font-bold text-white"
              style={{ fontFamily: "var(--font-playfair, serif)" }}
            >
              My Subscriptions
            </h2>
          </div>
        </div>
        <p className="text-white/35 text-sm leading-relaxed max-w-lg">
          Enter your registered phone number to view your active membership
          plans, trip allocations, and order details.
        </p>
      </div>

      {/* Search */}
      <PhoneSearchForm
        phone={phone}
        onChange={setPhone}
        onSubmit={handleSearch}
        isLoading={isLoading}
      />

      {/* Results */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ border: "1px solid rgba(201,162,75,0.2)" }}
          >
            <Loader2
              size={20}
              className="animate-spin"
              style={{ color: "#C9A24B" }}
            />
          </div>
          <p className="text-white/25 text-sm">Looking up your subscriptions…</p>
        </div>
      ) : !searched ? (
        <EmptyState searched={false} />
      ) : results.length === 0 ? (
        <EmptyState searched={true} />
      ) : (
        <BookingsList bookings={results} />
      )}
    </div>
  );
}
