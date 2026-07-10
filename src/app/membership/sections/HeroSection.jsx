import Link from 'next/link';
import { Navigation, Car, Shield, ShieldCheck } from 'lucide-react';

const INR = (n) => '₹' + Number(n).toLocaleString('en-IN');

export default function HeroSection({ plan, waUrl }) {
  const hasDiscount = plan.regularPrice && plan.regularPrice > plan.discountedPrice;
  const savings = hasDiscount ? plan.regularPrice - plan.discountedPrice : 0;
  const BodyguardIcon = (plan.bodyguardType || '').toLowerCase().includes('armed')
    ? ShieldCheck
    : Shield;

  const chips = [
    { Icon: Navigation, text: `${plan.trips} Curated Journeys /yr` },
    { Icon: Car, text: [plan.vehicleType, plan.vehicleModel].filter(Boolean).join(' · ') },
    { Icon: BodyguardIcon, text: `${plan.bodyguardType || 'Standard'} Security` },
  ];

  const stats = [
    { num: plan.trips, label: 'Curated Journeys / Year' },
    savings > 0
      ? { num: `₹${Math.round(savings / 1000)}K+`, label: 'You Save' }
      : { num: INR(plan.regularPrice || plan.discountedPrice), label: 'Privileges Worth' },
    { num: `${plan.validity} Mo`, label: 'Membership Validity' },
    { num: '24×7', label: 'Concierge Support' },
  ];

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden" style={{ minHeight: 'calc(88vh - 4rem)' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={plan.thumbnailUrl}
          alt={plan.name}
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ filter: 'brightness(0.75) saturate(0.9)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/25" />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(201,162,75,0.18) 0%, transparent 55%)' }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 35%)' }}
        />

        {/* watermark plan number */}
        <div
          className="absolute select-none pointer-events-none font-black text-white leading-none hidden sm:block"
          style={{
            fontSize: 'clamp(180px, 30vw, 340px)',
            opacity: 0.045,
            right: '-1vw',
            top: '8%',
            letterSpacing: '-0.05em',
            lineHeight: 0.85,
          }}
        >
          {String(plan.id).padStart(2, '0')}
        </div>

        <div
          className="relative max-w-6xl mx-auto px-6 sm:px-10 pt-12 pb-16 flex flex-col justify-end"
          style={{ minHeight: 'calc(88vh - 4rem)' }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 items-end">
            {/* Left: identity */}
            <div>
              <div className="flex items-center gap-3 mb-5 flex-wrap">
                <span className="text-[10px] font-bold tracking-[0.45em] uppercase text-[#C9A24B]">
                  WENS Force · Membership {String(plan.id).padStart(2, '0')}
                </span>
              </div>

              <h1
                className="text-white font-black leading-none tracking-tight mb-4"
                style={{ fontSize: 'clamp(38px, 7vw, 100px)' }}
              >
                {plan.name}
              </h1>

              {plan.description && (
                <p
                  className="text-white/50 font-light italic leading-relaxed mb-8 max-w-lg"
                  style={{ fontSize: 'clamp(14px, 1.4vw, 17px)' }}
                >
                  {plan.description}
                </p>
              )}

              <div className="flex flex-wrap gap-2.5">
                {chips.map(({ Icon, text }, i) =>
                  text ? (
                    <span
                      key={i}
                      className="flex items-center gap-2 text-[11px] px-4 py-2 rounded-full border font-bold tracking-wide uppercase backdrop-blur-sm bg-white/10 border-white/20 text-white/80"
                    >
                      <Icon size={11} strokeWidth={2.5} />
                      {text}
                    </span>
                  ) : null
                )}
              </div>
            </div>

            {/* Right: price card */}
            <div>
              <div
                className="rounded-2xl p-6 backdrop-blur-2xl"
                style={{
                  background: 'rgba(4,8,16,0.62)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
                }}
              >
                {hasDiscount && (
                  <div className="text-xs line-through text-white/30 mb-1">
                    {INR(plan.regularPrice)}*
                  </div>
                )}
                <div
                  className="font-black tracking-tight leading-none text-white"
                  style={{ fontSize: 'clamp(34px, 4vw, 50px)' }}
                >
                  {INR(plan.discountedPrice)}*
                </div>
                <div className="text-white/50 text-[11px] font-semibold mb-1 mt-1">
                  GST 18% Extra
                </div>
                <div className="text-white/35 text-xs font-light mb-5">
                  per year, all-inclusive · valid {plan.validity} month
                  {plan.validity > 1 ? 's' : ''}
                </div>

                <Link
                  href={`/booking/${plan.id}`}
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-black text-black text-sm mb-2.5 transition-all hover:opacity-90 hover:-translate-y-0.5"
                  style={{
                    background: 'linear-gradient(135deg,#C9A24B 0%,#f0c940 50%,#C9A24B 100%)',
                    boxShadow: '0 6px 24px rgba(201,162,75,0.5)',
                  }}
                >
                  Buy {plan.name} Membership →
                </Link>

                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold border transition-all hover:opacity-80"
                  style={{ borderColor: 'rgba(37,211,102,0.35)', color: '#25D366' }}
                >
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 32 32"
                      width="28"
                      height="28"
                      fill="#25D366"
                    >
                      <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.668 4.799 1.836 6.793L2 30l7.393-1.812A13.918 13.918 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.6a11.543 11.543 0 01-5.88-1.604l-.42-.248-4.39 1.074 1.106-4.274-.272-.44A11.556 11.556 0 014.4 16C4.4 9.592 9.592 4.4 16 4.4S27.6 9.592 27.6 16 22.408 27.6 16 27.6zm6.327-8.627c-.348-.174-2.055-1.014-2.374-1.13-.318-.115-.55-.174-.78.174-.23.348-.894 1.13-1.097 1.362-.201.231-.404.26-.752.086-.348-.174-1.47-.542-2.799-1.727-1.034-.922-1.732-2.062-1.934-2.41-.202-.348-.022-.536.152-.71.156-.155.348-.405.522-.607.174-.202.23-.348.348-.58.115-.231.058-.434-.03-.607-.086-.174-.78-1.882-1.07-2.578-.282-.677-.568-.585-.78-.596-.201-.01-.434-.012-.665-.012-.23 0-.607.086-.926.434-.318.348-1.214 1.186-1.214 2.892 0 1.707 1.243 3.356 1.417 3.588.174.231 2.447 3.734 5.928 5.234.83.358 1.478.572 1.982.732.833.265 1.59.227 2.19.138.668-.1 2.055-.84 2.346-1.652.29-.81.29-1.505.202-1.652-.086-.145-.318-.231-.665-.405z" />
                    </svg>
                  WhatsApp Enquiry
                </a>

                <p className="text-center text-[10px] text-white/25 mt-3">
                  Instant Activation · No Hidden Fees
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <div style={{ backgroundColor: '#0B1E3F' }} className="py-10 px-6 border-b border-white/5">
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 divide-x divide-white/[0.06]">
          {stats.map(({ num, label }, i) => (
            <div key={i} className={`${i === 0 ? '' : 'pl-8'} text-center sm:text-left`}>
              <div
                className="font-black leading-none mb-1.5 tabular-nums"
                style={{ fontSize: 'clamp(24px,3.5vw,38px)', color: '#C9A24B' }}
              >
                {num}
              </div>
              <div className="text-[10px] font-semibold tracking-[0.28em] uppercase text-white/30">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
