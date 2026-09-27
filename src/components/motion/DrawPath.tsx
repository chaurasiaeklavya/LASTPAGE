"use client";

import { useRef, type ReactNode } from "react";
import { useGsap } from "@/lib/motion";

/** An SVG path that draws itself as it scrolls into view. */
export function DrawPath({
  d,
  viewBox,
  className,
  pathClassName,
  children,
}: {
  d: string;
  viewBox: string;
  className?: string;
  pathClassName?: string;
  children?: ReactNode;
}) {
  const ref = useRef<SVGPathElement>(null);
  useGsap(({ gsap }) => {
    const path = ref.current;
    if (!path) return;
    const tween = gsap.fromTo(
      path,
      { strokeDashoffset: 1 },
      { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: path.ownerSVGElement, start: "top 85%", end: "center 45%", scrub: 0.8 } },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);
  return (
    <svg className={className} viewBox={viewBox} aria-hidden="true" fill="none">
      <path ref={ref} d={d} pathLength={1} strokeDasharray="1" className={pathClassName} />
      {children}
    </svg>
  );
}
