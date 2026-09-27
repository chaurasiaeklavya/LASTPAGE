import { partners, pages } from "@/content/site";
import { Page } from "@/components/layout/Page";
import { ContactForm } from "./ContactForm";
import styles from "./Partners.module.css";

/** p.09 — partner roles [D11], proposed formats [D10], and a working form [D14]. */
export function Partners() {
  const meta = pages[9];
  return (
    <Page id={meta.id} num={meta.num} label={meta.label} theme={meta.theme} className={styles.page}>
      <div className={`container ${styles.inner}`}>
        <h2 id={`${meta.id}-title`} className={`display ${styles.title}`} data-reveal="lines">
          <span className="line">
            <span>{partners.title[0]}</span>
          </span>
          <span className="line">
            <span className="accent-lime">{partners.title[1]}</span>
          </span>
        </h2>

        <div className={styles.grid}>
          <div className={styles.left}>
            <ul className={styles.roles} role="list" data-reveal="stagger">
              {partners.roles.map((r, i) => (
                <li key={r.title}>
                  <a href="#contact-form" data-intent={r.intent} className={styles.role} data-tone={i === 1 ? "lime" : "violet"}>
                    <span className={styles.roleTitle}>{r.title}</span>
                    <span className={styles.roleLine}>{r.line}</span>
                  </a>
                </li>
              ))}
            </ul>
            <p className={styles.note} data-reveal="fade">
              {partners.note}
            </p>

            <div className={styles.proposed} data-reveal="fade">
              <p className="label">{partners.proposedLabel}</p>
              <ul role="list">
                {partners.proposed.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className={styles.right} id="contact-form">
            <div className={styles.formCard} data-reveal="fade">
              <h3 className={styles.formTitle}>{partners.formTitle}</h3>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}
