/**
 * colorExtraction.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Adaptive Glass Color Architecture
 *
 * Pipeline:
 *  1. Render the <img> onto an off-screen canvas via fast-average-color
 *  2. Desaturate the extracted RGB by 40 % (lerp toward its own luminance)
 *  3. Blend the desaturated colour with Evergreen Moss (#515932) at 50 %
 *  4. Derive glassTint, glowColor, borderColor from that composite
 *
 * Why this matters:
 *  • Every card surface echoes the flower's actual pigment — not a fixed theme
 *  • The 40 % desaturation prevents neon/garish clashes on vibrant blooms
 *  • The Moss blend keeps all cards coherent with the botanical brand palette
 *  • Glow is boosted to 80 % saturation so it reads against the dark glass
 * ─────────────────────────────────────────────────────────────────────────────
 */

import {FastAverageColor} from "fast-average-color";

const fac = new FastAverageColor();

// Evergreen Moss #515932  →  r:81, g:89, b:50
const MOSS = { r: 81, g: 89, b: 50 };

interface AdaptiveColors {
  /** Semi-transparent fill for the glass panel */
  glassTint: string;
  /** Diffused shadow/glow behind the card */
  glowColor: string;
  /** Subtle 1-px border line */
  borderColor: string;
}

// ── helpers ──────────────────────────────────────────────────────────────────

function clamp(v: number, lo = 0, hi = 255): number {
  return Math.max(lo, Math.min(hi, Math.round(v)));
}

/** Convert RGB to HSL (all 0-1 range) */
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [h, s, l];
}

function hue2rgb(p: number, q: number, t: number): number {
  if (t < 0) t += 1; if (t > 1) t -= 1;
  if (t < 1/6) return p + (q - p) * 6 * t;
  if (t < 1/2) return q;
  if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
  return p;
}

/** Convert HSL (0-1) back to [r, g, b] 0-255 */
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  if (s === 0) {
    const v = clamp(l * 255);
    return [v, v, v];
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return [
    clamp(hue2rgb(p, q, h + 1/3) * 255),
    clamp(hue2rgb(p, q, h) * 255),
    clamp(hue2rgb(p, q, h - 1/3) * 255),
  ];
}

/** Reduce saturation of an RGB colour by `amount` (0-1) */
function desaturate(r: number, g: number, b: number, amount: number): [number, number, number] {
  const [h, s, l] = rgbToHsl(r, g, b);
  return hslToRgb(h, Math.max(0, s * (1 - amount)), l);
}

/** Linear blend between two RGB colours at ratio t (0 = a, 1 = b) */
function blendRgb(
  a: { r: number; g: number; b: number },
  b: { r: number; g: number; b: number },
  t: number
): { r: number; g: number; b: number } {
  return {
    r: clamp(a.r * (1 - t) + b.r * t),
    g: clamp(a.g * (1 - t) + b.g * t),
    b: clamp(a.b * (1 - t) + b.b * t),
  };
}

// ── core export ──────────────────────────────────────────────────────────────

export async function extractAdaptiveColors(
  imgEl: HTMLImageElement
): Promise<AdaptiveColors> {
  const fallback: AdaptiveColors = {
    glassTint:   "rgba(81, 89, 50, 0.25)",
    glowColor:   "rgba(81, 89, 50, 0.35)",
    borderColor: "rgba(81, 89, 50, 0.30)",
  };

  try {
    const result = await fac.getColorAsync(imgEl, {
      algorithm: "dominant",
      ignoredColor: [[255, 255, 255, 255, 30], [0, 0, 0, 255, 30]],
    });

    if (result.error) return fallback;

    const [er, eg, eb] = result.value;

    // Step 1 – desaturate by 40 %
    const [dr, dg, db] = desaturate(er, eg, eb, 0.4);

    // Step 2 – blend with Evergreen Moss at 50 %
    const composite = blendRgb({ r: dr, g: dg, b: db }, MOSS, 0.5);
    const { r, g, b } = composite;

    // Step 3 – boost saturation for the glow (make it pop)
    const [gh, gs, gl] = rgbToHsl(r, g, b);
    const [gr, gg, gbv] = hslToRgb(gh, Math.min(1, gs * 2.0 + 0.2), Math.min(0.65, gl + 0.1));

    return {
      glassTint:   `rgba(${r}, ${g}, ${b}, 0.22)`,
      glowColor:   `rgba(${gr}, ${gg}, ${gbv}, 0.55)`,
      borderColor: `rgba(${r}, ${g}, ${b}, 0.35)`,
    };
  } catch {
    return fallback;
  }
}
