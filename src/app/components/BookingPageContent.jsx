'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { load } from '@cashfreepayments/cashfree-js';
import { Check, Shield, ArrowLeft, Gem, Crown } from 'lucide-react';

const INR = (n) => '₹' + Number(n).toLocaleString('en-IN');
const WA_NUMBER = '917304607954';
const INTL_SURCHARGE = 0.10;

const CITIES = [
  'Mumbai', 'Delhi NCR', 'Bangalore', 'Hyderabad', 'Chennai',
  'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Other',
];

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
    { text: 'Unarmed Bodyguard on every trip', bold: true },
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

const PLAN_IMAGES = {
  essential: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=900&q=85',
  executive: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=900&q=85',
  premium:   'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=85',
  elite:     'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=85',
  sovereign: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=900&q=85',
};

const PLAN_ACCENTS = {
  essential: { color: '#94a3b8', badge: null },
  executive: { color: '#60a5fa', badge: null },
  premium:   { color: '#9ca3af', badge: null },
  elite:     { color: '#C9A24B', badge: '◆ Best Value' },
  sovereign: { color: '#c0c0c0', badge: 'Ultra Exclusive' },
};

// ── Success State ────────────────────────────────────────────────────────────
function SuccessState({ plan, form }) {
  const waMsg = `Hi WENS Force! I just reserved the ${plan.name} Membership (${INR(plan.price)}/yr).\n\nName: ${form.name}\nMobile: ${form.phone}\nCity: ${form.city || 'Not specified'}\n\nPlease send the payment link to complete my booking.`;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0a0a' }}>
      {/* Atmospheric orb */}
      <div
        className="fixed top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[120px] pointer-events-none opacity-30"
        style={{ background: 'radial-gradient(ellipse, rgba(201,162,75,0.35) 0%, transparent 70%)' }}
      />

      <div className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20">
        <div className="max-w-lg w-full">

          {/* Check icon */}
          <div className="flex justify-center mb-8">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center shadow-2xl"
              style={{ background: 'linear-gradient(135deg, #C9A24B, #f0c940)', boxShadow: '0 0 0 8px rgba(201,162,75,0.12), 0 16px 48px rgba(201,162,75,0.4)' }}
            >
              <Check size={36} strokeWidth={3} className="text-black" />
            </div>
          </div>

          {/* Status label */}
          <p className="text-center text-[9px] font-bold tracking-[0.55em] uppercase mb-3" style={{ color: '#C9A24B' }}>
            Spot Reserved
          </p>

          {/* Heading */}
          <h1 className="font-serif-display text-center text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
            You&apos;re In,<br />{form.name.split(' ')[0]}!
          </h1>

          <p className="text-center text-white/50 text-base font-light leading-relaxed mb-2">
            Your{' '}
            <strong className="text-[#C9A24B] font-semibold">{plan.name} Membership</strong>
            {' '}founding spot is secured.
          </p>
          <p className="text-center text-white/40 text-sm font-light leading-relaxed mb-10">
            Our concierge will call{' '}
            <span className="text-white/65">{form.phone}</span>{' '}
            within 2 hours to complete payment.
          </p>

          {/* Timeline */}
          <div className="relative flex items-start justify-center gap-0 mb-10 px-4">
            {/* Connector lines */}
            <div className="absolute top-4 left-[calc(50%-60px)] right-[calc(50%-60px)] h-px" style={{ background: 'rgba(201,162,75,0.2)' }} />

            {[
              { label: 'Spot Reserved', sub: 'Right now', done: true },
              { label: 'Concierge Calls', sub: 'Within 2 hours', done: false },
              { label: 'Membership Active', sub: 'Within 24 hours', done: false },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center relative z-10 w-28">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-3 border-2"
                  style={{
                    backgroundColor: s.done ? '#C9A24B' : 'rgba(255,255,255,0.06)',
                    borderColor: s.done ? '#C9A24B' : 'rgba(255,255,255,0.12)',
                    color: s.done ? '#000' : 'rgba(255,255,255,0.3)',
                  }}
                >
                  {s.done ? <Check size={13} strokeWidth={3} /> : <span>{i + 1}</span>}
                </div>
                <p className={`text-[11px] font-semibold text-center leading-tight ${s.done ? 'text-[#C9A24B]' : 'text-white/35'}`}>
                  {s.label}
                </p>
                <p className="text-[10px] text-white/20 text-center mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* WhatsApp CTA */}
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waMsg)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl font-bold text-white text-sm mb-3 transition-all hover:opacity-90 hover:shadow-xl hover:-translate-y-0.5"
            style={{ backgroundColor: '#25D366', boxShadow: '0 8px 24px rgba(37,211,102,0.25)' }}
          >
            <svg viewBox="0 0 32 32" width="18" height="18" fill="white">
              <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.668 4.799 1.836 6.793L2 30l7.393-1.812A13.918 13.918 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2z" />
            </svg>
            Connect on WhatsApp Now
          </a>
          <p className="text-center text-white/25 text-xs mb-8">
            Can&apos;t wait for the call? Message us to fast-track your activation.
          </p>

          <Link href="/" className="flex items-center justify-center gap-1.5 text-white/20 text-xs hover:text-white/45 transition-colors">
            <ArrowLeft size={12} />
            Back to wensforce.com
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function BookingPageContent({ plan, anchorPrice, foundingSpots }) {
  const [form, setForm] = useState({ name: '', phone: '', city: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [payError, setPayError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('india');
  const [exchangeRate, setExchangeRate] = useState(95);
  const [rateLoading, setRateLoading] = useState(true);

  useEffect(() => {
    fetch('/api/exchange-rate')
      .then((r) => r.json())
      .then((d) => setExchangeRate(d.rate || 95))
      .catch(() => {})
      .finally(() => setRateLoading(false));
  }, []);

  const highlights = TIER_HIGHLIGHTS[plan.id] || [];
  const planAccent = PLAN_ACCENTS[plan.id] || PLAN_ACCENTS.essential;
  const isIndia = paymentMethod === 'india';

  const intlSurchargeINR = Math.ceil(plan.price * INTL_SURCHARGE);
  const intlTotalINR = plan.price + intlSurchargeINR;
  const intlTotalUSD = rateLoading ? null : (intlTotalINR / exchangeRate).toFixed(2);
  const spotsLeft = 100 - foundingSpots;
  const displayPrice = isIndia ? INR(plan.price) : (intlTotalUSD ? `$${intlTotalUSD}` : '…');

  const handleMethodChange = (method) => {
    setPaymentMethod(method);
    setForm((f) => ({ ...f, phone: '' }));
    setErrors({});
    setPayError('');
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim() || form.name.trim().length < 2) e.name = 'Please enter your full name';
    if (isIndia) {
      if (!form.phone.match(/^\d{10}$/)) e.phone = 'Enter a valid 10-digit mobile number';
    } else {
      const cleaned = form.phone.replace(/[\s\-()+]/g, '');
      if (cleaned.length < 7 || !/^\d+$/.test(cleaned)) e.phone = 'Enter a valid international number';
    }
    return e;
  };

  const handlePaymentSubmit = async (method) => {
    const formErrors = validate();
    if (Object.keys(formErrors).length) { setErrors(formErrors); return; }
    setErrors({});
    setPayError('');
    setLoading(true);

    try {
      if (method === 'india') {
        const res = await fetch('/api/cashfree/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: plan.price,
            customerName: form.name.trim(),
            customerPhone: form.phone,
            planId: plan.id,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.payment_session_id) {
          throw new Error(data.error || 'Could not initiate payment. Please try again.');
        }
        const cashfree = await load({
          mode: process.env.NEXT_PUBLIC_CASHFREE_ENV === 'production' ? 'production' : 'sandbox',
        });
        cashfree.checkout({ paymentSessionId: data.payment_session_id, redirectTarget: '_self' });
      } else {
        const res = await fetch('/api/paypal/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: intlTotalUSD,
            bookingId: `${plan.id}-${Date.now()}`,
            customerName: form.name.trim(),
            customerPhone: form.phone,
            planId: plan.id,
            exchangeRate,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.id) {
          throw new Error(data.error?.message || 'Could not initiate payment. Please try again.');
        }
        const approvalLink = data.links?.find((l) => l.rel === 'approve');
        if (!approvalLink) throw new Error('Payment approval link not found.');
        window.location.href = approvalLink.href;
      }
    } catch (err) {
      setPayError(err.message || 'Payment failed. Please try again.');
      setLoading(false);
    }
  };

  if (submitted) return <SuccessState plan={plan} form={form} />;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF6EC' }}>
      {/* Subtle dot-grid texture */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(201,162,75,0.18) 1px, transparent 0)',
          backgroundSize: '38px 38px',
        }}
      />

      {/* ── Sticky Header ── */}
      <header
        className="sticky top-0 z-40 border-b border-[#C9A24B]/15 backdrop-blur-md"
        style={{ backgroundColor: 'rgba(250,246,236,0.97)' }}
      >
        <div className="max-w-5xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <Link
            href={`/membership/${plan.id}`}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm font-light transition-colors"
          >
            <ArrowLeft size={14} />
            Back
          </Link>
          <span className="text-[#C9A24B] font-bold text-[10px] tracking-[0.35em] uppercase hidden sm:block">
            WENS Force · Secure Checkout
          </span>
          <div className="flex items-center gap-1.5 text-gray-400 text-[11px]">
            <Shield size={12} strokeWidth={1.5} style={{ color: 'rgba(201,162,75,0.6)' }} />
            Secure &amp; Encrypted
          </div>
        </div>
      </header>

      {/* ── Page Grid ── */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-10 lg:py-14 grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-10 items-start">

        {/* ── LEFT: Plan showcase ── */}
        <div className="lg:sticky lg:top-24">

          {/* Plan image card */}
          <div
            className="relative overflow-hidden rounded-2xl mb-8 group"
            style={{ height: 270, boxShadow: '0 24px 64px rgba(0,0,0,0.45)' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PLAN_IMAGES[plan.id]}
              alt={plan.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              style={{ filter: 'brightness(0.6) saturate(0.85)' }}
            />
            {/* Overlays */}
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.2) 55%, transparent 100%)' }}
            />
            <div
              className="absolute inset-0"
              style={{ background: `linear-gradient(135deg, rgba(${plan.id === 'elite' ? '201,162,75' : plan.id === 'sovereign' ? '192,192,192' : '0,0,0'},0.25) 0%, transparent 60%)` }}
            />

            {/* Top-right badge */}
            {planAccent.badge && (
              <div className="absolute top-4 right-4">
                <span
                  className="text-[9px] font-bold tracking-[0.3em] uppercase px-3 py-1.5 rounded-full backdrop-blur-sm"
                  style={{
                    background: 'rgba(201,162,75,0.2)',
                    color: '#C9A24B',
                    border: '1px solid rgba(201,162,75,0.3)',
                  }}
                >
                  {planAccent.badge}
                </span>
              </div>
            )}

            {/* Plan identity overlay */}
            <div className="absolute bottom-0 left-0 right-0 px-6 pb-6">
              <p
                className="text-[9px] font-bold tracking-[0.5em] uppercase mb-1"
                style={{ color: planAccent.color, opacity: 0.7 }}
              >
                Membership {String(plan.packageNo || '').padStart(2, '0')}
              </p>
              <h1 className="font-serif-display font-bold text-white leading-none mb-1.5"
                style={{ fontSize: 'clamp(32px,4vw,42px)', color: plan.id === 'elite' ? '#f0c940' : plan.id === 'sovereign' ? '#d8d8d8' : 'white' }}>
                {plan.name}
              </h1>
              <p className="text-white/40 text-xs font-light italic">{plan.tagline}</p>
            </div>
          </div>

          {/* Price block */}
          <div className="mb-7">
            {anchorPrice && (
              <span className="text-gray-400 text-sm line-through block mb-1">{INR(anchorPrice)}</span>
            )}
            <div className="flex items-end gap-3 flex-wrap">
              <span
                className="font-black tabular-nums leading-none"
                style={{ fontSize: 'clamp(30px,4vw,40px)', color: plan.id === 'elite' ? '#C9A24B' : '#0B1E3F' }}
              >
                {INR(plan.price)}
              </span>
              <span className="text-gray-400 text-sm font-light mb-1">/ year, all-inclusive</span>
              {anchorPrice && (
                <span
                  className="mb-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full"
                  style={{ background: 'rgba(201,162,75,0.18)', color: '#C9A24B' }}
                >
                  Save {INR(anchorPrice - plan.price)}
                </span>
              )}
            </div>
            <p className="text-[#C9A24B] text-xs mt-2 font-medium">
              ₹{plan.freePerksWorth.toLocaleString('en-IN')} in privileges included
            </p>
          </div>

          {/* Founding spots progress */}
          <div
            className="mb-8 p-4 rounded-xl border"
            style={{ backgroundColor: 'rgba(201,162,75,0.08)', borderColor: 'rgba(201,162,75,0.22)' }}
          >
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[#C9A24B] text-[11px] font-semibold tracking-wide">
                Founding 100 Programme
              </span>
              <span className="text-gray-500 text-[11px]">{foundingSpots} of 100 confirmed</span>
            </div>
            <div className="h-1.5 rounded-full bg-[#C9A24B]/15 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${foundingSpots}%`,
                  background: 'linear-gradient(90deg,#C9A24B,#f0c940)',
                  transition: 'width 1s ease',
                }}
              />
            </div>
            <p className="text-gray-500 text-[10px] mt-2 leading-relaxed">
              Charter members lock this price permanently — no annual increases, ever.
            </p>
          </div>

          {/* Highlights */}
          <p className="text-[9px] font-bold text-gray-400 tracking-[0.45em] uppercase mb-4">
            What&apos;s Included
          </p>
          <ul className="space-y-3">
            {highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-3">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: 'rgba(201,162,75,0.2)' }}
                >
                  <Check size={10} strokeWidth={3} style={{ color: '#C9A24B' }} />
                </div>
                <span className={`text-sm leading-snug ${h.bold ? 'text-gray-900 font-semibold' : 'text-gray-500 font-light'}`}>
                  {h.text}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* ── RIGHT: Form card ── */}
        <div>
          <div
            className="overflow-hidden rounded-2xl"
            style={{
              background: 'white',
              border: '1px solid rgba(201,162,75,0.18)',
              boxShadow: '0 8px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(201,162,75,0.1)',
            }}
          >
            {/* Gold accent line */}
            <div style={{ height: 3, background: 'linear-gradient(90deg,#C9A24B 0%,#f0c940 50%,#C9A24B 100%)' }} />

            {/* Card header */}
            <div
              className="px-7 py-5 border-b"
              style={{
                borderColor: 'rgba(201,162,75,0.1)',
                background: 'linear-gradient(135deg,rgba(254,253,248,1) 0%,rgba(255,255,255,1) 100%)',
              }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-[15px] font-bold text-gray-900 mb-0.5">Reserve Your Founding Spot</h2>
                  <p className="text-gray-400 text-xs">
                    <span className="font-semibold text-gray-600">{spotsLeft}</span> of 100 spots remaining
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-gray-900 tabular-nums">{displayPrice}</p>
                  <p className="text-gray-400 text-[10px] mt-0.5">per year</p>
                </div>
              </div>
            </div>

            {/* Form body */}
            <div className="p-6 sm:p-7">
              <form
                onSubmit={(e) => { e.preventDefault(); handlePaymentSubmit(paymentMethod); }}
                className="space-y-5"
              >
                {/* Payment region */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 mb-2.5 tracking-[0.22em] uppercase">
                    Payment Region
                  </label>
                  <div className="grid grid-cols-1 gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleMethodChange('india')}
                      className={`relative py-3.5 px-4 rounded-xl border-2 transition-all text-left ${
                        isIndia
                          ? 'border-[#C9A24B] bg-amber-50/70'
                          : 'border-gray-200 bg-white hover:border-amber-200'
                      }`}
                    >
                      {isIndia && (
                        <span
                          className="absolute top-3 right-3 w-4 h-4 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: '#C9A24B' }}
                        >
                          <Check size={9} strokeWidth={3.5} className="text-black" />
                        </span>
                      )}
                      <div className="flex items-center gap-3">
                        <span className="text-xl">🇮🇳</span>
                        <div>
                          <div className={`text-sm font-bold ${isIndia ? 'text-amber-800' : 'text-gray-700'}`}>
                            India
                          </div>
                          <div className={`text-xs font-semibold tabular-nums ${isIndia ? 'text-amber-600' : 'text-gray-400'}`}>
                            {INR(plan.price)} · Pay in INR
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 mb-2 tracking-[0.22em] uppercase">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Rajan Mehta"
                    className={`w-full px-4 py-3 rounded-xl border text-sm text-gray-800 outline-none transition-all placeholder:text-gray-300 ${
                      errors.name
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-200 focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/10 bg-white'
                    }`}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1.5">{errors.name}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 mb-2 tracking-[0.22em] uppercase">
                    {isIndia ? 'Mobile Number' : 'Contact Number'} <span className="text-red-400">*</span>
                  </label>
                  {isIndia ? (
                    <div
                      className={`flex items-center border rounded-xl overflow-hidden transition-all ${
                        errors.phone
                          ? 'border-red-300 bg-red-50'
                          : 'border-gray-200 focus-within:border-[#C9A24B] focus-within:ring-2 focus-within:ring-[#C9A24B]/10'
                      }`}
                    >
                      <span className="px-4 py-3 text-sm text-gray-400 font-medium border-r border-gray-200 bg-gray-50/80 shrink-0 tracking-wide">
                        +91
                      </span>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })
                        }
                        placeholder="98765 43210"
                        className="flex-1 px-4 py-3 text-sm text-gray-800 outline-none bg-transparent placeholder:text-gray-300"
                      />
                    </div>
                  ) : (
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="e.g. +1 555 123 4567"
                      className={`w-full px-4 py-3 rounded-xl border text-sm text-gray-800 outline-none transition-all placeholder:text-gray-300 ${
                        errors.phone
                          ? 'border-red-300 bg-red-50'
                          : 'border-gray-200 focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/10 bg-white'
                      }`}
                    />
                  )}
                  {errors.phone && <p className="text-red-500 text-xs mt-1.5">{errors.phone}</p>}
                </div>

                {/* City */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 mb-2 tracking-[0.22em] uppercase">
                    Your City
                  </label>
                  <select
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/10 text-sm text-gray-700 outline-none transition-all bg-white appearance-none"
                  >
                    <option value="">Select your city…</option>
                    {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Order summary */}
                <div
                  className="rounded-xl border p-4"
                  style={{ backgroundColor: '#fafaf8', borderColor: 'rgba(201,162,75,0.12)' }}
                >
                  <p className="text-[9px] font-bold text-gray-400 tracking-[0.3em] uppercase mb-3">
                    Order Summary
                  </p>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">{plan.name} Membership</span>
                      <span className="text-gray-700 text-sm font-semibold tabular-nums">{INR(plan.price)}</span>
                    </div>
                    {!isIndia && (
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-1.5 text-xs text-amber-700">
                          <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.5 rounded-full">+10%</span>
                          Intl. processing fee
                        </span>
                        <span className="text-amber-700 text-sm font-semibold tabular-nums">+{INR(intlSurchargeINR)}</span>
                      </div>
                    )}
                    {anchorPrice && (
                      <div className="flex justify-between items-center text-xs text-gray-400">
                        <span>Regular price</span>
                        <span className="line-through tabular-nums">{INR(anchorPrice)}</span>
                      </div>
                    )}
                  </div>

                  <div
                    className="flex justify-between items-end mt-3 pt-3 border-t"
                    style={{ borderColor: 'rgba(201,162,75,0.12)' }}
                  >
                    <span className="text-gray-900 text-sm font-bold">
                      Total {isIndia ? '(INR)' : '(USD)'}
                    </span>
                    <div className="text-right">
                      {isIndia ? (
                        <span className="text-gray-900 text-lg font-black tabular-nums">{INR(plan.price)}</span>
                      ) : (
                        <>
                          <span className="text-gray-900 text-lg font-black tabular-nums">
                            {rateLoading ? '…' : `$${intlTotalUSD}`}
                          </span>
                          {!rateLoading && (
                            <p className="text-gray-400 text-[10px] mt-0.5 tabular-nums">
                              ≈ {INR(intlTotalINR)} · live rate
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading || (!isIndia && rateLoading)}
                  className="w-full py-4 rounded-xl font-black text-sm tracking-wide transition-all hover:opacity-95 hover:-translate-y-0.5 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
                  style={{
                    background: 'linear-gradient(135deg,#C9A24B 0%,#f0c940 50%,#C9A24B 100%)',
                    color: '#000',
                    boxShadow: '0 6px 24px rgba(201,162,75,0.45)',
                  }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="rgba(0,0,0,0.2)" strokeWidth="3" />
                        <path d="M12 2a10 10 0 0110 10" stroke="#000" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                      Processing…
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      {plan.id === 'elite' && <Gem size={14} strokeWidth={2.5} />}
                      {plan.id === 'sovereign' && <Crown size={14} strokeWidth={2.5} />}
                      {isIndia
                        ? `Pay ${INR(plan.price)} · India`
                        : `Pay $${intlTotalUSD || '…'} · International`}
                    </span>
                  )}
                </button>

                {/* Security note */}
                <p className="text-center text-[11px] text-gray-400 flex items-center justify-center gap-1.5">
                  <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3 shrink-0">
                    <path d="M12 2L4 6v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6L12 2z" fill="#9ca3af" />
                  </svg>
                  256-bit SSL encrypted · PCI-DSS compliant
                </p>

                {/* Error */}
                {payError && (
                  <p className="text-center text-red-500 text-xs bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                    {payError}
                  </p>
                )}
              </form>
            </div>

            {/* WhatsApp divider */}
            <div className="px-6 sm:px-7 pb-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-[11px] text-gray-300 font-medium">or</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              <a
                href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hi WENS Force, I'm interested in the ${plan.name} Membership (${INR(plan.price)}/yr). Can you send me more details?`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-semibold border-2 text-[#25D366] hover:bg-[#25D366]/5 transition-all"
                style={{ borderColor: 'rgba(37,211,102,0.3)' }}
              >
                <svg viewBox="0 0 32 32" width="16" height="16" fill="#25D366">
                  <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.668 4.799 1.836 6.793L2 30l7.393-1.812A13.918 13.918 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2z" />
                </svg>
                Have questions? Chat on WhatsApp
              </a>

              {/* Trust badges */}
              <div className="flex items-center justify-center gap-6 mt-5 flex-wrap">
                {[
                  { icon: '🔒', text: 'Secure & Private' },
                  { icon: '✓', text: 'GST Registered' },
                  { icon: '★', text: 'All-Inclusive' },
                ].map(({ icon, text }) => (
                  <span key={text} className="flex items-center gap-1.5 text-[10px] text-gray-400">
                    <span>{icon}</span> {text}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Below-card note */}
          <p className="text-center text-gray-400 text-[11px] mt-4 font-light leading-relaxed px-4">
            By reserving, you agree to our{' '}
            <Link href="#" className="underline hover:text-gray-600 transition-colors">Terms &amp; Conditions</Link>
            {' '}and{' '}
            <Link href="#" className="underline hover:text-gray-600 transition-colors">Privacy Policy</Link>.
          </p>
        </div>
      </div>

      {/* ── Mobile sticky bar ── */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 lg:hidden border-t border-white/8 px-4 py-3"
        style={{ backgroundColor: 'rgba(10,10,10,0.97)', backdropFilter: 'blur(12px)' }}
      >
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[#C9A24B] font-bold text-sm tabular-nums">
              {displayPrice}
              <span className="text-white/35 font-light text-xs"> /yr</span>
            </p>
            <p className="text-white/30 text-[10px]">{foundingSpots} of 100 founding spots confirmed</p>
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
      <div className="h-20 lg:hidden" />
    </div>
  );
}
