/**
 * CatalogueEmptyState.tsx — Phase 3B Premium Botanical Empty State
 *
 * Two modes:
 *  • No filters applied → "The archive is quiet" (invitation to browse)
 *  • Filters active    → "No specimens found"  (prompt to adjust)
 *
 * Animated SVG botanical mark. Glass panel. Golden Oat typography.
 * No external CSS class dependencies.
 */
import { Flower2, SearchX } from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";

const serif  = "'Cormorant Garamond', Georgia, serif";
const sansUI = "'Inter', sans-serif";

interface CatalogueEmptyStateProps {
  hasFilters: boolean;
  onClearFilters: () => void;
}

// ── Decorative animated botanical SVG mark ────────────────────────────────────
function ArchiveMark() {
  return (
    <svg
      width="88"
      height="88"
      viewBox="0 0 88 88"
      fill="none"
      style={{ display: "block" }}
    >
      {/* Outer ring */}
      <circle
        cx="44"
        cy="44"
        r="40"
        stroke="rgba(242,196,141,0.12)"
        strokeWidth="1"
      />
      {/* Mid ring */}
      <circle
        cx="44"
        cy="44"
        r="30"
        stroke="rgba(242,196,141,0.07)"
        strokeWidth="0.75"
        strokeDasharray="4 6"
      />
      {/* Radial petal marks */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * Math.PI * 2) / 8 - Math.PI / 2;
        const x1 = 44 + Math.cos(angle) * 20;
        const y1 = 44 + Math.sin(angle) * 20;
        const x2 = 44 + Math.cos(angle) * 36;
        const y2 = 44 + Math.sin(angle) * 36;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="rgba(242,196,141,0.18)"
            strokeWidth="0.8"
          />
        );
      })}
      {/* Centre dot */}
      <circle cx="44" cy="44" r="5" fill="rgba(242,196,141,0.14)" />
      <circle cx="44" cy="44" r="2.5" fill="rgba(242,196,141,0.35)" />
    </svg>
  );
}

export function CatalogueEmptyState({ hasFilters, onClearFilters }: CatalogueEmptyStateProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "5rem 1.5rem",
        textAlign: "center",
      }}
    >
      <GlassPanel
        variant="subtle"
        padding="lg"
        className="max-w-md mx-auto w-full"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.5rem",
        } as React.CSSProperties}
      >
        {/* Icon cluster */}
        <div style={{ position: "relative", width: "88px", height: "88px" }}>
          <ArchiveMark />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {hasFilters ? (
              <SearchX
                style={{ width: "24px", height: "24px", color: "rgba(242,196,141,0.55)" }}
              />
            ) : (
              <Flower2
                style={{ width: "24px", height: "24px", color: "rgba(242,196,141,0.55)" }}
              />
            )}
          </div>
        </div>

        {/* Thin ornamental rule */}
        <div
          style={{
            width: "40px",
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(242,196,141,0.35), transparent)",
          }}
        />

        {/* Heading */}
        <h3
          style={{
            fontFamily: serif,
            fontSize: "clamp(1.5rem, 3vw, 1.9rem)",
            fontWeight: 300,
            letterSpacing: "0.03em",
            color: "rgba(232,225,214,0.88)",
            lineHeight: 1.2,
            margin: 0,
          }}
        >
          {hasFilters ? "No specimens found" : "The archive is quiet"}
        </h3>

        {/* Body */}
        <p
          style={{
            fontFamily: sansUI,
            fontSize: "0.82rem",
            lineHeight: 1.75,
            color: "rgba(232,225,214,0.40)",
            maxWidth: "34ch",
            margin: 0,
          }}
        >
          {hasFilters
            ? "No flowers match the current selection. Try adjusting your filters or clearing the search."
            : "The collection is being curated. Check back soon for specimens."}
        </p>

        {/* CTA */}
        {hasFilters && (
          <button
            onClick={onClearFilters}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.6rem 1.6rem",
              borderRadius: "9999px",
              background: "rgba(242,196,141,0.08)",
              border: "1px solid rgba(242,196,141,0.22)",
              color: "rgba(242,196,141,0.85)",
              fontSize: "0.68rem",
              fontFamily: sansUI,
              fontWeight: 500,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.25s ease",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(242,196,141,0.15)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(242,196,141,0.35)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(242,196,141,0.08)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(242,196,141,0.22)";
            }}
          >
            Clear Filters
          </button>
        )}
      </GlassPanel>
    </div>
  );
}
