'use client';

import Link from 'next/link';
import {
  Car, Users, ShieldCheck, Gem, Crown,
  Check, ChevronRight, ArrowRight, Shield,
} from 'lucide-react';
import { plans } from '../data/plans';

const INR = (n) => '₹' + Number(n).toLocaleString('en-IN');

const ANCHOR_PRICES = {
  essential: 34999,
  executive: 64999,
  premium:   99999,
  elite:     130000,
  sovereign: 250000,
};

const FOUNDING_SPOTS = {
  essential: 82,
  executive: 71,
  premium:   58,
  elite:     73,
  sovereign: 41,
};

const TIER_ICONS = {
  essential: Car,
  executive: Users,
  premium:   ShieldCheck,
  elite:     Gem,
  sovereign: Crown,
};

const TIER_IMAGES = {
  essential: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80',
  executive: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80',
  premium:   'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80',
  elite:     'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
  sovereign: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=600&q=80',
};

const TIERS = {
  essential: {
    accent: '#4a5568', rgb: '74,85,104',
    cardBg: '#ffffff', border: '#e2e6ec',
    text: '#1a202c', sub: '#4a5568', muted: '#94a3b8', price: '#1a202c',
    ctaFg: '#ffffff', badge: null, featured: false, dark: false,
  },
  executive: {
    accent: '#1e3a5f', rgb: '30,58,95',
    cardBg: '#ffffff', border: '#c8d8eb',
    text: '#0f2847', sub: '#2c5282', muted: '#7096b8', price: '#0f2847',
    ctaFg: '#ffffff', badge: 'Most Popular', featured: false, dark: false,
  },
  premium: {
    accent: '#2d3748', rgb: '45,55,72',
    cardBg: '#ffffff', border: '#d8dce4',
    text: '#1a202c', sub: '#4a5568', muted: '#94a3b8', price: '#1a202c',
    ctaFg: '#ffffff', badge: null, featured: false, dark: false,
  },
  elite: {
    accent: '#b8924a', rgb: '184,146,74',
    cardBg: '#120d02', border: 'rgba(184,146,74,0.16)',
    text: '#c9a24b', sub: '#a07838', muted: 'rgba(184,146,74,0.42)', price: '#c9a24b',
    ctaFg: '#120d02', badge: 'Best Value', featured: true, dark: true,
  },
  sovereign: {
    accent: '#7a7a7a', rgb: '122,122,122',
    cardBg: '#111111', border: 'rgba(140,140,140,0.16)',
    text: '#b8b8b8', sub: 'rgba(200,200,200,0.52)', muted: 'rgba(160,160,160,0.35)', price: '#c0c0c0',
    ctaFg: '#111111', badge: 'Ultra Exclusive', featured: false, dark: true,
  },
};

const TAB_ORDER = ['essential', 'executive', 'premium', 'elite', 'sovereign'];

export default function PlansSection() {
  return (
    <section id="plans" className="w-full px-4 sm:px-6 lg:px-8 pt-20 pb-24 bg-[#f6f4f0]">
      <div className="max-w-screen-xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="h-px w-12 bg-[#b8924a]/40" />
            <p className="text-[#b8924a] text-[9px] tracking-[0.55em] uppercase font-semibold">
              Membership Tiers
            </p>
            <div className="h-px w-12 bg-[#b8924a]/40" />
          </div>
          <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#0B1E3F] mb-3">
            Choose Your Membership
          </h2>
          <p className="text-gray-400 text-sm max-w-md mx-auto font-light leading-relaxed">
            VIP darshan, airport lounges, 24×7 concierge and luxury transport —
            pre-arranged for the year ahead.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {TAB_ORDER.map((id) => {
            const plan   = plans.find((p) => p.id === id);
            const t      = TIERS[id];
            const Icon   = TIER_ICONS[id] || Car;
            const anchor = ANCHOR_PRICES[id];
            const spots  = FOUNDING_SPOTS[id];
            const armed  = plan.bodyguard.toLowerCase().includes('armed') &&
                           !plan.bodyguard.toLowerCase().includes('unarmed');

            const specs = [
              { label: 'Validity',  value: plan.validity },
              { label: 'Trips',     value: `${plan.trips} per year` },
              { label: 'Security',  value: armed ? 'Armed Guard' : 'Unarmed Guard' },
              { label: 'Vehicle',   value: plan.vehicleType },
            ];

            return (
              <div
                key={id}
                className="flex flex-col overflow-hidden transition-transform duration-300 hover:-translate-y-0.5"
                style={{
                  background: t.cardBg,
                  border: `1px solid ${t.border}`,
                  borderRadius: 10,
                  boxShadow: t.featured
                    ? `0 0 0 1.5px ${t.accent}, 0 24px 56px rgba(${t.rgb},0.3)`
                    : t.dark
                    ? '0 2px 16px rgba(0,0,0,0.4)'
                    : '0 1px 3px rgba(0,0,0,0.06)',
                  zIndex: t.featured ? 1 : 0,
                  position: 'relative',
                }}
              >
                {/* Top bar */}
                <div style={{ height: t.featured ? 3 : 2, background: t.accent }} />

                {/* Image */}
                <div className="relative overflow-hidden" style={{ height: 144 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={TIER_IMAGES[id]}
                    alt={plan.name}
                    className="w-full h-full object-cover"
                    style={{
                      filter: t.dark
                        ? 'grayscale(30%) brightness(0.55) contrast(1.08)'
                        : 'grayscale(15%) brightness(0.78) contrast(1.05)',
                    }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.62) 0%, transparent 52%)' }}
                  />

                  {/* Badge */}
                  {t.badge && (
                    <span
                      className="absolute top-3 right-3 text-[7.5px] font-extrabold tracking-[0.22em] uppercase px-2 py-0.5"
                      style={{
                        borderRadius: 2,
                        background: t.featured ? t.accent : 'rgba(0,0,0,0.5)',
                        color: t.featured ? t.ctaFg : 'rgba(255,255,255,0.85)',
                        backdropFilter: 'blur(4px)',
                      }}
                    >
                      {t.badge}
                    </span>
                  )}

                  {/* Name */}
                  <div className="absolute bottom-3 left-4 flex items-center gap-1.5">
                    <Icon size={11} strokeWidth={1.5} style={{ color: t.featured ? t.accent : 'rgba(255,255,255,0.7)' }} />
                    <span
                      className="text-[10px] font-black tracking-[0.28em] uppercase"
                      style={{ color: t.featured ? t.accent : 'rgba(255,255,255,0.9)' }}
                    >
                      {plan.name}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="px-4 pt-4 pb-5 flex flex-col flex-1">

                  {/* Price */}
                  <div className="mb-4">
                    {anchor && (
                      <span className="text-[10.5px] line-through opacity-30 mr-1" style={{ color: t.sub }}>
                        {INR(anchor)}
                      </span>
                    )}
                    <p className="text-[26px] font-black tracking-tight leading-none mt-0.5" style={{ color: t.price }}>
                      {INR(plan.price)}
                    </p>
                    <p className="text-[10px] mt-1 tracking-wide" style={{ color: t.muted }}>
                      per year, all-inclusive
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="mb-3" style={{ height: 1, background: t.border }} />

                  {/* Specs — label / value rows */}
                  <div className="mb-3">
                    {specs.map(({ label, value }, i) => (
                      <div
                        key={label}
                        className="flex items-center justify-between py-[7px]"
                        style={{ borderBottom: i < specs.length - 1 ? `1px solid ${t.border}` : 'none' }}
                      >
                        <span
                          className="text-[9px] tracking-[0.25em] uppercase font-semibold"
                          style={{ color: t.muted }}
                        >
                          {label}
                        </span>
                        <span
                          className="text-[12px] font-bold"
                          style={{ color: t.text }}
                        >
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="mb-3" style={{ height: 1, background: t.border }} />

                  {/* Privileges */}
                  <ul className="space-y-1.5 mb-4 flex-1">
                    {plan.privileges.slice(0, 3).map((priv, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check size={10} strokeWidth={2.5} className="shrink-0 mt-[3px]" style={{ color: t.accent }} />
                        <span className="text-[11px] leading-snug" style={{ color: t.sub }}>
                          {priv.title}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Scarcity */}
                  <p
                    className="text-center text-[9px] tracking-[0.3em] uppercase mb-3.5"
                    style={{ color: t.muted }}
                  >
                    {spots} of 100 founding spots left
                  </p>

                  {/* CTA */}
                  <Link
                    href= {`/booking/${id}`}
                    className="flex items-center justify-center gap-2 w-full py-2.5 text-[10.5px] font-extrabold tracking-[0.15em] uppercase transition-opacity hover:opacity-85 active:scale-[0.98]"
                    style={{ background: t.accent, color: t.ctaFg, borderRadius: 4 }}
                  >
                    Select Plan 
                    <ArrowRight size={11} strokeWidth={2.5} />
                  </Link>

                  <Link
                    href={`/membership/${id}`}
                    className="flex items-center justify-center gap-1 mt-2.5 text-[9.5px] tracking-[0.3em] uppercase transition-opacity hover:opacity-60"
                    style={{ color: t.muted }}
                  >
                    View Details <ChevronRight size={9} strokeWidth={2} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-5 mt-12">
          <div className="h-px flex-1 max-w-16" style={{ background: 'rgba(160,140,100,0.28)' }} />
          <p className="text-[9.5px] text-gray-400 tracking-[0.38em] uppercase font-light">
            Instant Activation &nbsp;·&nbsp; No Hidden Fees &nbsp;·&nbsp; 24×7 Concierge
          </p>
          <div className="h-px flex-1 max-w-16" style={{ background: 'rgba(160,140,100,0.28)' }} />
        </div>

      </div>
    </section>
  );
}
