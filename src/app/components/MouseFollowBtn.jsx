"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

function isExternal(url) {
  return /^https?:\/\//.test(url || "");
}

export default function MouseFollowBtn({
  text,
  url,
  className = "",
  staticClassName = "bottom-8 left-1/2 -translate-x-1/2",
  children,
}) {
  const zoneRef = useRef(null);
  const btnRef = useRef(null);
  const [follow, setFollow] = useState(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const narrow = window.matchMedia("(max-width: 767px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setFollow(fine.matches && !narrow.matches && !reduce.matches);
    update();
    fine.addEventListener("change", update);
    narrow.addEventListener("change", update);
    reduce.addEventListener("change", update);
    return () => {
      fine.removeEventListener("change", update);
      narrow.removeEventListener("change", update);
      reduce.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (!follow) return;
    const zone = zoneRef.current;
    const btn = btnRef.current;
    if (!zone || !btn) return;

    let raf = 0;
    let running = false;
    let shown = false;
    const current = { x: 0, y: 0, skew: 0 };
    const target = { x: 0, y: 0, skew: 0 };

    const paint = () => {
      target.skew *= 0.8;
      current.x += (target.x - current.x) * 0.2;
      current.y += (target.y - current.y) * 0.2;
      current.skew += (target.skew - current.skew) * 0.18;
      btn.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%) skewX(${current.skew}deg)`;

      const settled =
        Math.abs(target.x - current.x) < 0.2 &&
        Math.abs(target.y - current.y) < 0.2 &&
        Math.abs(current.skew) < 0.2 &&
        Math.abs(target.skew) < 0.2;

      if (settled) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(paint);
    };

    const kick = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(paint);
    };

    const onMove = (event) => {
      const rect = zone.getBoundingClientRect();
      const halfW = btn.offsetWidth / 2;
      const halfH = btn.offsetHeight / 2;
      const x = clamp(event.clientX - rect.left, halfW, Math.max(halfW, rect.width - halfW));
      const y = clamp(event.clientY - rect.top, halfH, Math.max(halfH, rect.height - halfH));
      if (!shown) {
        shown = true;
        current.x = x;
        current.y = y;
        target.x = x;
        target.y = y;
        target.skew = 0;
        btn.style.opacity = "1";
        btn.style.pointerEvents = "auto";
      } else {
        target.skew = clamp((x - target.x) * 0.5, -16, 16);
        target.x = x;
        target.y = y;
      }
      kick();
    };

    const onLeave = () => {
      shown = false;
      target.skew = 0;
      btn.style.opacity = "0";
      btn.style.pointerEvents = "none";
      kick();
    };

    zone.addEventListener("mousemove", onMove);
    zone.addEventListener("mouseleave", onLeave);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      zone.removeEventListener("mousemove", onMove);
      zone.removeEventListener("mouseleave", onLeave);
    };
  }, [follow]);

  const linkProps = isExternal(url)
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  const labelClass =
    "items-center justify-center gap-2 rounded-full border border-white/20 bg-black px-7 py-3.5 text-sm font-semibold text-white whitespace-nowrap";

  const label = (
    <>
      {text}
      <ArrowUpRight className="w-4 h-4" strokeWidth={2} />
    </>
  );

  return (
    <div ref={zoneRef} className={`relative h-full w-full ${className}`.trim()}>
      {children}
      <a
        href={url}
        {...linkProps}
        className={`inline-flex md:hidden absolute z-20 ${staticClassName} ${labelClass}`}
      >
        {label}
      </a>
      {follow ? (
        <a
          ref={btnRef}
          href={url}
          {...linkProps}
          className={`pointer-events-none absolute left-0 top-0 z-20 hidden opacity-0 will-change-transform md:inline-flex ${labelClass}`}
          style={{ transition: "opacity 0.28s ease" }}
        >
          {label}
        </a>
      ) : null}
    </div>
  );
}
