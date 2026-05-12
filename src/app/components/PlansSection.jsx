'use client';

import Link from 'next/link';
import { Car, Users, ShieldCheck, Gem, Crown, Check, ArrowRight, Sparkles } from 'lucide-react';
import { plans } from '../data/plans';

const INR = (n) => '₹' + Number(n).toLocaleString('en-IN');

const ANCHOR_PRICES = {
  essential: 34999,
  executive: 64999,
  premium:   99999,
  elite:     130000,
  sovereign: 250000,
};

const M = {
  essential: {
    num: '01', Icon: Car, cta: 'Claim My Spot',
    img: '/cards/Sedan_Essential.png',
    accent: '#8e99b0',
    imgFilter: 'grayscale(40%) brightness(.54) contrast(1.05)',
    imgOverlay: 'linear-gradient(270deg,rgba(10,14,24,.0) 0%,rgba(10,14,24,.55) 60%,rgba(10,14,24,.94) 100%)',
    border: 'rgba(142,153,176,.22)',
    shadow: '0 2px 20px rgba(0,0,0,.10)',
    hoverShadow: '0 14px 48px rgba(0,0,0,.24)',
    bg: 'rgba(10,14,24,.96)',
    priceColor: '#e8eaf0',
    subColor: 'rgba(200,206,220,.52)',
    statBg: 'rgba(255,255,255,.06)',
    statBorder: 'rgba(255,255,255,.09)',
    statLabel: 'rgba(200,206,220,.40)',
    statValue: '#d0d4e0',
    featColor: 'rgba(200,210,225,.76)',
    checkBg: 'rgba(255,255,255,.07)',
    checkColor: 'rgba(200,210,225,.55)',
    isElite: false,
  },
  executive: {
    num: '02', Icon: Users, cta: 'Unlock Executive',
    img: '/cards/BMW_Executive.png',
    accent: '#5a8fc2',
    imgFilter: 'grayscale(22%) brightness(.52) contrast(1.10)',
    imgOverlay: 'linear-gradient(270deg,rgba(8,18,38,.0) 0%,rgba(8,18,38,.55) 60%,rgba(8,18,38,.94) 100%)',
    border: 'rgba(90,143,194,.22)',
    shadow: '0 2px 20px rgba(8,18,38,.12)',
    hoverShadow: '0 14px 48px rgba(8,18,38,.28)',
    bg: 'rgba(8,18,38,.96)',
    priceColor: '#dce8f5',
    subColor: 'rgba(180,210,240,.52)',
    statBg: 'rgba(255,255,255,.06)',
    statBorder: 'rgba(255,255,255,.09)',
    statLabel: 'rgba(180,210,240,.40)',
    statValue: '#c0d8f0',
    featColor: 'rgba(180,210,240,.76)',
    checkBg: 'rgba(255,255,255,.07)',
    checkColor: 'rgba(180,210,240,.55)',
    isElite: false,
  },
  premium: {
    num: '03', Icon: ShieldCheck, cta: 'Go Premium Now',
    img: '/cards/GLC_Premium.png',
    accent: '#7a8a9a',
    imgFilter: 'grayscale(55%) brightness(.90) contrast(1.08)',
    imgOverlay: 'linear-gradient(270deg,rgba(12,16,22,.0) 0%,rgba(12,16,22,.56) 60%,rgba(12,16,22,.95) 100%)',
    border: 'rgba(122,138,154,.20)',
    shadow: '0 2px 20px rgba(0,0,0,.10)',
    hoverShadow: '0 14px 48px rgba(0,0,0,.24)',
    bg: 'rgba(12,16,22,.96)',
    priceColor: '#dde2e8',
    subColor: 'rgba(190,200,215,.52)',
    statBg: 'rgba(255,255,255,.06)',
    statBorder: 'rgba(255,255,255,.09)',
    statLabel: 'rgba(190,200,215,.40)',
    statValue: '#c8d2dc',
    featColor: 'rgba(190,200,215,.76)',
    checkBg: 'rgba(255,255,255,.07)',
    checkColor: 'rgba(190,200,215,.55)',
    isElite: false,
  },
  elite: {
    num: '04', Icon: Gem, cta: 'Claim Elite Access',
    img: '/cards/S-Class_Elite.png',
    accent: '#c9a24b',
    imgFilter: 'grayscale(5%) brightness(.50) contrast(1.20) saturate(1.15)',
    imgOverlay: 'linear-gradient(270deg,rgba(8,5,0,.0) 0%,rgba(8,5,0,.48) 55%,rgba(8,5,0,.95) 100%)',
    border: 'rgba(201,162,75,.55)',
    shadow: '0 0 0 1px rgba(201,162,75,.45),0 20px 60px rgba(201,162,75,.14),0 6px 20px rgba(0,0,0,.42)',
    hoverShadow: '0 0 0 1.5px rgba(201,162,75,.75),0 28px 72px rgba(201,162,75,.26),0 10px 28px rgba(0,0,0,.52)',
    bg: 'rgba(8,5,0,.97)',
    priceColor: '#f0d878',
    subColor: 'rgba(201,162,75,.65)',
    statBg: 'rgba(201,162,75,.10)',
    statBorder: 'rgba(201,162,75,.20)',
    statLabel: 'rgba(201,162,75,.52)',
    statValue: '#e8c97a',
    featColor: 'rgba(240,210,140,.84)',
    checkBg: 'rgba(201,162,75,.14)',
    checkColor: '#c9a24b',
    isElite: true,
  },
  sovereign: {
    num: '05', Icon: Crown, cta: 'Reserve Sovereign',
    img: '/cards/GWGON_Sovereign.png',
    accent: '#707070',
    imgFilter: 'grayscale(30%) brightness(.62) contrast(1.48)',
    imgOverlay: 'linear-gradient(270deg,rgba(6,6,6,.0) 0%,rgba(6,6,6,.55) 60%,rgba(6,6,6,.95) 100%)',
    border: 'rgba(112,112,112,.18)',
    shadow: '0 2px 20px rgba(0,0,0,.28)',
    hoverShadow: '0 14px 48px rgba(0,0,0,.46)',
    bg: 'rgba(6,6,6,.97)',
    priceColor: '#b0b0b0',
    subColor: 'rgba(155,155,155,.52)',
    statBg: 'rgba(255,255,255,.05)',
    statBorder: 'rgba(255,255,255,.08)',
    statLabel: 'rgba(155,155,155,.42)',
    statValue: '#989898',
    featColor: 'rgba(160,160,160,.72)',
    checkBg: 'rgba(255,255,255,.06)',
    checkColor: 'rgba(155,155,155,.55)',
    isElite: false,
  },
};

const ORDER = ['essential', 'executive', 'premium', 'elite', 'sovereign'];

export default function PlansSection() {
  return (
    <section id="plans" style={{ background: '#EDE8DF', padding: '88px 20px 112px' }}>
      <style>{`
        @keyframes goldPulse {
          0%,100%{box-shadow:0 0 0 1px rgba(201,162,75,.45),0 20px 60px rgba(201,162,75,.14),0 6px 20px rgba(0,0,0,.42);}
          50%{box-shadow:0 0 0 1.5px rgba(201,162,75,.78),0 26px 70px rgba(201,162,75,.24),0 6px 20px rgba(0,0,0,.42);}
        }
        @keyframes goldShimmer {
          from{background-position:0% 50%;}
          to{background-position:200% 50%;}
        }
        .pc-img{transition:transform .9s cubic-bezier(.22,1,.36,1);}
        .plan-card:hover .pc-img{transform:scale(1.06);}
        .elite-ring{animation:goldPulse 2.8s ease-in-out infinite;}
        .elite-ring:hover{animation:none;}
        .gold-cta{
          background:linear-gradient(100deg,#b8882e 0%,#e8c56a 40%,#f5d98a 55%,#e0b84a 75%,#b8882e 100%);
          background-size:200% auto;
          animation:goldShimmer 3s linear infinite;
          transition:transform .2s ease,filter .2s ease;
        }
        .gold-cta:hover{transform:translateY(-1px);filter:brightness(1.08);}
        .ghost-cta{
          background:rgba(255,255,255,.10);
          backdrop-filter:blur(8px);
          -webkit-backdrop-filter:blur(8px);
          border:1px solid rgba(255,255,255,.22);
          box-shadow:0 2px 14px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.10);
          transition:background .22s,border-color .22s,box-shadow .22s,transform .2s;
        }
        .ghost-cta:hover{
          background:rgba(255,255,255,.20);
          border-color:rgba(255,255,255,.38);
          box-shadow:0 6px 24px rgba(0,0,0,.26),inset 0 1px 0 rgba(255,255,255,.15);
          transform:translateY(-2px);
        }
        @media(max-width:860px){
          .plans-grid{grid-template-columns:1fr !important;}
          .sovereign-card{grid-column:span 1 !important;}
          .card-img-panel{width:100% !important;height:200px !important;flex-shrink:0 !important;}
          .plan-card{flex-direction:column !important;}
        }
      `}</style>

      <div style={{ maxWidth: 1280, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 16, marginBottom: 18 }}>
            <div style={{ height: 1, width: 48, background: 'linear-gradient(to right,transparent,rgba(184,146,74,.45))' }} />
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.52em', textTransform: 'uppercase', color: '#a07838' }}>
              Membership Tiers
            </span>
            <div style={{ height: 1, width: 48, background: 'linear-gradient(to left,transparent,rgba(184,146,74,.45))' }} />
          </div>
          <h2 style={{
            fontFamily: 'Georgia,"Times New Roman",serif',
            fontSize: 'clamp(28px,3.6vw,44px)', fontWeight: 700,
            color: '#0B1E3F', letterSpacing: '-.03em', lineHeight: 1.08, margin: '0 0 14px',
          }}>
            Choose Your Membership
          </h2>
          <p style={{ fontSize: 13, fontWeight: 300, color: '#8a7e6e', lineHeight: 1.75, maxWidth: 320, margin: '0 auto' }}>
            VIP darshan, airport lounges, 24×7 concierge &amp; luxury transport — curated for the year ahead.
          </p>
        </div>

        {/* 2-column grid */}
        <div className="plans-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2,1fr)',
          gap: 18,
          alignItems: 'start',
        }}>
          {ORDER.map((id) => {
            const plan   = plans.find((p) => p.id === id);
            const m      = M[id];
            const anchor = ANCHOR_PRICES[id];
            const save   = anchor ? Math.round((1 - plan.price / anchor) * 100) : 0;
            const armed  = plan.bodyguard.toLowerCase().includes('armed') &&
                           !plan.bodyguard.toLowerCase().includes('unarmed');
            const isSovereign = id === 'sovereign';
            const showPrivCount = isSovereign ? 5 : 3;

            return (
              <div
                key={id}
                className={`plan-card${m.isElite ? ' elite-ring' : ''}${isSovereign ? ' sovereign-card' : ''}`}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gridColumn: isSovereign ? 'span 2' : 'span 1',
                  borderRadius: 16,
                  overflow: 'hidden',
                  border: `1px solid ${m.border}`,
                  boxShadow: m.shadow,
                  background: m.bg,
                  transition: 'box-shadow .4s ease,transform .35s cubic-bezier(.22,1,.36,1),opacity .3s ease',
                  transform: 'none',
                  opacity: 1,
                  cursor: 'pointer',
                  position: 'relative',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = m.hoverShadow;
                  e.currentTarget.style.transform = m.isElite ? 'scale(1.02) translateY(-3px)' : 'translateY(-4px)';
                  e.currentTarget.style.opacity = '1';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = m.shadow;
                  e.currentTarget.style.transform = 'none';
                }}
              >
                {/* Image panel */}
                <div
                  className="card-img-panel"
                  style={{
                    position: 'relative',
                    width: isSovereign ? '34%' : '38%',
                    flexShrink: 0,
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={m.img}
                    alt={plan.name}
                    className="pc-img"
                    style={{
                      position: 'absolute', inset: 0,
                      width: '100%', height: '100%',
                      objectFit: 'cover',
                      filter: m.imgFilter,
                      transform: 'scale(1)',
                    }}
                  />

                  {m.isElite && (
                    <div style={{
                      position: 'absolute', inset: 0, pointerEvents: 'none',
                      background: 'radial-gradient(ellipse 100% 40% at 50% 0%,rgba(201,162,75,.14) 0%,transparent 70%)',
                    }} />
                  )}
                  <span style={{
                    position: 'absolute', top: 14, left: 14,
                    fontSize: 10, fontWeight: 900, letterSpacing: '.18em',
                    color: m.isElite ? m.accent : 'rgba(255,255,255,.18)',
                    fontVariantNumeric: 'tabular-nums',
                  }}>{m.num}</span>
                </div>

                {/* Content panel */}
                <div
                  className="card-body"
                  style={{
                    flex: 1,
                    padding: '20px 24px 22px',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    minWidth: 0,
                  }}
                >
                  {m.isElite && (
                    <div style={{
                      position: 'absolute', inset: 0, pointerEvents: 'none',
                      background: 'radial-gradient(ellipse 80% 50% at 100% 0%,rgba(201,162,75,.08) 0%,transparent 70%)',
                    }} />
                  )}

                  {/* Tier name + badge */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <m.Icon size={12} strokeWidth={1.5}
                        style={{ color: m.isElite ? m.accent : 'rgba(255,255,255,.32)', flexShrink: 0 }} />
                      <span style={{
                        fontSize: 9.5, fontWeight: 900,
                        letterSpacing: '.38em', textTransform: 'uppercase',
                        color: m.isElite ? m.accent : 'rgba(255,255,255,.52)',
                      }}>{plan.name}</span>
                    </div>
                    {m.isElite ? (
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 4,
                        padding: '4px 11px', borderRadius: 99,
                        background: 'rgba(201,162,75,.88)', color: '#0c0800', flexShrink: 0,
                      }}>
                        <Sparkles size={7} strokeWidth={2.5} />
                        <span style={{ fontSize: 7, fontWeight: 900, letterSpacing: '.24em', textTransform: 'uppercase' }}>Best Value</span>
                      </div>
                    ) : plan.tag ? (
                      <span style={{
                        fontSize: 6.5, fontWeight: 800, letterSpacing: '.20em', textTransform: 'uppercase',
                        padding: '2px 8px', borderRadius: 3,
                        background: 'rgba(255,255,255,.06)', color: 'rgba(255,255,255,.30)',
                        border: '1px solid rgba(255,255,255,.08)',
                      }}>{plan.tag}</span>
                    ) : null}
                  </div>

                  {/* Separator */}
                  <div style={{ height: 1, marginBottom: 14, background: m.isElite ? `linear-gradient(90deg,${m.accent}50,transparent)` : 'rgba(255,255,255,.07)', position: 'relative' }} />

                  {/* PRICE */}
                  <div style={{ marginBottom: 14, position: 'relative' }}>
                    {anchor && save > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 11, color: m.subColor, textDecoration: 'line-through' }}>
                          {INR(anchor)}
                        </span>
                        <span style={{
                          fontSize: 7.5, fontWeight: 800, letterSpacing: '.12em', textTransform: 'uppercase',
                          padding: '2px 7px', borderRadius: 3,
                          background: m.statBg, color: m.isElite ? m.accent : 'rgba(255,255,255,.45)',
                          border: `1px solid ${m.statBorder}`,
                        }}>&#8722;{save}%</span>
                      </div>
                    )}
                    <div style={{
                      fontSize: 36, fontWeight: 900,
                      letterSpacing: '-.03em', lineHeight: 1,
                      color: m.priceColor,
                    }}>{INR(plan.price)}</div>
                    <div style={{ fontSize: 9.5, marginTop: 5, color: m.subColor, letterSpacing: '.04em' }}>
                      per year &nbsp;&middot;&nbsp; {INR(plan.perMonth)} / mo
                    </div>
                  </div>

                  {/* STATS: trips, vehicle, bodyguard, validity */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: isSovereign ? 'repeat(4,1fr)' : 'repeat(2,1fr)',
                    gap: 8,
                    marginBottom: 14,
                    position: 'relative',
                  }}>
                    {[
                      { label: 'Trips / Year', value: `${plan.trips} trips` },
                      { label: 'Vehicle',      value: plan.vehicleType },
                      { label: 'Security',     value: armed ? 'Armed guard' : 'Unarmed guard' },
                      { label: 'Validity',     value: plan.validity },
                    ].map(({ label, value }) => (
                      <div key={label} style={{
                        padding: '8px 10px', borderRadius: 8,
                        background: m.statBg,
                        border: `1px solid ${m.statBorder}`,
                      }}>
                        <div style={{ fontSize: 7, fontWeight: 600, letterSpacing: '.16em', textTransform: 'uppercase', color: m.statLabel, marginBottom: 3 }}>
                          {label}
                        </div>
                        <div style={{ fontSize: 11.5, fontWeight: 700, color: m.statValue, lineHeight: 1.2 }}>
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Separator */}
                  <div style={{ height: 1, marginBottom: 14, background: 'rgba(255,255,255,.06)', position: 'relative' }} />

                  {/* PRIVILEGES */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 20, flex: 1, position: 'relative' }}>
                    {plan.privileges.slice(0, showPrivCount).map((priv, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
                        <div style={{
                          width: 16, height: 16, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: m.checkBg,
                          border: m.isElite ? '1px solid rgba(201,162,75,.20)' : 'none',
                        }}>
                          <Check size={8} strokeWidth={3} style={{ color: m.checkColor }} />
                        </div>
                        <span style={{
                          fontSize: 12, lineHeight: 1.44,
                          color: m.featColor,
                          fontWeight: m.isElite ? 500 : 400,
                        }}>{priv.title}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, position: 'relative' }}>
                    <Link
                      href={`/booking/${id}`}
                      className={m.isElite ? 'gold-cta' : 'ghost-cta'}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        flex: 1,
                        height: 44,
                        borderRadius: 8,
                        color: m.isElite ? '#0c0800' : '#ffffff',
                        fontSize: 9.5, fontWeight: 800,
                        letterSpacing: '.20em', textTransform: 'uppercase',
                        textDecoration: 'none',
                        boxShadow: m.isElite ? '0 4px 22px rgba(201,162,75,.28)' : 'none',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {m.cta}
                      <ArrowRight size={11} strokeWidth={2.5} />
                    </Link>
                    <Link
                      href={`/membership/${id}`}
                      style={{
                        fontSize: 8.5, fontWeight: 500, letterSpacing: '.18em', textTransform: 'uppercase',
                        color: m.subColor, textDecoration: 'none', opacity: .55,
                        transition: 'opacity .2s', whiteSpace: 'nowrap', flexShrink: 0,
                      }}
                      onMouseEnter={e => { e.currentTarget.style.opacity = '1'; }}
                      onMouseLeave={e => { e.currentTarget.style.opacity = '.55'; }}
                    >
                      Details
                    </Link>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Trust strip */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, marginTop: 64 }}>
          <div style={{ height: 1, flex: 1, maxWidth: 64, background: 'linear-gradient(to right,transparent,rgba(160,140,100,.25))' }} />
          <p style={{
            fontSize: 9, fontWeight: 500, letterSpacing: '.40em', textTransform: 'uppercase',
            color: 'rgba(140,120,80,.46)', whiteSpace: 'nowrap', margin: 0,
          }}>
            Instant Activation &nbsp;&middot;&nbsp; No Hidden Fees &nbsp;&middot;&nbsp; 24&times;7 Concierge
          </p>
          <div style={{ height: 1, flex: 1, maxWidth: 64, background: 'linear-gradient(to left,transparent,rgba(160,140,100,.25))' }} />
        </div>

      </div>
    </section>
  );
}