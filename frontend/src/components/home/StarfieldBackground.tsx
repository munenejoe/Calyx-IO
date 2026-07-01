import { useMemo, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import "../../styles/aurora.css";

function TinyStars() {
  const positions = useMemo(() => {
    const array = new Float32Array(300 * 3);

    for (let i = 0; i < 300; i++) {
      array[i * 3] = (Math.random() - 0.5) * 40;
      array[i * 3 + 1] =
        (Math.random() - 0.5) * 25;

      array[i * 3 + 2] =
        -10 - Math.random() * 10;
    }

    return array;
  }, []);

  const geometry = useMemo(() => {
    const geo =
      new THREE.BufferGeometry();

    geo.setAttribute(
      "position",
      new THREE.BufferAttribute(
        positions,
        3
      )
    );
    return geo;
  }, [positions]);

  return (
    <points geometry={geometry}>
      <pointsMaterial
        color="#ffffff"
        size={0.05}
        transparent
        opacity={0.5}
        depthWrite={false}
      />
    </points>
  );
}

interface StarfieldBackgroundProps {
  className?: string;
}

export function StarfieldBackground({ className }: StarfieldBackgroundProps) 
{ 
  const [showShooting, setShowShooting] =
    useState(false);
    useEffect(() => 
  {
    const timer =
      setTimeout(() => 
      {
        setShowShooting(true);
      }, 8000);

    return () =>
      clearTimeout(timer);
  }, []);

  const hasWebGL = (() => {
    try {
      const canvas = document.createElement("canvas");

      return !!(
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl")
      );
    } catch {
      return false;
    }
  })();

  const shootingStars = useMemo(
    () =>
      Array.from({ length: 10 }, () => {
        const type =
          Math.random() < 0.45
            ? "white"
            : Math.random() < 0.7
            ? "blue"
            : "orange";

        return {
          top: `${-20 - Math.random() * 25}%`,
          left: `${100 + Math.random() * 20}%`,

          length: 120 + Math.random() * 120,
          delay: `${Math.random() * 5}s`,
          duration: 5 + Math.random() * 8,
          thickness: 2 + Math.random() * 2,
          brightness: 0.35 + Math.random() * 0.65,

          dx: -1200 - Math.random() * 400,
          dy: 700 + Math.random() * 300,

          angle: "155deg",

          type,

          smoke:
            type === "orange"
              ? 0.7 + Math.random() * 0.3
              : type === "blue"
              ? 0.35 + Math.random() * 0.35
              : 0.15 + Math.random() * 0.2,

          leavesTrail: Math.random() < 0.4
        };
      }),
    []
  );


  return (
    <div className={`absolute inset-0 ${className || ""}`} 
        style={{ 
          position: "absolute", 
          inset: 0,
          overflow: "hidden", 
          zIndex: 0
        }}>
      {hasWebGL && (
        <Canvas
          camera={{
            position: [1, 1, 5],
            fov: 75,
          }}
          gl={{
            alpha: true,
            antialias: false,
            powerPreference: "high-performance",
          }}
        >
          <TinyStars />
        </Canvas>
      )}

      <div className="aurora aurora1" />
      <div className="aurora aurora2" />

      <div className="aurora-ribbon ribbon1" />
      <div className="aurora-ribbon ribbon2" />
      <div className="aurora-ribbon ribbon3" />

      


      {/* CSS shooting stars - more performant */}
      {showShooting &&(
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {shootingStars.map((star, i) => (
            <div
              key={i}
              className={`
                shooting-star 
                ${star.type}
              `}
              style={{
                width: `${star.length}px`,
                height: `${star.thickness}px`,
                top: star.top,
                left: star.left,
                ["--brightness" as any]: star.brightness,
                animationDelay: star.delay,
                animationDuration: `${star.duration}s`,
                ["--dx" as any]: `${star.dx}px`,
                ["--dy" as any]: `${star.dy}px`,
                ["--angle" as any]: star.angle,
                ["--smoke" as any]: star.smoke,
                ["--trail" as any]: star.leavesTrail ? 1 : 0
              }}
            >
                <div className="shooting-tail-core" />
                <div className="shooting-tail-residual" />
                <div className="shooting-smoke-cloud" />
                <div className="shooting-smoke-particles" />
                <div className="shooting-head" />
            </div>
          ))}
        </div>
        
      )}
    </div>
  );
}
