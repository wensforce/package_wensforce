import Link from "next/link";

const CARDS = [
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-11 h-11">
        <path
          d="M24 4L28.5 14.5H40L30.75 21L34.5 32L24 25.5L13.5 32L17.25 21L8 14.5H19.5L24 4Z"
          stroke="#C9A24B"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <circle cx="24" cy="38" r="4" fill="#C9A24B" opacity="0.3" />
      </svg>
    ),
    headline: "VIP Darshan, Booked For You",
    body: "Tirupati Suprabhatam. Vaishno Devi Helicopter. Mahakaleshwar Bhasm Aarti. Booked in your name within 48 hours by your personal concierge.",
    cta: "Available from Premium tier",
    href: "/membership/premium",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-11 h-11">
        <rect
          x="10"
          y="16"
          width="28"
          height="22"
          rx="3"
          stroke="#C9A24B"
          strokeWidth="2"
        />
        <path
          d="M24 8v8M17 12l4 4M31 12l-4 4"
          stroke="#C9A24B"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="24" cy="27" r="4" fill="#C9A24B" opacity="0.25" />
      </svg>
    ),
    headline: "Armed Protection, Vetted & Trained",
    body: "Ex-Defence and ex-Police personnel. PSARA-Compliant under Indian law. NDA-bound. Briefed on your full itinerary 24 hours in advance.",
    cta: "Available from Premium tier",
    href: "/membership/premium",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-11 h-11">
        <rect
          x="6"
          y="22"
          width="36"
          height="14"
          rx="7"
          stroke="#C9A24B"
          strokeWidth="2"
        />
        <circle cx="14" cy="36" r="4" stroke="#C9A24B" strokeWidth="2" />
        <circle cx="34" cy="36" r="4" stroke="#C9A24B" strokeWidth="2" />
        <path
          d="M20 22V18a4 4 0 018 0v4"
          stroke="#C9A24B"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    headline: "Luxury Vehicles, Ready in 10 Minutes",
    body: "Mercedes E-Class, BMW 7 Series, Audi Q7. Pre-positioned across cities. Average dispatch time under 12 minutes, guaranteed.",
    cta: "Available from Essential tier",
    href: "/membership/essential",
  },
];

export default function WedgeBlock() {
  return (
    <section className="py-20 px-6 bg-[#0B1E3F]">
      <div className="max-w-5xl mx-auto">
        {/* Section headline */}
        <div className="text-center mb-14">
          <p className="text-[#C9A24B] text-[10px] tracking-[0.4em] uppercase font-semibold mb-4">
            India&apos;s Only
          </p>
          <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-white leading-tight">
            Three Things Only WENS Force Does in India.
          </h2>
          <p className="text-white/40 text-sm mt-3 max-w-md mx-auto font-light">
            Blacklane has chauffeurs. Wheely has chauffeurs. Uber Black has
            chauffeurs. Nobody else has this combination.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CARDS.map((card, i) => (
            <div
              key={i}
              className="group bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col hover:bg-white/8 hover:border-[#C9A24B]/30 transition-all duration-300"
            >
              <div className="mb-6">{card.icon}</div>

              <h3 className="text-white font-bold text-lg leading-snug mb-3">
                {card.headline}
              </h3>

              <p className="text-white/55 text-sm leading-relaxed font-light flex-1 mb-6">
                {card.body}
              </p>

              <Link
                href={card.href}
                className="text-[#C9A24B] text-sm font-semibold hover:text-[#F5E6BD] transition-colors flex items-center gap-1.5"
              >
                {card.cta}
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          ))}
        </div>

        {/* Optional 4th card */}
        <div className="mt-6 p-6 rounded-2xl border border-[#C9A24B]/20 bg-[#C9A24B]/5 text-center">
          <p className="text-[#C9A24B] font-semibold text-sm">
            Family-Transferable.{" "}
            <span className="text-white/60 font-light">
              One subscription. Your spouse, children, and parents — all
              covered. Sovereign members get a dedicated booking line for their
              spouse.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
