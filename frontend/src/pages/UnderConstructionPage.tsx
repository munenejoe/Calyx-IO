import React, { useEffect, useRef, useState } from "react";

/**
 * CALYX FLORA — Under Construction / Extraction Engine
 * -----------------------------------------------------
 * Portable, self-contained replacement for the Search route.
 * Drop this single file into any CALYX FLORA React project.
 * No external dependencies beyond React. All styling, SVG
 * decoration and animation logic live inside this file.
 */

const STAGES = [
  {
    id: "DEFINE",
    title: "Botanical Boundaries",
    desc: "Building the labelled dataset that teaches CALYX the precise boundaries of reproductive structures.",
    tech: "YOLO POLYGON DATASET",
  },
  {
    id: "EXTRACT",
    title: "Teach CALYX to See",
    desc: "Training the lightweight segmentation model to isolate reproductive structures from flower imagery.",
    tech: "YOLOv8 NANO SEGMENTATION",
  },
  {
    id: "COMPILE",
    title: "Make the Model Portable",
    desc: "Converting the trained model into a lightweight ONNX representation for production inference.",
    tech: "PYTORCH \u2192 ONNX",
  },
  {
    id: "DEPLOY",
    title: "Put Intelligence Into CALYX",
    desc: "Deploying the lightweight model behind the production FastAPI inference layer.",
    tech: "FASTAPI \u00B7 ONNXRUNTIME \u00B7 CPU",
  },
];

const STAGE_DURATION_MS = 6000;

// A gear is drawn as a ring of rectangular teeth around a circle —
// generated once at module load, never recomputed during animation.
function buildGearTeeth(
  toothCount: number,
  innerR: number,
  outerR: number,
  toothWidth: number
): React.ReactNode[] {
  const teeth: React.ReactNode[] = [];

  for (let i = 0; i < toothCount; i++) {
    const angle = (360 / toothCount) * i;

    teeth.push(
      <rect
        key={i}
        x={-toothWidth / 2}
        y={-outerR}
        width={toothWidth}
        height={outerR - innerR}
        transform={`rotate(${angle})`}
      />
    );
  }

  return teeth;
}

const MAIN_GEAR_TEETH = buildGearTeeth(8, 34, 44, 7);
const SECOND_GEAR_TEETH = buildGearTeeth(6, 21, 28, 6);

type GearProps = {
  size: number;
  className?: string;
  teeth: React.ReactNode[];
};

function Gear({ size, className = "", teeth }: GearProps) {
  return (
    <svg
      className={className}
      viewBox="-50 -50 100 100"
      width={size}
      height={size}
      aria-hidden="true"
    >
      <g fill="var(--rustwood)">
        <circle r={size * 0.001} />
        {teeth}
      </g>

      <circle
        r={size >= 60 ? 34 : 21}
        fill="none"
        stroke="var(--rustwood)"
        strokeWidth="3"
      />

      <circle
        r={size >= 60 ? 8 : 5}
        fill="var(--rustwood)"
      />
    </svg>
  );
}

export default function UnderConstructionPage() {
  const [active, setActive] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const t = window.setTimeout(() => setRevealed(true), 60);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setActive((i) => (i + 1) % STAGES.length);
    }, STAGE_DURATION_MS);
    return () => window.clearInterval(timerRef.current);
  }, []);

  const stage = STAGES[active];
  const upcoming = [0, 1, 2].map((offset) => STAGES[(active + offset) % STAGES.length]);
  const indicatorAngle = active * 90;

  return (
    <div className={`ucp-root ${revealed ? "ucp-revealed" : ""}`}>
      <style>{CSS}</style>

      <div className="ucp-bg" aria-hidden="true" />

      <header className="ucp-topbar">
        <span className="ucp-wordmark">CALYX FLORA</span>
        <div className="ucp-capsule">
          <span className="ucp-dot" aria-hidden="true" />
          <span>LOADING &mdash; UNDER CONSTRUCTION</span>
          <Gear size={16} className="ucp-capsule-gear" teeth={SECOND_GEAR_TEETH} />
        </div>
      </header>

      <main className="ucp-main">
        <div className="ucp-watch-wrap">
          <svg className="ucp-watch" viewBox="0 0 400 400" role="img" aria-label="CALYX extraction engine status watch">
            <g className="ucp-roots" opacity="0.4">
              <path d="M40,120 C110,90 150,150 200,150" />
              <path d="M360,110 C290,80 250,150 200,150" />
              <path d="M50,300 C120,320 160,260 200,260" />
              <path d="M350,300 C280,320 240,260 200,260" />
            </g>

            <circle className="ucp-ring-outer" cx="200" cy="200" r="178" />
            <circle className="ucp-ring-inner" cx="200" cy="200" r="148" strokeDasharray="2 8" />

            <g transform="translate(200,86)">
              <g className="ucp-gear-main">
                <Gear size={78} teeth={MAIN_GEAR_TEETH} />
              </g>
            </g>
            <g transform="translate(300,300)">
              <g className="ucp-gear-secondary">
                <Gear size={50} teeth={SECOND_GEAR_TEETH} />
              </g>
            </g>

            <g className="ucp-indicator-group" style={{ transform: `rotate(${indicatorAngle}deg)` }}>
              <circle className="ucp-indicator" cx="200" cy="30" r="5" />
            </g>
          </svg>

          <div className="ucp-hub" role="status" aria-live="polite">
            <span className="ucp-hub-stage">{stage.id}</span>
            <span className="ucp-hub-title">{stage.title}</span>
            <span className="ucp-hub-tech">{stage.tech}</span>
          </div>
        </div>

        <h1 className="ucp-headline">Calyx Extraction Engine</h1>
        <p className="ucp-subhead">Building the next generation of botanical segmentation.</p>

        <ul className="ucp-tasklist" aria-hidden="true">
          {upcoming.map((s, idx) => (
            <li key={s.id} className={idx === 0 ? "ucp-task-active" : ""}>
              <span className="ucp-task-id">{s.id}</span>
              <span className="ucp-task-title">{s.title}</span>
            </li>
          ))}
        </ul>

        <ol className="ucp-progress" aria-label="Development stages">
          {STAGES.map((s, i) => (
            <li key={s.id} className={i === active ? "is-active" : i < active ? "is-done" : ""}>
              <span className="ucp-progress-mark" aria-hidden="true">
                {i < active ? "\u2713" : i === active ? "\u25C9" : "\u25CB"}
              </span>
              <span className="ucp-progress-label">{s.id}</span>
            </li>
          ))}
        </ol>
      </main>
    </div>
  );
}

const CSS = `
.ucp-root {
  --golden-oat: #F2C48D;
  --rustwood: #863A18;
  --evergreen: #515932;
  --midnight: #0D0D0D;

  position: relative;
  min-height: 100vh;
  width: 100%;
  min-width: 320px;
  overflow-x: hidden;
  background: var(--golden-oat);
  color: var(--midnight);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}
.ucp-root * { box-sizing: border-box; }

.ucp-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 20% 15%, rgba(134,58,24,0.06), transparent 45%),
    radial-gradient(circle at 80% 85%, rgba(81,89,50,0.08), transparent 50%);
  pointer-events: none;
}

.ucp-topbar {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28px 32px;
  opacity: 0;
  transform: translateY(-8px);
  transition: opacity 0.7s ease, transform 0.7s ease;
  transition-delay: 0.1s;
  flex-wrap: wrap;
  gap: 12px;
}
.ucp-revealed .ucp-topbar { opacity: 1; transform: translateY(0); }

.ucp-wordmark {
  font-size: 13px;
  letter-spacing: 0.14em;
  font-weight: 600;
  color: var(--rustwood);
}

.ucp-capsule {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(13,13,13,0.88);
  color: var(--golden-oat);
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 11px;
  letter-spacing: 0.08em;
  backdrop-filter: blur(6px);
  border: 1px solid rgba(242,196,141,0.15);
}

.ucp-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--golden-oat);
  animation: ucp-pulse 2.4s ease-in-out infinite;
}

.ucp-capsule-gear { animation: ucp-spin-cw 14s linear infinite; }

.ucp-main {
  position: relative;
  z-index: 2;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 24px 20px 56px;
}

.ucp-watch-wrap {
  position: relative;
  width: min(400px, 78vw);
  height: min(400px, 78vw);
  margin-bottom: 28px;
  opacity: 0;
  transform: scale(0.96);
  transition: opacity 0.9s ease, transform 0.9s ease;
  transition-delay: 0.35s;
}
.ucp-revealed .ucp-watch-wrap { opacity: 1; transform: scale(1); }

.ucp-watch { width: 100%; height: 100%; overflow: visible; }

.ucp-ring-outer {
  fill: none;
  stroke: var(--rustwood);
  stroke-width: 2.5;
  opacity: 0.7;
}
.ucp-ring-inner {
  fill: none;
  stroke: var(--evergreen);
  stroke-width: 1.2;
  opacity: 0.45;
}

.ucp-roots path {
  fill: none;
  stroke: var(--evergreen);
  stroke-width: 1.4;
  stroke-linecap: round;
  animation: ucp-breathe-opacity 9s ease-in-out infinite;
}
.ucp-roots path:nth-child(2) { animation-delay: 1.2s; }
.ucp-roots path:nth-child(3) { animation-delay: 2.4s; }
.ucp-roots path:nth-child(4) { animation-delay: 3.6s; }

.ucp-gear-main { transform-origin: 0 0; animation: ucp-spin-cw 46s linear infinite; }
.ucp-gear-secondary { transform-origin: 0 0; animation: ucp-spin-ccw 58s linear infinite; }

.ucp-indicator-group {
  transform-origin: 200px 200px;
  transition: transform 1.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.ucp-indicator { fill: var(--rustwood); }

.ucp-hub {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 58%;
  height: 58%;
  border-radius: 50%;
  background: rgba(13,13,13,0.86);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(242,196,141,0.12);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px;
  color: var(--golden-oat);
  animation: ucp-breathe-scale 8s ease-in-out infinite;
}

.ucp-hub-stage {
  font-size: 12px;
  letter-spacing: 0.16em;
  font-weight: 600;
  color: var(--golden-oat);
  opacity: 0.85;
}
.ucp-hub-title {
  font-family: 'Fraunces', Georgia, serif;
  font-size: clamp(15px, 2.6vw, 19px);
  font-weight: 500;
  line-height: 1.25;
  max-width: 85%;
}
.ucp-hub-tech {
  font-size: 9.5px;
  letter-spacing: 0.1em;
  opacity: 0.55;
  margin-top: 2px;
}

.ucp-headline {
  font-family: 'Fraunces', Georgia, serif;
  font-size: clamp(26px, 4.4vw, 40px);
  font-weight: 500;
  margin: 4px 0 8px;
  color: var(--rustwood);
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.8s ease, transform 0.8s ease;
  transition-delay: 0.6s;
}
.ucp-revealed .ucp-headline { opacity: 1; transform: translateY(0); }

.ucp-subhead {
  font-size: 15px;
  color: rgba(13,13,13,0.65);
  max-width: 420px;
  margin: 0 0 28px;
  opacity: 0;
  transition: opacity 0.8s ease;
  transition-delay: 0.75s;
}
.ucp-revealed .ucp-subhead { opacity: 1; }

.ucp-tasklist {
  list-style: none;
  margin: 0 0 32px;
  padding: 0;
  width: min(360px, 88vw);
  display: flex;
  flex-direction: column;
  gap: 10px;
  opacity: 0;
  transition: opacity 0.8s ease;
  transition-delay: 0.9s;
}
.ucp-revealed .ucp-tasklist { opacity: 1; }

.ucp-tasklist li {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-size: 12.5px;
  color: rgba(13,13,13,0.45);
  transition: color 0.5s ease, opacity 0.5s ease;
  opacity: 0.55;
}
.ucp-tasklist li.ucp-task-active {
  color: var(--midnight);
  opacity: 1;
  font-weight: 600;
}
.ucp-task-id { letter-spacing: 0.08em; }

.ucp-progress {
  display: flex;
  gap: 22px;
  list-style: none;
  margin: 0;
  padding: 0;
  opacity: 0;
  transition: opacity 0.8s ease;
  transition-delay: 1.05s;
}
.ucp-revealed .ucp-progress { opacity: 1; }

.ucp-progress li {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  font-size: 10.5px;
  letter-spacing: 0.08em;
  color: rgba(13,13,13,0.4);
}
.ucp-progress li.is-done { color: var(--evergreen); }
.ucp-progress li.is-active { color: var(--rustwood); }
.ucp-progress-mark { font-size: 13px; transition: color 0.4s ease; }

@keyframes ucp-spin-cw { to { transform: rotate(360deg); } }
@keyframes ucp-spin-ccw { to { transform: rotate(-360deg); } }
@keyframes ucp-pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
@keyframes ucp-breathe-opacity { 0%, 100% { opacity: 0.25; } 50% { opacity: 0.55; } }
@keyframes ucp-breathe-scale { 0%, 100% { transform: translate(-50%, -50%) scale(1); } 50% { transform: translate(-50%, -50%) scale(1.015); } }

@media (max-width: 640px) {
  .ucp-roots { display: none; }
  .ucp-gear-secondary { display: none; }
  .ucp-topbar { padding: 20px 18px; }
  .ucp-tasklist { display: none; }
  .ucp-progress { gap: 14px; }
}

@media (prefers-reduced-motion: reduce) {
  .ucp-dot,
  .ucp-capsule-gear,
  .ucp-gear-main,
  .ucp-gear-secondary,
  .ucp-roots path,
  .ucp-hub {
    animation: none !important;
  }
  .ucp-indicator-group { transition: opacity 0.3s ease !important; }
  .ucp-topbar, .ucp-watch-wrap, .ucp-headline, .ucp-subhead, .ucp-tasklist, .ucp-progress {
    transition: opacity 0.3s ease !important;
    transform: none !important;
  }
}
`;
