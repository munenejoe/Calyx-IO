import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Hero modules
import { StarfieldBackground } from "@/components/home/StarfieldBackground";
import { HeroTypography } from "@/components/home/HeroTypography";
import { HomeNavbar } from "@/components/home/HomeNavbar";
import { GlassPill } from "@/components/home/GlassPill";

// Homepage Layout System
import "@/styles/homepage.css"

// Content sections
import { BloomProcessSection } from "@/components/home/BloomProcessSection";
import { RecognitionShowcaseSection } from "@/components/home/RecognitionShowcaseSection";
import { FloralCatalogueSection } from "@/components/home/FloralCatalogueSection";
import { CTASection } from "@/components/home/CTASection";
import { HomeFooter } from "@/components/home/HomeFooter";
import { Link } from "react-router-dom";

/* ─────────────────────────────────────────────
    Hero section — fullscreen cinematic opener
───────────────────────────────────────────── */
function Hero() {
  // Animation sequence state
  const [phase, setPhase] = useState<
    "dark" | "stars" | "type" | "ml" | "cta"
  >("dark");

  // Scroll state
  const [scrollProgress, setScrollProgress] = useState(0);

  const heroRef = useRef<HTMLDivElement>(null);

  // Sequence orchestration
  useEffect(() => {
    const sequence = [
      { phase: "stars" as const,  delay: 400  },
      { phase: "type" as const,   delay: 2500 },
      { phase: "ml" as const,     delay: 3300 },
      { phase: "cta" as const,    delay: 3900 },
    ];
    const timers = sequence.map(({ phase, delay }) =>
      setTimeout(() => setPhase(phase), delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  // Scroll tracking
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const onScroll = () => {
      const now = Date.now();

      const heroH = hero.offsetHeight;
      const progress = Math.min(1, window.scrollY / heroH);
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => 
      window.removeEventListener("scroll", onScroll);
  }, []);

  const typographyVisible = phase === "type" || phase === "ml" || phase === "cta";
  const mlLabelVisible = phase === "ml" || phase === "cta";
  const ctaVisible = phase === "cta";

  return (
    <section
        className="relative w-full overflow-hidden"
        style={{
            height: "100svh",
            minHeight: "600px",
            background: "#0d0d0d",
        }}
    >
      {/* Layer 0 — pure Midnight Ash base (always visible) */}
      <div className="absolute inset-0" style={{ background: "#0d0d0d", zIndex: 0 }} />

      {/* Layer 1 — Starfield */}
      <AnimatePresence>
        {phase !== "dark" && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.8 }}
            style={{ zIndex: 1 }}
          >
            <StarfieldBackground />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Layer 2 — Typography */}
      <AnimatePresence>
        {typographyVisible && (
          <motion.div
            key="hero-typography"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <HeroTypography
              visible={typographyVisible}
              mlLabelVisible={mlLabelVisible}
            />
          </motion.div>
        )}
      </AnimatePresence>


      {/* Layer 3 — CTA pills */}
      <AnimatePresence>
        {ctaVisible && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 flex justify-center gap-4 pb-14 px-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            style={{ zIndex: 30 }}
          >
            <Link to="/identify">
              <GlassPill variant="primary" size="md">
                Identify a flower
              </GlassPill>
            </Link>
            <Link to="/catalogue">
              <GlassPill variant="default" size="md">
                Explore catalogue
              </GlassPill>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll indicator */}
      <AnimatePresence>
        {ctaVisible && scrollProgress < 0.05 && (
          <motion.div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1 }}
            style={{ zIndex: 30 }}
          >
            <span
              style={{
                fontSize: "0.55rem",
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: "rgba(242,196,141,0.25)",
              }}
            >
              Scroll
            </span>
            <motion.div
              className="w-px h-8"
              style={{ background: "rgba(242,196,141,0.2)" }}
              animate={{ scaleY: [1, 0.4, 1] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 100% 80% at 50% 50%, transparent 40%, rgba(0,0,0,0.65) 100%)",
          zIndex: 40,
        }}
      />
    </section>
  );
}

/* ─────────────────────────────────────────────
    Page
───────────────────────────────────────────── */
export default function Home() {
  return (
    <div
      className="calyx-homepage"
      style={{ background: "#0d0d0d", minHeight: "100vh" }}
    >
      <HomeNavbar />
      <Hero />
      <main className="relative">
          <BloomProcessSection />
          <RecognitionShowcaseSection />
          <FloralCatalogueSection />
          <CTASection />
      </main>
      <HomeFooter />
    </div>
  );
}
