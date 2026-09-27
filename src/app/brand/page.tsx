import type { Metadata } from "next";
import Image from "next/image";
import { brandKit, INSTAGRAM_URL, INSTAGRAM_HANDLE } from "@/content/site";
import { Burst } from "@/components/ui/Burst";
import { Action } from "@/components/ui/Action";
import { Footer } from "@/components/layout/Footer";
import { Reveals } from "@/components/motion/Reveals";
import { CopySwatch } from "./CopySwatch";
import styles from "./brand.module.css";

export const metadata: Metadata = {
  title: "Media & brand kit",
  description: "The Last Page wordmark, colours, typography, assets and usage rules — for press, partners and collaborators.",
  alternates: { canonical: "/brand" },
};

/** The media & brand kit [K1–K7], as a living page rather than a PDF. */
export default function BrandPage() {
  return (
    <>
      <main id="main" className={styles.main} data-theme="dark">
        <header className={`container ${styles.hero}`}>
          <p className="label">Media &amp; brand kit</p>
          <h1 className={`display ${styles.title}`} data-reveal="lines">
            <span className="line">
              <span>The Last Page</span>
            </span>
            <span className="line">
              <span className="accent-lime">in its own words.</span>
            </span>
          </h1>
          <p className={`lead ${styles.boiler}`}>{brandKit.boilerplate}</p>
        </header>

        <section className={`container ${styles.block}`} aria-labelledby="wordmark">
          <h2 id="wordmark" className={styles.h2}>
            <span>01</span> Logo mark
          </h2>
          <div className={styles.marks}>
            <figure className={styles.markCard}>
              <div className={styles.markV1}>
                <span>
                  The Last Page<i>.</i>
                </span>
                <span className="accent-lime">
                  The Last Page<i>.</i>
                </span>
              </div>
              <figcaption>Word mark — white and lime.</figcaption>
            </figure>
            <figure className={styles.markCard}>
              <div className={styles.markV2Row}>
                <p className={styles.markV2}>
                  <span>The</span>
                  <span>Last</span>
                  <span>
                    Page<i>.</i>
                  </span>
                </p>
                <p className={`${styles.markV2} accent-lime`}>
                  <span>The</span>
                  <span>Last</span>
                  <span>
                    Page<i>.</i>
                  </span>
                </p>
              </div>
              <figcaption>V2 — stacked, for posters and square formats.</figcaption>
            </figure>
          </div>
        </section>

        <section className={`container ${styles.block}`} aria-labelledby="palette">
          <h2 id="palette" className={styles.h2}>
            <span>02</span> Colour
          </h2>
          <p className={styles.help}>Click a swatch to copy its hex value.</p>
          <ul className={styles.palette} role="list">
            {brandKit.palette.map((c) => (
              <li key={c.hex}>
                <CopySwatch hex={c.hex} name={c.name} role={c.role} />
              </li>
            ))}
          </ul>
        </section>

        <section className={`container ${styles.block}`} aria-labelledby="type">
          <h2 id="type" className={styles.h2}>
            <span>03</span> Typography
          </h2>
          <ul className={styles.type} role="list">
            {brandKit.type.map((t, i) => (
              <li key={t.family} className={styles.typeRow} data-font={i}>
                <p className={styles.specimen}>Aa</p>
                <div>
                  <p className={styles.family}>{t.family}</p>
                  <p className={styles.role}>
                    {t.role} · {t.use}
                  </p>
                </div>
                <p className={styles.sample}>From learning design to building a creative career.</p>
              </li>
            ))}
          </ul>
        </section>

        <section className={`container ${styles.block}`} aria-labelledby="assets">
          <h2 id="assets" className={styles.h2}>
            <span>04</span> Assets
          </h2>
          <div className={styles.assets}>
            <figure className={styles.asset}>
              <div className={styles.assetBox}>
                <Image src="/media/folder-lime.png" alt="Lime folder asset" width={384} height={342} sizes="160px" />
                <Image src="/media/folder-violet.png" alt="Violet folder asset" width={402} height={352} sizes="160px" />
              </div>
              <figcaption>Folders</figcaption>
            </figure>
            <figure className={styles.asset}>
              <div className={styles.assetBox}>
                <span className={`${styles.gridBg} ${styles.gridViolet}`} />
                <span className={`${styles.gridBg} ${styles.gridLime}`} />
              </div>
              <figcaption>Grid backgrounds</figcaption>
            </figure>
            <figure className={styles.asset}>
              <div className={styles.assetBox}>
                <Burst className={styles.assetBurst} />
              </div>
              <figcaption>Burst</figcaption>
            </figure>
            <figure className={styles.asset}>
              <div className={`${styles.assetBox} ${styles.paper}`}>
                <Image src="/media/dice-steeple.png" alt="DICE, the rabbit character, hands steepled." width={565} height={1129} sizes="120px" className={styles.dice} />
              </div>
              <figcaption>Character — DICE</figcaption>
            </figure>
            <figure className={`${styles.asset} ${styles.wide}`}>
              <div className={`${styles.assetBox} ${styles.black}`}>
                <Image src="/media/computer-tlp.png" alt="Retro computer with THE LAST PAGE. on its screen." width={1070} height={1041} sizes="(max-width: 900px) 80vw, 30vw" className={styles.computer} />
              </div>
              <figcaption>Retro computer</figcaption>
            </figure>
          </div>
        </section>

        <section className={`container ${styles.block}`} aria-labelledby="usage">
          <h2 id="usage" className={styles.h2}>
            <span>05</span> Usage
          </h2>
          <div className={styles.usage}>
            <div className={styles.do}>
              <h3>Do</h3>
              <ul role="list">
                {brandKit.do.map(([strong = "", rest = ""]) => (
                  <li key={strong + rest}>
                    {strong ? <strong>{strong}</strong> : null}
                    {rest}
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.dont}>
              <h3>Don’t</h3>
              <ul role="list">
                {brandKit.dont.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className={`container ${styles.block} ${styles.contact}`} aria-labelledby="press">
          <h2 id="press" className={styles.h2}>
            <span>06</span> Press &amp; custom assets
          </h2>
          <p className="lead">Need custom assets or clarification? Reach the team.</p>
          <div className={styles.ctas}>
            <Action href={INSTAGRAM_URL}>{`Message ${INSTAGRAM_HANDLE}`}</Action>
            <Action href="/#contact-form" variant="ghost" intent="other">
              Use the contact form
            </Action>
          </div>
        </section>
      </main>
      <Footer home={false} />
      <Reveals />
    </>
  );
}
