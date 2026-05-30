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
  essential: 65000,
  executive: 85000,
  premium: 135000,
  elite: 195000,
  sovereign: 365000,
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

// Per-plan hero imagery (high-res, confirmed Unsplash IDs)
const HERO_IMAGES = {
  essential: '/cards/Sedan_Essential_Desktop.png',
  executive: '/cards/BMW_Executive_v2.png',
  premium:   '/cards/GLC_Premium_v2.png',
  elite:     '/cards/S-Class_Elite_v2.jpg',
  sovereign: '/cards/Defender_Sovereign_v2.png',
};

// Service category imagery for the showcase section
const SERVICE_IMAGES = {
  transport:  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=85',
  airport:    '/services/airport_lounge.png',
  SUV:        '/services/SUV.png',
  vip_darshan: '/services/Vip_Darshan.png',
  sedan:       '/services/Sedan.png',
  Luxury_SUV:  '/services/luxury_suv.png',
  spa:        'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=85',
  dining:     '/services/dining.png',
  security:   '/services/bodyguard.png',
  concierge:  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=85',
  heritage:   'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=900&q=85',
  sovereign:  'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=900&q=85',
};

// Per-plan editorial service showcase blocks
const PLAN_SERVICES = {
  essential: [
    {
      img: 'vip_darshan',
      cat: 'Curated Journeys',
      title: 'Skip the Queue.\nEnter in Reverence.',
      body: '3 VIP darshan experiences per year at India\'s most sacred shrines — pre-arranged so you arrive in peace, not in line.',
      Icon: Building2,
    },
    {
      img: 'sedan',
      cat: 'Ground Transport',
      title: 'Luxury Sedan,\nAt Your Command.',
      body: 'A professional chauffeur in a premium sedan — timed pickups, zero waiting, door-to-door on every leg of your journey.',
      Icon: Car,
    },
    {
      img: 'concierge',
      cat: '24×7 Concierge',
      title: 'One Call.\nEverything Solved.',
      body: 'Round-the-clock travel support. Booking changes, emergency assistance, local guidance — always answered, always resolved.',
      Icon: Phone,
    },
  ],
  executive: [
    {
      img: 'airport',
      cat: 'Airport Lounge Access',
      title: 'Every Departure,\nin Comfort.',
      body: 'Domestic airport lounge access on every trip — quiet spaces, premium refreshments, high-speed Wi-Fi, and unhurried time before you fly.',
      Icon: Plane,
    },
    {
      img: 'SUV',
      cat: 'SUV Transport',
      title: 'SUV Class\non Every Road.',
      body: 'A standard SUV with a dedicated professional driver — more space, more presence, and more comfort for every pilgrimage journey.',
      Icon: Car,
    },
    {
      img: 'heritage',
      cat: 'Heritage Access',
      title: 'History Unfolds\nBefore You.',
      body: 'Pre-arranged fast-track passes to India\'s heritage monuments — walk in, while others wait in line.',
      Icon: Landmark,
    },
  ],
  premium: [
    {
      img: 'security',
      cat: 'Personal Security',
      title: 'Trained Protection,\nAlways Present.',
      body: 'A trained security professional for every journey — discreet, professional, and prepared for any situation that may arise.',
      Icon: Shield,
    },
    {
      img: 'Luxury_SUV',
      cat: 'Premium SUV',
      title: 'Luxury SUV,\nProfessional Driver.',
      body: 'A premium SUV with a vetted professional driver — comfort and capability on every road that matters.',
      Icon: Car,
    },
    {
      img: 'airport',
      cat: 'Airport Lounge',
      title: 'Lounge Access\nEvery Single Trip.',
      body: 'Domestic lounge access on every journey — arrive refreshed, depart without the terminal chaos.',
      Icon: Plane,
    },
    {
      img: 'heritage',
      cat: 'Heritage Fast-Track',
      title: 'Every Monument,\nNo Waiting.',
      body: 'Skip general queues at India\'s most visited heritage sites — pre-arranged, every time you visit.',
      Icon: Landmark,
    },
  ],
  elite: [
    {
      img: 'vip_darshan',
      cat: 'VVIP Darshan',
      title: 'The Inner Sanctum\nAwaits You.',
      body: 'Bhasm Aarti VVIP booking at Ujjain, priority access at Kashi Vishwanath, Shirdi, Tirupati — all pre-arranged, no exceptions.',
      Icon: Building2,
    },
    {
      img: 'security',
      cat: 'Armed Security',
      title: 'Armed Protection\nat Every Step.',
      body: 'A trained armed bodyguard for every trip — discreet, professional, ready. The only plan where protection is never a question.',
      Icon: ShieldCheck,
    },
    {
      img: 'airport',
      cat: 'International Lounges',
      title: '3× International\nLounge Access.',
      body: 'Three international airport lounge passes per year — quieter spaces, premium service for your most important journeys.',
      Icon: Plane,
    },
    {
      img: 'spa',
      cat: 'Spa & Wellness',
      title: '3 Premium\nSpa Sessions.',
      body: 'Three curated spa and wellness sessions at India\'s top-rated centres — restore between journeys, arrive at your best.',
      Icon: Sparkles,
    },
  ],
  sovereign: [
    {
      img: 'vip_darshan',
      cat: 'Unlimited VVIP Access',
      title: 'Every Shrine.\nNo Limits.',
      body: 'Unlimited VIP darshan, exclusive Bhasm Aarti VVIP reservations, and bespoke pilgrimage curation — the sovereign standard.',
      Icon: Crown,
    },
    {
      img: 'security',
      cat: 'Full Security Detail',
      title: 'Armed Guard +\nRisk Assessment.',
      body: 'An armed bodyguard plus a full personal security risk assessment for each journey — the absolute highest standard of protection.',
      Icon: Shield,
    },
    {
      img: 'airport',
      cat: 'Full Lounge Network',
      title: 'Domestic +\nInternational Lounges.',
      body: 'Complete airport lounge network access across India and internationally — every departure and arrival, in absolute comfort.',
      Icon: Plane,
    },
    {
      img: 'dining',
      cat: 'Fine Dining',
      title: 'Curated Fine Dining\nExperiences.',
      body: 'Two fine dining vouchers at India\'s finest restaurants — meals that are an event in themselves, not just a meal.',
      Icon: Utensils,
    },
  ],
};

const TIER_THEMES = {
  essential: {
    headerGrad: 'from-slate-700 via-slate-600 to-slate-800',
    accentColor: '#64748b',
    accentRgb: '100,116,139',
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
    heroOverlay: 'from-black/80 via-black/55 to-black/25',
    statsAccent: '#94a3b8',
  },
  executive: {
    headerGrad: 'from-blue-900 via-indigo-800 to-blue-950',
    accentColor: '#3b82f6',
    accentRgb: '59,130,246',
    orb1: 'bg-blue-400/25 -top-16 -right-16 w-64 h-64',
    orb2: 'bg-indigo-300/15 bottom-0 left-4 w-44 h-44',
    numColor: 'text-white/[0.07]',
    badge: null,
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
    heroOverlay: 'from-blue-950/85 via-black/55 to-black/20',
    statsAccent: '#60a5fa',
  },
  premium: {
    headerGrad: 'from-gray-800 via-gray-700 to-gray-900',
    accentColor: '#374151',
    accentRgb: '55,65,81',
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
    heroOverlay: 'from-gray-950/85 via-black/55 to-black/20',
    statsAccent: '#9ca3af',
  },
  elite: {
    headerGrad: 'from-[#2a1c00] via-[#6b4800] to-[#1a1000]',
    accentColor: '#C9A24B',
    accentRgb: '201,162,75',
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
    heroOverlay: 'from-[#1a0e00]/90 via-black/60 to-black/20',
    statsAccent: '#C9A24B',
  },
  sovereign: {
    headerGrad: 'from-[#080808] via-[#2a2a2a] to-[#080808]',
    headerStyle: { background: 'linear-gradient(135deg, #050505 0%, #0e0e0e 25%, #272727 48%, #2e2e2e 52%, #252525 56%, #0e0e0e 75%, #050505 100%)' },
    accentColor: '#C0C0C0',
    accentRgb: '192,192,192',
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
    heroOverlay: 'from-black/90 via-black/65 to-black/25',
    statsAccent: '#a8a8a8',
  },
};

export async function generateStaticParams() {
  return plans.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const plan = getPlanById(id);
  if (!plan) return {};
  const title = `${plan.name} Membership — WENS Force`;
  const description = `${plan.tagline}. ${plan.trips} curated journeys/year · ${plan.vehicleType}. From ${INR(plan.price)}/year.`;
  const url = `https://subscription.wensforce.com/membership/${id}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      locale: 'en_IN',
      url,
      title,
      description,
      images: [{ url: HERO_IMAGES[id] || '/og-default.webp', width: 1200, height: 630, alt: `WENS Force ${plan.name} Membership` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [HERO_IMAGES[id] || '/og-default.webp'],
    },
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
  const services = PLAN_SERVICES[plan.id] || [];

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
          <div className="hidden sm:flex items-center gap-2 text-white/50 text-xs">
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
                <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.668 4.799 1.836 6.793L2 30l7.393-1.812A13.918 13.918 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2z" />
              </svg>
              Enquire
            </a>
          </div>
        </div>
      </header>

      {/* ── CINEMATIC HERO ── */}
      <section className="relative overflow-hidden" style={{ minHeight: '88vh' }}>
        {/* Background image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO_IMAGES[plan.id]}
          alt={plan.name}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'brightness(0.75) saturate(0.9)' }}
        />

        {/* Gradient overlays */}
        <div className={`absolute inset-0 bg-gradient-to-r ${theme.heroOverlay}`} />
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(135deg, rgba(${theme.accentRgb},0.18) 0%, transparent 55%)` }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 35%)' }} />

        {/* Giant plan-number watermark */}
        <div
          className="absolute select-none pointer-events-none font-black text-white leading-none"
          style={{
            fontSize: 'clamp(180px, 30vw, 340px)',
            opacity: 0.045,
            right: '-1vw',
            top: '8%',
            letterSpacing: '-0.05em',
            lineHeight: 0.85,
          }}
        >
          {String(plan.packageNo).padStart(2, '0')}
        </div>

        {/* Content */}
        <div className="relative max-w-6xl mx-auto px-6 sm:px-10 pt-16 pb-20 flex flex-col justify-end" style={{ minHeight: '88vh' }}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 items-end">

            {/* Left: Plan identity */}
            <div>
              {/* Breadcrumb label */}
              <div className="flex items-center gap-3 mb-5">
                <span className="text-[10px] font-bold tracking-[0.45em] uppercase" style={{ color: theme.accentColor }}>
                  WENS Force · Membership {String(plan.packageNo).padStart(2, '0')}
                </span>
                {theme.badge && (
                  <span className={`text-[9px] font-bold px-3 py-1 rounded-full tracking-[0.2em] uppercase ${theme.badge.cls}`}>
                    {theme.badge.label}
                  </span>
                )}
              </div>

              {/* Massive plan name */}
              <div className="flex items-center gap-4 mb-4">
                <TierIcon strokeWidth={1} className="text-white shrink-0" style={{ width: 'clamp(28px,3vw,44px)', height: 'clamp(28px,3vw,44px)' }} />
                <h1
                  className="text-white font-black leading-none tracking-tight"
                  style={{ fontSize: 'clamp(62px, 11vw, 118px)' }}
                >
                  {plan.name}
                </h1>
              </div>

              {/* Tagline */}
              <p className="text-white/50 font-light italic leading-relaxed mb-8 max-w-lg"
                style={{ fontSize: 'clamp(14px, 1.4vw, 17px)' }}>
                {plan.tagline}
              </p>

              {/* Spec chips */}
              <div className="flex flex-wrap gap-2.5">
                {[
                  { Icon: Navigation, text: `${plan.trips} Curated Journeys /yr` },
                  { Icon: Car, text: plan.vehicleType },
                  {
                    Icon: plan.bodyguard.toLowerCase().includes('mma fighter') ? Shield : ShieldCheck,
                    text: plan.bodyguard.toLowerCase().includes('mma fighter') ? 'MMA Fighter' : 'Armed Bodyguard',
                  },
                ].map(({ Icon, text }, i) => (
                  <span
                    key={i}
                    className={`flex items-center gap-2 text-[11px] px-4 py-2 rounded-full border font-bold tracking-wide uppercase backdrop-blur-sm ${theme.chipBg}`}
                  >
                    <Icon size={11} strokeWidth={2.5} />
                    {text}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Glassmorphism price card */}
            <div>
              <div
                className="rounded-2xl p-6 backdrop-blur-2xl"
                style={{
                  background: 'rgba(4,8,16,0.62)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
                }}
              >
                {anchorPrice && (
                  <div className="text-xs line-through text-white/30 mb-1">{INR(anchorPrice)}*</div>
                )}
                <div
                  className="font-black tracking-tight leading-none"
                  style={{
                    fontSize: 'clamp(36px, 4vw, 52px)',
                    color: plan.id === 'elite' ? '#f0c940' : plan.id === 'sovereign' ? '#d0d0d0' : 'white',
                  }}
                >
                  {INR(plan.price)}*
                </div>
                <div className="text-white/50 text-[11px] font-semibold mb-1">GST 18% Extra</div>
                <div className="text-white/35 text-xs font-light mb-5">per year, all-inclusive</div>

                <div className="space-y-2.5 mb-5 border-t pt-4" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                  <div className="flex items-center gap-2 text-xs text-white/50">
                    <Gem size={11} strokeWidth={2} style={{ color: '#C9A24B' }} />
                   Privilege worth ₹{anchorPrice?.toLocaleString('en-IN')} @  ₹{plan.price.toLocaleString('en-IN')}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    Founding 100 · {plan.confirmed} of 100 confirmed
                  </div>
                </div>

                {/* Primary CTA */}
                <Link
                  href={`/booking/${plan.id}`}
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-black text-black text-sm mb-2.5 transition-all hover:opacity-90 hover:-translate-y-0.5 pulse-ring"
                  style={{
                    background: 'linear-gradient(135deg,#C9A24B 0%,#f0c940 50%,#C9A24B 100%)',
                    boxShadow: '0 6px 24px rgba(201,162,75,0.5)',
                  }}
                >
                  {plan.id === 'elite' && <Gem size={14} strokeWidth={2.5} />}
                  {plan.id === 'sovereign' && <Crown size={14} strokeWidth={2.5} />}
                  Buy {plan.name} Membership →
                </Link>

                {/* WhatsApp CTA */}
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold border transition-all hover:opacity-80"
                  style={{ borderColor: 'rgba(37,211,102,0.35)', color: '#25D366', backgroundColor: 'transparent' }}
                >
                  <svg viewBox="0 0 32 32" width="13" height="13" fill="#25D366">
                    <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.668 4.799 1.836 6.793L2 30l7.393-1.812A13.918 13.918 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2z" />
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

      {/* ── STATS STRIP ── */}
      <div style={{ backgroundColor: '#0B1E3F' }} className="py-10 px-6 border-b border-white/5">
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 divide-x divide-white/[0.06]">
          {[
            { num: plan.trips, suffix: '', label: 'Curated Journeys / Year' },
            { num: `₹${(plan.freePerksWorth / 1000).toFixed(0)}K+`, suffix: '', label: 'In Privileges' },
            { num: `${foundingSpots}/100`, suffix: '', label: 'Founding Spots Left' },
            { num: '24×7', suffix: '', label: 'Concierge Support' },
          ].map(({ num, label }, i) => (
            <div key={i} className={`${i === 0 ? '' : 'pl-8'} text-center sm:text-left`}>
              <div
                className="font-black leading-none mb-1.5 tabular-nums"
                style={{ fontSize: 'clamp(28px,3.5vw,42px)', color: theme.statsAccent || '#C9A24B' }}
              >
                {num}
              </div>
              <div className="text-[10px] font-semibold tracking-[0.28em] uppercase text-white/30">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SERVICE SHOWCASE ── */}
      <section
        className="py-24 px-6"
        style={{ backgroundColor: theme.darkBody ? '#080808' : '#FAFAF8' }}
      >
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="mb-16 max-w-xl">
            <p className="text-[9px] font-bold tracking-[0.55em] uppercase mb-3" style={{ color: '#C9A24B' }}>
              What You Get
            </p>
            <h2
              className={`font-black leading-tight ${theme.darkBody ? 'text-white' : 'text-[#0B1E3F]'}`}
              style={{ fontSize: 'clamp(32px,5vw,54px)' }}
            >
              A Year of<br />Extraordinary Access
            </h2>
          </div>

          {/* Editorial alternating blocks */}
          <div className="space-y-6">
            {services.map((svc, i) => (
              <div
                key={i}
                className="group grid grid-cols-1 lg:grid-cols-2 overflow-hidden rounded-2xl transition-shadow hover:shadow-2xl"
                style={{
                  background: theme.darkBody ? 'rgba(255,255,255,0.03)' : 'white',
                  border: theme.darkBody ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.06)',
                  boxShadow: theme.darkBody
                    ? '0 2px 24px rgba(0,0,0,0.4)'
                    : '0 2px 12px rgba(0,0,0,0.06)',
                }}
              >
                {/* Image side */}
                <div
                  className={`relative overflow-hidden ${i % 2 === 1 ? 'lg:order-2' : ''}`}
                  style={{ minHeight: '300px' }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={SERVICE_IMAGES[svc.img] || SERVICE_IMAGES.journey}
                    alt={svc.cat}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ minHeight: '300px' }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)' }}
                  />
                  {/* Category pill */}
                  <div className="absolute bottom-5 left-5">
                    <span
                      className="text-[9px] font-bold tracking-[0.4em] uppercase px-3 py-1.5 rounded-full backdrop-blur-sm"
                      style={{
                        background: `rgba(${theme.accentRgb},0.25)`,
                        color: theme.accentColor,
                        border: `1px solid rgba(${theme.accentRgb},0.3)`,
                      }}
                    >
                      {svc.cat}
                    </span>
                  </div>
                </div>

                {/* Text side */}
                <div
                  className={`flex flex-col justify-center px-10 py-12 ${i % 2 === 1 ? 'lg:order-1' : ''}`}
                >
                  <div className="mb-5">
                    <svc.Icon
                      strokeWidth={1}
                      style={{ color: theme.accentColor, width: 36, height: 36 }}
                    />
                  </div>
                  <h3
                    className={`font-black leading-snug mb-4 whitespace-pre-line ${theme.darkBody ? 'text-white' : 'text-[#0B1E3F]'}`}
                    style={{ fontSize: 'clamp(22px,2.5vw,30px)' }}
                  >
                    {svc.title}
                  </h3>
                  <p
                    className={`text-sm font-light leading-relaxed ${theme.darkBody ? 'text-white/45' : 'text-gray-500'}`}
                  >
                    {svc.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRIVILEGES + STICKY SUMMARY ── */}
      <div className={theme.bodyBg}>
        <div className="max-w-6xl mx-auto px-6 sm:px-10 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-14">

            {/* LEFT: Privileges grid */}
            <div>
              <p
                className="text-[9px] font-bold tracking-[0.5em] uppercase mb-3"
                style={{ color: '#C9A24B' }}
              >
                Full Breakdown
              </p>
              <h2
                className={`font-black mb-10 ${theme.darkBody ? 'text-white' : 'text-[#0B1E3F]'}`}
                style={{ fontSize: 'clamp(26px,3.5vw,38px)' }}
              >
                All Included Privileges
              </h2>

              {/* 2-col card grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {plan.privileges.map((priv, i) => {
                  const PrivIcon = PRIV_ICONS[priv.icon] || Check;
                  return (
                    <div
                      key={i}
                      className={`p-5 rounded-2xl border transition-all hover:shadow-lg hover:-translate-y-0.5 ${theme.checkBg}`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3.5 border ${theme.checkBg}`}
                      >
                        <PrivIcon size={18} strokeWidth={1.5} className={theme.checkColor} />
                      </div>
                      <h4 className={`text-[14px] font-bold leading-snug mb-1.5 ${theme.privTitle}`}>
                        {priv.title}
                      </h4>
                      {priv.desc && (
                        <p className={`text-[11px] font-light leading-snug ${theme.privNote}`}>
                          {priv.desc}
                        </p>
                      )}
                      {priv.worth && (
                        <div className={`mt-3 text-[10px] font-bold tracking-wide uppercase ${theme.checkColor}`}>
                          worth {INR(priv.worth)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Not included */}
              {notIncluded.length > 0 && (
                <div className={`mt-10 p-6 rounded-2xl border ${theme.noteBg}`}>
                  <p className={`text-[9px] font-bold tracking-[0.35em] uppercase mb-5 ${theme.privNote}`}>
                    Not included in this plan
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6">
                    {notIncluded.map((item, i) => (
                      <div key={i} className={`flex items-center gap-2 text-[12px] font-light ${theme.privNote}`}>
                        <span className="opacity-30 text-base leading-none">–</span>
                        {item}
                      </div>
                    ))}
                  </div>
                  {plan.id !== 'sovereign' && (
                    <Link
                      href={`/membership/${plans[plans.findIndex((p) => p.id === plan.id) + 1]?.id || 'sovereign'}`}
                      className={`mt-5 text-[11px] font-semibold flex items-center gap-1.5 ${theme.checkColor}`}
                    >
                      See what the next tier adds
                      <ChevronRight size={12} strokeWidth={2.5} />
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* RIGHT: Sticky summary + CTAs */}
            <div className="lg:sticky lg:top-24 h-fit space-y-4">

              {/* Plan summary */}
              <div
                className={`rounded-2xl overflow-hidden border ${theme.checkBg}`}
                style={{ borderColor: plan.id === 'elite' ? 'rgba(201,162,75,0.2)' : undefined }}
              >
                <div
                  className="px-5 py-4 border-b"
                  style={{ borderColor: theme.summaryBorder }}
                >
                  <p className={`text-[9px] font-bold tracking-[0.35em] uppercase ${theme.darkBody ? 'text-white/25' : 'text-gray-300'}`}>
                    Plan Summary
                  </p>
                </div>
                <div className="p-5">
                  {[
                    { label: 'Validity', val: plan.validity },
                    { label: 'Curated Journeys', val: `${plan.trips} per year` },
                    { label: 'Privileges Worth', val: `₹${anchorPrice?.toLocaleString('en-IN')}` },
                    { label: 'Vehicle', val: plan.vehicleType },
                    { label: 'Security', val: plan.bodyguard },
                  ].map(({ label, val }) => (
                    <div
                      key={label}
                      className="flex justify-between items-center py-3 border-b last:border-0"
                      style={{ borderColor: theme.summaryBorder }}
                    >
                      <span className={`text-[11px] font-medium ${theme.privNote}`}>{label}</span>
                      <span className={`text-[12px] font-bold ${theme.privTitle}`}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Founding spots indicator */}
              <div
                className={`flex items-center justify-center gap-2 text-[11px] py-3 rounded-xl border font-semibold ${theme.checkBg}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span className={theme.privTitle}>
                  Founding 100 · {foundingSpots}/100 confirmed
                </span>
              </div>

              {/* CTAs */}
              <div className="space-y-2.5">
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
                  {plan.id === 'sovereign'
                    ? 'Buy Sovereign Membership'
                    : plan.id === 'elite'
                    ? 'Buy Elite Membership'
                    : `Buy ${plan.name} — ${INR(plan.price)}`}
                  <span>→</span>
                </Link>

                <a
                  href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hi WENS Force, I have a question about the ' + plan.name + ' membership.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-sm font-semibold transition-all hover:opacity-90"
                  style={{ backgroundColor: '#25D366', color: 'white' }}
                >
                  <svg viewBox="0 0 32 32" width="14" height="14" fill="white">
                    <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.668 4.799 1.836 6.793L2 30l7.393-1.812A13.918 13.918 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2z" />
                  </svg>
                  Have Questions? WhatsApp Us
                </a>

                <p className={`text-center text-[10px] ${theme.privNote}`}>
                  No Hidden Fees · Instant Activation
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── FAQs ── */}
      {plan.faqs && plan.faqs.length > 0 && (
        <section className="py-20 px-6" style={{ backgroundColor: '#FAF6EC' }}>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-[#C9A24B] text-[9px] tracking-[0.5em] uppercase font-semibold mb-3">
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
                  <summary className="flex items-center justify-between px-6 py-4.5 cursor-pointer font-semibold text-gray-800 hover:text-[#0B1E3F] transition-colors list-none gap-4">
                    <span className="text-[15px] text-left py-0.5">{faq.q}</span>
                    <span className="text-gray-400 text-2xl shrink-0 group-open:rotate-45 transition-transform duration-300 inline-block leading-none font-light">+</span>
                  </summary>
                  <div className="px-6 pb-6 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4 font-light bg-gray-50/30">
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
        <section className="py-20 px-6" style={{ backgroundColor: theme.darkBody ? '#050505' : 'white' }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-[#C9A24B] text-[9px] tracking-[0.5em] uppercase font-semibold mb-3">
                Compare Options
              </p>
              <h2
                className={`font-serif-display text-2xl sm:text-3xl font-bold ${theme.darkBody ? 'text-white' : 'text-[#0B1E3F]'}`}
              >
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
                    className="group relative rounded-2xl overflow-hidden transition-all hover:-translate-y-1"
                    style={{
                      boxShadow: isElite
                        ? '0 8px 32px -8px rgba(201,162,75,0.35)'
                        : '0 4px 16px -4px rgba(0,0,0,0.12)',
                    }}
                  >
                    <div className={`bg-gradient-to-br ${t.headerGrad} p-5 h-full`} style={t.headerStyle}>
                      <div className="flex items-center gap-2 mb-3">
                        <TIcon size={15} strokeWidth={1.5} className={t.nameTxt} />
                        <span className={`text-[10px] font-black tracking-widest uppercase ${t.nameTxt}`}>
                          {p.name}
                        </span>
                      </div>
                      <div className={`text-lg font-black leading-none mb-0.5 ${t.priceTxt}`}>
                        {INR(p.price)}* 
                        <br />
                        <span className='text-xs text-gray-400 font-semibold' >GST 18% Extra</span>
                      </div>
                      <div className={`text-[9px] font-light mb-4 ${t.taglineTxt}`}>per year</div>
                      <div
                        className={`inline-flex items-center gap-1 text-[9px] font-bold px-2.5 py-1 rounded-full ${t.chipBg}`}
                      >
                        View plan
                        <ChevronRight size={9} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
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
      <section className="py-24 px-6" style={{ backgroundColor: '#0B1E3F' }}>
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-5">
            {plan.id === 'elite' && <Gem size={18} strokeWidth={1.5} className="text-[#C9A24B]" />}
            {plan.id === 'sovereign' && <Crown size={18} strokeWidth={1.5} className="text-[#C9A24B]" />}
            <p className="text-[#C9A24B] text-[9px] tracking-[0.5em] uppercase font-semibold">
              Founding 100 Programme
            </p>
          </div>

          <h2
            className="font-serif-display font-bold text-white mb-5 leading-snug"
            style={{ fontSize: 'clamp(24px,4vw,38px)' }}
          >
            {foundingSpots} of 100 {plan.name} spots confirmed.<br />
            <span className="text-[#C9A24B]">Charter pricing locked for life.</span>
          </h2>

          <p className="text-white/40 text-sm font-light mb-10 leading-relaxed">
            Founding members lock current pricing permanently — no annual increases.<br />
            Join now before the remaining {100 - foundingSpots} spots are filled.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={`/booking/${plan.id}`}
              className="flex items-center gap-2 font-black py-4 px-10 rounded-full text-black text-sm pulse-ring"
              style={{
                background: 'linear-gradient(135deg,#C9A24B,#f0c940)',
                boxShadow: '0 8px 32px rgba(201,162,75,0.5)',
              }}
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
                <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.668 4.799 1.836 6.793L2 30l7.393-1.812A13.918 13.918 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2z" />
              </svg>
              Enquire on WhatsApp
            </a>
          </div>

          <p className="text-white/20 text-xs mt-8">
            +91-73046 07954 &nbsp;·&nbsp; concierge@wensforce.com
          </p>
        </div>
      </section>

      {/* ── FOOTER STRIP ── */}
      <div
        className="py-6 px-6 border-t text-center"
        style={{ backgroundColor: '#060606', borderColor: 'rgba(255,255,255,0.05)' }}
      >
        <Link
          href="/"
          className="text-sm font-light transition-colors"
          style={{ color: 'rgba(255,255,255,0.25)' }}
        >
          ← Back to wensforce.com
        </Link>
      </div>

      {/* ── MOBILE STICKY BAR ── */}
      <div
        className="sm:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-3"
        style={{ background: 'linear-gradient(to top, #0B1E3F 80%, transparent)' }}
      >
        <Link
          href={`/booking/${plan.id}`}
          className="flex items-center justify-center gap-2 w-full font-black py-4 rounded-2xl text-black text-sm pulse-ring"
          style={{
            background: 'linear-gradient(135deg,#C9A24B,#f0c940)',
            boxShadow: '0 6px 24px rgba(201,162,75,0.45)',
          }}
        >
          Buy {plan.name} — {INR(plan.price)}/yr →
        </Link>
        <p className="text-center text-white/30 text-[10px] mt-2">
          {100 - foundingSpots} founding spots remaining · No payment now
        </p>
      </div>

    </div>
  );
}
