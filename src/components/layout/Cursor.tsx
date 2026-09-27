"use client";

import { useRef, useState } from "react";
import { useGsap, finePointer } from "@/lib/motion";
import styles from "./Cursor.module.css";

/**
 * A contextual label that follows the pointer over elements marked
 * [data-cursor="View" | "Drag" | "Open" …]. The native cursor is never
 * hidden — this only adds intent, it never replaces affordance.
 * [data-magnetic] elements lean gently toward the pointer.
 * Disabled on touch and when reduced motion is requested.
 */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);

  useGsap(({ gsap }) => {
    const el = ref.current;
    if (!el || !finePointer()) return;
    el.dataset.enabled = "true";
    const xTo = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" });
    let magnet: HTMLElement | null = null;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      xTo(e.clientX);
      yTo(e.clientY);
      const target = e.target as HTMLElement | null;
      const hit = target?.closest<HTMLElement>("[data-cursor]");
      setLabel(hit?.dataset.cursor || null);

      const m = target?.closest<HTMLElement>("[data-magnetic]") ?? null;
      if (m !== magnet && magnet) gsap.to(magnet, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.5)" });
      magnet = m;
      if (m) {
        const r = m.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        gsap.to(m, { x: dx * 0.22, y: dy * 0.32, duration: 0.5, ease: "power3.out" });
      }
    };
    const onLeave = () => {
      setLabel(null);
      if (magnet) gsap.to(magnet, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.5)" });
      magnet = null;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={ref} className={styles.cursor} data-active={label ? "true" : "false"} aria-hidden="true">
      <span className={styles.pill}>{label}</span>
    </div>
  );
}
