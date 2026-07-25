'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  MessageCircle,
  Plane,
  Car,
  Shield,
  Phone,
  FileText,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Calendar,
  ArrowRight,
} from 'lucide-react';
import {
  filterExpos,
  getAvailableCities,
  getAvailableMonths,
  getExpoDateStatus,
} from '../lib/expoUtils';
import { getFeaturedExpos } from '../data/expos';
import {
  trackExpoHubView,
  trackExpoFilterChange,
} from '../lib/expoTracking';
import Header from '../components/Header';
import SimpleFooter from '../components/SimpleFooter';
import ExpoHeroSlider from '../components/ExpoHeroSlider';
import ExpoFilters from '../components/ExpoFilters';
import ExpoCard from '../components/ExpoCard';
import { exposGallery } from '../data/expos.js';
import CustomQuoteSection from '../components/CustomQuoteSection';
const WA_PHONE = '917304607954';

export default function ExpoHub({ expos }) {
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [filteredExpos, setFilteredExpos] = useState(expos);

  // Fire hub_view event on mount
  useEffect(() => {
    trackExpoHubView();
  }, []);

  // Update filtered results when filters change
  useEffect(() => {
    const filtered = filterExpos(expos, selectedCity, selectedMonth);
    setFilteredExpos(filtered);
    trackExpoFilterChange(
      { city: selectedCity, month: selectedMonth },
      filtered.length
    );
  }, [selectedCity, selectedMonth, expos]);

  const handleCityChange = (city) => {
    setSelectedCity(city === selectedCity ? null : city);
  };

  const handleMonthChange = (month) => {
    console.log('Selected month changed to:', month);
    setSelectedMonth(month === selectedMonth ? null : month);
  };

  const handleResetFilters = () => {
    setSelectedCity(null);
    setSelectedMonth(null);
  };

  const featuredExpos = getFeaturedExpos().slice(0, 6);
  const cities = getAvailableCities(expos);
  const months = getAvailableMonths(expos);
  const heroExpo = featuredExpos[0];

  // Upcoming + ongoing expos sorted ascending by eventStart
  const upcomingExpos = expos
    .map((e) => ({ ...e, computedStatus: getExpoDateStatus(e) }))
    .filter((e) => e.computedStatus === 'upcoming' || e.computedStatus === 'ongoing')
    .sort((a, b) => new Date(a.eventStart) - new Date(b.eventStart));

  const carouselRef = useRef(null);
  const scrollCarousel = (dir) => {
    if (!carouselRef.current) return;
    const card = carouselRef.current.querySelector('.uc-card');
    const cardW = card ? card.offsetWidth + 24 : 340;
    carouselRef.current.scrollBy({ left: dir * cardW, behavior: 'smooth' });
  };

  // current month by default july 2026

  useEffect(() => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // getMonth() returns 0-11
    const currentYear = now.getFullYear();
    const currentMonthLabel = `${new Intl.DateTimeFormat('en-US', { month: 'long' }).format(now)} ${currentYear}`; // format july 2026
    const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`; // format 2026-07
    handleMonthChange({
      label: currentMonthLabel,
      key: currentMonthKey,
      month: currentMonth,
      year: currentYear,
    });
  }, []);

  return (
    <>
      <Header />
      <style>{`
        :root {
          --navy: #0B1F3A;
          --navy2: #122B4E;
          --gold: #C9A227;
          --gold2: #E7CE7A;
          --paper: #F7F6F2;
          --ink: #191D24;
          --muted: #5C6270;
          --line: #E4E1D8;
          --wa: #1FA855;
          --radius: 14px;
        }

        /* Only scope reset to expo content, NOT Header */
        .expo-hub-container * { 
          margin: 0; 
          padding: 0; 
          box-sizing: border-box; 
        }
        .expo-hub-container { 
          font-family: 'Inter', system-ui, sans-serif; 
          color: var(--ink); 
          background: var(--paper); 
        }

        html { scroll-behavior: smooth; }

        .wrap { max-width: 1120px; margin: 0 auto; padding: 0 24px; width: 100%; }
        .featured-section .wrap { max-width: 100%; padding: 0; width: 100%; height: auto; }
        .hero .wrap { max-width: 1120px; margin: 0 auto; padding: 0 24px; width: 100%; }
        @media (min-width: 1024px) {
          .featured-section .wrap { height: 100%; }
        }

        /* ── Upcoming Events Carousel ───────────────────────────────── */
        .uc-section {
          background: #fff;
          padding: 60px 0;
          border-top: 1px solid #E4E1D8;
        }
        .uc-header {
          max-width: 1120px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 40px;
          flex-wrap: wrap;
        }
        .uc-header-left .uc-eyebrow {
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          font-weight: 700;
          color: #C9A227;
          margin-bottom: 8px;
      
        }
        .uc-header-left p span {
           font-family: 'Playfair Display', Georgia, serif;
        }

        .uc-header-left h2 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 32px;
          font-weight: 700;
          color: #0B1E3F;
          line-height: 1.2;
          margin-bottom: 8px;
        }
        .uc-header-left p {
          font-size: 16px;
          color: #5C6270;
          max-width: 480px;
          line-height: 1.6;
        }
        .uc-nav {
          display: flex;
          gap: 8px;
          flex-shrink: 0;
        }
        .uc-nav-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid #C9A227;
          background: #fff;
          color: #C9A227;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .uc-nav-btn:hover {
          background: #C9A227;
          color: #fff;
        }
        .uc-track-wrap {
          max-width: 1120px;
          margin: 0 auto;
          padding: 0 24px;
          overflow: hidden;
          position: relative;
        }
        .uc-track {
          display: flex;
          gap: 24px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          padding-bottom: 8px;
        }
        .uc-track::-webkit-scrollbar { display: none; }
        .uc-card {
          flex: 0 0 300px;
          scroll-snap-align: start;
          background: #fff;
          border: 1px solid #E4E1D8;
          border-radius: 12px;
          overflow: hidden;
          transition: box-shadow 0.2s ease, border-color 0.2s ease;
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
        }
        .uc-card:hover {
          border-color: #C9A227;
          box-shadow: 0 8px 24px rgba(11, 31, 58, 0.1);
        }
        .uc-card-img {
          width: 100%;
          aspect-ratio: 16/9;
          object-fit: cover;
          display: block;
          background: #E4E1D8;
        }
        .uc-card-body {
          padding: 20px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .uc-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 4px;
          width: fit-content;
          background: #F7F6F2;
          color: #0B1E3F;
        }
        .uc-badge.upcoming {
          background: #F3E7C3;
          color: #0B1E3F;
        }
        .uc-badge.ongoing {
          background: #E8F5F0;
          color: #0B1E3F;
        }
        .uc-card-name {
          font-family: 'Helvetica Neue', Helvetica, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 18px;
          font-weight: 600;
          color: #0B1E3F;
          line-height: 1.3;
          letter-spacing: -0.3px;
        }
        .uc-card-meta {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .uc-card-meta-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #5C6270;
        }
        .uc-card-meta-row svg {
          flex-shrink: 0;
          color: #C9A227;
          width: 16px;
          height: 16px;
        }
        .uc-card-cta {
          margin-top: auto;
          font-size: 13px;
          font-weight: 600;
          color: #C9A227;
          padding: 10px 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #C9A227;
          border-radius: 6px;
        }
        .uc-card-cta:hover {
          background: #C9A227;
          color: #fff;
          transition: all 0.3s ease;
        }
        .uc-footer-cta {
          max-width: 1120px;
          margin: 40px auto 0;
          padding: 24px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          background: #F7F6F2;
          border-radius: 8px;
        }
        .uc-footer-text {
          font-size: 14px;
          color: #5C6270;
        }
        .uc-footer-text strong { color: #0B1E3F; font-weight: 700; }
        .uc-footer-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #1FA855;
          color: #fff;
          padding: 10px 18px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
          transition: background 0.2s ease;
          white-space: nowrap;
          border: none;
          cursor: pointer;
        }
        .uc-footer-btn:hover { background: #168545; }

        @media (max-width: 768px) {
          .uc-section { padding: 40px 0; }
          .uc-track-wrap { padding: 0 16px; }
          .uc-header { padding: 0 16px; }
          .uc-header-left h2 { font-size: 24px; }
          .uc-card { flex: 0 0 280px; }
          .uc-nav { display: none; }
          .uc-footer-cta { padding: 16px; flex-direction: column; align-items: flex-start; gap: 12px; }
          .uc-footer-text { font-size: 13px; }
        }
        /* ─────────────────────────────────────────────────────────────── */

        /* Hero section with background image */
        .hero {
          position: relative;
          margin-top: 80px;
          width: 100vw;
          padding: 120px 0;
          min-height: 560px;
          display: flex;
          align-items: center;
          overflow: hidden;
          margin-left: -50vw;
          margin-right: -50vw;
          left: 50%;
          right: 50%;
        }

        .hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(1200px 600px at 78% -10%, rgba(29, 59, 102, 0.95) 0%, rgba(11, 31, 58, 0.92) 55%, rgba(8, 22, 39, 0.95) 100%);
          z-index: 1;
        }

        .hero::after {
          content: '';
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          opacity: 0.4;
          z-index: 0;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          color: #fff;
          max-width: 600px;
        }

        .hero .eyebrow { font-size: 12px; letter-spacing: 0.22em; text-transform: uppercase; font-weight: 700; color: var(--gold2); margin-bottom: 16px; }
        .hero h1 { font-family: 'Playfair Display', Georgia, serif; font-size: clamp(42px, 5.5vw, 64px); font-weight: 700; line-height: 1.1; margin-bottom: 20px; }
        .hero h1 em { font-style: italic; color: var(--gold2); }
        .hero .sub { font-size: 16px; color: #C7D0DE; line-height: 1.6; margin-bottom: 32px; }

        /* About section */
        .about { background: #fff; padding: 100px 0; }
        .about h2 { font-family: 'Playfair Display', Georgia, serif; font-weight: 600; font-size: clamp(32px, 3.4vw, 42px); line-height: 1.12; letter-spacing: 0.01em; color: var(--navy); margin-bottom: 60px; }
        .about-grid { 
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 48px;
        }
        .about-item { 
          display: flex;
          gap: 24px;
          align-items: flex-start;
        }
        .about-icon { 
          width: 56px;
          height: 56px;
          border-radius: 12px;
          background: linear-gradient(135deg, #F3E7C3, #FFF9E6);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #B8860B;
        }
        .about-icon svg { width: 28px; height: 28px; }
        .about-content h3 { font-weight: 700; color: var(--navy); margin-bottom: 8px; font-size: 16px; }
        .about-content p { font-size: 14px; color: var(--muted); line-height: 1.6; }

        /* Featured slider section */
        .featured-section { 
          background: #fafaf9; 
          width: 100vw;
          height: auto;
          padding: 0;
          position: relative;
          left: 50%;
          right: 50%;
          margin-left: -50vw;
          margin-right: -50vw;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        @media (min-width: 1024px) {
          .featured-section {
            height: 100vh;
          }
        }
        .featured-section h2 { 
          display: none;
        }

        /* Filters section */
        .filters-sec { padding: 80px 0; background: #fff; }
        .filters-sec h2 { 
          font-family: 'Helvetica Neue', Helvetica, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: clamp(32px, 3.4vw, 42px);
          font-weight: 600;
          margin-bottom: 40px;
        }
        .filters-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; flex-wrap: wrap; gap: 20px; }
        .filters-header h3 { font-size: 16px; font-weight: 600; color: var(--navy); }
        .reset-btn { font-size: 13px; color: var(--gold); cursor: pointer; text-decoration: underline; font-weight: 600; background: none; border: none; padding: 0; transition: color 0.2s; }
        .reset-btn:hover { color: var(--gold2); }

        /* Gallery section */
        .gallery-sec { padding: 40px 0; background: #fff; border-top: 1px solid var(--line); }
        .gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; margin-bottom: 60px; }
        .gallery-item { position: relative; overflow: hidden; border-radius: 8px; aspect-ratio: 16/10; cursor: pointer; text-decoration: none; display: flex; align-items: flex-end; }
        .gallery-item img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease; }
        .gallery-item:hover img { transform: scale(1.05); }
        .gallery-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(to top, rgba(11, 31, 58, 0.8), transparent); z-index: 1; }
        .gallery-info { position: relative; z-index: 2; padding: 20px; width: 100%; }
        .gallery-city { font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--gold); font-weight: 700; margin-bottom: 4px; }
        .gallery-name { font-size: 16px; font-weight: 700; color: #fff; line-height: 1.3; }

        /* Event Gallery Section */
        .event-gallery-sec { padding: 80px 0; background: #fff; border-top: 1px solid var(--line); }
        .event-gallery-sec h2 { 
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(32px, 3.4vw, 42px);
          font-weight: 700;
          margin-bottom: 16px;
        }
        .gallery-intro { font-size: 16px; color: var(--muted); margin-bottom: 48px; max-width: 600px; }
        .photo-gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
        .photo-item { position: relative; overflow: hidden; border-radius: 8px; aspect-ratio: 1/1; cursor: pointer; text-decoration: none; }
        .photo-item img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease; }
        .photo-item:hover img { transform: scale(1.08); }
        .photo-badge { position: absolute; top: 12px; right: 12px; background: rgba(11, 31, 58, 0.8); color: #fff; padding: 4px 10px; border-radius: 4px; font-size: 10px; font-weight: 700; text-transform: uppercase; z-index: 2; }

        /* Cards grid */
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 28px; margin-top: 40px; }

        /* Empty state */
        .empty { text-align: center; padding: 80px 40px; background: #fff; }
        .empty h3 { font-size: 24px; color: var(--navy); margin-bottom: 16px; font-weight: 700; }
        .empty p { color: var(--muted); margin-bottom: 32px; max-width: 440px; margin-left: auto; margin-right: auto; }
        .btn-wa { display: inline-flex; align-items: center; gap: 10px; background: var(--wa); color: #fff; border: none; padding: 14px 26px; border-radius: 10px; font-weight: 600; cursor: pointer; text-decoration: none; font-size: 15px; transition: all 0.2s; }
        .btn-wa:hover { opacity: 0.9; transform: translateY(-2px); }

        .results-info { font-size: 14px; color: var(--muted); margin-bottom: 24px; font-weight: 500; }

        @media (max-width: 768px) {
          .hero { min-height: 420px; padding: 60px 0; }
          .hero h1 { margin-bottom: 16px; }
          .about-grid { gap: 32px; }
          .filters-sec { padding: 60px 0; }
        }
      `}</style>

      <div className="expo-hub-container">
        {/* Hero Slider - WENS Force Branding & Benefits */}
        <section className="featured-section">
          <div className="wrap">
            <ExpoHeroSlider />
          </div>
        </section>

      {/* ── Upcoming Events Carousel ── */}
      {upcomingExpos.length > 0 && (
        <section className="uc-section">
          <div className="uc-header">
            <div className="uc-header-left">
              <div className="uc-eyebrow">Upcoming & Ongoing</div>
              <h2>Going to attent below Events...</h2>
              <p className='capitalize'> <span className='text-2xl bg-[#F3E7C3]'> "You close the deal"</span> <br /> WENS Force Handle The Detail <br /> Arrival | Concierge To Till Departure (All In Between). </p>
            </div>
            <div className="uc-nav">
              <button className="uc-nav-btn" onClick={() => scrollCarousel(-1)} aria-label="Scroll left">
                <ChevronLeft size={18} />
              </button>
              <button className="uc-nav-btn" onClick={() => scrollCarousel(1)} aria-label="Scroll right">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="uc-track-wrap">
            <div className="uc-track" ref={carouselRef}>
              {upcomingExpos.map((expo) => {
                const start = new Date(expo.eventStart);
                const end = new Date(expo.eventEnd);
                const dateStr = start.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
                const endStr = end.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
                return (
                  <Link key={expo.id} href={`/expo/${expo.slug}`} className="uc-card">
                    {(expo.bannerImage || expo.cardImage) && (
                      <img
                        src={expo.bannerImage || expo.cardImage}
                        alt={expo.name}
                        className="uc-card-img"
                      />
                    )}
                    <div className="uc-card-body">
                      <span className={`uc-badge ${expo.computedStatus}`}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
                        {expo.computedStatus === 'ongoing' ? 'Live Now' : 'Upcoming'}
                      </span>
                      <div className="uc-card-name">{expo.name}</div>
                      <div className="uc-card-meta">
                        <div className="uc-card-meta-row">
                          <Calendar size={12} />
                          {dateStr} – {endStr}
                        </div>
                        <div className="uc-card-meta-row">
                          <MapPin size={12} />
                          {expo.venue}, {expo.city}
                        </div>
                      </div>
                      <div className="uc-card-cta">
                        Book Arrival Service <ArrowRight size={14} />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="uc-footer-cta">
            <p className="uc-footer-text">
              Don't see your event? <strong>We cover all major Indian expos & summits.</strong> WhatsApp us to arrange a custom package.
            </p>
            <a
              href={`https://wa.me/${WA_PHONE}?text=${encodeURIComponent('Hi WENS Force — I want to book concierge & airport arrival service for an upcoming event.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="uc-footer-btn"
            >
              <MessageCircle size={15} />
              Book via WhatsApp
            </a>
          </div>
        </section>
      )}

      {/* Hero with background image */}
      <section 
        className="hero"
        style={{
          backgroundImage: heroExpo ? `url(${heroExpo.heroImages?.[0] || heroExpo.cardImage})` : undefined,
        }}
      >
        <style>{`
          .hero::after {
            background-image: url('${heroExpo ? (heroExpo.heroImages?.[0] || heroExpo.cardImage) : ''}');
          }
        `}</style>
        <div className="wrap">
          <div className="hero-content">
            <div className="eyebrow">WENS Force Expo Arrival</div>
            <h1>
              Attend Expos & Conferences<br />
              <em>With Complete Peace of Mind</em>
            </h1>
            <p className="sub">
              Flight-tracked pickup, executive chauffeur, close protection officer, dedicated relationship manager, GST invoicing. Arrive fresh, leave confident.
            </p>
          </div>
        </div>
      </section>

      {/* About section with lucide icons */}
      <section className="about">
        <div className="wrap">
          <h2>The Expo Arrival Experience</h2>
          <div className="about-grid">
            <div className="about-item">
              <div className="about-icon">
                <Plane />
              </div>
              <div className="about-content">
                <h3>Flight-Tracked Pickup</h3>
                <p>We monitor your flight in real time and adjust pickup accordingly. No waiting, no surprises.</p>
              </div>
            </div>
            <div className="about-item">
              <div className="about-icon">
                <Car />
              </div>
              <div className="about-content">
                <h3>Executive Chauffeur</h3>
                <p>Professional driver in a sanitized premium vehicle. Water, chargers, quiet ride.</p>
              </div>
            </div>
            <div className="about-item">
              <div className="about-icon">
                <Shield />
              </div>
              <div className="about-content">
                <h3>Close Protection Officer</h3>
                <p>Trained, discreet, PSARA-compliant. Venue security assessment included.</p>
              </div>
            </div>
            <div className="about-item">
              <div className="about-icon">
                <Phone />
              </div>
              <div className="about-content">
                <h3>Relationship Manager</h3>
                <p>One English-speaking WhatsApp thread, 24×7 through your event window.</p>
              </div>
            </div>
            <div className="about-item">
              <div className="about-icon">
                <FileText />
              </div>
              <div className="about-content">
                <h3>GST Invoicing</h3>
                <p>Corporate delegation billing, multi-pax coordination, compliant paperwork.</p>
              </div>
            </div>
            <div className="about-item">
              <div className="about-icon">
                <MapPin />
              </div>
              <div className="about-content">
                <h3>Door-to-Door Service</h3>
                <p>Venue drop-off included. On-call return pickup on your schedule.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters & Card Grid */}
      <section id='expo-hub' className="filters-sec">
        <div className="wrap">
          <h2>Browse All Events</h2>
          
          <div className="filters-header">
            {(selectedCity || selectedMonth) && (
              <button className="reset-btn" onClick={handleResetFilters}>
                ↻ Reset Filters
              </button>
            )}
          </div>
          <ExpoFilters
            cities={cities}
            months={months}
            selectedCity={selectedCity}
            selectedMonth={selectedMonth}
            onCityChange={handleCityChange}
            onMonthChange={handleMonthChange}
          />

          {filteredExpos.length > 0 ? (
            <>
              <p className="results-info">
                {filteredExpos.length} {filteredExpos.length === 1 ? 'event' : 'events'} found
              </p>
              <div className="grid">
                {filteredExpos.map((expo) => (
                  <ExpoCard key={expo.id} expo={expo} />
                ))}
              </div>
            </>
          ) : (
            <div className="empty">
              <h3>No events found</h3>
              <p>
                We don't have an event scheduled in your selected filters right now. 
                But we're always adding new expos and conferences. Let us know what event you're interested in.
              </p>
              <a
                href={`https://wa.me/${WA_PHONE}?text=${encodeURIComponent(
                  "Hi WENS Force — I'm interested in your Expo Arrival service for an upcoming event. Can you help?"
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-wa"
              >
                <MessageCircle size={18} />
                Ask on WhatsApp
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Event Gallery Section - All Photos from Expos */}
      <section className="event-gallery-sec">
        <div className="wrap">
          <h2>Expo Gallery</h2>
          <p className="gallery-intro">Experience the energy, networking, and insights from our covered expos and conferences across India</p>
          
          <div className="photo-gallery">
            {exposGallery.map((image, idx) => (
              <div key={idx} className="photo-item">
                <img src={image} alt={`Expo Photo ${idx + 1}`} />
              </div>
            ))}
          </div>
        </div>
      </section>
      </div>
      <CustomQuoteSection />
      <div className="wrap" style={{ maxWidth: '1120px', margin: '0 auto', padding: '60px 24px', display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '700px' }}>
            <h5 style={{color: '#666', fontSize: '16px', lineHeight: '1.6', fontWeight: '600'}}>Disclaimer :</h5>
            <p style={{color: '#666', fontSize: '14px', lineHeight: '1.6'}} >This page/article/publication contains news commentary and informational/directional updates regarding expo or event. We are independent platform and are not endorsed by, sponsored by, officially affiliated by, The owner, organizer or organization. All registered trademarks, logos, brand names belong to their respective owners. Content is used strictly for educational, review and news awareness purposes under fair use/ fair dealing principles can be down on authorized request.</p>
      </div>
      <SimpleFooter />
    </>
  );
}