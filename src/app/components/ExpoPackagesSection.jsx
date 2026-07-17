'use client';

import Link from 'next/link';
import { Check, ArrowRight } from 'lucide-react';
import { substituteExpoTokens } from '../lib/expoUtils';
import { trackExpoPackageClick } from '../lib/expoTracking';

const INR = (n) => '₹' + Number(n).toLocaleString('en-IN');

export default function ExpoPackagesSection({ expo, packages }) {
  if (!packages || packages.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 40px' }}>
        <h3 style={{ color: '#0B1F3A', marginBottom: '16px' }}>
          No packages available
        </h3>
        <p style={{ color: '#5C6270' }}>
          Please contact us on WhatsApp for custom arrangements.
        </p>
      </div>
    );
  }

  const handlePackageClick = (pkg) => {
    trackExpoPackageClick(expo.slug, expo.name, pkg.id, pkg.name, pkg.price);
  };

  return (
    <>
      <style>{`
        .expo-packages-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
          gap: 24px;
          margin-bottom: 40px;
        }

        .expo-pkg-card {
          display: flex;
          flex-direction: row;
          border-radius: 16px;
          overflow: hidden;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.96) 100%);
          border: 1px solid rgba(100, 140, 180, 0.25);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6);
          transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
          cursor: pointer;
          position: relative;
        }

        .expo-pkg-card:hover {
          box-shadow: 0 16px 48px rgba(70, 120, 180, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.6);
          transform: translateY(-6px);
          border-color: rgba(70, 120, 180, 0.35);
        }

        .expo-pkg-img-panel {
          position: relative;
          width: 45%;
          min-height: 300px;
          overflow: hidden;
          flex-shrink: 0;
          background: linear-gradient(135deg, #1a3a50 0%, #2a4a60 100%);
        }

        .expo-pkg-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: grayscale(35%) brightness(0.65) contrast(1.15) saturate(0.9);
          transition: transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
          opacity: 0.95;
        }

        .expo-pkg-card:hover .expo-pkg-img {
          transform: scale(1.06);
        }

        .expo-pkg-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(26, 58, 80, 0.25) 60%, rgba(26, 58, 80, 0.55) 100%);
          pointer-events: none;
        }

        .expo-pkg-num {
          position: absolute;
          top: 14px;
          left: 14px;
          font-size: 10px;
          font-weight: black;
          letter-spacing: 0.18em;
          color: rgba(255, 255, 255, 0.35);
          z-index: 2;
        }

        .expo-pkg-content {
          flex: 1;
          padding: 28px;
          display: flex;
          flex-direction: column;
          color: #1a2a35;
          position: relative;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0) 0%, rgba(100, 140, 180, 0.02) 100%);
        }

        .expo-pkg-tag {
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          background: linear-gradient(135deg, #4a7aaa, #5a8aba);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .expo-pkg-name {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 22px;
          font-weight: 700;
          color: #0a1a28;
          line-height: 1.3;
          margin-bottom: 12px;
          background: linear-gradient(135deg, #0a1a28 0%, #2a4a5a 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .expo-pkg-price-box {
          background: linear-gradient(135deg, rgba(70, 120, 180, 0.08) 0%, rgba(100, 140, 200, 0.05) 100%);
          border: 1.5px solid rgba(100, 140, 180, 0.2);
          border-radius: 10px;
          padding: 14px;
          margin-bottom: 18px;
          backdrop-filter: blur(4px);
        }

        .expo-pkg-price-comparison {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 8px;
        }

        .expo-pkg-price-old {
          display: flex;
          flex-direction: column;
          align-items: center;
          font-size: 10px;
          opacity: 0.65;
          color: #5a6a7a;
        }

        .expo-pkg-price-old-val {
          font-size: 13px;
          font-weight: 900;
          text-decoration: line-through;
          color: #6a7a8a;
        }

        .expo-pkg-price-arrow {
          font-size: 14px;
          color: #6a9aaa;
          font-weight: bold;
        }

        .expo-pkg-price-current {
          text-align: right;
        }

        .expo-pkg-price-val {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 26px;
          font-weight: 800;
          background: linear-gradient(135deg, #1a4a6a, #3a6a8a);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
        }

        .expo-pkg-price-gst {
          font-size: 7px;
          color: #6a8a9a;
          opacity: 0.75;
          font-weight: 600;
        }

        .expo-pkg-stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 18px;
        }

        .expo-pkg-stat {
          background: linear-gradient(135deg, rgba(70, 120, 180, 0.08) 0%, rgba(100, 140, 200, 0.04) 100%);
          border: 1px solid rgba(100, 140, 180, 0.15);
          border-radius: 9px;
          padding: 11px;
          transition: all 0.3s ease;
        }

        .expo-pkg-card:hover .expo-pkg-stat {
          border-color: rgba(100, 140, 180, 0.25);
          background: linear-gradient(135deg, rgba(70, 120, 180, 0.12) 0%, rgba(100, 140, 200, 0.08) 100%);
        }

        .expo-pkg-stat-label {
          font-size: 7px;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #5a7a8a;
          margin-bottom: 4px;
        }

        .expo-pkg-stat-value {
          font-size: 13px;
          font-weight: 700;
          color: #1a4a6a;
          line-height: 1.2;
        }

        .expo-pkg-privs {
          margin-bottom: 18px;
          border-top: 1.5px solid rgba(100, 140, 180, 0.12);
          padding-top: 14px;
        }

        .expo-pkg-priv {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 9px;
          font-size: 11px;
          line-height: 1.5;
          color: #3a4a5a;
        }

        .expo-pkg-priv-check {
          flex-shrink: 0;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(70, 120, 180, 0.12) 0%, rgba(100, 140, 200, 0.08) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 1px;
          border: 1.5px solid rgba(100, 140, 180, 0.25);
        }

        .expo-pkg-priv-text {
          color: #2a3a48;
          font-weight: 500;
        }

        .expo-pkg-cta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 14px 18px;
          background: linear-gradient(135deg, #4a7aaa 0%, #5a8aba 50%, #6a9aca 100%);
          color: #ffffff;
          font-weight: 800;
          font-size: 12px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          box-shadow: 0 6px 20px rgba(70, 120, 180, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2);
          margin-top: auto;
          position: relative;
          overflow: hidden;
        }

        .expo-pkg-cta::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          animation: shine 3s ease-in-out infinite;
        }

        @keyframes shine {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        .expo-pkg-cta:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 32px rgba(70, 120, 180, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.2);
          background: linear-gradient(135deg, #5a8aba 0%, #6a9aca 50%, #7aaa da 100%);
        }

        @media (max-width: 768px) {
          .expo-packages-container {
            grid-template-columns: 1fr;
          }

          .expo-pkg-card {
            flex-direction: column;
          }

          .expo-pkg-img-panel {
            width: 100%;
            min-height: 240px;
          }

          .expo-pkg-content {
            padding: 20px;
          }

          .expo-pkg-name {
            font-size: 19px;
          }

          .expo-pkg-price-val {
            font-size: 23px;
          }

          .expo-pkg-stats {
            gap: 10px;
          }

          .expo-pkg-priv {
            margin-bottom: 7px;
            font-size: 10px;
          }

          .expo-pkg-cta {
            padding: 12px 16px;
            font-size: 11px;
          }
        }
      `}</style>

      <h2 style={{ marginBottom: '36px', marginTop: '0', fontSize: '24px', fontWeight: '700', color: '#0B1F3A' }}>
        Choose Your Package
      </h2>

      <div className="expo-packages-container">
        {packages.map((pkg, idx) => {
          const privileges = (pkg.privileges || []).map((priv) => ({
            ...priv,
            desc: substituteExpoTokens(priv.desc || '', expo),
          }));

          return (
            <div key={pkg.id} className="expo-pkg-card">
              {/* Image Panel */}
              <div className="expo-pkg-img-panel">
                <img
                  src={pkg.image}
                  alt={pkg.name}
                  className="expo-pkg-img"
                />
                <div className="expo-pkg-overlay" />
                <span className="expo-pkg-num">{pkg.packageNo}</span>
              </div>

              {/* Content Panel */}
              <div className="expo-pkg-content">
                <div className="expo-pkg-tag">
                  <span>{pkg.tag || 'EXPO PACKAGE'}</span>
                </div>

                <div className="expo-pkg-name">{pkg.name}</div>

                {/* Price Box */}
                <div className="expo-pkg-price-box">
                  <div className="expo-pkg-price-comparison">
                    <div className="expo-pkg-price-old">
                      <span style={{ fontSize: '8px', marginBottom: '2px' }}>REGULAR</span>
                      <span className="expo-pkg-price-old-val">{INR(pkg.anchorPrice || pkg.price * 1.3)}</span>
                    </div>
                    <div className="expo-pkg-price-arrow">→</div>
                    <div className="expo-pkg-price-current">
                      <div className="expo-pkg-price-val">{INR(pkg.price)}*</div>
                      <div className="expo-pkg-price-gst">GST 18% Extra</div>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="expo-pkg-stats">
                  <div className="expo-pkg-stat">
                    <div className="expo-pkg-stat-label">Trips / Year</div>
                    <div className="expo-pkg-stat-value">{pkg.trips} {pkg.trips === 1 ? 'Trip' : 'Trips'}</div>
                  </div>
                  <div className="expo-pkg-stat">
                    <div className="expo-pkg-stat-label">Vehicle</div>
                    <div className="expo-pkg-stat-value">{pkg.vehicleType}</div>
                  </div>
                  <div className="expo-pkg-stat">
                    <div className="expo-pkg-stat-label">Security</div>
                    <div className="expo-pkg-stat-value">{pkg.bodyguard || 'Standard'}</div>
                  </div>
                  <div className="expo-pkg-stat">
                    <div className="expo-pkg-stat-label">Validity</div>
                    <div className="expo-pkg-stat-value">{pkg.validity}</div>
                  </div>
                </div>

                {/* Privileges */}
                <div className="expo-pkg-privs">
                  {privileges.slice(0, 3).map((priv, i) => (
                    <div key={i} className="expo-pkg-priv">
                      <div className="expo-pkg-priv-check">
                        <Check size={10} strokeWidth={3} color="#c9a24b" />
                      </div>
                      <div className="expo-pkg-priv-text">{priv.title}</div>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Link
                  href={`/booking/${pkg.id}?expo=${expo.slug}`}
                  className="expo-pkg-cta"
                  onClick={() => handlePackageClick(pkg)}
                >
                  Book Expo Arrival
                  <ArrowRight size={12} strokeWidth={2.5} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
