"use client";

import { useEffect, useRef, useCallback } from "react";

/**
 * useExitIntent
 *
 * Fires `onIntent` exactly once when the user shows exit intent:
 *   - Desktop: mouse cursor leaves the viewport toward the top (clientY ≤ 10)
 *   - Mobile : user has scrolled ≥ 70% of the page and then scrolls back up
 *
 * @param {() => void} onIntent  - callback fired when exit intent is detected
 * @param {object}     options
 * @param {number}     options.scrollThreshold  - 0–1, default 0.7 (70% scroll)
 * @param {number}     options.mouseLeaveY      - px from top, default 10
 */
export function useExitIntent(
  onIntent,
  { scrollThreshold = 0.7, mouseLeaveY = 10 } = {},
) {
  const firedRef = useRef(false);

  // Stable callback — won't re-register listeners on every render
  const trigger = useCallback(() => {
    if (firedRef.current) return;
    const result = onIntent();
    if (result !== false) {
      firedRef.current = true;
    }
  }, [onIntent]);

  useEffect(() => {
    // Desktop: cursor leaves toward top of viewport
    const handleMouseLeave = (e) => {
      if (e.clientY <= mouseLeaveY) trigger();
    };

    // Mobile: scrolled past threshold then scrolls back up
    let lastScrollY = 0;
    const handleScroll = () => {
      const progress =
        window.scrollY / (document.body.scrollHeight - window.innerHeight);
      if (progress >= scrollThreshold && window.scrollY < lastScrollY)
        trigger();
      lastScrollY = window.scrollY;
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [trigger, mouseLeaveY, scrollThreshold]);
}
