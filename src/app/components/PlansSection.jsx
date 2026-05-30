"use client";

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
import { plans } from "../data/plans";

const INR = (n) => "₹" + Number(n).toLocaleString("en-IN");

const ANCHOR_PRICES = {
  essential: 34999,
  executive: 64999,
  premium: 99999,
  elite: 130000,
  sovereign: 250000,
};

const M = {
  essential: {
    num: "01",
    Icon: Car,
    cta: "Claim My Spot",
    img: "/cards/Sedan_Essential_Desktop.png",
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
  },
  executive: {
    num: "02",
    Icon: Users,
    cta: "Unlock Executive",
    img: "/cards/BMW_Executive_v2.png",
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
  },
  premium: {
    num: "03",
    Icon: ShieldCheck,
    cta: "Go Premium Now",
    img: "/cards/GLC_Premium_v2.png",
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
  },
  elite: {
    num: "04",
    Icon: Gem,
    cta: "Claim Elite Access",
    img: "/cards/S-Class_Elite_v2.jpg",
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
  },
  sovereign: {
    num: "05",
    Icon: Crown,
    cta: "Reserve Sovereign",
    img: "/cards/Defender_Sovereign_v2.png",
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
    isElite: false,
  },
};

const ORDER = ["essential", "executive", "premium", "elite", "sovereign"];

export default function PlansSection() {
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
        .pc-img{transition:transform .9s cubic-bezier(.22,1,.36,1);}
        .plan-card:hover .pc-img{transform:scale(1.06);}
        .elite-ring{animation:goldPulse 2.8s ease-in-out infinite;}
        .elite-ring:hover{animation:none;}
        .price-highlight{color:#f0d878 !important;font-weight:900;letter-spacing:-.02em;}
        .regular-price-highlight{animation:regularPricePop 2.2s ease-in-out infinite;}
        .price-badge{animation:pricePulse 2s ease-in-out infinite;}
        .bronze-cta{position:relative;background-color:#C9733D;color:#FFFFFF;transition:all 0.3s ease-in-out;overflow:hidden;}
        .bronze-cta:hover{box-shadow:0 0 0 1.5px rgba(139,111,71,.75),0 28px 72px rgba(139,111,71,.26),0 10px 28px rgba(0,0,0,.52);}
        .silver-cta{position:relative;background-color:#dadada;color:#000000;transition:all 0.3s ease-in-out;overflow:hidden;}
        .silver-cta:hover{box-shadow:0 0 0 1.5px rgba(200,200,200,.75),0 28px 72px rgba(200,200,200,.26),0 10px 28px rgba(0,0,0,.52);}
        .platinum-cta{position:relative;background-color:#C9A24B;color:#FFFFFF;transition:all 0.3s ease-in-out;overflow:hidden;}
        .platinum-cta:hover{box-shadow:0 0 0 1.5px rgba(201,162,75,.75),0 28px 72px rgba(201,162,75,.26),0 10px 28px rgba(0,0,0,.52);}
        .gold-cta{position:relative;background-color:#4A90E2;color:#FFFFFF;transition:all 0.3s ease-in-out;overflow:hidden;}
        .gold-cta:hover{box-shadow:0 0 0 1.5px rgba(74,144,226,.75),0 28px 72px rgba(74,144,226,.26),0 10px 28px rgba(0,0,0,.52);}
        .diamond-cta{position:relative;background-color:#10B981;color:#FFFFFF;transition:all 0.3s ease-in-out;overflow:hidden;}
        .diamond-cta:hover{box-shadow:0 0 0 1.5px rgba(16,185,129,.75),0 28px 72px rgba(16,185,129,.26),0 10px 28px rgba(0,0,0,.52);}
        .bronze-cta::before,.silver-cta::before,.gold-cta::before,.platinum-cta::before,.diamond-cta::before{
          content:'';position:absolute;top:0;left:-100%;width:100%;height:100%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,.4),transparent);
          animation:shine 3s cubic-bezier(.4,0,.2,1) infinite;
        }
        .platinum-cta:hover,.silver-cta:hover,.bronze-cta:hover,.gold-cta:hover,.diamond-cta:hover{transform:translateY(-2px);filter:brightness(1.1);}
        .ghost-cta{background:rgba(255,255,255,.10);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.22);box-shadow:0 2px 14px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.10);transition:background .22s,border-color .22s,box-shadow .22s,transform .2s;}
        .ghost-cta:hover{background:rgba(255,255,255,.20);border-color:rgba(255,255,255,.38);box-shadow:0 6px 24px rgba(0,0,0,.26),inset 0 1px 0 rgba(255,255,255,.15);transform:translateY(-2px);}
        @media(max-width:860px){
          .plans-grid{grid-template-columns:1fr !important;}
          .sovereign-card{grid-column:span 1 !important;}
        }
        @media(max-width:480px){
          .price-badge{font-size:4.5px !important;padding:3px 5px !important;}
        }
      `}</style>

      <div className="max-w-[1280px] mx-auto">
        {/* Header */}
        <div className="text-center mb-[72px]">
          <div className="inline-flex items-center gap-4 mb-[18px]">
            <div className="h-px w-12 bg-linear-to-r from-transparent to-[rgba(184,146,74,.45)]" />
            <span className="text-[9px] font-bold tracking-[.52em] uppercase text-[#a07838]">
              Membership Tiers
            </span>
            <div className="h-px w-12 bg-linear-to-l from-transparent to-[rgba(184,146,74,.45)]" />
          </div>
          <h2 className="font-serif text-[clamp(28px,3.6vw,44px)] font-bold text-[#0B1E3F] tracking-[-0.03em] leading-[1.08] mb-[14px]">
            Choose Your Membership
          </h2>
          <p className="text-[13px] font-light text-[#8a7e6e] leading-[1.75] max-w-[320px] mx-auto">
            VIP darshan, airport lounges, 24×7 concierge &amp; luxury transport
            — curated for the year ahead.
          </p>
        </div>

        {/* 2-column grid */}
        <div className="plans-grid grid grid-cols-2 gap-[18px] items-start">
          {ORDER.map((id) => {
            const plan = plans.find((p) => p.id === id);
            const m = M[id];
            const anchor = ANCHOR_PRICES[id];
            const save = anchor
              ? Math.round((1 - plan.price / anchor) * 100)
              : 0;
            const isSovereign = id === "sovereign";
            const showPrivCount = isSovereign ? 5 : 3;

            return (
              <div
                key={id}
                className={`plan-card${m.isElite ? " elite-ring" : ""}${isSovereign ? " sovereign-card" : ""} flex flex-col xl:flex-row ${isSovereign ? "col-span-2" : "col-span-1"} rounded-2xl overflow-hidden cursor-pointer relative`}
                style={{
                  border: `1px solid ${m.border}`,
                  boxShadow: m.shadow,
                  background: m.bg,
                  transition: "box-shadow .4s ease,transform .35s cubic-bezier(.22,1,.36,1),opacity .3s ease",
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
                <div
                  className={`card-img-panel relative shrink-0 overflow-hidden ${isSovereign ? "w-full h-80 xl:w-[45%] xl:h-auto" : "w-full h-[200px] xl:w-[48%] xl:h-auto"}`}
                >
                  <img
                    src={m.img}
                    alt={plan.name}
                    className="pc-img absolute inset-0 w-full h-full object-cover"
                    style={{ filter: m.imgFilter, transform: "scale(1)", }}
                  />
                  {m.isElite && (
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{ background: "radial-gradient(ellipse 100% 40% at 50% 0%,rgba(201,162,75,.14) 0%,transparent 70%)" }}
                    />
                  )}
                  <span
                    className="absolute top-[14px] left-[14px] text-[10px] font-black tracking-[.18em] tabular-nums"
                    style={{ color: m.isElite ? m.accent : "rgba(255,255,255,.18)" }}
                  >
                    {m.num}
                  </span>
                </div>

                {/* Content panel */}
                <div className="card-body flex-1 pt-5 px-6 pb-[22px] flex flex-col relative min-w-0">
                  {m.isElite && (
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{ background: "radial-gradient(ellipse 80% 50% at 100% 0%,rgba(201,162,75,.08) 0%,transparent 70%)" }}
                    />
                  )}

                  {/* Tier name + badge */}
                  <div className="flex items-center justify-between mb-3 relative">
                    <div className="flex items-center gap-2">
                      <m.Icon
                        size={12}
                        strokeWidth={1.5}
                        className="shrink-0"
                        style={{ color: m.isElite ? m.accent : "rgba(255,255,255,.32)" }}
                      />
                      <span
                        className="text-[9.5px] font-black tracking-[.38em] uppercase"
                        style={{ color: m.isElite ? m.accent : "rgba(255,255,255,.52)" }}
                      >
                        {plan.name}
                      </span>
                    </div>
                    {plan.isBestValue ? (
                      <div
                        className="flex items-center gap-1 px-[11px] py-1 rounded-full shrink-0"
                        style={{ background: "rgba(201,162,75,.88)", color: "#0c0800" }}
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
                    className="flex flex-col items-start relative mb-4 py-3 px-[10px] rounded-lg backdrop-blur-sm"
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
                      className="price-badge absolute top-0 right-0 text-[5.5px] font-black tracking-[.12em] uppercase px-1.5 py-1 rounded z-10 whitespace-nowrap shrink-0 text-[#f0d878]"
                      style={{
                        background: m.isElite ? "rgba(240,216,96,.22)" : "rgba(240,210,140,.14)",
                        border: m.isElite ? "1.5px solid rgba(240,216,96,.45)" : "1px solid rgba(240,210,140,.32)",
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
                          style={{ color: m.isElite ? m.accent : "rgba(240,210,140,.65)" }}
                        >
                          Regular
                        </span>
                        <span
                          className="regular-price-highlight text-[13px] line-through font-black"
                          style={{ color: m.isElite ? m.accent : "#f0d878" }}
                        >
                          {INR(anchor || plan.price)}*
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
                        <div className="flex items-center gap-0.75">
                          <span className="price-highlight text-[17px] font-black tracking-[-0.02em] leading-none">
                            {INR(plan.price)}*
                          </span>
                        </div>
                        <span className="text-[7px] font-bold opacity-55" style={{ color: '#f0d878' }}>GST 18% Extra</span>
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
                          boxShadow: m.isElite ? `0 0 6px ${m.accent}` : "none",
                        }}
                      />
                      <span className="font-bold">Selling Fast</span>
                      <span className="opacity-50">·</span>
                      <span className="font-medium opacity-80">{100 - plan.confirmed} Available</span>
                    </div>
                  </div>

                  {/* STATS */}
                  <div className={`grid ${isSovereign ? "grid-cols-4" : "grid-cols-2"} gap-2 mb-[14px] relative`}>
                    {[
                      { label: "Trips / Year", value: `${plan.trips} Trips` },
                      { label: "Vehicle", value: plan.vehicleType },
                      { label: "Security", value: plan.bodyguard || "Not Included" },
                      { label: "Validity", value: plan.validity },
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        className="py-2 px-[10px] rounded-lg"
                        style={{ background: m.statBg, border: `1px solid ${m.statBorder}` }}
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
                            border: m.isElite ? "1px solid rgba(201,162,75,.20)" : "none",
                          }}
                        >
                          <Check size={8} strokeWidth={3} style={{ color: m.checkColor }} />
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
                      href={`/booking/${id}`}
                      className={`${{ essential: "bronze-cta", executive: "silver-cta", premium: "platinum-cta", elite: "gold-cta", sovereign: "diamond-cta" }[id]} flex items-center justify-center gap-2 flex-1 h-11 rounded-lg text-[11px] font-extrabold tracking-[.20em] uppercase no-underline whitespace-nowrap`}
                      style={{
                        boxShadow: id === "sovereign" ? "none" : "0 4px 22px rgba(0,0,0,.2)",
                      }}
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
