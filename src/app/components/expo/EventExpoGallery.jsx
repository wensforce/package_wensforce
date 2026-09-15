"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Film, Play, X } from "lucide-react";

function normalizeImages(eventImages, heroImages) {
  const fromEvent = Array.isArray(eventImages) ? eventImages : [];
  const fromHero = Array.isArray(heroImages) ? heroImages : [];
  return [...new Set([...fromEvent, ...fromHero].filter(Boolean))];
}

function buildGalleryMedia(eventImages, eventVideos, heroImages) {
  const images = normalizeImages(eventImages, heroImages);
  const videos = Array.isArray(eventVideos)
    ? [...new Set(eventVideos.filter(Boolean))]
    : [];

  const items = [
    ...images.map((url) => ({ type: "image", url })),
    ...videos.map((url) => ({ type: "video", url })),
  ];
  return items;
}

export default function EventExpoGallery({
  eventImages = [],
  eventVideos = [],
  heroImages = [],
  expoName = "Event",
}) {
  const media = useMemo(
    () => buildGalleryMedia(eventImages, eventVideos, heroImages),
    [eventImages, eventVideos, heroImages],
  );
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const showPrev = useCallback(() => {
    setLightboxIndex((i) =>
      i == null ? null : (i - 1 + media.length) % media.length,
    );
  }, [media.length]);

  const showNext = useCallback(() => {
    setLightboxIndex((i) => (i == null ? null : (i + 1) % media.length));
  }, [media.length]);

  useEffect(() => {
    if (lightboxIndex == null) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, closeLightbox, showPrev, showNext]);

  if (media.length === 0) {
    return null;
  }

  const active = lightboxIndex != null ? media[lightboxIndex] : null;

  return (
    <section className="event-expo-gallery" aria-label="Event gallery">
      <style>{`
        .event-expo-gallery {
          margin-bottom: 56px;
        }
        .event-expo-gallery-header {
          margin-bottom: 28px;
        }
        .event-expo-gallery-header h2 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(24px, 3vw, 32px);
          font-weight: 700;
          color: var(--navy, #0B1F3A);
          margin-bottom: 8px;
        }
        .event-expo-gallery-header p {
          font-size: 15px;
          color: var(--muted, #5C6270);
          line-height: 1.5;
          max-width: 560px;
        }
        .event-expo-gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 16px;
        }
        .event-expo-gallery-item {
          position: relative;
          aspect-ratio: 4 / 3;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(100, 140, 180, 0.2);
          cursor: pointer;
          background: #f4f4f0;
          padding: 0;
        }
        .event-expo-gallery-item img,
        .event-expo-gallery-item video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.35s ease;
          pointer-events: none;
        }
        .event-expo-gallery-item:hover img,
        .event-expo-gallery-item:hover video {
          transform: scale(1.06);
        }
        .event-expo-gallery-item:focus-visible {
          outline: 2px solid #C9A227;
          outline-offset: 2px;
        }
        .event-expo-video-badge {
          position: absolute;
          bottom: 10px;
          left: 10px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 999px;
          background: rgba(11, 31, 58, 0.75);
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .event-expo-video-play {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }
        .event-expo-video-play span {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(255,255,255,0.92);
          color: #0B1F3A;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 24px rgba(0,0,0,0.2);
        }
        .event-expo-lightbox {
          position: fixed;
          inset: 0;
          z-index: 100;
          background: rgba(11, 31, 58, 0.92);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }
        .event-expo-lightbox img,
        .event-expo-lightbox video {
          max-width: min(1100px, 100%);
          max-height: 85vh;
          object-fit: contain;
          border-radius: 8px;
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.45);
        }
        .event-expo-lightbox-close {
          position: absolute;
          top: 20px;
          right: 20px;
          color: #fff;
          background: rgba(255,255,255,0.12);
          border: none;
          border-radius: 999px;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .event-expo-lightbox-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          color: #fff;
          background: rgba(255,255,255,0.12);
          border: none;
          border-radius: 999px;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .event-expo-lightbox-nav.prev { left: 20px; }
        .event-expo-lightbox-nav.next { right: 20px; }
        .event-expo-lightbox-counter {
          position: absolute;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          color: rgba(255,255,255,0.85);
          font-size: 13px;
          font-weight: 600;
        }
        @media (max-width: 640px) {
          .event-expo-gallery-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
          .event-expo-lightbox-nav { display: none; }
        }
      `}</style>

      <div className="event-expo-gallery-header">
        <h2>Event gallery</h2>
        <p>
          Photos and videos from {expoName} — tap to view full size or play.
        </p>
      </div>

      <div className="event-expo-gallery-grid">
        {media.map((item, index) => (
          <button
            key={`${item.type}-${item.url}-${index}`}
            type="button"
            className="event-expo-gallery-item"
            onClick={() => setLightboxIndex(index)}
            aria-label={
              item.type === "video"
                ? `Play video ${index + 1} of ${media.length}`
                : `View photo ${index + 1} of ${media.length}`
            }
          >
            {item.type === "image" ? (
              <img
                src={item.url}
                alt={`${expoName} — photo ${index + 1}`}
                loading="lazy"
              />
            ) : (
              <>
                <video src={item.url} muted preload="metadata" />
                <span className="event-expo-video-badge">
                  <Film size={12} />
                  Video
                </span>
                <span className="event-expo-video-play">
                  <span>
                    <Play size={22} fill="currentColor" />
                  </span>
                </span>
              </>
            )}
          </button>
        ))}
      </div>

      {active && (
        <div
          className="event-expo-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Gallery preview"
          onClick={closeLightbox}
        >
          <button
            type="button"
            className="event-expo-lightbox-close"
            onClick={closeLightbox}
            aria-label="Close"
          >
            <X size={22} />
          </button>
          {media.length > 1 && (
            <>
              <button
                type="button"
                className="event-expo-lightbox-nav prev"
                onClick={(e) => {
                  e.stopPropagation();
                  showPrev();
                }}
                aria-label="Previous"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                type="button"
                className="event-expo-lightbox-nav next"
                onClick={(e) => {
                  e.stopPropagation();
                  showNext();
                }}
                aria-label="Next"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
          {active.type === "image" ? (
            <img
              src={active.url}
              alt={`${expoName} — photo`}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <video
              src={active.url}
              controls
              autoPlay
              playsInline
              onClick={(e) => e.stopPropagation()}
            />
          )}
          <span className="event-expo-lightbox-counter">
            {lightboxIndex + 1} / {media.length}
          </span>
        </div>
      )}
    </section>
  );
}
