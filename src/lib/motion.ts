"use client";

import { useEffect, type DependencyList } from "react";
import type { gsap as GsapType } from "gsap";
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";
import type Lenis from "lenis";

export type MotionApi = { gsap: typeof GsapType; ScrollTrigger: typeof ScrollTriggerType };

/*
 * Motion code (GSAP + ScrollTrigger, ~45 KB gz) is not on the critical path:
 * the page renders, hydrates and is interactive without it. It's fetched on
 * idle and every consumer attaches once it arrives.
 */
let loader: Promise<MotionApi> | null = null;
export function loadGsap(): Promise<MotionApi> {
  if (!loader) {
    loader = Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([g, st]) => {
      const gsap = g.gsap;
      gsap.registerPlugin(st.ScrollTrigger);
      gsap.defaults({ ease: "expo.out", duration: 0.9 });
      return { gsap, ScrollTrigger: st.ScrollTrigger };
    });
  }
  return loader;
}

let refreshQueued = false;
/** Coalesce refreshes from many components into one measurement pass. */
export function queueRefresh() {
  if (refreshQueued) return;
  refreshQueued = true;
  requestAnimationFrame(() => {
    refreshQueued = false;
    loadGsap().then(({ ScrollTrigger }) => ScrollTrigger.refresh());
  });
}

function onIdle(cb: () => void): () => void {
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(cb, { timeout: 1200 });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(cb, 200);
  return () => window.clearTimeout(id);
}

/**
 * Run a GSAP setup once the library has loaded (on idle). The setup may
 * return a cleanup. Skipped entirely when reduced motion is requested,
 * unless `always` is set.
 */
export function useGsap(setup: (api: MotionApi) => void | (() => void), deps: DependencyList, opts: { always?: boolean } = {}) {
  useEffect(() => {
    if (!opts.always && !motionOK()) return;
    let cleanup: void | (() => void);
    let dead = false;
    const cancel = onIdle(() => {
      loadGsap().then((api) => {
        if (dead) return;
        cleanup = setup(api);
        queueRefresh();
      });
    });
    return () => {
      dead = true;
      cancel();
      if (typeof cleanup === "function") cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/** True when the visitor accepts motion (mirrors the pre-paint html.motion flag). */
export function motionOK(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
}

export function finePointer(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

/* Lenis singleton so any component can pause scroll (menus) or scroll to a
   target with the same easing. Falls back to native scrolling. */
let lenis: Lenis | null = null;
export function setLenis(instance: Lenis | null) {
  lenis = instance;
}
export function getLenis() {
  return lenis;
}

export function scrollToTarget(target: string | HTMLElement, opts: { offset?: number; immediate?: boolean } = {}) {
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  if (!el) return;
  if (lenis) {
    lenis.scrollTo(el, { offset: opts.offset ?? 0, immediate: opts.immediate, duration: 1.4 });
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY + (opts.offset ?? 0);
    window.scrollTo({ top, behavior: opts.immediate || !motionOK() ? "auto" : "smooth" });
  }
}

export function lockScroll(locked: boolean) {
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.documentElement.style.overflow = locked ? "hidden" : "";
}
