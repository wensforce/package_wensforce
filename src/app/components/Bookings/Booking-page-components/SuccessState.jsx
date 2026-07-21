"use client";

import Link from "next/link";
import { Check, ArrowLeft } from "lucide-react";
import { INR, WA_NUMBER } from "@/app/(protected)/booking/booking-helpers";

export default function SuccessState({
  packageData,
  form,
  isWelcomeIndia,
  matchedLocalPlan,
}) {
  const price = packageData.discountedPrice;
  const validitySuffix = packageData.validity === "Single Trip" ? "" : "/yr";
  const waMsg = encodeURIComponent(
    `Hi WENS Force! I just reserved the ${packageData.name} Package (${INR(price)}${validitySuffix}).\n\nName: ${form.name}\nMobile: ${form.phone}\nCity: ${form.city || "Not specified"}\n\nPlease send the payment link.`,
  );

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-20"
      style={{ backgroundColor: "#0a0a0a" }}
    >
      <div
        className="fixed top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[120px] pointer-events-none opacity-30"
        style={{
          background:
            "radial-gradient(ellipse, rgba(201,162,75,0.35) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-lg w-full">
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg,#C9A24B,#f0c940)",
              boxShadow:
                "0 0 0 8px rgba(201,162,75,0.12),0 16px 48px rgba(201,162,75,0.4)",
            }}
          >
            <Check size={36} strokeWidth={3} className="text-black" />
          </div>
        </div>

        {/* Heading */}
        <p
          className="text-center text-[9px] font-bold tracking-[0.55em] uppercase mb-3"
          style={{ color: "#C9A24B" }}
        >
          Spot Reserved
        </p>
        <h1 className="text-center text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
          You&apos;re In,
          <br />
          {form.name.split(" ")[0]}!
        </h1>
        <p className="text-center text-white/50 text-base font-light mb-2">
          Your <strong className="text-[#C9A24B]">{packageData.name}</strong>{" "}
          founding spot is secured.
        </p>
        <p className="text-center text-white/40 text-sm font-light mb-10">
          Our concierge will call{" "}
          <span className="text-white/65">{form.phone}</span> within 12 hours.
        </p>

        {/* Steps */}
        <div className="relative flex items-start justify-center mb-10 px-4">
          <div
            className="absolute top-4 left-[calc(50%-60px)] right-[calc(50%-60px)] h-px"
            style={{ background: "rgba(201,162,75,0.2)" }}
          />
          {[
            { label: "Spot Reserved", sub: "Right now", done: true },
            { label: "Concierge Calls", sub: "Within 12 hours", done: false },
            { label: "Package Active", sub: "After payment", done: false },
          ].map((s, i) => (
            <div
              key={i}
              className="flex flex-col items-center relative z-10 w-28"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-3 border-2"
                style={{
                  backgroundColor: s.done
                    ? "#C9A24B"
                    : "rgba(255,255,255,0.06)",
                  borderColor: s.done ? "#C9A24B" : "rgba(255,255,255,0.12)",
                  color: s.done ? "#000" : "rgba(255,255,255,0.3)",
                }}
              >
                {s.done ? (
                  <Check size={13} strokeWidth={3} />
                ) : (
                  <span>{i + 1}</span>
                )}
              </div>
              <p
                className={`text-[11px] font-semibold text-center leading-tight ${s.done ? "text-[#C9A24B]" : "text-white/35"}`}
              >
                {s.label}
              </p>
              <p className="text-[10px] text-white/20 text-center mt-0.5">
                {s.sub}
              </p>
            </div>
          ))}
        </div>

        {/* WhatsApp CTA */}
        <a
          href={`https://wa.me/${WA_NUMBER}?text=${waMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl font-bold text-white text-sm mb-3 hover:opacity-90 transition-all"
          style={{
            backgroundColor: "#25D366",
            boxShadow: "0 8px 24px rgba(37,211,102,0.25)",
          }}
        >
          <svg viewBox="0 0 32 32" width="18" height="18" fill="white">
            <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.668 4.799 1.836 6.793L2 30l7.393-1.812A13.918 13.918 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2z" />
          </svg>
          Connect on WhatsApp Now
        </a>

        <Link
          href="/"
          className="flex items-center justify-center gap-1.5 text-white/20 text-xs hover:text-white/45 transition-colors"
        >
          <ArrowLeft size={12} /> Back to wensforce.com
        </Link>
      </div>
    </div>
  );
}
