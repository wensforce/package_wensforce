'use client';

import Link from 'next/link';
import { ArrowRight, Check, ExternalLink } from 'lucide-react';

const INR = (n) => '₹' + Number(n).toLocaleString('en-IN');

const ANCHOR_PRICES = {
  essential: 34999,
  executive: 64999,
  premium: 99999,
  elite: 130000,
  sovereign: 250000,
};

const TIERS = {
  essential: { accentColor: '#475569', featured: false, tier: 'I' },
  executive: { accentColor: '#1d4ed8', featured: false, tier: 'II' },
  premium:   { accentColor: '#374151', featured: false, tier: 'III' },
  elite:     { accentColor: '#C9A24B', featured: true,  tier: 'IV' },
  sovereign: { accentColor: '#9ca3af', featured: false, tier: 'V' },
};

export default function MembershipCard({ plan }) {
  const t = TIERS[plan.id];
  const anchorPrice = ANCHOR_PRICES[plan.id];

  return (
    <div
      className="flex flex-col bg-white h-full transition-all duration-700 group hover:shadow-2xl relative"
      style={{
        boxShadow: t.featured
          ? '0 20px 50px -15px rgba(201,162,75,0.25), 0 0 0 1.5px rgba(201,162,75,0.3)'
          : '0 8px 24px -6px rgba(0,0,0,0.08)',
      }}
    >
      {t.featured && (
        <div className="absolute -inset-px bg-gradient-to-br from-yellow-300/20 via-transparent to-amber-300/10 rounded-lg blur-md -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      )}

      {/* Image header */}
      <div
        className="relative h-48 overflow-hidden flex-shrink-0 border-b-2 flex items-end"
        style={{
          borderColor: t.featured ? t.accentColor : 'transparent',
          background: t.featured
            ? 'linear-gradient(135deg, #2a1c00 0%, #6b4800 50%, #1a1000 100%)'
            : 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        }}
      >
        {/* Tier badge */}
        <div className="absolute top-4 right-4">
          <div
            className="text-xs font-light tracking-widest px-2.5 py-1 rounded-full"
            style={{
              backgroundColor: t.featured ? 'rgba(201,162,75,0.25)' : 'rgba(255,255,255,0.1)',
              border: `1px solid ${t.featured ? t.accentColor : 'rgba(255,255,255,0.2)'}`,
              color: t.featured ? t.accentColor : 'rgba(255,255,255,0.7)',
            }}
          >
            {t.featured ? `✦ TIER ${t.tier}` : `TIER ${t.tier}`}
          </div>
        </div>

        {/* Plan name */}
        <div className="px-6 pb-5">
          <h3
            className="text-2xl font-light tracking-wide"
            style={{ color: t.featured ? '#f0c940' : 'white' }}
          >
            {plan.name}
          </h3>
          <p className="text-xs font-light mt-1" style={{ color: t.featured ? 'rgba(201,162,75,0.65)' : 'rgba(255,255,255,0.45)' }}>
            {plan.tagline}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow px-6 py-5 space-y-4">

        {/* Price */}
        <div>
          <div className="text-[10px] font-light text-gray-500 tracking-[0.15em] uppercase mb-1">Investment</div>
          {anchorPrice && (
            <div className="text-sm line-through text-gray-400 font-light">{INR(anchorPrice)}</div>
          )}
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-light leading-tight" style={{ color: t.accentColor }}>
              {INR(plan.price)}
            </span>
            <span className="text-[10px] font-light text-gray-400 pb-0.5">per year</span>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        {/* Key specs */}
        <div className="space-y-2.5">
          <div className="flex justify-between items-center pb-2 border-b border-gray-50">
            <span className="text-[10px] font-light text-gray-500 tracking-[0.1em] uppercase">Curated Journeys</span>
            <span className="text-base font-light" style={{ color: t.accentColor }}>{plan.trips}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-gray-50">
            <span className="text-[10px] font-light text-gray-500 tracking-[0.1em] uppercase">Vehicle</span>
            <span className="text-xs font-light text-gray-800 text-right">{plan.vehicleType}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-light text-gray-500 tracking-[0.1em] uppercase">Security</span>
            <span className="text-xs font-light text-gray-800">{plan.bodyguard}</span>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        {/* Benefits */}
        <div className="flex-grow">
          <p className="text-[10px] font-light text-gray-400 tracking-[0.15em] mb-3 uppercase">Included Privileges</p>
          <ul className="space-y-2">
            {plan.privileges.slice(0, 3).map((priv, i) => (
              <li key={i} className="flex gap-2.5 items-start">
                <div className="pt-0.5 shrink-0" style={{ color: t.accentColor }}>
                  <Check size={12} strokeWidth={3} />
                </div>
                <span className="text-xs font-light text-gray-600 leading-relaxed">{priv.title}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        {/* CTAs */}
        <div className="space-y-2 pt-1 flex-shrink-0">
          <Link href={`/booking/${plan.id}`} className="block">
            <button
              className={`w-full py-3.5 px-4 font-black text-xs tracking-[0.08em] uppercase transition-all flex items-center justify-center gap-2 rounded-sm active:scale-95 ${t.featured ? 'pulse-ring' : 'hover:opacity-90'}`}
              style={{
                background: t.featured
                  ? 'linear-gradient(135deg,#C9A24B,#f0c940)'
                  : `linear-gradient(135deg,${t.accentColor},${t.accentColor}cc)`,
                color: t.featured ? '#000' : '#fff',
                boxShadow: t.featured
                  ? '0 6px 24px rgba(201,162,75,0.45)'
                  : `0 4px 14px ${t.accentColor}55`,
              }}
            >
              Claim {plan.name} Membership
              <ArrowRight size={12} strokeWidth={2.5} />
            </button>
          </Link>
          <Link href={`/membership/${plan.id}`} className="block">
            <button
              className="w-full py-3 px-4 font-light text-xs tracking-[0.12em] uppercase transition-all border flex items-center justify-center gap-2 hover:bg-gray-50 group rounded-sm"
              style={{ color: t.accentColor, borderColor: t.featured ? t.accentColor : '#D1D5DB' }}
            >
              <span>View Details</span>
              <ExternalLink size={10} className="opacity-60 group-hover:opacity-100 transition-opacity" />
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}
