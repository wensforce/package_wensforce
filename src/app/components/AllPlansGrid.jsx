'use client';

import MembershipCard from './MembershipCard';

export default function AllPlansGrid({ plans }) {
  if (!plans || plans.length === 0) return null;

  return (
    <section id="plans" style={{ background: '#f8f8f6' }} className="py-24 md:py-32">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10">

        {/* ── Section header ── */}
        <div className="max-w-xl mx-auto text-center mb-16">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.22em] mb-3">Membership Plans</p>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight leading-none mb-5">
            Choose your tier
          </h2>
          <p className="text-[15px] text-gray-500 leading-relaxed">
            Five levels of exclusive mobility — each designed for a different lifestyle, security requirement, and status.
          </p>
        </div>

        {/* ── Cards ── */}
        {/* Extra top padding so the "Recommended" pill floats outside without clipping */}
        <div className="pt-7">
          <div
            className="grid gap-5"
            style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}
          >
            {plans.map((plan, i) => (
              <div
                key={plan.id}
                className="plan-fade-in"
                style={{ animationDelay: `${i * 70}ms`, animationFillMode: 'both' }}
              >
                <MembershipCard plan={plan} />
              </div>
            ))}
          </div>
        </div>

        {/* ── Footer ── */}
        <p className="text-center text-[11px] text-gray-400 mt-12 tracking-wide">
          All plans include 12-month validity · 24×7 concierge support 
        </p>
      </div>

      <style>{`
        @keyframes planFadeIn {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .plan-fade-in {
          animation: planFadeIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  );
}
