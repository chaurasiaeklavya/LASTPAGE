import Image from "next/image";
import styles from "./MiniCover.module.css";

export type CoverVariant = "A" | "B" | "C" | "v1" | "v2";

/**
 * Scaled-down cover compositions used inside the decision log's artboard.
 * Sizes are in container-query units so each renders at any artboard size.
 * "A" is a deliberately generic straw man — the direction that was rejected.
 */
export function MiniCover({ variant, animate = false }: { variant: CoverVariant; animate?: boolean }) {
  if (variant === "A") {
    return (
      <div className={`${styles.cover} ${styles.a}`}>
        <div className={styles.aPhoto}>
          <span />
        </div>
        <div className={styles.aCopy}>
          <p className={styles.aHead}>Learn Design. Build Your Future.</p>
          <p className={styles.aSub}>Courses for every aspiring creative</p>
          <span className={styles.aBtn}>Get Started</span>
        </div>
      </div>
    );
  }
  if (variant === "B") {
    return (
      <div className={`${styles.cover} ${styles.b}`}>
        <p className={styles.bType}>
          The Last Page<span>.</span>
        </p>
      </div>
    );
  }
  const stacked = variant !== "v1";
  return (
    <div className={`${styles.cover} ${styles.c} ${stacked ? styles.stacked : styles.flat}`} data-animate={animate ? "true" : "false"}>
      <div className={styles.glow} />
      <div className={styles.cDesk}>
        <Image src="/media/hero-desk.jpg" alt="" width={1536} height={1024} sizes="(max-width: 900px) 60vw, 34vw" />
        <span className={styles.cCaret} />
      </div>
      {stacked ? (
        <p className={styles.cType}>
          <span>The</span>
          <span>Last</span>
          <span>
            Page<i>.</i>
          </span>
        </p>
      ) : (
        <p className={styles.cTypeFlat}>The Last Page.</p>
      )}
      <div className={styles.cBar}>
        <span className={styles.cLead} />
        <span className={styles.cBtn} />
      </div>
    </div>
  );
}

/** Wireframe thumbnails for the "Explore" stage — sketches, not finishes. */
export function Sketch({ variant }: { variant: "A" | "B" | "C" }) {
  return (
    <div className={`${styles.sketch} ${styles[`s${variant}`]}`}>
      {variant === "A" ? (
        <>
          <span className={styles.sPhoto} />
          <span className={styles.sLineW} />
          <span className={styles.sLineS} />
          <span className={styles.sPill} />
        </>
      ) : null}
      {variant === "B" ? (
        <>
          <span className={styles.sBig} />
          <span className={styles.sBig} />
        </>
      ) : null}
      {variant === "C" ? (
        <>
          <span className={styles.sStack}>
            <span />
            <span />
            <span />
          </span>
          <span className={styles.sObject} />
        </>
      ) : null}
    </div>
  );
}
