/**
 * CatalogueCard.tsx — Phase 3B Luxury Botanical Archive Card
 *
 * Visual hierarchy:
 *   ├── Adaptive glow halo (behind card, colour-matched to flower)
 *   ├── Hero image section  — 70 % of card height
 *   │   ├── Flower photograph (cover, scale on hover)
 *   │   ├── Gradient scrim (adaptive tint → transparent, bottom up)
 *   │   └── Confidence badge (top-right float)
 *   └── Specimen body — 30 % of card height
 *       ├── Common name (display serif, cream)
 *       ├── Scientific name (italic, golden oat muted)
 *       └── Action row: Growing Info + Explore →
 *
 * All styles are inline — no external CSS class dependencies.
 */
import { Link } from "react-router-dom";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { ArrowRight, Leaf } from "lucide-react";
import type { CatalogueItem } from "@/lib/api";
import { extractAdaptiveColors } from "@/utils/colorExtraction";
import FloatingGrowingInfo from "@/components/FloatingGrowingInfo";

interface AdaptiveColors {
  glassTint: string;
  glowColor: string;
  borderColor: string;
}

const DEFAULT_COLORS: AdaptiveColors = {
  glassTint:   "rgba(81, 89, 50, 0.22)",
  glowColor:   "rgba(81, 89, 50, 0.40)",
  borderColor: "rgba(81, 89, 50, 0.28)",
};

function getConfidence(score: number | undefined) {
  if (!score) return { label: "Unverified", tier: "low" as const, dot: "#888" };
  const pct = Math.round(score * 100);
  if (score >= 0.85) return { label: `${pct}% match`, tier: "high"   as const, dot: "#a8bb72" };
  if (score >= 0.60) return { label: `${pct}% match`, tier: "medium" as const, dot: "#e8a070" };
  return                    { label: `${pct}% match`, tier: "low"    as const, dot: "#888888" };
}

// ── Shared style constants ────────────────────────────────────────────────────
const serif   = "'Cormorant Garamond', Georgia, serif";
const sansUI  = "'Inter', sans-serif";

export function CatalogueCard({ item, className = "" }: { item: CatalogueItem; className?: string }) {
  const [colors, setColors]         = useState<AdaptiveColors>(DEFAULT_COLORS);
  const [showGrowingInfo, setShowGrowingInfo] = useState(false);
  const [imgLoaded, setImgLoaded]   = useState(false);
  const [hovered, setHovered]       = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const imgSrc      = item.primary_image_url || "/placeholder.svg";
  const displayName = item.common_names?.[0] || item.scientific_name;
  const confidence  = getConfidence((item as any).confidence ?? (item as any).confidence_score);

  const extractColors = useCallback(async (el: HTMLImageElement) => {
    const c = await extractAdaptiveColors(el);
    setColors(c);
  }, []);

  useEffect(() => {
    if (imgLoaded && imgRef.current) extractColors(imgRef.current);
  }, [imgLoaded, extractColors]);

  // Build tint variant strings from glassTint
  const scrimColor = useMemo(() => colors.glassTint.replace(/[\d.]+\)$/, "0.96)"), [colors.glassTint]);
  const cardBg     = useMemo(
    () => `linear-gradient(160deg, rgba(12,14,9,0.84) 0%, ${colors.glassTint.replace(/[\d.]+\)$/, "0.14)")} 100%)`,
    [colors.glassTint]
  );

  // ── Confidence pill style ────────────────────────────────────────────────
  const confBg: Record<string, string> = {
    high:   "rgba(168,187,114,0.14)",
    medium: "rgba(232,160,112,0.14)",
    low:    "rgba(140,140,140,0.12)",
  };
  const confBorder: Record<string, string> = {
    high:   "rgba(168,187,114,0.28)",
    medium: "rgba(232,160,112,0.28)",
    low:    "rgba(140,140,140,0.22)",
  };

  return (
    <>
      {/* Outer wrapper — positions glow + card */}
      <div
        className={className}
        style={{ position: "relative" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* ── Adaptive glow halo (behind card, not a shadow) ── */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "22px",
            background: colors.glowColor,
            filter: "blur(32px)",
            transform: `translateY(${hovered ? "8px" : "4px"}) scale(${hovered ? "0.94" : "0.90"})`,
            opacity: hovered ? 0.85 : 0.45,
            transition: "opacity 0.45s ease, transform 0.45s ease",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />

        {/* ── Card shell ── */}
        <Link
          to={`/species/${item.id}`}
          style={{ display: "block", position: "relative", zIndex: 1, borderRadius: "20px", outline: "none" }}
        >
          <article
            style={{
              background: cardBg,
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: `1px solid ${hovered ? colors.borderColor.replace(/[\d.]+\)$/, "0.55)") : colors.borderColor}`,
              borderRadius: "20px",
              overflow: "hidden",
              transform: hovered ? "translateY(-7px)" : "translateY(0)",
              boxShadow: hovered
                ? `0 28px 56px rgba(0,0,0,0.55), 0 0 0 0.5px ${colors.borderColor}, inset 0 1px 0 rgba(255,255,255,0.07)`
                : `0 8px 28px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)`,
              transition: "transform 0.38s cubic-bezier(0.25,0.46,0.45,0.94), box-shadow 0.38s ease, border-color 0.28s ease",
            }}
          >
            {/* ── Hero image — 70 % of card ── */}
            <div
              style={{
                position: "relative",
                overflow: "hidden",
                height: "clamp(272px, 44vw, 348px)",
              }}
            >
              <img
                ref={imgRef}
                src={imgSrc}
                alt={displayName}
                crossOrigin="anonymous"
                loading="lazy"
                onLoad={() => setImgLoaded(true)}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                  transform: hovered ? "scale(1.045)" : "scale(1)",
                  transition: "transform 0.60s cubic-bezier(0.25,0.46,0.45,0.94)",
                  display: "block",
                }}
              />

              {/* Gradient scrim — fades image into body */}
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `linear-gradient(to top, ${scrimColor} 0%, rgba(0,0,0,0.18) 40%, transparent 70%)`,
                  pointerEvents: "none",
                }}
              />

              {/* Confidence badge */}
              <div
                style={{
                  position: "absolute",
                  top: "0.75rem",
                  right: "0.75rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  padding: "0.22rem 0.65rem",
                  borderRadius: "9999px",
                  background: confBg[confidence.tier],
                  border: `1px solid ${confBorder[confidence.tier]}`,
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                  fontSize: "0.6rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: confidence.dot,
                  fontFamily: sansUI,
                  fontWeight: 500,
                }}
              >
                <span
                  style={{
                    width: "5px",
                    height: "5px",
                    borderRadius: "50%",
                    background: confidence.dot,
                    flexShrink: 0,
                  }}
                />
                {confidence.label}
              </div>
            </div>

            {/* ── Specimen body — 30 % of card ── */}
            <div style={{ padding: "1.2rem 1.4rem 1.4rem" }}>
              {/* Common name */}
              <h3
                style={{
                  fontFamily: serif,
                  fontSize: "clamp(1.15rem, 2.1vw, 1.32rem)",
                  fontWeight: 600,
                  letterSpacing: "0.01em",
                  color: "rgba(232, 225, 214, 0.95)",
                  lineHeight: 1.2,
                  marginBottom: "0.3rem",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {displayName}
              </h3>

              {/* Scientific name */}
              <p
                style={{
                  fontFamily: serif,
                  fontSize: "0.88rem",
                  fontStyle: "italic",
                  fontWeight: 300,
                  color: "rgba(242, 196, 141, 0.58)",
                  letterSpacing: "0.025em",
                  marginBottom: "1.1rem",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {item.scientific_name}
              </p>

              {/* Action row */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                {/* Growing info trigger */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowGrowingInfo(true);
                  }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.45rem 0.85rem",
                    borderRadius: "8px",
                    background: "rgba(81,89,50,0.20)",
                    border: "1px solid rgba(81,89,50,0.36)",
                    color: "#a8bb72",
                    fontSize: "0.68rem",
                    fontFamily: sansUI,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    fontWeight: 500,
                    flexShrink: 0,
                    cursor: "pointer",
                    transition: "background 0.22s ease, border-color 0.22s ease",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(81,89,50,0.34)";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(81,89,50,0.55)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(81,89,50,0.20)";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(81,89,50,0.36)";
                  }}
                >
                  <Leaf style={{ width: "11px", height: "11px" }} />
                  Grow
                </button>

                {/* Explore CTA */}
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    gap: "0.35rem",
                    padding: "0.45rem 0.85rem",
                    borderRadius: "8px",
                    background: hovered ? "rgba(242,196,141,0.09)" : "rgba(242,196,141,0.05)",
                    border: `1px solid ${hovered ? "rgba(242,196,141,0.22)" : "rgba(242,196,141,0.10)"}`,
                    color: "rgba(242,196,141,0.80)",
                    fontSize: "0.68rem",
                    fontFamily: sansUI,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    fontWeight: 500,
                    transition: "background 0.25s ease, border-color 0.25s ease",
                  }}
                >
                  Explore
                  <ArrowRight style={{ width: "12px", height: "12px" }} />
                </div>
              </div>
            </div>
          </article>
        </Link>
      </div>

      <FloatingGrowingInfo
        isOpen={showGrowingInfo}
        onClose={() => setShowGrowingInfo(false)}
        growingInfo={(item as any).growing_info || {}}
        flowerName={displayName}
      />
    </>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
export function CatalogueCardSkeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={className}
      style={{
        borderRadius: "20px",
        overflow: "hidden",
        background: "rgba(14,16,10,0.55)",
        border: "1px solid rgba(255,255,255,0.05)",
        animation: "pulse 1.8s ease-in-out infinite",
      }}
    >
      {/* Image skeleton */}
      <div
        style={{
          height: "clamp(272px, 44vw, 348px)",
          background: "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)",
        }}
      />
      {/* Body skeleton */}
      <div style={{ padding: "1.2rem 1.4rem 1.4rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <div style={{ height: "1.3rem", width: "68%", borderRadius: "6px", background: "rgba(255,255,255,0.06)" }} />
        <div style={{ height: "0.85rem", width: "50%", borderRadius: "4px", background: "rgba(242,196,141,0.06)" }} />
        <div style={{ height: "2.2rem", borderRadius: "8px", background: "rgba(255,255,255,0.04)", marginTop: "0.15rem" }} />
      </div>
    </div>
  );
}
