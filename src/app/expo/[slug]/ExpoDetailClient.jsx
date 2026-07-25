'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Header from '../../components/Header';
import SimpleFooter from '../../components/SimpleFooter';
import { formatServiceWindow } from '../../lib/expoUtils';
import { trackExpoDetailView } from '../../lib/expoTracking';
import ExpoPackagesSection from '../../components/ExpoPackagesSection';
import ExpoFAQ from '../../components/ExpoFAQ';
import ExpoServiceCoverage from '../../components/ExpoServiceCoverage';
import ExpoEventGallery from '../../components/ExpoEventGallery';
import CountdownBadge from '../../components/CountdownBadge';
import CustomQuoteSection from '../../components/CustomQuoteSection.jsx';

export default function ExpoDetailClient({ expo, packages, faqs }) {
  const [activeTab, setActiveTab] = useState('packages');

  useEffect(() => {
    trackExpoDetailView(expo.slug, expo.name, expo.city);
  }, [expo.slug, expo.name, expo.city]);

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

        /* Only scope reset to detail content, NOT Header */
        .expo-detail-container * { 
          margin: 0; 
          padding: 0; 
          box-sizing: border-box; 
        }

        html { scroll-behavior: smooth; }

        .wrap { max-width: 1220px; margin: 0 auto; padding: 0 24px; }

        /* Header */
        .detail-header { background: radial-gradient(1200px 600px at 78% -10%, #1D3B66 0%, var(--navy) 55%, #081627 100%); color: #fff; padding: 60px 0 80px; margin-top: 80px; }
        .back-link { display: inline-flex; align-items: center; gap: 8px; color: var(--gold2); font-size: 13px; font-weight: 600; text-decoration: none; margin-bottom: 32px; transition: all 0.2s ease; }
        .back-link:hover { gap: 12px; }

        .header-content h1 { font-family: 'Playfair Display', Georgia, serif; font-size: clamp(32px, 5vw, 48px); font-weight: 700; line-height: 1.2; margin-bottom: 16px; }
        .header-meta { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; font-size: 15px; color: #C7D0DE; margin-bottom: 24px; }
        .header-meta-item { display: flex; align-items: center; gap: 8px; }

        .countdown-large { margin-top: 24px; }

        /* Tabs */
        .tabs-nav { 
          display: flex; 
          gap: 32px; 
          border-bottom: 1px solid var(--line); 
          background: #fff; 
          padding: 0 0 20px 0;
          margin-top: 40px;
          margin-bottom: 40px;
        }
        .tab-btn { 
          background: none; 
          border: none; 
          cursor: pointer; 
          font-weight: 600;
          font-size: 14px;
          color: var(--muted);
          padding: 4px 0;
          border-bottom: 3px solid transparent;
          transition: all 0.2s ease;
          position: relative;
          bottom: -21px;
        }
        .tab-btn.active { 
          color: var(--navy); 
          border-bottom-color: var(--gold);
        }
        .tab-btn:hover:not(.active) { 
          color: var(--navy); 
        }

        /* Tab content */
        .tab-content { display: none; }
        .tab-content.active { display: block; }

        /* Premium Card Grid */
        .packages-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 28px;
          margin-bottom: 40px;
        }

        .package-card {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(247, 246, 242, 0.98) 100%);
          border: 1px solid rgba(201, 162, 39, 0.15);
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
          transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
          display: flex;
          flex-direction: column;
        }

        .package-card:hover {
          box-shadow: 0 12px 48px rgba(201, 162, 39, 0.2);
          transform: translateY(-4px);
          border-color: rgba(201, 162, 39, 0.3);
        }

        .package-header {
          padding: 20px;
          border-bottom: 1px solid rgba(201, 162, 39, 0.1);
          background: linear-gradient(135deg, rgba(201, 162, 39, 0.05) 0%, rgba(231, 206, 122, 0.03) 100%);
        }

        .package-name {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 22px;
          font-weight: 700;
          color: var(--navy);
          margin-bottom: 8px;
          line-height: 1.2;
        }

        .package-subtitle {
          font-size: 13px;
          color: var(--muted);
          line-height: 1.5;
        }

        .package-body {
          padding: 24px;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* Price Section */
        .price-section {
          background: linear-gradient(135deg, rgba(201, 162, 39, 0.08) 0%, rgba(231, 206, 122, 0.04) 100%);
          border: 1px solid rgba(201, 162, 39, 0.15);
          border-radius: 12px;
          padding: 16px;
        }

        .price-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 8px;
        }

        .price-display {
          font-size: 28px;
          font-weight: 800;
          color: var(--gold);
          line-height: 1;
          margin-bottom: 4px;
        }

        .price-note {
          font-size: 11px;
          color: var(--muted);
        }

        /* Specs Grid */
        .specs-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .spec-item {
          background: rgba(11, 31, 58, 0.04);
          border: 1px solid rgba(11, 31, 58, 0.08);
          border-radius: 8px;
          padding: 12px;
        }

        .spec-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 6px;
        }

        .spec-value {
          font-size: 14px;
          font-weight: 700;
          color: var(--navy);
        }

        /* Privileges Section */
        .privileges-section {
          border-top: 1px solid rgba(201, 162, 39, 0.1);
          padding-top: 16px;
        }

        .privileges-title {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--navy);
          margin-bottom: 12px;
        }

        .privileges-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .privilege-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 13px;
          color: var(--ink);
          line-height: 1.5;
        }

        .privilege-check {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: linear-gradient(135deg, #C9A227, #E7CE7A);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .privilege-check svg {
          width: 10px;
          height: 10px;
          color: white;
          stroke-width: 3;
        }

        /* CTA Button */
        .package-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: linear-gradient(135deg, #C9A227, #E7CE7A);
          color: #0B1F3A;
          border: none;
          padding: 14px 24px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 4px 16px rgba(201, 162, 39, 0.2);
          margin-top: auto;
        }

        .package-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(201, 162, 39, 0.3);
          background: linear-gradient(135deg, #E7CE7A, #F0D878);
        }

        /* Mobile */
        @media (max-width: 768px) {
          .detail-header { padding: 40px 0 60px; }
          .header-meta { flex-direction: column; align-items: flex-start; }
          .tabs-nav { gap: 16px; }
          .package-card { border-radius: 12px; }
          .package-body { padding: 16px; }
          .package-header { padding: 16px; }
          .specs-grid { grid-template-columns: repeat(2, 1fr); }
        }

        /* Banner Image */
        .event-banner {
          width: 100%;
          aspect-ratio: 16 / 6;
          overflow: hidden;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
          margin-bottom: 60px;
        }

        .event-banner img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          animation: slideInBanner 0.8s ease-out;
        }

        @keyframes slideInBanner {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .event-banner {
            aspect-ratio: 16 / 10;
            margin-bottom: 40px;
            border-radius: 12px;
          }
        }

        @media (max-width: 480px) {
          .event-banner {
            aspect-ratio: 4 / 3;
          }
        }
      `}</style>

      <div className="expo-detail-container">
        {/* Header */}
        <section className="detail-header">
        <div className="wrap">
          <Link href="/expo" className="back-link">
            <ArrowLeft size={16} />
            Back to Events
          </Link>

          <div className="header-content">
            <div style={{ fontSize: '12px', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: '700', color: 'var(--gold2)', marginBottom: '12px' }}>
              {expo.city}
            </div>
            <h1>{expo.name}</h1>

            <div className="header-meta">
              <div className="header-meta-item">{expo.venue}</div>
              <div className="header-meta-item">
                {formatServiceWindow(expo.serviceStart, expo.serviceEnd)}
              </div>
            </div>

            <div className="countdown-large" style={{ marginTop: '20px' }}>
              <CountdownBadge
                serviceStart={expo.serviceStart}
                serviceEnd={expo.serviceEnd}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section style={{ background: '#fff', paddingBottom: '80px' }}>
        <div className="wrap">
          {/* Event Banner */}
          {expo.bannerImage && (
            <div className="event-banner">
              <img
                src={expo.bannerImage}
                alt={`${expo.name} banner`}
                loading="lazy"
              />
            </div>
          )}

          {/* Event Gallery */}
          <ExpoEventGallery eventImages={expo.eventImages} expoName={expo.name} />

          {/* Service Coverage Section */}
          <ExpoServiceCoverage expo={expo} />

          {/* Tabs */}
          <div className="tabs-nav">
            <button
              className={`tab-btn ${activeTab === 'packages' ? 'active' : ''}`}
              onClick={() => setActiveTab('packages')}
            >
              Packages
            </button>
            <button
              className={`tab-btn ${activeTab === 'faqs' ? 'active' : ''}`}
              onClick={() => setActiveTab('faqs')}
            >
              FAQs
            </button>
          </div>

          {/* Packages Tab */}
          <div className={`tab-content ${activeTab === 'packages' ? 'active' : ''}`}>
            <ExpoPackagesSection expo={expo} packages={packages} />
          </div>

          {/* FAQs Tab */}
          <div className={`tab-content ${activeTab === 'faqs' ? 'active' : ''}`}>
            <ExpoFAQ faqs={faqs} expoName={expo.name} />
          </div>

        </div>
      </section>
      </div>
      {/* Custom Quote Section — outside expo-detail-container to prevent CSS reset override */}
      <CustomQuoteSection expo={expo} />
      <SimpleFooter />
    </>
  );
}
