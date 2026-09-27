"use client";

import { useCallback, useRef, useState } from "react";
import { decisionStages, type StageKey } from "@/content/site";
import { Burst } from "@/components/ui/Burst";
import { Action } from "@/components/ui/Action";
import { useGsap, getLenis } from "@/lib/motion";
import { MiniCover, Sketch, type CoverVariant } from "./MiniCover";
import styles from "./DecisionLog.module.css";

const N = decisionStages.length;

const promises: Record<"A" | "B" | "C", string> = {
  A: "Promises: another online course.",
  B: "Promises: confidence — but for whom?",
  C: "Promises: people who make things.",
};

/**
 * The worked example. On large screens with motion, the panel pins and
 * scrolling steps through the eight moves (snapping per move). Everywhere
 * else it's a plain stepper. Stage buttons always work, so it is fully
 * keyboard-operable either way.
 */
export function DecisionLog() {
  const [stage, setStage] = useState(0);
  const [option, setOption] = useState<"A" | "B" | "C">("A");
  const [split, setSplit] = useState(52);
  const [motion, setMotion] = useState(true);
  const [pinned, setPinned] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const stRef = useRef<{ start: number; end: number } | null>(null);
  const stageRef = useRef(0);

  useGsap(({ gsap, ScrollTrigger }) => {
    const el = wrap.current;
    const p = panel.current;
    if (!el || !p) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (min-height: 640px)", () => {
      setPinned(true);
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: () => `+=${(N - 1) * window.innerHeight * 0.62}`,
        pin: p,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        snap: { snapTo: 1 / (N - 1), duration: { min: 0.2, max: 0.6 }, delay: 0.08, ease: "power2.inOut" },
        onUpdate: (self) => {
          const i = Math.round(self.progress * (N - 1));
          if (i !== stageRef.current) {
            stageRef.current = i;
            setStage(i);
          }
        },
        onRefresh: (self) => {
          stRef.current = { start: self.start, end: self.end };
        },
      });
      stRef.current = { start: st.start, end: st.end };
      return () => {
        st.kill();
        stRef.current = null;
        setPinned(false);
      };
    });
    return () => mm.revert();
  }, []);

  const go = useCallback((i: number) => {
    const next = Math.max(0, Math.min(N - 1, i));
    const st = stRef.current;
    if (st) {
      const y = st.start + (next / (N - 1)) * (st.end - st.start);
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(y, { duration: 0.9 });
      else window.scrollTo({ top: y, behavior: "smooth" });
    }
    stageRef.current = next;
    setStage(next);
  }, []);

  const current = decisionStages[stage]!;
  const key: StageKey = current.key;

  return (
    <div ref={wrap} className={styles.wrap} data-pinned={pinned ? "true" : "false"}>
      <div ref={panel} className={styles.panel}>
        <div className={`container ${styles.grid}`}>
          <div className={styles.head}>
            <p className="label">Case in point — this website’s cover</p>
            <p className={`label ${styles.count}`} aria-hidden="true">
              <span>{String(stage + 1).padStart(2, "0")}</span> / {String(N).padStart(2, "0")}
            </p>
          </div>

          <div className={styles.side}>
            <ol className={styles.steps} role="list" aria-label="Decision stages">
              {decisionStages.map((s, i) => (
                <li key={s.key}>
                  <button
                    type="button"
                    className={styles.step}
                    aria-current={i === stage ? "step" : undefined}
                    onClick={() => go(i)}
                    data-done={i < stage ? "true" : "false"}
                  >
                    <span className={styles.stepNum}>{String(i + 1).padStart(2, "0")}</span>
                    <span className={styles.stepLabel}>{s.label}</span>
                  </button>
                </li>
              ))}
            </ol>

            <div className={styles.copy} aria-live="polite">
              <h3 key={`t-${key}`} className={styles.copyTitle}>
                {current.title}
              </h3>
              <p key={`b-${key}`} className={styles.copyBody}>
                {current.body}
              </p>
            </div>

            <div className={styles.nav}>
              <button type="button" className={styles.navBtn} onClick={() => go(stage - 1)} disabled={stage === 0}>
                <span aria-hidden="true">←</span> Previous
              </button>
              <button type="button" className={styles.navBtn} onClick={() => go(stage + 1)} disabled={stage === N - 1}>
                Next <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>

          <div className={styles.board}>
            <div className={styles.toolbar} aria-hidden="true">
              <span className={styles.dots}>
                <i />
                <i />
                <i />
              </span>
              <span className={styles.file}>cover.artboard</span>
              <span className={styles.stageTag}>{current.label}</span>
            </div>

            <div className={styles.canvas} data-stage={key}>
              {/* 01 Brief */}
              <Layer active={key === "brief"}>
                <div className={styles.brief}>
                  <p className={styles.briefTag}>Brief</p>
                  <p className={styles.briefLine}>A cover for a community built from Divergent Classes.</p>
                  <ul className={styles.checks} role="list">
                    <li>says design</li>
                    <li>says learning</li>
                    <li>says career</li>
                  </ul>
                  <div className={styles.swatches}>
                    <span style={{ background: "#D0FF00" }}>#D0FF00</span>
                    <span style={{ background: "#5200FF", color: "#fff" }}>#5200FF</span>
                    <span style={{ background: "#FFFFFF" }}>#FFFFFF</span>
                    <span style={{ background: "#1D1D1D", color: "#fff" }}>#1D1D1D</span>
                  </div>
                  <p className={styles.specimen}>
                    Aa <span>Space Grotesk</span>
                  </p>
                </div>
              </Layer>

              {/* 02 Explore */}
              <Layer active={key === "explore"}>
                <div className={styles.explore}>
                  {(["A", "B", "C"] as const).map((v) => (
                    <figure key={v} className={styles.sketchFig}>
                      <Sketch variant={v} />
                      <figcaption>
                        <b>{v}</b>{" "}
                        {v === "A" ? "Slogan over a photo" : v === "B" ? "Type alone" : "Type + an object from the kit"}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </Layer>

              {/* 03 Compare */}
              <Layer active={key === "compare"}>
                <div className={styles.compare}>
                  <div className={styles.segment} role="radiogroup" aria-label="Direction">
                    {(["A", "B", "C"] as const).map((v) => (
                      <button
                        key={v}
                        type="button"
                        role="radio"
                        aria-checked={option === v}
                        className={styles.segBtn}
                        onClick={() => setOption(v)}
                        tabIndex={key === "compare" ? 0 : -1}
                      >
                        Direction {v}
                      </button>
                    ))}
                  </div>
                  <div className={styles.compareStage}>
                    {(["A", "B", "C"] as const).map((v) => (
                      <div key={v} className={styles.compareItem} data-on={option === v ? "true" : "false"}>
                        <MiniCover variant={v as CoverVariant} />
                      </div>
                    ))}
                  </div>
                  <p className={styles.note}>{promises[option]}</p>
                </div>
              </Layer>

              {/* 04 Reject */}
              <Layer active={key === "reject"}>
                <div className={styles.reject}>
                  {(["A", "B"] as const).map((v) => (
                    <figure key={v} className={styles.rejectFig}>
                      <div className={styles.rejectCover}>
                        <MiniCover variant={v} />
                        <span className={styles.strike} />
                        <span className={styles.stamp}>Rejected</span>
                      </div>
                      <figcaption>{v === "A" ? "A — could be any course site." : "B — striking, but lost the people."}</figcaption>
                    </figure>
                  ))}
                </div>
              </Layer>

              {/* 05 Decide */}
              <Layer active={key === "decide"}>
                <div className={styles.decide}>
                  <div className={styles.decideCover}>
                    <MiniCover variant="C" />
                  </div>
                  <div className={styles.approved}>
                    <Burst className={styles.approvedBurst} />
                    <span>Picked</span>
                  </div>
                  <p className={styles.note}>The computer is already in the brand kit. It says making, not studying.</p>
                </div>
              </Layer>

              {/* 06 Iterate */}
              <Layer active={key === "iterate"}>
                <div className={styles.iterate}>
                  <div className={styles.compareSlider} style={{ "--split": `${split}%` } as React.CSSProperties} data-cursor="Drag">
                    <div className={styles.sliderBase}>
                      <MiniCover variant="v2" />
                      <span className={`${styles.vTag} ${styles.vTagR}`}>v2</span>
                    </div>
                    <div className={styles.sliderTop}>
                      <MiniCover variant="v1" />
                      <span className={styles.vTag}>v1</span>
                    </div>
                    <span className={styles.handle} aria-hidden="true">
                      <span />
                    </span>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={split}
                      onChange={(e) => setSplit(Number(e.target.value))}
                      className={styles.range}
                      aria-label="Compare version 1 and version 2"
                      tabIndex={key === "iterate" ? 0 : -1}
                    />
                  </div>
                </div>
              </Layer>

              {/* 07 Ship */}
              <Layer active={key === "ship"}>
                <div className={styles.ship}>
                  <div className={styles.shipCover}>
                    <MiniCover variant="v2" animate={motion} />
                  </div>
                  <button
                    type="button"
                    className={styles.toggle}
                    aria-pressed={motion}
                    onClick={() => setMotion((m) => !m)}
                    tabIndex={key === "ship" ? 0 : -1}
                  >
                    <span className={styles.toggleTrack}>
                      <span />
                    </span>
                    Motion {motion ? "on" : "off"}
                  </button>
                  <p className={styles.note}>{motion ? "The caret blinks; the screen is alive." : "Still reads. Still says design, learning, career."}</p>
                </div>
              </Layer>

              {/* 08 Reflect */}
              <Layer active={key === "reflect"}>
                <div className={styles.reflect}>
                  <p className={styles.briefTag}>Open question</p>
                  <div className={styles.ab}>
                    <span className={styles.abA}>Join the community</span>
                    <span className={styles.vs}>or</span>
                    <span className={styles.abB}>Host a session</span>
                  </div>
                  <p className={styles.pending}>Test not yet run — no results to show.</p>
                  <div className={styles.reflectCta}>
                    <Action href="#contact-form" variant="violet" intent="brief">
                      Bring us a brief
                    </Action>
                  </div>
                </div>
              </Layer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Layer({ active, children }: { active: boolean; children: React.ReactNode }) {
  return (
    <div className={styles.layer} data-active={active ? "true" : "false"} aria-hidden={!active} inert={!active}>
      {children}
    </div>
  );
}
