'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Check, Gem, Crown, Shield, ShieldCheck,
  Car, Users, CheckCircle, Zap,
} from 'lucide-react';

const INR = (n) => '₹' + Number(n).toLocaleString('en-IN');
const WA_NUMBER = '917304607954';

const CITIES = [
  'Mumbai', 'Delhi NCR', 'Bangalore', 'Hyderabad', 'Chennai',
  'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Other',
];

const TIER_ICONS = {
  essential: Car, executive: Users, premium: ShieldCheck, elite: Gem, sovereign: Crown,
};

const TIER_HIGHLIGHTS = {
  essential: [
    { text: '3 Curated Journeys per year', bold: true },
    { text: '1× VIP Darshan Voucher (worth ₹4,000)' },
    { text: '1× Airport Lounge Access (worth ₹5,000)' },
    { text: '24×7 Concierge Helpline' },
    { text: 'Family-Transferable membership' },
  ],
  executive: [
    { text: '4 Curated Journeys per year', bold: true },
    { text: '2× VIP Darshan Vouchers (worth ₹10,000)' },
    { text: 'Heritage Monument Fast-Track Pass' },
    { text: 'Free Vehicle Upgrade Voucher (worth ₹15,000)' },
    { text: '24×7 Concierge Helpline' },
  ],
  premium: [
    { text: '5 Curated Journeys per year', bold: true },
    { text: '3× VIP Darshan Vouchers (worth ₹20,000)' },
    { text: 'Armed Bodyguard on every trip', bold: true },
    { text: 'Dedicated Relationship Manager' },
    { text: 'Personal Security Risk Assessment (worth ₹10,000)' },
  ],
  elite: [
    { text: '5 Curated Journeys per year', bold: true },
    { text: '5× Premium VIP Darshan Vouchers (worth ₹25,000)' },
    { text: 'Armed Bodyguard + Luxury Sedan', bold: true },
    { text: 'Unlimited Domestic Lounge Access (worth ₹50,000)' },
    { text: 'Fine-Dining Voucher + Personalised Gift' },
  ],
  sovereign: [
    { text: '5 Curated Journeys — Luxury SUV', bold: true },
    { text: 'Unlimited VIP Darshan (all 11 partner temples)' },
    { text: 'Bhasm Aarti VVIP Booking — Mahakaleshwar', bold: true },
    { text: 'Unlimited All Airport Lounges (Priority Pass)' },
    { text: '4× Spa Sessions + 2× Fine Dining + Airport Concierge' },
  ],
};

const TESTIMONIAL = {
  elite: { name: 'Dr. Priya Venkataraman', role: 'COO, Zenith Pharma', quote: "My RM knows my schedule before I tell her. I haven't touched a travel app in eight months." },
  sovereign: { name: 'Rajan Desai', role: 'Managing Partner, Desai Capital Group', quote: "The Bhasm Aarti booking at Ujjain was something I thought was impossible. They had it done in 48 hours." },
  premium: { name: 'Capt. (Retd.) Arun Sharma', role: 'Board Director, Hyderabad', quote: "The risk assessment they did was sharper than what most corporates offer their CEOs." },
  executive: { name: 'Rohan Agarwal', role: 'Returned NRI, Pune', quote: "Two weeks in, I had done three trips, one pilgrimage, and two lounge visits. Upgraded to Elite within 60 days." },
  essential: { name: 'Anjali Bhatnagar', role: 'Film Producer, Mumbai', quote: "The car is there before I ask, the guard blends in, the concierge never asks twice." },
};

function SuccessState({ plan, form }) {
  const waMsg = `Hi WENS Force! I just reserved the ${plan.name} Membership (${INR(plan.price)}/yr).\n\nName: ${form.name}\nMobile: +91${form.phone}\nCity: ${form.city || 'Not specified'}\n\nPlease send the payment link to complete my booking.`;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16" style={{ backgroundColor: '#0B1E3F' }}>
      {/* Glow blob */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ backgroundColor: 'rgba(201,162,75,0.12)' }} />

      <div className="relative z-10 max-w-md w-full text-center">
        {/* Success icon */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"
          style={{ background: 'linear-gradient(135deg, #C9A24B, #f0c940)' }}
        >
          <Check size={36} strokeWidth={3} className="text-black" />
        </div>

        <p className="text-[#C9A24B] text-[10px] tracking-[0.4em] uppercase font-semibold mb-2">Booking Reserved</p>
        <h1 className="font-serif-display text-3xl sm:text-4xl font-bold text-white mb-3">
          You&apos;re In, {form.name.split(' ')[0]}!
        </h1>
        <p className="text-white/55 text-base font-light leading-relaxed mb-8">
          Your <strong className="text-[#C9A24B]">{plan.name} Membership</strong> spot is reserved.<br />
          Our concierge will call <strong className="text-white/80">+91 {form.phone}</strong> within 2 hours to complete payment and activate your account.
        </p>

        {/* Timeline */}
        <div className="flex items-start justify-center gap-0 mb-10">
          {[
            { step: '1', label: 'Spot Reserved', sub: 'Right now', done: true },
            { step: '2', label: 'Concierge Calls', sub: 'Within 2 hours', done: false },
            { step: '3', label: 'Membership Active', sub: 'Within 24 hours', done: false },
          ].map((s, i) => (
            <div key={i} className="flex items-start">
              <div className="flex flex-col items-center">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold mb-2"
                  style={{ backgroundColor: s.done ? '#C9A24B' : 'rgba(255,255,255,0.1)', color: s.done ? '#000' : 'rgba(255,255,255,0.4)' }}
                >
                  {s.done ? <Check size={14} strokeWidth={3} /> : s.step}
                </div>
                <p className={`text-[11px] font-semibold text-center w-20 ${s.done ? 'text-[#C9A24B]' : 'text-white/40'}`}>{s.label}</p>
                <p className="text-[10px] text-white/25 text-center w-20">{s.sub}</p>
              </div>
              {i < 2 && (
                <div className="w-10 h-px mt-4 mx-1" style={{ backgroundColor: i === 0 ? 'rgba(201,162,75,0.4)' : 'rgba(255,255,255,0.1)' }} />
              )}
            </div>
          ))}
        </div>

        {/* WhatsApp CTA */}
        <a
          href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waMsg)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl font-bold text-white text-sm mb-3 transition-all hover:opacity-90 hover:shadow-xl"
          style={{ backgroundColor: '#25D366' }}
        >
          <svg viewBox="0 0 32 32" width="18" height="18" fill="white">
            <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.668 4.799 1.836 6.793L2 30l7.393-1.812A13.918 13.918 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2z"/>
          </svg>
          Connect on WhatsApp Now
        </a>
        <p className="text-white/30 text-xs">Can&apos;t wait for the call? Message us directly to fast-track your activation.</p>

        <Link href="/" className="mt-8 inline-block text-white/25 text-xs hover:text-white/50 transition-colors">
          ← Back to wensforce.com
        </Link>
      </div>
    </div>
  );
}

export default function BookingPageContent({ plan, anchorPrice, foundingSpots }) {
  const [form, setForm] = useState({ name: '', phone: '', city: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const TierIcon = TIER_ICONS[plan.id] || Car;
  const highlights = TIER_HIGHLIGHTS[plan.id] || [];
  const testimonial = TESTIMONIAL[plan.id];
  const isElite = plan.id === 'elite';
  const isSovereign = plan.id === 'sovereign';

  const validate = () => {
    const e = {};
    if (!form.name.trim() || form.name.trim().length < 2) e.name = 'Please enter your full name';
    if (!form.phone.match(/^\d{10}$/)) e.phone = 'Please enter a valid 10-digit mobile number';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setErrors({});
    setLoading(true);

    const waMsg = `Hi WENS Force! I just reserved the ${plan.name} Membership (${INR(plan.price)}/yr).\n\nName: ${form.name}\nMobile: +91${form.phone}\nCity: ${form.city || 'Not specified'}\n\nPlease send the payment link to complete my booking.`;

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waMsg)}`, '_blank');
    }, 1400);
  };

  if (submitted) return <SuccessState plan={plan} form={form} />;

  const spotsLeft = 100 - foundingSpots;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0B1E3F' }}>
      {/* Background texture */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.025]"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #C9A24B 1px, transparent 0)', backgroundSize: '40px 40px' }}
      />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/8 backdrop-blur-md" style={{ backgroundColor: 'rgba(11,30,63,0.95)' }}>
        <div className="max-w-5xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <Link href={`/membership/${plan.id}`} className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors">
            <ArrowLeft size={15} />
            Back
          </Link>
          <span className="text-[#C9A24B] font-bold text-[11px] tracking-[0.3em] uppercase hidden sm:block">
            WENS Force · Secure Checkout
          </span>
          <div className="flex items-center gap-1.5 text-white/30 text-[11px]">
            <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5"><path d="M12 2L4 6v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6L12 2z" fill="rgba(201,162,75,0.5)" stroke="none"/></svg>
            Secure &amp; Encrypted
          </div>
        </div>
      </header>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 items-start">

        {/* ── LEFT: Plan Showcase ── */}
        <div className="lg:sticky lg:top-24">
          {/* Eyebrow */}
          <p className="text-[#C9A24B] text-[10px] tracking-[0.45em] uppercase font-semibold mb-4">
            You&apos;re Securing
          </p>

          {/* Plan name */}
          <div className="flex items-center gap-4 mb-2">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border"
              style={{ backgroundColor: 'rgba(201,162,75,0.15)', borderColor: 'rgba(201,162,75,0.25)' }}
            >
              <TierIcon size={26} strokeWidth={1.25} className="text-[#C9A24B]" />
            </div>
            <div>
              <h1 className="font-serif-display text-4xl sm:text-5xl font-bold text-[#f0c940] leading-none tracking-wide">
                {plan.name}
              </h1>
              <p className="text-white/40 text-sm font-light mt-1">Founding Member · Charter Pricing</p>
            </div>
          </div>

          {/* Price */}
          <div className="mt-6 mb-6">
            {anchorPrice && (
              <span className="text-white/30 text-sm line-through mr-3">{INR(anchorPrice)}</span>
            )}
            <span className="text-4xl font-black text-white">{INR(plan.price)}</span>
            <span className="text-white/40 text-sm font-light ml-2">/ year, all-inclusive</span>
            <p className="text-[#C9A24B]/70 text-xs mt-1.5 flex items-center gap-1.5">
              <Gem size={11} strokeWidth={2} />
              ₹{plan.freePerksWorth.toLocaleString('en-IN')} in privileges included
            </p>
          </div>

          {/* Founding spots bar */}
          <div className="mb-7 p-4 rounded-2xl border" style={{ backgroundColor: 'rgba(201,162,75,0.07)', borderColor: 'rgba(201,162,75,0.2)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#C9A24B] text-[11px] font-semibold tracking-wide">Founding 100 Programme</span>
              <span className="text-white/60 text-[11px]">{foundingSpots} of 100 confirmed</span>
            </div>
            <div className="h-2 rounded-full bg-white/8 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{ width: `${foundingSpots}%`, background: 'linear-gradient(90deg, #C9A24B, #f0c940)' }}
              />
            </div>
            <p className="text-white/35 text-[10px] mt-2">
              Charter members lock this price permanently — no annual increases, ever.
            </p>
          </div>

          {/* Key highlights */}
          <p className="text-white/25 text-[10px] tracking-[0.3em] uppercase font-semibold mb-4">What You Get</p>
          <ul className="space-y-3 mb-8">
            {highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-3">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{ backgroundColor: 'rgba(201,162,75,0.2)' }}
                >
                  <Check size={10} strokeWidth={3} className="text-[#C9A24B]" />
                </div>
                <span className={`text-sm leading-snug ${h.bold ? 'text-white font-semibold' : 'text-white/60 font-light'}`}>
                  {h.text}
                </span>
              </li>
            ))}
          </ul>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-3 mb-7">
            {[
              { icon: Zap, text: 'Instant Activation' },
              { icon: CheckCircle, text: 'No Hidden Fees' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-1.5 text-[11px] text-white/45 border border-white/10 px-3 py-1.5 rounded-full">
                <Icon size={11} strokeWidth={2} />
                {text}
              </div>
            ))}
          </div>

          {/* Testimonial */}
          {testimonial && (
            <div className="p-5 rounded-2xl border border-white/8" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
              <p className="text-white/55 text-sm font-light leading-relaxed italic mb-3">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-black text-[9px] font-bold shrink-0" style={{ background: 'linear-gradient(135deg,#C9A24B,#a88000)' }}>
                  {testimonial.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <p className="text-white/70 text-xs font-semibold">{testimonial.name}</p>
                  <p className="text-white/30 text-[10px]">{testimonial.role}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT: Booking Form ── */}
        <div>
          <div
            className="rounded-3xl p-7 sm:p-8 border shadow-2xl"
            style={{ backgroundColor: 'white', boxShadow: '0 32px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(201,162,75,0.2)' }}
          >
            {/* Urgency pill */}
            <div className="flex items-center gap-2 mb-5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                {spotsLeft} founding spots remaining at this price
              </span>
            </div>

            <h2 className="font-serif-display text-2xl font-bold text-[#0B1E3F] mb-1">
              Reserve Your {plan.name} Spot
            </h2>
            <p className="text-gray-500 text-sm font-light mb-6 leading-relaxed">
              No payment now — fill the form and our concierge calls you within 2 hours to complete your membership.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 tracking-wide uppercase">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Rajan Mehta"
                  className={`w-full px-4 py-3.5 rounded-xl border-2 text-sm text-gray-800 outline-none transition-colors ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-[#C9A24B]'}`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 tracking-wide uppercase">
                  Mobile Number <span className="text-red-400">*</span>
                </label>
                <div className={`flex items-center border-2 rounded-xl overflow-hidden transition-colors ${errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-200 focus-within:border-[#C9A24B]'}`}>
                  <span className="px-3.5 py-3.5 text-sm text-gray-500 font-medium border-r border-gray-200 bg-gray-50">+91</span>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                    placeholder="98765 43210"
                    className="flex-1 px-3.5 py-3.5 text-sm text-gray-800 outline-none bg-transparent"
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              {/* City */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 tracking-wide uppercase">
                  Your City
                </label>
                <select
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-[#C9A24B] text-sm text-gray-700 outline-none transition-colors bg-white"
                >
                  <option value="">Select your city…</option>
                  {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Price summary */}
              <div className="bg-[#FAF6EC] rounded-2xl p-4 border border-[#C9A24B]/20">
                <div className="flex justify-between items-center">
                  <span className="text-[#0B1E3F] text-sm font-medium">{plan.name} Membership</span>
                  <span className="text-[#0B1E3F] text-sm font-bold">{INR(plan.price)}/yr</span>
                </div>
                {anchorPrice && (
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-gray-400 text-xs font-light">Standard price</span>
                    <span className="text-gray-400 text-xs line-through">{INR(anchorPrice)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center mt-1">
                  <span className="text-emerald-600 text-xs font-semibold">Founding Member Discount</span>
                  <span className="text-emerald-600 text-xs font-semibold">–{INR(anchorPrice - plan.price)}</span>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4.5 rounded-2xl font-black text-black text-base tracking-wide transition-all hover:shadow-2xl hover:-translate-y-0.5 active:scale-95 disabled:opacity-70 relative overflow-hidden pulse-ring"
                style={{
                  background: loading ? '#a88000' : 'linear-gradient(135deg, #C9A24B 0%, #f0c940 50%, #C9A24B 100%)',
                  backgroundSize: '200% 100%',
                  padding: '1rem 1.5rem',
                  boxShadow: '0 8px 32px rgba(201,162,75,0.5)',
                }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="rgba(0,0,0,0.3)" strokeWidth="3"/>
                      <path d="M12 2a10 10 0 0110 10" stroke="black" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                    Reserving Your Spot…
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    {isElite && <Gem size={18} strokeWidth={2.5} />}
                    {isSovereign && <Crown size={18} strokeWidth={2.5} />}
                    Secure My {plan.name} Membership
                    <span className="text-lg">→</span>
                  </span>
                )}
              </button>

              <p className="text-center text-[11px] text-gray-400 font-light">
                No online payment required now · Our concierge calls within 2 hours
              </p>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-300">or</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* WhatsApp alt */}
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hi WENS Force, I'm interested in the ${plan.name} Membership (${INR(plan.price)}/yr). Can you send me more details?`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-sm font-semibold border-2 border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366]/5 transition-all"
            >
              <svg viewBox="0 0 32 32" width="16" height="16" fill="#25D366">
                <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.668 4.799 1.836 6.793L2 30l7.393-1.812A13.918 13.918 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2z"/>
              </svg>
              Have questions first? Chat on WhatsApp
            </a>

            {/* Trust micro row */}
            <div className="flex items-center justify-center gap-4 mt-5 flex-wrap">
              {[
                { icon: '🔒', text: 'Secure & Private' },
                { icon: '✓', text: 'GST Registered' },
              ].map(({ icon, text }) => (
                <span key={text} className="flex items-center gap-1.5 text-[10px] text-gray-400">
                  <span>{icon}</span> {text}
                </span>
              ))}
            </div>
          </div>

          {/* Below-card reassurance */}
          <p className="text-center text-white/25 text-[11px] mt-4 font-light">
            By reserving, you agree to our{' '}
            <Link href="#" className="underline hover:text-white/50 transition-colors">Terms & Conditions</Link>
            {' '}and{' '}
            <Link href="#" className="underline hover:text-white/50 transition-colors">Privacy Policy</Link>.
          </p>
        </div>
      </div>

      {/* Mobile sticky CTA bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden border-t border-white/8 px-4 py-3" style={{ backgroundColor: 'rgba(11,30,63,0.97)', backdropFilter: 'blur(12px)' }}>
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[#C9A24B] font-bold text-sm">{INR(plan.price)}<span className="text-white/40 font-light text-xs">/yr</span></p>
            <p className="text-white/35 text-[10px]">{foundingSpots} of 100 founding spots confirmed</p>
          </div>
          <button
            onClick={() => document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center gap-1.5 py-2.5 px-5 rounded-xl font-bold text-black text-sm whitespace-nowrap shrink-0"
            style={{ background: 'linear-gradient(135deg,#C9A24B,#f0c940)', boxShadow: '0 4px 16px rgba(201,162,75,0.4)' }}
          >
            Reserve Spot →
          </button>
        </div>
      </div>
      <div className="h-16 lg:hidden" />
    </div>
  );
}
