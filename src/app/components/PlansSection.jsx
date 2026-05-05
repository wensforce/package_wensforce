'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Car, Users, ShieldCheck, Gem, Crown,
  Navigation, Shield, Building2, Plane, Landmark,
  Sparkles, Utensils, Gift, Phone, Zap, Wifi,
  RefreshCw, Flame, UserCheck, CheckCircle, Check,
  ChevronRight,
} from 'lucide-react';
import { plans } from '../data/plans';

const INR = (n) => '₹' + Number(n).toLocaleString('en-IN');

// Anchor (was) prices for strikethrough display
const ANCHOR_PRICES = {
  essential: 34999,
  executive: 64999,
  premium: 99999,
  elite: 130000,
  sovereign: 250000,
};

// Founding 100 spots confirmed per tier
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
  '👨‍👩‍👧': Users, '🪔': Flame, '🤵': UserCheck, '✅': CheckCircle, '🏎️': Car,
};

const THEMES = {
  essential: {
    headerGrad: 'from-slate-700 via-slate-600 to-slate-800',
    tabActive: 'bg-slate-800 text-white shadow-lg',
    orb1: 'bg-slate-400/25 -top-12 -right-12 w-52 h-52',
    orb2: 'bg-blue-400/10 bottom-0 left-4 w-36 h-36',
    numColor: 'text-white/[0.07]',
    badge: null,
    nameTxt: 'text-white', taglineTxt: 'text-slate-300/70',
    priceTxt: 'text-white', priceSubTxt: 'text-slate-300/55',
    perksTxt: 'text-slate-300/70', bodyBg: 'bg-white',
    chipBg: 'bg-slate-50 border-slate-200 text-slate-600',
    checkBg: 'bg-slate-50 border-slate-100', checkColor: 'text-slate-400',
    privTitle: 'text-gray-900', privNote: 'text-slate-400',
    btnBg: 'bg-slate-800 hover:bg-slate-900 text-white',
    btnSecTxt: 'text-slate-400 hover:text-slate-700',
    accentColor: '#475569',
  },
  executive: {
    headerGrad: 'from-blue-900 via-indigo-800 to-blue-950',
    tabActive: 'bg-blue-800 text-white shadow-lg',
    orb1: 'bg-blue-400/25 -top-12 -right-12 w-52 h-52',
    orb2: 'bg-indigo-300/15 bottom-0 left-4 w-44 h-44',
    numColor: 'text-white/[0.07]',
    badge: { label: 'Most Popular', cls: 'bg-white/15 border border-white/20 text-white' },
    nameTxt: 'text-white', taglineTxt: 'text-blue-200/70',
    priceTxt: 'text-white', priceSubTxt: 'text-blue-200/60',
    perksTxt: 'text-blue-200/80', bodyBg: 'bg-white',
    chipBg: 'bg-blue-50 border-blue-100 text-blue-700',
    checkBg: 'bg-blue-50 border-blue-100', checkColor: 'text-blue-500',
    privTitle: 'text-gray-900', privNote: 'text-blue-400',
    btnBg: 'bg-blue-800 hover:bg-blue-900 text-white',
    btnSecTxt: 'text-blue-400 hover:text-blue-700',
    accentColor: '#1d4ed8',
  },
  premium: {
    headerGrad: 'from-gray-800 via-gray-750 to-gray-900',
    tabActive: 'bg-gray-800 text-white shadow-lg',
    orb1: 'bg-gray-400/15 -top-12 -right-12 w-52 h-52',
    orb2: 'bg-red-400/8 bottom-0 left-4 w-40 h-40',
    numColor: 'text-white/[0.06]',
    badge: null,
    nameTxt: 'text-white', taglineTxt: 'text-gray-300/65',
    priceTxt: 'text-white', priceSubTxt: 'text-gray-300/55',
    perksTxt: 'text-gray-300/75', bodyBg: 'bg-white',
    chipBg: 'bg-gray-50 border-gray-200 text-gray-600',
    checkBg: 'bg-gray-50 border-gray-100', checkColor: 'text-gray-500',
    privTitle: 'text-gray-900', privNote: 'text-gray-400',
    btnBg: 'bg-gray-900 hover:bg-black text-white',
    btnSecTxt: 'text-gray-400 hover:text-gray-700',
    accentColor: '#374151',
  },
  elite: {
    headerGrad: 'from-[#2a1c00] via-[#6b4800] to-[#1a1000]',
    tabActive: 'bg-[#C9A24B] text-black shadow-lg shadow-[#C9A24B]/30',
    orb1: 'bg-[#C9A24B]/35 -top-12 -right-12 w-56 h-56',
    orb2: 'bg-yellow-400/15 bottom-0 left-4 w-44 h-44',
    numColor: 'text-[#C9A24B]/[0.13]',
    badge: { label: '◆ Best Value — 6 in 10 choose this', cls: 'shimmer-bg text-black font-extrabold' },
    nameTxt: 'text-[#f0c940]', taglineTxt: 'text-[#C9A24B]/65',
    priceTxt: 'text-[#f0c940]', priceSubTxt: 'text-[#C9A24B]/55',
    perksTxt: 'text-[#C9A24B]/80', bodyBg: 'bg-[#0d0800]',
    chipBg: 'bg-[#C9A24B]/10 border-[#C9A24B]/20 text-[#C9A24B]/90',
    checkBg: 'bg-[#C9A24B]/10 border-[#C9A24B]/20', checkColor: 'text-[#C9A24B]',
    privTitle: 'text-white/85', privNote: 'text-[#C9A24B]/55',
    btnBg: 'bg-[#C9A24B] hover:bg-[#a88000] text-black font-extrabold pulse-ring',
    btnSecTxt: 'text-[#C9A24B]/45 hover:text-[#C9A24B]/80',
    accentColor: '#C9A24B',
  },
  sovereign: {
    headerGrad: 'from-[#080808] via-[#2a2a2a] to-[#080808]',
    headerStyle: { background: 'linear-gradient(135deg, #070707 0%, #181818 25%, #4a4a4a 48%, #5c5c5c 52%, #484848 56%, #1a1a1a 75%, #070707 100%)' },
    tabActive: 'bg-black/90 text-white border border-white/20 shadow-lg',
    orb1: 'bg-[#C0C0C0]/14 -top-12 -right-12 w-56 h-56',
    orb2: 'bg-[#B8B9BC]/9 bottom-0 left-4 w-44 h-44',
    numColor: 'text-white/[0.04]',
    badge: { label: 'Ultra Exclusive', cls: 'border border-[#C0C0C0]/30 text-[#C0C0C0]/70 bg-[#C0C0C0]/8' },
    nameTxt: 'text-white', taglineTxt: 'text-white/35',
    priceTxt: 'text-white', priceSubTxt: 'text-white/30',
    perksTxt: 'text-white/40', bodyBg: 'bg-[#080808]',
    chipBg: 'bg-[#C0C0C0]/6 border-[#C0C0C0]/12 text-white/50',
    checkBg: 'bg-white/5 border-white/10', checkColor: 'text-white/45',
    privTitle: 'text-white/80', privNote: 'text-white/30',
    btnBg: 'bg-white hover:bg-gray-100 text-black font-extrabold',
    btnSecTxt: 'text-white/25 hover:text-white/55',
    accentColor: '#C0C0C0',
  },
};

const TAB_ORDER = ['essential', 'executive', 'premium', 'elite', 'sovereign'];

export default function PlansSection() {
  const [activeId, setActiveId] = useState('elite');
  const plan = plans.find((p) => p.id === activeId);
  const theme = THEMES[activeId];
  const TierIcon = TIER_ICONS[activeId] || Car;
  const anchorPrice = ANCHOR_PRICES[activeId];
  const foundingSpots = FOUNDING_SPOTS[activeId];

  return (
    <section id="plans" className="w-full px-4 sm:px-8 pt-20 pb-16 max-w-6xl mx-auto">
      {/* Section header */}
      <div className="text-center mb-12">
        <p className="text-[#C9A24B] text-[10px] tracking-[0.4em] uppercase font-semibold mb-3">Five Tiers</p>
        <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#0B1E3F] mb-3">
          Choose Your Membership
        </h2>
        <p className="text-gray-500 text-base max-w-md mx-auto font-light">
          Every plan includes VIP darshan, airport lounges, 24×7 concierge, and luxury transport — pre-arranged for the year.
        </p>
      </div>

      {/* Tier selector tabs */}
      <div className="flex justify-center flex-wrap gap-2 sm:gap-3 mb-10">
        {TAB_ORDER.map((id) => {
          const Icon = TIER_ICONS[id] || Car;
          const t = THEMES[id];
          const isActive = id === activeId;
          return (
            <button
              key={id}
              onClick={() => setActiveId(id)}
              className={[
                'flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border',
                isActive
                  ? t.tabActive + ' scale-105'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700',
              ].join(' ')}
            >
              <Icon size={13} strokeWidth={2} className={isActive ? '' : 'text-gray-400'} />
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </button>
          );
        })}
      </div>

      {/* Card spotlight */}
      <div
        key={activeId}
        className="max-w-4xl mx-auto rounded-4xl overflow-hidden shadow-2xl"
        style={{ animation: 'fadeSlideUp 0.35s ease both', ...(activeId === 'sovereign' && { boxShadow: '0 0 0 1px rgba(192,192,192,0.18), 0 0 60px rgba(150,150,150,0.08), 0 30px 70px rgba(0,0,0,0.7)' }) }}
      >
        {/* HERO HEADER */}
        <div className={`relative bg-linear-to-br ${theme.headerGrad} overflow-hidden`} style={theme.headerStyle}>
          <div className={`absolute rounded-full blur-3xl pointer-events-none ${theme.orb1}`} />
          <div className={`absolute rounded-full blur-3xl pointer-events-none ${theme.orb2}`} />
          {activeId === 'sovereign' && (
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(105deg, transparent 15%, rgba(220,220,220,0.05) 50%, transparent 85%)' }} />
          )}
          <div className={`absolute right-0 bottom-0 text-[clamp(120px,20vw,200px)] font-black leading-none select-none pointer-events-none ${theme.numColor}`}>
            {plan.packageNo}
          </div>

          <div className="relative px-8 sm:px-12 pt-10 pb-10">
            {theme.badge && (
              <div className="mb-5">
                <span className={`text-[10px] font-bold px-4 py-1.5 rounded-full tracking-[0.18em] uppercase ${theme.badge.cls}`}>
                  {theme.badge.label}
                </span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <TierIcon size={32} strokeWidth={1.25} className={theme.nameTxt} />
                  <div>
                    <span className={`text-[11px] font-bold tracking-[0.3em] uppercase opacity-60 ${theme.nameTxt}`}>
                      {String(plan.packageNo).padStart(2, '0')} &nbsp;
                    </span>
                    <span className={`text-4xl sm:text-5xl font-black tracking-[0.06em] uppercase ${theme.nameTxt}`}>
                      {plan.name}
                    </span>
                  </div>
                </div>
                <p className={`text-sm max-w-xs font-light leading-relaxed italic ${theme.taglineTxt}`}>
                  {plan.tagline}
                </p>
                {/* Spec pills — "Curated Journeys" instead of "Trips" */}
                <div className="flex flex-wrap gap-2 mt-5">
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

              {/* Anchor + hero price */}
              <div className="sm:text-right shrink-0">
                {anchorPrice && (
                  <div className="text-sm line-through opacity-50" style={{ color: 'inherit' }}>
                    {INR(anchorPrice)}
                  </div>
                )}
                <div className={`text-[42px] sm:text-5xl font-black tracking-tight leading-none ${theme.priceTxt}`}>
                  {INR(plan.price)}
                </div>
                <div className={`text-sm mt-1 font-light ${theme.priceSubTxt}`}>
                  per year, all-inclusive
                </div>
                <div className={`flex items-center gap-1.5 text-xs font-semibold mt-3 sm:justify-end ${theme.perksTxt}`}>
                  <Gem size={11} strokeWidth={2} />
                  ₹{plan.freePerksWorth.toLocaleString('en-IN')} in privileges included
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className={`${theme.bodyBg} px-8 sm:px-12 py-8`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Privileges list */}
            <div>
              <p className={`text-[10px] font-bold tracking-[0.3em] uppercase mb-5 ${activeId === 'sovereign' ? 'text-white/25' : activeId === 'elite' ? 'text-[#C9A24B]/40' : 'text-gray-300'}`}>
                Included Privileges
              </p>
              <ul className="space-y-4">
                {plan.privileges.map((priv, i) => {
                  const PrivIcon = PRIV_ICONS[priv.icon] || Check;
                  return (
                    <li key={i} className="flex items-start gap-3">
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border ${theme.checkBg}`}>
                        <PrivIcon size={13} strokeWidth={2} className={theme.checkColor} />
                      </div>
                      <div>
                        <span className={`text-[13px] font-semibold leading-snug block ${theme.privTitle}`}>
                          {priv.title}
                        </span>
                        {priv.worth && (
                          <span className={`text-[11px] font-medium ${theme.privNote}`}>
                            worth {INR(priv.worth)}
                          </span>
                        )}
                        {priv.desc && !priv.worth && (
                          <span className={`text-[11px] font-light ${theme.privNote}`}>
                            {priv.desc}
                          </span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
              {/* What's not included */}
              <a
                href={`/membership/${plan.id}`}
                className={`mt-5 text-[11px] font-medium underline underline-offset-2 opacity-50 hover:opacity-80 transition-opacity block ${theme.privTitle}`}
              >
                See what&apos;s not included →
              </a>
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-5">
              {/* Plan summary — no per-trip cost */}
              <div className={`rounded-2xl p-5 border ${theme.checkBg}`}>
                <p className={`text-[10px] font-bold tracking-[0.3em] uppercase mb-4 ${activeId === 'sovereign' ? 'text-white/25' : activeId === 'elite' ? 'text-[#C9A24B]/40' : 'text-gray-300'}`}>
                  Plan Summary
                </p>
                {[
                  { label: 'Validity', val: plan.validity },
                  { label: 'Curated Journeys', val: `${plan.trips} per year` },
                  { label: 'Privileges Worth', val: `₹${plan.freePerksWorth.toLocaleString('en-IN')}` },
                  { label: 'Security', val: plan.bodyguard },
                ].map(({ label, val }) => (
                  <div key={label} className="flex justify-between items-center py-2.5 border-b border-opacity-10" style={{ borderColor: activeId === 'elite' ? 'rgba(201,162,75,0.12)' : activeId === 'sovereign' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
                    <span className={`text-[12px] font-medium ${theme.privNote}`}>{label}</span>
                    <span className={`text-[12px] font-bold ${theme.privTitle}`}>{val}</span>
                  </div>
                ))}
              </div>

              {/* Founding 100 scarcity (real, verifiable) */}
              <div
                className={`flex items-center justify-center gap-2 text-[11px] py-3 rounded-2xl border font-semibold ${theme.checkBg}`}
                style={{ borderColor: activeId === 'elite' ? 'rgba(201,162,75,0.25)' : undefined }}
              >
                <span className={theme.privTitle}>
                  Founding 100 Member · {foundingSpots} of 100 confirmed
                </span>
              </div>

              {/* CTAs */}
              <div className="space-y-3 mt-auto">
                <Link
                  href={`/booking/${plan.id}`}
                  className={`flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-sm font-bold transition-all ${theme.btnBg}`}
                >
                  {plan.id === 'elite' && <Gem size={15} strokeWidth={2} />}
                  {plan.id === 'sovereign' && <Crown size={15} strokeWidth={2} />}
                  {plan.id === 'elite'
                    ? 'Claim Elite Membership'
                    : plan.id === 'sovereign'
                    ? 'Enquire About Sovereign'
                    : `Get ${plan.name} Membership`}
                  <ChevronRight size={15} strokeWidth={2.5} />
                </Link>

                {/* Details CTA */}
                <Link
                  href={`/membership/${plan.id}`}
                  className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-sm font-semibold border transition-all hover:opacity-80 ${theme.btnSecTxt}`}
                  style={{ borderColor: activeId === 'elite' ? 'rgba(201,162,75,0.25)' : activeId === 'sovereign' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
                >
                  View Full Details
                  <ChevronRight size={14} strokeWidth={2} />
                </Link>
              </div>

              {/* Trust micro-copy */}
              <p className={`text-center text-[10px] ${theme.privNote}`}>
                Instant Activation &nbsp;·&nbsp; No Hidden Fees
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-2 mt-6">
        {TAB_ORDER.map((id) => (
          <button
            key={id}
            onClick={() => setActiveId(id)}
            className={['rounded-full transition-all duration-300', id === activeId ? 'w-6 h-2 bg-[#C9A24B]' : 'w-2 h-2 bg-gray-200 hover:bg-gray-300'].join(' ')}
          />
        ))}
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
