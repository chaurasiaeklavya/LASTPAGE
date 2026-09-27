"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useGsap, finePointer, lockScroll } from "@/lib/motion";
import styles from "./PosterViewer.module.css";

type Props = { src: string; width: number; height: number; alt: string };

/**
 * The session poster as a physical print: it tilts toward the pointer with a
 * moving sheen, and opens full-size for detail. Keyboard: Enter/Space opens,
 * Esc closes (native <dialog>).
 */
export function PosterViewer({ src, width, height, alt }: Props) {
  const card = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  useGsap(({ gsap }) => {
    const el = card.current;
    if (!el || !finePointer()) return;
    const rx = gsap.quickTo(el, "rotationX", { duration: 0.8, ease: "power3.out" });
    const ry = gsap.quickTo(el, "rotationY", { duration: 0.8, ease: "power3.out" });
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      ry(px * 14);
      rx(-py * 10);
      el.style.setProperty("--sx", `${(px + 0.5) * 100}%`);
      el.style.setProperty("--sy", `${(py + 0.5) * 100}%`);
    };
    const onLeave = () => {
      rx(0);
      ry(0);
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    const onClose = () => {
      setOpen(false);
      lockScroll(false);
      card.current?.focus();
    };
    d.addEventListener("close", onClose);
    return () => d.removeEventListener("close", onClose);
  }, []);

  return (
    <>
      <div className={styles.stage} data-reveal="fade">
        <button
          ref={card}
          type="button"
          className={styles.print}
          onClick={() => {
            dialog.current?.showModal();
            lockScroll(true);
            setOpen(true);
          }}
          data-cursor="View"
          aria-haspopup="dialog"
        >
          <Image src={src} alt={alt} width={width} height={height} sizes="(max-width: 900px) 80vw, 30vw" className={styles.img} />
          <span className={styles.sheen} aria-hidden="true" />
          <span className="sr-only">View the session poster full size</span>
        </button>
        <p className={styles.caption} aria-hidden="true">
          session-poster.jpg <span>· tap to view</span>
        </p>
      </div>

      <dialog
        ref={dialog}
        className={styles.dialog}
        aria-label="Session poster"
        data-open={open ? "true" : "false"}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
      >
        <div className={styles.frame}>
          <Image src={src} alt={alt} width={width} height={height} sizes="(max-width: 900px) 92vw, 44vw" className={styles.full} />
        </div>
        <form method="dialog" className={styles.closeWrap}>
          <button type="submit" className={styles.close} autoFocus>
            Close
          </button>
        </form>
      </dialog>
    </>
  );
}
