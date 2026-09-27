import Image from "next/image";
import { decisions, pages } from "@/content/site";
import { Page } from "@/components/layout/Page";
import { DecisionLog } from "./DecisionLog";
import styles from "./Decisions.module.css";

/**
 * p.04 — the signature page. The deck's editorial promise [D5] ("Show the
 * decisions. Skip the generic advice.") is demonstrated, not described:
 * the three story formats, then a working decision log of this very site.
 */
export function Decisions() {
  const meta = pages[4];
  return (
    <Page id={meta.id} num={meta.num} label={meta.label} theme={meta.theme} className={styles.page}>
      <div className={`container ${styles.intro}`}>
        <h2 id={`${meta.id}-title`} className={`display ${styles.title}`} data-reveal="lines">
          <span className="line">
            <span>{decisions.title[0]}</span>
          </span>
          <span className="line">
            <span className="accent-violet">{decisions.title[1]}</span>
          </span>
        </h2>

        <div className={styles.row}>
          <p className={`lead ${styles.lede}`} data-reveal="fade">
            {decisions.intro}
          </p>
          <figure className={styles.dice} data-reveal="fade">
            <Image
              src="/media/dice-chess.png"
              alt="DICE, The Last Page’s rabbit character, in a grey suit and green-tinted glasses, weighing a chess move."
              width={1015}
              height={1061}
              sizes="(max-width: 900px) 46vw, 18vw"
            />
            <figcaption>
              <q>{decisions.diceQuote}</q>
              <span>— DICE, from the brand kit</span>
            </figcaption>
          </figure>
        </div>

        <ul className={styles.formats} role="list" data-reveal="stagger">
          {decisions.formats.map((f, i) => (
            <li key={f.title} className={styles.format} data-variant={i === 1 ? "lime" : "violet"}>
              <span className={styles.tab} aria-hidden="true">
                0{i + 1}
              </span>
              <h3 className={styles.formatTitle}>{f.title}</h3>
              <ul role="list" className={styles.qs}>
                {f.questions.map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>

      <DecisionLog />
    </Page>
  );
}
