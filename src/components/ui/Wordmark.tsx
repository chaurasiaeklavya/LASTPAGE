import styles from "./Wordmark.module.css";

type WordmarkProps = {
  /** V1 = one line (kit "WORD MARK"), V2 = stacked (kit "V2"). */
  variant?: "v1" | "v2";
  className?: string;
  dot?: "inherit" | "violet" | "lime";
  as?: "span" | "p" | "div";
};

/** THE LAST PAGE. — the full stop is part of the name [K2]. */
export function Wordmark({ variant = "v1", className, dot = "inherit", as: Tag = "span" }: WordmarkProps) {
  const dotClass = dot === "inherit" ? "" : styles[dot];
  return (
    <Tag className={`${styles.mark} ${styles[variant]} ${className ?? ""}`} aria-label="The Last Page">
      {variant === "v2" ? (
        <>
          <span aria-hidden="true">The</span>
          <span aria-hidden="true">Last</span>
          <span aria-hidden="true">
            Page<span className={dotClass}>.</span>
          </span>
        </>
      ) : (
        <span aria-hidden="true">
          The Last Page<span className={dotClass}>.</span>
        </span>
      )}
    </Tag>
  );
}
