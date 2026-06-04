"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Car,
  Users,
  ShieldCheck,
  Gem,
  Crown,
  Check,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { plans } from "../data/welcomeIndia";

const INR = (n) => "₹" + Number(n).toLocaleString("en-IN");

const CURRENCIES = [
  { code: "USD", flag: "🇺🇸", symbol: "$",  name: "US Dollar" },
  { code: "EUR", flag: "🇪🇺", symbol: "€",  name: "Euro" },
  { code: "JPY", flag: "🇯🇵", symbol: "¥",  name: "Japanese Yen" },
  { code: "GBP", flag: "🇬🇧", symbol: "£",  name: "British Pound" },
  { code: "CNY", flag: "🇨🇳", symbol: "¥",  name: "Chinese Yuan" },
  { code: "CHF", flag: "🇨🇭", symbol: "Fr", name: "Swiss Franc" },
  { code: "CAD", flag: "🇨🇦", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", flag: "🇦🇺", symbol: "A$", name: "Australian Dollar" },
  { code: "INR", flag: "🇮🇳", symbol: "₹",  name: "Indian Rupee" },
];

function fmtForeign(amount, code) {
  const cur = CURRENCIES.find((c) => c.code === code);
  if (!cur || !amount) return "";
  const num = Number(amount);
  const decimals = ["JPY", "KRW", "VND", "IDR"].includes(code) ? 0 : 2;
  return cur.symbol + num.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const M = {
  "comfortable-arrival": {
    num: "01",
    Icon: Car,
    cta: "Book Comfortable Arrival",
    accent: "#8e99b0",
    imgFilter: "grayscale(40%) brightness(.54) contrast(1.05)",
    imgOverlay:
      "linear-gradient(270deg,rgba(10,14,24,.0) 0%,rgba(10,14,24,.55) 60%,rgba(10,14,24,.94) 100%)",
    border: "rgba(142,153,176,.22)",
    shadow: "0 2px 20px rgba(0,0,0,.10)",
    hoverShadow: "0 14px 48px rgba(0,0,0,.24)",
    bg: "rgba(10,14,24,.96)",
    priceColor: "#e8eaf0",
    subColor: "rgba(200,206,220,.52)",
    statBg: "rgba(255,255,255,.06)",
    statBorder: "rgba(255,255,255,.09)",
    statLabel: "rgba(200,206,220,.40)",
    statValue: "#d0d4e0",
    featColor: "rgba(200,210,225,.76)",
    checkBg: "rgba(255,255,255,.07)",
    checkColor: "rgba(200,210,225,.55)",
    isElite: false,
    ctaClass: "bronze-cta",
  },
  "arrive-in-style": {
    num: "02",
    Icon: Users,
    cta: "Arrive in Style",
    accent: "#5a8fc2",
    imgFilter: "grayscale(22%) brightness(.52) contrast(1.10)",
    imgOverlay:
      "linear-gradient(270deg,rgba(8,18,38,.0) 0%,rgba(8,18,38,.55) 60%,rgba(8,18,38,.94) 100%)",
    border: "rgba(90,143,194,.22)",
    shadow: "0 2px 20px rgba(8,18,38,.12)",
    hoverShadow: "0 14px 48px rgba(8,18,38,.28)",
    bg: "rgba(8,18,38,.96)",
    priceColor: "#dce8f5",
    subColor: "rgba(180,210,240,.52)",
    statBg: "rgba(255,255,255,.06)",
    statBorder: "rgba(255,255,255,.09)",
    statLabel: "rgba(180,210,240,.40)",
    statValue: "#c0d8f0",
    featColor: "rgba(180,210,240,.76)",
    checkBg: "rgba(255,255,255,.07)",
    checkColor: "rgba(180,210,240,.55)",
    isElite: false,
    ctaClass: "silver-cta",
  },
  "arrival-in-grandeur": {
    num: "03",
    Icon: ShieldCheck,
    cta: "Book en Grandeur",
    accent: "#c9a24b",
    imgFilter: "grayscale(25%) brightness(.62) contrast(1.20) saturate(1.15)",
    imgOverlay:
      "linear-gradient(270deg,rgba(8,5,0,.0) 0%,rgba(8,5,0,.48) 55%,rgba(8,5,0,.95) 100%)",
    border: "rgba(201,162,75,.55)",
    shadow:
      "0 0 0 1px rgba(201,162,75,.45),0 20px 60px rgba(201,162,75,.14),0 6px 20px rgba(0,0,0,.42)",
    hoverShadow:
      "0 0 0 1.5px rgba(201,162,75,.75),0 28px 72px rgba(201,162,75,.26),0 10px 28px rgba(0,0,0,.52)",
    bg: "rgba(8,5,0,.97)",
    priceColor: "#f0d878",
    subColor: "rgba(201,162,75,.65)",
    statBg: "rgba(201,162,75,.10)",
    statBorder: "rgba(201,162,75,.20)",
    statLabel: "rgba(201,162,75,.52)",
    statValue: "#e8c97a",
    featColor: "rgba(240,210,140,.84)",
    checkBg: "rgba(201,162,75,.14)",
    checkColor: "#c9a24b",
    isElite: true,
    ctaClass: "platinum-cta",
  },
  "ultimate-convoy-matrix": {
    num: "04",
    Icon: Gem,
    cta: "Book Convoy",
    accent: "#7a8a9a",
    imgFilter: "grayscale(35%) brightness(.50) contrast(1.08)",
    imgOverlay:
      "linear-gradient(270deg,rgba(12,16,22,.0) 0%,rgba(12,16,22,.56) 60%,rgba(12,16,22,.95) 100%)",
    border: "rgba(122,138,154,.20)",
    shadow: "0 2px 20px rgba(0,0,0,.10)",
    hoverShadow: "0 14px 48px rgba(0,0,0,.24)",
    bg: "rgba(12,16,22,.96)",
    priceColor: "#dde2e8",
    subColor: "rgba(190,200,215,.52)",
    statBg: "rgba(255,255,255,.06)",
    statBorder: "rgba(255,255,255,.09)",
    statLabel: "rgba(190,200,215,.40)",
    statValue: "#c8d2dc",
    featColor: "rgba(190,200,215,.76)",
    checkBg: "rgba(255,255,255,.07)",
    checkColor: "rgba(190,200,215,.55)",
    isElite: false,
    ctaClass: "gold-cta",
  },
  "end-to-end-concierge": {
    num: "05",
    Icon: Crown,
    cta: "Book VIP Concierge",
    accent: "#9b8a6a",
    imgFilter: "brightness(.44) contrast(1.15) saturate(.75)",
    imgOverlay:
      "linear-gradient(270deg,rgba(8,6,4,.0) 0%,rgba(8,6,4,.58) 60%,rgba(8,6,4,.96) 100%)",
    border: "rgba(155,138,106,.40)",
    shadow:
      "0 0 0 1px rgba(155,138,106,.35),0 20px 60px rgba(155,138,106,.10),0 6px 20px rgba(0,0,0,.38)",
    hoverShadow:
      "0 0 0 1.5px rgba(155,138,106,.65),0 28px 72px rgba(155,138,106,.20),0 10px 28px rgba(0,0,0,.50)",
    bg: "rgba(8,6,4,.98)",
    priceColor: "#e8d8b0",
    subColor: "rgba(200,180,130,.55)",
    statBg: "rgba(155,138,106,.10)",
    statBorder: "rgba(155,138,106,.22)",
    statLabel: "rgba(200,180,130,.52)",
    statValue: "#d8c890",
    featColor: "rgba(220,200,160,.84)",
    checkBg: "rgba(155,138,106,.16)",
    checkColor: "#9b8a6a",
    isElite: true,
    ctaClass: "sovereign-cta",
  },
};

const ORDER = ["comfortable-arrival", "arrive-in-style", "arrival-in-grandeur", "ultimate-convoy-matrix", "end-to-end-concierge"];

// Fixed USD prices (not exchange-rate based)
const USD_PRICES = {
  "comfortable-arrival": 100,
  "arrive-in-style": 150,
  "arrival-in-grandeur": 370,
  "ultimate-convoy-matrix": 900,
  "end-to-end-concierge": 2100,
};

export default function WelcomeIndiaCard() {
  const [currency, setCurrency] = useState("INR");
  const [rate, setRate] = useState(1);       // INR per 1 unit of selected currency
  const [rateLoading, setRateLoading] = useState(false);

  useEffect(() => {
    if (currency === "INR" || currency === "USD") { setRate(1); return; }
    setRateLoading(true);
    fetch(`/api/exchange-rate?currency=${currency}`)
      .then((r) => r.json())
      .then((d) => setRate(d.rate ?? 1))
      .catch(() => setRate(1))
      .finally(() => setRateLoading(false));
  }, [currency]);

  const convertPrice = (inrAmount, planId) => {
    if (currency === "INR") return INR(inrAmount);
    if (currency === "USD" && planId && USD_PRICES[planId] !== undefined) {
      // For anchor/regular price, scale proportionally from the plan's base price
      const basePlanPrice = plans.find((p) => p.id === planId)?.price ?? inrAmount;
      const usdBase = USD_PRICES[planId];
      const scaled = Math.round((inrAmount / basePlanPrice) * usdBase);
      return "$" + scaled.toLocaleString("en-US");
    }
    if (rateLoading) return "…";
    return fmtForeign(inrAmount / rate, currency);
  };

  const selectedCur = CURRENCIES.find((c) => c.code === currency);
  return (
    <section id="plans" className="bg-[#EDE8DF] px-5 pt-[88px] pb-[112px]">
      <style>{`
        @keyframes goldPulse {
          0%,100%{box-shadow:0 0 0 1px rgba(201,162,75,.45),0 20px 60px rgba(201,162,75,.14),0 6px 20px rgba(0,0,0,.42);}
          50%{box-shadow:0 0 0 1.5px rgba(201,162,75,.75),0 26px 70px rgba(201,162,75,.24),0 6px 20px rgba(0,0,0,.42);}
        }
        @keyframes pricePulse {
          0%, 100% { transform: scale(1); filter: brightness(1); }
          50% { transform: scale(1.03); filter: brightness(1.1); }
        }
        @keyframes regularPricePop {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.02); }
        }
        @keyframes shine {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        .wi-pc-img{transition:transform .9s cubic-bezier(.22,1,.36,1);}
        .wi-plan-card:hover .wi-pc-img{transform:scale(1.06);}
        .wi-elite-ring{animation:goldPulse 2.8s ease-in-out infinite;}
        .wi-elite-ring:hover{animation:none;}
        .wi-price-highlight{color:#f0d878 !important;font-weight:900;letter-spacing:-.02em;}
        .wi-regular-price-highlight{animation:regularPricePop 2.2s ease-in-out infinite;}
        .wi-price-badge{animation:pricePulse 2s ease-in-out infinite;}
        .wi-bronze-cta{position:relative;background-color:#C9733D;color:#FFFFFF;transition:all 0.3s ease-in-out;overflow:hidden;}
        .wi-bronze-cta:hover{box-shadow:0 0 0 1.5px rgba(139,111,71,.75),0 28px 72px rgba(139,111,71,.26),0 10px 28px rgba(0,0,0,.52);}
        .wi-silver-cta{position:relative;background-color:#dadada;color:#000000;transition:all 0.3s ease-in-out;overflow:hidden;}
        .wi-silver-cta:hover{box-shadow:0 0 0 1.5px rgba(200,200,200,.75),0 28px 72px rgba(200,200,200,.26),0 10px 28px rgba(0,0,0,.52);}
        .wi-platinum-cta{position:relative;background-color:#C9A24B;color:#FFFFFF;transition:all 0.3s ease-in-out;overflow:hidden;}
        .wi-platinum-cta:hover{box-shadow:0 0 0 1.5px rgba(201,162,75,.75),0 28px 72px rgba(201,162,75,.26),0 10px 28px rgba(0,0,0,.52);}
        .wi-gold-cta{position:relative;background-color:#4A90E2;color:#FFFFFF;transition:all 0.3s ease-in-out;overflow:hidden;}
        .wi-gold-cta:hover{box-shadow:0 0 0 1.5px rgba(74,144,226,.75),0 28px 72px rgba(74,144,226,.26),0 10px 28px rgba(0,0,0,.52);}
        .wi-sovereign-cta{position:relative;background:linear-gradient(135deg,#9b8a6a 0%,#c8b07a 50%,#9b8a6a 100%);color:#08060c;transition:all 0.3s ease-in-out;overflow:hidden;}
        .wi-sovereign-cta:hover{box-shadow:0 0 0 1.5px rgba(155,138,106,.80),0 28px 72px rgba(155,138,106,.30),0 10px 28px rgba(0,0,0,.55);transform:translateY(-2px);filter:brightness(1.08);}
        .wi-sovereign-cta::before{content:'';position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.4),transparent);animation:shine 3s cubic-bezier(.4,0,.2,1) infinite;}
        .wi-bronze-cta::before,.wi-silver-cta::before,.wi-gold-cta::before,.wi-platinum-cta::before{
          content:'';position:absolute;top:0;left:-100%;width:100%;height:100%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,.4),transparent);
          animation:shine 3s cubic-bezier(.4,0,.2,1) infinite;
        }
        .wi-platinum-cta:hover,.wi-silver-cta:hover,.wi-bronze-cta:hover,.wi-gold-cta:hover{transform:translateY(-2px);filter:brightness(1.1);}
        .wi-ghost-cta{background:rgba(255,255,255,.10);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.22);box-shadow:0 2px 14px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.10);transition:background .22s,border-color .22s,box-shadow .22s,transform .2s;}
        .wi-ghost-cta:hover{background:rgba(255,255,255,.20);border-color:rgba(255,255,255,.38);box-shadow:0 6px 24px rgba(0,0,0,.26),inset 0 1px 0 rgba(255,255,255,.15);transform:translateY(-2px);}
        @media(max-width:860px){
          .wi-plans-grid{grid-template-columns:1fr !important;}
          .wi-anchor-card{grid-column:span 1 !important;}
        }
        @media(max-width:480px){
          .wi-price-badge{font-size:4.5px !important;padding:3px 5px !important;}
        }
      `}</style>

      <div className="max-w-[1280px] mx-auto">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-4 mb-[18px]">
            <div className="h-px w-12 bg-linear-to-r from-transparent to-[rgba(184,146,74,.45)]" />
            <span className="text-[9px] font-bold tracking-[.52em] uppercase text-[#a07838]">
              Package Tiers
            </span>
            <div className="h-px w-12 bg-linear-to-l from-transparent to-[rgba(184,146,74,.45)]" />
          </div>
          <h2 className="font-serif text-[clamp(28px,3.6vw,44px)] font-bold text-[#0B1E3F] tracking-[-0.03em] leading-[1.08] mb-[14px]">
            Choose Your Package
          </h2>
          <p className="text-[13px] font-light text-[#8a7e6e] leading-[1.75] max-w-[320px] mx-auto">
            Premium airport transfers &amp; luxury transport
            — all-inclusive packages, book in minutes.
          </p>
        </div>

        {/* Currency picker — centered, classic modern */}
        <div className="flex flex-col items-center gap-3 mb-12">
          <span className="text-[8px] font-bold tracking-[.45em] uppercase text-[#a07838]">View prices in</span>
          <div
            className="inline-flex flex-wrap justify-center gap-1 p-1.5 rounded-2xl"
            style={{ background: 'rgba(11,30,63,.07)', border: '1px solid rgba(184,146,74,.15)' }}
          >
            {CURRENCIES.map((c) => {
              const active = currency === c.code;
              return (
                <button
                  key={c.code}
                  onClick={() => setCurrency(c.code)}
                  title={c.name}
                  className="inline-flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all duration-200"
                  style={{
                    background: active ? '#0B1E3F' : 'transparent',
                    color: active ? '#f0d878' : '#7a6a50',
                    boxShadow: active ? '0 2px 12px rgba(11,30,63,.22), inset 0 1px 0 rgba(255,255,255,.06)' : 'none',
                    border: active ? '1px solid rgba(201,162,75,.35)' : '1px solid transparent',
                  }}
                >
                  <span className="text-[18px] leading-none">{c.flag}</span>
                  <span className="text-[9px] font-black tracking-[.08em]">{c.code}</span>
                </button>
              );
            })}
          </div>
          {rateLoading && (
            <span className="text-[9px] text-[#a07838] animate-pulse tracking-wider">Fetching rate…</span>
          )}
          {!rateLoading && currency !== "INR" && currency !== "USD" && (
            <span className="text-[9px] text-[#a07838]/60 tracking-[.12em]">1 {currency} ≈ {INR(Math.round(rate))}</span>
          )}
        </div>

        {/* 2-column grid */}
        <div className="wi-plans-grid grid grid-cols-2 gap-[18px] items-start">
          {ORDER.map((id) => {
            const plan = plans.find((p) => p.id === id);
            const m = M[id];
            const isFullWidth = id === "end-to-end-concierge";
            const showPrivCount = isFullWidth ? 5 : 3;

            return (
              <div
                key={id}
                className={`wi-plan-card${m.isElite ? " wi-elite-ring" : ""}${isFullWidth ? " wi-anchor-card" : ""} flex flex-col xl:flex-row ${isFullWidth ? "col-span-2" : "col-span-1"} rounded-2xl overflow-hidden cursor-pointer relative`}
                style={{
                  border: `1px solid ${m.border}`,
                  boxShadow: m.shadow,
                  background: m.bg,
                  transition:
                    "box-shadow .4s ease,transform .35s cubic-bezier(.22,1,.36,1),opacity .3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = m.hoverShadow;
                  e.currentTarget.style.transform = m.isElite
                    ? "scale(1.02) translateY(-3px)"
                    : "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = m.shadow;
                  e.currentTarget.style.transform = "none";
                }}
              >
                {/* Image panel */}
                <div className={`card-img-panel relative shrink-0 overflow-hidden ${isFullWidth ? "w-full h-80 xl:w-[45%] xl:h-auto" : "w-full h-[200px] xl:w-[48%] xl:h-auto"}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={plan.image}
                    alt={plan.name}
                    className="wi-pc-img absolute inset-0 w-full h-full object-cover"
                    style={{ filter: m.imgFilter, transform: "scale(1)" }}
                  />
                  {m.isElite && (
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          "radial-gradient(ellipse 100% 40% at 50% 0%,rgba(201,162,75,.14) 0%,transparent 70%)",
                      }}
                    />
                  )}
                  <span
                    className="absolute top-[14px] left-[14px] text-[10px] font-black tracking-[.18em] tabular-nums"
                    style={{
                      color: m.isElite ? m.accent : "rgba(255,255,255,.18)",
                    }}
                  >
                    {m.num}
                  </span>
                </div>

                {/* Content panel */}
                <div className="card-body flex-1 pt-5 px-6 pb-[22px] flex flex-col relative min-w-0">
                  {m.isElite && (
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          "radial-gradient(ellipse 80% 50% at 100% 0%,rgba(201,162,75,.08) 0%,transparent 70%)",
                      }}
                    />
                  )}

                  {/* Tier name + badge */}
                  <div className="flex items-center justify-between mb-3 relative">
                    <div className="flex items-center gap-2">
                      <m.Icon
                        size={12}
                        strokeWidth={1.5}
                        className="shrink-0"
                        style={{
                          color: m.isElite
                            ? m.accent
                            : "rgba(255,255,255,.32)",
                        }}
                      />
                      <span
                        className="text-[9.5px] font-black tracking-[.38em] uppercase"
                        style={{
                          color: m.isElite
                            ? m.accent
                            : "rgba(255,255,255,.52)",
                        }}
                      >
                        {plan.name}
                      </span>
                    </div>
                    {plan.isBestValue ? (
                      <div
                        className="flex items-center gap-1 px-[11px] py-1 rounded-full shrink-0"
                        style={{
                          background: "rgba(201,162,75,.88)",
                          color: "#0c0800",
                        }}
                      >
                        <Sparkles size={7} strokeWidth={2.5} />
                        <span className="text-[7px] font-black tracking-[.24em] uppercase">
                          Best Value
                        </span>
                      </div>
                    ) : plan.tag ? (
                      <span className="text-[6.5px] font-extrabold tracking-[.20em] uppercase px-2 py-0.5 rounded-[3px] bg-white/[.06] text-white/30 border border-white/[.08]">
                        {plan.tag}
                      </span>
                    ) : null}
                  </div>

                  {/* Separator */}
                  <div
                    className="h-px mb-[14px] relative"
                    style={{
                      background: m.isElite
                        ? `linear-gradient(90deg,${m.accent}50,transparent)`
                        : "rgba(255,255,255,.07)",
                    }}
                  />

                  {/* PRICE */}
                  <div
                    className="flex flex-col items-start relative mb-4 py-3 pt-5 px-[10px] rounded-lg backdrop-blur-sm"
                    style={{
                      background: m.isElite
                        ? "linear-gradient(135deg,rgba(240,210,140,.10) 0%,rgba(201,162,75,.06) 100%)"
                        : "linear-gradient(135deg,rgba(240,210,140,.08) 0%,rgba(201,162,75,.03) 100%)",
                      border: m.isElite
                        ? "1.5px solid rgba(240,210,140,.28)"
                        : "1px solid rgba(240,210,140,.18)",
                    }}
                  >
                    <span
                      className="wi-price-badge absolute top-0 right-0 text-[5.5px] font-black tracking-[.12em] uppercase px-1.5 py-1 rounded z-10 whitespace-nowrap shrink-0 text-[#f0d878]"
                      style={{
                        background: m.isElite
                          ? "rgba(240,216,96,.22)"
                          : "rgba(240,210,140,.14)",
                        border: m.isElite
                          ? "1.5px solid rgba(240,216,96,.45)"
                          : "1px solid rgba(240,210,140,.32)",
                      }}
                    >
                      Limited
                    </span>

                    {/* Price Row */}
                    <div className="flex items-center justify-between gap-[10px] mb-2 w-full">
                      {/* Regular Price */}
                      <div className="flex flex-col items-center gap-[3px] flex-[0.75]">
                        <span
                          className="text-[6px] font-extrabold tracking-[.20em] uppercase opacity-75"
                          style={{
                            color: m.isElite
                              ? m.accent
                              : "rgba(240,210,140,.65)",
                          }}
                        >
                          Regular
                        </span>
                        <span
                          className="wi-regular-price-highlight text-[13px] line-through font-black"
                          style={{ color: m.isElite ? m.accent : "#f0d878" }}
                        >
                          {convertPrice(plan.anchorPrice || plan.price, id)}*
                        </span>
                      </div>

                      <span className="text-[10px] text-white font-bold tracking-[.18em] uppercase text-center leading-[1.1] flex-[0.7] pt-0.5 italic">
                        Now <br /> Available
                      </span>

                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 16 16"
                        fill="none"
                        className="opacity-70 text-white shrink-0 mt-px transition-all duration-300"
                      >
                        <path
                          d="M2 8h10M12 4l4 4m-4 4l4-4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>

                      {/* Current Price */}
                      <div className="flex flex-col items-center gap-px flex-[0.95]">
                        <span className="wi-price-highlight text-[17px] font-black tracking-[-0.02em] leading-none">
                          {convertPrice(plan.price, id)}*
                        </span>
                        <span
                          className="text-[7px] font-bold opacity-55"
                          style={{ color: "#f0d878" }}
                        >
                          All Inclusive
                        </span>
                      </div>
                    </div>

                    {/* Selling Fast */}
                    <div
                      className="flex items-center justify-start gap-[3px] text-[7px]"
                      style={{ color: m.isElite ? m.subColor : "white" }}
                    >
                      <span
                        className="w-1 h-1 rounded-full shrink-0"
                        style={{
                          background: m.isElite ? m.accent : "white",
                          boxShadow: m.isElite
                            ? `0 0 6px ${m.accent}`
                            : "none",
                        }}
                      />
                      <span className="font-bold">Selling Fast</span>
                      <span className="opacity-50">·</span>
                      <span className="font-medium opacity-80">
                        {100 - plan.confirmed} Available
                      </span>
                    </div>
                  </div>

                  {/* STATS */}
                  <div className={`grid ${isFullWidth ? "grid-cols-2 xl:grid-cols-4" : "grid-cols-2"} gap-2 mb-[14px] relative`}>
                    {[
                      { label: "Trips / Year", value: `${plan.trips} Trips` },
                      { label: "Vehicle", value: plan.vehicleType },
                      {
                        label: "Security",
                        value: plan.bodyguard || "Not Included",
                      },
                      { label: "Validity", value: plan.validity },
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        className="py-2 px-[10px] rounded-lg"
                        style={{
                          background: m.statBg,
                          border: `1px solid ${m.statBorder}`,
                        }}
                      >
                        <div
                          className="text-[7px] font-semibold tracking-[.16em] uppercase mb-[3px]"
                          style={{ color: m.statLabel }}
                        >
                          {label}
                        </div>
                        <div
                          className="text-[11.5px] font-bold leading-[1.2]"
                          style={{ color: m.statValue }}
                        >
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Separator */}
                  <div className="h-px mb-[14px] bg-white/[.06] relative" />

                  {/* PRIVILEGES */}
                  <div className="flex flex-col gap-[9px] mb-5 flex-1 relative">
                    {plan.privileges.slice(0, showPrivCount).map((priv, i) => (
                      <div key={i} className="flex items-start gap-[9px]">
                        <div
                          className="w-4 h-4 rounded-full shrink-0 mt-px flex items-center justify-center"
                          style={{
                            background: m.checkBg,
                            border: m.isElite
                              ? "1px solid rgba(201,162,75,.20)"
                              : "none",
                          }}
                        >
                          <Check
                            size={8}
                            strokeWidth={3}
                            style={{ color: m.checkColor }}
                          />
                        </div>
                        <span
                          className={`text-xs leading-[1.44] ${m.isElite ? "font-medium" : "font-normal"}`}
                          style={{ color: m.featColor }}
                        >
                          {priv.title}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA row */}
                  <div className="flex items-center justify-between gap-3 relative">
                    <Link
                      href={`/booking/${id}?currency=${currency}`}
                      className={`wi-${m.ctaClass} flex items-center justify-center gap-2 flex-1 min-h-[44px] py-2 rounded-lg text-[11px] font-extrabold tracking-[.14em] uppercase no-underline text-center`}
                      style={{ boxShadow: "0 4px 22px rgba(0,0,0,.2)" }}
                    >
                      {m.cta}
                      <ArrowRight size={11} strokeWidth={2.5} />
                    </Link>
                    <Link
                      href={`/membership/${id}`}
                      className="text-[8.5px] font-medium tracking-[.18em] uppercase no-underline opacity-[.55] hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shrink-0"
                      style={{ color: m.subColor }}
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust strip */}
        <div className="flex items-center justify-center gap-5 mt-16">
          <div className="h-px flex-1 max-w-16 bg-linear-to-r from-transparent to-[rgba(160,140,100,.25)]" />
          <p className="text-[9px] font-medium tracking-[.40em] uppercase text-[rgba(140,120,80,.46)] whitespace-nowrap m-0">
            Instant Activation &nbsp;&middot;&nbsp; No Hidden Fees
          </p>
          <div className="h-px flex-1 max-w-16 bg-linear-to-l from-transparent to-[rgba(160,140,100,.25)]" />
        </div>
      </div>
    </section>
  );
}
