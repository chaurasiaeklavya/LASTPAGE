import { session, pages, INSTAGRAM_URL, INSTAGRAM_HANDLE } from "@/content/site";
import { Page } from "@/components/layout/Page";
import { Action } from "@/components/ui/Action";
import { PosterViewer } from "./PosterViewer";
import styles from "./SessionFile.module.css";

/** p.03 — the one documented practitioner session [D4]. Human, specific, no inflation. */
export function SessionFile() {
  const meta = pages[3];
  return (
    <Page id={meta.id} num={meta.num} label={meta.label} theme={meta.theme} className={styles.page}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.text}>
          <p className={`label ${styles.held}`} data-reveal="fade">
            <span className={styles.pulse} aria-hidden="true" />
            <time dateTime={session.dateISO}>{session.held}</time>
          </p>

          <h2 id={`${meta.id}-title`} className={`display ${styles.title}`} data-reveal="lines">
            <span className="line">
              <span>{session.title[0]}</span>
            </span>
            <span className="line">
              <span className="accent-lime">{session.title[1]}</span>
            </span>
          </h2>

          <div className={styles.person} data-reveal="fade">
            <p className={styles.name}>{session.name}</p>
            <p className={styles.role}>{session.role}</p>
          </div>

          <div className={styles.covered} data-reveal="fade">
            <p className="label">What the room got into</p>
            <ul className={styles.topics} role="list">
              {session.topics.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>

          <p className={styles.disclaimer} data-reveal="fade">
            <span aria-hidden="true" className={styles.i}>
              i
            </span>
            {session.disclaimer}
          </p>
        </div>

        <div className={styles.side}>
          <PosterViewer src={session.poster.src} width={session.poster.width} height={session.poster.height} alt={session.poster.alt} />

          <aside className={styles.next} aria-label="Upcoming sessions" data-reveal="fade">
            <p className="label">Next session</p>
            <p className={styles.nextText}>
              Follow <strong>{INSTAGRAM_HANDLE}</strong> for upcoming sessions.
            </p>
            <Action href={INSTAGRAM_URL} variant="primary">
              Follow on Instagram
            </Action>
          </aside>
        </div>
      </div>
    </Page>
  );
}
