import { motion } from "framer-motion";

interface HeroTypographyProps {
  visible: boolean;
  mlLabelVisible: boolean;
}

export function HeroTypography({ visible, mlLabelVisible }: HeroTypographyProps) {
  return (
    <div
      className="absolute top-24 left-0 w-full flex justify-start pl-[7%] pointer-events-none"
      style={{ zIndex: 50 }}
    >
      <div className="absolute left-[3%] top-[80px]">
        {/* CALYX - behind bouquet (lower z-index) */}
        <div style={{ position: "relative", zIndex: 50 }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 0 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0 }}
          >
            <span
              className="block leading-none select-none"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2.5rem, 6vw, 6.5rem)",
                fontWeight: 300,
                letterSpacing: "0.12em",
                color: "rgba(242, 196, 141, 0.92)",
                textShadow: "0 0 80px rgba(242,196,141,0.15)",
              }}
            >
              CALYX
            </span>
          </motion.div>
        </div>

        {/* FLORA - in front of bouquet (higher z-index) */}
        <div style={{ position: "relative", zIndex: 60, marginTop: "-0.15em" }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            <span
              className="block leading-none select-none"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2.5rem, 6vw, 6.5rem)",
                fontWeight: 300,
                letterSpacing: "0.12em",
                color: "rgba(242, 196, 141, 0.88)",
                textShadow: "0 2px 40px rgba(0,0,0,0.8), 0 0 60px rgba(242,196,141,0.1)",
                paddingLeft: "clamp(2rem, 5vw, 6rem)",
              }}
            >
              FLORA
            </span>
          </motion.div>
        </div>

      {/* ML Label */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={mlLabelVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute"
        style={{
          right: "-65vw",
          top: "18vw",
          zIndex: 30
        }}
      >
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(0.65rem, 1.2vw, 0.85rem)",
            letterSpacing: "0.35em",
            color: "rgba(242, 196, 141, 0.45)",
            textAlign: "right",
          }}
        >
          ML POWERED 
          <br />
          FLORA RECOGNITION
        </p>
        </motion.div>
      </div>
    </div>
  );
}
