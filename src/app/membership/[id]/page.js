import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft, Check, ChevronRight,
  Car, Users, ShieldCheck, Gem, Crown,
  Navigation, Shield, Building2, Plane, Landmark,
  Sparkles, Utensils, Gift, Phone, Zap, Wifi,
  RefreshCw, Flame, UserCheck, CheckCircle,
} from 'lucide-react';
import { plans, getPlanById } from '../../data/plans';

const INR = (n) => '₹' + Number(n).toLocaleString('en-IN');
const WA_NUMBER = '917304607954';

const ANCHOR_PRICES = {
  essential: 34999,
  executive: 64999,
  premium: 99999,
  elite: 130000,
  sovereign: 250000,
};

const FOUNDING_SPOTS = {
  essential: 82,
  executive: 71,
  premium: 58,
  elite: 73,
  sovereign: 41,
};

const TIER_ICONS = {
  essential: Car,
  executive: Users,
  premium: ShieldCheck,
  elite: Gem,
  sovereign: Crown,
};

const PRIV_ICONS = {
  '🛕': Building2, '✈️': Plane, '🏛️': Landmark, '🛡️': ShieldCheck,
  '💆': Sparkles, '🍽️': Utensils, '🎁': Gift, '📞': Phone,
  '⚡': Zap, '🚗': Car, '🛜': Wifi, '🔄': RefreshCw,
  '👨‍👩‍👧': Users, '🪔': Flame, '🤵': UserCheck, '✅': CheckCircle,
  '🏎️': Car, '🔋': Zap,
};

const NOT_INCLUDED = {
  essential: ['Armed Bodyguard', 'International Lounge Access', 'Heritage Fast-Track Pass', 'Spa / Wellness', 'Fine Dining', 'Dedicated Relationship Manager', 'Security Risk Assessment'],
  executive: ['Armed Bodyguard', 'International Lounge Access', 'Spa / Wellness', 'Fine Dining', 'Dedicated Relationship Manager', 'Security Risk Assessment'],
  premium: ['3× International Lounge Access', 'Fine Dining Voucher', 'Same-Day SUV Upgrade', 'Personalised Gift Delivery'],
  elite: ['Bhasm Aarti VVIP Booking at Ujjain (Sovereign exclusive)', 'Unlimited VIP Darshan', 'Airport Concierge Service', '4× Spa Sessions', 'Family Extension Booking Line'],
  sovereign: [],
};

const TIER_THEMES = {
  essential: {
    headerGrad: 'from-slate-700 via-slate-600 to-slate-800',
    accentColor: '#475569',
    orb1: 'bg-slate-400/25 -top-16 -right-16 w-64 h-64',
    orb2: 'bg-blue-400/10 bottom-0 left-4 w-40 h-40',
    numColor: 'text-white/[0.07]',
    badge: null,
    nameTxt: 'text-white',
    taglineTxt: 'text-slate-300/70',
    priceTxt: 'text-white',
    priceSubTxt: 'text-slate-300/55',
    perksTxt: 'text-slate-300/70',
    chipBg: 'bg-white/10 border-white/20 text-white/80',
    bodyBg: 'bg-white',
    darkBody: false,
    checkBg: 'bg-slate-50 border-slate-100',
    checkColor: 'text-slate-500',
    privTitle: 'text-gray-900',
    privNote: 'text-slate-400',
    summaryBorder: 'rgba(0,0,0,0.06)',
    btnBg: 'bg-slate-800 hover:bg-slate-900 text-white',
    noteBg: 'bg-slate-50 border-slate-200',
  },
  executive: {
    headerGrad: 'from-blue-900 via-indigo-800 to-blue-950',
    accentColor: '#1d4ed8',
    orb1: 'bg-blue-400/25 -top-16 -right-16 w-64 h-64',
    orb2: 'bg-indigo-300/15 bottom-0 left-4 w-44 h-44',
    numColor: 'text-white/[0.07]',
    badge: { label: 'Most Popular', cls: 'bg-white/15 border border-white/20 text-white' },
    nameTxt: 'text-white',
    taglineTxt: 'text-blue-200/70',
    priceTxt: 'text-white',
    priceSubTxt: 'text-blue-200/55',
    perksTxt: 'text-blue-200/80',
    chipBg: 'bg-white/10 border-white/20 text-white/80',
    bodyBg: 'bg-white',
    darkBody: false,
    checkBg: 'bg-blue-50 border-blue-100',
    checkColor: 'text-blue-500',
    privTitle: 'text-gray-900',
    privNote: 'text-blue-400',
    summaryBorder: 'rgba(0,0,0,0.06)',
    btnBg: 'bg-blue-800 hover:bg-blue-900 text-white',
    noteBg: 'bg-blue-50 border-blue-100',
  },
  premium: {
    headerGrad: 'from-gray-800 via-gray-700 to-gray-900',
    accentColor: '#374151',
    orb1: 'bg-gray-400/15 -top-16 -right-16 w-64 h-64',
    orb2: 'bg-red-400/8 bottom-0 left-4 w-40 h-40',
    numColor: 'text-white/[0.06]',
    badge: null,
    nameTxt: 'text-white',
    taglineTxt: 'text-gray-300/65',
    priceTxt: 'text-white',
    priceSubTxt: 'text-gray-300/55',
    perksTxt: 'text-gray-300/75',
    chipBg: 'bg-white/10 border-white/20 text-white/80',
    bodyBg: 'bg-white',
    darkBody: false,
    checkBg: 'bg-gray-50 border-gray-100',
    checkColor: 'text-gray-500',
    privTitle: 'text-gray-900',
    privNote: 'text-gray-400',
    summaryBorder: 'rgba(0,0,0,0.06)',
    btnBg: 'bg-gray-900 hover:bg-black text-white',
    noteBg: 'bg-gray-50 border-gray-200',
  },
  elite: {
    headerGrad: 'from-[#2a1c00] via-[#6b4800] to-[#1a1000]',
    accentColor: '#C9A24B',
    orb1: 'bg-[#C9A24B]/35 -top-16 -right-16 w-64 h-64',
    orb2: 'bg-yellow-400/15 bottom-0 left-4 w-44 h-44',
    numColor: 'text-[#C9A24B]/[0.13]',
    badge: { label: '◆ Best Value — 6 in 10 choose this', cls: 'shimmer-bg text-black font-extrabold' },
    nameTxt: 'text-[#f0c940]',
    taglineTxt: 'text-[#C9A24B]/65',
    priceTxt: 'text-[#f0c940]',
    priceSubTxt: 'text-[#C9A24B]/55',
    perksTxt: 'text-[#C9A24B]/80',
    chipBg: 'bg-[#C9A24B]/15 border-[#C9A24B]/25 text-[#C9A24B]/90',
    bodyBg: 'bg-[#0d0800]',
    darkBody: true,
    checkBg: 'bg-[#C9A24B]/10 border-[#C9A24B]/20',
    checkColor: 'text-[#C9A24B]',
    privTitle: 'text-white/85',
    privNote: 'text-[#C9A24B]/55',
    summaryBorder: 'rgba(201,162,75,0.12)',
    btnBg: 'bg-[#C9A24B] hover:bg-[#a88000] text-black font-extrabold',
    noteBg: 'bg-[#C9A24B]/8 border-[#C9A24B]/20',
  },
  sovereign: {
    headerGrad: 'from-[#080808] via-[#2a2a2a] to-[#080808]',
    headerStyle: { background: 'linear-gradient(135deg, #050505 0%, #0e0e0e 25%, #272727 48%, #2e2e2e 52%, #252525 56%, #0e0e0e 75%, #050505 100%)' },
    accentColor: '#C0C0C0',
    orb1: 'bg-[#C0C0C0]/8 -top-16 -right-16 w-64 h-64',
    orb2: 'bg-[#B8B9BC]/5 bottom-0 left-4 w-40 h-40',
    numColor: 'text-white/[0.04]',
    badge: { label: 'Ultra Exclusive', cls: 'border border-[#C0C0C0]/30 text-[#C0C0C0]/70 bg-[#C0C0C0]/8' },
    nameTxt: 'text-white',
    taglineTxt: 'text-white/35',
    priceTxt: 'text-white',
    priceSubTxt: 'text-white/30',
    perksTxt: 'text-white/40',
    chipBg: 'bg-[#C0C0C0]/6 border-[#C0C0C0]/12 text-white/60',
    bodyBg: 'bg-[#080808]',
    darkBody: true,
    checkBg: 'bg-white/5 border-white/10',
    checkColor: 'text-white/45',
    privTitle: 'text-white/80',
    privNote: 'text-white/30',
    summaryBorder: 'rgba(192,192,192,0.10)',
    btnBg: 'bg-white hover:bg-gray-100 text-black font-extrabold',
    noteBg: 'bg-[#C0C0C0]/5 border-[#C0C0C0]/12',
  },
};

export async function generateStaticParams() {
  return plans.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const plan = getPlanById(id);
  if (!plan) return {};
  return {
    title: `${plan.name} Membership — WENS Force`,
    description: `${plan.tagline}. ${plan.trips} curated journeys/year · ${plan.vehicleType}. From ${INR(plan.price)}/year.`,
  };
}

export default async function PlanDetailPage({ params }) {
  const { id } = await params;
  const plan = getPlanById(id);
  if (!plan) notFound();

  const theme = TIER_THEMES[plan.id];
  const TierIcon = TIER_ICONS[plan.id] || Car;
  const anchorPrice = ANCHOR_PRICES[plan.id];
  const foundingSpots = FOUNDING_SPOTS[plan.id];
  const notIncluded = NOT_INCLUDED[plan.id] || [];
  const otherPlans = plans.filter((p) => p.id !== plan.id).slice(0, 4);

  const waMsg = `Hi WENS Force, I'm interested in the ${plan.name} membership (${INR(plan.price)}/yr). Can you help me get started?`;
  const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waMsg)}`;

  return (
    <div className="min-h-screen">

      {/* ── STICKY HEADER ── */}
      <header className="sticky top-0 z-40 border-b border-white/8" style={{ backgroundColor: '#0B1E3F' }}>
        <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <Link
            href="/#plans"
            className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft size={15} />
            All Plans
          </Link>
          <div className="flex items-center gap-2 text-white/50 text-xs hidden sm:flex">
            <span className="text-[#C9A24B] font-bold tracking-widest text-[10px] uppercase">WENS Force</span>
            <span>/</span>
            <span>{plan.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/booking/${plan.id}`}
              className="flex items-center gap-2 py-2 px-5 rounded-full font-bold text-black text-xs transition-all hover:opacity-90 hover:shadow-lg pulse-ring"
              style={{ background: 'linear-gradient(135deg,#C9A24B,#f0c940)', boxShadow: '0 4px 16px rgba(201,162,75,0.4)' }}
            >
              {plan.id === 'elite' && <Gem size={12} strokeWidth={2.5} />}
              {plan.id === 'sovereign' && <Crown size={12} strokeWidth={2.5} />}
              Buy Membership
            </Link>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 py-2 px-3.5 rounded-full font-semibold text-white/70 text-xs border border-white/15 hover:border-white/30 hover:text-white transition-all"
            >
              <svg viewBox="0 0 32 32" width="12" height="12" fill="currentColor">
                <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.668 4.799 1.836 6.793L2 30l7.393-1.812A13.918 13.918 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2z"/>
              </svg>
              Enquire
            </a>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <div
        className={`relative bg-gradient-to-br ${theme.headerGrad} overflow-hidden`}
        style={theme.headerStyle}
      >
        <div className={`absolute rounded-full blur-3xl pointer-events-none ${theme.orb1}`} />
        <div className={`absolute rounded-full blur-3xl pointer-events-none ${theme.orb2}`} />
        {plan.id === 'sovereign' && (
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(105deg, transparent 15%, rgba(180,180,180,0.025) 50%, transparent 85%)' }} />
        )}
        <div className={`absolute right-0 bottom-0 text-[clamp(140px,22vw,240px)] font-black leading-none select-none pointer-events-none ${theme.numColor}`}>
          {plan.packageNo}
        </div>

        <div className="relative max-w-6xl mx-auto px-6 sm:px-10 pt-12 pb-14">
          {/* Badge */}
          {theme.badge && (
            <div className="mb-6">
              <span className={`text-[10px] font-bold px-4 py-1.5 rounded-full tracking-[0.18em] uppercase ${theme.badge.cls}`}>
                {theme.badge.label}
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-end">
            {/* Left: Plan identity */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <TierIcon size={36} strokeWidth={1.2} className={theme.nameTxt} />
                <div>
                  <span className={`text-[11px] font-bold tracking-[0.3em] uppercase opacity-55 block ${theme.nameTxt}`}>
                    Membership {String(plan.packageNo).padStart(2, '0')}
                  </span>
                  <span className={`text-5xl sm:text-6xl font-black tracking-[0.05em] uppercase leading-none ${theme.nameTxt}`}>
                    {plan.name}
                  </span>
                </div>
              </div>
              <p className={`text-sm max-w-sm font-light leading-relaxed italic mb-6 ${theme.taglineTxt}`}>
                {plan.tagline}
              </p>

              {/* Spec pills */}
              <div className="flex flex-wrap gap-2">
                {[
                  { Icon: Navigation, text: `${plan.trips} Curated Journeys` },
                  { Icon: Car, text: plan.vehicleType },
                  {
                    Icon: plan.bodyguard.toLowerCase().includes('unarmed') ? Shield : ShieldCheck,
                    text: plan.bodyguard.toLowerCase().includes('unarmed') ? 'Unarmed Guard' : 'Armed Guard',
                  },
                ].map(({ Icon, text }, i) => (
                  <span key={i} className={`flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full border font-bold tracking-wide uppercase backdrop-blur-sm ${theme.chipBg}`}>
                    <Icon size={10} strokeWidth={2.5} />
                    {text}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Price + CTAs */}
            <div className="lg:text-right">
              {anchorPrice && (
                <div className="text-sm line-through opacity-45 mb-1" style={{ color: 'inherit' }}>
                  {INR(anchorPrice)}
                </div>
              )}
              <div className={`text-[48px] sm:text-6xl font-black tracking-tight leading-none ${theme.priceTxt}`}>
                {INR(plan.price)}
              </div>
              <div className={`text-sm mt-1.5 font-light ${theme.priceSubTxt}`}>
                per year, all-inclusive
              </div>
              <div className={`flex items-center gap-1.5 text-xs font-semibold mt-3 lg:justify-end ${theme.perksTxt}`}>
                <Gem size={11} strokeWidth={2} />
                ₹{plan.freePerksWorth.toLocaleString('en-IN')} in privileges included
              </div>

              {/* Founding spots */}
              <div className={`inline-flex items-center gap-2 text-xs font-semibold mt-4 px-4 py-2 rounded-full border lg:ml-auto ${theme.chipBg}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                Founding 100 · {foundingSpots} of 100 confirmed
              </div>

              {/* Hero CTAs */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 mt-6">
                {/* PRIMARY — Buy */}
                <Link
                  href={`/booking/${plan.id}`}
                  className="flex items-center justify-center gap-2 py-4 px-8 rounded-2xl font-black text-black text-sm transition-all hover:shadow-2xl hover:-translate-y-0.5 pulse-ring"
                  style={{
                    background: 'linear-gradient(135deg,#C9A24B 0%,#f0c940 50%,#C9A24B 100%)',
                    boxShadow: '0 8px 32px rgba(201,162,75,0.5)',
                  }}
                >
                  {plan.id === 'elite' && <Gem size={15} strokeWidth={2.5} />}
                  {plan.id === 'sovereign' && <Crown size={15} strokeWidth={2.5} />}
                  {plan.id === 'sovereign' ? 'Buy Sovereign Membership' : plan.id === 'elite' ? 'Buy Elite Membership' : `Buy ${plan.name} Membership`}
                  <span className="text-base">→</span>
                </Link>

                {/* SECONDARY — WhatsApp */}
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3.5 px-8 rounded-2xl font-semibold text-sm border-2 transition-all hover:opacity-80"
                  style={{ borderColor: 'rgba(37,211,102,0.4)', color: '#25D366', backgroundColor: 'transparent' }}
                >
                  <svg viewBox="0 0 32 32" width="15" height="15" fill="#25D366">
                    <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.668 4.799 1.836 6.793L2 30l7.393-1.812A13.918 13.918 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2z"/>
                  </svg>
                  Have a Question? WhatsApp Us
                </a>
              </div>

              <p className={`text-[10px] mt-4 lg:text-right ${theme.priceSubTxt}`}>
                Instant Activation &nbsp;·&nbsp; No Hidden Fees
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className={theme.bodyBg}>
        <div className="max-w-6xl mx-auto px-6 sm:px-10 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">

            {/* ── LEFT: Privileges ── */}
            <div>
              <p className={`text-[10px] font-bold tracking-[0.3em] uppercase mb-6 ${theme.darkBody ? 'text-white/25' : 'text-gray-300'}`}>
                All Included Privileges
              </p>
              <ul className="space-y-5">
                {plan.privileges.map((priv, i) => {
                  const PrivIcon = PRIV_ICONS[priv.icon] || Check;
                  return (
                    <li key={i} className="flex items-start gap-4">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${theme.checkBg}`}>
                        <PrivIcon size={15} strokeWidth={1.75} className={theme.checkColor} />
                      </div>
                      <div>
                        <span className={`text-[14px] font-semibold leading-snug block ${theme.privTitle}`}>
                          {priv.title}
                        </span>
                        {priv.desc && (
                          <span className={`text-[12px] font-light leading-snug block mt-0.5 ${theme.privNote}`}>
                            {priv.desc}
                          </span>
                        )}
                        {priv.worth && (
                          <span className={`text-[11px] font-semibold mt-1 inline-block ${theme.checkColor}`}>
                            worth {INR(priv.worth)}
                          </span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* What's NOT included */}
              {notIncluded.length > 0 && (
                <div className={`mt-10 p-5 rounded-2xl border ${theme.noteBg}`}>
                  <p className={`text-[10px] font-bold tracking-[0.25em] uppercase mb-3 ${theme.privNote}`}>
                    Not included in this plan
                  </p>
                  <ul className="space-y-1.5">
                    {notIncluded.map((item, i) => (
                      <li key={i} className={`flex items-center gap-2 text-[12px] font-light ${theme.privNote}`}>
                        <span className="opacity-40">–</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  {plan.id !== 'sovereign' && (
                    <Link
                      href={`/membership/${plans[plans.findIndex(p => p.id === plan.id) + 1]?.id || 'sovereign'}`}
                      className={`mt-4 text-[11px] font-semibold flex items-center gap-1 ${theme.checkColor}`}
                    >
                      See what the next tier adds
                      <ChevronRight size={12} strokeWidth={2.5} />
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* ── RIGHT: Summary + CTA ── */}
            <div className="space-y-5">
              {/* Plan summary box */}
              <div className={`rounded-2xl p-5 border ${theme.checkBg}`}>
                <p className={`text-[10px] font-bold tracking-[0.3em] uppercase mb-4 ${theme.darkBody ? 'text-white/25' : 'text-gray-300'}`}>
                  Plan Summary
                </p>
                {[
                  { label: 'Validity', val: plan.validity },
                  { label: 'Curated Journeys', val: `${plan.trips} per year` },
                  { label: 'Privileges Worth', val: `₹${plan.freePerksWorth.toLocaleString('en-IN')}` },
                  { label: 'Vehicle', val: plan.vehicleType },
                  { label: 'Security', val: plan.bodyguard },
                ].map(({ label, val }) => (
                  <div
                    key={label}
                    className="flex justify-between items-center py-2.5 border-b"
                    style={{ borderColor: theme.summaryBorder }}
                  >
                    <span className={`text-[12px] font-medium ${theme.privNote}`}>{label}</span>
                    <span className={`text-[12px] font-bold ${theme.privTitle}`}>{val}</span>
                  </div>
                ))}
              </div>

              {/* Founding 100 */}
              <div
                className={`flex items-center justify-center gap-2 text-[11px] py-3.5 rounded-2xl border font-semibold ${theme.checkBg}`}
                style={{ borderColor: plan.id === 'elite' ? 'rgba(201,162,75,0.25)' : undefined }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span className={theme.privTitle}>
                  Founding 100 Member · {foundingSpots} of 100 confirmed
                </span>
              </div>

              {/* CTA block — Buy is primary */}
              <div className="space-y-3">
                {/* PRIMARY — Buy */}
                <Link
                  href={`/booking/${plan.id}`}
                  className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-black text-black text-sm transition-all hover:shadow-2xl hover:-translate-y-0.5 pulse-ring"
                  style={{
                    background: 'linear-gradient(135deg,#C9A24B 0%,#f0c940 50%,#C9A24B 100%)',
                    boxShadow: '0 6px 24px rgba(201,162,75,0.45)',
                  }}
                >
                  {plan.id === 'elite' && <Gem size={14} strokeWidth={2.5} />}
                  {plan.id === 'sovereign' && <Crown size={14} strokeWidth={2.5} />}
                  {plan.id === 'sovereign' ? 'Buy Sovereign Membership' : plan.id === 'elite' ? 'Buy Elite Membership' : `Buy ${plan.name} — ${INR(plan.price)}`}
                  <span>→</span>
                </Link>

                {/* SECONDARY — WhatsApp */}
                <a
                  href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hi WENS Force, I have a question about the ' + plan.name + ' membership. Can you help?')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-sm font-semibold transition-all hover:opacity-90"
                  style={{ backgroundColor: '#25D366', color: 'white' }}
                >
                  <svg viewBox="0 0 32 32" width="14" height="14" fill="white">
                    <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.668 4.799 1.836 6.793L2 30l7.393-1.812A13.918 13.918 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2z"/>
                  </svg>
                  Have Questions? WhatsApp Us
                </a>
                <p className={`text-center text-[10px] ${theme.privNote}`}>
                  No Hidden Fees
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── PLAN-SPECIFIC FAQS ── */}
      {plan.faqs && plan.faqs.length > 0 && (
        <section className="py-14 px-6" style={{ backgroundColor: '#FAF6EC' }}>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-[#C9A24B] text-[10px] tracking-[0.4em] uppercase font-semibold mb-3">
                {plan.name} Specifics
              </p>
              <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#0B1E3F]">
                Questions about this plan
              </h2>
            </div>
            <div className="space-y-3">
              {plan.faqs.map((faq, i) => (
                <details
                  key={i}
                  className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-[#C9A24B]/30 transition-all duration-300 overflow-hidden"
                >
                  <summary className="flex items-center justify-between px-6 py-4 cursor-pointer font-semibold text-gray-800 hover:text-[#0B1E3F] transition-colors list-none gap-4">
                    <span className="text-[15px] text-left">{faq.q}</span>
                    <span className="text-gray-400 text-xl shrink-0 group-open:rotate-45 transition-transform duration-300 inline-block leading-none font-light">+</span>
                  </summary>
                  <div className="px-6 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4 font-light bg-gray-50/30">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── EXPLORE OTHER TIERS ── */}
      {otherPlans.length > 0 && (
        <section className="py-14 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-[#C9A24B] text-[10px] tracking-[0.4em] uppercase font-semibold mb-3">
                Compare Options
              </p>
              <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#0B1E3F]">
                Explore other tiers
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {otherPlans.map((p) => {
                const t = TIER_THEMES[p.id];
                const TIcon = TIER_ICONS[p.id] || Car;
                const isElite = p.id === 'elite';
                return (
                  <Link
                    key={p.id}
                    href={`/membership/${p.id}`}
                    className="group relative rounded-2xl overflow-hidden"
                    style={{
                      boxShadow: isElite ? '0 8px 32px -8px rgba(201,162,75,0.3)' : '0 4px 16px -4px rgba(0,0,0,0.1)',
                    }}
                  >
                    <div className={`bg-gradient-to-br ${t.headerGrad} p-5 h-full`}>
                      <div className="flex items-center gap-2 mb-3">
                        <TIcon size={16} strokeWidth={1.5} className={t.nameTxt} />
                        <span className={`text-xs font-bold tracking-wide uppercase ${t.nameTxt}`}>{p.name}</span>
                      </div>
                      <div className={`text-lg font-black ${t.priceTxt}`}>{INR(p.price)}</div>
                      <div className={`text-[10px] font-light mt-0.5 mb-3 ${t.taglineTxt}`}>per year</div>
                      <div
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full ${t.chipBg}`}
                      >
                        View
                        <ChevronRight size={10} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── FINAL CTA ── */}
      <section className="py-20 px-6" style={{ backgroundColor: '#0B1E3F' }}>
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            {plan.id === 'elite' && <Gem size={18} strokeWidth={1.5} className="text-[#C9A24B]" />}
            {plan.id === 'sovereign' && <Crown size={18} strokeWidth={1.5} className="text-[#C9A24B]" />}
            <p className="text-[#C9A24B] text-[10px] tracking-[0.4em] uppercase font-semibold">
              Founding 100 Programme
            </p>
          </div>

          <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-white mb-4 leading-snug">
            {foundingSpots} of 100 {plan.name} spots confirmed.<br />
            <span className="text-[#C9A24B]">Charter pricing locked for life.</span>
          </h2>

          <p className="text-white/45 text-sm font-light mb-8 leading-relaxed">
            Founding members lock current pricing permanently — no annual increases.<br />
            Join now before the remaining {100 - foundingSpots} spots are filled.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={`/booking/${plan.id}`}
              className="flex items-center gap-2 font-black py-4 px-9 rounded-full text-black text-sm pulse-ring"
              style={{ background: 'linear-gradient(135deg,#C9A24B,#f0c940)', boxShadow: '0 8px 32px rgba(201,162,75,0.5)' }}
            >
              Buy {plan.name} Membership →
            </Link>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border font-semibold py-4 px-8 rounded-full text-sm transition-all hover:bg-white/5"
              style={{ borderColor: '#25D366', color: '#25D366' }}
            >
              <svg viewBox="0 0 32 32" width="15" height="15" fill="#25D366">
                <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.668 4.799 1.836 6.793L2 30l7.393-1.812A13.918 13.918 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2z"/>
              </svg>
              Enquire on WhatsApp
            </a>
          </div>

          <p className="text-white/25 text-xs mt-6">
            +91-73046 07954 &nbsp;·&nbsp; concierge@wensforce.com
          </p>
        </div>
      </section>

      {/* ── FOOTER STRIP ── */}
      <div className="py-6 px-6 border-t text-center" style={{ backgroundColor: '#060606', borderColor: 'rgba(255,255,255,0.05)' }}>
        <Link
          href="/"
          className="text-sm font-light transition-colors"
          style={{ color: 'rgba(255,255,255,0.3)' }}
        >
          ← Back to wensforce.com
        </Link>
      </div>

      {/* ── MOBILE STICKY BAR ── */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-3" style={{ background: 'linear-gradient(to top, #0B1E3F 80%, transparent)' }}>
        <Link
          href={`/booking/${plan.id}`}
          className="flex items-center justify-center gap-2 w-full font-black py-4 rounded-2xl text-black text-sm pulse-ring"
          style={{ background: 'linear-gradient(135deg,#C9A24B,#f0c940)', boxShadow: '0 6px 24px rgba(201,162,75,0.45)' }}
        >
          Buy {plan.name} Membership — {INR(plan.price)}/yr →
        </Link>
        <p className="text-center text-white/35 text-[10px] mt-2">
          {100 - foundingSpots} founding spots remaining · No payment now
        </p>
      </div>

    </div>
  );
}
