'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { load } from '@cashfreepayments/cashfree-js';

const INR = (n) => '₹' + Number(n).toLocaleString('en-IN');
const WA_NUMBER = '917304607954';
const INTL_SURCHARGE = 0.10;

const CITIES = [
  'Mumbai', 'Delhi NCR', 'Bangalore', 'Hyderabad', 'Chennai',
  'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Other',
];

const TIER_LABELS = {
  essential: 'E', executive: 'EX', premium: 'P', elite: 'EL', sovereign: 'S',
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

function SuccessState({ plan, form }) {
  const waMsg = `Hi WENS Force! I just reserved the ${plan.name} Membership (${INR(plan.price)}/yr).\n\nName: ${form.name}\nMobile: ${form.phone}\nCity: ${form.city || 'Not specified'}\n\nPlease send the payment link to complete my booking.`;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16" style={{ backgroundColor: '#0B1E3F' }}>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ backgroundColor: 'rgba(201,162,75,0.12)' }} />
      <div className="relative z-10 max-w-md w-full text-center">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"
          style={{ background: 'linear-gradient(135deg, #C9A24B, #f0c940)' }}
        >
          <span className="text-black font-black text-3xl">✓</span>
        </div>
        <p className="text-[#C9A24B] text-[10px] tracking-[0.4em] uppercase font-semibold mb-2">Booking Reserved</p>
        <h1 className="font-serif-display text-3xl sm:text-4xl font-bold text-white mb-3">
          You&apos;re In, {form.name.split(' ')[0]}!
        </h1>
        <p className="text-white/55 text-base font-light leading-relaxed mb-8">
          Your <strong className="text-[#C9A24B]">{plan.name} Membership</strong> spot is reserved.<br />
          Our concierge will reach you at <strong className="text-white/80">{form.phone}</strong> within 2 hours to complete payment and activate your account.
        </p>
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
                  {s.done ? '✓' : s.step}
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
  const [payError, setPayError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('india'); // 'india' or 'international'
  const [exchangeRate, setExchangeRate] = useState(95);
  const [rateLoading, setRateLoading] = useState(true);

  useEffect(() => {
    fetch('/api/exchange-rate')
      .then((r) => r.json())
      .then((d) => setExchangeRate(d.rate || 95))
      .catch(() => {})
      .finally(() => setRateLoading(false));
  }, []);

  const TierLabel = TIER_LABELS[plan.id] || 'W';
  const highlights = TIER_HIGHLIGHTS[plan.id] || [];
  const isIndia = paymentMethod === 'india';

  const intlSurchargeINR = Math.ceil(plan.price * INTL_SURCHARGE);
  const intlTotalINR = plan.price + intlSurchargeINR;
  const intlTotalUSD = rateLoading ? null : (intlTotalINR / exchangeRate).toFixed(2);

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

  const spotsLeft = 100 - foundingSpots;
  const displayPrice = isIndia ? INR(plan.price) : (intlTotalUSD ? `$${intlTotalUSD}` : '…');

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
            ← Back
          </Link>
          <span className="text-[#C9A24B] font-bold text-[11px] tracking-[0.3em] uppercase hidden sm:block">
            WENS Force · Secure Checkout
          </span>
          <div className="flex items-center gap-1.5 text-white/30 text-[11px]">
            <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5">
              <path d="M12 2L4 6v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6L12 2z" fill="rgba(201,162,75,0.5)" stroke="none"/>
            </svg>
            Secure &amp; Encrypted
          </div>
        </div>
      </header>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 items-start">

        {/* ── LEFT: Plan Showcase ── */}
        <div className="lg:sticky lg:top-24">
          <p className="text-[#C9A24B] text-[10px] tracking-[0.45em] uppercase font-semibold mb-4">
            You&apos;re Securing
          </p>
          <div className="flex items-center gap-4 mb-2">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border"
              style={{ backgroundColor: 'rgba(201,162,75,0.15)', borderColor: 'rgba(201,162,75,0.25)' }}
            >
              <span className="text-[#C9A24B] font-black text-lg tracking-wider">{TierLabel}</span>
            </div>
            <div>
              <h1 className="font-serif-display text-4xl sm:text-5xl font-bold text-[#f0c940] leading-none tracking-wide">
                {plan.name}
              </h1>
              <p className="text-white/40 text-sm font-light mt-1">Founding Member · Charter Pricing</p>
            </div>
          </div>

          <div className="mt-6 mb-6">
            {anchorPrice && (
              <span className="text-white/30 text-sm line-through mr-3">{INR(anchorPrice)}</span>
            )}
            <span className="text-4xl font-black text-white">{INR(plan.price)}</span>
            <span className="text-white/40 text-sm font-light ml-2">/ year, all-inclusive</span>
            <p className="text-[#C9A24B]/70 text-xs mt-1.5">
              ₹{plan.freePerksWorth.toLocaleString('en-IN')} in privileges included
            </p>
          </div>

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

          <p className="text-white/25 text-[10px] tracking-[0.3em] uppercase font-semibold mb-4">What You Get</p>
          <ul className="space-y-3 mb-8">
            {highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-3">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-black text-[#C9A24B]"
                  style={{ backgroundColor: 'rgba(201,162,75,0.2)' }}
                >
                  ✓
                </div>
                <span className={`text-sm leading-snug ${h.bold ? 'text-white font-semibold' : 'text-white/60 font-light'}`}>
                  {h.text}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* ── RIGHT: Booking Form ── */}
        <div>
          <div
            className="rounded-2xl overflow-hidden border"
            style={{
              backgroundColor: '#fff',
              borderColor: 'rgba(201,162,75,0.25)',
              boxShadow: '0 8px 40px rgba(0,0,0,0.25), 0 0 0 1px rgba(201,162,75,0.08)',
            }}
          >
            {/* Card header */}
            <div
              className="px-7 py-5 flex items-center justify-between border-b"
              style={{ borderColor: 'rgba(201,162,75,0.12)', background: 'linear-gradient(135deg, rgba(201,162,75,0.07) 0%, rgba(255,255,255,0) 100%)' }}
            >
              <div>
                <h2 className="text-base font-bold text-gray-900">Reserve Your Spot</h2>
                <p className="text-gray-400 text-xs mt-0.5">
                  <span className="font-semibold text-gray-600">{spotsLeft}</span> founding spots remaining
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-black text-gray-900 tabular-nums">{displayPrice}</p>
                <p className="text-gray-400 text-[10px] mt-0.5">per year</p>
              </div>
            </div>

            <div className="p-6 sm:p-7">
              <form onSubmit={(e) => { e.preventDefault(); handlePaymentSubmit(paymentMethod); }} className="space-y-5">

                {/* Payment region */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 mb-2.5 tracking-[0.2em] uppercase">
                    Payment Region
                  </label>
                  <div className="grid grid-cols-1 gap-2.5">
                    {/* India */}
                    <button
                      type="button"
                      onClick={() => handleMethodChange('india')}
                      className={`relative py-4 px-3.5 rounded-xl border-2 transition-all text-left ${
                        isIndia
                          ? 'border-[#C9A24B] bg-amber-50'
                          : 'border-gray-200 bg-white hover:border-amber-200'
                      }`}
                    >
                      {isIndia && (
                        <span
                          className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black text-white"
                          style={{ backgroundColor: '#C9A24B' }}
                        >
                          ✓
                        </span>
                      )}
                      <div className="text-xl mb-2">🇮🇳</div>
                      <div className={`text-sm font-bold leading-tight ${isIndia ? 'text-amber-800' : 'text-gray-700'}`}>
                        India
                      </div>
                      <div className={`text-xs mt-1 font-semibold tabular-nums ${isIndia ? 'text-amber-600' : 'text-gray-400'}`}>
                        {INR(plan.price)}
                      </div>
                      <div className={`text-[10px] mt-0.5 ${isIndia ? 'text-amber-500' : 'text-gray-300'}`}>
                        Pay in INR
                      </div>
                    </button>

                    {/* International */}
                    {/* <button
                      type="button"
                      onClick={() => handleMethodChange('international')}
                      className={`relative py-4 px-3.5 rounded-xl border-2 transition-all text-left ${
                        !isIndia
                          ? 'border-[#C9A24B] bg-amber-50'
                          : 'border-gray-200 bg-white hover:border-amber-200'
                      }`}
                    >
                      {!isIndia && (
                        <span
                          className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black text-white"
                          style={{ backgroundColor: '#C9A24B' }}
                        >
                          ✓
                        </span>
                      )}
                      <div className="text-xl mb-2">🌍</div>
                      <div className={`text-sm font-bold leading-tight ${!isIndia ? 'text-amber-800' : 'text-gray-700'}`}>
                        International
                      </div>
                      <div className={`text-xs mt-1 font-semibold tabular-nums ${!isIndia ? 'text-amber-600' : 'text-gray-400'}`}>
                        {rateLoading ? '…' : `$${intlTotalUSD}`}
                      </div>
                      <div className={`text-[10px] mt-0.5 ${!isIndia ? 'text-amber-500' : 'text-gray-300'}`}>
                        Pay in USD
                      </div>
                    </button> */}
                  </div>

                  {!isIndia && (
                    <div className="mt-2.5 flex items-center gap-2 text-[11px] text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                      <span className="shrink-0 bg-amber-200 text-amber-800 text-[9px] font-bold px-1.5 py-0.5 rounded-full">+10%</span>
                      <span>International processing fee applied to cover currency conversion costs.</span>
                    </div>
                  )}
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 mb-2 tracking-[0.2em] uppercase">
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
                  <label className="block text-[10px] font-bold text-gray-400 mb-2 tracking-[0.2em] uppercase">
                    {isIndia ? 'Mobile Number' : 'Contact Number'} <span className="text-red-400">*</span>
                  </label>
                  {isIndia ? (
                    <div className={`flex items-center border rounded-xl overflow-hidden transition-all ${
                      errors.phone
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-200 focus-within:border-[#C9A24B] focus-within:ring-2 focus-within:ring-[#C9A24B]/10'
                    }`}>
                      <span className="px-3.5 py-3 text-sm text-gray-400 font-medium border-r border-gray-200 bg-gray-50 shrink-0">+91</span>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                        placeholder="98765 43210"
                        className="flex-1 px-3.5 py-3 text-sm text-gray-800 outline-none bg-transparent placeholder:text-gray-300"
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
                  <label className="block text-[10px] font-bold text-gray-400 mb-2 tracking-[0.2em] uppercase">
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

                {/* Order Summary */}
                <div className="rounded-xl border p-4" style={{ backgroundColor: '#fafaf8', borderColor: 'rgba(201,162,75,0.15)' }}>
                  <p className="text-[9px] font-bold text-gray-400 tracking-[0.25em] uppercase mb-3">Order Summary</p>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">{plan.name} Membership</span>
                      <span className="text-gray-700 text-sm font-medium tabular-nums">{INR(plan.price)}</span>
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

                  <div className="flex justify-between items-end mt-3 pt-3 border-t border-gray-200">
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

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading || (!isIndia && rateLoading)}
                  className="w-full py-4 rounded-xl font-bold text-sm tracking-wide transition-all hover:opacity-95 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: 'linear-gradient(135deg, #C9A24B 0%, #f0c940 100%)',
                    color: '#000',
                    boxShadow: '0 4px 20px rgba(201,162,75,0.45)',
                  }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="rgba(0,0,0,0.2)" strokeWidth="3"/>
                        <path d="M12 2a10 10 0 0110 10" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
                      </svg>
                      Processing…
                    </span>
                  ) : (
                    <span>
                      {isIndia
                        ? `Pay ${INR(plan.price)} · India`
                        : `Pay $${intlTotalUSD || '…'} · International`}
                    </span>
                  )}
                </button>

                <p className="text-center text-[11px] text-gray-400 flex items-center justify-center gap-1.5">
                  <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3 shrink-0">
                    <path d="M12 2L4 6v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6L12 2z" fill="#9ca3af" stroke="none"/>
                  </svg>
                  256-bit SSL encrypted · PCI-DSS compliant
                </p>

                {payError && (
                  <p className="text-center text-red-500 text-xs bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                    {payError}
                  </p>
                )}
              </form>
            </div>

            {/* Divider + WhatsApp */}
            <div className="px-6 sm:px-7 pb-6 sm:pb-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-[11px] text-gray-300 font-medium">or</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              <a
                href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hi WENS Force, I'm interested in the ${plan.name} Membership (${INR(plan.price)}/yr). Can you send me more details?`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-semibold border-2 border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366]/5 transition-all"
              >
                <svg viewBox="0 0 32 32" width="16" height="16" fill="#25D366">
                  <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.668 4.799 1.836 6.793L2 30l7.393-1.812A13.918 13.918 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2z"/>
                </svg>
                Have questions? Chat on WhatsApp
              </a>

              <div className="flex items-center justify-center gap-5 mt-5 flex-wrap">
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
            <p className="text-[#C9A24B] font-bold text-sm tabular-nums">
              {displayPrice}
              <span className="text-white/40 font-light text-xs">/yr</span>
            </p>
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
