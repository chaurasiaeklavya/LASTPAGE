"use client";

import { useRef, type ReactNode } from "react";
import { useGsap } from "@/lib/motion";

/**
 * Exposes scroll progress through the element as the CSS variable
 * --progress (0 → 1). Without motion it rests at the "Now" boundary.
 */
export function Progress({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGsap(({ ScrollTrigger }) => {
    const el = ref.current;
    if (!el) return;
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 75%",
      end: "bottom 55%",
      scrub: true,
      onUpdate: (self) => el.style.setProperty("--progress", self.progress.toFixed(4)),
    });
    el.style.setProperty("--progress", st.progress.toFixed(4));
    return () => st.kill();
  }, []);
  return (
    <div ref={ref} className={className} style={{ "--progress": 0.29 } as React.CSSProperties}>
      {children}
    </div>
  );
}
