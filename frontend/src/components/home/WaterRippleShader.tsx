import { useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";



interface WaterRippleShaderProps 
    {
        scrollVelocity?: number;
        drownRippleStrength?: number;
    }

    const waterVertexShader = `
        precision highp float;
        precision highp int;
        varying vec2 vUv;
        varying vec3 vPosition;

    void main() 
    {
        vUv = uv;
        vPosition = position;

        vec3 displaced = position;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
    }`;

const waterFragmentShader = `
    precision highp float;
    precision highp int;
    varying vec2 vUv;
    uniform float uTime;
    uniform float uScrollVelocity;
    uniform float uRippleStrength;
    uniform float uAspect;

    // Noise functions
    float hash(vec2 p)
    {
        return fract(
            sin(
                dot(
                    p,
                    vec2(127.1, 311.7)
                )
            ) * 43758.5453123
        );
    }

    float noise(vec2 p)
    {
        vec2 i = floor(p);
        vec2 f = fract(p);

        f = f * f * (3.0 - 2.0 * f);

        return mix(
            mix(hash(i), hash(i + vec2(1.0,0.0)), f.x),
            mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), f.x),
            f.y
        );
    }

    float rand(float n)
    {
        return fract(sin(n) * 43758.5453123);
    }

    float rippleField(
        vec2 uv,
        float time,
        float strength
        )
    {
        float r = 0.0;

        const int EMITTER_COUNT = 24;

        for(int i=0;i<EMITTER_COUNT;i++)
        {
            float spawnInterval = 12.0;

            float grid = 5.0;

            vec2 cell =
                vec2(
                    mod(float(i), grid),
                    floor(float(i) / grid)
                );

            float cellId =
                cell.x +
                cell.y * grid;

            float spawnOffset =
                cellId * 0.9;

            float spawnId =
                floor((time + spawnOffset) / spawnInterval);

            float localTime =
                mod(time + spawnOffset, spawnInterval);

            float lifeTime =
                spawnInterval *
                mix(
                    6.0,
                    20.0,
                    rand(float(i) * 91.7 + spawnId)
                );

            float dropSeed =
                    rand(float(i) * 13.7 + spawnId);

            float dropSize =
                mix(
                    0.1,
                    1.0,
                    pow(dropSeed, 0.5)
                );

            float seed =
                float(i) * 12.9898 +
                spawnId * 97.13;

            vec2 jitter =
            (
                vec2(
                    rand(seed + 1.0),
                    rand(seed + 2.0)
                ) - 0.5
            ) * 0.90;

            vec2 emitter =
                (
                    cell
                    + vec2(0.5)
                    + jitter
                )
                / grid;

            if(
                dropSize > 0.8
            )
            {
                dropSize *= 0.6;
            }

            emitter = 0.02 + emitter * 0.96;

            emitter = clamp(emitter, 0.01, 0.99);

            if(localTime < lifeTime)
            {
                int ringCount =
                    int(
                        floor(
                            mix(
                                4.0,
                                12.0,
                                dropSize
                            )
                        )
                    );

                float craterRadius =
                    mix(
                        0.001,
                        0.008,
                        dropSize
                    );

                vec2 p = uv - emitter;
                p.x *= uAspect;
                float d = length(p);

                float crater =
                    exp(
                        -pow(
                            d,
                            2.0
                        )
                        /
                        (craterRadius * craterRadius)
                    );

                float craterFade =
                    exp(
                        -localTime
                        * 15.0
                    );

                crater *= craterFade;

                float fadeIn =
                    smoothstep(
                        0.0,
                        0.15,
                        localTime
                    );

                float fadeOut =
                    1.0 -
                    smoothstep(
                        lifeTime * 0.7,
                        lifeTime,
                        localTime
                    );

                float ageFade =
                    fadeIn * fadeOut;    

                r += crater * ageFade;

                for(int j = 0; j < 12; j++)
                {
                    if(j >= ringCount)
                        break;

                    float bounceTime =
                        float(j)
                        *
                        mix(
                            0.20,
                            0.35,
                            dropSize
                        );

                    float ringAge =
                        localTime
                        -
                        bounceTime;

                    if(ringAge <= 0.0)
                        continue;

                    float maxRadius =
                        mix(
                            0.08,
                            0.25,
                            dropSize
                        );

                    float ringScale =
                        exp(
                            -float(j) * 0.8
                        );

                    float radius =
                        maxRadius
                        *
                        ringScale
                        *
                        (
                            1.0
                            -
                            exp(
                                -ringAge
                                * 0.12
                            )
                        );

                    float waveFront = radius;

                    float crest =
                        exp(
                            -pow(
                                d - waveFront,
                                2.0
                            )
                            * 4000.0
                        );

                    float trailing =
                        max(
                            0.0,
                            sin(
                                (waveFront - d)
                                * 90.0
                            )
                        )
                        *
                        exp(
                            -(waveFront - d)
                            * 6.0
                        );

                    trailing *= step(
                        d,
                        waveFront
                    );

                    float radiusFade =
                        1.0
                        -
                        smoothstep(
                            maxRadius * 0.85,
                            maxRadius,
                            radius
                        );

                    float angle =
                        rand(
                            float(i) * 31.7
                            +
                            float(j) * 17.3
                            +
                            spawnId
                        )
                        *
                        6.2831853;

                    vec2 impactCenter =
                        emitter
                        +
                        vec2(
                            cos(angle),
                            sin(angle)
                        )
                        *
                        radius
                        *
                        0.08;

                    vec2 ip =
                        uv - impactCenter;

                    ip.x *= uAspect;

                    float impactD =
                        length(ip);

                    float thickness =
                        mix(
                            15000.0,
                            3000.0,
                            dropSize
                        )
                        *
                        pow(
                            1.15,
                            float(j)
                        );

                    float ring =
                        exp(
                            -pow(
                                d - radius,
                                2.0
                            )
                            *
                            thickness
                        );

                    float ringDecay =
                        exp(
                            -ringAge
                            *
                            mix(
                                0.1,
                                0.4,
                                dropSize
                            )
                        );

                    float ringAppear =
                        smoothstep(
                            0.0,
                            0.25,
                            ringAge
                        );

                    float energy =
                        pow(
                            0.75,
                            float(j)
                        );

                    float impact =
                        exp(
                            -pow(
                                impactD,
                                2.0
                            )
                            /
                            pow(
                                craterRadius
                                *
                                pow(
                                    0.7,
                                    float(j)
                                ),
                                2.0
                            )
                        );

                    impact *=
                        exp(
                            -ringAge
                            * 2.5
                        );

                    r +=
                    (
                        ring + impact + crest * 2.5 + trailing
                    ) * energy * ageFade * radiusFade * ringDecay * ringAppear;
                }
                
            }
        }

        return r * strength;
    }

    void main() {
        // Base dark water
        float depth = noise(vUv * 3.0 + uTime * 0.1) * 0.015;
        vec3 deepWater = vec3(0.02, 0.02, 0.03) + depth * vec3(0.01, 0.01, 0.015);

        // Surface highlights
        float nx = noise(vUv * 8.0 + vec2(uTime * 0.15, 0.0));
        float ny = noise(vUv * 6.0 + vec2(0.0, uTime * 0.12));
        float surface = nx * ny * 0.08;
        vec3 highlight = vec3(0.08, 0.09, 0.11) * surface;

        // Ripple highlight
        float rpl = rippleField(vUv, uTime, uRippleStrength);

        rpl = 1.0 - exp(-rpl * 0.3);
        vec3 rippleHighlight =
            vec3(rpl) * 0.25;

        // Scroll distortion color
        float scrollSheen = abs(uScrollVelocity) * 0.02;
        vec3 scrollColor = vec3(0.08, 0.09, 0.12) * scrollSheen;

        // Combine
        vec3 water =
            deepWater
            + highlight
            + rippleHighlight
            + scrollColor;

        float micro =
            (
                noise(vUv * 40.0 + uTime * 0.05)
                +
                noise(vUv * 80.0 - uTime * 0.03)
            ) * 0.003;

        water += vec3(micro);

        // Edge fade to pure dark
        float edgeFade = smoothstep(0.0, 0.15, vUv.x) * smoothstep(1.0, 0.85, vUv.x)
                        * smoothstep(0.0, 0.08, vUv.y) * smoothstep(1.0, 0.92, vUv.y);

        water = mix(vec3(0.05, 0.05, 0.06), water, edgeFade);

        // Alpha: water is visible in lower portion
        float alpha = 0.0;

        gl_FragColor = vec4(water, alpha);
        }
    `;


export function WaterRippleShader({
    scrollVelocity = 0,
    }: WaterRippleShaderProps) {
    const meshRef = useRef<THREE.Mesh>(null);

    const { viewport } = useThree();



    const uniforms = useMemo(
        () => ({
        uTime: { value: 0 },
        uScrollVelocity: { value: 0 },
        uRippleStrength: { value: 1 },
        uAspect: { value: viewport.width / viewport.height },
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );


    useFrame((_, delta) => {
        uniforms.uScrollVelocity.value += (scrollVelocity - uniforms.uScrollVelocity.value) * 0.1;
        uniforms.uAspect.value =
            viewport.width / viewport.height;
        uniforms.uTime.value += delta;
    });

    return (
        <mesh 
            ref={meshRef} 
            rotation={[-Math.PI / 2, 0, 0]} 
            position={[0, 0.2, 0]}>
        <planeGeometry
            args={[
                viewport.width * 1.2,
                viewport.height * 1.2,
                1,
                1,
            ]}
        />
        <shaderMaterial
            vertexShader={waterVertexShader}
            fragmentShader={waterFragmentShader}
            uniforms={uniforms}
            transparent
            side={THREE.DoubleSide}
        />
        </mesh>
    );
    }