import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { WaterRippleShader } from "./WaterRippleShader";
import { WaterSurface } from "./WaterSurface";

interface WaterHeroProps {
  scrollVelocity?: number;
  scrollProgress?: number;
  triggerRipple?: boolean;
  className?: string;
}

export function WaterHero({ 
  scrollVelocity = 0, 
  scrollProgress = 0,
  triggerRipple = false, 
  className 
}: WaterHeroProps) 

{
  const sinkProgress =
    Math.min(
      1,
      Math.max(
        0,
        (scrollProgress - 0.1) / 0.6
      )
    );

  const rippleProgress = 
    Math.max(
      0, (sinkProgress - 0.15) / 0.85
    );

  return (
    <div className={`absolute inset-0 pointer-events-none ${className || ""}`} style={{ zIndex: 1 }}>
      <Canvas
        camera={{ position: [0, 8, 0], fov: 35 }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: true }}
      >
        <Suspense fallback={null}>
          <WaterSurface/>

          <WaterRippleShader 
            scrollVelocity={scrollVelocity}
            drownRippleStrength={rippleProgress}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
