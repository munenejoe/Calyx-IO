import { useRef, useEffect, useState } from "react";
import { motion, useSpring, useMotionTemplate, useTransform } from "framer-motion";


interface BloomBouquetProps {
  scrollProgress: number;
  onSettled?: () => void;
}

export function BloomBouquet({ scrollProgress, onSettled }: BloomBouquetProps) {

  const revealOpacity = useSpring(0, {
    stiffness: 40,
    damping: 22,
  });

  const revealScale = useSpring(1.0, {
    stiffness: 50,
    damping: 18,
  });

  const surfaceReveal = useSpring(0, {
    stiffness: 20,
    damping: 20,
  });

  useEffect(() => {
    const t = setTimeout(() => {
      surfaceReveal.set(1);
      revealOpacity.set(1);
      revealScale.set(1.1);
    }, 450);

    return () => clearTimeout(t);
  }, []);

  const sinkProgress = Math.min(
    1,
    Math.max(0, (scrollProgress - 0.1) / 0.6)
  );

  const blurAmount = useTransform(
    surfaceReveal,
    [0, 1],
    [8, 0]
    );
  const blurValue = useMotionTemplate`
    blur(${blurAmount}px)
  `;

  const maskInner = useTransform(
    surfaceReveal,
    [0, 1],
    [0, 20]
  );

  const maskMiddle = useTransform(
    surfaceReveal,
    [0, 1],
    [0, 45]
  );

  const maskOuter = useTransform(
    surfaceReveal,
    [0, 1],
    [0, 88]
  );
  const maskReveal = useMotionTemplate`
    radial-gradient(
      circle at 50% 55%,
      rgba(0,0,0,1) calc(${maskInner}%),
      rgba(0,0,0,1) calc(${maskMiddle}%),
      rgba(0,0,0,0) calc(${maskOuter}%)
    )
  `;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
      {/* Ambient glow */}
      <div className="absolute w-[60vw] h-[60vw] bg-[#F2C48D]/15 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />

      {/* Entrance spring layer */}
      <motion.div
        className="relative z-30 flex items-center justify-center w-full h-full"
      >
        {/* Scroll layer */}
        <motion.div
          style={{
            opacity: 1 - sinkProgress * 0.25,
          }}
          className="relative flex items-center justify-center w-full h-full"
        >

          <motion.div
            initial={{
              scale: 0.25,
              opacity: 0,
            }}
            animate={{
              scale: 3.5,
              opacity: [0, 0.25, 0],
            }}
            transition={{
              duration: 2.8,
              ease: "easeOut",
            }}
            className="absolute rounded-full"
            style={{
              width: "30vw",
              height: "30vw",
              border: "1px solid rgba(242,196,141,0.18)",
              filter: "blur(2px)",
            }}
          />

          <motion.div
            style={{
              scale: revealScale,
              opacity: revealOpacity,
              filter: blurValue,
              WebkitMaskImage: maskReveal,
              maskImage: maskReveal,
            }}

          >
            <img
              src="/bouquet.png"
              alt="Calyx Bouquet"
              className="w-[110vw] md:w-[88vw] lg:w-[69vw] object-contain bouquet-glow drop-shadow-2xl"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}