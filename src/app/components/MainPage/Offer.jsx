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
  Shield,
  Zap,
  Heart,
  Award,
  Clock,
  Gift,
} from "lucide-react";
import { offerApi } from "@/app/user-apis/offer.api";

const WA_NUMBER = "917304607954";

// ── Icon map ──────────────────────────────────────────────────────────────────
// Maps icon name strings from the API to actual Lucide components
const ICON_MAP = {
  Tag,
  Star,
  CheckCircle,
  Shield,
  Zap,
  Heart,
  Award,
  Clock,
  Gift,
  Crown,
  Gem,
};

const resolveIcon = (name) => ICON_MAP[name] ?? CheckCircle;

// ── helpers ───────────────────────────────────────────────────────────────────

const formatPrice = (price) =>
  price != null
    ? `₹${Number(price).toLocaleString("en-IN")}* + GST 18% Extra`
    : "—";

const toShortDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });

/**
 * Replace all occurrences of {date} and {packageName} in a template string.
 */
const interpolate = (template = "", vars = {}) =>
  template
    .replace(/\{date\}/g, vars.date ?? "")
    .replace(/\{packageName\}/g, vars.packageName ?? "");

// ── CountdownBlock ────────────────────────────────────────────────────────────

function CountdownBlock({ deadline }) {
  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const target = new Date(deadline).getTime();

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
  }, [deadline]);

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

// ── Skeleton ──────────────────────────────────────────────────────────────────

function BannerSkeleton() {
  return (
    <section
      className="relative overflow-hidden py-20 px-6"
      style={{ backgroundColor: "#060D1F" }}
    >
      <div className="relative max-w-3xl mx-auto space-y-6 animate-pulse">
        {/* alert pill */}
        <div className="flex justify-center">
          <div className="h-7 w-72 rounded-full bg-white/5" />
        </div>
        {/* eyebrow */}
        <div className="flex justify-center">
          <div className="h-3 w-56 rounded bg-white/5" />
        </div>
        {/* headline */}
        <div className="space-y-2 flex flex-col items-center">
          <div className="h-10 w-80 rounded bg-white/5" />
          <div className="h-10 w-64 rounded bg-white/5" />
        </div>
        {/* countdown placeholder */}
        <div className="flex justify-center gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-16 h-16 rounded-2xl bg-white/5" />
          ))}
        </div>
        {/* pricing pills */}
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 rounded-2xl bg-white/5" />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── FoundingMemberBanner ──────────────────────────────────────────────────────

export default function FoundingMemberBanner() {
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    offerApi
      .getOfferForUser()
      .then((res) => {
        // Support both { data: offer } and offer-as-root shapes
        setOffer(res?.data ?? res);
      })
      .catch((err) => {
        console.error("Failed to load offer:", err);
        setError(err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <BannerSkeleton />;

  // If the offer failed to load or is inactive, render nothing
  if (error || !offer || !offer.isActive) return null;

  // ── Derived values ────────────────────────────────────────────────────────

  const deadline = new Date(offer.endDate);
  const deadlineDateLabel = toShortDate(deadline);

  const featuredPkgs = offer.featuredPackages ?? [];
  const packageName = featuredPkgs.map((p) => p.name).join(" / ") || "Premium";
  const firstPkg = featuredPkgs[0];
  const pkgSlug = offer.ctaPrimaryHref ?? (firstPkg ? `/booking/${firstPkg.id}` : "#plans");

  // Helper: resolve template vars once
  const t = (str) => interpolate(str, { date: deadlineDateLabel, packageName });

  const benefits = Array.isArray(offer.benefits)
    ? [...offer.benefits].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    : [];

  const waMessage = encodeURIComponent(
    `Hi WENS Force, I want to claim Founding Member pricing before ${deadlineDateLabel}. Please guide me.`,
  );

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
            {t(offer.alertText)}
          </div>
        </div>

        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <Crown size={15} strokeWidth={1.5} className="text-[#C9A24B]" />
          <p className="text-[#C9A24B] text-[10px] tracking-[0.4em] uppercase font-semibold">
            {offer.eyebrow}
          </p>
          <Crown size={15} strokeWidth={1.5} className="text-[#C9A24B]" />
        </div>

        {/* Headline */}
        <h2 className="font-serif-display text-center text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
          {offer.title}
          <br />
          <span style={{ color: "#C9A24B" }}>{offer.titleAccent}</span>
        </h2>

        <p className="text-center text-white/40 text-sm font-light mb-10 max-w-lg mx-auto leading-relaxed">
          {t(offer.description)}
        </p>

        {/* Countdown */}
        <div className="mb-10">
          <p className="text-center text-white/30 text-[10px] uppercase tracking-[0.3em] font-medium mb-4">
            {offer.countdownLabel}
          </p>
          <CountdownBlock deadline={deadline} />
        </div>

        {/* Divider */}
        <div
          className="w-full h-px mb-10"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(201,162,75,0.3), transparent)",
          }}
        />

        {/* Featured packages pricing pills */}
        {featuredPkgs.length > 0 && (
          <div className="mb-10">
            <p className="text-center text-white/30 text-[10px] uppercase tracking-[0.3em] font-medium mb-5">
              {t(offer.pricingLabel)}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {featuredPkgs.map((p) => (
                <Link
                  key={p.id}
                  href={`/booking/${p.id}`}
                  className="flex flex-col items-center gap-1.5 rounded-2xl px-8 py-5 transition-all hover:scale-105 hover:bg-white/5 cursor-pointer"
                  style={{
                    background: "rgba(201,162,75,0.1)",
                    border: "1px solid rgba(201,162,75,0.3)",
                    minWidth: 180,
                  }}
                >
                  <p className="text-[9px] text-white/40 uppercase tracking-wide font-light text-center">
                    {p.name}
                  </p>
                  <p className="text-[13px] font-semibold text-[#C9A24B] text-center">
                    {formatPrice(p.discountedPrice ?? p.regularPrice)}
                  </p>
                  {p.discountedPrice && p.regularPrice && (
                    <p className="text-[10px] text-white/20 line-through text-center">
                      {`₹${Number(p.regularPrice).toLocaleString("en-IN")}`}
                    </p>
                  )}
                  <p className="text-[8px] text-white/20 text-center">/year</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* What founding means — dynamic benefits from API */}
        {benefits.length > 0 && (
          <div
            className="rounded-2xl px-5 py-5 mb-10 mt-8"
            style={{
              background: "rgba(201,162,75,0.07)",
              border: "1px solid rgba(201,162,75,0.15)",
            }}
          >
            <p className="text-[#C9A24B] text-[10px] uppercase tracking-[0.3em] font-semibold mb-3">
              {offer.benefitsHeading}
            </p>
            <div
              className="gap-3"
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${Math.min(benefits.length, 3)}, minmax(0, 1fr))`,
              }}
            >
              {benefits.map((benefit) => {
                const Icon = resolveIcon(benefit.icon);
                return (
                  <div key={benefit.id} className="flex items-start gap-3">
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
                        {benefit.title}
                      </p>
                      <p className="text-white/30 text-[11px] font-light leading-snug">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

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
              {t(offer.deadlineNoteStrong)}{" "}
            </strong>
            {t(offer.deadlineNoteBody)}
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href={pkgSlug}
            className="flex items-center justify-center gap-2 font-bold py-4 px-9 rounded-full text-sm transition-all hover:opacity-90 hover:shadow-[0_0_32px_rgba(201,162,75,0.35)] w-full sm:w-auto"
            style={{ backgroundColor: "#C9A24B", color: "#000" }}
          >
            <Gem size={15} strokeWidth={2} />
            {t(offer.ctaPrimaryText)}
          </Link>
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${waMessage}`}
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
            {offer.ctaSecondaryText}
          </a>
        </div>

        <p className="text-center text-white/15 text-xs mt-6">
          {t(offer.footerNote)}
        </p>
      </div>
    </section>
  );
}