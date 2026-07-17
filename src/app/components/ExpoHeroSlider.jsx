'use client';

import React, { useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Link from 'next/link';
import { ChevronRight, ChevronLeft, ShieldCheck, BadgeCheck } from 'lucide-react';

const brandSlides = [
  {
    id: 1,
    headline: 'You land.',
    subheadline: 'We handle the rest.',
    description: 'Airport pickup, executive transfer, close protection — arranged before you land. No vendors to chase, no cars to book.',
    icon: null,
    cta: 'View Packages',
    bgGradient: 'linear-gradient(135deg, rgba(26, 35, 50, 0.9), rgba(26, 35, 50, 0.7))',
    image: '/expo-banner/Banner1.png', // prompt 1 — arrival / overview
  },
  {
    id: 2,
    headline: 'Executive Chauffeur,',
    subheadline: 'Close Protection Officer',
    description: 'A sanitised premium vehicle and a trained, PSARA-compliant protection officer — one seamless team, from touchdown to the venue.',
    icon: null,
    cta: 'View Packages',
    bgGradient: 'linear-gradient(135deg, rgba(26, 35, 50, 0.9), rgba(26, 35, 50, 0.7))',
    image: '/expo-banner/Banner2.png', // prompt 2 — chauffeur + CPO together
  },
  {
    id: 3,
    headline: 'Licensed Since 2008,',
    subheadline: 'Not Just Promised',
    description: 'PSARA-licensed, 24x7 concierge, a track record with VIP delegations — the credentials are on file, not just on the page.',
    icon: null,
    cta: 'Reserve My Arrival',
    bgGradient: 'linear-gradient(135deg, rgba(26, 35, 50, 0.9), rgba(26, 35, 50, 0.7))',
    image: '/expo-banner/Banner3.png', // prompt 3 — trust / credentials
  },
]

export default function ExpoHeroSlider() {
  const swiperRef = useRef(null);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') {
        swiperRef.current?.swiper.slidePrev();
      } else if (e.key === 'ArrowRight') {
        swiperRef.current?.swiper.slideNext();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <>
      <style>{`
        .hero-slider { position: relative; width: 100%; }
        
        .swiper-hero { width: 100%; }

        .hero-slide { 
          position: relative; 
          display: flex; 
          align-items: center; 
          justify-content: flex-start; 
          min-height: 400px;
          border-radius: 0; 
          overflow: hidden; 
          background: #1a2332;
        }
        @media (min-width: 768px) {
          .hero-slide { min-height: 500px; }
        }
        @media (min-width: 1024px) {
          .hero-slide { min-height: 600px; }
        }
        
        .hero-slide::before { 
          content: ''; 
          position: absolute; 
          inset: 0; 
          background: linear-gradient(to right, rgba(26, 35, 50, 0.95) 0%, rgba(26, 35, 50, 0.7) 40%, rgba(26, 35, 50, 0.2) 100%); 
          z-index: 1; 
        }
        .hero-slide-image { 
          position: absolute; 
          inset: 0; 
          width: 100%; 
          height: 100%; 
          object-fit: cover; 
          z-index: 0; 
        }

        .hero-slide-wrapper {
          position: relative;
          z-index: 2;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          padding: 24px 16px;
        }
        
        @media (min-width: 640px) {
          .hero-slide-wrapper {
            padding: 40px 32px;
          }
        }
        
        @media (min-width: 1024px) {
          .hero-slide-wrapper {
            padding: 60px 80px;
          }
        }

        .hero-slide-header {
          display: none;
        }

        .hero-slide-logo {
          display: none;
        }

        .hero-logo-icon {
          display: none;
        }

        .hero-logo-text {
          display: none;
        }

        .hero-slide-badge {
          display: inline-block;
          background: rgba(201, 162, 39, 0.15);
          border: 1px solid #C9A227;
          border-radius: 20px;
          padding: 6px 12px;
          font-size: 10px;
          font-weight: 700;
          color: #C9A227;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 12px;
        }
        
        @media (min-width: 640px) {
          .hero-slide-badge {
            padding: 8px 16px;
            font-size: 11px;
            margin-bottom: 16px;
          }
        }

        .hero-slide-content {
          display: flex;
          flex-direction: column;
          gap: 0;
          max-width: 100%;
          color: #fff;
        }
        
        @media (min-width: 640px) {
          .hero-slide-content {
            max-width: 95%;
          }
        }
        
        @media (min-width: 768px) {
          .hero-slide-content {
            max-width: 85%;
          }
        }

        .hero-slide-icon-large {
          display: none;
        }

        .hero-slide-headline {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(28px, 7vw, 60px);
          font-weight: 700;
          line-height: 1.25;
          letter-spacing: -0.5px;
          margin: 0;
          color: #fff;
        }

        .hero-slide-subheadline {
          font-size: 13px;
          color: #C9A227;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin: 0;
          order: -1;
          margin-bottom: 8px;
        }
        
        @media (min-width: 640px) {
          .hero-slide-subheadline {
            font-size: 14px;
            margin-bottom: 12px;
          }
        }
        
        @media (min-width: 1024px) {
          .hero-slide-subheadline {
            font-size: 15px;
            margin-bottom: 16px;
          }
        }

        .hero-slide-description {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.95);
          line-height: 1.6;
          margin: 12px 0 0 0;
          max-width: 100%;
        }
        
        @media (min-width: 640px) {
          .hero-slide-description {
            font-size: 15px;
            margin: 16px 0 0 0;
            line-height: 1.7;
          }
        }
        
        @media (min-width: 1024px) {
          .hero-slide-description {
            font-size: 16px;
            margin: 20px 0 0 0;
            max-width: 550px;
          }
        }

        .hero-slide-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #C9A227;
          color: #1a2332;
          font-weight: 700;
          font-size: 12px;
          padding: 12px 24px;
          border: 2px solid #C9A227;
          border-radius: 4px;
          text-decoration: none;
          transition: all 0.3s ease;
          width: fit-content;
          letter-spacing: 0.05em;
          cursor: pointer;
          margin-top: 16px;
          text-transform: uppercase;
        }
        
        @media (min-width: 640px) {
          .hero-slide-cta {
            font-size: 13px;
            padding: 14px 32px;
            margin-top: 20px;
          }
        }
        
        @media (min-width: 1024px) {
          .hero-slide-cta {
            font-size: 14px;
            padding: 15px 40px;
            margin-top: 24px;
          }
        }

        .hero-slide-cta:hover {
          background: transparent;
          color: #C9A227;
          border-color: #C9A227;
          gap: 12px;
        }

        .hero-slide-footer {
          display: none;
        }

        .hero-slide-footer span {
          display: none;
        }

        .hero-slide-footer svg {
          display: none;
        }

        .swiper-pagination {
          bottom: 20px !important;
        }

        .swiper-pagination-bullet { 
          background: rgba(201, 162, 39, 0.4) !important;
          transition: all 0.3s; 
        }
        .swiper-pagination-bullet-active { 
          background: #C9A227 !important;
        }

        /* Navigation Buttons */
        .hero-nav-button {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(201, 162, 39, 0.2);
          border: 2px solid #C9A227;
          color: #C9A227;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }

        .hero-nav-button:hover {
          background: rgba(201, 162, 39, 0.4);
          box-shadow: 0 0 20px rgba(201, 162, 39, 0.4);
        }

        .hero-nav-prev {
          left: 16px;
        }

        .hero-nav-next {
          right: 16px;
        }

        .hero-nav-button svg {
          width: 18px;
          height: 18px;
        }

        @media (max-width: 768px) {
          .hero-nav-button {
            width: 36px;
            height: 36px;
          }
          .hero-nav-button svg {
            width: 16px;
            height: 16px;
          }
          .hero-nav-prev {
            left: 10px;
          }
          .hero-nav-next {
            right: 10px;
          }
        }

        @media (max-width: 480px) {
          .hero-nav-button {
            width: 32px;
            height: 32px;
          }
          .hero-nav-button svg {
            width: 14px;
            height: 14px;
          }
          .hero-nav-prev {
            left: 8px;
          }
          .hero-nav-next {
            right: 8px;
          }
        }
      `}</style>

      <div className="hero-slider">
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={0}
          slidesPerView={1}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          ref={swiperRef}
          loop
          className="swiper-hero"
        >
          {brandSlides.map((slide) => {
            const IconComp = slide.icon;
            return (
              <SwiperSlide key={slide.id}>
                <div className="hero-slide">
                  <img
                    src={slide.image}
                    alt={slide.headline}
                    className="hero-slide-image"
                  />
                  <div className="hero-slide-wrapper">
                    {/* Header: Logo + Badge */}
                    <div className="hero-slide-header">
                      <div className="hero-slide-logo">
                        <img 
                          src="/Logo.png" 
                          alt="WENS FORCE" 
                          className="hero-logo-icon"
                          style={{ padding: '4px', borderRadius: '12px', objectFit: 'contain', background: 'rgba(201, 162, 39, 0.2)' }}
                        />
                        <div className="hero-logo-text">WENS FORCE<br/>INTERNATIONAL</div>
                      </div>
                      <div className="hero-slide-badge">
                        EXPO ARRIVAL SERVICE
                      </div>
                    </div>

                    {/* Main Content */}
                    <div className="hero-slide-content">
                      {IconComp && (
                        <div className="hero-slide-icon-large">
                          <IconComp size={32} />
                        </div>
                      )}
                      <div>
                        {slide.subheadline && (
                          <div className="hero-slide-subheadline">{slide.subheadline}</div>
                        )}
                        <h1 className="hero-slide-headline">{slide.headline}</h1>
                      </div>
                      <p className="hero-slide-description">
                        {slide.description}
                      </p>
                      <Link
                        href="/expo"
                        className="hero-slide-cta"
                      >
                        {slide.cta} <ChevronRight size={16} />
                      </Link>
                    </div>

                    {/* Footer: Credentials */}
                    <div className="hero-slide-footer">
                      <span>PSARA LICENSED</span>
                      <span>24×7 CONCIERGE</span>
                      <span>SERVED 2025 EXPO DELEGATIONS</span>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* Navigation Buttons */}
        <button 
          className="hero-nav-button hero-nav-prev"
          onClick={() => swiperRef.current?.swiper.slidePrev()}
          aria-label="Previous slide"
        >
          <ChevronLeft size={20} />
        </button>
        <button 
          className="hero-nav-button hero-nav-next"
          onClick={() => swiperRef.current?.swiper.slideNext()}
          aria-label="Next slide"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </>
  );
}
