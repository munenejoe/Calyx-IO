export function GlassFilter() {
  return (
    <svg
      width="0"
      height="0"
      style={{ position: "absolute" }}
      aria-hidden
    >
      <defs>

        <filter id="glass-distortion">

          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.008 0.008"
            numOctaves="2"
            seed="24"
            result="noise"
          />

          <feGaussianBlur
            in="noise"
            stdDeviation="0.2"
            result="blur"
          />

          <feDisplacementMap
            in="SourceGraphic"
            in2="blur"
            scale="22"
          />

        </filter>

      </defs>
    </svg>
  );
}