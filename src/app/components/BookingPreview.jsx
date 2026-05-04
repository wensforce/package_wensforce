'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Crown, Gem, Calendar, Zap } from 'lucide-react';

export default function BookingPreview() {
  const [timeLeft, setTimeLeft] = useState({
    days: 28,
    hours: 0,
    minutes: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const minutes = prev.minutes - 1;
        if (minutes < 0) {
          const hours = prev.hours - 1;
          if (hours < 0) {
            const days = prev.days - 1;
            if (days < 0) {
              return { days: 28, hours: 0, minutes: 0 }; // Reset
            }
            return { days, hours: 23, minutes: 59 };
          }
          return { ...prev, hours, minutes: 59 };
        }
        return { ...prev, minutes };
      });
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-white to-[#F1F3F5]">
      <div className="max-w-5xl mx-auto">
        {/* Main CTA Card */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-white/10 shadow-2xl">
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#BF9F00]/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-32 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-700" />
          </div>

          <div className="relative p-12 md:p-16">
            {/* Floating badges */}
            <div className="absolute top-6 right-6 flex gap-2">
              <div className="px-3 py-1.5 bg-red-500/20 border border-red-500/30 rounded-full text-red-400 text-xs font-semibold">
                ⚡ Limited Time
              </div>
            </div>

            {/* Content */}
            <div className="max-w-3xl">
              <p className="text-[#BF9F00] text-xs tracking-[0.3em] uppercase font-semibold mb-4">
                Special Offer
              </p>

              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
                Lock in Today&apos;s Pricing
                <span className="text-[#e8c900]"> Before June 1st</span>
              </h2>

              <p className="text-lg text-gray-300 font-light mb-10 max-w-2xl">
                Prices increase on June 1, 2026. Join 2,400+ members who already experience the prestige and security of WENS Force luxury travel.
              </p>

              {/* Countdown Timer */}
              <div className="flex gap-4 mb-12 flex-wrap">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-[#BF9F00] mb-1 font-mono">
                    {String(timeLeft.days).padStart(2, '0')}
                  </div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide">Days</div>
                </div>
                <span className="text-3xl text-gray-600 font-light">:</span>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-[#BF9F00] mb-1 font-mono">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide">Hours</div>
                </div>
                <span className="text-3xl text-gray-600 font-light">:</span>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-[#BF9F00] mb-1 font-mono">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide">Minutes</div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                {[
                  { Icon: Crown, label: '2,400+', value: 'Active Members' },
                  { Icon: Gem, label: '98.7%', value: 'Satisfaction' },
                  { Icon: Zap, label: '10 min', value: 'Avg Dispatch' },
                  { Icon: Calendar, label: '15 days', value: 'Money-back' },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <stat.Icon size={20} className="text-[#BF9F00] mx-auto mb-2" strokeWidth={1.5} />
                    <div className="text-lg md:text-xl font-bold text-white">{stat.label}</div>
                    <div className="text-xs text-gray-400">{stat.value}</div>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/membership/elite"
                  className="inline-flex items-center justify-center gap-2 bg-[#BF9F00] text-black font-semibold py-4 px-8 rounded-xl hover:bg-[#a88a00] transition-all text-base group"
                >
                  <Gem size={18} strokeWidth={2} className="group-hover:scale-110 transition-transform" />
                  Claim Elite Membership
                </Link>
                <a
                  href="#plans"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur border border-white/20 text-white font-semibold py-4 px-8 rounded-xl hover:bg-white/15 transition-all text-base"
                >
                  <span>View All Plans</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              </div>

              {/* Trust signals */}
              <p className="text-sm text-gray-400 mt-8">
                ✓ Secure payment &nbsp; • &nbsp; ✓ No hidden charges &nbsp; • &nbsp; ✓ 15-day guarantee
              </p>
            </div>
          </div>

          {/* Right side feature list (desktop only) */}
          <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-black/80 to-transparent p-12 border-l border-white/10">
            <p className="text-[#BF9F00] text-xs tracking-[0.2em] uppercase font-semibold mb-6">
              What's Included
            </p>
            <ul className="space-y-4">
              {[
                'Unlimited luxury vehicle bookings',
                'Armed/unarmed security available',
                'Dedicated relationship manager',
                'VIP darshan access',
                'Airport lounge privileges',
                'Priority 24/7 concierge',
                '15-day money-back guarantee',
                'Family-transferable access',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-300 font-light">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#BF9F00] shrink-0 mt-1.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Urgency Message */}
        <div className="mt-8 p-6 bg-amber-50 border border-amber-200 rounded-2xl text-center">
          <p className="text-amber-900 font-light text-base">
            <span className="font-semibold">⏰ Time-sensitive offer:</span> Current pricing valid until June 1, 2026.
            After that, all memberships will increase by 15-25%. Don't miss out.
          </p>
        </div>
      </div>
    </section>
  );
}
