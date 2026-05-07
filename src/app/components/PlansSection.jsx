'use client';

import Link from 'next/link';
import {
  Car, Users, ShieldCheck, Gem, Crown,
  Check, ChevronRight, ArrowRight,
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
    num: '01',
    accent: '#5a6680',
    accentAlpha: 'rgba(90,102,128,0.10)',
    cardBg: '#ffffff',
    border: '#e5e8ef',
    text: '#1a202c',
    sub: '#4a5568',
    muted: '#9faabf',
    price: '#1a202c',
    ctaBg: '#2d3748',
    ctaFg: '#ffffff',
    badge: null,
    featured: false,
    dark: false,
    imgFilter: 'grayscale(22%) brightness(0.68) contrast(1.06)',
    shadow: '0 1px 4px rgba(0,0,0,0.05), 0 4px 18px rgba(0,0,0,0.07)',
    hoverShadow: '0 8px 36px rgba(0,0,0,0.13), 0 2px 8px rgba(0,0,0,0.07)',
  },
  executive: {
    num: '02',
    accent: '#1e3a5f',
    accentAlpha: 'rgba(30,58,95,0.10)',
    cardBg: '#f9fbff',
    border: '#d5e1ef',
    text: '#0f2847',
    sub: '#2c5282',
    muted: '#7096b8',
    price: '#0f2847',
    ctaBg: '#1e3a5f',
    ctaFg: '#ffffff',
    badge: 'Most Popular',
    featured: false,
    dark: false,
    imgFilter: 'grayscale(10%) brightness(0.64) contrast(1.12) saturate(1.08)',
    shadow: '0 1px 4px rgba(30,58,95,0.07), 0 4px 18px rgba(30,58,95,0.11)',
    hoverShadow: '0 8px 36px rgba(30,58,95,0.20), 0 2px 8px rgba(30,58,95,0.10)',
  },
  premium: {
    num: '03',
    accent: '#374151',
    accentAlpha: 'rgba(55,65,81,0.09)',
    cardBg: '#fafafa',
    border: '#e0e3e9',
    text: '#1a202c',
    sub: '#4a5568',
    muted: '#9ca3af',
    price: '#1a202c',
    ctaBg: '#374151',
    ctaFg: '#ffffff',
    badge: null,
    featured: false,
    dark: false,
    imgFilter: 'grayscale(24%) brightness(0.65) contrast(1.08)',
    shadow: '0 1px 4px rgba(0,0,0,0.05), 0 4px 18px rgba(0,0,0,0.07)',
    hoverShadow: '0 8px 36px rgba(55,65,81,0.15), 0 2px 8px rgba(0,0,0,0.07)',
  },
  elite: {
    num: '04',
    accent: '#c9a24b',
    accentAlpha: 'rgba(201,162,75,0.13)',
    cardBg: '#0c0800',
    border: 'rgba(201,162,75,0.24)',
    text: '#f5e098',
    sub: '#d4aa52',
    muted: 'rgba(201,162,75,0.46)',
    price: '#f0d060',
    ctaBg: '#c9a24b',
    ctaFg: '#0c0800',
    badge: 'Best Value',
    featured: true,
    dark: true,
    imgFilter: 'grayscale(26%) brightness(0.40) contrast(1.14)',
    shadow: '0 0 0 1.5px rgba(201,162,75,0.52), 0 20px 52px rgba(201,162,75,0.15), 0 6px 20px rgba(0,0,0,0.38)',
    hoverShadow: '0 0 0 2px rgba(201,162,75,0.72), 0 28px 68px rgba(201,162,75,0.22), 0 10px 28px rgba(0,0,0,0.48)',
  },
  sovereign: {
    num: '05',
    accent: '#909090',
    accentAlpha: 'rgba(144,144,144,0.08)',
    cardBg: '#080808',
    border: 'rgba(144,144,144,0.13)',
    text: '#d0d0d0',
    sub: 'rgba(200,200,200,0.60)',
    muted: 'rgba(138,138,138,0.42)',
    price: '#c0c0c0',
    ctaBg: 'rgba(144,144,144,0.88)',
    ctaFg: '#080808',
    badge: 'Ultra Exclusive',
    featured: false,
    dark: true,
    imgFilter: 'grayscale(58%) brightness(0.36) contrast(1.20)',
    shadow: '0 4px 22px rgba(0,0,0,0.55), 0 1px 4px rgba(0,0,0,0.40)',
    hoverShadow: '0 16px 48px rgba(0,0,0,0.65), 0 4px 12px rgba(0,0,0,0.50)',
  },
};

const TAB_ORDER = ['essential', 'executive', 'premium', 'elite', 'sovereign'];

export default function PlansSection() {
  return (
    <section
      id="plans"
      style={{ background: '#EDE8DF', padding: '96px 24px 120px' }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>

        {/* ── Header ── */}
        <div style={{ textAlign: 'center', marginBottom: 80 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 18, marginBottom: 20 }}>
            <div style={{
              height: 1, width: 56,
              background: 'linear-gradient(to right, transparent, rgba(184,146,74,0.5))',
            }} />
            <span style={{
              fontSize: 9, fontWeight: 700,
              letterSpacing: '0.52em', textTransform: 'uppercase',
              color: '#a07838',
            }}>
              Membership Tiers
            </span>
            <div style={{
              height: 1, width: 56,
              background: 'linear-gradient(to left, transparent, rgba(184,146,74,0.5))',
            }} />
          </div>

          <h2 style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 'clamp(30px, 3.8vw, 46px)',
            fontWeight: 700,
            color: '#0B1E3F',
            letterSpacing: '-0.03em',
            lineHeight: 1.08,
            margin: '0 0 16px',
          }}>
            Choose Your Membership
          </h2>

          <p style={{
            fontSize: 13, fontWeight: 300,
            color: '#8a7e6e', lineHeight: 1.75,
            maxWidth: 340, margin: '0 auto',
          }}>
            VIP darshan, airport lounges, 24×7 concierge &amp; luxury
            transport — pre-arranged for the year ahead.
          </p>
        </div>

        {/* ── Cards ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 18,
          alignItems: 'start',
        }}>
          {TAB_ORDER.map((id) => {
            const plan   = plans.find((p) => p.id === id);
            const t      = TIERS[id];
            const Icon   = TIER_ICONS[id] || Car;
            const anchor = ANCHOR_PRICES[id];
            const spots  = FOUNDING_SPOTS[id];
            const save   = anchor ? Math.round((1 - plan.price / anchor) * 100) : 0;
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
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  background: t.cardBg,
                  border: `1px solid ${t.border}`,
                  borderRadius: 14,
                  boxShadow: t.shadow,
                  transform: t.featured ? 'translateY(-12px)' : 'translateY(0)',
                  transition: 'transform 0.4s cubic-bezier(.22,1,.36,1), box-shadow 0.4s cubic-bezier(.22,1,.36,1)',
                  position: 'relative',
                  zIndex: t.featured ? 2 : 1,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = t.featured ? 'translateY(-18px)' : 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = t.hoverShadow;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = t.featured ? 'translateY(-12px)' : 'translateY(0)';
                  e.currentTarget.style.boxShadow = t.shadow;
                }}
              >
                {/* Top accent rule */}
                <div style={{
                  height: 2,
                  background: t.featured
                    ? `linear-gradient(90deg, transparent 0%, ${t.accent} 40%, ${t.accent} 60%, transparent 100%)`
                    : t.accent,
                  opacity: t.featured ? 1 : 0.75,
                  borderRadius: '14px 14px 0 0',
                }} />

                {/* ── Image ── */}
                <div style={{ position: 'relative', overflow: 'hidden', height: 192 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={TIER_IMAGES[id]}
                    alt={plan.name}
                    style={{
                      width: '100%', height: '100%',
                      objectFit: 'cover',
                      filter: t.imgFilter,
                      transform: 'scale(1)',
                      transition: 'transform 0.85s cubic-bezier(.22,1,.36,1)',
                      display: 'block',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.07)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                  />

                  {/* Cinematic vignette */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: [
                      'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.12) 48%, transparent 72%)',
                      'linear-gradient(to bottom, rgba(0,0,0,0.32) 0%, transparent 38%)',
                    ].join(', '),
                  }} />

                  {/* Package number */}
                  <span style={{
                    position: 'absolute', top: 12, left: 16,
                    fontSize: 10, fontWeight: 900,
                    letterSpacing: '0.16em',
                    color: t.featured ? t.accent : 'rgba(255,255,255,0.26)',
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                    {t.num}
                  </span>

                  {/* Badge */}
                  {t.badge && (
                    <span style={{
                      position: 'absolute', top: 11, right: 12,
                      fontSize: 7, fontWeight: 800,
                      letterSpacing: '0.3em', textTransform: 'uppercase',
                      padding: '4px 11px',
                      borderRadius: 20,
                      background: t.featured ? t.accent : 'rgba(0,0,0,0.50)',
                      color: t.featured ? t.ctaFg : 'rgba(255,255,255,0.9)',
                      backdropFilter: 'blur(10px)',
                      border: t.featured ? 'none' : '1px solid rgba(255,255,255,0.11)',
                    }}>
                      {t.badge}
                    </span>
                  )}

                  {/* Tier name */}
                  <div style={{
                    position: 'absolute', bottom: 0,
                    left: 0, right: 0,
                    padding: '0 16px 14px',
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    <Icon
                      size={12} strokeWidth={1.4}
                      style={{ color: t.featured ? t.accent : 'rgba(255,255,255,0.62)', flexShrink: 0 }}
                    />
                    <span style={{
                      fontSize: 12, fontWeight: 900,
                      letterSpacing: '0.34em', textTransform: 'uppercase',
                      color: t.featured ? t.accent : 'rgba(255,255,255,0.92)',
                    }}>
                      {plan.name}
                    </span>
                  </div>
                </div>

                {/* ── Body ── */}
                <div style={{
                  display: 'flex', flexDirection: 'column', flex: 1,
                  padding: '20px 20px 24px',
                }}>

                  {/* Price */}
                  <div style={{ marginBottom: 18 }}>
                    {anchor && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{
                          fontSize: 10.5,
                          color: t.muted,
                          textDecoration: 'line-through',
                        }}>
                          {INR(anchor)}
                        </span>
                        {save > 0 && (
                          <span style={{
                            fontSize: 7.5, fontWeight: 800,
                            letterSpacing: '0.14em', textTransform: 'uppercase',
                            padding: '2px 7px', borderRadius: 3,
                            background: t.accentAlpha,
                            color: t.accent,
                          }}>
                            SAVE {save}%
                          </span>
                        )}
                      </div>
                    )}
                    <p style={{
                      fontSize: 30, fontWeight: 900,
                      letterSpacing: '-0.025em', lineHeight: 1,
                      color: t.price, margin: 0,
                    }}>
                      {INR(plan.price)}
                    </p>
                    <p style={{
                      fontSize: 9.5, marginTop: 6,
                      color: t.muted, letterSpacing: '0.06em',
                    }}>
                      per year &nbsp;·&nbsp; {INR(plan.perMonth)}/mo
                    </p>
                  </div>

                  {/* Divider */}
                  <div style={{
                    height: 1, marginBottom: 14,
                    background: t.featured
                      ? `linear-gradient(90deg, transparent, ${t.accent}50, transparent)`
                      : t.border,
                  }} />

                  {/* Specs */}
                  <div style={{ marginBottom: 14 }}>
                    {specs.map(({ label, value }, i) => (
                      <div
                        key={label}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '7px 0',
                          borderBottom: i < specs.length - 1 ? `1px solid ${t.border}` : 'none',
                        }}
                      >
                        <span style={{
                          fontSize: 8.5, fontWeight: 600,
                          letterSpacing: '0.22em', textTransform: 'uppercase',
                          color: t.muted,
                        }}>
                          {label}
                        </span>
                        <span style={{
                          fontSize: 11.5, fontWeight: 700,
                          color: t.text,
                        }}>
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Divider */}
                  <div style={{
                    height: 1, marginBottom: 14,
                    background: t.border,
                  }} />

                  {/* Privileges */}
                  <ul style={{
                    listStyle: 'none', margin: 0, padding: 0,
                    display: 'flex', flexDirection: 'column', gap: 9,
                    flex: 1, marginBottom: 18,
                  }}>
                    {plan.privileges.slice(0, 3).map((priv, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
                        <span style={{
                          width: 16, height: 16,
                          borderRadius: '50%',
                          flexShrink: 0,
                          marginTop: 1,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: t.accentAlpha,
                        }}>
                          <Check size={8} strokeWidth={3} style={{ color: t.accent }} />
                        </span>
                        <span style={{
                          fontSize: 11, lineHeight: 1.45,
                          color: t.sub,
                        }}>
                          {priv.title}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Scarcity */}
                  <div style={{ marginBottom: 18 }}>
                    <div style={{
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'space-between', marginBottom: 7,
                    }}>
                      <span style={{
                        fontSize: 8, fontWeight: 600,
                        letterSpacing: '0.24em', textTransform: 'uppercase',
                        color: t.muted,
                      }}>
                        Founding spots
                      </span>
                      <span style={{ fontSize: 9, fontWeight: 700, color: t.accent }}>
                        {spots} / 100 left
                      </span>
                    </div>
                    <div style={{
                      height: 2, borderRadius: 99, overflow: 'hidden',
                      background: t.dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)',
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${spots}%`,
                        borderRadius: 99,
                        background: t.featured
                          ? `linear-gradient(90deg, ${t.accent}65, ${t.accent})`
                          : t.accent,
                        opacity: 0.82,
                      }} />
                    </div>
                  </div>

                  {/* Primary CTA */}
                  <Link
                    href={`/booking/${id}`}
                    style={{
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'center', gap: 8,
                      height: 46, width: '100%',
                      background: t.ctaBg,
                      color: t.ctaFg,
                      borderRadius: 8,
                      fontSize: 10.5, fontWeight: 800,
                      letterSpacing: '0.20em', textTransform: 'uppercase',
                      textDecoration: 'none',
                      transition: 'opacity 0.2s ease, transform 0.15s ease',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.opacity = '0.87';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.opacity = '1';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    Select Plan
                    <ArrowRight size={12} strokeWidth={2.5} />
                  </Link>

                  {/* Secondary link */}
                  <Link
                    href={`/membership/${id}`}
                    style={{
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'center', gap: 4,
                      marginTop: 12,
                      fontSize: 9, fontWeight: 500,
                      letterSpacing: '0.30em', textTransform: 'uppercase',
                      color: t.muted, textDecoration: 'none',
                      opacity: 0.82,
                      transition: 'opacity 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = '0.45'; }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = '0.82'; }}
                  >
                    View Details <ChevronRight size={8} strokeWidth={2} />
                  </Link>

                </div>
              </div>
            );
          })}
        </div>

        {/* ── Trust line ── */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: 20, marginTop: 60,
        }}>
          <div style={{
            height: 1, flex: 1, maxWidth: 72,
            background: 'linear-gradient(to right, transparent, rgba(160,140,100,0.28))',
          }} />
          <p style={{
            fontSize: 9, fontWeight: 500,
            letterSpacing: '0.40em', textTransform: 'uppercase',
            color: 'rgba(140,120,80,0.52)',
            whiteSpace: 'nowrap', margin: 0,
          }}>
            Instant Activation &nbsp;·&nbsp; No Hidden Fees &nbsp;·&nbsp; 24×7 Concierge
          </p>
          <div style={{
            height: 1, flex: 1, maxWidth: 72,
            background: 'linear-gradient(to left, transparent, rgba(160,140,100,0.28))',
          }} />
        </div>

      </div>
    </section>
  );
}
