"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Shield,
  Plane,
  Briefcase,
  Droplets,
  Phone,
  SquareParking,
  UserRound,
  Car,
  Route,
  CalendarCheck,
  Check,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/navigation";

const WA_NUMBER = "917304607954";
const INR = (n) => "₹" + Number(n).toLocaleString("en-IN");

function parsePaxCount(title = "") {
  const match = String(title).match(/pax[^0-9]*(\d+)/i);
  if (!match) return null;
  const n = Number(match[1]);
  if (!Number.isFinite(n) || n < 1) return null;
  return Math.min(n, 6); // cap icons so the chip stays tidy
}

function getPrivilegeIcon(title = "") {
  const t = title.toLowerCase();
  if (t.includes("security") || t.includes("bodyguard") || t.includes("escort"))
    return Shield;
  if (t.includes("flight") || t.includes("plane") || t.includes("monitor"))
    return Plane;
  if (t.includes("luggage") || t.includes("bag")) return Briefcase;
  if (t.includes("water")) return Droplets;
  if (t.includes("support") || t.includes("phone") || t.includes("24"))
    return Phone;
  if (t.includes("parking") || t.includes("vip")) return SquareParking;
  if (t.includes("chauffeur") || t.includes("driver")) return UserRound;
  if (t.includes("vehicle") || t.includes("car") || t.includes("sedan"))
    return Car;
  return Car;
}

const FEATURE_ICONS = {
  TRIPS: Route,
  VEHICLE: Car,
  SECURITY: Shield,
  VALIDITY: CalendarCheck,
};

/* Visual tiers only — no Basic/Pro/Ultra labels */
const TIER_THEMES = [
  // Basic — cool steel
  {
    bg: "#141820",
    border: "rgba(148,163,184,.28)",
    shadow: "0 8px 32px rgba(15,23,42,.28)",
    hoverShadow: "0 16px 48px rgba(15,23,42,.38)",
    category: "#94a3b8",
    title: "#f1f5f9",
    featureBg: "rgba(255,255,255,.04)",
    featureBorder: "rgba(255,255,255,.07)",
    featureLabel: "rgba(148,163,184,.55)",
    featureValue: "#e2e8f0",
    amenityBg: "rgba(255,255,255,.04)",
    amenityBorder: "rgba(255,255,255,.07)",
    amenityText: "rgba(203,213,225,.78)",
    amenityIcon: "#94a3b8",
    detailsLink: "#94a3b8",
    priceBoxBg: "rgba(255,255,255,.03)",
    priceBoxBorder: "rgba(148,163,184,.18)",
    price: "#e2e8f0",
    accent: "#94a3b8",
    ctaSolidBg: "#64748b",
    ctaSolidColor: "#f8fafc",
    ctaOutlineBorder: "rgba(148,163,184,.45)",
    ctaOutlineColor: "#94a3b8",
    topBar: "linear-gradient(90deg, #64748b, #94a3b8)",
    imgOverlay:
      "linear-gradient(180deg, transparent 35%, #141820 100%)",
  },
  // Pro — brand gold
  {
    bg: "#0e1420",
    border: "rgba(201,162,75,.36)",
    shadow: "0 8px 32px rgba(11,30,63,.30)",
    hoverShadow: "0 16px 48px rgba(201,162,75,.20)",
    category: "#C9A24B",
    title: "#ffffff",
    featureBg: "rgba(255,255,255,.04)",
    featureBorder: "rgba(255,255,255,.07)",
    featureLabel: "rgba(200,206,220,.42)",
    featureValue: "#ffffff",
    amenityBg: "rgba(255,255,255,.04)",
    amenityBorder: "rgba(255,255,255,.07)",
    amenityText: "rgba(220,210,185,.82)",
    amenityIcon: "#C9A24B",
    detailsLink: "#C9A24B",
    priceBoxBg: "rgba(255,255,255,.03)",
    priceBoxBorder: "rgba(201,162,75,.22)",
    price: "#f0d878",
    accent: "#C9A24B",
    ctaSolidBg: "#C9A24B",
    ctaSolidColor: "#0c0800",
    ctaOutlineBorder: "rgba(201,162,75,.55)",
    ctaOutlineColor: "#C9A24B",
    topBar: "linear-gradient(90deg, #8a6a28, #C9A24B, #e0c070)",
    imgOverlay:
      "linear-gradient(180deg, transparent 35%, #0e1420 100%)",
  },
  // Ultra — champagne on black
  {
    bg: "#0a090c",
    border: "rgba(232,200,160,.40)",
    shadow: "0 8px 36px rgba(0,0,0,.42)",
    hoverShadow: "0 18px 52px rgba(232,200,160,.16)",
    category: "#e8c8a0",
    title: "#faf6f0",
    featureBg: "rgba(255,255,255,.04)",
    featureBorder: "rgba(255,255,255,.07)",
    featureLabel: "rgba(232,200,160,.48)",
    featureValue: "#f5e6d0",
    amenityBg: "rgba(255,255,255,.04)",
    amenityBorder: "rgba(255,255,255,.07)",
    amenityText: "rgba(240,224,200,.82)",
    amenityIcon: "#e8c8a0",
    detailsLink: "#e8c8a0",
    priceBoxBg: "rgba(255,255,255,.03)",
    priceBoxBorder: "rgba(232,200,160,.24)",
    price: "#f5e6d0",
    accent: "#e8c8a0",
    ctaSolidBg: "linear-gradient(135deg, #e8c8a0 0%, #C9A24B 100%)",
    ctaSolidColor: "#0c0800",
    ctaOutlineBorder: "rgba(232,200,160,.55)",
    ctaOutlineColor: "#e8c8a0",
    topBar: "linear-gradient(90deg, #8a6040, #e8c8a0, #f5e6d0)",
    imgOverlay:
      "linear-gradient(180deg, transparent 35%, #0a090c 100%)",
  },
];

function AmenityChip({ privilege, theme }) {
  const paxCount = parsePaxCount(privilege.title);
  const Icon = getPrivilegeIcon(privilege.title);
  const label = paxCount ? "Pax" : privilege.title;

  return (
    <div
      className="flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 min-h-10.5"
      style={{
        background: theme.amenityBg,
        border: `1px solid ${theme.amenityBorder}`,
      }}
    >
      <span
        className="text-[11px] font-medium leading-tight line-clamp-2"
        style={{ color: theme.amenityText }}
      >
        {label}
      </span>
      {paxCount ? (
        <span
          className="flex items-center shrink-0 -space-x-0.5"
          aria-label={`${paxCount} passengers`}
        >
          {Array.from({ length: paxCount }).map((_, i) => (
            <UserRound
              key={i}
              size={13}
              strokeWidth={1.75}
              className="opacity-85"
              style={{ color: theme.amenityIcon }}
            />
          ))}
        </span>
      ) : (
        <Icon
          size={14}
          strokeWidth={1.75}
          className="shrink-0 opacity-85"
          style={{ color: theme.amenityIcon }}
        />
      )}
    </div>
  );
}

function TransferPlanCard({ plan, tierIndex = 0 }) {
  const t = TIER_THEMES[tierIndex % TIER_THEMES.length];
  const enquirySlug = plan.name.toLowerCase().replace(/ /g, "-");
  const available = Math.max(0, 100 - (plan.confirmed || 0));
  const mainFeatures = [
    { label: "TRIPS", value: `${plan.trips} Trip${plan.trips > 1 ? "s" : ""}` },
    { label: "VEHICLE", value: plan.vehicleType },
    { label: "SECURITY", value: plan.bodyguard || "Not Included" },
    { label: "VALIDITY", value: plan.validity },
  ];
  const amenities = (plan.privileges || []).slice(0, 6);
  const waMsg = encodeURIComponent(
    `Hi WENS Force, I'm interested in the ${plan.name} airport transfer. Can you help?`,
  );

  return (
    <div
      className="at-plan-card flex flex-col h-full rounded-2xl overflow-hidden relative"
      style={{
        border: `1px solid ${t.border}`,
        boxShadow: t.shadow,
        background: t.bg,
        transition:
          "box-shadow .4s ease, transform .35s cubic-bezier(.22,1,.36,1)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = t.hoverShadow;
        e.currentTarget.style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = t.shadow;
        e.currentTarget.style.transform = "none";
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-0.75 z-10"
        // style={{ background: t.topBar }}
      />

      {/* Image */}
      <div className="relative shrink-0 w-full aspect-video overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={plan.image}
          alt={plan.name}
          className="at-pc-img absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: t.imgOverlay }}
        />
        <span className="absolute top-3.5 left-3.5 text-[11px] font-black tracking-[.18em] tabular-nums text-white/25">
          {plan.packageNo}
        </span>
      </div>

      <div className="flex-1 flex flex-col px-4 pb-4 -mt-2 relative z-1">
        {/* Category + title */}
        <p
          className="text-[9px] font-bold tracking-[.28em] uppercase mb-1"
          style={{ color: t.category }}
        >
          Airport Transfer
        </p>
        <h3
          className="text-[22px] font-black tracking-[-0.02em] uppercase leading-none mb-4"
          style={{ color: t.title }}
        >
          {plan.name}
        </h3>

        {/* Main features 2×2 */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {mainFeatures.map((f) => {
            const Icon = FEATURE_ICONS[f.label] || Car;
            return (
              <div
                key={f.label}
                className="rounded-xl px-3 py-2.5 flex items-start justify-between gap-2"
                style={{
                  background: t.featureBg,
                  border: `1px solid ${t.featureBorder}`,
                }}
              >
                <div className="min-w-0">
                  <div
                    className="text-[8px] font-semibold tracking-[.16em] uppercase mb-1"
                    style={{ color: t.featureLabel }}
                  >
                    {f.label}
                  </div>
                  <div
                    className="text-[13px] font-bold leading-snug"
                    style={{ color: t.featureValue }}
                  >
                    {f.value}
                  </div>
                </div>
                <Icon
                  size={14}
                  strokeWidth={1.75}
                  className="shrink-0 mt-0.5 opacity-80"
                  style={{ color: t.amenityIcon }}
                />
              </div>
            );
          })}
        </div>

        {/* Amenities from privileges */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {amenities.map((priv) => (
            <AmenityChip key={priv.title} privilege={priv} theme={t} />
          ))}
        </div>

        {Array.isArray(plan.highlightTags) && plan.highlightTags.length > 0 && (
          <div className="flex flex-col gap-2 mb-3">
            {plan.highlightTags.map((tag) => (
              <div
                key={tag}
                className="inline-flex items-center gap-2 self-start rounded-full px-3 py-1.5"
                style={{
                  border: `1px solid ${t.accent}88`,
                  background: `${t.accent}12`,
                }}
              >
                <Check
                  size={12}
                  strokeWidth={2.5}
                  style={{ color: t.accent }}
                />
                <span
                  className="text-[9px] font-bold tracking-[.14em] uppercase"
                  style={{ color: t.accent }}
                >
                  {tag}
                </span>
              </div>
            ))}
          </div>
        )}

        <Link
          href={`/booking/${plan.id}`}
          className="inline-flex items-center gap-1 text-[11px] italic font-medium mb-3 no-underline hover:opacity-80 transition-opacity"
          style={{ color: t.detailsLink }}
        >
          *Click to see detailed offers and terms
          <ArrowUpRight size={12} strokeWidth={2.25} />
        </Link>

        {/* Pricing + note + CTAs pinned to bottom */}
        <div className="mt-auto">
        {/* Pricing */}
        <div
          className="rounded-xl px-3 py-3.5 mb-3 "
          style={{
            background: t.priceBoxBg,
            border: `1px solid ${t.priceBoxBorder}`,
          }}
        >
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <div className="flex flex-col items-start gap-0.5 min-w-0">
              <span
                className="text-[7px] font-extrabold tracking-[.18em] uppercase"
                style={{ color: t.featureLabel }}
              >
                Regular
              </span>
              <span
                className="at-regular-price text-[13px] line-through font-bold"
                style={{ color: t.accent }}
              >
                {INR(plan.anchorPrice || plan.price)}*
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[9px] font-bold tracking-[.12em] uppercase text-white/80 italic text-center leading-tight">
                Now
                <br />
                Available
              </span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 16 16"
                fill="none"
                style={{ color: t.accent }}
              >
                <path
                  d="M2 8h10M8 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="flex flex-col items-end gap-0.5 min-w-0">
              <span
                className="text-[7px] font-black tracking-[.14em] uppercase px-1.5 py-0.5 rounded mb-0.5"
                style={{
                  color: t.accent,
                  background: `${t.accent}22`,
                  border: `1px solid ${t.accent}55`,
                }}
              >
                Limited
              </span>
              <span
                className="text-[20px] font-black tracking-[-0.02em] leading-none"
                style={{ color: t.price }}
              >
                {INR(plan.price)}*
              </span>
              <span
                className="text-[8px] font-medium"
                style={{ color: t.featureLabel }}
              >
                GST 18% Extra
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[9px] text-white/70">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] shrink-0" />
            <span className="font-semibold">Selling Fast</span>
            <span className="opacity-40">·</span>
            <span className="font-medium opacity-80">
              {available} Available
            </span>
          </div>
        </div>

        {plan.note && (
          <p
            className="text-[10px] italic leading-relaxed mb-3 px-0.5"
            style={{ color: t.featureLabel }}
          >
            *{plan.note}
          </p>
        )}

        {/* CTAs */}
        <div className="grid grid-cols-3 gap-1.5">
          <Link
            href={`/booking/${plan.id}`}
            className="at-cta flex items-center justify-center h-10 rounded-lg text-[8px] sm:text-[9px] font-extrabold tracking-[.08em] uppercase no-underline text-center px-1"
            style={{ background: t.ctaSolidBg, color: t.ctaSolidColor }}
          >
            Book Now
          </Link>
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${waMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center h-10 rounded-lg text-[8px] sm:text-[9px] font-bold tracking-[.06em] uppercase no-underline text-center px-1 text-white/55 border border-white/10 hover:border-white/25 hover:text-white/80 transition-colors"
          >
            Talk to Concierge
          </a>
          <Link
            href={`/enquiry/membership/?serviceType=${enquirySlug}`}
            className="flex items-center justify-center h-10 rounded-lg text-[8px] sm:text-[9px] font-extrabold tracking-[.08em] uppercase no-underline text-center px-1"
            style={{
              color: t.ctaOutlineColor,
              border: `1.5px solid ${t.ctaOutlineBorder}`,
            }}
          >
            Enquiry Now
          </Link>
        </div>
        </div>
      </div>
    </div>
  );
}

export default function AirportTransferPlans({ plans = [] }) {
  return (
    <section
      id="plans"
      className="bg-[#EDE8DF] pt-22 pb-28 overflow-x-clip"
    >
      <style>{`
        @keyframes atRegularPricePop {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.02); }
        }
        @keyframes atShine {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        .at-pc-img{transition:transform .9s cubic-bezier(.22,1,.36,1);}
        .at-plan-card:hover .at-pc-img{transform:scale(1.06);}
        .at-regular-price{animation:atRegularPricePop 2.2s ease-in-out infinite;}
        .at-cta{
          position:relative;
          transition:all .3s ease-in-out;
          overflow:hidden;
          box-shadow:0 4px 18px rgba(0,0,0,.2);
        }
        .at-cta::before{
          content:'';
          position:absolute;
          top:0;
          left:-100%;
          width:100%;
          height:100%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,.35),transparent);
          animation:atShine 3s cubic-bezier(.4,0,.2,1) infinite;
        }
        .at-cta:hover{transform:translateY(-1px);filter:brightness(1.06);}

        .at-mobile-wrap {
          position: relative;
          width: 100%;
          max-width: 100%;
          overflow: visible;
          display: flex;
          justify-content: center;
          padding: 12px 48px 28px;
          touch-action: pan-y;
        }
        .at-desktop-grid {
          display: none;
        }
        @media (min-width: 768px) {
          .at-mobile-wrap {
            display: none !important;
          }
          .at-desktop-grid {
            display: grid !important;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 18px;
            align-items: stretch;
          }
        }
        .at-swiper {
          --swiper-navigation-size: 12px;
          --swiper-navigation-color: #C9A24B;
          --swiper-navigation-sides-offset: 0px;
          width: min(80vw, 340px);
          max-width: 340px;
          margin: 0 auto;
          overflow: visible;
        }
        .at-swiper .swiper-button-prev,
        .at-swiper .swiper-button-next {
          width: 40px;
          height: 40px;
          margin-top: 0;
          padding: 10px;
          top: 50%;
          transform: translateY(-50%);
          border-radius: 9999px;
          background: #0e1420;
          border: 1px solid rgba(201, 162, 75, 0.5);
          box-shadow: 0 6px 18px rgba(11, 30, 63, 0.22);
          transition:
            background .2s ease,
            border-color .2s ease,
            box-shadow .2s ease,
            transform .2s cubic-bezier(.22,1,.36,1);
        }
        .at-swiper .swiper-button-prev {
          left: -44px;
        }
        .at-swiper .swiper-button-next {
          right: -44px;
        }
        .at-swiper .swiper-button-prev:after,
        .at-swiper .swiper-button-next:after {
          font-size: 12px;
          font-weight: 800;
        }
        .at-swiper .swiper-button-prev:hover,
        .at-swiper .swiper-button-next:hover {
          background: #141c2c;
          border-color: rgba(201, 162, 75, 0.8);
          box-shadow: 0 8px 22px rgba(201, 162, 75, 0.18);
          transform: translateY(-50%) scale(1.04);
        }
        .at-swiper .swiper-button-prev:active,
        .at-swiper .swiper-button-next:active {
          transform: translateY(-50%) scale(0.96);
        }
        .at-swiper .swiper-button-disabled {
          opacity: 0.3;
          pointer-events: none;
          box-shadow: none;
        }
        .at-swiper .swiper-slide {
          width: 100% !important;
          border-radius: 1rem;
          background: transparent;
          overflow: hidden;
          box-sizing: border-box;
        }
        .at-swiper .swiper-slide .at-plan-card {
          width: 100%;
          max-width: 100%;
        }
      `}</style>

      <div className="max-w-7xl mx-auto overflow-x-clip">
        <div className="text-center mb-18">
          <div className="inline-flex items-center gap-4 mb-4.5">
            <div className="h-px w-12 bg-linear-to-r from-transparent to-[rgba(184,146,74,.45)]" />
            <span className="text-[9px] font-bold tracking-[.52em] uppercase text-[#a07838]">
              Mumbai Airport
            </span>
            <div className="h-px w-12 bg-linear-to-l from-transparent to-[rgba(184,146,74,.45)]" />
          </div>
          <h2 className="font-serif text-[clamp(28px,3.6vw,44px)] font-bold text-[#0B1E3F] tracking-[-0.03em] leading-[1.08] mb-3.5">
            Airport Transfer Packages
          </h2>
          <p className="text-[13px] font-light text-[#8a7e6e] leading-[1.75] max-w-85 mx-auto">
             Hassle-free airport transfers at Mumbai (BOM) — pick the level of assurance you need.
          </p>
          {/* <p className="text-[13px] font-light text-[#8a7e6e] leading-[1.75] max-w-[340px] mx-auto">
            Door-to-door transfers at Mumbai (BOM) — pick the level of assurance
            you need.
          </p> */}
        </div>

        <div className="at-desktop-grid">
          {plans.map((plan, i) => (
            <TransferPlanCard key={plan.id} plan={plan} tierIndex={i} />
          ))}
        </div>

        <div className="at-mobile-wrap">
          <Swiper
            effect="cards"
            grabCursor
            initialSlide={Math.min(1, Math.max(0, plans.length - 1))}
            modules={[EffectCards, Navigation]}
            navigation
            className="at-swiper"
            cardsEffect={{
              perSlideOffset: 8,
              perSlideRotate: 2,
              slideShadows: false,
            }}
          >
            {plans.map((plan, i) => (
              <SwiperSlide key={plan.id}>
                <TransferPlanCard plan={plan} tierIndex={i} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

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
