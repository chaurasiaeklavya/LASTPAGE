import { pathway, pages } from "@/content/site";
import { Page } from "@/components/layout/Page";
import { Burst } from "@/components/ui/Burst";
import { Progress } from "@/components/motion/Progress";
import styles from "./Pathway.module.css";

/**
 * p.07 — learning → career, mapped onto the deck's actual roadmap [D9].
 * What exists is marked Now; what doesn't yet is marked Next or Later.
 */
export function Pathway() {
  const meta = pages[7];
  const offsets = pathway.zones.map((_, i) => pathway.zones.slice(0, i).reduce((sum, z) => sum + z.steps.length, 0));
  return (
    <Page id={meta.id} num={meta.num} label={meta.label} theme={meta.theme} className={styles.page}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.header}>
          <h2 id={`${meta.id}-title`} className={`display ${styles.title}`} data-reveal="lines">
            <span className="line">
              <span>{pathway.title[0]}</span>
            </span>
            <span className="line">
              <span className="accent-lime">{pathway.title[1]}</span>
            </span>
          </h2>
          <p className={`lead ${styles.intro}`} data-reveal="fade">
            {pathway.intro}
          </p>
        </div>

        <Progress className={styles.track}>
          <ol className={styles.zones} role="list">
            {pathway.zones.map((z, zi) => (
              <li key={z.status} className={styles.zone} data-status={z.status.toLowerCase()}>
                <p className={styles.zoneHead}>
                  <span className={styles.zoneName}>{z.status}</span>
                  {z.status === "Now" ? <span className={styles.here}>We are here</span> : null}
                </p>
                <ol className={styles.steps} role="list">
                  {z.steps.map((s, si) => {
                    const n = (offsets[zi] ?? 0) + si + 1;
                    return (
                      <li key={s.verb} className={styles.step} data-reveal="fade">
                        <span className={styles.node} aria-hidden="true" />
                        <span className={styles.stepNum}>{String(n).padStart(2, "0")}</span>
                        <h3 className={styles.verb}>{s.verb}</h3>
                        <p className={styles.offering}>{s.offering}</p>
                      </li>
                    );
                  })}
                </ol>
              </li>
            ))}
            <li className={`${styles.zone} ${styles.destination}`} data-status="goal">
              <p className={styles.zoneHead}>
                <span className={styles.zoneName}>Goal</span>
              </p>
              <div className={styles.step} data-reveal="fade">
                <span className={styles.node} aria-hidden="true" />
                <Burst className={styles.goalBurst} />
                <h3 className={styles.verb}>{pathway.destination}</h3>
                <p className={styles.offering}>Your next chapter.</p>
              </div>
            </li>
          </ol>
        </Progress>

        <p className={styles.rule} data-reveal="fade">
          {pathway.rule}
        </p>

        <div className={styles.signals}>
          <h3 className={styles.signalsTitle} data-reveal="fade">
            {pathway.signalsTitle}
            <span>What unlocks each next step</span>
          </h3>
          <ul className={styles.signalList} role="list" data-reveal="stagger">
            {pathway.signals.map((s) => (
              <li key={s.q}>
                <p className={styles.q}>{s.q}</p>
                <p className={styles.measure}>{s.measure}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Page>
  );
}
