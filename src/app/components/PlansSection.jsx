'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Car, Users, ShieldCheck, Gem, Crown,
  Navigation, Shield, Building2, Plane, Landmark,
  Sparkles, Utensils, Gift, Phone, Zap, Wifi,
  RefreshCw, Flame, UserCheck, CheckCircle, Check,
  BadgeCheck, Clock, ChevronRight,
} from 'lucide-react';
import { plans } from '../data/plans';

const INR = (n) => '₹' + Number(n).toLocaleString('en-IN');

const TIER_ICONS = {
  essential: Car,
  executive: Users,
  premium: ShieldCheck,
  elite: Gem,
  sovereign: Crown,
};

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

const THEMES = {
  essential: {
    headerGrad: 'from-slate-700 via-slate-600 to-slate-800',
    tabActive: 'bg-slate-800 text-white shadow-lg',
    tabIcon: 'text-slate-300',
    orb1: 'bg-slate-400/25 -top-12 -right-12 w-52 h-52',
    orb2: 'bg-blue-400/10 bottom-0 left-4 w-36 h-36',
    numColor: 'text-white/[0.07]',
    badge: null,
    nameTxt: 'text-white',
    taglineTxt: 'text-slate-300/70',
    priceTxt: 'text-white',
    priceSubTxt: 'text-slate-300/55',
    perksTxt: 'text-slate-300/70',
    bodyBg: 'bg-white',
    chipBg: 'bg-slate-50 border-slate-200 text-slate-600',
    checkBg: 'bg-slate-50 border-slate-100',
    checkColor: 'text-slate-400',
    privTitle: 'text-gray-900',
    privNote: 'text-slate-400',
    moreTxt: 'text-slate-400',
    divider: 'bg-gray-100',
    scarBg: 'bg-amber-50 border-amber-200 text-amber-700',
    btnBg: 'bg-slate-800 hover:bg-slate-900 text-white',
    btnSecTxt: 'text-slate-400 hover:text-slate-700',
    accentLine: 'from-slate-400 to-slate-600',
  },
  executive: {
    headerGrad: 'from-blue-900 via-indigo-800 to-blue-950',
    tabActive: 'bg-blue-800 text-white shadow-lg',
    tabIcon: 'text-blue-300',
    orb1: 'bg-blue-400/25 -top-12 -right-12 w-52 h-52',
    orb2: 'bg-indigo-300/15 bottom-0 left-4 w-44 h-44',
    numColor: 'text-white/[0.07]',
    badge: { label: 'Most Popular', cls: 'bg-white/15 border border-white/20 text-white' },
    nameTxt: 'text-white',
    taglineTxt: 'text-blue-200/70',
    priceTxt: 'text-white',
    priceSubTxt: 'text-blue-200/60',
    perksTxt: 'text-blue-200/80',
    bodyBg: 'bg-white',
    chipBg: 'bg-blue-50 border-blue-100 text-blue-700',
    checkBg: 'bg-blue-50 border-blue-100',
    checkColor: 'text-blue-500',
    privTitle: 'text-gray-900',
    privNote: 'text-blue-400',
    moreTxt: 'text-blue-400',
    divider: 'bg-blue-50',
    scarBg: 'bg-amber-50 border-amber-200 text-amber-700',
    btnBg: 'bg-blue-800 hover:bg-blue-900 text-white',
    btnSecTxt: 'text-blue-400 hover:text-blue-700',
    accentLine: 'from-blue-400 to-indigo-500',
  },
  premium: {
    headerGrad: 'from-gray-800 via-gray-750 to-gray-900',
    tabActive: 'bg-gray-800 text-white shadow-lg',
    tabIcon: 'text-gray-300',
    orb1: 'bg-gray-400/15 -top-12 -right-12 w-52 h-52',
    orb2: 'bg-red-400/8 bottom-0 left-4 w-40 h-40',
    numColor: 'text-white/[0.06]',
    badge: null,
    nameTxt: 'text-white',
    taglineTxt: 'text-gray-300/65',
    priceTxt: 'text-white',
    priceSubTxt: 'text-gray-300/55',
    perksTxt: 'text-gray-300/75',
    bodyBg: 'bg-white',
    chipBg: 'bg-gray-50 border-gray-200 text-gray-600',
    checkBg: 'bg-gray-50 border-gray-100',
    checkColor: 'text-gray-500',
    privTitle: 'text-gray-900',
    privNote: 'text-gray-400',
    moreTxt: 'text-gray-400',
    divider: 'bg-gray-100',
    scarBg: 'bg-amber-50 border-amber-200 text-amber-700',
    btnBg: 'bg-gray-900 hover:bg-black text-white',
    btnSecTxt: 'text-gray-400 hover:text-gray-700',
    accentLine: 'from-gray-400 to-gray-600',
  },
  elite: {
    headerGrad: 'from-[#2a1c00] via-[#6b4800] to-[#1a1000]',
    tabActive: 'bg-[#BF9F00] text-black shadow-lg shadow-[#BF9F00]/30',
    tabIcon: 'text-[#BF9F00]',
    orb1: 'bg-[#BF9F00]/35 -top-12 -right-12 w-56 h-56',
    orb2: 'bg-yellow-400/15 bottom-0 left-4 w-44 h-44',
    numColor: 'text-[#BF9F00]/[0.13]',
    badge: { label: '✦ Recommended', cls: 'shimmer-bg text-black font-extrabold' },
    nameTxt: 'text-[#f0c940]',
    taglineTxt: 'text-[#BF9F00]/65',
    priceTxt: 'text-[#f0c940]',
    priceSubTxt: 'text-[#BF9F00]/55',
    perksTxt: 'text-[#BF9F00]/80',
    bodyBg: 'bg-[#0d0800]',
    chipBg: 'bg-[#BF9F00]/10 border-[#BF9F00]/20 text-[#BF9F00]/90',
    checkBg: 'bg-[#BF9F00]/10 border-[#BF9F00]/20',
    checkColor: 'text-[#BF9F00]',
    privTitle: 'text-white/85',
    privNote: 'text-[#BF9F00]/55',
    moreTxt: 'text-[#BF9F00]/55',
    divider: 'bg-[#BF9F00]/10',
    scarBg: 'bg-[#BF9F00]/10 border-[#BF9F00]/25 text-[#BF9F00]/80',
    btnBg: 'bg-[#BF9F00] hover:bg-[#a88a00] text-black font-extrabold pulse-ring',
    btnSecTxt: 'text-[#BF9F00]/45 hover:text-[#BF9F00]/80',
    accentLine: 'from-[#BF9F00] to-yellow-400',
  },
  sovereign: {
    headerGrad: 'from-[#060606] via-[#111111] to-[#040404]',
    tabActive: 'bg-white/10 text-white border border-white/20 shadow-lg',
    tabIcon: 'text-white/60',
    orb1: 'bg-white/6 -top-12 -right-12 w-52 h-52',
    orb2: 'bg-white/3 bottom-0 left-4 w-40 h-40',
    numColor: 'text-white/[0.04]',
    badge: { label: 'Ultra Exclusive', cls: 'border border-white/15 text-white/50 bg-white/5' },
    nameTxt: 'text-white',
    taglineTxt: 'text-white/35',
    priceTxt: 'text-white',
    priceSubTxt: 'text-white/30',
    perksTxt: 'text-white/40',
    bodyBg: 'bg-[#080808]',
    chipBg: 'bg-white/5 border-white/10 text-white/50',
    checkBg: 'bg-white/5 border-white/10',
    checkColor: 'text-white/45',
    privTitle: 'text-white/80',
    privNote: 'text-white/30',
    moreTxt: 'text-white/30',
    divider: 'bg-white/6',
    scarBg: 'bg-white/5 border-white/10 text-white/40',
    btnBg: 'bg-white hover:bg-gray-100 text-black font-extrabold',
    btnSecTxt: 'text-white/25 hover:text-white/55',
    accentLine: 'from-white/30 to-white/10',
  },
};

const TAB_ORDER = ['essential', 'executive', 'premium', 'elite', 'sovereign'];

export default function PlansSection() {
  const [activeId, setActiveId] = useState('elite');
  const plan = plans.find((p) => p.id === activeId);
  const theme = THEMES[activeId];
  const TierIcon = TIER_ICONS[activeId] || Car;

  return (
    <section id="plans" className="w-full px-4 sm:px-8 pt-20 pb-16 max-w-6xl mx-auto">
      {/* Section header */}
      <div className="text-center mb-12">
        <p className="text-[#BF9F00] text-xs tracking-[0.3em] uppercase font-semibold mb-3">Five Tiers</p>
        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">Choose Your Membership</h2>
        <p className="text-gray-500 text-base max-w-md mx-auto font-light">
          Every plan includes VIP darshan, airport lounges, 24×7 concierge, and luxury transport.
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
              <Icon
                size={13}
                strokeWidth={2}
                className={isActive ? '' : 'text-gray-400'}
              />
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </button>
          );
        })}
      </div>

      {/* Card spotlight */}
      <div
        key={activeId}
        className="max-w-4xl mx-auto rounded-4xl overflow-hidden shadow-2xl"
        style={{ animation: 'fadeSlideUp 0.35s ease both' }}
      >
        {/* ── HERO HEADER ── */}
        <div className={`relative bg-linear-to-br ${theme.headerGrad} overflow-hidden`}>
          {/* Orbs */}
          <div className={`absolute rounded-full blur-3xl pointer-events-none ${theme.orb1}`} />
          <div className={`absolute rounded-full blur-3xl pointer-events-none ${theme.orb2}`} />

          {/* Giant ghost number */}
          <div className={`absolute right-0 bottom-0 text-[clamp(120px,20vw,200px)] font-black leading-none select-none pointer-events-none ${theme.numColor}`}>
            {plan.packageNo}
          </div>

          <div className="relative px-8 sm:px-12 pt-10 pb-10">
            {/* Badge */}
            {theme.badge && (
              <div className="mb-5">
                <span className={`text-[10px] font-bold px-4 py-1.5 rounded-full tracking-[0.2em] uppercase ${theme.badge.cls}`}>
                  {theme.badge.label}
                </span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
              {/* Left: name + tagline */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <TierIcon size={32} strokeWidth={1.25} className={theme.nameTxt} />
                  <div className={`text-4xl sm:text-5xl font-black tracking-[0.06em] uppercase ${theme.nameTxt}`}>
                    {plan.name}
                  </div>
                </div>
                <p className={`text-sm max-w-xs font-light leading-relaxed ${theme.taglineTxt}`}>
                  {plan.tagline}
                </p>

                {/* Spec pills */}
                <div className="flex flex-wrap gap-2 mt-5">
                  {[
                    { Icon: Navigation, text: `${plan.trips} Trips / Year` },
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

              {/* Right: price */}
              <div className="sm:text-right shrink-0">
                <div className={`text-[42px] sm:text-5xl font-black tracking-tight leading-none ${theme.priceTxt}`}>
                  {INR(plan.price)}
                </div>
                <div className={`text-sm mt-1 font-light ${theme.priceSubTxt}`}>
                  {INR(plan.perMonth)} / month · 12 months
                </div>
                <div className={`flex items-center gap-1.5 text-xs font-semibold mt-3 sm:justify-end ${theme.perksTxt}`}>
                  <Gem size={11} strokeWidth={2} />
                  ₹{plan.freePerksWorth.toLocaleString('en-IN')} in perks included
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── BODY ── */}
        <div className={`${theme.bodyBg} px-8 sm:px-12 py-8`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Privileges list */}
            <div>
              <p className={`text-[10px] font-bold tracking-[0.3em] uppercase mb-5 ${activeId === 'sovereign' ? 'text-white/25' : activeId === 'elite' ? 'text-[#BF9F00]/40' : 'text-gray-300'}`}>
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
            </div>

            {/* Right column: per-trip cost + scarcity + CTA */}
            <div className="flex flex-col gap-5">
              {/* Stats */}
              <div className={`rounded-2xl p-5 border ${theme.checkBg}`}>
                <p className={`text-[10px] font-bold tracking-[0.3em] uppercase mb-4 ${activeId === 'sovereign' ? 'text-white/25' : activeId === 'elite' ? 'text-[#BF9F00]/40' : 'text-gray-300'}`}>
                  Plan Summary
                </p>
                {[
                  { label: 'Validity', val: plan.validity },
                  { label: 'Per Trip Cost', val: INR(plan.perTripCost) },
                  { label: 'Included Perks', val: `₹${plan.freePerksWorth.toLocaleString('en-IN')}` },
                  { label: 'Security', val: plan.bodyguard },
                ].map(({ label, val }) => (
                  <div key={label} className="flex justify-between items-center py-2.5">
                    <span className={`text-[12px] font-medium ${theme.privNote}`}>{label}</span>
                    <span className={`text-[12px] font-bold ${theme.privTitle}`}>{val}</span>
                  </div>
                ))}
              </div>

              {/* Scarcity */}
              {plan.spotsLeft <= 8 && (
                <div className={`flex items-center justify-center gap-2 text-[11px] py-3 rounded-2xl border font-bold tracking-wide uppercase ${theme.scarBg}`}>
                  <Clock size={11} strokeWidth={2.5} />
                  Only {plan.spotsLeft} spots remaining
                </div>
              )}

              {/* CTAs */}
              <div className="space-y-3 mt-auto">
                <Link
                  href={`/membership/${plan.id}`}
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
                <p className={`text-center text-[11px] ${theme.btnSecTxt}`}>
                  15-day money-back guarantee · No questions asked
                </p>
              </div>
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
            className={[
              'rounded-full transition-all duration-300',
              id === activeId ? 'w-6 h-2 bg-[#BF9F00]' : 'w-2 h-2 bg-gray-200 hover:bg-gray-300',
            ].join(' ')}
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
