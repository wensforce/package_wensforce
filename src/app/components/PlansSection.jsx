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
    img: "/cards/Sedan_Essential.png",
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
    img: "/cards/BMW_Executive.png",
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
    img: "/cards/GLC_Premium.png",
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
    img: "/cards/S-Class_Elite.png",
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
    img: "/cards/Defender_Sovereign.png",
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
    <section
      id="plans"
      style={{ background: "#EDE8DF", padding: "88px 20px 112px" }}
    >
      <style>{`
        @keyframes goldPulse {
          0%,100%{box-shadow:0 0 0 1px rgba(201,162,75,.45),0 20px 60px rgba(201,162,75,.14),0 6px 20px rgba(0,0,0,.42);}
          50%{box-shadow:0 0 0 1.5px rgba(201,162,75,.75),0 26px 70px rgba(201,162,75,.24),0 6px 20px rgba(0,0,0,.42);}
        }
        @keyframes diamondGlow {
          0%, 100% { box-shadow: 0 0 10px rgba(147, 51, 234, .4), 0 4px 22px rgba(0,0,0,.2); }
          50% { box-shadow: 0 0 20px rgba(147, 51, 234, .8), 0 4px 30px rgba(147, 51, 234, .4); }
        }
        @keyframes pricePulse {
          0%, 100% { transform: scale(1); filter: brightness(1); }
          50% { transform: scale(1.03); filter: brightness(1.1); }
        }
        @keyframes regularPricePop {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.02); }
        }
        @keyframes buttonShine {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes shine {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        @keyframes emeraldGlow {
          0%, 100% { box-shadow: 0 0 15px rgba(16, 185, 129, .5), 0 4px 22px rgba(0,0,0,.2); }
          50% { box-shadow: 0 0 30px rgba(16, 185, 129, .8), 0 6px 35px rgba(16, 185, 129, .4); }
        }
        .pc-img{transition:transform .9s cubic-bezier(.22,1,.36,1);}
        .plan-card:hover .pc-img{transform:scale(1.06);}
        .elite-ring{animation:goldPulse 2.8s ease-in-out infinite;}
        .elite-ring:hover{animation:none;}
        .price-highlight {
          color: #f0d878 !important;
          font-weight: 900;
          letter-spacing: -.02em;
        }
        .regular-price-highlight {
          animation: regularPricePop 2.2s ease-in-out infinite;
        }
        .price-badge {
          animation: pricePulse 2s ease-in-out infinite;
        }
        .bronze-cta {
          position: relative;
          // background-color: #8B6F47;
          background-color: #C9733D;
          color: #FFFFFF;
          transition: all 0.3s ease-in-out;
          overflow: hidden;
          box-shadow: 0 0 0 1px rgba(139,111,71,.45), 0 20px 60px rgba(139,111,71,.14), 0 6px 20px rgba(0,0,0,.42);
        }
        .bronze-cta:hover {
          box-shadow: 0 0 0 1.5px rgba(139,111,71,.75), 0 28px 72px rgba(139,111,71,.26), 0 10px 28px rgba(0,0,0,.52);
        }

        .silver-cta {
          position: relative;
          background-color: #dadada;
          color: #000000;
          transition: all 0.3s ease-in-out;
          overflow: hidden;
          box-shadow: 0 0 0 1px rgba(200,200,200,.45), 0 20px 60px rgba(200,200,200,.14), 0 6px 20px rgba(0,0,0,.42);
        }
        .silver-cta:hover {
          box-shadow: 0 0 0 1.5px rgba(200,200,200,.75), 0 28px 72px rgba(200,200,200,.26), 0 10px 28px rgba(0,0,0,.52);
        }

        .platinum-cta {
          position: relative;
          background-color: #C9A24B;
          color: #FFFFFF;
          transition: all 0.3s ease-in-out;
          overflow: hidden;
          box-shadow: 0 0 0 1px rgba(201,162,75,.45), 0 20px 60px rgba(201,162,75,.14), 0 6px 20px rgba(0,0,0,.42);
        }
        .platinum-cta:hover {
          box-shadow: 0 0 0 1.5px rgba(201,162,75,.75), 0 28px 72px rgba(201,162,75,.26), 0 10px 28px rgba(0,0,0,.52);
        }

        .gold-cta {
          position: relative;
          background-color: #4A90E2;
          color: #FFFFFF;
          transition: all 0.3s ease-in-out;
          overflow: hidden;
          box-shadow: 0 0 0 1px rgba(74,144,226,.45), 0 20px 60px rgba(74,144,226,.14), 0 6px 20px rgba(0,0,0,.42);
        }
        .gold-cta:hover {
          box-shadow: 0 0 0 1.5px rgba(74,144,226,.75), 0 28px 72px rgba(74,144,226,.26), 0 10px 28px rgba(0,0,0,.52);
        }

        .diamond-cta {
          position: relative;
          background-color: #10B981;
          color: #FFFFFF;
          transition: all 0.3s ease-in-out;
          overflow: hidden;
          box-shadow: 0 0 0 1px rgba(16,185,129,.45), 0 20px 60px rgba(16,185,129,.14), 0 6px 20px rgba(0,0,0,.42);
        }
        .diamond-cta:hover {
          box-shadow: 0 0 0 1.5px rgba(16,185,129,.75), 0 28px 72px rgba(16,185,129,.26), 0 10px 28px rgba(0,0,0,.52);
        }

        .bronze-cta::before, .silver-cta::before, .gold-cta::before, .platinum-cta::before, .diamond-cta::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.4), transparent);
          animation: shine 3s cubic-bezier(.4, 0, .2, 1) infinite;
        }
        .platinum-cta:hover, .silver-cta:hover, .bronze-cta:hover, .gold-cta:hover, .diamond-cta:hover {
          transform:translateY(-2px);
          filter:brightness(1.1);
        }
        .ghost-cta{
          background:rgba(255,255,255,.10);
          backdrop-filter:blur(8px);
          -webkit-backdrop-filter:blur(8px);
          border:1px solid rgba(255,255,255,.22);
          box-shadow:0 2px 14px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.10);
          transition:background .22s,border-color .22s,box-shadow .22s,transform .2s;
        }
        .ghost-cta:hover{
          background:rgba(255,255,255,.20);
          border-color:rgba(255,255,255,.38);
          box-shadow:0 6px 24px rgba(0,0,0,.26),inset 0 1px 0 rgba(255,255,255,.15);
          transform:translateY(-2px);
        }
        @media(max-width:860px){
          .plans-grid{grid-template-columns:1fr !important;}
          .sovereign-card{grid-column:span 1 !important;}
          .card-img-panel{width:100% !important;height:200px !important;flex-shrink:0 !important;}
          .plan-card{flex-direction:column !important;}
        }
        @media(max-width:480px){
          .price-badge{font-size:4.5px !important;padding:3px 5px !important;}
        }
      `}</style>

      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 18,
            }}
          >
            <div
              style={{
                height: 1,
                width: 48,
                background:
                  "linear-gradient(to right,transparent,rgba(184,146,74,.45))",
              }}
            />
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: ".52em",
                textTransform: "uppercase",
                color: "#a07838",
              }}
            >
              Membership Tiers
            </span>
            <div
              style={{
                height: 1,
                width: 48,
                background:
                  "linear-gradient(to left,transparent,rgba(184,146,74,.45))",
              }}
            />
          </div>
          <h2
            style={{
              fontFamily: 'Georgia,"Times New Roman",serif',
              fontSize: "clamp(28px,3.6vw,44px)",
              fontWeight: 700,
              color: "#0B1E3F",
              letterSpacing: "-.03em",
              lineHeight: 1.08,
              margin: "0 0 14px",
            }}
          >
            Choose Your Membership
          </h2>
          <p
            style={{
              fontSize: 13,
              fontWeight: 300,
              color: "#8a7e6e",
              lineHeight: 1.75,
              maxWidth: 320,
              margin: "0 auto",
            }}
          >
            VIP darshan, airport lounges, 24×7 concierge &amp; luxury transport
            — curated for the year ahead.
          </p>
        </div>

        {/* 2-column grid */}
        <div
          className="plans-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2,1fr)",
            gap: 18,
            alignItems: "start",
          }}
        >
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
                className={`plan-card${m.isElite ? " elite-ring" : ""}${isSovereign ? " sovereign-card" : ""}`}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gridColumn: isSovereign ? "span 2" : "span 1",
                  borderRadius: 16,
                  overflow: "hidden",
                  border: `1px solid ${m.border}`,
                  boxShadow: m.shadow,
                  background: m.bg,
                  transition:
                    "box-shadow .4s ease,transform .35s cubic-bezier(.22,1,.36,1),opacity .3s ease",
                  transform: "none",
                  opacity: 1,
                  cursor: "pointer",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = m.hoverShadow;
                  e.currentTarget.style.transform = m.isElite
                    ? "scale(1.02) translateY(-3px)"
                    : "translateY(-4px)";
                  e.currentTarget.style.opacity = "1";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = m.shadow;
                  e.currentTarget.style.transform = "none";
                }}
              >
                {/* Image panel */}
                <div
                  className="card-img-panel"
                  style={{
                    position: "relative",
                    width: isSovereign ? "34%" : "38%",
                    flexShrink: 0,
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={m.img}
                    alt={plan.name}
                    className="pc-img"
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      filter: m.imgFilter,
                      transform: "scale(1)",
                    }}
                  />

                  {m.isElite && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        pointerEvents: "none",
                        background:
                          "radial-gradient(ellipse 100% 40% at 50% 0%,rgba(201,162,75,.14) 0%,transparent 70%)",
                      }}
                    />
                  )}
                  <span
                    style={{
                      position: "absolute",
                      top: 14,
                      left: 14,
                      fontSize: 10,
                      fontWeight: 900,
                      letterSpacing: ".18em",
                      color: m.isElite ? m.accent : "rgba(255,255,255,.18)",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {m.num}
                  </span>
                </div>

                {/* Content panel */}
                <div
                  className="card-body"
                  style={{
                    flex: 1,
                    padding: "20px 24px 22px",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    minWidth: 0,
                  }}
                >
                  {m.isElite && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        pointerEvents: "none",
                        background:
                          "radial-gradient(ellipse 80% 50% at 100% 0%,rgba(201,162,75,.08) 0%,transparent 70%)",
                      }}
                    />
                  )}

                  {/* Tier name + badge */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 12,
                      position: "relative",
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <m.Icon
                        size={12}
                        strokeWidth={1.5}
                        style={{
                          color: m.isElite ? m.accent : "rgba(255,255,255,.32)",
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontSize: 9.5,
                          fontWeight: 900,
                          letterSpacing: ".38em",
                          textTransform: "uppercase",
                          color: m.isElite ? m.accent : "rgba(255,255,255,.52)",
                        }}
                      >
                        {plan.name}
                      </span>
                    </div>
                    {plan.isBestValue ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          padding: "4px 11px",
                          borderRadius: 99,
                          background: "rgba(201,162,75,.88)",
                          color: "#0c0800",
                          flexShrink: 0,
                        }}
                      >
                        <Sparkles size={7} strokeWidth={2.5} />
                        <span
                          style={{
                            fontSize: 7,
                            fontWeight: 900,
                            letterSpacing: ".24em",
                            textTransform: "uppercase",
                          }}
                        >
                          Best Value
                        </span>
                      </div>
                    ) : plan.tag ? (
                      <span
                        style={{
                          fontSize: 6.5,
                          fontWeight: 800,
                          letterSpacing: ".20em",
                          textTransform: "uppercase",
                          padding: "2px 8px",
                          borderRadius: 3,
                          background: "rgba(255,255,255,.06)",
                          color: "rgba(255,255,255,.30)",
                          border: "1px solid rgba(255,255,255,.08)",
                        }}
                      >
                        {plan.tag}
                      </span>
                    ) : null}
                  </div>

                  {/* Separator */}
                  <div
                    style={{
                      height: 1,
                      marginBottom: 14,
                      background: m.isElite
                        ? `linear-gradient(90deg,${m.accent}50,transparent)`
                        : "rgba(255,255,255,.07)",
                      position: "relative",
                    }}
                  />

                  {/* PRICE */}
                  <div 
                    className="flex flex-col items-start relative mb-4"
                    style={{
                      background: m.isElite 
                        ? 'linear-gradient(135deg, rgba(240,210,140,.10) 0%, rgba(201,162,75,.06) 100%)'
                        : 'linear-gradient(135deg, rgba(240,210,140,.08) 0%, rgba(201,162,75,.03) 100%)',
                      padding: '12px 10px',
                      borderRadius: 8,
                      border: m.isElite 
                        ? '1.5px solid rgba(240,210,140,.28)'
                        : '1px solid rgba(240,210,140,.18)',
                      backdropFilter: 'blur(6px)',
                      position: 'relative',
                    }}
                  >
                    <span
                      className="price-badge"
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        fontSize: 5.5,
                        fontWeight: 800,
                        letterSpacing: ".12em",
                        textTransform: "uppercase",
                        padding: "4px 6px",
                        borderRadius: 4,
                        background: m.isElite
                          ? "rgba(240,216,96,.22)"
                          : "rgba(240,210,140,.14)",
                        color: m.isElite
                          ? "#f0d878"
                          : "#f0d878",
                        border: m.isElite
                          ? "1.5px solid rgba(240,216,96,.45)"
                          : "1px solid rgba(240,210,140,.32)",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                        fontWeight: 900,
                        zIndex: 10,
                      }}
                    >
                      Limited
                    </span>
                    {/* Price Row */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 10,
                        marginBottom: 8,
                        width: "100%",
                      }}
                    >
                      {/* Regular Price Section */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 3,
                          flex: 0.75,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 6,
                            fontWeight: 800,
                            letterSpacing: ".20em",
                            textTransform: "uppercase",
                            color: m.isElite ? m.accent : "rgba(240,210,140,.65)",
                            opacity: 0.75,
                          }}
                        >
                          Regular
                        </span>
                        <span
                          className="regular-price-highlight"
                          style={{
                            fontSize: 13,
                            color: m.isElite ? m.accent : "#f0d878",
                            // color: "white",
                            textDecoration: "line-through",
                            fontWeight: 900,
                          }}
                        >
                          {INR(anchor || plan.price)}
                        </span>
                      </div>

                      <span
                      className="text-[10px] text-white"
                        style={{
                          fontWeight: 700,
                          letterSpacing: ".14em",
                          textTransform: "uppercase",
                          // color: m.isElite ? m.accent : "rgba(255,255,255,.52)",
                          textAlign: "center",
                          lineHeight: 1.1,
                          flex: 0.7,
                          paddingTop: 2,
                          fontStyle: 'italic',
                          letterSpacing: '.18em',
                        }}
                      >
                        Now <br /> Available
                      </span>

                      {/* Arrow Right */}
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 16 16"
                        fill="none"
                        style={{
                          opacity: 0.7,
                          color:"white",
                          // color: m.isElite ? m.accent : m.subColor,
                          flexShrink: 0,
                          marginTop: 1,
                          transition: 'all .3s ease',
                        }}
                      >
                        <path
                          d="M2 8h10M12 4l4 4m-4 4l4-4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>

                      {/* Current Price Section */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 1,
                          flex: 0.95,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 3,
                          }}
                        >
                          <span
                            className="price-highlight"
                            style={{
                              fontSize: 17,
                              fontWeight: 900,
                              letterSpacing: "-.02em",
                              lineHeight: 1,
                              color: "#f0d878",
                            }}
                          >
                            {INR(plan.price)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Selling Fast Indicator */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        gap: 3,
                        fontSize: 7,
                        color: m.isElite ? m.subColor : "white",
                        marginLeft: 0,
                      }}
                    >
                      <span
                        style={{
                          width: 4,
                          height: 4,
                          borderRadius: "50%",
                          background: m.isElite
                            ? m.accent
                            : "white",
                          flexShrink: 0,
                          boxShadow: m.isElite
                            ? `0 0 6px ${m.accent}`
                            : 'none',
                        }}
                      />
                      <span style={{ fontWeight: 700 }}>Selling Fast</span>
                      <span style={{ opacity: 0.5 }}>·</span>
                      <span style={{ fontWeight: 500, opacity: 0.8 }}>{100 - plan.confirmed} Available</span>
                    </div>
                  </div>

                  {/* STATS: trips, vehicle, bodyguard, validity */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: isSovereign
                        ? "repeat(4,1fr)"
                        : "repeat(2,1fr)",
                      gap: 8,
                      marginBottom: 14,
                      position: "relative",
                    }}
                  >
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
                        style={{
                          padding: "8px 10px",
                          borderRadius: 8,
                          background: m.statBg,
                          border: `1px solid ${m.statBorder}`,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 7,
                            fontWeight: 600,
                            letterSpacing: ".16em",
                            textTransform: "uppercase",
                            color: m.statLabel,
                            marginBottom: 3,
                          }}
                        >
                          {label}
                        </div>
                        <div
                          style={{
                            fontSize: 11.5,
                            fontWeight: 700,
                            color: m.statValue,
                            lineHeight: 1.2,
                          }}
                        >
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Separator */}
                  <div
                    style={{
                      height: 1,
                      marginBottom: 14,
                      background: "rgba(255,255,255,.06)",
                      position: "relative",
                    }}
                  />

                  {/* PRIVILEGES */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 9,
                      marginBottom: 20,
                      flex: 1,
                      position: "relative",
                    }}
                  >
                    {plan.privileges.slice(0, showPrivCount).map((priv, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 9,
                        }}
                      >
                        <div
                          style={{
                            width: 16,
                            height: 16,
                            borderRadius: "50%",
                            flexShrink: 0,
                            marginTop: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
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
                          style={{
                            fontSize: 12,
                            lineHeight: 1.44,
                            color: m.featColor,
                            fontWeight: m.isElite ? 500 : 400,
                          }}
                        >
                          {priv.title}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA row */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                      position: "relative",
                    }}
                  >
                    <Link
                      href={`/booking/${id}`}
                      className={{
                        essential: "bronze-cta",
                        executive: "silver-cta",
                        premium: "platinum-cta",
                        elite: "gold-cta",
                        sovereign: "diamond-cta"
                      }[id]}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        flex: 1,
                        height: 44,
                        borderRadius: 8,
                        color: id === "executive" ? "#000000" : "#ffffff",
                        fontSize: 11,
                        fontWeight: 800,
                        letterSpacing: ".20em",
                        textTransform: "uppercase",
                        textDecoration: "none",
                        boxShadow: id === "sovereign" ? "none" : "0 4px 22px rgba(0,0,0,.2)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {m.cta}
                      <ArrowRight size={11} strokeWidth={2.5} />
                    </Link>
                    <Link
                      href={`/membership/${id}`}
                      style={{
                        fontSize: 8.5,
                        fontWeight: 500,
                        letterSpacing: ".18em",
                        textTransform: "uppercase",
                        color: m.subColor,
                        textDecoration: "none",
                        opacity: 0.55,
                        transition: "opacity .2s",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = "1";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = ".55";
                      }}
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
            marginTop: 64,
          }}
        >
          <div
            style={{
              height: 1,
              flex: 1,
              maxWidth: 64,
              background:
                "linear-gradient(to right,transparent,rgba(160,140,100,.25))",
            }}
          />
          <p
            style={{
              fontSize: 9,
              fontWeight: 500,
              letterSpacing: ".40em",
              textTransform: "uppercase",
              color: "rgba(140,120,80,.46)",
              whiteSpace: "nowrap",
              margin: 0,
            }}
          >
            Instant Activation &nbsp;&middot;&nbsp; No Hidden Fees
            
          </p>
          <div
            style={{
              height: 1,
              flex: 1,
              maxWidth: 64,
              background:
                "linear-gradient(to left,transparent,rgba(160,140,100,.25))",
            }}
          />
        </div>
      </div>
    </section>
  );
}
