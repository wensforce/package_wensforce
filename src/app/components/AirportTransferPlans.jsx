"use client";

import { useRef } from "react";
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-cards";

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

/* Yellow, orange, teal — one palette per card */
const TIER_THEMES = [
  {
    bg: "linear-gradient(180deg, #152418 0%, #0c1410 42%, #080c0a 100%)",
    border: "rgba(255,214,0,.42)",
    shadow: "0 0 0 1px rgba(255,214,0,.08), 0 18px 40px rgba(0,0,0,.32)",
    hoverShadow: "0 0 28px rgba(255,214,0,.16), 0 22px 48px rgba(0,0,0,.4)",
    category: "#FFE699",
    title: "#ffffff",
    featureBg: "rgba(255,214,0,.06)",
    featureBorder: "rgba(255,214,0,.14)",
    featureLabel: "rgba(255,230,153,.55)",
    featureValue: "#ffffff",
    amenityBg: "rgba(255,255,255,.04)",
    amenityBorder: "rgba(255,214,0,.16)",
    amenityText: "rgba(255,244,210,.86)",
    amenityIcon: "#FFD600",
    detailsLink: "#FFE699",
    price: "#FFD600",
    accent: "#FFD600",
    ctaSolidBg: "#FFD600",
    ctaSolidColor: "#141200",
    ctaOutlineBorder: "rgba(255,214,0,.7)",
    ctaOutlineColor: "#FFD600",
    imgOverlay: "linear-gradient(180deg, rgba(20,36,24,.15) 0%, #0c1410 100%)",
  },
  {
    bg: "linear-gradient(180deg, #1c140c 0%, #10141c 46%, #0a0e16 100%)",
    border: "rgba(255,149,0,.48)",
    shadow: "0 0 0 1px rgba(255,149,0,.08), 0 18px 40px rgba(0,0,0,.32)",
    hoverShadow: "0 0 28px rgba(255,149,0,.18), 0 22px 48px rgba(0,0,0,.4)",
    category: "#FFB800",
    title: "#ffffff",
    featureBg: "rgba(255,149,0,.07)",
    featureBorder: "rgba(255,149,0,.16)",
    featureLabel: "rgba(255,184,0,.55)",
    featureValue: "#ffffff",
    amenityBg: "rgba(255,255,255,.04)",
    amenityBorder: "rgba(255,149,0,.18)",
    amenityText: "rgba(255,228,190,.88)",
    amenityIcon: "#FF9500",
    detailsLink: "#FFB800",
    price: "#FF9500",
    accent: "#FF9500",
    ctaSolidBg: "#FF9500",
    ctaSolidColor: "#1a0e00",
    ctaOutlineBorder: "rgba(255,149,0,.75)",
    ctaOutlineColor: "#FF9500",
    imgOverlay: "linear-gradient(180deg, rgba(28,20,12,.12) 0%, #10141c 100%)",
  },
  {
    bg: "linear-gradient(180deg, #062826 0%, #07141c 48%, #061016 100%)",
    border: "rgba(0,213,204,.45)",
    shadow: "0 0 0 1px rgba(0,213,204,.08), 0 18px 40px rgba(0,0,0,.32)",
    hoverShadow: "0 0 28px rgba(0,213,204,.18), 0 22px 48px rgba(0,0,0,.4)",
    category: "#7AF6EE",
    title: "#ffffff",
    featureBg: "rgba(0,213,204,.07)",
    featureBorder: "rgba(0,213,204,.16)",
    featureLabel: "rgba(122,246,238,.55)",
    featureValue: "#ffffff",
    amenityBg: "rgba(255,255,255,.04)",
    amenityBorder: "rgba(0,213,204,.18)",
    amenityText: "rgba(210,255,250,.88)",
    amenityIcon: "#00D5CC",
    detailsLink: "#7AF6EE",
    price: "#00E5D6",
    accent: "#00D5CC",
    ctaSolidBg: "#00D5CC",
    ctaSolidColor: "#042220",
    ctaOutlineBorder: "rgba(0,213,204,.75)",
    ctaOutlineColor: "#00D5CC",
    imgOverlay: "linear-gradient(180deg, rgba(6,40,38,.12) 0%, #07141c 100%)",
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
        {/* <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: t.imgOverlay }}
        /> */}
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
        <div className="flex items-end justify-between gap-3 mb-3 pt-1">
          <div className="min-w-0">
            <span className="block text-[9px] font-semibold tracking-[.18em] uppercase text-white/40 mb-1">
              Regular
            </span>
            <span className="at-regular-price block text-[13px] line-through font-semibold text-white/45">
              {INR(plan.anchorPrice || plan.price)}*
            </span>
            <div className="flex items-center gap-1.5 mt-2.5 text-[10px] text-white/75">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] shrink-0" />
              <span className="font-semibold text-[#4ade80]">Selling Fast</span>
              <span className="opacity-40">·</span>
              <span className="font-medium text-white/60">
                {available} Available
              </span>
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="flex items-center justify-end gap-1.5 mb-1.5">
              <span className="text-[10px] font-semibold tracking-[.14em] uppercase text-[#9BB0C9]">
                Now Available
              </span>
              <span className="text-[#9BB0C9] text-[13px] leading-none" aria-hidden="true">
                →
              </span>
              <span className="bg-[#E10600] text-white text-[9px] font-bold tracking-[.12em] uppercase px-1.5 py-0.5 rounded-[3px] leading-none">
                Limited
              </span>
            </div>
            <span
              className="block text-[30px] font-black tracking-[-0.03em] leading-none"
              style={{ color: t.price }}
            >
              {INR(plan.price)}*
            </span>
            <span className="block text-[8px] font-medium text-white/40 mt-1">
              GST 18% Extra
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

        <div className="grid grid-cols-2 gap-2">
          <Link
            href={`/booking/${plan.id}`}
            className="at-cta flex items-center justify-center h-11 rounded-lg text-[11px] font-extrabold tracking-[.08em] uppercase no-underline text-center px-2"
            style={{ background: t.ctaSolidBg, color: t.ctaSolidColor }}
          >
            Book Now
          </Link>
          <Link
            href={`/enquiry/airport-transfer/?serviceType=${enquirySlug}`}
            className="flex items-center justify-center h-11 rounded-lg text-[11px] font-extrabold tracking-[.08em] uppercase no-underline text-center px-2 bg-transparent transition-colors hover:bg-white/5"
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
  const swiperRef = useRef(null);
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
          width: min(80vw, 340px);
          max-width: 340px;
          margin: 0 auto;
          overflow: visible;
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
          <button
            type="button"
            aria-label="Previous plan"
            onClick={() => swiperRef.current?.slidePrev()}
            className="absolute left-2 top-1/2 z-30 -translate-y-1/2 w-12 h-12 rounded-full bg-[#C9A24B] text-[#0B1E3F] flex items-center justify-center shadow-[0_0_0_6px_rgba(11,30,63,0.55),0_8px_24px_rgba(201,162,75,0.45)] hover:scale-110 hover:bg-[#f0d878] active:scale-95 transition-transform"
          >
            <ChevronLeft size={26} strokeWidth={2.5} />
          </button>
          <button
            type="button"
            aria-label="Next plan"
            onClick={() => swiperRef.current?.slideNext()}
            className="absolute right-2 top-1/2 z-30 -translate-y-1/2 w-12 h-12 rounded-full bg-[#C9A24B] text-[#0B1E3F] flex items-center justify-center shadow-[0_0_0_6px_rgba(11,30,63,0.55),0_8px_24px_rgba(201,162,75,0.45)] hover:scale-110 hover:bg-[#f0d878] active:scale-95 transition-transform"
          >
            <ChevronRight size={26} strokeWidth={2.5} />
          </button>
          <Swiper
            effect="cards"
            grabCursor
            initialSlide={Math.min(1, Math.max(0, plans.length - 1))}
            modules={[EffectCards]}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
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
