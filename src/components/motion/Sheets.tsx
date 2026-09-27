"use client";

import { useGsap } from "@/lib/motion";

/** Flattens each sheet's top corners as the page reaches the top of the viewport. */
export function Sheets() {
  useGsap(({ ScrollTrigger }) => {
    const triggers = Array.from(document.querySelectorAll<HTMLElement>("[data-sheet]")).map((el) =>
      ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        end: "top 12%",
        scrub: true,
        onUpdate: (self) => el.style.setProperty("--flat", self.progress.toFixed(3)),
      }),
    );
    return () => triggers.forEach((t) => t.kill());
  }, []);
  return null;
}
