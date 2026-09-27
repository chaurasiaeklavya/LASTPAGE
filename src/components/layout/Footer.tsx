import Link from "next/link";
import { INSTAGRAM_URL, INSTAGRAM_HANDLE, site } from "@/content/site";
import { ArrowUpRight } from "@/components/ui/icons";
import styles from "./Footer.module.css";

export function Footer({ home = true }: { home?: boolean }) {
  const prefix = home ? "" : "/";
  return (
    <footer className={styles.footer} data-theme="dark" data-nav-theme="dark">
      <div className={`container ${styles.inner}`}>
        <div className={styles.cols}>
          <div className={styles.about}>
            <p className={styles.tag}>{site.tagline}</p>
            <p className={styles.origin}>{site.origin}</p>
          </div>
          <nav className={styles.links} aria-label="Footer">
            <p className="label">Explore</p>
            <ul role="list">
              <li>
                <a href={`${prefix}#decisions`}>Show the decisions</a>
              </li>
              <li>
                <a href={`${prefix}#the-pathway`}>The pathway</a>
              </li>
              <li>
                <a href={`${prefix}#contact-form`}>Build with us</a>
              </li>
              <li>
                <Link href="/brand">Media &amp; brand kit</Link>
              </li>
            </ul>
          </nav>
          <div className={styles.links}>
            <p className="label">Follow</p>
            <ul role="list">
              <li>
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                  Instagram {INSTAGRAM_HANDLE} <ArrowUpRight size={13} />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p className={styles.mark} aria-hidden="true">
          The Last Page<span>.</span>
        </p>

        <div className={styles.base}>
          <p>© {new Date().getFullYear()} The Last Page. A community built from Divergent Classes.</p>
          <a href={home ? "#cover" : "/"} className={styles.top}>
            {home ? "Back to the cover ↑" : "Back to the issue ←"}
          </a>
        </div>
      </div>
    </footer>
  );
}
