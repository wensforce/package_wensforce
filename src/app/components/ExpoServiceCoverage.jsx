'use client';

import { MapPin, Plane, MapPinCheck, Clock, Users, Shield } from 'lucide-react';

export default function ExpoServiceCoverage({ expo }) {
  // Get airport and coverage data from expo object
  const airport = expo.airport || {
    code: 'N/A',
    name: 'Airport information',
    distance: 'Varies',
    travelTime: 'Varies',
  };

  const coverage = expo.coverage || {
    pickupPoints: ['Multiple pickup locations'],
    dropLocation: expo.venue,
    serviceArea: `${expo.city} metropolitan area`,
    amenities: ['Professional services', '24x7 support'],
  };

  const features = [
    { icon: Plane, label: 'Airport Pickup', desc: `From ${airport.name}` },
    { icon: MapPinCheck, label: 'Event Venue Drop', desc: `Direct to ${expo.venue}` },
    { icon: Clock, label: '24x7 Service', desc: 'Round the clock availability' },
    { icon: Users, label: 'Professional Team', desc: 'Dedicated relationship manager' },
    { icon: Shield, label: 'Flight Tracking', desc: 'Real-time flight monitoring' },
    { icon: MapPin, label: 'Multi-Stop Support', desc: 'Flexible route customization' },
  ];

  return (
    <section style={{ background: '#fff', padding: '60px 0', borderTop: '1px solid var(--line)' }}>
      <style>{`
        .coverage-wrap { max-width: 1220px; margin: 0 auto; padding: 0 24px; }
        
        .coverage-header {
          text-align: center;
          margin-bottom: 50px;
        }

        .coverage-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(28px, 4vw, 42px);
          font-weight: 700;
          color: var(--navy);
          margin-bottom: 12px;
        }

        .coverage-subtitle {
          font-size: 16px;
          color: var(--muted);
          line-height: 1.6;
        }

        /* Features Grid */
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 24px;
          margin-bottom: 50px;
        }

        .feature-card {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.96) 100%);
          border: 1px solid rgba(100, 140, 180, 0.25);
          border-radius: 16px;
          padding: 28px;
          text-align: center;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
        }

        .feature-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 28px rgba(100, 140, 180, 0.15);
          border-color: rgba(100, 140, 180, 0.4);
        }

        .feature-icon {
          width: 48px;
          height: 48px;
          margin: 0 auto 16px;
          background: linear-gradient(135deg, rgba(74, 122, 170, 0.1) 0%, rgba(90, 138, 170, 0.08) 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #4a7aaa;
        }

        .feature-label {
          font-weight: 700;
          font-size: 14px;
          color: var(--navy);
          margin-bottom: 8px;
          display: block;
        }

        .feature-desc {
          font-size: 12px;
          color: var(--muted);
          line-height: 1.5;
        }

        /* Airport Info */
        .airport-section {
          background: linear-gradient(135deg, rgba(74, 122, 170, 0.08) 0%, rgba(248, 250, 252, 0.98) 100%);
          border: 1px solid rgba(100, 140, 180, 0.25);
          border-radius: 20px;
          padding: 40px;
          margin-bottom: 40px;
        }

        .airport-header {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 40px;
          margin-bottom: 40px;
        }

        .airport-item {
          padding-bottom: 20px;
          border-bottom: 2px solid rgba(100, 140, 180, 0.15);
        }

        .airport-item-last {
          border-bottom: none;
        }

        .airport-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #4a7aaa;
          margin-bottom: 8px;
          display: block;
        }

        .airport-value {
          font-size: 18px;
          font-weight: 700;
          color: var(--navy);
          margin-bottom: 4px;
        }

        .airport-subtext {
          font-size: 12px;
          color: var(--muted);
        }

        .airport-name-full {
          font-size: 14px;
          font-weight: 600;
          color: var(--navy);
          margin-bottom: 8px;
          display: block;
        }

        /* Coverage Details */
        .coverage-details {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }

        .coverage-item {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.96) 100%);
          border: 1px solid rgba(100, 140, 180, 0.2);
          border-radius: 16px;
          padding: 24px;
        }

        .coverage-item-title {
          font-weight: 700;
          font-size: 14px;
          color: var(--navy);
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .coverage-item-title svg {
          width: 18px;
          height: 18px;
          color: #4a7aaa;
        }

        .coverage-item-text {
          font-size: 13px;
          color: var(--ink);
          line-height: 1.6;
          margin-bottom: 12px;
        }

        .coverage-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .coverage-tag {
          background: linear-gradient(135deg, rgba(74, 122, 170, 0.12) 0%, rgba(90, 138, 170, 0.08) 100%);
          border: 1px solid rgba(100, 140, 180, 0.25);
          color: #4a7aaa;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .coverage-wrap { padding: 0 16px; }
          .coverage-title { font-size: 24px; }
          .features-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
          .feature-card { padding: 20px; }
          
          .airport-section { padding: 24px; }
          .airport-header { 
            grid-template-columns: 1fr; 
            gap: 20px; 
          }
          
          .coverage-details { grid-template-columns: 1fr; }
        }

        @media (max-width: 480px) {
          .features-grid { grid-template-columns: 1fr; }
          .airport-header { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="coverage-wrap">
        {/* Header */}
        <div className="coverage-header">
          <h2 className="coverage-title">Our Service Coverage</h2>
          <p className="coverage-subtitle">
            Comprehensive airport-to-venue logistics with real-time tracking and professional coordination
          </p>
        </div>

        {/* Features Grid */}
        <div className="features-grid">
          {features.map((feature, idx) => (
            <div key={idx} className="feature-card">
              <div className="feature-icon">
                <feature.icon size={24} />
              </div>
              <span className="feature-label">{feature.label}</span>
              <span className="feature-desc">{feature.desc}</span>
            </div>
          ))}
        </div>

        {/* Airport Information */}
        <div className="airport-section">
          <div className="airport-header">
            <div className="airport-item">
              <span className="airport-label">📍 Nearest Airport</span>
              <span className="airport-name-full">{airport.name}</span>
              <span className="airport-label" style={{ marginTop: '12px', display: 'block' }}>Airport Code</span>
              <span className="airport-value">{airport.code}</span>
            </div>
            <div className="airport-item">
              <span className="airport-label">📏 Distance to City</span>
              <span className="airport-value">{airport.distance}</span>
              <span className="airport-subtext">Approximate from airport center</span>
            </div>
            <div className="airport-item airport-item-last">
              <span className="airport-label">⏱️ Estimated Travel Time</span>
              <span className="airport-value">{airport.travelTime}</span>
              <span className="airport-subtext">During normal traffic conditions</span>
            </div>
          </div>

          {/* Coverage Details */}
          <div className="coverage-details">
            <div className="coverage-item">
              <div className="coverage-item-title">
                <Plane size={18} />
                Pickup Locations
              </div>
              <p className="coverage-item-text">{coverage.pickupPoints.join(', ')}</p>
              <div className="coverage-tags">
                {coverage.pickupPoints.slice(0, 3).map((point, i) => (
                  <span key={i} className="coverage-tag">{point}</span>
                ))}
              </div>
            </div>

            <div className="coverage-item">
              <div className="coverage-item-title">
                <MapPinCheck size={18} />
                Drop Location
              </div>
              <p className="coverage-item-text">{coverage.dropLocation}</p>
              <div className="coverage-tags">
                <span className="coverage-tag">Event Venue</span>
                <span className="coverage-tag">Direct Drop</span>
              </div>
            </div>

            <div className="coverage-item">
              <div className="coverage-item-title">
                <MapPin size={18} />
                Service Area
              </div>
              <p className="coverage-item-text">{coverage.serviceArea}</p>
              <div className="coverage-tags">
                <span className="coverage-tag">{expo.city}</span>
                <span className="coverage-tag">All Regions</span>
              </div>
            </div>

            <div className="coverage-item">
              <div className="coverage-item-title">
                <Shield size={18} />
                Special Amenities
              </div>
              <p className="coverage-item-text">Premium services tailored for your arrival</p>
              <div className="coverage-tags">
                {coverage.amenities.map((amenity, i) => (
                  <span key={i} className="coverage-tag">{amenity}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
