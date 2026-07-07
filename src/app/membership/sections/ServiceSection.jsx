'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// ── Custom hook: respects prefers-reduced-motion ──────────────────────────────
function useReduceMotion() {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq      = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);
    const handler = (e) => setReduceMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return reduceMotion;
}

// ── Custom hook: fires once when the element enters the viewport ──────────────
function useInView(options = {}) {
  const ref             = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        io.unobserve(node);          // fire once, then stop watching
      }
    }, options);
    io.observe(node);
    return () => io.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);                             // options are stable at call-site

  return [ref, inView];
}

// ── ServiceCard ───────────────────────────────────────────────────────────────
function ServiceCard({ item, index }) {
  const reduceMotion        = useReduceMotion();
  const [cardRef, visible]  = useInView({
    threshold:   0.2,
    rootMargin: '0px 0px -60px 0px',
  });

  // Expand/collapse the description on mobile via click
  const [expanded, setExpanded] = useState(false);
  const toggleExpanded          = useCallback(() => setExpanded((v) => !v), []);

  const isVisible = reduceMotion || visible;
  const flipped   = index % 2 === 1;
  const ordinal   = String(index + 1).padStart(2, '0');

  return (
    <div
      ref={cardRef}
      onClick={toggleExpanded}
      className="group relative grid grid-cols-1 lg:grid-cols-2 overflow-hidden rounded-[28px] bg-white cursor-pointer transition-all duration-700 hover:shadow-[0_22px_48px_rgba(11,30,63,0.14)]"
      style={{
        border:          '1px solid rgba(11,30,63,0.07)',
        boxShadow:        isVisible ? '0 2px 14px rgba(11,30,63,0.06)' : 'none',
        opacity:          isVisible ? 1 : 0,
        transform:        isVisible ? 'translateY(0)' : 'translateY(28px)',
        transitionDelay:  isVisible ? `${Math.min(index, 4) * 90}ms` : '0ms',
      }}
    >
      {/* ── Image side ── */}
      <div
        className={`relative overflow-hidden ${flipped ? 'lg:order-2' : ''}`}
        style={{ minHeight: '280px' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image}
          alt={item.service.title}
          className="w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
          style={{ minHeight: '280px' }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(11,19,38,0.65) 0%, rgba(11,19,38,0.05) 55%, transparent 100%)',
          }}
        />

        {/* Corner frame — draws in on hover */}
        <div className="absolute inset-4 pointer-events-none">
          {[
            { top: 0,    left: 0,   border: 'border-t border-l' },
            { top: 0,    right: 0,  border: 'border-t border-r' },
            { bottom: 0, left: 0,   border: 'border-b border-l' },
            { bottom: 0, right: 0,  border: 'border-b border-r' },
          ].map((c, ci) => (
            <span
              key={ci}
              className={`absolute w-6 h-6 ${c.border} transition-all duration-500 opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100`}
              style={{
                top: c.top, left: c.left, right: c.right, bottom: c.bottom,
                borderColor:    'rgba(201,162,75,0.9)',
                transitionDelay: `${ci * 40}ms`,
              }}
            />
          ))}
        </div>

        {item.count > 1 && (
          <div className="absolute bottom-5 left-5">
            <span
              className="text-[9px] font-bold tracking-[0.4em] uppercase px-3 py-1.5 rounded-full backdrop-blur-md"
              style={{
                background: 'rgba(201,162,75,0.22)',
                color:      '#F3E3BC',
                border:     '1px solid rgba(201,162,75,0.4)',
              }}
            >
              ×{item.count} included
            </span>
          </div>
        )}
      </div>

      {/* ── Text side ── */}
      <div
        className={`relative flex flex-col justify-center px-8 sm:px-10 py-10 sm:py-12 overflow-hidden ${
          flipped ? 'lg:order-1' : ''
        }`}
      >
        {/* Ghost ordinal */}
        <span
          aria-hidden="true"
          className="absolute select-none font-black leading-none"
          style={{
            fontSize: 'clamp(90px,11vw,150px)',
            color:    'rgba(201,162,75,0.10)',
            top:      '-0.15em',
            [flipped ? 'right' : 'left']: '-0.03em',
          }}
        >
          {ordinal}
        </span>

        <div className="relative">
          <span
            className="block text-[9px] font-bold tracking-[0.4em] uppercase mb-3"
            style={{ color: '#C9A24B' }}
          >
            {ordinal} / Access
          </span>

          <h3
            className="font-black leading-snug mb-4 text-[#0B1E3F]"
            style={{ fontSize: 'clamp(20px,2.5vw,28px)' }}
          >
            {item.service.title}
          </h3>

          {item.service.description && (
            /* Expand on click (useful on mobile where hover doesn't exist) */
            <div
              className="transition-all duration-300 overflow-hidden"
              style={{
                display:        'grid',
                gridTemplateRows: expanded ? '1fr' : '0fr',
              }}
            >
              <div className="overflow-hidden">
                <p className="text-sm font-light leading-relaxed text-gray-500 max-w-md pb-1">
                  {item.service.description}
                </p>
              </div>
            </div>
          )}

          {/* Read-more hint — hidden on lg where the card is always full-size */}
          {item.service.description && (
            <button
              className="mt-3 text-[10px] font-semibold tracking-wide transition-colors lg:hidden"
              style={{ color: '#C9A24B' }}
              onClick={(e) => { e.stopPropagation(); toggleExpanded(); }}
            >
              {expanded ? 'Show less ↑' : 'Read more ↓'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── ServicesSection ───────────────────────────────────────────────────────────
const INITIAL_SHOW = 3;

export default function ServicesSection({ services }) {
  const [showAll, setShowAll]    = useState(false);
  const [headerRef, headerVisible] = useInView({ threshold: 0.4 });

  if (!services || services.length === 0) return null;

  const visible     = showAll ? services : services.slice(0, INITIAL_SHOW);
  const hasMore     = services.length > INITIAL_SHOW;
  const hiddenCount = services.length - INITIAL_SHOW;

  return (
    <section className="py-20 sm:py-24 px-6" style={{ backgroundColor: '#FAFAF8' }}>
      <div className="max-w-6xl mx-auto">

        {/* Header — fades in via useInView */}
        <div
          ref={headerRef}
          className="mb-14 sm:mb-16 max-w-xl transition-all duration-700"
          style={{
            opacity:   headerVisible ? 1 : 0,
            transform: headerVisible ? 'translateY(0)' : 'translateY(20px)',
          }}
        >
          <p
            className="text-[9px] font-bold tracking-[0.55em] uppercase mb-3"
            style={{ color: '#C9A24B' }}
          >
            What You Get
          </p>
          <h2
            className="font-black leading-tight text-[#0B1E3F]"
            style={{ fontSize: 'clamp(30px,5vw,50px)' }}
          >
            A Year of
            <br />
            Extraordinary Access
          </h2>
          <div
            className="mt-6 h-px w-16"
            style={{ background: 'linear-gradient(to right, #C9A24B, transparent)' }}
          />
          <p className="mt-6 text-sm font-light leading-relaxed text-gray-500">
            {services.length} experience{services.length !== 1 ? 's' : ''}, curated and ready when you are.
          </p>
        </div>

        {/* Cards */}
        <div className="space-y-6 sm:space-y-8">
          {visible.map((item, i) => (
            <ServiceCard
              key={item.id ?? item.service?.id ?? i}
              item={item}
              index={i}
            />
          ))}
        </div>

        {/* Show more / less */}
        {hasMore && (
          <div className="mt-10 text-center">
            <button
              onClick={() => setShowAll((v) => !v)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 border hover:shadow-md"
              style={{
                borderColor: 'rgba(201,162,75,0.4)',
                color:       '#C9A24B',
                background:  'rgba(201,162,75,0.06)',
              }}
            >
              {showAll
                ? 'Show Less ↑'
                : `Show ${hiddenCount} More Experience${hiddenCount !== 1 ? 's' : ''} ↓`
              }
            </button>
          </div>
        )}

      </div>
    </section>
  );
}