"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { pages, INSTAGRAM_URL, type PageTheme } from "@/content/site";
import { lockScroll, scrollToTarget } from "@/lib/motion";
import { ArrowUpRight } from "@/components/ui/icons";
import styles from "./Nav.module.css";

type Current = { num: string; label: string; theme: PageTheme };

const DEFAULT: Current = { num: "00", label: "Cover", theme: "black" };

export function Nav() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [homeCurrent, setCurrent] = useState<Current>(DEFAULT);
  const current: Current = onHome
    ? homeCurrent
    : { num: "—", label: pathname.startsWith("/brand") ? "Brand kit" : "Off the page", theme: "dark" };
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<Current | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Which page sits under the bar? Drives the folio and the bar's colours.
  useEffect(() => {
    if (!onHome) return;
    let io: IntersectionObserver | null = null;
    const build = () => {
      io?.disconnect();
      const bottom = Math.max(window.innerHeight - 36, 0);
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const el = entry.target as HTMLElement;
            const meta = pages.find((p) => p.id === el.dataset.page);
            const theme = (el.dataset.navTheme as PageTheme | undefined) ?? meta?.theme ?? "dark";
            if (meta) setCurrent({ num: meta.num, label: meta.label, theme });
          }
        },
        { rootMargin: `-35px 0px -${bottom}px 0px`, threshold: 0 },
      );
      document.querySelectorAll<HTMLElement>("[data-page], [data-nav-theme]").forEach((el) => io?.observe(el));
    };
    build();
    window.addEventListener("resize", build);
    return () => {
      io?.disconnect();
      window.removeEventListener("resize", build);
    };
  }, [onHome, pathname]);

  // Hide while reading down, return on the way up.
  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 24);
        if (Math.abs(y - last) > 6) {
          setHidden(y > last && y > window.innerHeight * 0.6);
          last = y;
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const openMenu = useCallback(() => {
    const d = dialogRef.current;
    if (!d) return;
    d.showModal();
    lockScroll(true);
    setOpen(true);
  }, []);

  const closeMenu = useCallback((after?: () => void) => {
    const d = dialogRef.current;
    if (!d) return;
    setOpen(false);
    // Let the exit choreography play before removing from the top layer.
    const reduce = !window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
    window.setTimeout(
      () => {
        d.close();
        lockScroll(false);
        after?.();
      },
      reduce ? 0 : 420,
    );
  }, []);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    const onCancel = (e: Event) => {
      e.preventDefault();
      closeMenu(() => triggerRef.current?.focus());
    };
    d.addEventListener("cancel", onCancel);
    return () => d.removeEventListener("cancel", onCancel);
  }, [closeMenu]);

  const goTo = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!onHome) return; // normal navigation to /#id
    e.preventDefault();
    closeMenu(() => {
      const el = document.getElementById(id);
      if (!el) return;
      scrollToTarget(el, { offset: -8 });
      history.pushState(null, "", `#${id}`);
      el.setAttribute("tabindex", "-1");
      el.focus({ preventScroll: true });
    });
  };

  const tone = current.theme === "lime" || current.theme === "paper" ? "light" : "dark";
  const shown = preview ?? current;

  return (
    <>
      <header
        className={styles.bar}
        data-tone={tone}
        data-hidden={hidden && !open ? "true" : "false"}
        data-scrolled={scrolled ? "true" : "false"}
        data-page-theme={current.theme}
      >
        <nav className={styles.inner} aria-label="Primary">
          <Link href={onHome ? "/#cover" : "/"} className={styles.brand} aria-label="The Last Page — back to the cover">
            <span aria-hidden="true">
              The Last Page<span className={styles.dot}>.</span>
            </span>
          </Link>

          <p className={styles.folio} aria-live="off">
            <span className={styles.folioNum}>p.{current.num}</span>
            <span className={styles.folioRule} aria-hidden="true" />
            <span className={styles.folioLabel}>{current.label}</span>
          </p>

          <div className={styles.actions}>
            <a className={styles.join} href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
              Join <ArrowUpRight size={13} />
              <span className="sr-only"> the community on Instagram (opens in a new tab)</span>
            </a>
            <button
              ref={triggerRef}
              type="button"
              className={styles.menuBtn}
              aria-haspopup="dialog"
              aria-expanded={open}
              aria-controls="contents"
              onClick={openMenu}
            >
              <span className={styles.menuLabel}>Contents</span>
              <span className={styles.menuIcon} aria-hidden="true">
                <span />
                <span />
              </span>
            </button>
          </div>
        </nav>
      </header>

      <dialog
        ref={dialogRef}
        id="contents"
        className={styles.dialog}
        data-open={open ? "true" : "false"}
        aria-label="Contents"
        onClick={(e) => {
          if (e.target === e.currentTarget) closeMenu(() => triggerRef.current?.focus());
        }}
      >
        <div className={styles.sheet}>
          <div className={styles.sheetTop}>
            <span className="label">Contents</span>
            <button type="button" className={styles.close} onClick={() => closeMenu(() => triggerRef.current?.focus())}>
              Close
              <span className={styles.closeIcon} aria-hidden="true" />
            </button>
          </div>

          <div className={styles.sheetBody}>
            <ol className={styles.toc} role="list" onMouseLeave={() => setPreview(null)}>
              {pages.map((p, i) => (
                <li key={p.id} style={{ "--i": i } as React.CSSProperties}>
                  <a
                    href={onHome ? `#${p.id}` : `/#${p.id}`}
                    onClick={goTo(p.id)}
                    onMouseEnter={() => setPreview({ num: p.num, label: p.label, theme: p.theme })}
                    onFocus={() => setPreview({ num: p.num, label: p.label, theme: p.theme })}
                    aria-current={onHome && current.num === p.num ? "location" : undefined}
                  >
                    <span className={styles.tocNum}>{p.num}</span>
                    <span className={styles.tocLabel}>{p.label}</span>
                  </a>
                </li>
              ))}
            </ol>

            <div className={styles.preview} data-theme={shown.theme} aria-hidden="true">
              <span className={styles.previewNum}>{shown.num}</span>
              <span className={styles.previewLabel}>{shown.label}</span>
            </div>
          </div>

          <div className={styles.sheetFoot}>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className={styles.footLink}>
              @thelastpage.school <ArrowUpRight size={14} />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <Link href="/brand" className={styles.footLink} onClick={() => closeMenu()}>
              Brand kit
            </Link>
          </div>
        </div>
      </dialog>
    </>
  );
}
