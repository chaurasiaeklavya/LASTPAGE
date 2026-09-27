import { people, pages } from "@/content/site";
import { Page } from "@/components/layout/Page";
import { ArrowRight } from "@/components/ui/icons";
import styles from "./People.module.css";

/** p.08 — community grows through people [D7]; the ecosystem it grows from [D6]. */
export function People() {
  const meta = pages[8];
  const hs = people.headStart;
  return (
    <Page id={meta.id} num={meta.num} label={meta.label} theme={meta.theme} className={styles.page}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.top}>
          <h2 id={`${meta.id}-title`} className={`display ${styles.title}`} data-reveal="lines">
            <span className="line">
              <span>{people.title[0]}</span>
            </span>
            <span className="line">
              <span className="accent-lime">{people.title[1]}</span>
            </span>
            <span className="line">
              <span className="accent-lime">{people.title[2]}</span>
            </span>
          </h2>
          <div className={styles.room} data-reveal="fade">
            <p className="label">{people.roomLabel}</p>
            <p className={styles.roomText}>{people.room}</p>
          </div>
        </div>

        <ul className={styles.channels} role="list">
          {people.channels.map((c, i) => (
            <li key={c.title} data-reveal="fade">
              <a href="#contact-form" data-intent={c.intent} className={styles.channel} data-tone={i === 1 ? "lime" : "violet"}>
                <span className={styles.cNum}>0{i + 1}</span>
                <span className={styles.cTitle}>{c.title}</span>
                <span className={styles.cLine}>{c.line}</span>
                <span className={styles.cCta}>
                  {c.cta}
                  <ArrowRight size={18} />
                </span>
              </a>
            </li>
          ))}
        </ul>

        <section className={styles.headStart} aria-labelledby="head-start-title">
          <h3 id="head-start-title" className={`display ${styles.hsTitle}`} data-reveal="lines">
            <span className="line">
              <span>{hs.title[0]}</span>
            </span>
            <span className="line">
              <span className="accent-lime">{hs.title[1]}</span>
            </span>
          </h3>
          <dl className={styles.figures}>
            {hs.figures.map((f, i) => (
              <div key={f.label} className={styles.figure}>
                <dt className={styles.figLabel}>{f.label}</dt>
                <dd className={`${styles.figValue} ${i === 1 ? styles.white : ""}`} data-reveal="lines">
                  <span className="line">
                    <span>{f.display}</span>
                  </span>
                </dd>
              </div>
            ))}
          </dl>
          <p className={styles.hsNote}>
            <span aria-hidden="true" className={styles.asterisk}>
              *
            </span>
            {hs.note}
          </p>
        </section>
      </div>
    </Page>
  );
}
