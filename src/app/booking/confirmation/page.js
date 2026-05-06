'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Check, XCircle, Loader } from 'lucide-react';

const WA_NUMBER = '917304607954';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  // PayPal sends 'token' (PayPal's unique order ID), Cashfree sends 'order_id'
  const orderId = searchParams.get('order_id') || searchParams.get('token');
  const paymentMethod = searchParams.get('payment_method') || 'cashfree';
  const plan = searchParams.get('plan') || '';

  const [status, setStatus] = useState('loading'); // loading | success | failed

  useEffect(() => {
    if (!orderId) { setStatus('failed'); return; }

    async function verify() {
      try {
        if (paymentMethod === 'paypal') {
          // Capture PayPal payment
          const res = await fetch('/api/paypal/capture-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: encodeURIComponent(orderId) }),
          });
          const data = await res.json();
          setStatus(data.paid ? 'success' : 'failed');
        } else {
          // Verify Cashfree payment
          const res = await fetch(`/api/cashfree/verify-order?order_id=${encodeURIComponent(orderId)}`);
          const data = await res.json();
          setStatus(data.paid ? 'success' : 'failed');
        }
      } catch {
        setStatus('failed');
      }
    }
    verify();
  }, [orderId, paymentMethod]);

  const planLabel = plan ? plan.charAt(0).toUpperCase() + plan.slice(1) : 'Membership';
  const waMsg = `Hi WENS Force! I just completed payment for the ${planLabel} Membership.\n\nOrder ID: ${orderId}\n\nPlease activate my account.`;

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: '#0B1E3F' }}>
        <Loader size={36} className="text-[#C9A24B] animate-spin mb-4" />
        <p className="text-white/50 text-sm">Verifying your payment…</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16" style={{ backgroundColor: '#0B1E3F' }}>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ backgroundColor: 'rgba(201,162,75,0.12)' }} />

        <div className="relative z-10 max-w-md w-full text-center">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #C9A24B, #f0c940)' }}
          >
            <Check size={36} strokeWidth={3} className="text-black" />
          </div>

          <p className="text-[#C9A24B] text-[10px] tracking-[0.4em] uppercase font-semibold mb-2">Payment Confirmed</p>
          <h1 className="font-serif-display text-3xl sm:text-4xl font-bold text-white mb-3">
            Welcome to WENS Force!
          </h1>
          <p className="text-white/55 text-base font-light leading-relaxed mb-3">
            Your <strong className="text-[#C9A24B]">{planLabel} Membership</strong> is now active.
            Our concierge will reach out within 2 hours to set up your account.
          </p>
          <p className="text-white/30 text-xs mb-8">Order ID: {orderId}</p>

          {/* Timeline */}
          <div className="flex items-start justify-center gap-0 mb-10">
            {[
              { step: '1', label: 'Payment Done', sub: 'Confirmed', done: true },
              { step: '2', label: 'Concierge Calls', sub: 'Within 2 hours', done: false },
              { step: '3', label: 'Account Active', sub: 'Within 24 hours', done: false },
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

          <a
            href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waMsg)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl font-bold text-white text-sm mb-3 transition-all hover:opacity-90"
            style={{ backgroundColor: '#25D366' }}
          >
            <svg viewBox="0 0 32 32" width="18" height="18" fill="white">
              <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.668 4.799 1.836 6.793L2 30l7.393-1.812A13.918 13.918 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2z"/>
            </svg>
            Connect on WhatsApp
          </a>

          <Link href="/" className="mt-6 inline-block text-white/25 text-xs hover:text-white/50 transition-colors">
            ← Back to wensforce.com
          </Link>
        </div>
      </div>
    );
  }

  // failed
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16" style={{ backgroundColor: '#0B1E3F' }}>
      <div className="relative z-10 max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-red-500/20 border border-red-500/30">
          <XCircle size={36} className="text-red-400" />
        </div>

        <h1 className="font-serif-display text-3xl font-bold text-white mb-3">Payment Unsuccessful</h1>
        <p className="text-white/50 text-base font-light leading-relaxed mb-8">
          Your payment could not be completed. No amount has been charged. Please try again or contact us on WhatsApp.
        </p>
        {orderId && <p className="text-white/20 text-xs mb-6">Order ID: {orderId}</p>}

        <div className="space-y-3">
          <Link
            href={`/booking/${plan}`}
            className="flex items-center justify-center w-full py-4 rounded-2xl font-bold text-black text-sm"
            style={{ background: 'linear-gradient(135deg, #C9A24B, #f0c940)' }}
          >
            Try Again
          </Link>
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hi WENS Force, I faced an issue with my payment for the ${planLabel} Membership. Order ID: ${orderId}. Can you help?`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-semibold border-2 border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366]/5 transition-all text-sm"
          >
            Get Help on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0B1E3F' }}>
        <Loader size={36} className="text-[#C9A24B] animate-spin" />
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}
