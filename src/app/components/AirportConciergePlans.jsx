"use client";

import Link from "next/link";
import { Check, ArrowRight, Sparkles } from "lucide-react";

const INR = (n) => "₹" + Number(n).toLocaleString("en-IN");

const CARD = {
  border: "rgba(201,162,75,.28)",
  shadow: "0 2px 20px rgba(0,0,0,.12)",
  hoverShadow: "0 14px 48px rgba(0,0,0,.24)",
  bg: "rgba(10,14,24,.96)",
  imgFilter: "grayscale(28%) brightness(.56) contrast(1.08)",
  statBg: "rgba(255,255,255,.06)",
  statBorder: "rgba(255,255,255,.09)",
  statLabel: "rgba(200,206,220,.40)",
  statValue: "#d0d4e0",
  featColor: "rgba(200,210,225,.76)",
  checkBg: "rgba(255,255,255,.07)",
  checkColor: "rgba(200,210,225,.55)",
  subColor: "rgba(200,206,220,.52)",
};

export default function AirportConciergePlans({ plans = [] }) {
  const count = plans.length;

  return (
    <section id="plans" className="bg-[#EDE8DF] px-5 pt-[88px] pb-[112px]">
      <style>{`
        @keyframes acPricePulse {
          0%, 100% { transform: scale(1); filter: brightness(1); }
          50% { transform: scale(1.03); filter: brightness(1.1); }
        }
        @keyframes acRegularPricePop {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.02); }
        }
        @keyframes acShine {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        .ac-pc-img{transition:transform .9s cubic-bezier(.22,1,.36,1);}
        .ac-plan-card:hover .ac-pc-img{transform:scale(1.06);}
        .ac-price-highlight{color:#f0d878 !important;font-weight:900;letter-spacing:-.02em;}
        .ac-regular-price{animation:acRegularPricePop 2.2s ease-in-out infinite;}
        .ac-price-badge{animation:acPricePulse 2s ease-in-out infinite;}
        .ac-cta{
          position:relative;
          background-color:#C9A24B;
          color:#0c0800;
          transition:all .3s ease-in-out;
          overflow:hidden;
          box-shadow:0 4px 22px rgba(0,0,0,.2);
        }
        .ac-cta::before{
          content:'';
          position:absolute;
          top:0;
          left:-100%;
          width:100%;
          height:100%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,.4),transparent);
          animation:acShine 3s cubic-bezier(.4,0,.2,1) infinite;
        }
        .ac-cta:hover{transform:translateY(-2px);filter:brightness(1.08);}
        @media (max-width: 1023px) {
          .ac-plans-grid { grid-template-columns: 1fr !important; }
          .ac-wide { grid-column: span 1 !important; }
        }
      `}</style>

      <div className="max-w-[1280px] mx-auto">
        <div className="text-center mb-[72px]">
          <div className="inline-flex items-center gap-4 mb-[18px]">
            <div className="h-px w-12 bg-linear-to-r from-transparent to-[rgba(184,146,74,.45)]" />
            <span className="text-[9px] font-bold tracking-[.52em] uppercase text-[#a07838]">
              Mumbai Airport
            </span>
            <div className="h-px w-12 bg-linear-to-l from-transparent to-[rgba(184,146,74,.45)]" />
          </div>
          <h2 className="font-serif text-[clamp(28px,3.6vw,44px)] font-bold text-[#0B1E3F] tracking-[-0.03em] leading-[1.08] mb-[14px]">
            Choose Your Package
          </h2>
          <p className="text-[13px] font-light text-[#8a7e6e] leading-[1.75] max-w-[320px] mx-auto">
            Meet, assist, and depart at Mumbai (BOM)
            — one consistent set of packages.
          </p>
        </div>

        <div className="ac-plans-grid grid grid-cols-2 gap-[18px] items-start">
          {plans.map((plan, index) => {
            const isWide = count % 2 === 1 && index === count - 1;
            const anchor = plan.anchorPrice;

            return (
              <div
                key={plan.id}
                className={`ac-plan-card flex flex-col lg:flex-row ${isWide ? "ac-wide col-span-2" : "col-span-1"} rounded-2xl overflow-hidden cursor-pointer relative`}
                style={{
                  border: `1px solid ${CARD.border}`,
                  boxShadow: CARD.shadow,
                  background: CARD.bg,
                  transition:
                    "box-shadow .4s ease,transform .35s cubic-bezier(.22,1,.36,1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = CARD.hoverShadow;
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = CARD.shadow;
                  e.currentTarget.style.transform = "none";
                }}
              >
                <div className="relative shrink-0 overflow-hidden w-full h-[200px] lg:w-[48%] lg:h-auto">
                  <img
                    src={plan.image}
                    alt={plan.name}
                    className="ac-pc-img absolute inset-0 w-full h-full object-cover"
                    // style={{ filter: CARD.imgFilter }}
                  />
                  <span className="absolute top-[14px] left-[14px] text-[10px] font-black tracking-[.18em] tabular-nums text-white/20">
                    {plan.packageNo}
                  </span>
                </div>

                <div className="flex-1 pt-5 px-6 pb-[22px] flex flex-col relative min-w-0">
                  <div className="flex items-center justify-between mb-3 gap-3">
                    <span className="text-[9.5px] font-black tracking-[.38em] uppercase text-white/55">
                      {plan.name}
                    </span>
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
                      <span className="text-[6.5px] font-extrabold tracking-[.20em] uppercase px-2 py-0.5 rounded-[3px] bg-white/[.06] text-white/30 border border-white/[.08] shrink-0">
                        {plan.tag}
                      </span>
                    ) : null}
                  </div>

                  <div className="h-px mb-[14px] bg-white/[.07]" />

                  <div
                    className="flex flex-col items-start relative mb-4 py-3 px-[10px] rounded-lg backdrop-blur-sm"
                    style={{
                      background:
                        "linear-gradient(135deg,rgba(240,210,140,.08) 0%,rgba(201,162,75,.03) 100%)",
                      border: "1px solid rgba(240,210,140,.18)",
                    }}
                  >
                    <span
                      className="ac-price-badge absolute top-0 right-0 text-[5.5px] font-black tracking-[.12em] uppercase px-1.5 py-1 rounded z-10 whitespace-nowrap shrink-0 text-[#f0d878]"
                      style={{
                        background: "rgba(240,210,140,.14)",
                        border: "1px solid rgba(240,210,140,.32)",
                      }}
                    >
                      Limited
                    </span>

                    <div className="flex items-center justify-between gap-[10px] mb-2 w-full">
                      <div className="flex flex-col items-center gap-[3px] flex-[0.75]">
                        <span className="text-[6px] font-extrabold tracking-[.20em] uppercase opacity-75 text-[#f0d878]/65">
                          Regular
                        </span>
                        <span className="ac-regular-price text-[13px] line-through font-black text-[#f0d878]">
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
                        className="opacity-70 text-white shrink-0 mt-px"
                      >
                        <path
                          d="M2 8h10M12 4l4 4m-4 4l4-4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>

                      <div className="flex flex-col items-center gap-px flex-[0.95]">
                        <span className="ac-price-highlight text-[17px] font-black tracking-[-0.02em] leading-none">
                          {INR(plan.price)}*
                        </span>
                        <span className="text-[7px] font-bold opacity-55 text-[#f0d878]">
                          GST 18% Extra
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-start gap-[3px] text-[7px] text-white">
                      <span className="w-1 h-1 rounded-full shrink-0 bg-white" />
                      <span className="font-bold">Selling Fast</span>
                      <span className="opacity-50">·</span>
                      <span className="font-medium opacity-80">
                        {100 - plan.confirmed} Available
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-[14px]">
                    {[
                      { label: "Trips", value: `${plan.trips} Trips` },
                      { label: "Vehicle", value: plan.vehicleType },
                      { label: "Security", value: plan.bodyguard || "Not Included" },
                      { label: "Validity", value: plan.validity },
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        className="py-2 px-[10px] rounded-lg"
                        style={{
                          background: CARD.statBg,
                          border: `1px solid ${CARD.statBorder}`,
                        }}
                      >
                        <div
                          className="text-[7px] font-semibold tracking-[.16em] uppercase mb-[3px]"
                          style={{ color: CARD.statLabel }}
                        >
                          {label}
                        </div>
                        <div
                          className="text-[11.5px] font-bold leading-[1.2]"
                          style={{ color: CARD.statValue }}
                        >
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="h-px mb-[14px] bg-white/[.06]" />

                  <div className="flex flex-col gap-[9px] mb-5 flex-1">
                    {plan.privileges.slice(0, 3).map((priv, i) => (
                      <div key={i} className="flex items-start gap-[9px]">
                        <div
                          className="w-4 h-4 rounded-full shrink-0 mt-px flex items-center justify-center"
                          style={{ background: CARD.checkBg }}
                        >
                          <Check size={8} strokeWidth={3} style={{ color: CARD.checkColor }} />
                        </div>
                        <span
                          className="text-xs leading-[1.44] font-normal"
                          style={{ color: CARD.featColor }}
                        >
                          {priv.title}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    {/* TODO: RESUME WHEN BOOKING API IS READY */}
                    {/* <Link
                      href={`/booking/${plan.id}`}
                      className="ac-cta flex items-center justify-center gap-2 flex-1 h-11 rounded-lg text-[11px] font-extrabold tracking-[.20em] uppercase no-underline whitespace-nowrap"
                    >
                      Book Now
                      <ArrowRight size={11} strokeWidth={2.5} />
                    </Link> */}
                    <Link
                      href={`/enquiry/airport-concierge/?serviceType=${plan.name.toLowerCase().replace(/ /g, "-")}`}
                      className="ac-cta flex items-center justify-center gap-2 flex-1 h-11 rounded-lg text-[11px] font-extrabold tracking-[.20em] uppercase no-underline whitespace-nowrap"
                    >
                      Enquire Now
                      <ArrowRight size={11} strokeWidth={2.5} />
                    </Link>
                    <Link
                      href={`/membership/${plan.id}`}
                      className="text-[8.5px] font-medium tracking-[.18em] uppercase no-underline opacity-[.55] hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shrink-0"
                      style={{ color: CARD.subColor }}
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
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
