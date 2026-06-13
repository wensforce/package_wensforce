'use client';

import Link from 'next/link';
import { Crown, ArrowLeft, Home, MessageCircle } from 'lucide-react';

const WA_NUMBER = '917304607954';
const waMsg = encodeURIComponent("Hi WENS Force, I seem to be lost on your website. Can you help?");
const waUrl = `https://wa.me/${WA_NUMBER}?text=${waMsg}`;

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0B1E3F] flex flex-col items-center justify-center px-6 py-20 relative overflow-hidden">

      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none select-none">
        {/* Radial gold glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(201,162,75,0.08) 0%, transparent 70%)' }} />
        {/* Top-left accent */}
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #C9A24B, transparent)' }} />
        {/* Bottom-right accent */}
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #C9A24B, transparent)' }} />
        {/* Subtle grid lines */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(#C9A24B 1px, transparent 1px), linear-gradient(90deg, #C9A24B 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }} />
      </div>

      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mb-12 group animate-fade-in">
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
            fontFamily: 'var(--font-playfair), "Playfair Display", Georgia, serif',
            background: 'linear-gradient(135deg, #8a6a1a 0%, #C9A24B 35%, #f5e6a3 55%, #C9A24B 75%, #8a6a1a 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
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
          style={{ fontFamily: 'var(--font-playfair), "Playfair Display", Georgia, serif' }}
        >
          This Page Is Off The Map
        </h1>

        {/* Subtext */}
        <p className="text-[#A0AEC0] text-base sm:text-lg max-w-md mx-auto mb-10 leading-relaxed">
          The page you're looking for doesn't exist or may have been moved.
          Let us escort you back to safety.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* Primary — go home */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg font-semibold text-[#0B1E3F] transition-all duration-200 hover:brightness-110 active:scale-95 pulse-ring"
            style={{
              background: 'linear-gradient(100deg, #b8882e 0%, #e8c56a 40%, #f5d98a 55%, #e0b84a 75%, #b8882e 100%)',
              backgroundSize: '200% 100%',
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
            <MessageCircle className="w-4 h-4 text-[#25D366]" />
            Chat With Us
          </a>
        </div>

        {/* Back link */}
        <button
          onClick={() => typeof window !== 'undefined' && window.history.back()}
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
