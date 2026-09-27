"use client";

import { useRef, type ReactNode } from "react";
import { useGsap } from "@/lib/motion";

/**
 * Scroll-linked horizontal drift for a line of display type. Opposing drifts
 * on neighbouring lines create quiet tension while reading. `amount` is the
 * travel in vw across the element's time in view.
 */
export function Drift({ children, amount = 6, className }: { children: ReactNode; amount?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useGsap(
    ({ gsap }) => {
      const el = ref.current;
      if (!el) return;
      const tween = gsap.fromTo(
        el,
        { x: () => `${-amount / 2}vw` },
        {
          x: () => `${amount / 2}vw`,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.8, invalidateOnRefresh: true },
        },
      );
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    [amount],
  );
  return (
    <span ref={ref} className={className} style={{ display: "block", willChange: "transform" }}>
      {children}
    </span>
  );
}
