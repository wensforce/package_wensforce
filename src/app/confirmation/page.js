"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Shield, Check, XCircle, RefreshCw } from "lucide-react";
import api from "../axios/axios";
import { packageApiUser } from "../user-apis/package.api";
import PackageSummaryPanel from "../components/Bookings/Booking-page-components/PackageSummaryPanel";
import { plans as welcomePlans } from "../data/welcomeIndia";
import { INR } from "../(protected)/booking/booking-helpers";

const welcomePlanIds = new Set(welcomePlans.map((p) => p.id));
const WA_NUMBER = "917304607954";

/* ─── Inline keyframes (avoids adding to global CSS) ─── */
const STYLES = `
  @keyframes pulse-ring {
    0%   { transform: scale(1);    opacity: 0.6; }
    70%  { transform: scale(1.55); opacity: 0;   }
    100% { transform: scale(1.55); opacity: 0;   }
  }
  @keyframes bounce-in {
    0%   { transform: scale(0.4); opacity: 0; }
    65%  { transform: scale(1.12);            }
    100% { transform: scale(1);   opacity: 1; }
  }
  @keyframes shake {
    0%,100% { transform: translateX(0);   }
    20%     { transform: translateX(-5px); }
    40%     { transform: translateX(5px);  }
    60%     { transform: translateX(-3px); }
    80%     { transform: translateX(3px);  }
  }
  @keyframes wa-pulse {
    0%,100% { box-shadow: 0 6px 24px rgba(37,211,102,0.35); }
    50%     { box-shadow: 0 6px 32px rgba(37,211,102,0.65); }
  }
  @keyframes live-dot {
    0%,100% { opacity: 1; }
    50%     { opacity: 0.3; }
  }
  @keyframes ribbon-slide {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
  .icon-bounce  { animation: bounce-in 0.55s cubic-bezier(.22,1,.36,1) forwards; }
  .icon-shake   { animation: shake 0.5s ease forwards; }
  .wa-glow      { animation: wa-pulse 2.5s ease-in-out infinite; }
  .ribbon-in    { animation: ribbon-slide 0.4s ease forwards; }
  .live-blink   { animation: live-dot 1.4s ease-in-out infinite; }
`;

/* ─── WhatsApp SVG ─── */
const WaIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="24" height="24" fill="white">
    <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.668 4.799 1.836 6.793L2 30l7.393-1.812A13.918 13.918 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.6a11.543 11.543 0 01-5.88-1.604l-.42-.248-4.39 1.074 1.106-4.274-.272-.44A11.556 11.556 0 014.4 16C4.4 9.592 9.592 4.4 16 4.4S27.6 9.592 27.6 16 22.408 27.6 16 27.6zm6.327-8.627c-.348-.174-2.055-1.014-2.374-1.13-.318-.115-.55-.174-.78.174-.23.348-.894 1.13-1.097 1.362-.201.231-.404.26-.752.086-.348-.174-1.47-.542-2.799-1.727-1.034-.922-1.732-2.062-1.934-2.41-.202-.348-.022-.536.152-.71.156-.155.348-.405.522-.607.174-.202.23-.348.348-.58.115-.231.058-.434-.03-.607-.086-.174-.78-1.882-1.07-2.578-.282-.677-.568-.585-.78-.596-.201-.01-.434-.012-.665-.012-.23 0-.607.086-.926.434-.318.348-1.214 1.186-1.214 2.892 0 1.707 1.243 3.356 1.417 3.588.174.231 2.447 3.734 5.928 5.234.83.358 1.478.572 1.982.732.833.265 1.59.227 2.19.138.668-.1 2.055-.84 2.346-1.652.29-.81.29-1.505.202-1.652-.086-.145-.318-.231-.665-.405z" />
  </svg>
);

/* ════════════════════════════════════════════════════════════ */
function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id") || searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState(null);
  const [packageData, setPackageData] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!orderId) { setStatus("failed"); setLoading(false); return; }

    (async () => {
      try {
        const verifyRes = await api.get(`/payment/verify-payment/${orderId}`);
        const data = verifyRes.data?.data ?? verifyRes.data ?? {};
        setOrderData(data);

        setStatus(["ACTIVE", "success", "PAID"].includes(data.status) ? "success" : "failed");
        if (data.packageId) setPackageData(await packageApiUser.getPackageById(data.packageId));
      } catch { setStatus("failed"); }
      finally { setLoading(false); }
    })();
  }, [orderId]);

  /* ── Loading ── */
  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF6EC] px-6">
      <div className="w-12 h-12 rounded-full border-2 border-[#C9A24B]/20 border-t-[#C9A24B] animate-spin mb-4" />
      <p className="text-[11px] font-bold tracking-[0.3em] uppercase text-gray-400">Verifying your payment…</p>
    </div>
  );

  const isSuccess = status === "success";
  const isWelcomeIndia = packageData ? welcomePlanIds.has(packageData.id) || welcomePlanIds.has(packageData.slug) : false;
  const displayPrice = packageData ? INR(packageData.discountedPrice) : "…";
  let homepageUrl = "/";

  if (packageData?.category) { homepageUrl = packageData.category === "membership" ? "/" : `/${packageData.category}`; }


  const waMsg = packageData
    ? `Hi WENS Force! I just completed payment for the ${packageData.name} Membership.\n\nOrder ID: ${orderId}\n\nPlease activate my account.`
    : `Hi WENS Force! I just completed payment.\n\nOrder ID: ${orderId}\n\nPlease activate my account.`;

  /* ── colour tokens ── */
  const ok = { fg: "#16a34a", bg: "rgba(74,222,128,0.10)", border: "rgba(74,222,128,0.35)" };
  const fail = { fg: "#dc2626", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.28)" };
  const tok = isSuccess ? ok : fail;

  return (
    <>
      <style>{STYLES}</style>

      {/* ── Header ── */}
      <div className="flex items-center justify-between gap-2 px-3 sm:px-6 py-3 border-b bg-white"
        style={{ borderColor: "rgba(201,162,75,0.12)" }}>
        <Link href={homepageUrl} className="flex items-center gap-1.5 text-gray-400 hover:text-gray-700 text-xs transition-colors flex-shrink-0">
          <ArrowLeft size={13} />
          <span className="hidden xs:inline">Back to Home</span>
        </Link>
        <p className="flex-1 text-center text-[#C9A24B] font-bold text-[11px] sm:text-[15px] tracking-[0.12em] sm:tracking-[0.32em] uppercase truncate px-2">
          WENS Force · Payment Confirmation
        </p>
        <div className="flex items-center gap-1 text-[10px] text-gray-400 flex-shrink-0">
          <Shield size={11} strokeWidth={1.5} style={{ color: "rgba(201,162,75,0.65)" }} />
          <span className="hidden md:inline">Secure &amp; Encrypted</span>
        </div>
      </div>



      {/* ── Main layout ── */}
      <div className="flex items-start justify-center p-3 sm:p-5 min-h-screen" style={{ backgroundColor: "#FAF6EC" }}>
        <div
          className="w-full max-w-5xl flex flex-col lg:flex-row overflow-hidden rounded-2xl bg-white"
          style={{
            boxShadow: "0 24px 80px rgba(0,0,0,0.18)",
            border: `1.5px solid ${tok.border}`,
          }}
        >
          {/* ── Left panel (package summary) ── */}
          {packageData ? (
            <PackageSummaryPanel packageData={packageData} displayPrice={displayPrice} isWelcomeIndia={isWelcomeIndia} />
          ) : (
            <div className="w-full lg:w-2/5 bg-[#0B1E3F] p-8 sm:p-12 text-white flex flex-col justify-between min-h-[300px]">
              <div>
                <p className="text-[#C9A24B] text-[10px] tracking-[0.4em] uppercase font-bold mb-6">Membership Details</p>
                <h2 className="font-serif-display text-3xl font-semibold mb-4 leading-tight">WENS Force Membership</h2>
                <p className="text-white/60 text-sm font-light">Verification pending. Loading tier details…</p>
              </div>
            </div>
          )}

          {/* ── Right status panel ── */}
          <div className="w-full lg:w-3/5 p-6 sm:p-10 flex flex-col justify-between bg-white">

            {/* Inline status banner */}
            <div className="rounded-xl px-4 py-3 mb-6 flex items-center gap-3"
              style={{ background: tok.bg, border: `1px solid ${tok.border}` }}>
              <div className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: tok.fg, boxShadow: `0 0 6px ${tok.fg}` }} />
              <p className="text-[12px] font-semibold" style={{ color: tok.fg }}>
                {isSuccess
                  ? "Payment received. Your account is active and our team has been notified."
                  : "We could not complete verification. No amount was charged. Please retry or contact support."}
              </p>
            </div>

            {/* ── Icon + heading ── */}
            <div className="space-y-6 text-center lg:text-left">
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-5">

                {/* Icon */}
                <div className="relative flex-shrink-0">
                  {isSuccess ? (
                    <>
                      {/* Pulse ring behind icon */}
                      <div className="absolute inset-0 rounded-full"
                        style={{ background: "rgba(201,162,75,0.3)", animation: "pulse-ring 2s ease-out infinite" }} />
                      <div className="relative w-16 h-16 rounded-full flex items-center justify-center icon-bounce"
                        style={{
                          background: "linear-gradient(135deg,#C9A24B 0%,#e0b85a 100%)",
                          boxShadow: "0 12px 36px rgba(201,162,75,0.45)",
                        }}>
                        <Check size={28} strokeWidth={3} className="text-white" />
                      </div>
                    </>
                  ) : (
                    <div className="w-16 h-16 rounded-full flex items-center justify-center icon-shake"
                      style={{
                        background: "rgba(239,68,68,0.08)", border: "2px solid rgba(239,68,68,0.35)",
                        boxShadow: "0 8px 24px rgba(239,68,68,0.18)"
                      }}>
                      <XCircle size={30} strokeWidth={1.5} className="text-red-500" />
                    </div>
                  )}
                </div>

                {/* Text */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2 justify-center lg:justify-start">
                    <p className="text-[10px] font-bold tracking-[0.4em] uppercase"
                      style={{ color: isSuccess ? "#C9A24B" : "#dc2626" }}>
                      {isSuccess ? "Payment Successful" : "Payment Unsuccessful"}
                    </p>
                    {/* Status badge */}
                    <span className="text-[9px] font-bold px-2.5 py-0.5 rounded-full"
                      style={{ background: tok.bg, color: tok.fg, border: `1px solid ${tok.border}` }}>
                      {isSuccess ? "✓ CONFIRMED" : "✕ FAILED"}
                    </span>
                  </div>
                  <h1 className="font-serif-display text-2xl sm:text-3xl font-bold mb-3"
                    style={{ color: isSuccess ? "#0B1E3F" : "#111827" }}>
                    {isSuccess ? "Welcome to the WENS Force Family" : "Something went wrong"}
                  </h1>
                  <p className="text-gray-500 text-sm font-light leading-relaxed">
                    {isSuccess
                      ? "Thank you for choosing WENS Force. Your reservation is pre-arranged and our team is already preparing your details."
                      : "Your payment could not be verified or completed. No amount has been charged. Please try again or contact support."}
                  </p>
                </div>
              </div>

              {/* ── Transaction details box ── */}
              <div className="rounded-xl p-4 space-y-3 text-xs text-left max-w-md mx-auto lg:mx-0"
                style={{ background: "#FAF6EC", border: `1.5px solid ${tok.border}` }}>
                <p className="text-[9px] font-bold tracking-[0.25em] uppercase" style={{ color: tok.fg }}>
                  Transaction Details
                </p>
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="text-gray-400">Order ID</span>
                  <span className="font-mono font-semibold text-gray-700 text-[11px]">{orderId}</span>
                </div>
                {orderData?.amount && (
                  <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <span className="text-gray-400">Amount Paid</span>
                    <span className="font-semibold text-[#0B1E3F]">
                      ₹{orderData.amount.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Status</span>
                  <span className="font-bold text-[11px] px-3 py-1 rounded-full"
                    style={{ background: tok.bg, color: tok.fg, border: `1px solid ${tok.border}` }}>
                    {isSuccess ? "✓ Payment Success" : "✕ Failed / Pending"}
                  </span>
                </div>
              </div>
            </div>

            {/* ── CTAs ── */}
            <div className="border-t pt-6 mt-6 space-y-3" style={{ borderColor: "rgba(201,162,75,0.12)" }}>

              {/* WhatsApp button — redesigned */}
              <a
                href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waMsg)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="wa-glow relative flex items-center w-full rounded-xl overflow-hidden transition-all hover:scale-[1.015] active:scale-[0.99]"
                style={{
                  background: "linear-gradient(115deg,#075E54 0%,#128C7E 35%,#25D366 100%)",
                  minHeight: "60px",
                  textDecoration: "none",
                }}
              >
                {/* Icon column */}
                <div className="flex items-center justify-center w-16 h-full flex-shrink-0"
                  style={{ borderRight: "1px solid rgba(255,255,255,0.18)" }}>
                  <WaIcon />
                </div>

                {/* Text column */}
                <div className="flex-1 flex flex-col items-start px-4">
                  <span className="text-[10px] font-normal text-white/75 tracking-wide">Need help? Reach our concierge team</span>
                  <span className="text-[15px] font-bold text-white leading-tight">Connect on WhatsApp</span>
                </div>


              </a>

              {/* Retry — only on failure */}
              {!isSuccess && (
                <Link
                  href={`/booking/${packageData?.id || orderData?.packageId || ""}`}
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-sm transition-all hover:opacity-90"
                  style={{
                    background: "linear-gradient(135deg,#0B1E3F 0%,#1a3a6b 100%)",
                    color: "#C9A24B",
                  }}
                >
                  <RefreshCw size={14} />
                  Try Payment Again
                </Link>
              )}

              {/* Home */}
              <Link href={homepageUrl}
                className="flex items-center justify-center w-full py-3 rounded-xl font-semibold text-gray-500 text-sm hover:bg-gray-50 transition-colors"
                style={{ border: "1px solid rgba(0,0,0,0.09)" }}>
                Return to Homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ════════════════════════════════════════════════════════════ */
export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF6EC] px-6">
        <div className="w-12 h-12 rounded-full border-2 border-[#C9A24B]/20 border-t-[#C9A24B] animate-spin mb-4" />
        <p className="text-[11px] font-bold tracking-[0.3em] uppercase text-gray-400">Initializing…</p>
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}