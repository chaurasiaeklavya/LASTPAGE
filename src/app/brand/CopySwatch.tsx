"use client";

import { useState } from "react";
import styles from "./brand.module.css";

export function CopySwatch({ hex, name, role }: { hex: string; name: string; role: string }) {
  const [copied, setCopied] = useState<"idle" | "ok" | "fail">("idle");
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied("ok");
    } catch {
      setCopied("fail");
    }
    window.setTimeout(() => setCopied("idle"), 1600);
  };
  const light = hex === "#FFFFFF" || hex === "#D0FF00";
  return (
    <button type="button" className={styles.swatch} style={{ background: hex, color: light ? "#1D1D1D" : "#FFFFFF" }} onClick={copy}>
      <span className={styles.swName}>{name}</span>
      <span className={styles.swHex}>{hex}</span>
      <span className={styles.swRole}>{role}</span>
      <span className={styles.swState} aria-live="polite">
        {copied === "ok" ? "Copied" : copied === "fail" ? "Copy failed — select the hex" : ""}
      </span>
      <span className="sr-only">Copy {hex}</span>
    </button>
  );
}
