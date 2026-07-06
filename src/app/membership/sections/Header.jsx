import Link from 'next/link';
import { ArrowLeft, Crown } from 'lucide-react';

export default function Header({ planName, planId, waUrl }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b bg-black border-white/8">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-full grid grid-cols-[auto_1fr_auto] items-center gap-2">
        {/* Left: Back link */}
        <Link
          href="/"
          className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors shrink-0"
        >
          <ArrowLeft size={15} />
          <span className="hidden sm:inline">All Plans</span>
        </Link>

        {/* Center: Brand / plan name — takes only the leftover space, never overlaps */}
        <div className="flex items-center justify-center gap-1.5 text-white/50 min-w-0 overflow-hidden">
          <span className="text-[#C9A24B] font-bold tracking-widest text-[9px] sm:text-[10px] uppercase shrink-0 whitespace-nowrap">
            WENS Force
          </span>
          {planName && (
            <>
              <span className="shrink-0 text-[10px] sm:text-xs">/</span>
              <span className="truncate text-[10px] sm:text-xs">
                {planName}
              </span>
            </>
          )}
        </div>

        {/* Right: Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 justify-self-end">
          {planId && (
            <Link
              href={`/booking/${planId}`}
              className="flex items-center gap-1.5 py-2 px-3 sm:px-5 rounded-full font-bold text-black text-xs whitespace-nowrap transition-all hover:opacity-90 hover:shadow-lg"
              style={{
                background: 'linear-gradient(135deg,#C9A24B,#f0c940)',
                boxShadow: '0 4px 16px rgba(201,162,75,0.4)',
              }}
            >
              <Crown size={12} strokeWidth={2.5} className="hidden sm:block" />
              Buy Now
            </Link>
          )}

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-2 px-2.5 sm:px-3.5 rounded-full font-semibold text-white/70 text-xs border border-white/15 hover:border-white/30 hover:text-white transition-all shrink-0"
          >
            <svg viewBox="0 0 32 32" width="12" height="12" fill="currentColor">
              <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.668 4.799 1.836 6.793L2 30l7.393-1.812A13.918 13.918 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2z" />
            </svg>
            <span className="hidden sm:inline">Enquire</span>
          </a>
        </div>
      </div>
    </header>
  );
}