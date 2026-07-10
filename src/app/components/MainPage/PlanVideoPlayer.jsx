"use client";
import { useRef, useState } from "react";

export default function PlanVideoPlayer({
  videoUrl,
  posterUrl,
  accentColor,
  accentRgb,
  planName,
}) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const handlePlay = () => {
    videoRef.current?.play();
    setPlaying(true);
  };

  return (
    <section className="bg-black w-full overflow-hidden p-2 flex items-center justify-center">
      {/*
        Mobile : h-[100svh] — full viewport, portrait fill
        Desktop: flex-centered with padding; frame is phone-sized 9:16
      */}
      <div className="h-[70vh] aspect-[9/16] md:h-auto md:flex md:items-center md:justify-center md:py-14 lg:py-20 relative">
        {/* Accent glow — desktop only */}
        <div
          className="hidden md:block absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 50% 65% at 50% 50%, rgba(${accentRgb},0.07) 0%, transparent 70%)`,
          }}
        />

        {/*
          plan-video-frame:
            mobile  → h-full w-full (fills 100svh), no aspect-ratio
            desktop → w-[340px] + aspect-ratio:9/16 via media query (height auto)
        */}
        <div
          className="plan-video-frame relative overflow-hidden h-full w-full md:h-auto md:w-[340px] lg:w-[380px] md:rounded-[22px]"
          style={{
            boxShadow:
              "0 32px 80px -8px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.06)",
          }}
        >
          <style>{`@media(min-width:768px){.plan-video-frame{aspect-ratio:9/16}}`}</style>

          <video
            ref={videoRef}
            src={videoUrl}
            poster={posterUrl}
            controls={playing}
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            onEnded={() => setPlaying(false)}
          />

          {!playing && (
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/35 pointer-events-none" />

              <button
                onClick={handlePlay}
                className="absolute inset-0 flex items-center justify-center group"
                aria-label={`Play ${planName} video`}
              >
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: `rgba(${accentRgb},0.18)`,
                    border: `2px solid rgba(${accentRgb},0.55)`,
                    boxShadow: `0 0 60px rgba(${accentRgb},0.22), inset 0 0 24px rgba(${accentRgb},0.06)`,
                  }}
                >
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill={accentColor}
                    style={{ marginLeft: "5px" }}
                  >
                    <polygon points="5,3 19,12 5,21" />
                  </svg>
                </div>
              </button>

              <div className="absolute bottom-8 left-5 right-5 flex items-end justify-between pointer-events-none">
                <div>
                  <p
                    className="text-[9px] font-bold tracking-[0.48em] uppercase mb-1"
                    style={{ color: accentColor }}
                  >
                    Watch
                  </p>
                  <p className="text-white/40 text-xs font-light">{planName}</p>
                </div>
                <div
                  className="flex items-center gap-1.5 text-[10px] font-semibold tracking-widest uppercase px-3.5 py-2 rounded-full backdrop-blur-sm"
                  style={{
                    background: `rgba(${accentRgb},0.14)`,
                    color: accentColor,
                    border: `1px solid rgba(${accentRgb},0.28)`,
                  }}
                >
                  <svg
                    width="9"
                    height="9"
                    viewBox="0 0 24 24"
                    fill={accentColor}
                  >
                    <polygon points="5,3 19,12 5,21" />
                  </svg>
                  Play
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
