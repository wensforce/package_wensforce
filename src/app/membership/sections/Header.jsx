import Link from "next/link";
import { ArrowLeft, Crown } from "lucide-react";

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
                background: "linear-gradient(135deg,#C9A24B,#f0c940)",
                boxShadow: "0 4px 16px rgba(201,162,75,0.4)",
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              width="20"
              height="20"
              fill="#25D366"
            >
              <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.668 4.799 1.836 6.793L2 30l7.393-1.812A13.918 13.918 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.6a11.543 11.543 0 01-5.88-1.604l-.42-.248-4.39 1.074 1.106-4.274-.272-.44A11.556 11.556 0 014.4 16C4.4 9.592 9.592 4.4 16 4.4S27.6 9.592 27.6 16 22.408 27.6 16 27.6zm6.327-8.627c-.348-.174-2.055-1.014-2.374-1.13-.318-.115-.55-.174-.78.174-.23.348-.894 1.13-1.097 1.362-.201.231-.404.26-.752.086-.348-.174-1.47-.542-2.799-1.727-1.034-.922-1.732-2.062-1.934-2.41-.202-.348-.022-.536.152-.71.156-.155.348-.405.522-.607.174-.202.23-.348.348-.58.115-.231.058-.434-.03-.607-.086-.174-.78-1.882-1.07-2.578-.282-.677-.568-.585-.78-.596-.201-.01-.434-.012-.665-.012-.23 0-.607.086-.926.434-.318.348-1.214 1.186-1.214 2.892 0 1.707 1.243 3.356 1.417 3.588.174.231 2.447 3.734 5.928 5.234.83.358 1.478.572 1.982.732.833.265 1.59.227 2.19.138.668-.1 2.055-.84 2.346-1.652.29-.81.29-1.505.202-1.652-.086-.145-.318-.231-.665-.405z" />
            </svg>
            <span className="hidden sm:inline">Enquire</span>
          </a>
        </div>
      </div>
    </header>
  );
}
