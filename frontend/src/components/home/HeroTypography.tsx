import { motion } from "framer-motion";
import { useViewport } from "@/hooks/use-mobile";
import { title } from "process";

interface HeroTypographyProps {
  visible: boolean;
  mlLabelVisible: boolean;
}

export function HeroTypography({ visible, mlLabelVisible }: HeroTypographyProps) {
  const { isMobile, isTablet } = useViewport();

  const left = isMobile
    ? "1rem"
    : isTablet
    ? "2rem"
    : "3%";

  const top = isMobile
    ? "22vh"
    : isTablet
    ? "24vh"
    : "32vh";

  const titleTop = isMobile
    ? "22vh"
    : isTablet
    ? "24vh"
    : "32vh";
  
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 50 }}
    >
      {/* ================= LEFT TITLE ================= */}
      <div
        className="absolute"
        style={{
          left,
          top: titleTop,
          zIndex: 50,
        }}
      >
        {/* CALYX */}
        <div style={{ position: "relative", zIndex: 50 }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 0 }}
            transition={{
              duration: 1.4,
              ease: [0.16, 1, 0.3, 1],
              delay: 0,
            }}
          >
            <span
              className="block leading-none select-none"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2.5rem, 6vw, 6.5rem)",
                fontWeight: 300,
                letterSpacing: "0.12em",
                color: "rgba(242,196,141,0.92)",
                textShadow: "0 0 80px rgba(242,196,141,0.15)",
              }}
            >
              CALYX
            </span>
          </motion.div>
        </div>

        {/* FLORA */}
        <div
          style={{
            position: "relative",
            zIndex: 60,
            marginTop: "-0.15em",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
            transition={{
              duration: 1.4,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.2,
            }}
          >
            <span
              className="block leading-none select-none"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: isMobile
                  ? "clamp(2.1rem,11vw,3rem)"
                  : isTablet
                  ? "clamp(2.8rem,7vw,4.8rem)"
                  : "clamp(2.5rem,6vw,6.5rem)",
                fontWeight: 300,
                letterSpacing: "0.12em",
                color: "rgba(242,196,141,0.88)",
                textShadow:
                  "0 2px 40px rgba(0,0,0,0.8), 0 0 60px rgba(242,196,141,0.1)",
                paddingLeft: isMobile
                  ? ".6rem"
                  : isTablet
                  ? "1.6rem"
                  : "clamp(2rem,5vw,6rem)",
              }}
            >
              FLORA
            </span>
          </motion.div>
        </div>
      </div>

      {/* ================= RIGHT LABEL ================= */}
      <motion.div
        className="absolute"
        initial={{ opacity: 0, y: 16 }}
        animate={
          mlLabelVisible
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 16 }
        }
        transition={{
          duration: 1.2,
          ease: [0.16, 1, 0.3, 1],
        }}
        style={{
          right: isMobile 
            ? "1rem" : isTablet 
            ? "2rem" : "4rem",
            
          top: `calc(${titleTop} + 2rem)`,

          width: isMobile
            ? "140px"
            : isTablet
            ? "180px"
            : "220px",

          zIndex: 30,
        }}
      >
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(0.65rem,1.2vw,0.85rem)",
            letterSpacing: "0.35em",
            color: "rgba(242,196,141,0.45)",
            textAlign: "right",
            lineHeight: 1.5,

            wordBreak: "normal",
            overflowWrap: "break-word",
            whiteSpace: "normal",
          }}
        >
          A ML POWERED
          <br />
          FLORA RECOGNITION
        </p>
      </motion.div>
    </div>
  );
}
