import { gap, pages } from "@/content/site";
import { Page } from "@/components/layout/Page";
import { ArrowRight } from "@/components/ui/icons";
import { Drift } from "@/components/motion/Drift";
import styles from "./Gap.module.css";

/** p.01 — the problem, framed as the three questions students ask [D2]. */
export function Gap() {
  const meta = pages[1];
  return (
    <Page id={meta.id} num={meta.num} label={meta.label} theme={meta.theme} className={styles.page}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={`container ${styles.inner}`}>
        <h2 id={`${meta.id}-title`} className={`display ${styles.title}`} data-reveal="lines">
          <Drift amount={6}>
            <span className="line">
              <span>{gap.title[0]}</span>
            </span>
          </Drift>
          <span className="line">
            <span className={styles.not}>{gap.title[1]}</span>
          </span>
          <Drift amount={-5}>
            <span className="line">
              <span className="accent-lime">{gap.title[2]}</span>
            </span>
          </Drift>
        </h2>

        <div className={styles.grid}>
          <p className={`lead ${styles.intro}`} data-reveal="fade">
            {gap.intro}
          </p>

          <ol className={styles.questions} role="list" data-reveal="stagger">
            {gap.questions.map((item, i) => {
              const target = pages.find((p) => p.id === item.page);
              return (
                <li key={item.q}>
                  <a href={`#${item.page}`} className={styles.q}>
                    <span className={styles.qNum}>Q.0{i + 1}</span>
                    <span className={styles.qText}>{item.q}</span>
                    <span className={styles.qAnswer}>
                      <span className={styles.qPage}>p.{target?.num}</span>
                      <span className={styles.qAnswerLabel}>{item.answer}</span>
                      <ArrowRight size={18} className={styles.qArrow} />
                    </span>
                  </a>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </Page>
  );
}
