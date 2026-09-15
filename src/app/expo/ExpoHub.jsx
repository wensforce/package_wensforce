"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Image,
} from "lucide-react";
import {
  filterExpos,
  getExpoDisplayStatus,
  getExpoHubBadgeLabel,
  isExpoVisibleOnHub,
} from "../utils/expo/expoUtils";
import {
  fetchExpoCitiesAndMonthsClient,
  fetchPublicExposClient,
  getActiveExposFromList,
} from "@/app/lib/expoApi";

import {
  trackExpoHubView,
  trackExpoFilterChange,
  trackExpoCardClick,
} from "../utils/expo/expoTracking";
import Header from "../components/MainPage/Header";
import SimpleFooter from "../components/expo/SimpleFooter";
import ExpoHeroSlider from "../components/expo/ExpoHeroSlider";
import ExpoFilters from "../components/expo/ExpoFilters";
import ExpoCard from "../components/expo/ExpoCard";
import { EXPO_HUB_STOCK_GALLERY } from "../data/expoContent";
import CustomQuoteSection from "../components/expo/CustomQuoteSection";
import ExpoFAQ from "../components/expo/ExpoFAQ";
import ExpoTestimonialsSection from "../components/expo/ExpoTestimonialsSection";
const WA_PHONE = "917304607954";

export default function ExpoHub() {
  const router = useRouter();
  const [expos, setExpos] = useState([]);
  const [exposLoading, setExposLoading] = useState(true);
  const [exposError, setExposError] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [filteredExpos, setFilteredExpos] = useState([]);
  const [cities, setCities] = useState([]);
  const [months, setMonths] = useState([]);
  const [filtersLoading, setFiltersLoading] = useState(true);

  // Fire hub_view event on mount; prevent horizontal page scroll on /expo only
  useEffect(() => {
    trackExpoHubView();
    document.documentElement.classList.add("expo-hub-page");
    document.body.classList.add("expo-hub-page");
    return () => {
      document.documentElement.classList.remove("expo-hub-page");
      document.body.classList.remove("expo-hub-page");
    };
  }, []);

  // Update filtered results when filters change
  useEffect(() => {
    const filtered = filterExpos(expos, selectedCity, selectedMonth);
    setFilteredExpos(filtered);
    trackExpoFilterChange(
      { city: selectedCity, month: selectedMonth },
      filtered.length,
    );
  }, [selectedCity, selectedMonth, expos]);

  const handleCityChange = (city) => {
    setSelectedCity(city === selectedCity ? null : city);
  };

  const handleMonthChange = (month) => {
    setSelectedMonth(month === selectedMonth ? null : month);
  };

  const handleResetFilters = () => {
    setSelectedCity(null);
    setSelectedMonth(null);
  };

  const activeExpos = getActiveExposFromList(expos).sort(
    (a, b) => new Date(a.eventStart) - new Date(b.eventStart),
  );
  const heroExpo = activeExpos[0];

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setExposLoading(true);
      setFiltersLoading(true);
      setExposError(null);
      try {
        const [list, filterOpts] = await Promise.all([
          fetchPublicExposClient(),
          fetchExpoCitiesAndMonthsClient(),
        ]);
        if (cancelled) return;
        setExpos(Array.isArray(list) ? list : []);
        setCities(filterOpts.cities);
        setMonths(filterOpts.months);
      } catch {
        if (!cancelled) {
          setExposError("Could not load expos. Please refresh the page.");
          setExpos([]);
        }
      } finally {
        if (!cancelled) {
          setExposLoading(false);
          setFiltersLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Upcoming + ongoing expos sorted ascending by eventStart
  const upcomingExpos = expos
    .map((e) => ({
      ...e,
      displayStatus: getExpoDisplayStatus(e),
    }))
    .filter((e) => isExpoVisibleOnHub(e))
    .sort((a, b) => new Date(a.eventStart) - new Date(b.eventStart));

  const carouselRef = useRef(null);
  const carouselDrag = useRef({ startX: 0, isDragging: false });

  const handleCarouselPointerDown = (e) => {
    carouselDrag.current = { startX: e.clientX, isDragging: false };
  };

  const handleCarouselPointerMove = (e) => {
    if (Math.abs(e.clientX - carouselDrag.current.startX) > 10) {
      carouselDrag.current.isDragging = true;
    }
  };

  const openExpoDetail = (expo, { ignoreDrag = false } = {}) => {
    if (!ignoreDrag && carouselDrag.current.isDragging) {
      carouselDrag.current.isDragging = false;
      return;
    }
    carouselDrag.current.isDragging = false;
    trackExpoCardClick(expo.slug, expo.name, "hub_carousel");
    router.push(`/expo/${expo.slug}`);
  };

  const scrollCarousel = (dir) => {
    if (!carouselRef.current) return;
    const card = carouselRef.current.querySelector(".uc-card");
    const cardW = card ? card.offsetWidth + 24 : 340;
    carouselRef.current.scrollBy({ left: dir * cardW, behavior: "smooth" });
  };

  useEffect(() => {
    if (!months.length) return;
    const now = new Date();
    const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const match = months.find((m) => m.key === currentMonthKey);
    if (match) {
      setSelectedMonth(match);
    }
  }, [months]);

  return (
    <div className="expo-page-shell">
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
          width: 100%;
          max-width: 100%;
          overflow-x: clip;
        }

        html.expo-hub-page,
        body.expo-hub-page {
          overflow-x: hidden;
          max-width: 100%;
        }

        html { scroll-behavior: smooth; }

        .expo-page-shell {
          width: 100%;
          max-width: 100%;
          overflow-x: clip;
        }

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
          cursor: pointer;
        }
        .uc-card:hover {
          border-color: #C9A227;
          box-shadow: 0 8px 24px rgba(11, 31, 58, 0.1);
        }
        .uc-card-img {
          width: 100%;
          aspect-ratio: 16/9;
          object-fit: cover;
          display: flex;
          align-items: center;
          justify-content: center;
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
        .uc-badge.completed {
          background: #E8EAED;
          color: #5C6270;
        }
        .uc-badge.cancelled {
          background: #FEE2E2;
          color: #991B1B;
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
          width: 100%;
          max-width: 100%;
          padding: 120px 0;
          min-height: 560px;
          display: flex;
          align-items: center;
          overflow: hidden;
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
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
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
          width: 100%;
          max-width: 100%;
          height: auto;
          padding: 0;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: stretch;
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
        .gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr)); gap: 20px; margin-bottom: 60px; }
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
        .photo-gallery {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(100%, 260px), 1fr));
          gap: 16px;
        }
        .photo-item {
          position: relative;
          overflow: hidden;
          border-radius: 8px;
          aspect-ratio: 4/3;
          background: #E8E4DA;
          border: 1px solid var(--line);
        }
        .photo-item img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.35s ease;
        }
        .photo-item:hover img { transform: scale(1.06); }
        .photo-badge { position: absolute; top: 12px; right: 12px; background: rgba(11, 31, 58, 0.8); color: #fff; padding: 4px 10px; border-radius: 4px; font-size: 10px; font-weight: 700; text-transform: uppercase; z-index: 2; }

        /* Cards grid */
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 320px), 1fr)); gap: 28px; margin-top: 40px; }

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
                <p className="capitalize">
                  {" "}
                  <span className="text-2xl bg-[#F3E7C3]">
                    {" "}
                    "You close the deal"
                  </span>{" "}
                  <br /> WENS Force Handle The Detail <br /> Arrival | Concierge
                  To Till Departure (All In Between).{" "}
                </p>
              </div>
              <div className="uc-nav">
                <button
                  className="uc-nav-btn"
                  onClick={() => scrollCarousel(-1)}
                  aria-label="Scroll left"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  className="uc-nav-btn"
                  onClick={() => scrollCarousel(1)}
                  aria-label="Scroll right"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            <div className="uc-track-wrap">
              <div
                className="uc-track"
                ref={carouselRef}
                onPointerDown={handleCarouselPointerDown}
                onPointerMove={handleCarouselPointerMove}
                onPointerUp={() => {
                  window.setTimeout(() => {
                    carouselDrag.current.isDragging = false;
                  }, 50);
                }}
                onPointerLeave={() => {
                  carouselDrag.current.isDragging = false;
                }}
              >
                {upcomingExpos.map((expo) => {
                  const start = new Date(expo.eventStart);
                  const end = new Date(expo.eventEnd);
                  const dateStr = start.toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  });
                  const endStr = end.toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  });
                  return (
                    <div
                      key={expo.id}
                      role="link"
                      tabIndex={0}
                      className="uc-card"
                      onClick={() => openExpoDetail(expo)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          openExpoDetail(expo);
                        }
                      }}
                    >
                      {expo.cardImage || expo.bannerImage ? (
                        <img
                          src={expo.cardImage || expo.bannerImage}
                          alt={expo.name}
                          className="uc-card-img"
                          draggable={false}
                        />
                      ) : (
                        <div className="uc-card-img">
                          <Image size={48} className="text-gray-400" />
                        </div>
                      )}
                      <div className="uc-card-body">
                        <span
                          className={`uc-badge ${expo.displayStatus.badgeClass}`}
                        >
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: "currentColor",
                              display: "inline-block",
                            }}
                          />
                          {getExpoHubBadgeLabel(expo.displayStatus)}
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
                        <div
                          className="uc-card-cta"
                          role="button"
                          tabIndex={0}
                          onClick={(e) => {
                            e.stopPropagation();
                            openExpoDetail(expo, { ignoreDrag: true });
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              e.stopPropagation();
                              openExpoDetail(expo, { ignoreDrag: true });
                            }
                          }}
                        >
                          Book Arrival Service <ArrowRight size={14} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="uc-footer-cta">
              <p className="uc-footer-text">
                Don't see your event?{" "}
                <strong>We cover all major Indian expos & summits.</strong>{" "}
                WhatsApp us to arrange a custom package.
              </p>
              <a
                href={`https://wa.me/${WA_PHONE}?text=${encodeURIComponent("Hi WENS Force — I want to book concierge & airport arrival service for an upcoming event.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="uc-footer-btn"
              >
                <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          width="28"
          height="28"
          fill="white"
        >
          <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.668 4.799 1.836 6.793L2 30l7.393-1.812A13.918 13.918 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.6a11.543 11.543 0 01-5.88-1.604l-.42-.248-4.39 1.074 1.106-4.274-.272-.44A11.556 11.556 0 014.4 16C4.4 9.592 9.592 4.4 16 4.4S27.6 9.592 27.6 16 22.408 27.6 16 27.6zm6.327-8.627c-.348-.174-2.055-1.014-2.374-1.13-.318-.115-.55-.174-.78.174-.23.348-.894 1.13-1.097 1.362-.201.231-.404.26-.752.086-.348-.174-1.47-.542-2.799-1.727-1.034-.922-1.732-2.062-1.934-2.41-.202-.348-.022-.536.152-.71.156-.155.348-.405.522-.607.174-.202.23-.348.348-.58.115-.231.058-.434-.03-.607-.086-.174-.78-1.882-1.07-2.578-.282-.677-.568-.585-.78-.596-.201-.01-.434-.012-.665-.012-.23 0-.607.086-.926.434-.318.348-1.214 1.186-1.214 2.892 0 1.707 1.243 3.356 1.417 3.588.174.231 2.447 3.734 5.928 5.234.83.358 1.478.572 1.982.732.833.265 1.59.227 2.19.138.668-.1 2.055-.84 2.346-1.652.29-.81.29-1.505.202-1.652-.086-.145-.318-.231-.665-.405z" />
        </svg>
                Book via WhatsApp
              </a>
            </div>
          </section>
        )}

        {/* Hero with background image */}
        <section
          className="hero"
          style={{
            backgroundImage: heroExpo
              ? `url(${heroExpo.heroImages?.[0] || heroExpo.cardImage})`
              : undefined,
          }}
        >
          <style>{`
          .hero::after {
            background-image: url('${heroExpo ? heroExpo.heroImages?.[0] || heroExpo.cardImage : ""}');
          }
        `}</style>
          <div className="wrap">
            <div className="hero-content">
              <div className="eyebrow">WENS Force Expo Arrival</div>
              <h1>
                Attend Expos & Conferences
                <br />
                <em>With Complete Peace of Mind</em>
              </h1>
              <p className="sub">
                Flight-tracked pickup, executive chauffeur, close protection
                officer, dedicated relationship manager, GST invoicing. Arrive
                fresh, leave confident.
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
                  <p>
                    We monitor your flight in real time and adjust pickup
                    accordingly. No waiting, no surprises.
                  </p>
                </div>
              </div>
              <div className="about-item">
                <div className="about-icon">
                  <Car />
                </div>
                <div className="about-content">
                  <h3>Executive Chauffeur</h3>
                  <p>
                    Professional driver in a sanitized premium vehicle. Water,
                    chargers, quiet ride.
                  </p>
                </div>
              </div>
              <div className="about-item">
                <div className="about-icon">
                  <Shield />
                </div>
                <div className="about-content">
                  <h3>Close Protection Officer</h3>
                  <p>
                    Trained, discreet, PSARA-compliant. Venue security
                    assessment included.
                  </p>
                </div>
              </div>
              <div className="about-item">
                <div className="about-icon">
                  <Phone />
                </div>
                <div className="about-content">
                  <h3>Relationship Manager</h3>
                  <p>
                    One English-speaking WhatsApp thread, 24×7 through your
                    event window.
                  </p>
                </div>
              </div>
              <div className="about-item">
                <div className="about-icon">
                  <FileText />
                </div>
                <div className="about-content">
                  <h3>GST Invoicing</h3>
                  <p>
                    Corporate delegation billing, multi-pax coordination,
                    compliant paperwork.
                  </p>
                </div>
              </div>
              <div className="about-item">
                <div className="about-icon">
                  <MapPin />
                </div>
                <div className="about-content">
                  <h3>Door-to-Door Service</h3>
                  <p>
                    Venue drop-off included. On-call return pickup on your
                    schedule.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filters & Card Grid */}
        <section id="expo-hub" className="filters-sec">
          <div className="wrap">
            <h2>Browse All Events</h2>

            <div className="filters-header">
              {(selectedCity || selectedMonth) && (
                <button className="reset-btn" onClick={handleResetFilters}>
                  ↻ Reset Filters
                </button>
              )}
            </div>
            {exposError && (
              <p className="text-sm text-red-600 mb-4">{exposError}</p>
            )}
            <ExpoFilters
              cities={cities}
              months={months}
              loading={filtersLoading || exposLoading}
              selectedCity={selectedCity}
              selectedMonth={selectedMonth}
              onCityChange={handleCityChange}
              onMonthChange={handleMonthChange}
            />

            {exposLoading ? (
              <p className="text-sm text-[#5C6270] py-8 text-center">
                Loading events…
              </p>
            ) : filteredExpos.length > 0 ? (
              <>
                <p className="results-info">
                  {filteredExpos.length}{" "}
                  {filteredExpos.length === 1 ? "event" : "events"} found
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
                  We don't have an event scheduled in your selected filters
                  right now. But we're always adding new expos and conferences.
                  Let us know what event you're interested in.
                </p>
                <a
                  href={`https://wa.me/${WA_PHONE}?text=${encodeURIComponent(
                    "Hi WENS Force — I'm interested in your Expo Arrival service for an upcoming event. Can you help?",
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
            <p className="gallery-intro">
              Experience the energy, networking, and insights from our covered
              expos and conferences across India
            </p>

            <div className="photo-gallery">
              {EXPO_HUB_STOCK_GALLERY.map((image, idx) => (
                <div key={image} className="photo-item">
                  <img
                    src={image}
                    alt={`Expo gallery ${idx + 1}`}
                    loading={idx < 4 ? "eager" : "lazy"}
                    decoding="async"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <section className="wrap" style={{ maxWidth: "1220px", margin: "0 auto", padding: "48px 24px 24px" }}>
        <h2 style={{ textAlign: "center", color: "#0B1F3A", marginBottom: "8px", fontSize: "1.75rem", fontWeight: 700 }}>
          Frequently asked questions
        </h2>
        <ExpoFAQ />
      </section>
      <CustomQuoteSection />
      <ExpoTestimonialsSection />
      <div
        className="wrap"
        style={{
          maxWidth: "1120px",
          margin: "0 auto",
          padding: "60px 24px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          maxWidth: "700px",
        }}
      >
        <h5
          style={{
            color: "#666",
            fontSize: "16px",
            lineHeight: "1.6",
            fontWeight: "600",
          }}
        >
          Disclaimer :
        </h5>
        <p style={{ color: "#666", fontSize: "14px", lineHeight: "1.6" }}>
          This page/article/publication contains news commentary and
          informational/directional updates regarding expo or event. We are
          independent platform and are not endorsed by, sponsored by, officially
          affiliated by, The owner, organizer or organization. All registered
          trademarks, logos, brand names belong to their respective owners.
          Content is used strictly for educational, review and news awareness
          purposes under fair use/ fair dealing principles can be down on
          authorized request.
        </p>
      </div>
      <SimpleFooter />
    </div>
  );
}
