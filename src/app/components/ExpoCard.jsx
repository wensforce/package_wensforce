'use client';

import Link from 'next/link';
import { ChevronRight, MapPin, Calendar } from 'lucide-react';
import { formatDateRange, calculateCountdown } from '../lib/expoUtils';
import { trackExpoCardClick } from '../lib/expoTracking';
import CountdownBadge from './CountdownBadge';

export default function ExpoCard({ expo }) {
  const handleClick = () => {
    trackExpoCardClick(expo.slug, expo.name, 'hub_card');
  };

  return (
    <>
      <style>{`
        .card { 
          background: #fff; 
          border: 1px solid #E4E1D8; 
          border-radius: 14px; 
          overflow: hidden;
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .card:hover { 
          box-shadow: 0 14px 34px rgba(11, 31, 58, 0.10);
          transform: translateY(-2px);
        }
        .card-image { 
          width: 100%; 
          height: 200px; 
          object-fit: cover; 
          background: #f0f0f0;
        }
        .card-content { 
          padding: 24px; 
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .card-city { 
          font-size: 11px; 
          letter-spacing: 0.14em; 
          text-transform: uppercase; 
          font-weight: 700; 
          color: #C9A227; 
          margin-bottom: 8px;
        }
        .card-name { 
          font-family: 'Helvetica Neue', Helvetica, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 18px; 
          font-weight: 600;
          color: #0B1F3A; 
          line-height: 1.3;
          margin-bottom: 12px;
        }
        .card-meta { 
          font-size: 13px; 
          color: #5C6270; 
          margin-bottom: 16px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .card-meta-item {
          display: flex;
          gap: 8px;
          align-items: flex-start;
        }
        .card-meta-item svg {
          flex-shrink: 0;
          margin-top: 2px;
        }
        .card-countdown { 
          margin-top: auto;
          margin-bottom: 16px;
        }
        .card-cta { 
          display: inline-flex; 
          align-items: center; 
          gap: 6px; 
          background: #0B1F3A;
          color: #fff; 
          font-weight: 600; 
          font-size: 13px;
          padding: 10px 14px; 
          border-radius: 8px; 
          text-decoration: none; 
          transition: all 0.2s ease;
          width: fit-content;
        }
        .card-cta:hover { 
          background: #122B4E;
          gap: 10px;
        }
      `}</style>

      <div className="card">
        {expo.cardImage && (
          <img
            src={expo.cardImage}
            alt={expo.name}
            className="card-image"
          />
        )}
        <div className="card-content">
          <div className="card-city">{expo.city}</div>
          <h3 className="card-name">{expo.name}</h3>
          <div className="card-meta">
            <div className="card-meta-item">
              <Calendar size={14} />
              <span>{formatDateRange(expo.eventStart, expo.eventEnd)}</span>
            </div>
            <div className="card-meta-item">
              <MapPin size={14} />
              <span>{expo.venue}</span>
            </div>
          </div>
          <div className="card-countdown">
            <CountdownBadge
              serviceStart={expo.serviceStart}
              serviceEnd={expo.serviceEnd}
            />
          </div>
          <Link
            href={`/expo/${expo.slug}`}
            className="card-cta"
            onClick={handleClick}
          >
            View Packages <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </>
  );
}
