import { useLocation, useNavigate } from "react-router-dom";
import { RefreshCw, Leaf, Zap, Clock } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { GlassPanel, GlassDivider, GlassSectionLabel } from "@/components/ui/GlassPanel";
import { GlassPill } from "@/components/ui/GlassPill";
// theme.css and glass.css now loaded globally via main.tsx

// ── Helpers ───────────────────────────────────────────────────────────────

function toLabel(key: string): string {
  return key
    .replace(/_traits$/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// Specimen-grade confidence indicator
function ConfidenceGauge({ value }: { value: number }) {
  const pct = Math.min(100, Math.round(value * 100));
  const barColor =
    pct >= 80
      ? "var(--calyx-golden-oat)"
      : pct >= 55
      ? "rgba(242, 196, 141, 0.55)"
      : "rgba(134, 58, 24, 0.75)";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <span
          style={{
            fontSize: "0.6rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--calyx-text-muted)",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Identification Confidence
        </span>
        <span
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.5rem",
            fontWeight: 300,
            color: "var(--calyx-golden-oat)",
            lineHeight: 1,
          }}
        >
          {pct}
          <span style={{ fontSize: "0.9rem", opacity: 0.6 }}>%</span>
        </span>
      </div>
      {/* Track */}
      <div
        style={{
          height: "2px",
          background: "rgba(255,255,255,0.07)",
          borderRadius: "2px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: barColor,
            borderRadius: "2px",
            transition: "width 0.9s cubic-bezier(0.16,1,0.3,1)",
          }}
        />
      </div>
    </div>
  );
}

// Trait row renderer — converts nested JSON into elegant key-value pairs
function TraitGroup({
  label,
  value,
}: {
  label: string;
  value: unknown;
}) {
  const entries =
    value && typeof value === "object" && !Array.isArray(value)
      ? Object.entries(value as Record<string, unknown>)
      : null;

  return (
    <div>
      {/* Group heading */}
      <p
        style={{
          fontSize: "0.6rem",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "var(--calyx-text-accent-dim)",
          fontFamily: "'Inter', sans-serif",
          marginBottom: "0.75rem",
        }}
      >
        {toLabel(label)}
      </p>

      {entries ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
          {entries.map(([k, v]) => (
            <div
              key={k}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                gap: "0.75rem",
                paddingBottom: "0.3rem",
                borderBottom: "1px solid var(--calyx-border-subtle)",
              }}
            >
              <span
                style={{
                  fontSize: "0.68rem",
                  color: "var(--calyx-text-secondary)",
                  fontFamily: "'Inter', sans-serif",
                  flexShrink: 0,
                }}
              >
                {toLabel(k)}
              </span>
              <span
                style={{
                  fontSize: "0.68rem",
                  color: "var(--calyx-text-primary)",
                  fontFamily: "'Inter', sans-serif",
                  textAlign: "right",
                  wordBreak: "break-word",
                }}
              >
                {Array.isArray(v)
                  ? v.join(", ")
                  : v === null || v === undefined
                  ? "—"
                  : String(v)}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p
          style={{
            fontSize: "0.72rem",
            color: "var(--calyx-text-primary)",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {Array.isArray(value)
            ? (value as string[]).join(", ")
            : value === null || value === undefined
            ? "—"
            : String(value)}
        </p>
      )}
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────

export default function FlowerResult() {
  // ── ALL DATA LOGIC UNCHANGED ───────────────────────────────────────────
  const { state } = useLocation();
  const navigate = useNavigate();

  const result = state?.result;
  const debugImage = result?.debug_image_url;
  const candidates = result?.alternatives || [];
  const traits = result?.traits_extracted;
  const method = result?.method;

  const isShortlist =
    method === "trait_shortlist" || method === "vector_shortlist";
  // ── END DATA LOGIC ─────────────────────────────────────────────────────

  // Empty state
  if (!result) {
    return (
      <AppShell>
        <div
          style={{
            minHeight: "80vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            paddingTop: "9rem",
          }}
        >
          <div style={{ maxWidth: "400px", width: "100%" }}>
            <GlassPanel variant="float" padding="lg">
              <div style={{ textAlign: "center" }}>
                <Leaf
                  size={36}
                  style={{
                    color: "var(--calyx-moss)",
                    marginBottom: "1.25rem",
                    opacity: 0.6,
                  }}
                />
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1.2rem",
                    color: "var(--calyx-text-secondary)",
                    marginBottom: "1.5rem",
                    fontWeight: 300,
                  }}
                >
                  No identification result found.
                </p>
                <button
                  onClick={() => navigate("/identify")}
                  className="glass-btn-primary"
                  style={{
                    padding: "0.65rem 1.75rem",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <RefreshCw size={13} />
                  Try Again
                </button>
              </div>
            </GlassPanel>
          </div>
        </div>
      </AppShell>
    );
  }

  const heroImage = result.primary_image_url || debugImage;
  const displayName = result.common_names?.[0] || result.scientific_name;

  return (
    <AppShell>
      {/* ── HERO IMAGE ────────────────────────────────────────────── */}
      <div
        style={{
          position: "relative",
          height: "clamp(400px, 60vh, 680px)",
          overflow: "hidden",
          background: "var(--calyx-page-bg)",
          marginTop: 0,
        }}
      >
        {heroImage && (
          <img
            src={heroImage}
            alt={displayName}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 30%",
              opacity: 0.78,
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        )}

        {/* Top fade */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(11,12,8,0.55) 0%, transparent 35%, transparent 45%, rgba(11,12,8,0.92) 100%)",
            pointerEvents: "none",
          }}
        />

        {/* Method badge — top-right, below navbar */}
        {method && (
          <div
            style={{
              position: "absolute",
              top: "5.5rem",
              right: "1.5rem",
              display: "flex",
              gap: "0.5rem",
            }}
          >
            <GlassPill variant="moss" size="xs">
              <Zap size={9} />
              {method.replace(/_/g, " ")}
            </GlassPill>
          </div>
        )}

        {/* Shortlist notice */}
        {isShortlist && (
          <div
            style={{
              position: "absolute",
              bottom: "7rem",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <GlassPill variant="golden" size="sm">
              Closest Visual Matches — Exact ID Unavailable
            </GlassPill>
          </div>
        )}

        {/* Specimen index label — bottom-left */}
        <div
          style={{
            position: "absolute",
            bottom: "5.5rem",
            left: "clamp(1rem, 4vw, 3rem)",
          }}
        >
          <p
            style={{
              fontSize: "0.55rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "rgba(242,196,141,0.45)",
              fontFamily: "'Inter', sans-serif",
              marginBottom: "0.4rem",
            }}
          >
            Calyx Flora — Identification Record
          </p>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              fontSize: "clamp(0.85rem, 2vw, 1rem)",
              color: "rgba(232,225,214,0.5)",
              letterSpacing: "0.04em",
            }}
          >
            {result.scientific_name}
          </p>
        </div>
      </div>

      {/* ── MAIN CONTENT — pulls up over hero ────────────────────── */}
      <div
        className="relative z-10 mx-auto px-4 md:px-6"
        style={{
          maxWidth: "960px",
          marginTop: "-4.5rem",
          paddingBottom: "5rem",
        }}
      >
        {/* PRIMARY IDENTIFICATION CARD */}
        <GlassPanel variant="float" padding="lg" className="mb-6 md:mb-8">
          {/* Common name */}
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              fontSize: "clamp(1.9rem, 5vw, 3rem)",
              color: "var(--calyx-muted-cream)",
              lineHeight: 1.08,
              marginBottom: "0.35rem",
              letterSpacing: "0.01em",
            }}
          >
            {displayName}
          </h1>

          {/* Scientific name */}
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              fontSize: "clamp(0.95rem, 2.5vw, 1.1rem)",
              color: "var(--calyx-text-secondary)",
              marginBottom: "1.75rem",
              letterSpacing: "0.02em",
            }}
          >
            {result.scientific_name}
          </p>

          <GlassDivider className="mb-5" />

          {/* Confidence gauge */}
          <ConfidenceGauge value={result.confidence} />

          {/* Meta pills */}
          {(method || result.response_time_ms) && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.45rem",
                marginTop: "1.25rem",
              }}
            >
              {method && (
                <GlassPill variant="ghost" size="xs">
                  <Zap size={9} />
                  {method.replace(/_/g, " ")}
                </GlassPill>
              )}
              {result.response_time_ms && (
                <GlassPill variant="ghost" size="xs">
                  <Clock size={9} />
                  {result.response_time_ms} ms
                </GlassPill>
              )}
            </div>
          )}
        </GlassPanel>

        {/* ── TOP CANDIDATES ──────────────────────────────────────── */}
        {candidates.length > 0 && (
          <div style={{ marginBottom: "2rem" }}>
            <div style={{ marginBottom: "0.85rem" }}>
              <GlassSectionLabel>
                {isShortlist ? "Likely Matches" : "Top Matches"}
              </GlassSectionLabel>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(min(140px, 100%), 1fr))",
                gap: "0.65rem",
              }}
            >
              {candidates.slice(0, 5).map((c: any, index: number) => (
                <div
                  key={`${c.scientific_name}-${index}`}
                  className="glass-panel-subtle"
                  style={{
                    overflow: "hidden",
                    borderRadius: "var(--calyx-radius-md)",
                    transition:
                      "transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.transform = "translateY(-3px)";
                    el.style.borderColor = "var(--calyx-border-golden)";
                    el.style.boxShadow =
                      "0 8px 24px rgba(0,0,0,0.35), 0 0 16px rgba(242,196,141,0.06)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.transform = "translateY(0)";
                    el.style.borderColor = "";
                    el.style.boxShadow = "";
                  }}
                >
                  {/* Image */}
                  <div
                    style={{
                      height: "96px",
                      overflow: "hidden",
                      background: "rgba(0,0,0,0.3)",
                      position: "relative",
                    }}
                  >
                    {c.primary_image_url ? (
                      <img
                        src={c.primary_image_url}
                        alt={c.common_names?.[0] || c.scientific_name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          opacity: 0.88,
                          transition: "opacity 0.2s ease",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "var(--calyx-moss-10)",
                        }}
                      >
                        <Leaf
                          size={22}
                          style={{ color: "var(--calyx-moss)", opacity: 0.5 }}
                        />
                      </div>
                    )}
                    {/* Confidence overlay */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: "0.35rem",
                        right: "0.4rem",
                        background: "rgba(11,12,8,0.75)",
                        backdropFilter: "blur(6px)",
                        border: "1px solid rgba(242,196,141,0.15)",
                        borderRadius: "4px",
                        padding: "0.1rem 0.4rem",
                        fontSize: "0.6rem",
                        fontFamily: "'Inter', sans-serif",
                        color: "var(--calyx-golden-oat)",
                        fontWeight: 600,
                      }}
                    >
                      {Math.round((c.confidence || 0) * 100)}%
                    </div>
                  </div>

                  {/* Name */}
                  <div style={{ padding: "0.55rem 0.7rem 0.65rem" }}>
                    <p
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: 500,
                        color: "var(--calyx-text-primary)",
                        lineHeight: 1.3,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {c.common_names?.[0] || c.scientific_name}
                    </p>
                    {c.common_names?.[0] && (
                      <p
                        style={{
                          fontSize: "0.6rem",
                          fontStyle: "italic",
                          color: "var(--calyx-text-muted)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          marginTop: "0.15rem",
                          fontFamily: "'Cormorant Garamond', serif",
                        }}
                      >
                        {c.scientific_name}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── DEBUG IMAGE ──────────────────────────────────────────── */}
        {debugImage && !heroImage && (
          <GlassPanel variant="subtle" padding="md" className="mb-6">
            <div style={{ marginBottom: "0.85rem" }}>
              <GlassSectionLabel>Visual Analysis Overlay</GlassSectionLabel>
            </div>
            <img
              src={debugImage}
              alt="Analysis overlay"
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "var(--calyx-radius-md)",
                opacity: 0.9,
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </GlassPanel>
        )}

        {/* ── EXTRACTED TRAITS ─────────────────────────────────────── */}
        {traits && Object.keys(traits).length > 0 && (
          <GlassPanel padding="lg" className="mb-6">
            <div style={{ marginBottom: "1.25rem" }}>
              <GlassSectionLabel>Botanical Traits</GlassSectionLabel>
            </div>
              <div style={{ marginBottom: "1.25rem" }}>
              <GlassDivider />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(min(220px, 100%), 1fr))",
                gap: "1.75rem",
              }}
            >
              {Object.entries(traits).map(([key, value]) => (
                <TraitGroup key={key} label={key} value={value} />
              ))}
            </div>
          </GlassPanel>
        )}

        {/* ── ALL ALTERNATIVES (>5) ────────────────────────────────── */}
        {candidates.length > 5 && (
          <GlassPanel padding="lg" className="mb-8">
            <div style={{ marginBottom: "1.25rem" }}>
              <GlassSectionLabel>All Alternatives</GlassSectionLabel>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(min(150px, 100%), 1fr))",
                gap: "0.65rem",
              }}
            >
              {candidates.slice(5).map((alt: any, index: number) => (
                <div
                  key={`${alt.scientific_name}-${index}`}
                  className="glass-panel-subtle"
                  style={{
                    overflow: "hidden",
                    borderRadius: "var(--calyx-radius-md)",
                    transition: "opacity 0.2s ease",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLDivElement).style.opacity = "0.85")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLDivElement).style.opacity = "1")
                  }
                >
                  <div
                    style={{
                      height: "80px",
                      overflow: "hidden",
                      background: "rgba(0,0,0,0.3)",
                    }}
                  >
                    {alt.primary_image_url ? (
                      <img
                        src={alt.primary_image_url}
                        alt={alt.common_names?.[0] || alt.scientific_name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          opacity: 0.82,
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "var(--calyx-moss-10)",
                        }}
                      >
                        <Leaf
                          size={18}
                          style={{ color: "var(--calyx-moss)", opacity: 0.5 }}
                        />
                      </div>
                    )}
                  </div>
                  <div style={{ padding: "0.5rem 0.6rem 0.6rem" }}>
                    <p
                      style={{
                        fontSize: "0.68rem",
                        fontWeight: 500,
                        color: "var(--calyx-text-primary)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        fontFamily: "'Inter', sans-serif",
                        lineHeight: 1.3,
                      }}
                    >
                      {alt.common_names?.[0] || alt.scientific_name}
                    </p>
                    <p
                      style={{
                        fontSize: "0.6rem",
                        fontStyle: "italic",
                        color: "var(--calyx-text-muted)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        marginTop: "0.1rem",
                        fontFamily: "'Cormorant Garamond', serif",
                      }}
                    >
                      {alt.scientific_name}
                    </p>
                    <p
                      style={{
                        fontSize: "0.62rem",
                        color: "var(--calyx-golden-oat)",
                        marginTop: "0.25rem",
                        fontFamily: "'Inter', sans-serif",
                        opacity: 0.8,
                      }}
                    >
                      {(alt.confidence * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>
        )}

        {/* ── RETRY CTA ────────────────────────────────────────────── */}
        <div style={{ textAlign: "center", paddingTop: "0.5rem" }}>
          <button
            onClick={() => navigate("/")}
            className="glass-btn-primary"
            style={{
              padding: "0.8rem 2.25rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.6rem",
              fontSize: "0.68rem",
            }}
          >
            <RefreshCw size={13} />
            Identify Another Flower
          </button>
        </div>
      </div>
    </AppShell>
  );
}