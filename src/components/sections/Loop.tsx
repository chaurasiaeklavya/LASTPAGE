import { loop, pages, INSTAGRAM_URL } from "@/content/site";
import { Page } from "@/components/layout/Page";
import { Action } from "@/components/ui/Action";
import { DrawPath } from "@/components/motion/DrawPath";
import styles from "./Loop.module.css";

// Stadium path in a 1000 × 380 box; nodes sit on it (see .node positions).
const TRACK = "M300 50 H700 A140 140 0 0 1 700 330 H300 A140 140 0 0 1 300 50 Z";

/** p.06 — keep learning after a session [D8]; status stays honest. */
export function Loop() {
  const meta = pages[6];
  return (
    <Page id={meta.id} num={meta.num} label={meta.label} theme={meta.theme} className={styles.page}>
      <div className={`container ${styles.inner}`}>
        <h2 id={`${meta.id}-title`} className={`display ${styles.title}`} data-reveal="lines">
          <span className="line">
            <span>{loop.title[0]}</span>
          </span>
          <span className="line">
            <span className="accent-lime">{loop.title[1]}</span>
          </span>
        </h2>

        <div className={styles.loop}>
          <DrawPath className={styles.svg} viewBox="0 0 1000 380" d={TRACK} pathClassName={styles.track}>
            <circle r="9" className={styles.dot}>
              <animateMotion dur="7s" repeatCount="indefinite" path={TRACK} rotate="auto" />
            </circle>
          </DrawPath>

          <ol className={styles.nodes} role="list">
            {loop.steps.map((s, i) => (
              <li key={s.title} className={styles.node} data-i={i} data-status={s.status === "Now" ? "now" : "next"} data-reveal="fade">
                <span className={styles.status}>{s.status}</span>
                <h3 className={styles.nodeTitle}>
                  <span className={styles.nodeNum}>0{i + 1}</span>
                  {s.title}
                </h3>
                <p className={styles.nodeDetail}>{s.detail}</p>
              </li>
            ))}
          </ol>

          <div className={styles.center} data-reveal="fade">
            <p className={styles.note}>{loop.note}</p>
            <Action href={INSTAGRAM_URL} variant="primary">
              Join the next session
            </Action>
          </div>
        </div>
      </div>
    </Page>
  );
}
