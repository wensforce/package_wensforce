"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Crown,
  Gem,
  Tag,
  AlertTriangle,
  CheckCircle,
  Star,
} from "lucide-react";
import { useSearchParams } from "next/navigation";

const WA_NUMBER = "917304607954";
const DEADLINE = "2026-06-30T23:59:59+05:30";

const TIER_PRICES = {
  essential: "₹24,999* + GST 18% Extra",
  executive: "₹49,999* + GST 18% Extra",
  premium: "₹74,999* + GST 18% Extra",
  elite: "₹99,999* + GST 18% Extra",
  sovereign: "₹1,99,999* + GST 18% Extra",
};

function CountdownBlock() {
  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const target = new Date(DEADLINE).getTime();
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n) => String(n).padStart(2, "0");

  if (!mounted) return null;

  const units = [
    { label: "Days", val: pad(time.days) },
    { label: "Hours", val: pad(time.hours) },
    { label: "Mins", val: pad(time.minutes) },
    { label: "Secs", val: pad(time.seconds) },
  ];

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      {units.map(({ label, val }, i) => (
        <div key={label} className="flex items-center gap-2 sm:gap-3">
          <div className="flex flex-col items-center">
            <div
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center font-mono font-bold text-2xl sm:text-3xl text-white relative overflow-hidden"
              style={{
                background: "rgba(201,162,75,0.15)",
                border: "1px solid rgba(201,162,75,0.3)",
              }}
            >
              <span className="relative z-10">{val}</span>
              {/* shimmer bar */}
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C9A24B]/50" />
            </div>
            <span className="text-[9px] text-white/30 uppercase tracking-[0.15em] mt-1.5 font-medium">
              {label}
            </span>
          </div>
          {i < 3 && (
            <span className="text-[#C9A24B]/50 font-bold text-xl mb-4">:</span>
          )}
        </div>
      ))}
    </div>
  );
}

export default function FoundingMemberBanner() {
  const tierList = ["essential", "executive", "premium", "elite", "sovereign"];
  const searchParams = useSearchParams();
  const isWelcomeIndia = searchParams.get("welcomeIndia") === "true";

  return (
    <section
      id="founding"
      className="relative overflow-hidden py-20 px-6"
      style={{ backgroundColor: "#060D1F" }}
    >
      {/* Background grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#C9A24B 1px, transparent 1px), linear-gradient(90deg, #C9A24B 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Top glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-48 rounded-full blur-3xl pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(201,162,75,0.18) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-3xl mx-auto">
        {/* Alert pill */}
        <div className="flex justify-center mb-6">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold animate-pulse"
            style={{
              backgroundColor: "rgba(239,68,68,0.15)",
              border: "1px solid rgba(239,68,68,0.35)",
              color: "#f87171",
            }}
          >
            <AlertTriangle size={12} strokeWidth={2.5} />
            Access Closes June 30, 2026 — 11:59 PM IST
          </div>
        </div>

        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <Crown size={15} strokeWidth={1.5} className="text-[#C9A24B]" />
          <p className="text-[#C9A24B] text-[10px] tracking-[0.4em] uppercase font-semibold">
            Financial Year Founding Member Access
          </p>
          <Crown size={15} strokeWidth={1.5} className="text-[#C9A24B]" />
        </div>

        {/* Headline */}
        <h2 className="font-serif-display text-center text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
          Lock In Founding Rates.
          <br />
          <span style={{ color: "#C9A24B" }}>Before the FY Window Closes.</span>
        </h2>

        <p className="text-center text-white/40 text-sm font-light mb-10 max-w-lg mx-auto leading-relaxed">
          After June 30, all new members pay the updated price for the next
          cycle. Join now and pay today&apos;s rate for your first membership
          year.
        </p>

        {/* Countdown */}
        <div className="mb-10">
          <p className="text-center text-white/30 text-[10px] uppercase tracking-[0.3em] font-medium mb-4">
            Time remaining to claim founding rates
          </p>
          <CountdownBlock />
        </div>

        {/* Divider */}
        <div
          className="w-full h-px mb-10"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(201,162,75,0.3), transparent)",
          }}
        />

        {/* Tier pricing pills */}
        <div className="mb-10">
          <p className="text-center text-white/30 text-[10px] uppercase tracking-[0.3em] font-medium mb-5">
            Current founding rates — valid till June 30
          </p>
          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {tierList.map((id) => (
              <div
                key={id}
                className="flex flex-col items-center gap-1.5 rounded-2xl px-2 py-4"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <p className="text-[9px] text-white/40 uppercase tracking-wide font-light text-center">
                  {id}
                </p>
                <p className="text-[11px] font-semibold text-[#C9A24B] text-center">
                  {TIER_PRICES[id]}
                </p>
                <p className="text-[8px] text-white/20 text-center">/year</p>
              </div>
            ))}
          </div>
        </div>

        {/* What founding means */}
        <div
          className="rounded-2xl px-5 py-5 mb-10 mt-8"
          style={{
            background: "rgba(201,162,75,0.07)",
            border: "1px solid rgba(201,162,75,0.15)",
          }}
        >
          <p className="text-[#C9A24B] text-[10px] uppercase tracking-[0.3em] font-semibold mb-3">
            What you get as a founding member
          </p>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              {
                icon: Tag,
                title: "Current FY Pricing",
                desc: "You pay today's rate for this membership year — before the next cycle update.",
              },
              {
                icon: Star,
                title: "Founding Member Status",
                desc: "Recognised as an early member when WENS Force launched its premium tier.",
              },
              {
                icon: CheckCircle,
                title: "Priority Onboarding",
                desc: "Your concierge calls within 12 hours of joining to set everything up.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3">
                <div
                  className="mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "rgba(201,162,75,0.15)" }}
                >
                  <Icon
                    size={13}
                    strokeWidth={1.75}
                    className="text-[#C9A24B]"
                  />
                </div>
                <div>
                  <p className="text-white/70 text-xs font-semibold leading-tight mb-0.5">
                    {title}
                  </p>
                  <p className="text-white/30 text-[11px] font-light leading-snug">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Deadline note */}
        <div
          className="rounded-2xl px-5 py-4 mb-8 flex items-start gap-3"
          style={{
            background: "rgba(239,68,68,0.07)",
            border: "1px solid rgba(239,68,68,0.2)",
          }}
        >
          <AlertTriangle
            size={15}
            className="text-red-400 shrink-0 mt-0.5"
            strokeWidth={2}
          />
          <p className="text-red-300/70 text-xs font-light leading-relaxed">
            <strong className="text-red-300 font-semibold">
              After June 30, 2026:
            </strong>{" "}
            New memberships will be onboarded at the updated pricing for the
            next financial year cycle. This window will not be extended.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/booking/premium"
            className="flex items-center justify-center gap-2 font-bold py-4 px-9 rounded-full text-sm transition-all hover:opacity-90 hover:shadow-[0_0_32px_rgba(201,162,75,0.35)] w-full sm:w-auto"
            style={{ backgroundColor: "#C9A24B", color: "#000" }}
          >
            <Gem size={15} strokeWidth={2} />
            Claim Founding Rate — Premium
          </Link>
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hi WENS Force, I want to claim Founding Member pricing before June 30. Please guide me.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 font-medium py-4 px-8 rounded-full text-sm transition-all w-full sm:w-auto"
            style={{
              border: "1px solid rgba(255,255,255,0.15)",
              color: "rgba(255,255,255,0.6)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
              e.currentTarget.style.color = "rgba(255,255,255,0.6)";
            }}
          >
            Ask Concierge →
          </a>
        </div>

        <p className="text-center text-white/15 text-xs mt-6">
          wensforce.com &nbsp;·&nbsp; +91-73046 07954 &nbsp;·&nbsp; Founding
          access closes 30 June 2026
        </p>
      </div>
    </section>
  );
}
