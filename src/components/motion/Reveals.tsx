"use client";

import { useGsap } from "@/lib/motion";

/**
 * Site-wide entrance system (motion level 2). Declarative hooks in markup:
 *   data-reveal="lines"   – headline lines rise out of their masks
 *   data-reveal="fade"    – soft rise + fade
 *   data-reveal="stagger" – direct children fade in sequence
 * Content is fully visible in HTML and stays visible until it actually
 * reaches the bottom edge of the viewport; only then does it take its start
 * state and animate in. If motion code never loads, nothing is ever hidden.
 */
const EDGE = "top 98%";

export function Reveals() {
  useGsap(({ gsap, ScrollTrigger }) => {
    const pending = (el: Element) => !el.closest("[data-reveal-skip]") && el.getBoundingClientRect().top > window.innerHeight * 0.98;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-reveal="lines"]').filter(pending).forEach((el) => {
        const spans = el.querySelectorAll<HTMLElement>(".line > span");
        if (!spans.length) return;
        ScrollTrigger.create({
          trigger: el,
          start: EDGE,
          once: true,
          onEnter: () => gsap.fromTo(spans, { yPercent: 108 }, { yPercent: 0, duration: 1.1, stagger: 0.075, ease: "expo.out" }),
        });
      });

      ScrollTrigger.batch(gsap.utils.toArray<HTMLElement>('[data-reveal="fade"]').filter(pending), {
        start: EDGE,
        once: true,
        onEnter: (batch) => gsap.fromTo(batch, { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.08, ease: "expo.out" }),
      });

      gsap.utils.toArray<HTMLElement>('[data-reveal="stagger"]').filter(pending).forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: EDGE,
          once: true,
          onEnter: () =>
            gsap.fromTo(Array.from(el.children), { autoAlpha: 0, y: 32 }, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.09, ease: "expo.out" }),
        });
      });
    });

    // Fonts and late images shift layout slightly; re-measure once settled.
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh).catch(() => {});
    window.addEventListener("load", refresh);
    return () => {
      window.removeEventListener("load", refresh);
      ctx.revert();
    };
  }, []);

  return null;
}
