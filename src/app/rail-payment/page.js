"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { load } from "@cashfreepayments/cashfree-js";
import {
  ArrowLeft,
  Shield,
  IndianRupee,
  Percent,
  Calculator,
  Minus,
  Plus,
  Lock,
  AlertCircle,
} from "lucide-react";

const INR = (n) =>
  n !== "" && !isNaN(Number(n))
    ? "₹" + Number(n).toLocaleString("en-IN", { maximumFractionDigits: 2 })
    : "—";

/* ── Mode Toggle (minimal) ───────────────────────────────────────── */
function ModeToggle({ mode, onChange }) {
  return (
    <div className="flex gap-5 border-b" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
      {["percentage", "amount"].map((m) => {
        const active = mode === m;
        return (
          <button
            key={m}
            onClick={() => onChange(m)}
            className="relative flex items-center gap-1.5 pb-2.5 text-xs font-semibold tracking-wide uppercase transition-colors cursor-pointer"
            style={{ color: active ? "#0B1E3F" : "rgba(0,0,0,0.35)" }}
          >
            {m === "percentage" ? (
              <Percent size={12} strokeWidth={2} />
            ) : (
              <>
                Or <IndianRupee size={12} strokeWidth={2} />
              </>
            )}
            {m === "percentage" ? "Percentage" : "Fixed Amount"}
            {active && (
              <span
                className="absolute left-0 right-0 -bottom-px h-[2px] rounded-full"
                style={{ background: "#C9A24B" }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ── Percentage Stepper (minimal) ────────────────────────────────── */
function PercentageStepper({ value, onChange }) {
  const decrement = () => onChange(Math.max(10, value - 1));
  const increment = () => onChange(Math.min(100, value + 1));

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <button
          onClick={decrement}
          disabled={value <= 10}
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
          style={{
            border: "1px solid rgba(0,0,0,0.15)",
            color: value <= 10 ? "rgba(0,0,0,0.2)" : "#0B1E3F",
            cursor: value <= 10 ? "not-allowed" : "pointer",
          }}
        >
          <Minus size={13} strokeWidth={2} />
        </button>

        <div className="flex-1 flex items-baseline justify-center gap-1">
          <input
            type="number"
            min={10}
            max={100}
            value={value}
            onChange={(e) => {
              const n = parseFloat(e.target.value);
              if (!isNaN(n)) onChange(Math.min(100, Math.max(10, Math.round(n))));
            }}
            className="w-14 bg-transparent text-center text-xl font-bold text-[#0B1E3F] outline-none tabular-nums"
          />
          <span className="text-sm text-gray-400 font-medium">%</span>
        </div>

        <button
          onClick={increment}
          disabled={value >= 100}
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
          style={{
            border: "1px solid rgba(0,0,0,0.15)",
            color: value >= 100 ? "rgba(0,0,0,0.2)" : "#0B1E3F",
            cursor: value >= 100 ? "not-allowed" : "pointer",
          }}
        >
          <Plus size={13} strokeWidth={2} />
        </button>
      </div>

      <input
        type="range"
        min={10}
        max={100}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-1 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, #C9A24B ${((value - 10) / 90) * 100}%, rgba(0,0,0,0.08) ${((value - 10) / 90) * 100}%)`,
          accentColor: "#C9A24B",
        }}
      />

      {value === 10 && (
        <p className="text-[10px] text-gray-400 flex items-center gap-1">
          <Shield size={10} />
          Minimum advance is 10%
        </p>
      )}
    </div>
  );
}

/* ── Amount Input (minimal) ──────────────────────────────────────── */
function AmountInput({ value, minAmount, maxAmount, onChange }) {
  const isBelow = value < minAmount;
  const isAbove = value > maxAmount;
  const hasError = isBelow || isAbove;

  const handleChange = (e) => {
    const raw = e.target.value.replace(/[^0-9.]/g, "");
    const n = parseFloat(raw);
    if (raw === "" || raw === ".") {
      onChange(0);
    } else if (!isNaN(n)) {
      onChange(n);
    }
  };

  return (
    <div className="flex flex-col gap-2.5">
      <div
        className="flex items-center gap-2 border-b py-1.5"
        style={{ borderColor: hasError ? "rgba(239,68,68,0.5)" : "rgba(0,0,0,0.15)" }}
      >
        <span
          className="text-base font-bold flex-shrink-0"
          style={{ color: hasError ? "#ef4444" : "#0B1E3F" }}
        >
          ₹
        </span>
        <input
          type="number"
          min={minAmount}
          max={maxAmount}
          step={100}
          value={value === 0 ? "" : value}
          onChange={handleChange}
          placeholder={`Min ₹${minAmount.toLocaleString("en-IN")}`}
          className="flex-1 bg-transparent text-xl font-bold text-[#0B1E3F] outline-none tabular-nums placeholder:text-gray-300 placeholder:text-sm placeholder:font-normal"
        />
      </div>

      <div className="flex gap-2 flex-wrap">
        {[25, 50, 75, 100].map((pct) => {
          const chipAmt = parseFloat(((maxAmount * pct) / 100).toFixed(2));
          const isActive = Math.abs(value - chipAmt) < 1;
          return (
            <button
              key={pct}
              onClick={() => onChange(chipAmt)}
              className="px-2.5 py-1 rounded-md text-[10px] font-semibold tracking-wide transition-colors cursor-pointer"
              style={{
                border: `1px solid ${isActive ? "#C9A24B" : "rgba(0,0,0,0.12)"}`,
                color: isActive ? "#0B1E3F" : "rgba(0,0,0,0.4)",
                background: isActive ? "rgba(201,162,75,0.08)" : "transparent",
              }}
            >
              {pct}%
            </button>
          );
        })}
      </div>

      {isBelow && (
        <p className="text-[10px] text-red-500 flex items-center gap-1">
          <AlertCircle size={10} />
          Minimum advance is {INR(minAmount)} (10% of total)
        </p>
      )}
      {isAbove && (
        <p className="text-[10px] text-red-500 flex items-center gap-1">
          <AlertCircle size={10} />
          Amount cannot exceed total package value {INR(maxAmount)}
        </p>
      )}
    </div>
  );
}

/* ── Main Content ────────────────────────────────────────────────── */
function RailPaymentContent() {
  const searchParams = useSearchParams();

  const finalAmount = searchParams.get("finalAmount") || "5000";
  const customerPhone = searchParams.get("customerPhone") || "9999999999";
  const customerName = searchParams.get("customerName") || "John Doe";

  const parsedAmount = parseFloat(finalAmount) || 0;
  const minAmount = parseFloat(((parsedAmount * 10) / 100).toFixed(2));

  /* ── Mode state ── */
  const [mode, setMode] = useState("percentage"); // "percentage" | "amount"

  /* ── Percentage mode state ── */
  const [advPercentage, setAdvPercentage] = useState(
    Math.min(100, Math.max(10, parseFloat(searchParams.get("advPercentage") || "30")))
  );

  /* ── Amount mode state ── */
  const [advAmount, setAdvAmount] = useState(
    parseFloat(((parsedAmount * 30) / 100).toFixed(2))
  );

  /* ── Derived values ── */
  let payableAmount, derivedPercentage;

  if (mode === "percentage") {
    payableAmount = parsedAmount > 0
      ? parseFloat(((parsedAmount * advPercentage) / 100).toFixed(2))
      : 0;
    derivedPercentage = advPercentage;
  } else {
    payableAmount = advAmount;
    derivedPercentage = parsedAmount > 0
      ? parseFloat(((advAmount / parsedAmount) * 100).toFixed(1))
      : 0;
  }

  const remaining = parseFloat((parsedAmount - payableAmount).toFixed(2));
  const isAmountValid =
    mode === "percentage"
      ? advPercentage >= 10
      : advAmount >= minAmount && advAmount <= parsedAmount;

  /* ── Mode switch: carry value across ── */
  const handleModeChange = (newMode) => {
    if (newMode === "amount") {
      setAdvAmount(
        parseFloat(((parsedAmount * advPercentage) / 100).toFixed(2))
      );
    } else {
      const pct = parsedAmount > 0
        ? Math.min(100, Math.max(10, Math.round((advAmount / parsedAmount) * 100)))
        : 30;
      setAdvPercentage(pct);
    }
    setMode(newMode);
  };

  /* ── Payment ── */
  const [loading, setLoading] = useState(false);
  const [payError, setPayError] = useState("");

  const sanitisedPhone = customerPhone.replace(/\D/g, "").slice(-10);

  const handlePay = async () => {
    setPayError("");
    setLoading(true);

    try {
      if (!/^\d{10}$/.test(sanitisedPhone)) {
        throw new Error("Invalid phone number. Please contact support.");
      }
      if (!isAmountValid || payableAmount <= 0) {
        throw new Error("Invalid payment amount. Please adjust the advance.");
      }

      const res = await fetch("/api/cashfree/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: payableAmount,
          customerName: customerName.trim(),
          customerPhone: sanitisedPhone,
          planName: "Rail Advance",
          currency: "INR",
          paymentType: "advance",
          totalAmount: parsedAmount,
          advPercentage: derivedPercentage,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const detail =
          data?.cashfreeError?.message ||
          data?.error ||
          "Could not create payment order. Please try again.";
        throw new Error(detail);
      }

      const sessionId = data.payment_session_id;
      if (!sessionId) throw new Error("Payment session unavailable. Please try again.");

      const cashfree = await load({
        mode:
          process.env.NEXT_PUBLIC_CASHFREE_ENV === "production"
            ? "production"
            : "sandbox",
      });

      cashfree.checkout({ paymentSessionId: sessionId, redirectTarget: "_self" });
    } catch (err) {
      setPayError(err.message || "Payment failed. Please try again.");
      setLoading(false);
    }
  };

  /* ── Render ── */
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAF6EC" }}>

      {/* ── Header ── */}
      <div
        className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-white border-b"
        style={{ borderColor: "rgba(201,162,75,0.14)" }}
      >
        <Link
          href="/"
          className="flex items-center gap-1.5 text-gray-400 hover:text-gray-700 text-xs transition-colors"
        >
          <ArrowLeft size={13} />
          <span className="hidden sm:inline">Back</span>
        </Link>

        <div className="flex items-center gap-2">
          <img src="/Logo.png" alt="WENS Force" className="w-7 h-7 object-contain" />
          <span className="text-[#C9A24B] font-bold text-[11px] sm:text-[13px] tracking-[0.28em] uppercase">
            WENS Force · Advance Payment
          </span>
        </div>

        <div className="flex items-center gap-1 text-[10px] text-gray-400">
          <Shield size={11} strokeWidth={1.5} style={{ color: "rgba(201,162,75,0.7)" }} />
          <span className="hidden sm:inline">Secure</span>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

        {/* ── Two-column layout ── */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* ── Left: Set Advance + Payment Breakdown (narrower) ── */}
          <div className="w-full lg:w-[38%] flex flex-col gap-4">

            {/* Set Advance Card */}
            <div
              className="bg-white rounded-2xl p-5 sm:p-6 flex flex-col gap-4"
              style={{
                boxShadow: "0 8px 40px rgba(11,30,63,0.08)",
                border: "1px solid rgba(201,162,75,0.1)",
              }}
            >
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold tracking-[0.35em] uppercase text-[#c9a24b]">
                  Enter Advance
                </p>
                {mode === "amount" && derivedPercentage > 0 && (
                  <span className="text-[10px] font-semibold text-gray-400">
                    ≈ {derivedPercentage}% of total
                  </span>
                )}
                {mode === "percentage" && payableAmount > 0 && (
                  <span className="text-[10px] font-semibold text-gray-400">
                    = {INR(payableAmount)}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold text-gray-400">
                  <span className="text-red-500">*Note:</span> Must enter advance amount as per instructed by Sales Executive.
                </p>

              </div>

              <ModeToggle mode={mode} onChange={handleModeChange} />

              {mode === "percentage" ? (
                <PercentageStepper value={advPercentage} onChange={setAdvPercentage} />
              ) : (
                <AmountInput
                  value={advAmount}
                  minAmount={minAmount}
                  maxAmount={parsedAmount}
                  onChange={setAdvAmount}
                />
              )}

              {/* Divider */}
              <div className="h-px mt-1" style={{ background: "rgba(201,162,75,0.12)" }} />

              {/* Total package value */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-gray-400">Total Package Value</span>
                <span className="text-sm font-bold text-[#0B1E3F] tabular-nums">
                  {parsedAmount > 0 ? INR(parsedAmount) : "—"}
                </span>
              </div>
            </div>

            {/* Payment Breakdown Card — moved to left column */}
            {payableAmount > 0 && isAmountValid && (
              <div
                className="rounded-2xl px-5 py-5 flex flex-col gap-2"
                style={{ background: "#0B1E3F" }}
              >
                <p className="text-[9px] font-bold tracking-[0.35em] uppercase text-[#C9A24B] mb-1">
                  Payment Breakdown
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(derivedPercentage, 100)}%`,
                        background: "linear-gradient(90deg,#C9A24B,#e0b85a)",
                      }}
                    />
                  </div>
                  <span className="text-[#C9A24B] text-xs font-bold flex-shrink-0">
                    {derivedPercentage}%
                  </span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-white/50">Advance: {INR(payableAmount)}</span>
                  <span className="text-white/50">Remaining: {INR(remaining)}</span>
                </div>
              </div>
            )}
          </div>

          {/* ── Right: Summary + Pay button (wider, polished) ── */}
          <div className="w-full lg:w-[62%] flex flex-col gap-4 lg:sticky lg:top-6">

            {/* Calculation Card */}
            <div
              className="bg-white rounded-2xl p-6 sm:p-8"
              style={{
                boxShadow: "0 12px 48px rgba(11,30,63,0.12)",
                border: "1.5px solid rgba(201,162,75,0.2)",
              }}
            >
              <div className="flex items-center gap-2.5 mb-6">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "#0B1E3F" }}
                >
                  <Calculator size={16} className="text-[#C9A24B]" strokeWidth={2} />
                </div>
                <p className="text-[10px] font-bold tracking-[0.35em] uppercase text-[#0B1E3F]">
                  Payment Summary
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {/* Booking details */}
                <div
                  className="flex flex-col gap-2.5 pb-4 border-b"
                  style={{ borderColor: "rgba(0,0,0,0.06)" }}
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] text-gray-400 tracking-wide uppercase font-semibold">
                      Customer
                    </span>
                    <span className="text-base font-bold text-[#0B1E3F]">
                      {customerName || "—"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] text-gray-400 tracking-wide uppercase font-semibold">
                      Phone
                    </span>
                    <span className="text-xs font-semibold text-gray-600">
                      {sanitisedPhone ? `+91 ${sanitisedPhone}` : "—"}
                    </span>
                  </div>
                </div>

                {/* Breakdown rows */}
                <div className="flex items-center justify-between py-0.5">
                  <span className="text-xs text-gray-400">Total Package Value</span>
                  <span className="text-sm font-bold text-gray-700 tabular-nums">
                    {parsedAmount > 0 ? INR(parsedAmount) : "—"}
                  </span>
                </div>

                <div className="flex items-center justify-between py-0.5">
                  <span className="text-xs text-gray-400">Advance Percentage</span>
                  <span
                    className="text-sm font-bold tabular-nums"
                    style={{ color: isAmountValid ? "#C9A24B" : "#ef4444" }}
                  >
                    {derivedPercentage > 0 ? `${derivedPercentage}%` : "—"}
                  </span>
                </div>

                {/* Payable now */}
                <div
  className="mt-2 rounded-2xl p-5 transition-all duration-300"
  style={{
    background: isAmountValid
      ? "linear-gradient(135deg, rgba(201,162,75,0.08), rgba(255,255,255,0.95))"
      : "rgba(239,68,68,0.05)",
    border: `1.5px solid ${
      isAmountValid ? "rgba(201,162,75,0.3)" : "rgba(239,68,68,0.25)"
    }`,
    boxShadow: isAmountValid
      ? "0 8px 24px rgba(201,162,75,0.08)"
      : "0 8px 20px rgba(239,68,68,0.06)",
  }}
>
  <div className="flex items-start justify-between">
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
        Advance Payable
      </p>

      {payableAmount > 0 && (
        <p className="mt-2 text-sm text-gray-500">
          {derivedPercentage}% of{" "}
          <span className="font-semibold text-gray-700">
            {INR(parsedAmount)}
          </span>
        </p>
      )}
    </div>

    <div className="text-right">
      <div
        className="text-4xl font-bold leading-none tabular-nums"
        style={{
          color: isAmountValid ? "#0B1E3F" : "#ef4444",
        }}
      >
        {payableAmount > 0 ? INR(payableAmount) : "—"}
      </div>

      <div className="mt-2 inline-flex rounded-full bg-white/70 px-3 py-1 text-[8px] font-semibold uppercase tracking-wide text-gray-500">
        Including Tax
      </div>
    </div>
  </div>
</div>

                {/* Remaining */}
                {remaining > 0 && isAmountValid && (
  <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-600">
        Remaining Balance
      </span>

      <span className="text-lg font-semibold text-gray-800 tabular-nums">
        {INR(remaining)}
      </span>
    </div>

    <p className="mt-2 text-xs text-blue-500">
      Low cost booking based on start range of estimation.
    </p>
  </div>
)}
              </div>
            </div>

            {/* Error message */}
            {payError && (
              <div
                className="flex items-start gap-2.5 rounded-xl px-4 py-3.5 text-xs text-red-700"
                style={{
                  background: "rgba(239,68,68,0.07)",
                  border: "1px solid rgba(239,68,68,0.25)",
                }}
              >
                <AlertCircle size={14} className="flex-shrink-0 mt-0.5 text-red-500" strokeWidth={1.8} />
                <span>{payError}</span>
              </div>
            )}

            {/* Pay button */}
            <button
              onClick={handlePay}
              disabled={loading || !isAmountValid || payableAmount <= 0}
              className="w-full py-4 rounded-xl font-bold text-sm tracking-wide transition-all hover:-translate-y-0.5 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              style={
                !loading && isAmountValid && payableAmount > 0
                  ? {
                    background: "linear-gradient(135deg,#C9A24B 0%,#e0b85a 100%)",
                    color: "#000",
                    boxShadow: "0 8px 24px rgba(201,162,75,0.35)",
                    cursor: "pointer",
                  }
                  : {
                    background: "rgba(0,0,0,0.06)",
                    color: "rgba(0,0,0,0.3)",
                  }
              }
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="rgba(0,0,0,0.2)" strokeWidth="3" />
                    <path d="M12 2a10 10 0 0110 10" stroke="#000" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Creating order…
                </span>
              ) : (
                <span className="flex flex-col items-center gap-0.5">
                  <span className="flex items-center gap-2 text-[15px]">
                    <Lock size={13} strokeWidth={2.5} />
                    Pay {payableAmount > 0 && isAmountValid ? INR(payableAmount) : "—"}
                  </span>
                  <span className="text-[10px] font-semibold opacity-60 tracking-widest uppercase">
                    Secure &amp; Encrypted Checkout
                  </span>
                </span>
              )}
            </button>

            {/* Security note */}
            <p className="text-center text-[10px] text-gray-400 flex items-center justify-center gap-1.5 font-light">
              <Shield size={10} strokeWidth={1.5} style={{ color: "rgba(201,162,75,0.7)" }} />
              256-bit SSL encrypted · Powered by Cashfree
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RailPaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF6EC]">
          <div className="w-10 h-10 rounded-full border-2 border-[#C9A24B]/20 border-t-[#C9A24B] animate-spin mb-3" />
          <p className="text-[11px] font-bold tracking-[0.3em] uppercase text-gray-400">
            Loading…
          </p>
        </div>
      }
    >
      <RailPaymentContent />
    </Suspense>
  );
}