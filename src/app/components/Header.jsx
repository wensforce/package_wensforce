'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Crown, Menu, X } from 'lucide-react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Sticky Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm'
            : 'bg-[#0B1E3F]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
              scrolled
                ? 'bg-[#BF9F00]/10 group-hover:bg-[#BF9F00]/15'
                : 'bg-white/10 group-hover:bg-white/15'
            }`}>
              <img src="/Logo.png" alt="WENS Force Logo" />
            </div>
            <span className={`font-bold text-base tracking-wide transition-colors ${
              scrolled ? 'text-gray-900' : 'text-white'
            }`}>
              WENS Force
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#plans"
              className={`text-sm font-medium transition-colors ${
                scrolled
                  ? 'text-gray-600 hover:text-gray-900'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Plans
            </a>
            <a
              href="#compare"
              className={`text-sm font-medium transition-colors ${
                scrolled
                  ? 'text-gray-600 hover:text-gray-900'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Compare
            </a>
            <a
              href="#how-it-works"
              className={`text-sm font-medium transition-colors ${
                scrolled
                  ? 'text-gray-600 hover:text-gray-900'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              How It Works
            </a>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <a
              href="#plans"
              className={`inline-flex items-center gap-2 font-semibold py-2.5 px-6 rounded-full text-sm transition-all ${
                scrolled
                  ? 'bg-[#BF9F00] text-black hover:bg-[#a88a00]'
                  : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
              }`}
            >
              View Plans
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X size={20} className={scrolled ? 'text-gray-900' : 'text-white'} />
            ) : (
              <Menu size={20} className={scrolled ? 'text-gray-900' : 'text-white'} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden border-t ${
            scrolled ? 'border-gray-100 bg-white' : 'border-white/10 bg-black/50 backdrop-blur'
          }`}>
            <nav className="px-6 py-4 space-y-3">
              <a
                href="#plans"
                className={`block text-sm font-medium transition-colors ${
                  scrolled ? 'text-gray-600 hover:text-gray-900' : 'text-white/70 hover:text-white'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Plans
              </a>
              <a
                href="#compare"
                className={`block text-sm font-medium transition-colors ${
                  scrolled ? 'text-gray-600 hover:text-gray-900' : 'text-white/70 hover:text-white'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Compare
              </a>
              <a
                href="#how-it-works"
                className={`block text-sm font-medium transition-colors ${
                  scrolled ? 'text-gray-600 hover:text-gray-900' : 'text-white/70 hover:text-white'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </a>
              <a
                href="#plans"
                className="block w-full bg-[#BF9F00] text-black font-semibold py-2.5 rounded-full text-sm hover:bg-[#a88a00] transition-all text-center mt-4"
                onClick={() => setMobileMenuOpen(false)}
              >
                View Plans
              </a>
            </nav>
          </div>
        )}
      </header>

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
}
