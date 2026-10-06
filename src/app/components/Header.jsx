'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { label: 'Membership', href: '/' },
  { label: 'Expo', href: '/expo' },
  { label: 'Welcome India', href: '/?welcomeIndia=true' },
  { label: 'Mumbai Darshan', href: '/airport-concierge-bom' },
  { label: 'Airport Transfer', href: '/airport-transfer/mumbai' },
];

function resolveHref(href, pathname) {
  if (typeof href === 'string' && href.startsWith('#')) {
    return pathname === '/' ? href : `/${href}`;
  }
  return href;
}

function isNavActive(href, pathname, isWelcomeIndia) {
  if (!href) return false;

  // Welcome India — home with ?welcomeIndia=true
  if (href.includes('welcomeIndia=true')) {
    return pathname === '/' && isWelcomeIndia;
  }

  // Membership / home — exact "/" only, never when Welcome India is on
  if (href === '/') {
    return pathname === '/' && !isWelcomeIndia;
  }

  if (href.startsWith('/airport-transfer')) {
    return pathname.startsWith('/airport-transfer');
  }
  if (href.startsWith('/expo')) {
    return pathname.startsWith('/expo');
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Header({ cta, showNavLinks = true }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const isWelcomeIndia = searchParams.get('welcomeIndia') === 'true';
  const { isLoggedIn, user } = useAuth();

  const ctaHref = cta?.href ? resolveHref(cta.href, pathname) : '';

  const linkClass = (href, mobile = false) => {
    const active = isNavActive(href, pathname, isWelcomeIndia);
    const color = active
      ? scrolled
        ? 'text-[#BF9F00]'
        : 'text-[#C9A24B]'
      : scrolled
        ? 'text-gray-600 hover:text-gray-900'
        : 'text-white/70 hover:text-white';
    return `${mobile ? 'block' : ''} text-sm font-medium transition-colors ${color}`;
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm'
            : 'bg-[#0B1E3F]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center transition-all">
              <img src="/Logo.png" alt="WENS Force Logo" />
            </div>
            <span
              className={`font-bold text-base tracking-wide transition-colors ${
                scrolled ? 'text-gray-900' : 'text-white'
              }`}
            >
              WENS Force
            </span>
          </Link>

          {showNavLinks && (
            <nav className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={linkClass(item.href)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}

          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <Link
                href={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                className={`inline-flex items-center gap-2 font-semibold py-2.5 px-5 rounded-full text-sm transition-all ${
                  scrolled
                    ? 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                    : 'border border-white/30 text-white hover:bg-white/10'
                }`}
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className={`inline-flex items-center gap-2 font-semibold py-2.5 px-5 rounded-full text-sm transition-all ${
                  scrolled
                    ? 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                    : 'border border-white/30 text-white hover:bg-white/10'
                }`}
              >
                Login
              </Link>
            )}
            {cta?.label && cta?.href && (
              <a
                href={ctaHref}
                className={`inline-flex items-center gap-2 font-semibold py-2.5 px-6 rounded-full text-sm transition-all ${
                  scrolled
                    ? 'bg-[#BF9F00] text-black hover:bg-[#a88a00]'
                    : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
                }`}
              >
                {cta.label}
              </a>
            )}
          </div>

          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? (
              <X size={20} className={scrolled ? 'text-gray-900' : 'text-white'} />
            ) : (
              <Menu size={20} className={scrolled ? 'text-gray-900' : 'text-white'} />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div
            className={`md:hidden border-t ${
              scrolled
                ? 'border-gray-100 bg-white'
                : 'border-white/10 bg-black/50 backdrop-blur'
            }`}
          >
            <nav className="px-6 py-4 space-y-3">
              {showNavLinks &&
                NAV_LINKS.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={linkClass(item.href, true)}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              {isLoggedIn && (
                <Link
                  href={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                  className={`block text-sm font-semibold transition-colors ${
                    scrolled
                      ? 'text-gray-700 hover:text-gray-900'
                      : 'text-white/80 hover:text-white'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              {cta?.label && cta?.href && (
                <a
                  href={ctaHref}
                  className="block w-full bg-[#BF9F00] text-black font-semibold py-2.5 rounded-full text-sm hover:bg-[#a88a00] transition-all text-center mt-4"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {cta.label}
                </a>
              )}
            </nav>
          </div>
        )}
      </header>

      <div className="h-16" />
    </>
  );
}
