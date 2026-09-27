import { idea, pages } from "@/content/site";
import { Page } from "@/components/layout/Page";
import { Burst } from "@/components/ui/Burst";
import { Spin } from "@/components/motion/Spin";
import styles from "./Idea.module.css";

/** p.02 — the philosophy [D3], on the deck's lime page. */
export function Idea() {
  const meta = pages[2];
  return (
    <Page id={meta.id} num={meta.num} label={meta.label} theme={meta.theme} className={styles.page}>
      <div className={styles.grid} aria-hidden="true" />
      <Spin className={styles.burst}>
        <Burst />
      </Spin>

      <div className={`container ${styles.inner}`}>
        <h2 id={`${meta.id}-title`} className={`display ${styles.title}`} data-reveal="lines">
          <span className="line">
            <span>{idea.title[0]}</span>
          </span>
          <span className="line">
            <span>{idea.title[1]}</span>
          </span>
          <span className="line">
            <span className="accent-violet">{idea.title[2]}</span>
          </span>
        </h2>

        <ol className={styles.pillars} role="list">
          {idea.pillars.map((p, i) => (
            <li key={p.title} className={styles.pillar} data-reveal="fade">
              <span className={styles.pNum}>0{i + 1}</span>
              <h3 className={styles.pTitle}>{p.title}</h3>
              <p className={styles.pDetail}>{p.detail}</p>
            </li>
          ))}
        </ol>

        <div className={styles.about} data-reveal="fade">
          <p className={`label ${styles.aboutLabel}`}>What this is</p>
          <p className={styles.aboutText}>{idea.about}</p>
          <p className={styles.mission}>{idea.mission}</p>
        </div>
      </div>
    </Page>
  );
}
