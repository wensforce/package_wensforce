'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function ExpoEventGallery({ eventImages, expoName }) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [mobileSliderIndex, setMobileSliderIndex] = useState(0);

  if (!eventImages || eventImages.length === 0) return null;

  const goToPrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? eventImages.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setSelectedIndex((prev) => (prev === eventImages.length - 1 ? 0 : prev + 1));
  };

  const goToMobilePrevious = () => {
    setMobileSliderIndex((prev) => (prev === 0 ? eventImages.length - 1 : prev - 1));
  };

  const goToMobileNext = () => {
    setMobileSliderIndex((prev) => (prev === eventImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <style>{`
        .event-gallery-section {
          padding: 60px 0;
          background: linear-gradient(135deg, rgba(247, 246, 242, 0.5) 0%, rgba(255, 255, 255, 0.98) 100%);
          border-top: 1px solid var(--line);
        }

        .gallery-wrap {
          max-width: 1220px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .gallery-header {
          text-align: center;
          margin-bottom: 50px;
        }

        .gallery-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(28px, 4vw, 42px);
          font-weight: 700;
          color: var(--navy);
          margin-bottom: 12px;
        }

        .gallery-subtitle {
          font-size: 15px;
          color: var(--muted);
          line-height: 1.6;
        }

        /* Slider - Hidden on Desktop */
        .gallery-slider {
          display: none;
        }

        /* Grid Gallery */
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
          margin-bottom: 40px;
        }

        .gallery-item {
          position: relative;
          overflow: hidden;
          border-radius: 16px;
          aspect-ratio: 16 / 10;
          cursor: pointer;
          background: var(--navy);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          border: 1px solid rgba(201, 162, 39, 0.2);
        }

        .gallery-item:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 32px rgba(201, 162, 39, 0.2);
          border-color: rgba(201, 162, 39, 0.4);
        }

        .gallery-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .gallery-item:hover img {
          transform: scale(1.08);
        }

        .gallery-overlay {
          position: absolute;
          inset: 0;
          background: rgba(11, 31, 58, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .gallery-item:hover .gallery-overlay {
          opacity: 1;
        }

        .gallery-icon {
          width: 50px;
          height: 50px;
          background: var(--gold);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--navy);
        }

        /* Lightbox */
        .lightbox-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999;
          padding: 20px;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .lightbox-content {
          position: relative;
          max-width: 90vw;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        .lightbox-image {
          max-width: 100%;
          max-height: 70vh;
          border-radius: 12px;
          box-shadow: 0 20px 60px rgba(201, 162, 39, 0.3);
        }

        .lightbox-nav {
          display: flex;
          align-items: center;
          gap: 30px;
          justify-content: center;
        }

        .lightbox-btn {
          width: 48px;
          height: 48px;
          background: rgba(201, 162, 39, 0.2);
          border: 1px solid rgba(201, 162, 39, 0.5);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--gold);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .lightbox-btn:hover {
          background: rgba(201, 162, 39, 0.3);
          border-color: var(--gold);
          transform: scale(1.1);
        }

        .lightbox-counter {
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          min-width: 80px;
          text-align: center;
        }

        .lightbox-close {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 40px;
          height: 40px;
          background: rgba(201, 162, 39, 0.2);
          border: 1px solid rgba(201, 162, 39, 0.5);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--gold);
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 1000;
        }

        .lightbox-close:hover {
          background: rgba(201, 162, 39, 0.3);
          transform: scale(1.1);
        }

        /* Mobile */
        @media (max-width: 768px) {
          .event-gallery-section {
            padding: 30px 0;
          }

          .gallery-wrap {
            padding: 0 16px;
          }

          .gallery-header {
            margin-bottom: 30px;
          }

          .gallery-title {
            font-size: 22px;
            margin-bottom: 8px;
          }

          .gallery-subtitle {
            font-size: 13px;
          }

          .gallery-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            margin-bottom: 20px;
          }

          .gallery-item {
            aspect-ratio: 4 / 3;
          }

          .lightbox-content {
            gap: 15px;
          }

          .lightbox-image {
            max-height: 50vh;
          }

          .lightbox-nav {
            gap: 20px;
          }

          .lightbox-btn {
            width: 40px;
            height: 40px;
          }
        }

        @media (max-width: 480px) {
          .event-gallery-section {
            padding: 20px 0;
          }

          .gallery-wrap {
            padding: 0 12px;
          }

          .gallery-header {
            margin-bottom: 20px;
          }

          .gallery-title {
            font-size: 18px;
            margin-bottom: 6px;
          }

          .gallery-subtitle {
            font-size: 12px;
          }

          .gallery-grid {
            display: none;
          }

          .gallery-slider {
            display: flex;
            flex-direction: column;
            gap: 15px;
          }

          .gallery-slider-container {
            position: relative;
            width: 100%;
            border-radius: 12px;
            overflow: hidden;
            background: var(--navy);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
          }

          .gallery-slider-image {
            width: 100%;
            aspect-ratio: 3 / 2;
            object-fit: cover;
            display: block;
          }

          .gallery-slider-nav {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
          }

          .gallery-slider-btn {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, rgba(201, 162, 39, 0.2) 0%, rgba(201, 162, 39, 0.1) 100%);
            border: 1px solid rgba(201, 162, 39, 0.4);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--gold);
            cursor: pointer;
            transition: all 0.3s ease;
            flex-shrink: 0;
          }

          .gallery-slider-btn:active {
            transform: scale(0.95);
            background: rgba(201, 162, 39, 0.3);
          }

          .gallery-slider-counter {
            flex: 1;
            text-align: center;
            font-size: 12px;
            font-weight: 600;
            color: var(--navy);
            background: linear-gradient(135deg, rgba(201, 162, 39, 0.1) 0%, rgba(201, 162, 39, 0.05) 100%);
            border: 1px solid rgba(201, 162, 39, 0.2);
            border-radius: 6px;
            padding: 8px;
          }

          .gallery-slider-dots {
            display: flex;
            justify-content: center;
            gap: 6px;
          }

          .gallery-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: rgba(201, 162, 39, 0.3);
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .gallery-dot.active {
            background: var(--gold);
            width: 24px;
            border-radius: 4px;
          }
        }
      `}</style>

      <section className="event-gallery-section">
        <div className="gallery-wrap">
          {/* Header */}
          <div className="gallery-header">
            <h2 className="gallery-title">Event Gallery</h2>
            <p className="gallery-subtitle">
              Experience the atmosphere and grandeur of {expoName}
            </p>
          </div>

          {/* Grid */}
          <div className="gallery-grid">
            {eventImages.map((image, idx) => (
              <div
                key={idx}
                className="gallery-item"
                onClick={() => setSelectedIndex(idx)}
              >
                <img src={image} alt={`${expoName} event photo ${idx + 1}`} />
                <div className="gallery-overlay">
                  <div className="gallery-icon">
                    <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Slider */}
          <div className="gallery-slider">
            <div className="gallery-slider-container">
              <img
                src={eventImages[mobileSliderIndex]}
                alt={`${expoName} event photo ${mobileSliderIndex + 1}`}
                className="gallery-slider-image"
              />
            </div>

            <div className="gallery-slider-nav">
              <button
                className="gallery-slider-btn"
                onClick={goToMobilePrevious}
                aria-label="Previous image"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="gallery-slider-counter">
                {mobileSliderIndex + 1} / {eventImages.length}
              </div>

              <button
                className="gallery-slider-btn"
                onClick={goToMobileNext}
                aria-label="Next image"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <div className="gallery-slider-dots">
              {eventImages.map((_, idx) => (
                <div
                  key={idx}
                  className={`gallery-dot ${idx === mobileSliderIndex ? 'active' : ''}`}
                  onClick={() => setMobileSliderIndex(idx)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedIndex !== null && (
        <div className="lightbox-overlay" onClick={() => setSelectedIndex(null)}>
          <div className="lightbox-close" onClick={() => setSelectedIndex(null)}>
            <X size={24} />
          </div>

          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={eventImages[selectedIndex]}
              alt={`${expoName} event photo ${selectedIndex + 1}`}
              className="lightbox-image"
            />

            <div className="lightbox-nav">
              <button
                className="lightbox-btn"
                onClick={goToPrevious}
                aria-label="Previous image"
              >
                <ChevronLeft size={24} />
              </button>

              <div className="lightbox-counter">
                {selectedIndex + 1} / {eventImages.length}
              </div>

              <button
                className="lightbox-btn"
                onClick={goToNext}
                aria-label="Next image"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
