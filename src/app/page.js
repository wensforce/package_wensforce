import Link from 'next/link';
import {
  Car, Users, ShieldCheck, Gem, Crown,
  Navigation, Shield, Calendar, Plane,
  Building2, Landmark, Sparkles, Utensils,
  Gift, Phone, Zap, Wifi, RefreshCw, Flame,
  UserCheck, CheckCircle, Check,
  Lock, BadgeCheck, Clock,
} from 'lucide-react';
import { plans, comparisonFeatures } from './data/plans';
import CountdownTimer from './components/CountdownTimer';
import LiveViewerBadge from './components/LiveViewerBadge';
import Header from './components/Header';
import HowItWorks from './components/HowItWorks';
import BookingPreview from './components/BookingPreview';
import PlansSection from './components/PlansSection';

const INR = (n) => '₹' + Number(n).toLocaleString('en-IN');

// Map plan id → hero icon for card
const TIER_ICONS = {
  essential: Car,
  executive: Users,
  premium: ShieldCheck,
  elite: Gem,
  sovereign: Crown,
};

// Map privilege emoji → Lucide icon
const PRIV_ICONS = {
  '🛕': Building2,
  '✈️': Plane,
  '🏛️': Landmark,
  '🛡️': ShieldCheck,
  '💆': Sparkles,
  '🍽️': Utensils,
  '🎁': Gift,
  '📞': Phone,
  '⚡': Zap,
  '🚗': Car,
  '🛜': Wifi,
  '🔄': RefreshCw,
  '👨‍👩‍👧': Users,
  '🪔': Flame,
  '🤵': UserCheck,
  '✅': CheckCircle,
  '🏎️': Car,
  '🏥': BadgeCheck,
};

const testimonials = [
  {
    name: 'Rajesh Mehta',
    role: 'Business Owner, Mumbai',
    avatar: 'RM',
    plan: 'ELITE',
    text: 'The armed escort and luxury vehicle made my family feel completely safe during pilgrimages. The VIP darshan access and dedicated relationship manager changed how we experience travel entirely.',
    rating: 5,
  },
  {
    name: 'Priya Sharma',
    role: 'Senior Executive, Delhi',
    avatar: 'PS',
    plan: 'ELITE',
    text: 'Unlimited airport lounge access and priority dispatch within 15 minutes — this is the standard I now expect. My RM handles everything before I even think to ask.',
    rating: 5,
  },
  {
    name: 'Vikram Nair',
    role: 'NRI, Bangalore',
    avatar: 'VN',
    plan: 'EXECUTIVE → ELITE',
    text: 'Started with Executive. The quality was excellent — so I upgraded to Elite the following year. The Bhasm Aarti VVIP booking at Ujjain was an experience I will never forget.',
    rating: 5,
  },
];

const faqs = [
  {
    q: 'Can I upgrade my plan during the year?',
    a: 'Yes. Upgrade any time by paying the pro-rated difference for remaining months. New benefits activate immediately and remaining trip credits carry over. Call your concierge to arrange.',
  },
  {
    q: 'How does Family-Transferable work?',
    a: 'Any household member — spouse, children, or parents at the same address — may use your trips. Sovereign members additionally extend a dedicated booking line to their spouse.',
  },
  {
    q: 'How do I book a trip?',
    a: 'Call or message our 24×7 concierge helpline. Premium and above members have a dedicated Relationship Manager as their single point of contact for all bookings and requests.',
  },
  {
    q: 'What is the cancellation policy?',
    a: 'Free cancellation up to 4 hours before scheduled pickup. Cancellations within 4 hours count as a redeemed trip. Unused trips and privileges lapse at the end of the 12-month period.',
  },
  {
    q: 'Which cities are covered?',
    a: 'WENS Force operates across Mumbai, Delhi NCR, Bangalore, Hyderabad, Chennai, Pune, Kolkata, Ahmedabad, and select Tier-2 cities. Outstation trips on request at a pro-rata rate.',
  },
  {
    q: 'Is there a money-back guarantee?',
    a: 'Yes. If you are not satisfied within the first 15 days, we offer a full refund — no questions asked.',
  },
];

// Unique visual theme per tier
const TIER_THEMES = {
  essential: {
    headerGrad: 'from-slate-700 via-slate-600 to-slate-800',
    orb1: 'bg-slate-400/20',
    orb2: 'bg-blue-400/10',
    numColor: 'text-white/[0.06]',
    badge: null,
    nameTxt: 'text-white',
    taglineTxt: 'text-slate-300/70',
    priceTxt: 'text-white',
    priceSubTxt: 'text-slate-300/60',
    perksTxt: 'text-slate-300/70',
    bodyBg: 'bg-white',
    divider: 'border-gray-100',
    chipBg: 'bg-slate-50 border-slate-100 text-slate-600',
    checkBg: 'bg-slate-50 border-slate-100',
    checkColor: 'text-slate-500',
    privTitle: 'text-gray-800',
    privNote: 'text-slate-400',
    moreTxt: 'text-slate-400',
    scarBg: 'bg-amber-50 border-amber-200 text-amber-700',
    btnBg: 'bg-slate-800 hover:bg-slate-900 text-white',
    btnSecTxt: 'text-slate-400 hover:text-slate-600',
    cardShadow: 'shadow-lg hover:shadow-xl',
    cardRing: 'ring-1 ring-slate-200',
  },
  executive: {
    headerGrad: 'from-blue-800 via-indigo-800 to-blue-900',
    orb1: 'bg-blue-400/20',
    orb2: 'bg-indigo-300/15',
    numColor: 'text-white/[0.06]',
    badge: { label: 'Most Popular', cls: 'bg-white/15 border border-white/20 text-white/90' },
    nameTxt: 'text-white',
    taglineTxt: 'text-blue-200/70',
    priceTxt: 'text-white',
    priceSubTxt: 'text-blue-200/60',
    perksTxt: 'text-blue-200/80',
    bodyBg: 'bg-white',
    divider: 'border-gray-100',
    chipBg: 'bg-blue-50 border-blue-100 text-blue-700',
    checkBg: 'bg-blue-50 border-blue-100',
    checkColor: 'text-blue-500',
    privTitle: 'text-gray-800',
    privNote: 'text-blue-400',
    moreTxt: 'text-blue-400',
    scarBg: 'bg-amber-50 border-amber-200 text-amber-700',
    btnBg: 'bg-blue-800 hover:bg-blue-900 text-white',
    btnSecTxt: 'text-blue-400 hover:text-blue-600',
    cardShadow: 'shadow-xl hover:shadow-2xl',
    cardRing: 'ring-1 ring-blue-100',
  },
  premium: {
    headerGrad: 'from-gray-800 via-gray-700 to-gray-900',
    orb1: 'bg-gray-400/15',
    orb2: 'bg-red-400/10',
    numColor: 'text-white/[0.06]',
    badge: null,
    nameTxt: 'text-white',
    taglineTxt: 'text-gray-300/70',
    priceTxt: 'text-white',
    priceSubTxt: 'text-gray-300/60',
    perksTxt: 'text-gray-300/80',
    bodyBg: 'bg-white',
    divider: 'border-gray-100',
    chipBg: 'bg-gray-50 border-gray-200 text-gray-600',
    checkBg: 'bg-gray-50 border-gray-100',
    checkColor: 'text-gray-500',
    privTitle: 'text-gray-800',
    privNote: 'text-gray-400',
    moreTxt: 'text-gray-400',
    scarBg: 'bg-amber-50 border-amber-200 text-amber-700',
    btnBg: 'bg-gray-900 hover:bg-black text-white',
    btnSecTxt: 'text-gray-400 hover:text-gray-600',
    cardShadow: 'shadow-lg hover:shadow-xl',
    cardRing: 'ring-1 ring-gray-200',
  },
  elite: {
    headerGrad: 'from-[#3d2800] via-[#7a5400] to-[#2a1c00]',
    orb1: 'bg-[#BF9F00]/30',
    orb2: 'bg-yellow-300/20',
    numColor: 'text-[#BF9F00]/[0.12]',
    badge: { label: '✦ Recommended', cls: 'shimmer-bg text-black' },
    nameTxt: 'text-[#f0c940]',
    taglineTxt: 'text-[#BF9F00]/70',
    priceTxt: 'text-[#f0c940]',
    priceSubTxt: 'text-[#BF9F00]/60',
    perksTxt: 'text-[#BF9F00]/80',
    bodyBg: 'bg-[#0f0a00]',
    divider: 'border-[#BF9F00]/12',
    chipBg: 'bg-[#BF9F00]/10 border-[#BF9F00]/20 text-[#BF9F00]/90',
    checkBg: 'bg-[#BF9F00]/10 border-[#BF9F00]/20',
    checkColor: 'text-[#BF9F00]',
    privTitle: 'text-white/85',
    privNote: 'text-[#BF9F00]/55',
    moreTxt: 'text-[#BF9F00]/55',
    scarBg: 'bg-[#BF9F00]/10 border-[#BF9F00]/25 text-[#BF9F00]/80',
    btnBg: 'bg-[#BF9F00] hover:bg-[#a88a00] text-black font-extrabold pulse-ring',
    btnSecTxt: 'text-[#BF9F00]/45 hover:text-[#BF9F00]/80',
    cardShadow: 'shadow-2xl',
    cardRing: 'ring-1 ring-[#BF9F00]/30',
  },
  sovereign: {
    headerGrad: 'from-[#080808] via-[#141414] to-[#060606]',
    orb1: 'bg-white/5',
    orb2: 'bg-white/3',
    numColor: 'text-white/[0.04]',
    badge: { label: 'Ultra Exclusive', cls: 'border border-white/15 text-white/50 bg-white/5' },
    nameTxt: 'text-white',
    taglineTxt: 'text-white/35',
    priceTxt: 'text-white',
    priceSubTxt: 'text-white/35',
    perksTxt: 'text-white/40',
    bodyBg: 'bg-[#0a0a0a]',
    divider: 'border-white/8',
    chipBg: 'bg-white/5 border-white/10 text-white/50',
    checkBg: 'bg-white/5 border-white/10',
    checkColor: 'text-white/45',
    privTitle: 'text-white/75',
    privNote: 'text-white/30',
    moreTxt: 'text-white/30',
    scarBg: 'bg-white/5 border-white/10 text-white/40',
    btnBg: 'bg-white hover:bg-gray-100 text-black font-extrabold',
    btnSecTxt: 'text-white/25 hover:text-white/50',
    cardShadow: 'shadow-2xl',
    cardRing: 'ring-1 ring-white/8',
  },
};

function PlanCard({ plan }) {
  const isElite = plan.highlight;
  const isSovereign = plan.isAnchor;
  const TierIcon = TIER_ICONS[plan.id] || Car;
  const theme = TIER_THEMES[plan.id] || TIER_THEMES.essential;

  return (
    <div
      className={[
        'relative flex flex-col rounded-[28px] overflow-hidden transition-all duration-500 group',
        theme.cardShadow,
        theme.cardRing,
        isElite ? 'md:-translate-y-4 md:scale-[1.02]' : 'hover:-translate-y-1',
      ].join(' ')}
    >
      {/* ── HEADER (full-bleed gradient hero) ── */}
      <div className={`relative bg-linear-to-br ${theme.headerGrad} px-6 pt-7 pb-8 overflow-hidden`}>
        {/* Decorative orbs */}
        <div className={`absolute -top-8 -right-8 w-40 h-40 rounded-full blur-3xl ${theme.orb1} pointer-events-none`} />
        <div className={`absolute bottom-0 left-0 w-32 h-32 rounded-full blur-2xl ${theme.orb2} pointer-events-none`} />

        {/* Giant background tier number */}
        <div className={`absolute -right-2 -bottom-4 text-[120px] font-black leading-none select-none pointer-events-none ${theme.numColor}`}>
          {plan.packageNo}
        </div>

        {/* Badge */}
        {theme.badge && (
          <div className="mb-4">
            <span className={`text-[9px] font-bold px-3 py-1 rounded-full tracking-[0.2em] uppercase ${theme.badge.cls}`}>
              {theme.badge.label}
            </span>
          </div>
        )}
        {!theme.badge && <div className="mb-4 h-5" />}

        {/* Tier icon */}
        <div className="mb-4">
          <TierIcon size={28} strokeWidth={1.25} className={`${theme.nameTxt} opacity-90`} />
        </div>

        {/* Tier name */}
        <div className={`text-2xl font-black tracking-[0.08em] uppercase leading-none mb-1.5 ${theme.nameTxt}`}>
          {plan.name}
        </div>
        <div className={`text-[11px] leading-snug font-light ${theme.taglineTxt}`}>
          {plan.tagline}
        </div>

        {/* Price row pinned to bottom of header */}
        <div className="mt-6 flex items-end justify-between">
          <div>
            <div className={`text-[28px] font-black tracking-tight leading-none ${theme.priceTxt}`}>
              {INR(plan.price)}
            </div>
            <div className={`text-[11px] mt-1 font-light ${theme.priceSubTxt}`}>
              {INR(plan.perMonth)} / month · 12 months
            </div>
          </div>
          <div className={`text-right text-[10px] font-semibold ${theme.perksTxt}`}>
            <div className="flex items-center gap-1 justify-end">
              <Gem size={10} strokeWidth={2} />
              Perks worth
            </div>
            <div className="text-base font-black mt-0.5" style={{ color: 'inherit' }}>
              ₹{plan.freePerksWorth.toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className={`flex-1 flex flex-col ${theme.bodyBg} px-5 pt-5 pb-6`}>

        {/* Spec pills row */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {[
            { Icon: Navigation, text: `${plan.trips} Trips` },
            { Icon: Car, text: plan.vehicleType },
            {
              Icon: plan.bodyguard.toLowerCase().includes('unarmed') ? Shield : ShieldCheck,
              text: plan.bodyguard.toLowerCase().includes('unarmed') ? 'Unarmed' : 'Armed Guard',
            },
          ].map(({ Icon, text }, i) => (
            <span key={i} className={`flex items-center gap-1.5 text-[10px] px-2.5 py-1.5 rounded-full border font-bold tracking-wide uppercase ${theme.chipBg}`}>
              <Icon size={9} strokeWidth={2.5} />
              {text}
            </span>
          ))}
        </div>

        {/* Privileges */}
        <ul className="space-y-3 flex-1">
          {plan.privileges.slice(0, 3).map((priv, i) => {
            const PrivIcon = PRIV_ICONS[priv.icon] || Check;
            return (
              <li key={i} className="flex items-start gap-3">
                <div className={`w-6 h-6 rounded-xl flex items-center justify-center shrink-0 mt-0.5 border ${theme.checkBg}`}>
                  <PrivIcon size={11} strokeWidth={2.25} className={theme.checkColor} />
                </div>
                <div className="min-w-0">
                  <span className={`text-[12px] font-semibold leading-snug block ${theme.privTitle}`}>
                    {priv.title}
                  </span>
                  {priv.worth && (
                    <span className={`text-[10px] font-medium ${theme.privNote}`}>
                      worth {INR(priv.worth)}
                    </span>
                  )}
                </div>
              </li>
            );
          })}
          {plan.privileges.length > 3 && (
            <li className={`text-[11px] pl-9 font-semibold ${theme.moreTxt}`}>
              +{plan.privileges.length - 3} more privileges
            </li>
          )}
        </ul>

        {/* Scarcity */}
        {plan.spotsLeft <= 8 && (
          <div className={`mt-4 flex items-center justify-center gap-1.5 text-[10px] py-2 rounded-2xl border font-bold tracking-wide uppercase ${theme.scarBg}`}>
            <Clock size={10} strokeWidth={2.5} />
            Only {plan.spotsLeft} spots left
          </div>
        )}

        {/* CTA */}
        <div className="mt-5 space-y-2">
          <Link
            href={`/membership/${plan.id}`}
            className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-sm transition-all ${theme.btnBg}`}
          >
            {isElite && <Gem size={14} strokeWidth={2} />}
            {isSovereign && <Crown size={14} strokeWidth={2} />}
            {isElite ? 'Claim Elite' : isSovereign ? 'Enquire Now' : 'Get Started'}
          </Link>
          <Link
            href={`/membership/${plan.id}`}
            className={`block w-full text-center text-[11px] py-1.5 font-medium transition-colors ${theme.btnSecTxt}`}
          >
            View full details →
          </Link>
        </div>
      </div>
    </div>
  );
}

function ComparisonTable() {
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm bg-white">
      <table className="w-full min-w-[780px] text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left px-6 py-5 text-xs text-gray-400 w-48 font-normal">Feature</th>
            {plans.map((plan) => {
              const TierIcon = TIER_ICONS[plan.id] || Car;
              return (
                <th
                  key={plan.id}
                  className={[
                    'px-3 py-5 text-center',
                    plan.highlight ? 'bg-[#BF9F00]/5 border-x border-[#BF9F00]/15' : '',
                    plan.isAnchor ? 'bg-gray-900/3' : '',
                  ].join(' ')}
                >
                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className={[
                        'w-8 h-8 rounded-xl flex items-center justify-center border',
                        plan.highlight
                          ? 'bg-[#BF9F00]/15 border-[#BF9F00]/25'
                          : plan.isAnchor
                          ? 'bg-white/5 border-white/10'
                          : 'bg-gray-50 border-gray-100',
                      ].join(' ')}
                    >
                      <TierIcon
                        size={14}
                        strokeWidth={1.75}
                        className={
                          plan.highlight ? 'text-[#BF9F00]' : plan.isAnchor ? 'text-gray-400' : 'text-gray-500'
                        }
                      />
                    </div>
                    <div
                      className={[
                        'text-xs font-bold tracking-wide',
                        plan.highlight ? 'text-[#BF9F00]' : plan.isAnchor ? 'text-gray-700' : 'text-gray-600',
                      ].join(' ')}
                    >
                      {plan.name}
                    </div>
                    <div className={['text-[10px]', plan.highlight ? 'text-[#BF9F00]/60' : 'text-gray-400'].join(' ')}>
                      {INR(plan.price)}/yr
                    </div>
                    {plan.highlight && (
                      <div className="text-[9px] bg-[#BF9F00] text-black font-bold px-2.5 py-0.5 rounded-full tracking-wide">
                        BEST VALUE
                      </div>
                    )}
                    {plan.isPopular && (
                      <div className="text-[9px] bg-emerald-600 text-white font-bold px-2.5 py-0.5 rounded-full tracking-wide">
                        POPULAR
                      </div>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {comparisonFeatures.map((feature, i) => (
            <tr key={feature.key} className={['border-b border-gray-50', i % 2 !== 0 ? 'bg-gray-50/40' : ''].join(' ')}>
              <td className="px-6 py-3 text-xs text-gray-500">{feature.label}</td>
              {feature.values.map((val, j) => (
                <td
                  key={j}
                  className={[
                    'px-3 py-3 text-center',
                    plans[j].highlight ? 'bg-[#BF9F00]/5 border-x border-[#BF9F00]/15' : '',
                    plans[j].isAnchor ? 'bg-gray-900/3' : '',
                  ].join(' ')}
                >
                  {val === '✓' ? (
                    <CheckCircle size={14} strokeWidth={2} className="text-emerald-500 mx-auto" />
                  ) : val === '—' ? (
                    <span className="text-gray-200 text-sm">—</span>
                  ) : (
                    <span
                      className={[
                        'text-xs font-medium',
                        plans[j].highlight ? 'text-[#BF9F00]' : plans[j].isAnchor ? 'text-gray-600' : 'text-gray-700',
                      ].join(' ')}
                    >
                      {val}
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function MembershipPage() {
  return (
    <div className="min-h-screen relative">
      {/* Header */}
      <Header />

      {/* Top bar */}
      <div className="bg-black text-white py-2.5 px-6 text-center">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-3 text-xs flex-wrap">
          <span className="text-gray-400">Current pricing valid until June 1, 2026</span>
          <span className="text-gray-600">—</span>
          <CountdownTimer targetDate="2026-06-01T00:00:00" />
          <span className="hidden sm:inline text-gray-600">|</span>
          <span className="text-[#BF9F00]">+91-7304607954</span>
        </div>
      </div>

      {/* Hero Section - Minimalist */}
      <section className="bg-black text-white pt-16 pb-24 px-6 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #BF9F00 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-[#F1F3F5] to-transparent" />

        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-[#BF9F00] text-xs tracking-[0.3em] uppercase font-semibold mb-6 animate-fade-in">
            WENS Force &nbsp;·&nbsp; Premium Membership
          </p>
          
          {/* Modern hero headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-6 animate-fade-in animation-delay-75">
            Travel With
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BF9F00] via-[#e8c900] to-[#BF9F00]">
              Unmatched Prestige
            </span>
          </h1>

          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-12 leading-relaxed font-light animate-fade-in animation-delay-150">
            Luxury vehicles, professional security, VIP experiences, and dedicated concierge service—all in one premium membership designed for those who demand the best.
          </p>

          {/* Stats Grid */}
          <div className="flex justify-center gap-10 sm:gap-16 mb-14 flex-wrap animate-fade-in animation-delay-225">
            {[
              { val: '2,400+', label: 'Active Members', Icon: Users },
              { val: '98.7%', label: 'Satisfaction', Icon: BadgeCheck },
              { val: '10 min', label: 'Dispatch', Icon: Zap },
              { val: '₹95,000+', label: 'Benefits/Year', Icon: Gem },
            ].map((s) => (
              <div key={s.label} className="text-center group cursor-default">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <s.Icon size={13} className="text-[#BF9F00]/60 group-hover:text-[#BF9F00] transition-colors" strokeWidth={1.75} />
                  <div className="text-2xl sm:text-3xl font-bold text-white">{s.val}</div>
                </div>
                <div className="text-gray-500 text-xs">{s.label}</div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in animation-delay-300">
            <a
              href="#plans"
              className="inline-flex items-center gap-2 bg-[#BF9F00] text-black font-semibold py-4 px-10 rounded-full text-base hover:bg-[#a88a00] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 group"
            >
              <Gem size={16} strokeWidth={2} className="group-hover:scale-110 transition-transform" />
              View Membership Plans
            </a>
            <a
              href="#compare"
              className="inline-flex items-center gap-2 border-2 border-white/20 text-white font-semibold py-4 px-10 rounded-full text-base hover:border-white/40 hover:bg-white/10 transition-all backdrop-blur-sm"
            >
              Compare Plans
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>

          <p className="text-gray-600 text-xs mt-8">
            ✓ Annual billing &nbsp; • &nbsp; ✓ 15-day money-back guarantee &nbsp; • &nbsp; ✓ Instant activation
          </p>
        </div>
      </section>


      {/* Plans */}
      <PlansSection />

      {/* Comparison table */}
      <section id="compare" className="max-w-screen-xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Compare Plans</h2>
          <p className="text-gray-400 text-sm font-light">Everything side by side — so you can choose with clarity.</p>
        </div>
        <ComparisonTable />
      </section>

      {/* How It Works */}
      <HowItWorks />

      {/* Booking Preview */}
      <BookingPreview />

      {/* Testimonials */}
      <section className="bg-gradient-to-b from-black via-black to-gray-900 py-20 px-6 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 right-0 w-96 h-96 bg-[#BF9F00]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/3 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#BF9F00] text-xs tracking-[0.3em] uppercase font-semibold mb-3">Member Stories</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Trusted Across India</h2>
            <p className="text-gray-400 text-sm mt-2 font-light">Hear from our members about their experience with WENS Force</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="group relative bg-white/4 border border-white/8 rounded-2xl p-7 flex flex-col hover:border-white/15 hover:bg-white/6 transition-all duration-300">
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#BF9F00]/0 to-[#BF9F00]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />

                {/* Stars */}
                <div className="flex items-center gap-1 text-[#BF9F00] mb-5">
                  {[...Array(t.rating)].map((_, j) => (
                    <Gem key={j} size={14} strokeWidth={1.5} fill="currentColor" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-white/70 text-sm leading-relaxed flex-1 font-light mb-6 italic">
                  &ldquo;{t.text}&rdquo;
                </p>

                {/* Divider */}
                <div className="border-t border-white/8 pt-5" />

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#BF9F00] to-[#a88a00] flex items-center justify-center text-black text-xs font-bold shrink-0">
                    {t.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-white text-sm font-semibold">{t.name}</div>
                    <div className="text-white/40 text-xs">{t.role}</div>
                  </div>
                  <span className="text-[10px] bg-white/8 text-white/50 px-2.5 py-1 rounded-full shrink-0 font-medium border border-white/10">
                    {t.plan}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust signals */}
      <section className="max-w-5xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { Icon: Lock, title: 'Secure Payments', desc: 'All transactions processed via PCI-DSS compliant gateways. Your data is protected.' },
            { Icon: BadgeCheck, title: '15-Day Money-Back', desc: 'Not satisfied in the first 15 days? Full refund, no questions asked.' },
            { Icon: ShieldCheck, title: 'Licensed & Verified', desc: 'All vehicles, drivers, and security personnel are licensed, insured, and background-verified.' },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#BF9F00]/8 border border-[#BF9F00]/15 flex items-center justify-center shrink-0">
                <item.Icon size={18} strokeWidth={1.75} className="text-[#BF9F00]" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{item.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed font-light">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 pb-16 pt-8">
        <div className="text-center mb-12">
          <p className="text-[#BF9F00] text-xs tracking-[0.3em] uppercase font-semibold mb-3">Questions?</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h2>
          <p className="text-gray-500 text-base font-light">Everything you need to know about WENS Force membership</p>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details 
              key={i} 
              className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-300 overflow-hidden"
            >
              <summary className="flex items-center justify-between px-6 py-4 cursor-pointer font-semibold text-gray-800 hover:text-[#BF9F00] transition-colors list-none gap-4">
                <span className="text-base text-left">{faq.q}</span>
                <span className="text-gray-400 text-xl shrink-0 group-open:rotate-45 transition-transform duration-300 inline-block leading-none font-light">
                  +
                </span>
              </summary>
              <div className="px-6 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4 font-light bg-gray-50/30 animation-reveal">
                {faq.a}
              </div>
            </details>
          ))}
        </div>

        {/* Still have questions? */}
        <div className="mt-12 p-8 bg-gradient-to-r from-[#BF9F00]/8 to-blue-500/8 border border-[#BF9F00]/20 rounded-2xl text-center">
          <p className="text-gray-700 font-medium mb-2">Still have questions?</p>
          <p className="text-gray-600 text-sm mb-4">Our concierge team is available 24/7 to help</p>
          <a 
            href="tel:+917304607954"
            className="inline-flex items-center gap-2 text-[#BF9F00] font-semibold hover:text-[#a88a00] transition-colors"
          >
            <Phone size={16} />
            +91-7304-607954
          </a>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-black text-white py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Crown size={20} strokeWidth={1.5} className="text-[#BF9F00]" />
            <p className="text-[#BF9F00] text-xs tracking-[0.3em] uppercase font-semibold">Limited Time</p>
            <Crown size={20} strokeWidth={1.5} className="text-[#BF9F00]" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Secure Your Membership
            <br />
            <span className="text-[#BF9F00]">Before June 1st</span>
          </h2>
          <p className="text-gray-400 text-base mb-10 font-light leading-relaxed">
            Pricing increases on June 1, 2026. Join 2,400+ members who already travel with the security and prestige of
            WENS Force.
          </p>

          <div className="flex items-center justify-center gap-8 mb-10 flex-wrap">
            {[
              { Icon: Gem, val: '5', sub: 'Elite slots left' },
              { Icon: Crown, val: '3', sub: 'Sovereign slots left' },
              { Icon: Calendar, val: '28 days', sub: 'Until price increase' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <s.Icon size={14} className="text-[#BF9F00]/60" strokeWidth={1.5} />
                  <div className="text-2xl font-bold text-[#BF9F00]">{s.val}</div>
                </div>
                <div className="text-gray-600 text-xs">{s.sub}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/membership/elite"
              className="flex items-center gap-2 bg-[#BF9F00] text-black font-semibold py-3.5 px-9 rounded-full text-sm hover:bg-[#a88a00] transition-all pulse-ring"
            >
              <Gem size={15} strokeWidth={2} />
              Claim Elite Membership
            </Link>
            <a
              href="#plans"
              className="border border-white/15 text-white/60 font-medium py-3.5 px-8 rounded-full text-sm hover:border-white/30 hover:text-white transition-all"
            >
              View All Plans
            </a>
          </div>
          <p className="text-gray-700 text-xs mt-5">www.wensforce.com &nbsp;·&nbsp; +91-7304607954</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#080808] border-t border-white/5 py-10 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Crown size={16} className="text-[#BF9F00]" strokeWidth={1.5} />
            <span className="text-[#BF9F00] font-bold text-base tracking-[0.25em] uppercase">WENS Force</span>
          </div>
          <p className="text-gray-600 text-xs max-w-sm mx-auto mb-6 font-light">
            Where Every Journey Becomes an Arrival.
          </p>
          <div className="flex justify-center gap-6 text-xs text-gray-700 flex-wrap">
            {['Privacy Policy', 'Terms & Conditions', 'Refund Policy', 'Contact Us'].map((item) => (
              <span key={item} className="hover:text-gray-500 cursor-pointer transition-colors">
                {item}
              </span>
            ))}
          </div>
          <p className="text-gray-800 text-xs mt-6">© 2026 WENS Force. All rights reserved.</p>
        </div>
      </footer>

      {/* Sticky mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-black/95 backdrop-blur border-t border-white/8 px-5 py-3">
        <div className="flex items-center gap-4">
          <div className="flex-1 min-w-0">
            <div className="text-[10px] text-gray-500 uppercase tracking-widest">Elite Membership</div>
            <div className="text-[#BF9F00] font-semibold text-sm">₹99,999 / yr &nbsp;·&nbsp; 5 slots left</div>
          </div>
          <Link
            href="/membership/elite"
            className="flex items-center gap-1.5 bg-[#BF9F00] text-black font-semibold py-2.5 px-4 rounded-xl text-xs whitespace-nowrap shrink-0"
          >
            <Gem size={12} strokeWidth={2} />
            Get Started
          </Link>
        </div>
      </div>
      <div className="h-16 md:hidden" />
    </div>
  );
}
