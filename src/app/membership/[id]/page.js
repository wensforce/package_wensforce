import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Car, Users, ShieldCheck, Gem, Crown,
  Navigation, Shield, Calendar, Plane,
  Building2, Landmark, Sparkles, Utensils,
  Gift, Phone, Zap, Wifi, RefreshCw, Flame,
  UserCheck, CheckCircle, BadgeCheck,
  MapPin, Clock, ArrowLeft,
} from 'lucide-react';
import { plans, getPlanById } from '../../data/plans';
import CountdownTimer from '../../components/CountdownTimer';

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
};

function PrivIcon({ emoji, size = 16, className = '' }) {
  const Icon = PRIV_ICONS[emoji];
  if (!Icon) return <span style={{ fontSize: size }}>{emoji}</span>;
  return <Icon size={size} className={className} />;
}

const INR = (n) => '₹' + Number(n).toLocaleString('en-IN');

export async function generateStaticParams() {
  return plans.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const plan = getPlanById(id);
  if (!plan) return {};
  return {
    title: `${plan.name} — WENS Force Membership`,
    description: `${plan.tagline}. ${plan.trips} trips/year. ${plan.vehicle}. ${plan.bodyguard}. From ${INR(plan.price)}/year.`,
  };
}

export default async function PlanDetailPage({ params }) {
  const { id } = await params;
  const plan = getPlanById(id);
  if (!plan) notFound();

  const isElite = plan.highlight;
  const isSovereign = plan.isAnchor;
  const otherPlans = plans.filter((p) => p.id !== plan.id);
  const totalWorth = plan.privileges.filter((p) => p.worth).reduce((s, p) => s + p.worth, 0);
  const TierIcon = TIER_ICONS[plan.id] || Car;

  const specs = [
    { label: 'Vehicle', value: plan.vehicle, Icon: Car },
    { label: 'Security', value: plan.bodyguard, Icon: Shield },
    { label: 'Trips / Year', value: `${plan.trips} trips`, Icon: Navigation },
    { label: 'Validity', value: plan.validity, Icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-[#F1F3F5]">

      {/* Top bar */}
      <div className="bg-black text-white py-2.5 px-6 text-center">
        <div className="max-w-5xl mx-auto flex items-center justify-center gap-3 text-xs flex-wrap">
          <span className="text-gray-400">Pricing valid until June 1, 2026</span>
          <span className="text-gray-600">—</span>
          <CountdownTimer targetDate="2026-06-01T00:00:00" />
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto px-6 pt-7 pb-3">
        <nav className="flex items-center gap-2 text-xs text-gray-400">
          <Link href="/" className="hover:text-[#BF9F00] transition-colors flex items-center gap-1">
            <ArrowLeft size={11} />
            Membership Plans
          </Link>
          <span className="text-gray-200">›</span>
          <span className="text-gray-500">{plan.name}</span>
        </nav>
      </div>

      {/* Plan header */}
      <section className="max-w-5xl mx-auto px-6 pb-8">
        <div
          className={[
            'rounded-2xl overflow-hidden',
            isElite ? 'ring-1 ring-[#BF9F00]/40 shadow-[0_8px_40px_rgba(191,159,0,0.10)]' : 'border border-gray-200 shadow-sm',
          ].join(' ')}
        >
          {/* Dark header */}
          <div className="bg-black px-8 sm:px-10 pt-10 pb-8 relative overflow-hidden">
            {/* Dot grid */}
            <div
              className="absolute inset-0 opacity-[0.025]"
              style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, #BF9F00 1px, transparent 0)',
                backgroundSize: '32px 32px',
              }}
            />
            {/* Watermark tier icon */}
            <div className="absolute right-10 bottom-4 opacity-[0.06] pointer-events-none">
              <TierIcon size={140} />
            </div>

            {isElite && (
              <div className="absolute top-5 right-6">
                <span className="shimmer-bg text-black text-[10px] font-bold px-4 py-1.5 rounded-full tracking-[0.12em] uppercase">
                  Best Value
                </span>
              </div>
            )}
            {plan.isPopular && (
              <div className="absolute top-5 right-6">
                <span className="bg-emerald-600 text-white text-[10px] font-bold px-4 py-1.5 rounded-full tracking-[0.12em] uppercase">
                  Most Popular
                </span>
              </div>
            )}
            {isSovereign && (
              <div className="absolute top-5 right-6">
                <span className="bg-white/8 border border-white/15 text-white/50 text-[10px] font-semibold px-4 py-1.5 rounded-full tracking-[0.12em] uppercase">
                  Ultra Exclusive
                </span>
              </div>
            )}

            <div className="relative">
              {/* Tier icon badge */}
              <div className={[
                'inline-flex items-center justify-center w-10 h-10 rounded-xl mb-4 border',
                isElite ? 'bg-[#BF9F00]/15 border-[#BF9F00]/30 text-[#BF9F00]' :
                isSovereign ? 'bg-white/5 border-white/10 text-white/50' :
                'bg-white/8 border-white/12 text-white/60',
              ].join(' ')}>
                <TierIcon size={18} />
              </div>
              <div className="text-[10px] font-semibold tracking-[0.3em] text-white/25 uppercase mb-2">
                Package {plan.packageNo}
              </div>
              <h1 className={['text-4xl sm:text-5xl font-bold tracking-wide mb-2', isElite ? 'text-[#BF9F00]' : 'text-white'].join(' ')}>
                {plan.name}
              </h1>
              <p className="text-white/40 text-sm font-light">{plan.tagline}</p>

              <div className="flex flex-col sm:flex-row sm:items-end gap-6 mt-8">
                <div>
                  <div className={['text-4xl sm:text-5xl font-bold', isElite ? 'text-[#BF9F00]' : 'text-white'].join(' ')}>
                    {INR(plan.price)}
                  </div>
                  <div className="text-white/30 text-sm mt-1 font-light">
                    per year &nbsp;·&nbsp; {INR(plan.perMonth)}/month &nbsp;·&nbsp; all-inclusive
                  </div>
                  <div className={['text-sm mt-2 font-medium', isElite ? 'text-[#BF9F00]/70' : 'text-white/40'].join(' ')}>
                    ₹{plan.freePerksWorth.toLocaleString('en-IN')} in privileges included
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Specs strip */}
          <div className="bg-white grid grid-cols-2 sm:grid-cols-4 border-b border-gray-100">
            {specs.map(({ label, value, Icon }, i) => (
              <div key={label} className={['p-5 text-center', i < 3 ? 'sm:border-r border-gray-100' : '', i < 2 ? 'border-b sm:border-b-0 border-gray-100' : ''].join(' ')}>
                <div className={[
                  'inline-flex items-center justify-center w-8 h-8 rounded-lg mb-2',
                  isElite ? 'bg-[#BF9F00]/10 text-[#BF9F00]' : 'bg-gray-50 text-gray-400',
                ].join(' ')}>
                  <Icon size={14} />
                </div>
                <div className="text-[9px] font-semibold tracking-[0.25em] text-gray-300 uppercase mb-1">
                  {label}
                </div>
                <div className={['font-semibold text-sm leading-snug', isElite ? 'text-[#BF9F00]' : 'text-gray-800'].join(' ')}>
                  {value}
                </div>
              </div>
            ))}
          </div>

          {/* CTA strip */}
          <div className="bg-white px-8 py-5 flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1">
              <div className="font-semibold text-sm text-gray-900">Ready to get started?</div>
              <div className="text-xs text-gray-400 mt-0.5 font-light">Concierge onboarding within 2 hours · 24×7 support</div>
            </div>
            <button
              className={[
                'py-3.5 px-8 rounded-xl font-semibold text-sm transition-all w-full sm:w-auto',
                isElite ? 'bg-[#BF9F00] text-black hover:bg-[#a88a00] pulse-ring' :
                isSovereign ? 'bg-gray-900 text-white hover:bg-black' :
                'bg-gray-900 text-white hover:bg-black',
              ].join(' ')}
            >
              {isElite ? 'Claim This Membership' : isSovereign ? 'Enquire About Sovereign' : `Get ${plan.name} Plan`}
            </button>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-5xl mx-auto px-6 pb-10 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: Privileges + FAQ */}
        <div className="lg:col-span-2 space-y-6">

          {/* Privileges */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className={['px-6 py-5 border-b', isElite ? 'bg-black border-[#BF9F00]/15' : 'bg-gray-50 border-gray-100'].join(' ')}>
              <h2 className={['font-semibold text-sm tracking-wide', isElite ? 'text-[#BF9F00]' : 'text-gray-700'].join(' ')}>
                Complimentary Privileges Included
              </h2>
              <p className={['text-xs mt-0.5 font-light', isElite ? 'text-white/30' : 'text-gray-400'].join(' ')}>
                All activated from day one of your membership
              </p>
            </div>
            <ul className="divide-y divide-gray-50">
              {plan.privileges.map((priv, i) => (
                <li key={i} className="flex items-start gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors">
                  <div className={[
                    'w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5',
                    isElite ? 'bg-[#BF9F00]/10 text-[#BF9F00]' :
                    isSovereign ? 'bg-gray-100 text-gray-500' :
                    'bg-gray-50 text-gray-400',
                  ].join(' ')}>
                    <PrivIcon emoji={priv.icon} size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-gray-800">{priv.title}</div>
                    {priv.desc && <div className="text-xs text-gray-400 mt-0.5 font-light">{priv.desc}</div>}
                  </div>
                  {priv.worth ? (
                    <div className="shrink-0 text-right">
                      <div className="text-[9px] text-gray-300 uppercase tracking-wide">worth</div>
                      <div className={['font-semibold text-sm', isElite ? 'text-[#BF9F00]' : 'text-gray-600'].join(' ')}>
                        {INR(priv.worth)}
                      </div>
                    </div>
                  ) : (
                    <div className={['text-xs font-medium shrink-0', isElite ? 'text-[#BF9F00]/60' : 'text-gray-300'].join(' ')}>
                      Included
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Plan FAQ */}
          {plan.faqs?.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 bg-gray-50">
                <h2 className="font-semibold text-sm text-gray-700">Plan Questions</h2>
              </div>
              <div className="divide-y divide-gray-50">
                {plan.faqs.map((faq, i) => (
                  <details key={i} className="group">
                    <summary className="flex items-center justify-between px-6 py-4 cursor-pointer text-sm font-medium text-gray-700 hover:text-[#BF9F00] transition-colors list-none">
                      {faq.q}
                      <span className="text-gray-300 text-xl ml-4 shrink-0 group-open:rotate-45 transition-transform inline-block leading-none">
                        +
                      </span>
                    </summary>
                    <div className="px-6 pb-5 text-gray-500 text-sm leading-relaxed font-light">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Summary sidebar */}
        <div className="space-y-5">

          {/* Value summary */}
          <div className={['rounded-2xl overflow-hidden border shadow-sm', isElite ? 'border-[#BF9F00]/25' : 'border-gray-100'].join(' ')}>
            <div className={['px-5 py-4 border-b', isElite ? 'bg-black border-[#BF9F00]/15' : 'bg-gray-50 border-gray-100'].join(' ')}>
              <h3 className={['font-semibold text-sm', isElite ? 'text-[#BF9F00]' : 'text-gray-700'].join(' ')}>
                Privilege Value Breakdown
              </h3>
            </div>
            <div className="bg-white px-5 py-4 space-y-3">
              {plan.privileges.filter((p) => p.worth).map((priv, i) => (
                <div key={i} className="flex items-center justify-between gap-3">
                  <span className="text-xs text-gray-500 flex-1 leading-snug font-light">{priv.title}</span>
                  <span className={['text-xs font-semibold shrink-0', isElite ? 'text-[#BF9F00]' : 'text-gray-600'].join(' ')}>
                    {INR(priv.worth)}
                  </span>
                </div>
              ))}
              <div className="border-t border-gray-100 pt-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400 font-light">Total privilege value</span>
                  <span className="font-semibold text-gray-600">{INR(totalWorth)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-800">You Pay</span>
                  <span className={['text-lg font-bold', isElite ? 'text-[#BF9F00]' : 'text-gray-900'].join(' ')}>
                    {INR(plan.price)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick specs */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-5 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-sm text-gray-700">At a Glance</h3>
            </div>
            <div className="px-5 py-4 space-y-3">
              {[
                { label: 'Annual price', value: INR(plan.price) },
                { label: 'Monthly equivalent', value: INR(plan.perMonth) },
                { label: 'Trips per year', value: `${plan.trips} trips` },
                { label: 'Vehicle class', value: plan.vehicleType },
                { label: 'Security level', value: plan.bodyguard.includes('Armed') ? 'Armed guard' : 'Unarmed guard' },
                { label: 'Privileges worth', value: `₹${plan.freePerksWorth.toLocaleString('en-IN')}+` },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 font-light">{item.label}</span>
                  <span className={['text-xs font-semibold', isElite ? 'text-[#BF9F00]' : 'text-gray-700'].join(' ')}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Urgency CTA */}
          <div className={['rounded-2xl p-5', isElite ? 'bg-black border border-[#BF9F00]/20' : 'bg-white border border-gray-100'].join(' ')}>
            <div className="text-center mb-4">
              <div className={['text-xs font-light mb-1.5', isElite ? 'text-white/30' : 'text-gray-400'].join(' ')}>
                Price increases June 1, 2026
              </div>
              <CountdownTimer targetDate="2026-06-01T00:00:00" />
            </div>
            <button
              className={[
                'w-full py-3.5 rounded-xl font-semibold text-sm transition-all',
                isElite ? 'bg-[#BF9F00] text-black hover:bg-[#a88a00] pulse-ring' :
                isSovereign ? 'bg-gray-900 text-white hover:bg-black' :
                'bg-gray-900 text-white hover:bg-black',
              ].join(' ')}
            >
              {isElite ? 'Claim This Membership' : isSovereign ? 'Enquire About Sovereign' : `Get ${plan.name} Plan`}
            </button>
            <p className={['text-[10px] text-center mt-2', isElite ? 'text-white/20' : 'text-gray-400'].join(' ')}>
              15-day refund · No hidden fees
            </p>
          </div>

          {/* Upgrade nudge (only for lower tiers) */}
          {!isElite && !isSovereign && (
            <div className="bg-[#BF9F00]/6 border border-[#BF9F00]/20 rounded-2xl p-5">
              <div className="text-[10px] font-semibold text-[#BF9F00] tracking-[0.2em] uppercase mb-2">
                Upgrade Consideration
              </div>
              <p className="text-xs text-gray-600 mb-3 leading-relaxed font-light">
                The Elite plan includes a Luxury Sedan, unlimited domestic lounges, 5 VIP darshan vouchers, fine dining,
                and a personal RM — all for ₹99,999/year.
              </p>
              <Link
                href="/membership/elite"
                className="block w-full py-2.5 bg-[#BF9F00] text-black font-semibold text-xs text-center rounded-xl hover:bg-[#a88a00] transition-all"
              >
                View Elite Plan →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Other plans */}
      <section className="max-w-5xl mx-auto px-6 pb-14">
        <h2 className="text-lg font-semibold text-gray-900 mb-5">Other Membership Plans</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {otherPlans.slice(0, 4).map((p) => {
            const OtherIcon = TIER_ICONS[p.id] || Car;
            return (
              <Link
                key={p.id}
                href={`/membership/${p.id}`}
                className={[
                  'flex items-center gap-4 bg-white rounded-2xl p-5 border transition-all hover:shadow-md card-hover',
                  p.highlight ? 'border-[#BF9F00]/30' : 'border-gray-100',
                ].join(' ')}
              >
                <div className={[
                  'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                  p.highlight ? 'bg-[#BF9F00]/10 text-[#BF9F00]' :
                  p.isAnchor ? 'bg-gray-900 text-white/60' :
                  'bg-gray-50 text-gray-400',
                ].join(' ')}>
                  <OtherIcon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[9px] text-gray-300 tracking-[0.2em] uppercase font-semibold">Package {p.packageNo}</div>
                  <div className={['font-semibold text-base tracking-wide mt-0.5', p.highlight ? 'text-[#BF9F00]' : 'text-gray-800'].join(' ')}>
                    {p.name}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-semibold text-gray-700">{INR(p.price)}/yr</span>
                    <span className="text-xs text-gray-300">·</span>
                    <span className="text-xs text-gray-400 font-light">{p.trips} trips</span>
                  </div>
                </div>
                <Navigation size={14} className="text-gray-300 shrink-0" />
              </Link>
            );
          })}
        </div>
        <div className="mt-5 text-center">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#BF9F00] transition-colors font-light">
            <ArrowLeft size={13} />
            Back to all plans
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-white/5 py-8 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="text-[#BF9F00] font-bold text-sm tracking-[0.25em] uppercase mb-2">WENS Force</div>
          <p className="text-gray-700 text-xs font-light">© 2026 WENS Force. All rights reserved.</p>
        </div>
      </footer>

      {/* Sticky mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-black/95 backdrop-blur border-t border-white/8 px-5 py-3">
        <div className="flex items-center gap-4">
          <div className="flex-1 min-w-0">
            <div className="text-[10px] text-gray-500 uppercase tracking-widest">{plan.name}</div>
            <div className={['font-semibold text-sm', isElite ? 'text-[#BF9F00]' : 'text-white'].join(' ')}>
              {INR(plan.price)}/yr{plan.spotsLeft <= 8 ? ` · ${plan.spotsLeft} left` : ''}
            </div>
          </div>
          <button
            className={[
              'font-semibold py-2.5 px-5 rounded-xl text-xs whitespace-nowrap shrink-0',
              isElite ? 'bg-[#BF9F00] text-black' : 'bg-white text-black',
            ].join(' ')}
          >
            Get Started
          </button>
        </div>
      </div>
      <div className="h-16 md:hidden" />
    </div>
  );
}
