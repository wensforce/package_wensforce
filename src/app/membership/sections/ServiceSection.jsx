'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * `services` must already be filtered to only items that resolved to a real
 * image (see getServiceImage() + filter in page.jsx). Anything without a
 * thumbnail never reaches this component.
 */

function ServiceCard({ item, index, reduceMotion }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(reduceMotion);

  useEffect(() => {
    if (reduceMotion) return;
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.unobserve(node);
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -60px 0px' }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [reduceMotion]);

  const flipped = index % 2 === 1;
  const ordinal = String(index + 1).padStart(2, '0');

  return (
    <div
      ref={ref}
      className="group relative grid grid-cols-1 lg:grid-cols-2 overflow-hidden rounded-[28px] bg-white transition-all duration-700 hover:shadow-[0_22px_48px_rgba(11,30,63,0.14)]"
      style={{
        border: '1px solid rgba(11,30,63,0.07)',
        boxShadow: visible ? '0 2px 14px rgba(11,30,63,0.06)' : 'none',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transitionDelay: visible ? `${Math.min(index, 4) * 90}ms` : '0ms',
      }}
    >

      {/* Image side */}
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

        {/* Corner frame — draws in on hover, like a membership pass / exhibit label */}
        <div className="absolute inset-4 pointer-events-none">
          {[
            { top: 0, left: 0, border: 'border-t border-l', origin: 'top left' },
            { top: 0, right: 0, border: 'border-t border-r', origin: 'top right' },
            { bottom: 0, left: 0, border: 'border-b border-l', origin: 'bottom left' },
            { bottom: 0, right: 0, border: 'border-b border-r', origin: 'bottom right' },
          ].map((c, ci) => (
            <span
              key={ci}
              className={`absolute w-6 h-6 ${c.border} transition-all duration-500 opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100`}
              style={{
                top: c.top,
                left: c.left,
                right: c.right,
                bottom: c.bottom,
                borderColor: 'rgba(201,162,75,0.9)',
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
                color: '#F3E3BC',
                border: '1px solid rgba(201,162,75,0.4)',
              }}
            >
              ×{item.count} included
            </span>
          </div>
        )}
      </div>

      {/* Text side */}
      <div
        className={`relative flex flex-col justify-center px-8 sm:px-10 py-10 sm:py-12 overflow-hidden ${
          flipped ? 'lg:order-1' : ''
        }`}
      >
        {/* Ghost index numeral — signature element, encodes position in the year's lineup */}
        <span
          aria-hidden="true"
          className="absolute select-none font-black leading-none"
          style={{
            fontSize: 'clamp(90px,11vw,150px)',
            color: 'rgba(201,162,75,0.10)',
            top: '-0.15em',
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
            <p className="text-sm font-light leading-relaxed text-gray-500 max-w-md">
              {item.service.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ServicesSection({ services }) {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);
    const handler = (e) => setReduceMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  if (!services || services.length === 0) return null;

  return (
    <section className="py-20 sm:py-24 px-6" style={{ backgroundColor: '#FAFAF8' }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-14 sm:mb-16 max-w-xl">
          <p
            className="text-[9px] font-bold tracking-[0.55em] uppercase mb-3"
            style={{ color: '#C9A24B' }}
          >
            What You Get
          </p>
          <div className="flex items-end gap-5">
            <h2
              className="font-black leading-tight text-[#0B1E3F]"
              style={{ fontSize: 'clamp(30px,5vw,50px)' }}
            >
              A Year of
              <br />
              Extraordinary Access
            </h2>
          </div>
          <div
            className="mt-6 h-px w-16"
            style={{ background: 'linear-gradient(to right, #C9A24B, transparent)' }}
          />
          <p className="mt-6 text-sm font-light leading-relaxed text-gray-500">
            {services.length} experiences, curated and ready when you are.
          </p>
        </div>

        <div className="space-y-6 sm:space-y-8">
          {services.map((item, i) => (
            <ServiceCard
              key={item.id ?? item.service?.id ?? i}
              item={item}
              index={i}
              reduceMotion={reduceMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
}