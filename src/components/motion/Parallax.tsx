"use client";

import { useRef, type ReactNode } from "react";
import { useGsap } from "@/lib/motion";

/** Scroll-linked offset in % of the element's own size (y or x). */
export function Parallax({
  children,
  className,
  speed = 10,
  axis = "y",
}: {
  children: ReactNode;
  className?: string;
  speed?: number;
  axis?: "x" | "y";
}) {
  const ref = useRef<HTMLDivElement>(null);
  useGsap(
    ({ gsap }) => {
      const el = ref.current;
      if (!el?.firstElementChild) return;
      const prop = axis === "y" ? "yPercent" : "xPercent";
      const tween = gsap.fromTo(
        el.firstElementChild,
        { [prop]: -speed },
        { [prop]: speed, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 } },
      );
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    [speed, axis],
  );
  return (
    <div ref={ref} className={className} aria-hidden="true">
      {children}
    </div>
  );
}
