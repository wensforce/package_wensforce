"use client";

import Link from "next/link";
import { Crown, ArrowLeft, Home, MessageCircle } from "lucide-react";

const WA_NUMBER = "917304607954";
const waMsg = encodeURIComponent(
  "Hi WENS Force, I seem to be lost on your website. Can you help?",
);
const waUrl = `https://wa.me/${WA_NUMBER}?text=${waMsg}`;

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0B1E3F] flex flex-col items-center justify-center px-6 py-20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none select-none">
        {/* Radial gold glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(201,162,75,0.08) 0%, transparent 70%)",
          }}
        />
        {/* Top-left accent */}
        <div
          className="absolute -top-24 -left-24 w-80 h-80 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #C9A24B, transparent)",
          }}
        />
        {/* Bottom-right accent */}
        <div
          className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #C9A24B, transparent)",
          }}
        />
        {/* Subtle grid lines */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#C9A24B 1px, transparent 1px), linear-gradient(90deg, #C9A24B 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      {/* Logo */}
      <Link
        href="/"
        className="flex items-center gap-2 mb-12 group animate-fade-in"
      >
        <img src="/Logo.png" alt="WENS Force" className="h-10 w-auto" />
      </Link>

      {/* 404 Display */}
      <div className="text-center relative z-10 animate-fade-in animation-delay-150">
        {/* Gold crown icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full border border-[#C9A24B]/40 flex items-center justify-center animate-glow-pulse">
            <Crown className="w-8 h-8 text-[#C9A24B]" />
          </div>
        </div>

        {/* 404 Number */}
        <div
          className="text-[120px] sm:text-[160px] font-bold leading-none tracking-tight select-none"
          style={{
            fontFamily:
              'var(--font-playfair), "Playfair Display", Georgia, serif',
            background:
              "linear-gradient(135deg, #8a6a1a 0%, #C9A24B 35%, #f5e6a3 55%, #C9A24B 75%, #8a6a1a 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          404
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center gap-4 my-6">
          <div className="h-px w-16 bg-linear-to-r from-transparent to-[#C9A24B]/60" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#C9A24B]" />
          <div className="h-px w-16 bg-linear-to-l from-transparent to-[#C9A24B]/60" />
        </div>

        {/* Heading */}
        <h1
          className="text-2xl sm:text-3xl font-semibold text-white mb-3"
          style={{
            fontFamily:
              'var(--font-playfair), "Playfair Display", Georgia, serif',
          }}
        >
          This Page Is Off The Map
        </h1>

        {/* Subtext */}
        <p className="text-[#A0AEC0] text-base sm:text-lg max-w-md mx-auto mb-10 leading-relaxed">
          The page you're looking for doesn't exist or may have been moved. Let
          us escort you back to safety.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* Primary — go home */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg font-semibold text-[#0B1E3F] transition-all duration-200 hover:brightness-110 active:scale-95 pulse-ring"
            style={{
              background:
                "linear-gradient(100deg, #b8882e 0%, #e8c56a 40%, #f5d98a 55%, #e0b84a 75%, #b8882e 100%)",
              backgroundSize: "200% 100%",
            }}
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>

          {/* Secondary — WhatsApp */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg font-semibold text-white border border-[#C9A24B]/40 hover:border-[#C9A24B] hover:bg-[#C9A24B]/10 transition-all duration-200 active:scale-95"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              width="28"
              height="28"
              fill="#25D366"
            >
              <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.668 4.799 1.836 6.793L2 30l7.393-1.812A13.918 13.918 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.6a11.543 11.543 0 01-5.88-1.604l-.42-.248-4.39 1.074 1.106-4.274-.272-.44A11.556 11.556 0 014.4 16C4.4 9.592 9.592 4.4 16 4.4S27.6 9.592 27.6 16 22.408 27.6 16 27.6zm6.327-8.627c-.348-.174-2.055-1.014-2.374-1.13-.318-.115-.55-.174-.78.174-.23.348-.894 1.13-1.097 1.362-.201.231-.404.26-.752.086-.348-.174-1.47-.542-2.799-1.727-1.034-.922-1.732-2.062-1.934-2.41-.202-.348-.022-.536.152-.71.156-.155.348-.405.522-.607.174-.202.23-.348.348-.58.115-.231.058-.434-.03-.607-.086-.174-.78-1.882-1.07-2.578-.282-.677-.568-.585-.78-.596-.201-.01-.434-.012-.665-.012-.23 0-.607.086-.926.434-.318.348-1.214 1.186-1.214 2.892 0 1.707 1.243 3.356 1.417 3.588.174.231 2.447 3.734 5.928 5.234.83.358 1.478.572 1.982.732.833.265 1.59.227 2.19.138.668-.1 2.055-.84 2.346-1.652.29-.81.29-1.505.202-1.652-.086-.145-.318-.231-.665-.405z" />
            </svg>
            Chat With Us
          </a>
        </div>

        {/* Back link */}
        <button
          onClick={() => typeof window !== "undefined" && window.history.back()}
          className="mt-8 inline-flex items-center gap-1.5 text-sm text-[#A0AEC0] hover:text-[#C9A24B] transition-colors duration-200 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Go back to previous page
        </button>
      </div>

      {/* Bottom tagline */}
      <p className="absolute bottom-8 text-xs text-[#4A5568] tracking-widest uppercase animate-fade-in animation-delay-500">
        WENS Force — India's Premier Lifestyle Protection Service
      </p>
    </div>
  );
}
