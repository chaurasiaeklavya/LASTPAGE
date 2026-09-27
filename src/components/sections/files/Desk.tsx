"use client";

import Image from "next/image";
import { useRef, useState, type KeyboardEvent } from "react";
import { files } from "@/content/site";
import { Burst } from "@/components/ui/Burst";
import styles from "./Desk.module.css";

type FileId = (typeof files.items)[number]["id"];

const folderArt: Record<FileId, string> = {
  poster: "/media/folder-lime.png",
  dice: "/media/folder-violet.png",
  identity: "/media/folder-lime.png",
};

/**
 * A desktop with three folders (tabs) and one open window (tab panel).
 * Each artifact carries numbered pins; the same notes are listed beside it
 * so nothing depends on hovering.
 */
export function Desk() {
  const [active, setActive] = useState<FileId>("poster");
  const [pin, setPin] = useState<number | null>(null);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const file = files.items.find((f) => f.id === active)!;

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const n = files.items.length;
    let next = -1;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = (i + 1) % n;
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = (i - 1 + n) % n;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = n - 1;
    if (next >= 0) {
      e.preventDefault();
      const id = files.items[next]!.id;
      setActive(id);
      setPin(null);
      tabs.current[next]?.focus();
    }
  };

  return (
    <div className={styles.desk}>
      <div className={styles.icons} role="tablist" aria-label="Files" aria-orientation="vertical">
        {files.items.map((f, i) => (
          <button
            key={f.id}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`file-tab-${f.id}`}
            aria-selected={active === f.id}
            aria-controls="file-window"
            tabIndex={active === f.id ? 0 : -1}
            className={styles.icon}
            onClick={() => {
              setActive(f.id);
              setPin(null);
            }}
            onKeyDown={(e) => onKey(e, i)}
            data-cursor="Open"
          >
            <span className={styles.folder}>
              <Image src={folderArt[f.id] ?? "/media/folder-lime.png"} alt="" width={400} height={350} sizes="96px" />
            </span>
            <span className={styles.iconText}>
              <span className={styles.iconName}>{f.filename}</span>
              <span className={styles.iconTitle}>{f.title}</span>
            </span>
          </button>
        ))}
      </div>

      <div className={styles.window} role="tabpanel" id="file-window" aria-labelledby={`file-tab-${active}`}>
        <div className={styles.titlebar}>
          <span className={styles.controls} aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className={styles.wTitle}>{file.filename}</span>
          <span className={styles.wMeta}>{file.subtitle}</span>
        </div>

        <div className={styles.body} key={active}>
          <div className={`${styles.artifact} ${styles[`art-${active}`]}`}>
            <div className={styles.artInner}>
              {active === "poster" ? (
                <Image
                  src="/media/session-amrita-bisht-poster.jpg"
                  alt="Session poster for Inside Zepto’s Brand Design, 30 August."
                  width={1080}
                  height={1940}
                  sizes="(max-width: 900px) 60vw, 22vw"
                />
              ) : null}
              {active === "dice" ? (
                <Image
                  src="/media/dice-character-sheet.jpg"
                  alt="Character sheet for DICE: a rabbit in a grey suit shown front, three-quarter, side and back, with six expressions, detail callouts, outfit and colour palette."
                  width={2160}
                  height={1215}
                  sizes="(max-width: 900px) 92vw, 46vw"
                />
              ) : null}
              {active === "identity" ? <Identity /> : null}

              {file.notes.map((n, i) => (
                <button
                  key={n.text}
                  type="button"
                  className={styles.pin}
                  style={{ left: `${n.x}%`, top: `${n.y}%` }}
                  aria-label={`Note ${i + 1}: ${n.text}`}
                  aria-pressed={pin === i}
                  onMouseEnter={() => setPin(i)}
                  onMouseLeave={() => setPin(null)}
                  onFocus={() => setPin(i)}
                  onBlur={() => setPin(null)}
                  onClick={() => setPin(pin === i ? null : i)}
                  data-on={pin === i ? "true" : "false"}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          <ol className={styles.notes} role="list">
            {file.notes.map((n, i) => (
              <li
                key={n.text}
                data-on={pin === i ? "true" : "false"}
                onMouseEnter={() => setPin(i)}
                onMouseLeave={() => setPin(null)}
              >
                <span className={styles.noteNum}>{i + 1}</span>
                <span>{n.text}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

/** The identity file, rendered live from the kit's rules [K2]. */
function Identity() {
  return (
    <div className={styles.identity}>
      <p className={styles.idV1}>
        <span>
          The Last Page<i>.</i>
        </span>
        <span className={styles.idLime}>
          The Last Page<i>.</i>
        </span>
      </p>
      <div className={styles.idMid}>
        <p className={styles.idV2}>
          <span>The</span>
          <span>Last</span>
          <span>
            Page<i>.</i>
          </span>
        </p>
        <Burst className={styles.idBurst} />
      </div>
      <ul className={styles.idPalette} role="list" aria-label="Palette">
        <li style={{ background: "#D0FF00", color: "#1D1D1D" }}>#D0FF00</li>
        <li style={{ background: "#5200FF", color: "#FFFFFF" }}>#5200FF</li>
        <li style={{ background: "#FFFFFF", color: "#1D1D1D" }}>#FFFFFF</li>
      </ul>
    </div>
  );
}
