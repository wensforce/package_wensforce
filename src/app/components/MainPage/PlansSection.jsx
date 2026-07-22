"use client";

import Link from "next/link";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setPackages } from "@/app/membership/slices/package-slice"; 
import { usePackages } from "../../hooks/usePackages";
const INR = (n) => "₹" + Number(n).toLocaleString("en-IN");

export default function PlansSection({category}) {
  const router = useRouter();
  const { packages, loading, error } = usePackages(category);

  return (
    <section id="plans" className="bg-[#EDE8DF] px-5 pt-[88px] pb-[112px]">
      <style>{`
        /* ── keyframes ── */
        @keyframes shine {
          0%   { left: -100%; }
          100% { left:  200%; }
        }
        @keyframes dotPulse {
          0%,100% { opacity:1; transform:scale(1);   box-shadow:0 0 6px #4ade80; }
          50%     { opacity:.5; transform:scale(.75); box-shadow:0 0 2px #4ade80; }
        }
        @keyframes shimmerBg {
          0%,100% { opacity:.4; }
          50%     { opacity:.8; }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0);    }
        }
        @keyframes pricePop {
          0%,100% { transform:scale(1);    filter:brightness(1);   }
          50%     { transform:scale(1.02); filter:brightness(1.08); }
        }

        /* ── card ── */
        .plan-card {
          animation: fadeUp .45s ease both;
          transition: transform .35s cubic-bezier(.22,1,.36,1), box-shadow .35s ease;
        }
        .plan-card:hover { transform: translateY(-5px); box-shadow: 0 24px 64px rgba(0,0,0,.42) !important; }
        .plan-card:hover .pc-img { transform: scale(1.07); }
        .pc-img { transition: transform .9s cubic-bezier(.22,1,.36,1); }

        /* ── image panel: default (desktop, row layout) ──
           width comes from --img-w custom property set inline per card;
           height is NOT fixed — it stretches to match the content panel
           via the parent flex row (align-items: stretch by default). */
        .img-panel {
          width: var(--img-w, 42%);
          align-self: stretch;
        }

        /* ── CTA button ── */
        .pkg-cta {
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #c9a24b 0%, #a07830 100%);
          color: #0c0800;
          font-weight: 800;
          transition: filter .25s ease, transform .25s ease, box-shadow .25s ease;
        }
        .pkg-cta::before {
          content: '';
          position: absolute; top: 0; left: -100%; width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.38), transparent);
          animation: shine 3.2s cubic-bezier(.4,0,.2,1) infinite;
        }
        .pkg-cta:hover {
          filter: brightness(1.10);
          transform: translateY(-2px);
          box-shadow: 0 10px 32px rgba(201,162,75,.45);
        }

        /* ── price animation ── */
        .price-pop { animation: pricePop 2.6s ease-in-out infinite; }

        /* ── green dot ── */
        .live-dot { animation: dotPulse 1.8s ease-in-out infinite; }

        /* ── skeleton ── */
        .skel { background: rgba(255,255,255,.07); border-radius: 8px; animation: shimmerBg 1.6s ease-in-out infinite; }

        /* ── responsive: tablets ── */
        @media (max-width: 860px) {
          .plans-grid      { grid-template-columns: 1fr !important; }
          .full-width-card { grid-column: span 1 !important; }
          .plan-card       { flex-direction: column !important; }

          /* image now sits on top, full width, height driven purely
             by aspect-ratio so nothing gets cropped/stretched */
          .img-panel {
            width: 100% !important;
            aspect-ratio: 16 / 9;
            min-height: 0 !important;
            align-self: auto;
          }
          .stats-4col { grid-template-columns: repeat(2, 1fr) !important; }
        }

        /* ── responsive: small phones ── */
        @media (max-width: 480px) {
          .img-panel { aspect-ratio: 4 / 3; } /* taller ratio = less of the photo gets cropped */
          .card-content { padding: 16px !important; }
          .stats-4col { grid-template-columns: repeat(2, 1fr) !important; }
        }

        /* ── responsive: very small phones ── */
        @media (max-width: 360px) {
          .img-panel { aspect-ratio: 1 / 1; }
        }
      `}</style>

      <div className="max-w-[1280px] mx-auto">
        {/* ─── Section header ─── */}
        <div className="text-center mb-[68px]">
          <div className="inline-flex items-center gap-4 mb-[16px]">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-[rgba(184,146,74,.4)]" />
            <span className="text-[9px] font-bold tracking-[.52em] uppercase text-[#a07838]">
              Membership Tiers
            </span>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-[rgba(184,146,74,.4)]" />
          </div>
          <h2 className="font-serif text-[clamp(28px,3.6vw,44px)] font-bold text-[#0B1E3F] tracking-[-0.03em] leading-[1.08] mb-3">
            Choose Your Membership
          </h2>
          <p className="text-[13px] font-light text-[#8a7e6e] leading-[1.75] max-w-[300px] mx-auto">
            VIP darshan, airport lounges, 24×7 concierge &amp; luxury transport
            — curated for the year ahead.
          </p>
        </div>

        {/* ─── Loading skeletons ─── */}
        {loading && (
          <div className="grid grid-cols-2 gap-4 plans-grid">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="flex plan-card rounded-2xl overflow-hidden"
                style={{
                  minHeight: 340,
                  background: "rgba(10,13,22,.85)",
                  border: "1px solid rgba(255,255,255,.07)",
                }}
              >
                <div
                  className="shrink-0 skel img-panel"
                  style={{ "--img-w": "42%" }}
                />
                <div className="flex-1 p-5 flex flex-col gap-3">
                  <div className="skel h-3 w-28 rounded" />
                  <div className="skel h-[72px] rounded-xl" />
                  <div className="grid grid-cols-2 gap-2">
                    {[0, 1, 2, 3].map((j) => (
                      <div key={j} className="skel h-12 rounded-lg" />
                    ))}
                  </div>
                  <div className="flex flex-col gap-2 mt-1">
                    {[80, 65, 72].map((w, j) => (
                      <div
                        key={j}
                        className="skel h-2.5 rounded"
                        style={{ width: `${w}%` }}
                      />
                    ))}
                  </div>
                  <div className="skel h-10 rounded-xl mt-auto" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ─── Error state ─── */}
        {!loading && error && (
          <div className="text-center py-20">
            <p className="text-[#8a7e6e] text-sm mb-4">
              Could not load packages. Please try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="text-[10px] font-bold tracking-[.24em] uppercase text-[#a07838] border border-[rgba(160,120,56,.35)] px-5 py-2 rounded-lg hover:bg-[rgba(160,120,56,.08)] transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* ─── Package cards ─── */}
        {!loading && !error && packages.length > 0 && (
          <div className="plans-grid grid grid-cols-2 gap-4">
            {packages.map((pkg, idx) => {
              const isLastOdd =
                packages.length % 2 !== 0 && idx === packages.length - 1;
              const num = String(idx + 1).padStart(2, "0");

              /* pricing */
              const hasDiscount =
                pkg.regularPrice > 0 && pkg.discountedPrice < pkg.regularPrice;
              const displayPrice = pkg.discountedPrice || pkg.regularPrice;
              const savePercent = hasDiscount
                ? Math.round((1 - displayPrice / pkg.regularPrice) * 100)
                : 0;

              /* services → privileges */
              const privileges =
                pkg.packageServices?.map((ps) => ({
                  title: `${ps.count}× ${
                    ps.service?.title
                      ? ps.service.title.charAt(0).toUpperCase() +
                        ps.service.title.slice(1)
                      : "Service"
                  }`,
                })) || [];

              const maxPriv = isLastOdd ? 6 : 3;

              /* stats */
              const stats = [
                { label: "Trips / Year", value: `${pkg.trips} Trips` },
                {
                  label: "Vehicle",
                  value: pkg.vehicleModel
                    ? `${pkg.vehicleType} · ${pkg.vehicleModel}`
                    : pkg.vehicleType,
                },
                {
                  label: "Security",
                  value: pkg.bodyguardType || "Not Included",
                },
                { label: "Validity", value: `${pkg.validity} Months` },
              ];

              return (
                <div
                  key={pkg.id}
                  onClick={() => {
                    router.push(`/membership/${pkg.id}`);
                  }}
                  className={`plan-card flex flex-row rounded-2xl overflow-hidden cursor-pointer${
                    isLastOdd ? " full-width-card col-span-2" : " col-span-1"
                  }`}
                  style={{
                    background: "rgba(10,13,22,.97)",
                    border: "1px solid rgba(255,255,255,.09)",
                    boxShadow: "0 2px 24px rgba(0,0,0,.20)",
                    animationDelay: `${idx * 75}ms`,
                  }}
                >
                  {/* ── Image panel ── */}
                  <div
                    className="img-panel relative shrink-0 overflow-hidden"
                    style={{ "--img-w": isLastOdd ? "38%" : "42%" }}
                  >
                    {pkg.thumbnailUrl ? (
                      <img
                        src={pkg.thumbnailUrl}
                        alt={pkg.name}
                        loading="lazy"
                        className="pc-img absolute inset-0 w-full h-full object-cover object-center"
                        onError={(e) => {
                          e.currentTarget.parentElement.style.background =
                            "linear-gradient(160deg,#1a1f2e 0%,#0d1018 100%)";
                          e.currentTarget.remove();
                        }}
                      />
                    ) : (
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(160deg,#1a1f2e 0%,#0d1018 100%)",
                        }}
                      />
                    )}

                    {/* left-side fade so content panel blends (row layout only) */}
                    <div
                      className="absolute inset-0 pointer-events-none hidden md:block"
                      style={{
                        background:
                          "linear-gradient(270deg, rgba(10,13,22,.0) 0%, rgba(10,13,22,.25) 50%, rgba(10,13,22,.80) 100%)",
                      }}
                    />
                    {/* bottom fade for stacked mobile layout, so the number/pill stay legible */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(0deg, rgba(10,13,22,.55) 0%, rgba(10,13,22,0) 35%)",
                      }}
                    />

                    {/* card number */}
                    <span
                      className="absolute top-3 left-3.5 text-[10px] font-black tracking-[.18em] select-none tabular-nums"
                      style={{ color: "rgba(255,255,255,.20)" }}
                    >
                      {num}
                    </span>

                    {/* vehicle model pill */}
                    {pkg.vehicleModel && (
                      <span
                        className="absolute bottom-3 left-3.5 text-[7px] font-bold tracking-[.20em] uppercase px-2 py-1 rounded"
                        style={{
                          background: "rgba(0,0,0,.52)",
                          color: "rgba(255,255,255,.50)",
                          backdropFilter: "blur(6px)",
                        }}
                      >
                        {pkg.vehicleModel}
                      </span>
                    )}
                  </div>

                  {/* ── Content panel ── */}
                  <div className="card-content flex-1 flex flex-col p-5 min-w-0">
                    {/* name + save badge */}
                    <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
                      <span
                        className="text-[9.5px] font-black tracking-[.38em] uppercase break-words"
                        style={{ color: "rgba(255,255,255,.48)" }}
                      >
                        {pkg.name}
                      </span>
                      {savePercent > 0 && (
                        <div
                          className="flex items-center gap-1 px-2.5 py-[3px] rounded-full shrink-0"
                          style={{
                            background: "rgba(201,162,75,.88)",
                            color: "#0c0800",
                          }}
                        >
                          <Sparkles size={7} strokeWidth={2.5} />
                          <span className="text-[7px] font-black tracking-[.22em] uppercase">
                            Save {savePercent}%
                          </span>
                        </div>
                      )}
                    </div>

                    {/* divider */}
                    <div
                      className="h-px mb-3"
                      style={{ background: "rgba(255,255,255,.06)" }}
                    />

                    {/* ── Price block ── */}
                    <div
                      className="relative mb-4 py-3 px-3.5 rounded-xl"
                      style={{
                        background:
                          "linear-gradient(135deg,rgba(201,162,75,.08) 0%,rgba(201,162,75,.03) 100%)",
                        border: "1px solid rgba(201,162,75,.20)",
                      }}
                    >
                      {/* LIMITED pill top-right */}
                      <span
                        className="absolute -top-px right-0 text-[5.5px] font-black tracking-[.14em] uppercase px-2 py-[3.5px] rounded-bl-lg rounded-tr-xl"
                        style={{
                          background: "rgba(201,162,75,.15)",
                          color: "#c9a24b",
                          border: "1px solid rgba(201,162,75,.28)",
                        }}
                      >
                        Limited
                      </span>

                      {/* price row */}
                      <div className="flex items-center gap-2 mb-2 w-full flex-wrap">
                        {hasDiscount && (
                          <>
                            {/* regular */}
                            <div className="flex flex-col items-center gap-0.5 shrink-0">
                              <span
                                className="text-[6px] font-bold tracking-[.18em] uppercase"
                                style={{ color: "rgba(201,162,75,.50)" }}
                              >
                                Regular
                              </span>
                              <span
                                className="text-[13px] line-through font-black"
                                style={{ color: "rgba(201,162,75,.50)" }}
                              >
                                {INR(pkg.regularPrice)}*
                              </span>
                            </div>

                            {/* arrow */}
                            <div
                              className="flex flex-col items-center gap-0.5 flex-1"
                              style={{ minWidth: 0 }}
                            >
                              <span
                                className="text-[8.5px] font-bold tracking-[.14em] uppercase italic leading-tight text-center"
                                style={{ color: "rgba(255,255,255,.50)" }}
                              >
                                Now
                                <br />
                                Available
                              </span>
                            </div>

                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 16 16"
                              fill="none"
                              className="shrink-0"
                              style={{ color: "rgba(255,255,255,.35)" }}
                            >
                              <path
                                d="M2 8h10M12 4l4 4m-4 4l4-4"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </>
                        )}

                        {/* display price */}
                        <div className="flex flex-col items-center gap-px shrink-0 ml-auto">
                          {!hasDiscount && (
                            <span
                              className="text-[6px] font-bold tracking-[.18em] uppercase"
                              style={{ color: "rgba(201,162,75,.50)" }}
                            >
                              Starting From
                            </span>
                          )}
                          <span
                            className="price-pop font-black leading-none"
                            style={{
                              color: "#f0d878",
                              fontSize: "clamp(16px,2vw,19px)",
                              letterSpacing: "-0.02em",
                            }}
                          >
                            {INR(displayPrice)}*
                          </span>
                          <span
                            className="text-[6.5px] font-semibold mt-0.5"
                            style={{ color: "rgba(201,162,75,.45)" }}
                          >
                            + GST 18%
                          </span>
                        </div>
                      </div>

                      {/* selling fast */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className="live-dot w-[7px] h-[7px] rounded-full shrink-0"
                          style={{ background: "#4ade80" }}
                        />
                        <span
                          className="text-[7px] font-bold"
                          style={{ color: "rgba(255,255,255,.52)" }}
                        >
                          Selling Fast
                        </span>
                        <span style={{ color: "rgba(255,255,255,.18)" }}>
                          ·
                        </span>
                        <span
                          className="text-[7px]"
                          style={{ color: "rgba(255,255,255,.34)" }}
                        >
                          Limited Spots
                        </span>
                      </div>
                    </div>

                    {/* ── Stats grid ── */}
                    <div
                      className={`grid gap-2 mb-4 ${
                        isLastOdd ? "grid-cols-4 stats-4col" : "grid-cols-2"
                      }`}
                    >
                      {stats.map(({ label, value }) => (
                        <div
                          key={label}
                          className="py-2 px-2.5 rounded-lg min-w-0"
                          style={{
                            background: "rgba(255,255,255,.05)",
                            border: "1px solid rgba(255,255,255,.08)",
                          }}
                        >
                          <div
                            className="text-[7px] font-semibold tracking-[.16em] uppercase mb-[3px]"
                            style={{ color: "rgba(180,190,215,.38)" }}
                          >
                            {label}
                          </div>
                          <div
                            className="text-[11px] font-bold leading-snug break-words"
                            style={{ color: "#c8d2e2" }}
                          >
                            {value}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* divider */}
                    <div
                      className="h-px mb-4"
                      style={{ background: "rgba(255,255,255,.05)" }}
                    />

                    {/* ── Services ── */}
                    <div className="flex flex-col gap-2.5 flex-1 mb-4">
                      {privileges.length > 0 ? (
                        privileges.slice(0, maxPriv).map((p, i) => (
                          <div key={i} className="flex items-center gap-2.5">
                            <div
                              className="w-4 h-4 rounded-full shrink-0 flex items-center justify-center"
                              style={{ background: "rgba(255,255,255,.07)" }}
                            >
                              <Check
                                size={8}
                                strokeWidth={3}
                                style={{ color: "rgba(180,195,220,.55)" }}
                              />
                            </div>
                            <span
                              className="text-xs leading-snug"
                              style={{ color: "rgba(180,195,220,.70)" }}
                            >
                              {p.title}
                            </span>
                          </div>
                        ))
                      ) : (
                        <span
                          className="text-xs italic"
                          style={{ color: "rgba(180,195,220,.28)" }}
                        >
                          No services listed
                        </span>
                      )}
                      {privileges.length > maxPriv && (
                        <span
                          className="text-[8px] font-semibold"
                          style={{ color: "rgba(201,162,75,.48)" }}
                        >
                          +{privileges.length - maxPriv} more included
                        </span>
                      )}
                    </div>

                    {/* ── CTA ── */}
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/booking/${pkg.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="pkg-cta flex-[1.3] flex items-center justify-center gap-2 h-11 rounded-xl text-[11px] tracking-[.20em] uppercase no-underline whitespace-nowrap transition-all duration-300 hover:scale-[1.03]"
                        style={{ boxShadow: "0 4px 20px rgba(0,0,0,.22)" }}
                      >
                        Book Now
                        <ArrowRight size={11} strokeWidth={2.5} />
                      </Link>

                      <Link
                        onClick={(e) => e.stopPropagation()}
                        href={`/membership/${pkg.id}`}
                        className="group relative overflow-hidden flex items-center justify-center px-7 h-11 rounded-xl bg-white text-black text-[11px] font-bold tracking-[.20em] uppercase shadow-[0_4px_20px_rgba(255,255,255,0.25)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_8px_35px_rgba(255,255,255,0.25)]"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ─── Empty state ─── */}
        {!loading && !error && packages.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[#8a7e6e] text-sm">
              No packages available at the moment.
            </p>
          </div>
        )}

        {/* ─── Trust strip ─── */}
        <div className="flex items-center justify-center gap-5 mt-14">
          <div className="h-px flex-1 max-w-16 bg-gradient-to-r from-transparent to-[rgba(160,140,100,.22)]" />
          <p className="text-[9px] font-medium tracking-[.40em] uppercase text-[rgba(140,120,80,.44)] whitespace-nowrap m-0">
            Instant Activation &nbsp;·&nbsp; No Hidden Fees
          </p>
          <div className="h-px flex-1 max-w-16 bg-gradient-to-l from-transparent to-[rgba(160,140,100,.22)]" />
        </div>
      </div>
    </section>
  );
}
