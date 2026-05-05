'use client';

import { useState, useEffect, useCallback } from 'react';

const WA_NUMBER = '917304607954';

export default function ExitIntentPopup() {
  const [visible, setVisible] = useState(false);
  const [phone, setPhone] = useState('');
  const [sent, setSent] = useState(false);
  const [shown, setShown] = useState(false);

  const show = useCallback(() => {
    if (shown) return;
    setShown(true);
    setVisible(true);
  }, [shown]);

  useEffect(() => {
    // Desktop: mouse leaves toward top of viewport
    const handleMouseLeave = (e) => {
      if (e.clientY <= 10) show();
    };

    // Mobile: scrolled 70%+ then scrolls back up
    let lastScrollY = 0;
    const handleScroll = () => {
      const progress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      if (progress >= 0.7 && window.scrollY < lastScrollY) show();
      lastScrollY = window.scrollY;
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [show]);

  const handleSend = (e) => {
    e.preventDefault();
    const msg = `Hi WENS Force, please send me the Free HNI Travel Safety Index 2026. My number: +91${phone}`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
    setSent(true);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center px-4">
      {/* Scrim */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setVisible(false)}
      />

      {/* Modal */}
      <div
        className="relative bg-white rounded-3xl p-8 sm:p-10 max-w-md w-full shadow-2xl animate-scale-in"
        style={{ boxShadow: '0 24px 64px rgba(11,30,63,0.25)' }}
      >
        <button
          onClick={() => setVisible(false)}
          className="absolute top-5 right-5 text-gray-300 hover:text-gray-500 text-xl leading-none"
          aria-label="Close"
        >
          ✕
        </button>

        {!sent ? (
          <>
            <p className="text-[#C9A24B] text-[10px] tracking-[0.4em] uppercase font-semibold mb-3">
              Wait — before you go.
            </p>
            <h3 className="font-serif-display text-2xl font-bold text-[#0B1E3F] mb-2 leading-snug">
              Get our Free HNI Travel Safety Index 2026
            </h3>
            <p className="text-gray-500 text-sm font-light leading-relaxed mb-6">
              A 24-page report on India&apos;s 12 metros for premium travellers — security risks, VIP access points, concierge benchmarks.
            </p>

            <form onSubmit={handleSend} className="space-y-3">
              <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden focus-within:border-[#C9A24B] transition-colors">
                <span className="px-3 text-sm text-gray-500 font-medium border-r border-gray-200 h-full flex items-center py-3.5">+91</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/, '').slice(0, 10))}
                  placeholder="98765 43210"
                  required
                  pattern="\d{10}"
                  className="flex-1 px-3 py-3.5 text-sm outline-none text-gray-800"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90"
                style={{ backgroundColor: '#25D366' }}
              >
                Send to my WhatsApp
              </button>
            </form>

            <button
              onClick={() => setVisible(false)}
              className="mt-4 w-full text-center text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              No thanks
            </button>
          </>
        ) : (
          <div className="text-center py-4">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: '#25D366' }}
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
                <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="font-serif-display text-xl font-bold text-[#0B1E3F] mb-2">Report on its way!</h3>
            <p className="text-gray-500 text-sm font-light">Check your WhatsApp — our concierge will send the PDF shortly.</p>
            <button onClick={() => setVisible(false)} className="mt-5 text-[#C9A24B] text-sm font-semibold hover:underline">
              Back to site
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
