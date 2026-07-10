"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Check,
  XCircle,
  Loader2,
  ArrowLeft,
  Gem,
  Crown,
  Shield,
} from "lucide-react";
import { plans as membershipPlans } from "@/app/data/plans";
import { plans as welcomeIndiaPlans } from "@/app/data/welcomeIndia";

const WA_NUMBER = "917304607954";

const allPlans = [...membershipPlans, ...welcomeIndiaPlans];
const getPlanImage = (id) =>
  allPlans.find((p) => p.id === id)?.image ||
  membershipPlans.find((p) => p.id === "elite")?.image;

// ── Loading Screen ────────────────────────────────────────────────────────────
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
          <Loader2
            size={26}
            className="animate-spin"
            style={{ color: "#C9A24B" }}
          />
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
        <p className="text-white/40 text-sm font-light">
          Verifying your payment…
        </p>
      </div>
    </div>
  );
}

// ── Main Confirmation Content ──────────────────────────────────────────────────
function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id") || searchParams.get("token");
  const paymentMethod = searchParams.get("payment_method") || "cashfree";
  const plan = searchParams.get("plan") || "";

  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!orderId) {
      setStatus("failed");
      return;
    }

    async function verify() {
      try {
        if (paymentMethod === "paypal") {
          const res = await fetch("/api/paypal/capture-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId: encodeURIComponent(orderId) }),
          });
          const data = await res.json();
          setStatus(data.paid ? "success" : "failed");
        } else {
          const res = await fetch(
            `/api/cashfree/verify-order?order_id=${encodeURIComponent(orderId)}`,
          );
          const data = await res.json();
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            event: "payment_status", // 👈 match GTM trigger
            order_id: orderId,
            payment_status: data.paid ? "SUCCESS" : "FAILED", // 'SUCCESS' or 'FAILED'
            plan_name: plan.charAt(0).toUpperCase() + plan.slice(1),
            conversion_value: data.paid === "SUCCESS" ? data.amount : 0, // assuming amount is in paise
            currency: data.currency || "INR",
            customer_name: data.customer_name,
            customer_phone: data.customer_phone,
            service_city: "N/A", // add if available
          });
          setStatus(data.paid ? "success" : "failed");
        }
      } catch {
        setStatus("failed");
      }
    }
    verify();
  }, [orderId, paymentMethod]);

  const planLabel = plan
    ? plan.charAt(0).toUpperCase() + plan.slice(1)
    : "Membership";
  const planImage = getPlanImage(plan);
  const waMsg = `Hi WENS Force! I just completed payment for the ${planLabel} Membership.\n\nOrder ID: ${orderId}\n\nPlease activate my account.`;

  if (status === "loading") return <LoadingScreen />;

  // ── SUCCESS ────────────────────────────────────────────────────────────────
  if (status === "success") {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#0B1E3F" }}>
        {/* Atmospheric bg */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(201,162,75,0.05) 1px, transparent 0)",
            backgroundSize: "38px 38px",
          }}
        />
        <div
          className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at top, rgba(201,162,75,0.12) 0%, transparent 65%)",
          }}
        />

        <div className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20">
          <div className="max-w-lg w-full">
            {/* ── Receipt Card ── */}
            <div
              className="overflow-hidden rounded-2xl mb-8"
              style={{
                background: "white",
                border: "1px solid rgba(201,162,75,0.18)",
                boxShadow:
                  "0 32px 80px rgba(0,0,0,0.35), 0 0 0 1px rgba(201,162,75,0.06)",
              }}
            >
              {/* Gold accent line */}
              <div
                style={{
                  height: 3,
                  background: "linear-gradient(90deg,#C9A24B,#f0c940,#C9A24B)",
                }}
              />

              {/* Plan image strip */}
              <div className="relative overflow-hidden" style={{ height: 140 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={planImage}
                  alt={planLabel}
                  className="w-full h-full object-cover"
                  style={{ filter: "brightness(0.55) saturate(0.7)" }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 65%)",
                  }}
                />
                {/* Success icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center shadow-2xl"
                    style={{
                      background: "linear-gradient(135deg,#C9A24B,#f0c940)",
                      boxShadow:
                        "0 0 0 6px rgba(201,162,75,0.2), 0 12px 32px rgba(201,162,75,0.5)",
                    }}
                  >
                    <Check size={26} strokeWidth={3} className="text-black" />
                  </div>
                </div>
                {/* Plan name bottom-left */}
                <div className="absolute bottom-4 left-5">
                  <p className="text-white/50 text-[9px] font-bold tracking-[0.4em] uppercase">
                    {planLabel} Membership
                  </p>
                </div>
                {/* Payment confirmed badge */}
                <div className="absolute top-4 right-4">
                  <span
                    className="text-[9px] font-bold tracking-[0.3em] uppercase px-3 py-1.5 rounded-full backdrop-blur-sm"
                    style={{
                      background: "rgba(201,162,75,0.25)",
                      color: "#C9A24B",
                      border: "1px solid rgba(201,162,75,0.3)",
                    }}
                  >
                    Payment Confirmed
                  </span>
                </div>
              </div>

              {/* Receipt body */}
              <div className="px-7 py-6">
                <p className="text-[9px] font-bold tracking-[0.5em] uppercase text-[#C9A24B] mb-2">
                  Welcome to WENS Force
                </p>
                <h1 className="font-serif-display text-2xl sm:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                  Your <span style={{ color: "#C9A24B" }}>{planLabel}</span>{" "}
                  Membership
                  <br />
                  is now active.
                </h1>

                <p className="text-gray-500 text-sm font-light leading-relaxed mb-5">
                  Our concierge will reach out shortly to set up your account
                  and walk you through everything included in your membership.
                </p>

                {/* Order ID */}
                {orderId && (
                  <div
                    className="flex items-center justify-between px-4 py-3 rounded-xl mb-5"
                    style={{
                      backgroundColor: "#fafaf8",
                      border: "1px solid rgba(201,162,75,0.1)",
                    }}
                  >
                    <span className="text-gray-400 text-xs font-medium">
                      Order ID
                    </span>
                    <span className="text-gray-700 text-xs font-mono font-semibold tracking-wide">
                      {orderId.length > 20
                        ? `${orderId.slice(0, 20)}…`
                        : orderId}
                    </span>
                  </div>
                )}

                {/* Timeline */}
                <div className="relative mb-6">
                  <p className="text-[9px] font-bold text-gray-400 tracking-[0.35em] uppercase mb-4">
                    What Happens Next
                  </p>

                  {/* Steps */}
                  <div className="space-y-0">
                    {[
                      {
                        label: "Payment Confirmed",
                        sub: "Your payment is verified and recorded",
                        done: true,
                      },
                      {
                        label: "Concierge Calls You",
                        sub: "Within 12 hours of payment",
                        done: false,
                      },
                      {
                        label: "Account Activated",
                        sub: "Full membership access within 24 hours",
                        done: false,
                      },
                    ].map((s, i, arr) => (
                      <div key={i} className="flex gap-4 relative">
                        {/* Left: icon + connector */}
                        <div className="flex flex-col items-center">
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-2 z-10 bg-white"
                            style={{
                              borderColor: s.done
                                ? "#C9A24B"
                                : "rgba(0,0,0,0.12)",
                              backgroundColor: s.done ? "#C9A24B" : "white",
                            }}
                          >
                            {s.done ? (
                              <Check
                                size={12}
                                strokeWidth={3}
                                className="text-black"
                              />
                            ) : (
                              <span className="text-[10px] font-bold text-gray-400">
                                {i + 1}
                              </span>
                            )}
                          </div>
                          {i < arr.length - 1 && (
                            <div
                              className="w-px flex-1 mt-1"
                              style={{
                                background:
                                  i === 0
                                    ? "rgba(201,162,75,0.3)"
                                    : "rgba(0,0,0,0.08)",
                                minHeight: "28px",
                              }}
                            />
                          )}
                        </div>
                        {/* Right: text */}
                        <div className="pb-5">
                          <p
                            className={`text-sm font-semibold ${s.done ? "text-gray-900" : "text-gray-500"}`}
                          >
                            {s.label}
                          </p>
                          <p className="text-xs text-gray-400 font-light mt-0.5">
                            {s.sub}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* WhatsApp CTA */}
                <a
                  href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waMsg)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl font-bold text-white text-sm mb-3 transition-all hover:opacity-90 hover:shadow-lg"
                  style={{
                    backgroundColor: "#25D366",
                    boxShadow: "0 4px 16px rgba(37,211,102,0.25)",
                  }}
                >
                  <svg viewBox="0 0 32 32" width="16" height="16" fill="white">
                    <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.668 4.799 1.836 6.793L2 30l7.393-1.812A13.918 13.918 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2z" />
                  </svg>
                  Connect on WhatsApp
                </a>

                <p className="text-center text-gray-400 text-xs">
                  Our team typically responds within 15 minutes.
                </p>
              </div>
            </div>

            {/* Back link */}
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

  // ── FAILED ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0B1E3F" }}>
      <div
        className="fixed top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full blur-[100px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(239,68,68,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20">
        <div className="max-w-md w-full">
          <div
            className="overflow-hidden rounded-2xl"
            style={{
              background: "white",
              border: "1px solid rgba(239,68,68,0.15)",
              boxShadow: "0 24px 64px rgba(0,0,0,0.3)",
            }}
          >
            {/* Red top bar */}
            <div
              style={{
                height: 3,
                background: "linear-gradient(90deg,#ef4444,#f87171,#ef4444)",
              }}
            />

            <div className="px-7 py-10 text-center">
              {/* Error icon */}
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{
                  backgroundColor: "rgba(239,68,68,0.08)",
                  border: "2px solid rgba(239,68,68,0.2)",
                }}
              >
                <XCircle
                  size={30}
                  strokeWidth={1.5}
                  style={{ color: "#ef4444" }}
                />
              </div>

              <p className="text-[9px] font-bold tracking-[0.5em] uppercase text-red-400 mb-2">
                Payment Unsuccessful
              </p>
              <h1 className="font-serif-display text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Something went wrong
              </h1>
              <p className="text-gray-500 text-sm font-light leading-relaxed mb-3">
                Your payment could not be completed. No amount has been charged.
              </p>
              <p className="text-gray-400 text-sm font-light leading-relaxed mb-6">
                Please try again or contact us on WhatsApp for immediate
                assistance.
              </p>

              {orderId && (
                <div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg mb-8 text-xs"
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

              <div className="space-y-3">
                {plan && (
                  <Link
                    href={`/booking/${plan}`}
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-black text-sm transition-all hover:opacity-90 hover:-translate-y-0.5"
                    style={{
                      background: "linear-gradient(135deg,#C9A24B,#f0c940)",
                      boxShadow: "0 4px 16px rgba(201,162,75,0.35)",
                    }}
                  >
                    Try Again
                  </Link>
                )}
                <a
                  href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hi WENS Force, I faced an issue with my payment for the ${planLabel} Membership. Order ID: ${orderId}. Can you help?`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold border-2 text-[#25D366] hover:bg-[#25D366]/5 transition-all text-sm"
                  style={{ borderColor: "rgba(37,211,102,0.3)" }}
                >
                  <svg
                    viewBox="0 0 32 32"
                    width="15"
                    height="15"
                    fill="#25D366"
                  >
                    <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.668 4.799 1.836 6.793L2 30l7.393-1.812A13.918 13.918 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2z" />
                  </svg>
                  Get Help on WhatsApp
                </a>
              </div>
            </div>
          </div>

          <div className="text-center mt-6">
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
export default function ConfirmationPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <ConfirmationContent />
    </Suspense>
  );
}
