"use client";

import { useEffect } from "react";
import { useGsap, finePointer, setLenis, scrollToTarget } from "@/lib/motion";

/**
 * Smooth scrolling only where it helps: fine pointers, motion allowed.
 * Touch devices keep native momentum scrolling (better and cheaper).
 * Lenis loads lazily with the rest of the motion code.
 * Also owns in-page anchor navigation so every "#id" link scrolls with the
 * same easing, moves focus for keyboard/screen-reader users, and keeps the URL.
 */
export function SmoothScroll() {
  useGsap(({ gsap, ScrollTrigger }) => {
    if (!finePointer()) return;
    let dead = false;
    let cleanup: (() => void) | null = null;
    import("lenis").then(({ default: Lenis }) => {
      if (dead) return;
      const lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 0.95, smoothWheel: true });
      setLenis(lenis);
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      cleanup = () => {
        gsap.ticker.remove(tick);
        lenis.destroy();
        setLenis(null);
      };
    });
    return () => {
      dead = true;
      cleanup?.();
    };
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>("a[href]");
      if (!a) return;
      const url = new URL(a.href, window.location.href);
      if (url.pathname !== window.location.pathname || !url.hash || url.hash === "#") return;
      const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!target) return;
      e.preventDefault();
      scrollToTarget(target, { offset: target.id === "main" ? 0 : -8 });
      history.pushState(null, "", url.hash);
      // Move focus without a second jump, so keyboard users continue from here.
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
