import Image from "next/image";
import type { Metadata } from "next";
import { Action } from "@/components/ui/Action";
import styles from "./not-found.module.css";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <main id="main" className={styles.main} data-theme="dark">
      <div className={`container ${styles.inner}`}>
        <p className="label">Error 404</p>
        <h1 className={`display ${styles.title}`}>
          <span>This page</span>
          <span className="accent-lime">isn’t written yet.</span>
        </h1>
        <p className="lead">The link may be old, or the page moved. The issue itself is one click away.</p>
        <div className={styles.ctas}>
          <Action href="/">Back to the cover</Action>
          <Action href="/brand" variant="ghost">
            Brand kit
          </Action>
        </div>
      </div>
      <Image src="/media/dice-steeple.png" alt="" width={565} height={1129} className={styles.dice} sizes="20vw" />
    </main>
  );
}
