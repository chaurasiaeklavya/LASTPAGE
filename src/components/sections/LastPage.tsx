import Image from "next/image";
import { lastPage, pages, INSTAGRAM_URL, INSTAGRAM_HANDLE } from "@/content/site";
import { Page } from "@/components/layout/Page";
import { Action } from "@/components/ui/Action";
import { Burst } from "@/components/ui/Burst";
import { ArrowUpRight } from "@/components/ui/icons";
import { Parallax } from "@/components/motion/Parallax";
import { Spin } from "@/components/motion/Spin";
import styles from "./LastPage.module.css";

/** p.10 — the vision [D13], then the last page itself [D14]. */
export function LastPage() {
  const meta = pages[10];
  return (
    <Page id={meta.id} num={meta.num} label={meta.label} theme={meta.theme} className={styles.page} bare labelledBy="final-title">
      <div className={styles.vision} data-theme="dark" data-nav-theme="dark">
        <Parallax className={styles.network} speed={-12}>
          <Image src="/media/network.jpg" alt="" width={1536} height={1024} sizes="(max-width: 900px) 140vw, 75vw" />
        </Parallax>
        <div className={`container ${styles.visionInner}`}>
          <p className="label" data-reveal="fade">
            Our vision
          </p>
          <h2 className={`display ${styles.visionTitle}`} data-reveal="lines">
            {lastPage.vision.map((l, i) => (
              <span key={l} className="line">
                <span className={i >= 2 ? "accent-lime" : undefined}>{l}</span>
              </span>
            ))}
          </h2>
          <p className={`lead ${styles.visionLine}`} data-reveal="fade">
            {lastPage.visionLine}
          </p>
        </div>
      </div>

      <div className={styles.final} data-nav-theme="violet">
        <Spin className={styles.burst} turns={0.25}>
          <Burst layers={["white", "violet", "lime"]} />
        </Spin>

        <div className={`container ${styles.finalInner}`}>
          <h2 id="final-title" className={`display ${styles.finalTitle}`} data-reveal="lines">
            {lastPage.title.map((l, i) => (
              <span key={l} className="line">
                <span className={i > 0 ? "accent-lime" : undefined}>{l}</span>
              </span>
            ))}
          </h2>

          <div className={styles.close}>
            <div className={styles.handle}>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className={styles.ig} data-magnetic>
                {INSTAGRAM_HANDLE}
                <ArrowUpRight size={28} />
                <span className="sr-only"> on Instagram (opens in a new tab)</span>
              </a>
              <p className={styles.actions}>{lastPage.actions}</p>
              <div className={styles.ctas}>
                <Action href={INSTAGRAM_URL}>Join the community</Action>
                <Action href="#contact-form" variant="ghost" intent="host">
                  Host a session
                </Action>
                <Action href="#contact-form" variant="text" intent="other">
                  Build with us
                </Action>
              </div>
            </div>
            <figure className={styles.qr}>
              <Image src="/media/qr-instagram.png" alt={`QR code linking to ${INSTAGRAM_HANDLE} on Instagram`} width={470} height={470} sizes="140px" />
              <figcaption>Scan to join</figcaption>
            </figure>
          </div>
        </div>

        <Parallax className={styles.dice} speed={10} axis="x">
          <Image
            src="/media/dice-walk.png"
            alt="DICE, the rabbit character, walking off the page in a grey suit and violet tie."
            width={383}
            height={1215}
            sizes="(max-width: 900px) 18vw, 9vw"
          />
        </Parallax>
      </div>
    </Page>
  );
}
