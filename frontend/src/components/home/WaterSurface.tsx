import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = `
    varying vec2 vUv;

    void main()
    {
        vUv = uv;

        gl_Position =
            projectionMatrix *
            modelViewMatrix *
            vec4(position, 1.0);
    }
`;

const fragmentShader = `
    precision highp float;

    varying vec2 vUv;

    uniform float uTime;
    uniform float uAspect;

    float hash(vec2 p)
    {
        return fract(
            sin(
                dot(
                    p,
                    vec2(127.1,311.7)
                )
            ) * 43758.5453123
        );
    }

    float noise(vec2 p)
    {
        vec2 i = floor(p);
        vec2 f = fract(p);

        f =
            f * f *
            (
                3.0 - 2.0 * f
            );

        return mix(
            mix(
                hash(i),
                hash(i + vec2(1.0,0.0)),
                f.x
            ),
            mix(
                hash(i + vec2(0.0,1.0)),
                hash(i + vec2(1.0,1.0)),
                f.x
            ),
            f.y
        );
    }

    void main()
    {
        vec2 uv = vUv;

        //----------------------------------
        // Dark water base
        //----------------------------------

        float depth =
            noise(
                uv * 4.0 +
                uTime * 0.01
            );

        vec3 water =
            vec3(
                0.01,
                0.015,
                0.025
            );

        water += depth * 0.01;

        //----------------------------------
        // Layer 1
        //----------------------------------

        float spark1 =
            noise(
                uv * 20.0 +
                uTime * 0.02
            );

        float spark2 =
            noise(
                uv * 40.0 -
                uTime * 0.03
            );

        float spark =
            pow(
                spark1 * spark2,
                12.0
            );

        //----------------------------------
        // Horizontal stretch
        //----------------------------------

        vec2 stretched = uv;

        stretched.x *= 8.0;

        float streak =
            pow(
                noise(
                    stretched * 10.0
                    +
                    uTime * 0.01
                ),
                20.0
            );

        //----------------------------------
        // Scatter mask
        //----------------------------------

        float scatter =
            smoothstep(
                0.65,
                0.95,
                noise(
                    uv * 3.0
                )
            );

        //----------------------------------
        // Cluster mask
        //----------------------------------

        float clusters =
            smoothstep(
                0.55,
                0.9,
                noise(
                    uv * 1.5
                    +
                    50.0
                )
            );

        //----------------------------------
        // Final sparkle
        //----------------------------------

        float sparkle =
            spark *
            streak *
            scatter *
            clusters;

        sparkle =
            pow(
                sparkle,
                8.0
            );

        //----------------------------------
        // Glass highlights
        //----------------------------------

        vec3 glint =
            vec3(1.0)
            *
            sparkle
            *
            8.0;

        water += glint;

        //----------------------------------
        // Tiny micro glints
        //----------------------------------

        float micro =
            pow(
                noise(
                    uv * 120.0
                    +
                    uTime * 0.02
                ),
                40.0
            );

        water += micro * 0.02;

        gl_FragColor =
            vec4(
                water,
                0.45
            );
    }
`;

export function WaterSurface()
{
    const meshRef =
        useRef<THREE.Mesh>(null);

    const { viewport } =
        useThree();

    const uniforms =
        useMemo(
            () => ({
                uTime: { value: 0 },
                uAspect: {
                    value:
                        viewport.width /
                        viewport.height
                }
            }),
            []
        );

    useFrame((_, delta) =>
    {
        uniforms.uTime.value += delta;

        uniforms.uAspect.value =
            viewport.width /
            viewport.height;
    });

    return (
        <mesh
            ref={meshRef}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, 0.18, 0]}
        >
            <planeGeometry
                args={[
                    viewport.width * 1.2,
                    viewport.height * 1.2,
                    1,
                    1
                ]}
            />

            <shaderMaterial
                transparent
                depthWrite={false}
                blending={
                    THREE.AdditiveBlending
                }
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
            />
        </mesh>
    );
}