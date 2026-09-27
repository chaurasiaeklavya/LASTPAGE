import type { ReactNode } from "react";
import type { PageTheme } from "@/content/site";
import styles from "./Page.module.css";

type PageProps = {
  id: string;
  num: string;
  label: string;
  theme: PageTheme;
  children: ReactNode;
  className?: string;
  /** hide the running head (e.g. the cover draws its own) */
  bare?: boolean;
  labelledBy?: string;
};

/**
 * One "page" of the issue. Each opens with a running head — publication name,
 * section, folio — framed by the hairline rules that bracket every page of
 * the deck. Colour theme is set per page so nested components inherit it.
 */
export function Page({ id, num, label, theme, children, className, bare, labelledBy }: PageProps) {
  return (
    <section
      id={id}
      data-page={id}
      data-theme={theme}
      aria-labelledby={labelledBy ?? `${id}-title`}
      className={`${styles.page} ${className ?? ""}`}
    >
      {bare ? null : (
        <div className={styles.head} data-reveal="fade">
          <div className={`container ${styles.headInner}`}>
            <span className={styles.pub} aria-hidden="true">
              The Last Page<span className={styles.dot}>.</span>
            </span>
            <span className={styles.section}>
              <span className={styles.num}>{num}</span>
              <span className={styles.rule} aria-hidden="true" />
              {label}
            </span>
            <span className={styles.folio} aria-hidden="true">
              p.{num}
            </span>
          </div>
        </div>
      )}
      {children}
    </section>
  );
}
