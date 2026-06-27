import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const steps = [
  {
    number: "01",
    name: "Capture",
    headline: "Structural pose",
    body:
      "A single photograph. The specimen is read through light and geometry — stem angle, petal spread, sepal architecture. No special equipment required.",
  },
  {
    number: "02",
    name: "Bloom",
    headline: "Calyx & colour matrices",
    body:
      "The calyx is isolated from background noise. Colour matrices are extracted at the spectral level — hue drift, saturation gradients, and tonal range mapped against 40,000 botanical references.",
  },
  {
    number: "03",
    name: "Recognise",
    headline: "Species recognition",
    body:
      "The recognition engine resolves species, genus, and family. Confidence is stated plainly. Alternatives are ranked. The answer arrives in under two seconds.",
  },
];

function StepItem({
  step,
  index,
}: {
  step: (typeof steps)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 48 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 1.1,
        delay: index * 0.18,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="flex flex-col gap-5"
    >
      {/* Number + thin rule */}
      <div className="flex items-center gap-5">
        <span
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "0.65rem",
            letterSpacing: "0.35em",
            color: "rgba(242,196,141,0.35)",
          }}
        >
          {step.number}
        </span>
        <div
          className="flex-1 h-px"
          style={{ background: "rgba(242,196,141,0.12)" }}
        />
        <span
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "0.6rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(242,196,141,0.3)",
          }}
        >
          {step.name}
        </span>
      </div>

      {/* Headline */}
      <h3
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
          fontWeight: 300,
          letterSpacing: "0.04em",
          color: "rgba(242,196,141,0.88)",
          lineHeight: 1.15,
        }}
      >
        {step.headline}
      </h3>

      {/* Body */}
      <p
        style={{
          fontSize: "0.875rem",
          lineHeight: 1.85,
          color: "rgba(255,255,255,0.38)",
          letterSpacing: "0.02em",
          maxWidth: "38ch",
        }}
      >
        {step.body}
      </p>
    </motion.div>
  );
}

export function BloomProcessSection() {
  const headingRef = useRef<HTMLDivElement>(null);
  const headingInView = useInView(headingRef, { once: true, margin: "-10%" });

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "#515932" }}
    >
      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
          opacity: 0.5,
        }}
      />

      <div className="relative max-w-screen-xl mx-auto px-8 md:px-16 py-32 md:py-44">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-20 lg:gap-32 items-start">
          {/* Left column — sticky label */}
          <div ref={headingRef} className="lg:sticky lg:top-32">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={headingInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <p
                style={{
                  fontSize: "0.6rem",
                  letterSpacing: "0.4em",
                  textTransform: "uppercase",
                  color: "rgba(242,196,141,0.4)",
                  marginBottom: "1.5rem",
                }}
              >
                Process
              </p>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(2.4rem, 5vw, 4rem)",
                  fontWeight: 300,
                  letterSpacing: "0.04em",
                  color: "rgba(242,196,141,0.92)",
                  lineHeight: 1.1,
                }}
              >
                How we
                <br />
                do it
              </h2>

              <div
                className="mt-10 h-px w-16"
                style={{ background: "rgba(242,196,141,0.2)" }}
              />

              <p
                className="mt-8"
                style={{
                  fontSize: "0.8rem",
                  lineHeight: 1.9,
                  color: "rgba(255,255,255,0.35)",
                  maxWidth: "28ch",
                  letterSpacing: "0.02em",
                }}
              >
                Three quiet steps. One accurate result. No botanical expertise
                required.
              </p>
            </motion.div>
          </div>

          {/* Right column — steps */}
          <div className="flex flex-col gap-16 lg:gap-20">
            {steps.map((step, i) => (
              <StepItem key={step.number} step={step} index={i} />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade to dark */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent, rgba(13,13,13,0.6))",
        }}
      />
    </section>
  );
}
