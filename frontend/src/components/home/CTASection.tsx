import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { GlassPill } from "./GlassPill";

export function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });

  return (
    <section
      id="identify"
      ref={ref}
      className="relative overflow-hidden"
      style={{ 
        background: "#0d0d0d",
        minHeight: "auto",
      }}
    >
      {/* Decorative horizontal rule */}
      <div
        className="absolute top-0 left-[clamp(1.5rem,4vw,5rem)] right-[clamp(1.5rem,4vw,5rem)]"
        style={{ background: "rgba(242,196,141,0.06)" }}
      />

      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 60%, rgba(134,58,24,0.07) 0%, transparent 70%)",
        }}
      />

        <div className="home-section-inner relative"
            style={{
              paddingBlock: "clamp(7rem, 14vh, 12rem)",
            }}
        >
        <div className="max-w-[900px] mx-auto text-center">
          {/* Ornament */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={inView ? { opacity: 1, scaleX: 1 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center gap-4 mb-[clamp(2rem,4vh,3rem)]"
          >
            <div
              className="h-px w-16"
              style={{ background: "rgba(242,196,141,0.2)" }}
            />
            <img
              src="/MainLogo.png"
              alt=""
              className="w-6 h-6 object-contain opacity-50"
            />
            <div
              className="h-px w-16"
              style={{ background: "rgba(242,196,141,0.2)" }}
            />
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 36 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2.4rem, 6vw, 5rem)",
              fontWeight: 300,
              letterSpacing: "0.04em",
              color: "rgba(242,196,141,0.9)",
              lineHeight: 1.1,
              marginBottom: "clamp(1.5rem,3vh,2.5rem)",
            }}
          >
            Identify any flower.
            <br />
            In seconds.
          </motion.h2>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.22 }}
            style={{
              fontSize: "0.9rem",
              lineHeight: 1.9,
              color: "rgba(255,255,255,0.32)",
              maxWidth: "44ch",
              margin: "0 auto clamp(2rem,5vh,4rem)",
              letterSpacing: "0.02em",
            }}
          >
            Upload a photograph. The recognition engine resolves species,
            genus, and family — with stated confidence and zero guesswork.
          </motion.p>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.34 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-[clamp(1rem,2vw,2rem)]"
          >
            <Link to="/identify">
              <motion.div
                className="px-10 py-4 rounded-full cursor-pointer"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(134,58,24,0.85) 0%, rgba(89,56,37,0.9) 100%)",
                  border: "1px solid rgba(242,196,141,0.18)",
                  backdropFilter: "blur(12px)",
                  boxShadow:
                    "0 0 40px rgba(134,58,24,0.2), inset 0 1px 0 rgba(255,255,255,0.08)",
                }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 0 60px rgba(134,58,24,0.35), inset 0 1px 0 rgba(255,255,255,0.12)",
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.25 }}
              >
                <span
                  style={{
                    fontFamily: "inherit",
                    fontSize: "0.7rem",
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    color: "rgba(242,196,141,0.95)",
                  }}
                >
                  Identify a flower
                </span>
              </motion.div>
            </Link>

            <GlassPill as="a" href="/catalogue" variant="default" size="lg">
              Explore catalogue
            </GlassPill>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade into footer */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent, rgba(81,89,50,0.15))",
        }}
      />
    </section>
  );
}
