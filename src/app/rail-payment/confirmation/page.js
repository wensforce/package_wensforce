"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Check, XCircle, Loader2, ArrowLeft } from "lucide-react";

const WA_NUMBER = "917304607954";

const INR = (n) =>
  n !== "" && !isNaN(Number(n)) && Number(n) > 0
    ? "₹" + Number(n).toLocaleString("en-IN", { maximumFractionDigits: 2 })
    : "—";

// ── Loading ────────────────────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-6"
      style={{ backgroundColor: "#0B1E3F" }}
    >
      <div
        className="fixed top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full blur-[100px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(201,162,75,0.12) 0%, transparent 70%)",
        }}
      />
      <div className="relative">
        <div
          className="w-16 h-16 rounded-full border-2 flex items-center justify-center"
          style={{ borderColor: "rgba(201,162,75,0.2)" }}
        >
          <Loader2 size={26} className="animate-spin" style={{ color: "#C9A24B" }} />
        </div>
        <div
          className="absolute inset-0 rounded-full animate-ping"
          style={{ border: "1px solid rgba(201,162,75,0.15)" }}
        />
      </div>
      <div className="text-center">
        <p className="text-[#C9A24B] text-[10px] font-bold tracking-[0.5em] uppercase mb-1.5">
          WENS Force
        </p>
        <p className="text-white/40 text-sm font-light">Verifying your payment…</p>
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────
function RailConfirmationContent() {
  const searchParams = useSearchParams();

  const orderId      = searchParams.get("order_id") || "";
  const planId       = searchParams.get("planId") || "";
  const customerName = searchParams.get("customerName") || "";

  const [status,  setStatus]  = useState("loading");
  const [amount,  setAmount]  = useState(null);
  const [currency, setCurrency] = useState("INR");

  useEffect(() => {
    if (!orderId) { setStatus("failed"); return; }

    async function verify() {
      try {
        const res  = await fetch(`/api/cashfree/verify-order?order_id=${encodeURIComponent(orderId)}`);
        const data = await res.json();
        if (data.paid) {
          setAmount(data.amount ?? null);
          setCurrency(data.currency ?? "INR");
        }
        setStatus(data.paid ? "success" : "failed");
      } catch {
        setStatus("failed");
      }
    }
    verify();
  }, [orderId]);

  const amountLabel = amount !== null ? INR(amount) : "—";
  const waMsg = `Hi WENS Force! I just completed my advance payment.\n\nOrder ID: ${orderId}${planId ? `\nPlan: ${planId}` : ""}${customerName ? `\nName: ${customerName}` : ""}\nAmount Paid: ${amountLabel}\n\nPlease update my booking.`;
  const waErrMsg = `Hi WENS Force, I had a payment issue.${orderId ? `\nOrder ID: ${orderId}` : ""}${planId ? `\nPlan: ${planId}` : ""}\nCan you help?`;

  if (status === "loading") return <LoadingScreen />;

  // ── SUCCESS ──────────────────────────────────────────────────────────────────
  if (status === "success") {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#0B1E3F" }}>
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(201,162,75,0.05) 1px, transparent 0)",
            backgroundSize: "38px 38px",
          }}
        />
        <div
          className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[360px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at top, rgba(201,162,75,0.11) 0%, transparent 65%)",
          }}
        />

        <div className="relative min-h-screen flex flex-col items-center justify-center px-6 py-16">
          <div className="max-w-sm w-full">
            <div
              className="overflow-hidden rounded-2xl mb-7"
              style={{
                background: "white",
                border: "1px solid rgba(201,162,75,0.18)",
                boxShadow: "0 32px 80px rgba(0,0,0,0.35)",
              }}
            >
              {/* Gold accent bar */}
              <div style={{ height: 3, background: "linear-gradient(90deg,#C9A24B,#f0c940,#C9A24B)" }} />

              {/* Dark header */}
              <div
                className="px-7 py-8 flex flex-col items-center gap-4"
                style={{ background: "linear-gradient(135deg,#0B1E3F 0%,#112850 100%)" }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center shadow-2xl"
                  style={{
                    background: "linear-gradient(135deg,#C9A24B,#f0c940)",
                    boxShadow: "0 0 0 8px rgba(201,162,75,0.12), 0 12px 32px rgba(201,162,75,0.4)",
                  }}
                >
                  <Check size={28} strokeWidth={3} className="text-black" />
                </div>

                <div className="text-center">
                  <p className="text-[#C9A24B] text-[9px] font-bold tracking-[0.45em] uppercase mb-1">
                    Advance Payment
                  </p>
                  <h1 className="text-white text-2xl font-bold">Payment Received</h1>
                </div>

                {/* Amount */}
                <div
                  className="w-full rounded-xl px-5 py-4 text-center"
                  style={{
                    background: "rgba(201,162,75,0.1)",
                    border: "1px solid rgba(201,162,75,0.22)",
                  }}
                >
                  <p className="text-white/40 text-[10px] font-semibold tracking-widest uppercase mb-1">
                    Amount Paid
                  </p>
                  <p
                    className="text-4xl font-bold tabular-nums"
                    style={{ color: "#f0c940" }}
                  >
                    {amountLabel}
                  </p>
                  {currency !== "INR" && (
                    <p className="text-white/30 text-xs mt-1">{currency}</p>
                  )}
                </div>
              </div>

              {/* White body */}
              <div className="px-7 py-6 flex flex-col gap-4">
                {/* Order ID */}
                {orderId && (
                  <div
                    className="flex items-center justify-between px-4 py-3 rounded-xl"
                    style={{
                      backgroundColor: "#fafaf8",
                      border: "1px solid rgba(201,162,75,0.1)",
                    }}
                  >
                    <span className="text-gray-400 text-xs font-medium">Order ID</span>
                    <span className="text-gray-700 text-xs font-mono font-semibold tracking-wide">
                      {orderId.length > 22 ? `${orderId.slice(0, 22)}…` : orderId}
                    </span>
                  </div>
                )}

                {/* WhatsApp CTA */}
                <a
                  href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waMsg)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90"
                  style={{
                    backgroundColor: "#25D366",
                    boxShadow: "0 4px 16px rgba(37,211,102,0.25)",
                  }}
                >
                  <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            width="28"
            height="28"
            fill="white"
          >
            <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.668 4.799 1.836 6.793L2 30l7.393-1.812A13.918 13.918 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.6a11.543 11.543 0 01-5.88-1.604l-.42-.248-4.39 1.074 1.106-4.274-.272-.44A11.556 11.556 0 014.4 16C4.4 9.592 9.592 4.4 16 4.4S27.6 9.592 27.6 16 22.408 27.6 16 27.6zm6.327-8.627c-.348-.174-2.055-1.014-2.374-1.13-.318-.115-.55-.174-.78.174-.23.348-.894 1.13-1.097 1.362-.201.231-.404.26-.752.086-.348-.174-1.47-.542-2.799-1.727-1.034-.922-1.732-2.062-1.934-2.41-.202-.348-.022-.536.152-.71.156-.155.348-.405.522-.607.174-.202.23-.348.348-.58.115-.231.058-.434-.03-.607-.086-.174-.78-1.882-1.07-2.578-.282-.677-.568-.585-.78-.596-.201-.01-.434-.012-.665-.012-.23 0-.607.086-.926.434-.318.348-1.214 1.186-1.214 2.892 0 1.707 1.243 3.356 1.417 3.588.174.231 2.447 3.734 5.928 5.234.83.358 1.478.572 1.982.732.833.265 1.59.227 2.19.138.668-.1 2.055-.84 2.346-1.652.29-.81.29-1.505.202-1.652-.086-.145-.318-.231-.665-.405z" />
          </svg>
                  Confirm on WhatsApp
                </a>

                <p className="text-center text-gray-400 text-[11px]">
                  Our team typically responds within 15 minutes.
                </p>
              </div>
            </div>

            <div className="text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-white/20 text-xs hover:text-white/45 transition-colors"
              >
                <ArrowLeft size={12} />
                Back to wensforce.com
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── FAILED ────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0B1E3F" }}>
      <div
        className="fixed top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full blur-[100px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(239,68,68,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative min-h-screen flex flex-col items-center justify-center px-6 py-16">
        <div className="max-w-sm w-full">
          <div
            className="overflow-hidden rounded-2xl mb-7"
            style={{
              background: "white",
              border: "1px solid rgba(239,68,68,0.15)",
              boxShadow: "0 24px 64px rgba(0,0,0,0.3)",
            }}
          >
            <div style={{ height: 3, background: "linear-gradient(90deg,#ef4444,#f87171,#ef4444)" }} />

            <div className="px-7 py-10 text-center flex flex-col items-center gap-5">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: "rgba(239,68,68,0.08)",
                  border: "2px solid rgba(239,68,68,0.2)",
                }}
              >
                <XCircle size={30} strokeWidth={1.5} style={{ color: "#ef4444" }} />
              </div>

              <div>
                <p className="text-[9px] font-bold tracking-[0.5em] uppercase text-red-400 mb-2">
                  Payment Unsuccessful
                </p>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h1>
                <p className="text-gray-400 text-sm font-light leading-relaxed">
                  Your advance payment could not be completed. No amount has been charged.
                </p>
              </div>

              {orderId && (
                <div
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs"
                  style={{
                    backgroundColor: "#fafaf8",
                    border: "1px solid rgba(0,0,0,0.06)",
                  }}
                >
                  <span className="text-gray-400 font-medium">Reference:</span>
                  <span className="text-gray-600 font-mono">
                    {orderId.length > 18 ? `${orderId.slice(0, 18)}…` : orderId}
                  </span>
                </div>
              )}

              <div className="w-full flex flex-col gap-3">
                <Link
                  href="/rail-payment"
                  className="flex items-center justify-center w-full py-3.5 rounded-xl font-bold text-black text-sm transition-all hover:opacity-90"
                  style={{
                    background: "linear-gradient(135deg,#C9A24B,#f0c940)",
                    boxShadow: "0 4px 16px rgba(201,162,75,0.35)",
                  }}
                >
                  Try Again
                </Link>
                <a
                  href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waErrMsg)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold border-2 text-[#25D366] hover:bg-[#25D366]/5 transition-all text-sm"
                  style={{ borderColor: "rgba(37,211,102,0.3)" }}
                >
                  <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            width="28"
            height="28"
          >
            <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.668 4.799 1.836 6.793L2 30l7.393-1.812A13.918 13.918 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.6a11.543 11.543 0 01-5.88-1.604l-.42-.248-4.39 1.074 1.106-4.274-.272-.44A11.556 11.556 0 014.4 16C4.4 9.592 9.592 4.4 16 4.4S27.6 9.592 27.6 16 22.408 27.6 16 27.6zm6.327-8.627c-.348-.174-2.055-1.014-2.374-1.13-.318-.115-.55-.174-.78.174-.23.348-.894 1.13-1.097 1.362-.201.231-.404.26-.752.086-.348-.174-1.47-.542-2.799-1.727-1.034-.922-1.732-2.062-1.934-2.41-.202-.348-.022-.536.152-.71.156-.155.348-.405.522-.607.174-.202.23-.348.348-.58.115-.231.058-.434-.03-.607-.086-.174-.78-1.882-1.07-2.578-.282-.677-.568-.585-.78-.596-.201-.01-.434-.012-.665-.012-.23 0-.607.086-.926.434-.318.348-1.214 1.186-1.214 2.892 0 1.707 1.243 3.356 1.417 3.588.174.231 2.447 3.734 5.928 5.234.83.358 1.478.572 1.982.732.833.265 1.59.227 2.19.138.668-.1 2.055-.84 2.346-1.652.29-.81.29-1.505.202-1.652-.086-.145-.318-.231-.665-.405z" />
          </svg>
                  Get Help on WhatsApp
                </a>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-white/20 text-xs hover:text-white/45 transition-colors"
            >
              <ArrowLeft size={12} />
              Back to wensforce.com
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page Export ────────────────────────────────────────────────────────────────
export default function RailConfirmationPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <RailConfirmationContent />
    </Suspense>
  );
}
