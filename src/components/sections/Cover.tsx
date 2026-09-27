"use client";

import Image from "next/image";
import { useRef } from "react";
import { cover, INSTAGRAM_URL } from "@/content/site";
import { Action } from "@/components/ui/Action";
import { useGsap, finePointer } from "@/lib/motion";
import styles from "./Cover.module.css";

/**
 * p.00 — the cover.
 * Composition: the stacked V2 wordmark [K2] against the deck's cover
 * object [D1] — a retro computer with an empty screen: the blank page.
 * Level 4 motion (desktop only): scrolling pushes the camera into that
 * screen and out the other side onto p.01. Without motion, it's a poster.
 */
export function Cover() {
  const root = useRef<HTMLDivElement>(null);

  useGsap(({ gsap }) => {
    const el = root.current;
    if (!el) return;
    const desk = el.querySelector<HTMLElement>(`.${styles.desk}`);
    const deskImg = el.querySelector<HTMLElement>(`.${styles.deskInner}`);
    const screen = el.querySelector<HTMLElement>(`.${styles.screen}`);
    const type = el.querySelector<HTMLElement>(`.${styles.type}`);
    const folders = el.querySelectorAll<HTMLElement>(`[data-depth]`); // pointer layer
    const folderImgs = el.querySelectorAll<HTMLElement>(`[data-depth] img`); // scroll layer
    const bottom = el.querySelector<HTMLElement>(`.${styles.bottom}`);
    const fade = el.querySelector<HTMLElement>(`.${styles.fade}`);
    if (!desk || !deskImg || !screen || !type || !bottom || !fade) return;

    const mm = gsap.matchMedia();

    // Pointer parallax — depth is felt, not announced.
    let removePointer: (() => void) | null = null;
    if (finePointer()) {
      const layers = [
        { el: deskImg, k: 10 },
        { el: type, k: -6 },
        ...Array.from(folders).map((f) => ({ el: f, k: Number(f.dataset.depth) || 20 })),
      ].map(({ el: node, k }) => ({
        k,
        x: gsap.quickTo(node, "x", { duration: 1.2, ease: "power3.out" }),
        y: gsap.quickTo(node, "y", { duration: 1.2, ease: "power3.out" }),
      }));
      const onMove = (e: PointerEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        layers.forEach((l) => {
          l.x(nx * l.k);
          l.y(ny * l.k);
        });
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      removePointer = () => window.removeEventListener("pointermove", onMove);
    }

    mm.add("(min-width: 900px) and (min-height: 560px)", () => {
      // Where must the screen travel so it ends centred in the viewport?
      const travel = () => {
        const r = screen.getBoundingClientRect();
        return {
          x: window.innerWidth / 2 - (r.left + r.width / 2),
          y: window.innerHeight / 2 - (r.top + r.height / 2),
          scale: Math.max(window.innerWidth / r.width, window.innerHeight / r.height) * 1.35,
        };
      };
      let t = travel();

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "+=115%",
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefreshInit: () => {
            gsap.set(desk, { clearProps: "transform" });
            t = travel();
          },
        },
      });

      tl.to(desk, { x: () => t.x, y: () => t.y, scale: () => t.scale, ease: "power2.in", duration: 1 }, 0)
        .to(type, { xPercent: -18, yPercent: -6, scale: 1.25, autoAlpha: 0, filter: "blur(10px)", duration: 0.55, ease: "power2.in" }, 0)
        .to(bottom, { y: 60, autoAlpha: 0, duration: 0.3 }, 0)
        .to(folderImgs, { scale: 2.6, autoAlpha: 0, x: (i) => (i % 2 ? 420 : -420), y: (i) => (i % 2 ? -260 : 260), duration: 0.6, ease: "power2.in" }, 0)
        .to(`.${styles.screenFill}`, { opacity: 1, duration: 0.3 }, 0.55)
        .to(fade, { opacity: 1, duration: 0.2 }, 0.8);

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    });

    return () => {
      removePointer?.();
      mm.revert();
    };
  }, []);

  return (
    <div ref={root} className={styles.cover}>
      <div className={styles.glow} aria-hidden="true" />


      <div className={styles.folderA} data-depth="34" aria-hidden="true">
        <Image src="/media/folder-violet.png" alt="" width={402} height={352} sizes="(max-width: 899px) 64px, 7vw" />
      </div>
      <div className={styles.folderB} data-depth="52" aria-hidden="true">
        <Image src="/media/folder-lime.png" alt="" width={384} height={342} sizes="(max-width: 899px) 1px, 12vw" />
      </div>

      <div className={`container ${styles.layout}`}>
        <h1 id="cover-title" className={`display ${styles.type}`}>
          <span className="sr-only">The Last Page. </span>
          {cover.lines.map((word, i) => (
            <span key={word} className={`line ${styles.line}`} style={{ "--i": i } as React.CSSProperties} aria-hidden="true">
              <span>
                {word}
                {i === cover.lines.length - 1 ? <span className={styles.stop}>.</span> : null}
              </span>
            </span>
          ))}
          <span className="sr-only">{cover.lead}</span>
        </h1>

        <figure className={styles.desk} aria-hidden="true">
          <div className={styles.deskInner}>
            <Image
              src="/media/hero-desk.jpg"
              alt=""
              width={1536}
              height={1024}
              preload
              sizes="(max-width: 900px) 110vw, 64vw"
              className={styles.deskImg}
            />
            <div className={styles.screen}>
              <span className={styles.boot} />
              <span className={styles.caret} />
              <span className={styles.screenFill} />
            </div>
          </div>
        </figure>

        <div className={styles.bottom}>
          <div className={styles.copy}>
            <p className={`lead ${styles.lead}`} aria-hidden="true">
              {cover.lead}
            </p>
            <p className={styles.origin}>{cover.origin}</p>
          </div>
          <div className={styles.ctas}>
            <span data-magnetic>
              <Action href={INSTAGRAM_URL} size="l">
                Join the community
              </Action>
            </span>
            <Action href="#contact-form" variant="ghost" size="l" intent="host">
              Host a session
            </Action>
          </div>
          <a href="#the-gap" className={styles.cue}>
            <span className={styles.cueLine} aria-hidden="true" />
            Turn the page
          </a>
        </div>
      </div>

      <div className={styles.fade} aria-hidden="true" />
    </div>
  );
}
