"use client";

import { useRef, type ReactNode } from "react";
import { useGsap } from "@/lib/motion";

/** Scroll-scrubbed rotation — the burst turns as the page turns. */
export function Spin({ children, className, turns = 0.35 }: { children: ReactNode; className?: string; turns?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useGsap(
    ({ gsap }) => {
      const target = ref.current?.firstElementChild as HTMLElement | null;
      if (!ref.current || !target) return;
      const tween = gsap.fromTo(
        target,
        { rotate: -turns * 180 },
        { rotate: turns * 180, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: 1 } },
      );
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    [turns],
  );
  return (
    <div ref={ref} className={className} aria-hidden="true">
      {children}
    </div>
  );
}
