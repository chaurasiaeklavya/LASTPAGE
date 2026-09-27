import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, ArrowUpRight, ArrowDown } from "./icons";
import styles from "./Action.module.css";

type Variant = "primary" | "ghost" | "ink" | "violet" | "text";
type Icon = "right" | "external" | "down" | "none";

type ActionProps = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  icon?: Icon;
  className?: string;
  /** Pre-selects an option in the "Build with us" form. */
  intent?: string;
  cursor?: string;
  size?: "m" | "l";
};

/**
 * Every CTA on the site. External links (Instagram) open in a new tab and say
 * so to assistive tech. Arrow direction encodes destination:
 * ↗ leaves the site, → goes deeper, ↓ moves down this page.
 */
export function Action({ href, children, variant = "primary", icon, className, intent, cursor, size = "m" }: ActionProps) {
  const external = /^https?:\/\//.test(href);
  const resolvedIcon: Icon = icon ?? (external ? "external" : "right");
  const Glyph = resolvedIcon === "external" ? ArrowUpRight : resolvedIcon === "down" ? ArrowDown : ArrowRight;
  const cls = `${styles.action} ${styles[variant]} ${styles[size]} ${className ?? ""}`;
  const inner = (
    <>
      <span className={styles.label}>{children}</span>
      {resolvedIcon !== "none" ? (
        <span className={`${styles.icon} ${styles[`icon-${resolvedIcon}`]}`} aria-hidden="true">
          <Glyph className={styles.glyphA} size={size === "l" ? 18 : 15} />
          <Glyph className={styles.glyphB} size={size === "l" ? 18 : 15} />
        </span>
      ) : null}
      {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
    </>
  );

  if (external) {
    return (
      <a className={cls} href={href} target="_blank" rel="noopener noreferrer" data-cursor={cursor}>
        {inner}
      </a>
    );
  }
  if (href.startsWith("#")) {
    return (
      <a className={cls} href={href} data-intent={intent} data-cursor={cursor}>
        {inner}
      </a>
    );
  }
  return (
    <Link className={cls} href={href} data-intent={intent} data-cursor={cursor}>
      {inner}
    </Link>
  );
}
