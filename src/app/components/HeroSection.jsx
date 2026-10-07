"use client";

import { Fragment } from "react";
import { trackWhatsAppClick } from "../lib/whatsappLead";
import { useRouter } from "next/navigation";

const ANNOUNCEMENT_STYLES = [
  "text-white/70",
  "text-white/90 font-medium",
  "text-white/55 hidden sm:inline",
];

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 32 32"
      width="17"
      height="17"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.668 4.799 1.836 6.793L2 30l7.393-1.812A13.918 13.918 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2z" />
    </svg>
  );
}

export default function HeroSection({
  videoUrl,
  posterUrl,
  announcement = [],
  eyebrow,
  heading = [],
  addon,
  license,
  subtitle,
  ctas = [],
  trustItems = [],
}) {
  const router = useRouter();
  const [leadLine, accentLine] = heading;
  const showAddon = Boolean(addon?.value);

  function handleCta(href) {
    if (href.startsWith("#")) {
      document.getElementById(href.slice(1))?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    if (/^https?:\/\//.test(href)) {
      window.open(trackWhatsAppClick(href), "_blank", "noopener,noreferrer");
      return;
    }
    router.push(href);
  }



  return (
    <>
      <style>{`
        @keyframes goldenPulse {
          0%, 100% { box-shadow: 0 0 0 1px rgba(201,162,75,.4), 0 0 20px rgba(201,162,75,.25), 0 0 40px rgba(201,162,75,.12); }
          50% { box-shadow: 0 0 0 2px rgba(201,162,75,.8), 0 0 30px rgba(201,162,75,.35), 0 0 60px rgba(201,162,75,.2); }
        }
        @keyframes goldenFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        @keyframes goldenShine {
          from { background-position: 0% 50%; }
          to { background-position: 200% 50%; }
        }
        .golden-cta {
          background: linear-gradient(100deg, #b8882e 0%, #e8c56a 40%, #f5d98a 55%, #e0b84a 75%, #b8882e 100%);
          background-size: 200% auto;
          animation: goldenShine 3s linear infinite, goldenFloat 3s ease-in-out infinite, goldenPulse 2.5s ease-in-out infinite;
          transition: filter .2s ease;
        }
        .golden-cta:hover {
          filter: brightness(1.12);
        }
      `}</style>

      {announcement.length > 0 && (
        <div
          style={{ backgroundColor: "#0B1E3F" }}
          className="text-white py-1 md:py-2.5 px-6 text-center relative z-10"
        >
          <div className="max-w-6xl mx-auto flex items-center justify-center gap-2 text-xs flex-wrap">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A24B] inline-block" />
            {announcement.map((item, index) => (
              <Fragment key={`${item}-${index}`}>
                {index > 0 && (
                  <span
                    className={
                      index > 1
                        ? "text-white/40 hidden sm:inline"
                        : "text-[#C9A24B] font-semibold"
                    }
                  >
                    {index > 1 ? "—" : "·"}
                  </span>
                )}
                <span
                  className={
                    ANNOUNCEMENT_STYLES[
                      Math.min(index, ANNOUNCEMENT_STYLES.length - 1)
                    ]
                  }
                >
                  {item}
                </span>
              </Fragment>
            ))}
          </div>
        </div>
      )}

      <section className="relative overflow-hidden min-h-screen flex items-center justify-center px-6 md:py-20 py-10 pt-1">
        {videoUrl && (
          <video
            autoPlay
            muted
            loop
            playsInline            
            preload="metadata"     
            poster={posterUrl}
            className="absolute inset-0 w-full h-full object-cover"
            src={videoUrl}
          />
        )}

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(11,30,63,.82) 0%, rgba(11,30,63,.65) 50%, rgba(11,30,63,.88) 100%)",
          }}
        />

        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #C9A24B 1px, transparent 0)",
            backgroundSize: "36px 36px",
          }}
        />

        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, transparent, rgba(11,30,63,.6))",
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {eyebrow && (
            <p className="text-[#C9A24B] text-[10px] tracking-[0.45em] uppercase font-semibold mb-5">
              {eyebrow}
            </p>
          )}

          {(leadLine || accentLine || showAddon) && (
            <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.08] mb-6 tracking-tight">
              {leadLine}
              {accentLine && (
                <>
                  <br />
                  <span
                    className="text-transparent bg-clip-text"
                    style={{
                      backgroundImage:
                        "linear-gradient(90deg, #C9A24B, #f0c940, #C9A24B)",
                    }}
                  >
                    {accentLine}
                  </span>
                </>
              )}
              {showAddon && (
                <>
                  <span className="block text-[#C9A24B] text-[10px] tracking-[0.45em] uppercase mt-2">
                    Added
                  </span>
                  <span className="block text-white text-[18px] tracking-[0.45em] mt-2 uppercase">
                    {addon.value}
                  </span>
                </>
              )}
            </h1>
          )}

          {license?.value && (
            <p className="text-[11px] tracking-[0.06em] text-white/35 -mt-4 mb-8 font-light">
              {license.label}&nbsp;:&nbsp;
              <span className="text-[#C9A24B]/65 font-mono">
                {license.value}
              </span>
            </p>
          )}

          {subtitle && (
            <p className="text-white/60 md:text-lg text-sm font-light mb-10 max-w-4xl mx-auto">
              {subtitle}
            </p>
          )}

          {ctas.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              {ctas.map((cta) => {
                const isPrimary = cta.variant !== "secondary";
                const showWhatsApp =
                  Boolean(cta.showWhatsApp) ||
                  /wa\.me|whatsapp/i.test(cta.url || "");
                return (
                  <button
                    type="button"
                    key={`${cta.text}-${cta.url}`}
                    onClick={() => handleCta(cta.url)}
                    className={
                      isPrimary
                        ? "golden-cta flex items-center gap-2.5 py-4 px-9 rounded-full font-semibold text-black text-sm"
                        : "flex items-center gap-2 border-2 border-white/20 text-white font-semibold py-4 px-9 rounded-full text-sm hover:border-[#C9A24B]/60 hover:text-[#C9A24B] transition-all"
                    }
                  >
                    {showWhatsApp && <WhatsAppIcon />}
                    {cta.text}
                    {!showWhatsApp && (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {trustItems.length > 0 && (
            <div className="flex items-center justify-center gap-5 text-white/60 text-xs flex-wrap">
              {trustItems.map((item, index) => (
                <Fragment key={`${item}-${index}`}>
                  {index > 0 && <span>·</span>}
                  <span>✓ {item}</span>
                </Fragment>
              ))}
            </div>
          )}
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40">
          <span className="text-white text-[9px] tracking-[0.3em] uppercase">
            Scroll
          </span>
          <svg
            className="w-4 h-4 text-white animate-bounce"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </section>
    </>
  );
}
