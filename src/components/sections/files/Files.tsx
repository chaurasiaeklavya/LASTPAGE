import { files, pages } from "@/content/site";
import { Page } from "@/components/layout/Page";
import { Action } from "@/components/ui/Action";
import { Desk } from "./Desk";
import styles from "./Files.module.css";

/** p.05 — real artifacts from the brand's own desk, annotated [D4, K2, K5]. */
export function Files() {
  const meta = pages[5];
  return (
    <Page id={meta.id} num={meta.num} label={meta.label} theme={meta.theme} className={styles.page}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.header}>
          <h2 id={`${meta.id}-title`} className={`display ${styles.title}`} data-reveal="lines">
            <span className="line">
              <span>{files.title[0]}</span>
            </span>
            <span className="line">
              <span className="accent-lime">{files.title[1]}</span>
            </span>
          </h2>
          <div className={styles.aside} data-reveal="fade">
            <p className="lead">{files.intro}</p>
            <Action href="/brand" variant="text" icon="right">
              Open the full brand kit
            </Action>
          </div>
        </div>

        <Desk />
      </div>
    </Page>
  );
}
