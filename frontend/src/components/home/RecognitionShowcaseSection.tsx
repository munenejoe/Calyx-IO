import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

// Animated neural-net style recognition diagram
function RecognitionDiagram({ active }: { active: boolean }) {
  const nodes = [
    // Input layer
    { id: "i1", x: 8, y: 22, layer: 0, label: "Petal form" },
    { id: "i2", x: 8, y: 42, layer: 0, label: "Colour matrix" },
    { id: "i3", x: 8, y: 62, layer: 0, label: "Sepal structure" },
    { id: "i4", x: 8, y: 80, layer: 0, label: "Stem geometry" },
    // Hidden 1
    { id: "h1a", x: 35, y: 18, layer: 1, label: "" },
    { id: "h1b", x: 35, y: 36, layer: 1, label: "" },
    { id: "h1c", x: 35, y: 54, layer: 1, label: "" },
    { id: "h1d", x: 35, y: 72, layer: 1, label: "" },
    { id: "h1e", x: 35, y: 88, layer: 1, label: "" },
    // Hidden 2
    { id: "h2a", x: 62, y: 26, layer: 2, label: "" },
    { id: "h2b", x: 62, y: 50, layer: 2, label: "" },
    { id: "h2c", x: 62, y: 74, layer: 2, label: "" },
    // Output
    { id: "o1", x: 88, y: 38, layer: 3, label: "Species" },
    { id: "o2", x: 88, y: 62, layer: 3, label: "Genus" },
  ];

  const connections = [
    // i → h1
    ["i1","h1a"],["i1","h1b"],["i1","h1c"],
    ["i2","h1a"],["i2","h1b"],["i2","h1c"],["i2","h1d"],
    ["i3","h1b"],["i3","h1c"],["i3","h1d"],["i3","h1e"],
    ["i4","h1c"],["i4","h1d"],["i4","h1e"],
    // h1 → h2
    ["h1a","h2a"],["h1a","h2b"],
    ["h1b","h2a"],["h1b","h2b"],
    ["h1c","h2a"],["h1c","h2b"],["h1c","h2c"],
    ["h1d","h2b"],["h1d","h2c"],
    ["h1e","h2b"],["h1e","h2c"],
    // h2 → o
    ["h2a","o1"],["h2a","o2"],
    ["h2b","o1"],["h2b","o2"],
    ["h2c","o1"],["h2c","o2"],
  ];

  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => setPulse((p) => (p + 1) % connections.length), 80);
    return () => clearInterval(t);
  }, [active]);

  return (
    <svg
      viewBox="0 0 100 100"
      className="w-full h-full"
      style={{ overflow: "visible" }}
    >
      {/* Connections */}
      {connections.map(([from, to], i) => {
        const a = nodeMap[from];
        const b = nodeMap[to];
        const isActive = active && (pulse % (connections.length / 3) | 0) === (i % (connections.length / 3) | 0);
        return (
          <line
            key={`${from}-${to}`}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke={isActive ? "rgba(242,196,141,0.55)" : "rgba(242,196,141,0.07)"}
            strokeWidth={isActive ? 0.35 : 0.15}
            style={{ transition: "stroke 0.15s, stroke-width 0.15s" }}
          />
        );
      })}

      {/* Nodes */}
      {nodes.map((n) => (
        <g key={n.id}>
          <circle
            cx={n.x}
            cy={n.y}
            r={n.layer === 0 || n.layer === 3 ? 2.2 : 1.6}
            fill={
              n.layer === 0
                ? "rgba(81,89,50,1)"
                : n.layer === 3
                ? "rgba(134,58,24,0.9)"
                : "rgba(13,13,13,1)"
            }
            stroke={
              n.layer === 3
                ? "rgba(242,196,141,0.6)"
                : "rgba(242,196,141,0.22)"
            }
            strokeWidth={n.layer === 3 ? 0.4 : 0.25}
          />
          {n.label && (
            <text
              x={n.layer === 0 ? n.x - 3 : n.x + 3}
              y={n.y + 0.5}
              fontSize="2.8"
              fill="rgba(242,196,141,0.38)"
              textAnchor={n.layer === 0 ? "end" : "start"}
              fontFamily="'Cormorant Garamond', serif"
              letterSpacing="0.05"
            >
              {n.label}
            </text>
          )}
        </g>
      ))}

      {/* Confidence arc on output */}
      {active && (
        <>
          <motion.circle
            cx={nodeMap["o1"].x}
            cy={nodeMap["o1"].y}
            r={4}
            fill="none"
            stroke="rgba(242,196,141,0.4)"
            strokeWidth={0.3}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 0.92 }}
            transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
          />
          <motion.circle
            cx={nodeMap["o2"].x}
            cy={nodeMap["o2"].y}
            r={3.2}
            fill="none"
            stroke="rgba(134,58,24,0.5)"
            strokeWidth={0.3}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 0.74 }}
            transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
          />
        </>
      )}
    </svg>
  );
}

const metrics = [
  { value: "300k+", label: "Species Database", sub: "across flora families" },
  { value: "<3s",   label: "Recognition time", sub: "avg. inference speed" },
  { value: "3.1M",  label: "Training specimens", sub: "curated botanical data" },
];

export function RecognitionShowcaseSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{ background: "#0d0d0d" }}
    >
      {/* Subtle green tint near top edge from previous section */}
      <div
        className="absolute top-0 left-0 right-0 h-40 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(81,89,50,0.18), transparent)",
        }}
      />

      <div className="relative max-w-screen-xl mx-auto px-8 md:px-16 py-32 md:py-44">
        {/* Section label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          style={{
            fontSize: "0.6rem",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: "rgba(242,196,141,0.35)",
            marginBottom: "1.5rem",
          }}
        >
          Intelligence
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-16 items-center">
          {/* Left: copy */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)",
                fontWeight: 300,
                letterSpacing: "0.04em",
                color: "rgba(242,196,141,0.9)",
                lineHeight: 1.12,
                marginBottom: "2rem",
              }}
            >
              Recognition
              <br />
              at the
              <br />
              molecular level
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontSize: "0.875rem",
                lineHeight: 1.9,
                color: "rgba(255,255,255,0.35)",
                maxWidth: "44ch",
                marginBottom: "3.5rem",
              }}
            >
              The model isolates calyx geometry and cross-references colour
              spectral data against a curated corpus of botanical specimens. It
              doesn't approximate. It resolves.
            </motion.p>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-6">
              {metrics.map((m, i) => (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 1,
                    delay: 0.25 + i * 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="flex flex-col gap-1"
                >
                  <div
                    className="h-px w-8 mb-3"
                    style={{ background: "rgba(242,196,141,0.2)" }}
                  />
                  <span
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                      fontWeight: 300,
                      color: "rgba(242,196,141,0.88)",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {m.value}
                  </span>
                  <span
                    style={{
                      fontSize: "0.68rem",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.45)",
                    }}
                  >
                    {m.label}
                  </span>
                  <span
                    style={{
                      fontSize: "0.68rem",
                      color: "rgba(255,255,255,0.22)",
                    }}
                  >
                    {m.sub}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: diagram */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div
              className="relative rounded-2xl overflow-hidden p-10"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
                border: "1px solid rgba(242,196,141,0.08)",
                aspectRatio: "1 / 0.8",
              }}
            >
              {/* Corner accents */}
              {[
                "top-3 left-3",
                "top-3 right-3 rotate-90",
                "bottom-3 right-3 rotate-180",
                "bottom-3 left-3 -rotate-90",
              ].map((pos) => (
                <div
                  key={pos}
                  className={`absolute ${pos} w-5 h-5 pointer-events-none`}
                  style={{
                    borderTop: "1px solid rgba(242,196,141,0.2)",
                    borderLeft: "1px solid rgba(242,196,141,0.2)",
                  }}
                />
              ))}

              <RecognitionDiagram active={inView} />

              {/* Confidence label */}
              <AnimatePresence>
                {inView && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5, duration: 0.8 }}
                    className="absolute bottom-6 right-8 text-right"
                  >
                    <span
                      style={{
                        fontSize: "0.6rem",
                        letterSpacing: "0.25em",
                        textTransform: "uppercase",
                        color: "rgba(242,196,141,0.35)",
                      }}
                    >
                      Confidence
                    </span>
                    <div
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: "1.6rem",
                        fontWeight: 300,
                        color: "rgba(242,196,141,0.8)",
                        lineHeight: 1,
                      }}
                    >
                      Improving
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
