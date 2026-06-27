import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getSpeciesDetail, SpeciesDetail as SpeciesDetailType } from "@/lib/api";
import { ArrowLeft, Loader2, Calendar, Droplets, Sun, AlertCircle, Leaf } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { GlassPanel, GlassDivider, GlassSectionLabel } from "@/components/ui/GlassPanel";
import { GlassPill } from "@/components/ui/GlassPill";
import "@/styles/theme.css";
import "@/styles/glass.css";

// ── Component ─────────────────────────────────────────────────────────────

export default function SpeciesDetail() {
  // ── ALL DATA LOGIC UNCHANGED ───────────────────────────────────────────
  const { id } = useParams<{ id: string }>();
  const [species, setSpecies] = useState<SpeciesDetailType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchSpecies(id);
    }
  }, [id]);

  const fetchSpecies = async (speciesId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getSpeciesDetail(speciesId);
      setSpecies(data);
    } catch (err) {
      setError("Unable to load species details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  // ── END DATA LOGIC ─────────────────────────────────────────────────────

  // ── LOADING STATE ──────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <AppShell>
        <div
          style={{
            minHeight: "80vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: "6rem",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1.25rem",
            }}
          >
            {/* Botanical spinner */}
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                border: "1.5px solid var(--calyx-border-subtle)",
                borderTopColor: "var(--calyx-golden-oat)",
                animation: "spin 1s linear infinite",
              }}
            />
            <p
              style={{
                fontSize: "0.65rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--calyx-text-muted)",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Loading species details…
            </p>
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </AppShell>
    );
  }

  // ── ERROR STATE ────────────────────────────────────────────────────────
  if (error || !species) {
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
          <div style={{ maxWidth: "440px", width: "100%" }}>
            <GlassPanel variant="float" padding="lg">
              <div style={{ textAlign: "center" }}>
                <AlertCircle
                  size={32}
                  style={{
                    color: "var(--calyx-rustwood)",
                    marginBottom: "1.25rem",
                    opacity: 0.7,
                  }}
                />
                <h2
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1.6rem",
                    fontWeight: 300,
                    color: "var(--calyx-muted-cream)",
                    marginBottom: "0.75rem",
                  }}
                >
                  Species Not Found
                </h2>
                <p
                  style={{
                    fontSize: "0.82rem",
                    color: "var(--calyx-text-secondary)",
                    marginBottom: "1.75rem",
                    lineHeight: 1.65,
                  }}
                >
                  {error || "We couldn't find the species you're looking for."}
                </p>
                <Link
                  to="/search"
                  className="glass-btn-primary"
                  style={{
                    padding: "0.65rem 1.75rem",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    textDecoration: "none",
                  }}
                >
                  Browse Flowers
                </Link>
              </div>
            </GlassPanel>
          </div>
        </div>
      </AppShell>
    );
  }

  // ── PRIMARY DISPLAY ────────────────────────────────────────────────────
  const primaryName = species.common_names[0] || species.scientific_name;
  const aliasNames = species.common_names.slice(1);

  return (
    <AppShell>
      <div
        className="mx-auto px-4 md:px-6"
        style={{ maxWidth: "1100px", paddingTop: "7rem", paddingBottom: "5rem" }}
      >
        {/* ── BACK BUTTON ─────────────────────────────────────────── */}
        <Link
          to="/search"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.65rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--calyx-text-muted)",
            textDecoration: "none",
            fontFamily: "'Inter', sans-serif",
            marginBottom: "2.5rem",
            transition: "color 0.2s ease",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLAnchorElement).style.color =
              "var(--calyx-golden-oat)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLAnchorElement).style.color =
              "var(--calyx-text-muted)")
          }
        >
          <ArrowLeft size={12} />
          Back to Search
        </Link>

        {/* ── TWO-COLUMN LAYOUT ────────────────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "2rem",
          }}
          className="lg:grid-cols-[1fr_1.1fr]"
        >
          {/* ── LEFT: HERO IMAGE ──────────────────────────────────── */}
          <div
            className="lg:sticky"
            style={{
              top: "5.5rem",
              alignSelf: "start",
            }}
          >
            {/* Primary image */}
            <div
              style={{
                borderRadius: "var(--calyx-radius-xl)",
                overflow: "hidden",
                background: "var(--calyx-moss-10)",
                aspectRatio: "4 / 5",
                position: "relative",
                boxShadow:
                  "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(242,196,141,0.08)",
              }}
            >
              {species.primary_image_url ? (
                <img
                  src={species.primary_image_url}
                  alt={species.scientific_name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                    opacity: 0.92,
                    transition: "opacity 0.3s ease",
                  }}
                  onMouseEnter={(e) =>
                    ((e.target as HTMLImageElement).style.opacity = "1")
                  }
                  onMouseLeave={(e) =>
                    ((e.target as HTMLImageElement).style.opacity = "0.92")
                  }
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
                    size={48}
                    style={{ color: "var(--calyx-moss)", opacity: 0.3 }}
                  />
                </div>
              )}

              {/* Bottom gradient for text legibility */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "35%",
                  background:
                    "linear-gradient(to top, rgba(11,12,8,0.7), transparent)",
                  pointerEvents: "none",
                }}
              />

              {/* Floating scientific label at image bottom */}
              <div
                style={{
                  position: "absolute",
                  bottom: "1.2rem",
                  left: "1.4rem",
                  right: "1.4rem",
                }}
              >
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: "italic",
                    fontSize: "0.85rem",
                    color: "rgba(232,225,214,0.55)",
                    letterSpacing: "0.03em",
                  }}
                >
                  {species.scientific_name}
                </p>
              </div>
            </div>

            {/* Classification label below image */}
            <div
              style={{
                marginTop: "1rem",
                paddingLeft: "0.25rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <div
                style={{
                  width: "20px",
                  height: "1px",
                  background: "var(--calyx-border-golden)",
                }}
              />
              <p
                style={{
                  fontSize: "0.55rem",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "var(--calyx-text-muted)",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Calyx Flora Botanical Archive
              </p>
            </div>
          </div>

          {/* ── RIGHT: SPECIES INFORMATION ────────────────────────── */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
          >
            {/* Eyebrow + name header */}
            <div>
              <GlassSectionLabel className="mb-3">
                Botanical Profile
              </GlassSectionLabel>

              <h1
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 300,
                  fontSize: "clamp(2.2rem, 5.5vw, 3.4rem)",
                  color: "var(--calyx-muted-cream)",
                  lineHeight: 1.06,
                  letterSpacing: "0.015em",
                  marginBottom: "0.5rem",
                }}
              >
                {primaryName}
              </h1>

              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: "italic",
                  fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
                  color: "var(--calyx-text-secondary)",
                  letterSpacing: "0.03em",
                  marginBottom: aliasNames.length > 0 ? "0.6rem" : "0",
                }}
              >
                {species.scientific_name}
              </p>

              {/* Alias names */}
              {aliasNames.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.4rem",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.6rem",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "var(--calyx-text-muted)",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    Also known as
                  </span>
                  {aliasNames.map((name) => (
                    <GlassPill key={name} variant="ghost" size="xs">
                      {name}
                    </GlassPill>
                  ))}
                </div>
              )}
            </div>

            <GlassDivider />

            {/* Description */}
            {species.description && (
              <GlassPanel variant="subtle" padding="md">
                <GlassSectionLabel className="mb-3">About</GlassSectionLabel>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--calyx-text-secondary)",
                    lineHeight: 1.78,
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {species.description}
                </p>
              </GlassPanel>
            )}

            {/* Bloom Season */}
            {species.bloom_season && species.bloom_season.length > 0 && (
              <GlassPanel padding="md">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    marginBottom: "1rem",
                  }}
                >
                  <div
                    className="glass-icon"
                    style={{ width: "36px", height: "36px", flexShrink: 0 }}
                  >
                    <Calendar
                      size={15}
                      style={{ color: "var(--calyx-golden-oat)" }}
                    />
                  </div>
                  <GlassSectionLabel>Bloom Season</GlassSectionLabel>
                </div>
                <div
                  style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}
                >
                  {species.bloom_season.map((season) => (
                    <GlassPill key={season} variant="moss" size="sm">
                      {season}
                    </GlassPill>
                  ))}
                </div>
              </GlassPanel>
            )}

            {/* Care Tips */}
            {species.care_tips && (
              <GlassPanel padding="md">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    marginBottom: "1rem",
                  }}
                >
                  <div
                    className="glass-icon"
                    style={{ width: "36px", height: "36px", flexShrink: 0 }}
                  >
                    <Droplets
                      size={15}
                      style={{ color: "var(--calyx-golden-oat)" }}
                    />
                  </div>
                  <GlassSectionLabel>Care Guide</GlassSectionLabel>
                </div>
                <p
                  style={{
                    fontSize: "0.84rem",
                    color: "var(--calyx-text-secondary)",
                    lineHeight: 1.78,
                    whiteSpace: "pre-line",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {species.care_tips}
                </p>
              </GlassPanel>
            )}

            {/* Quick reference grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.75rem",
              }}
            >
              {/* Sunlight */}
              <GlassPanel variant="subtle" padding="sm">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.6rem",
                    padding: "0.5rem 0",
                  }}
                >
                  <div
                    className="glass-icon"
                    style={{ width: "34px", height: "34px" }}
                  >
                    <Sun
                      size={14}
                      style={{ color: "var(--calyx-golden-oat)" }}
                    />
                  </div>
                  <p
                    style={{
                      fontSize: "0.6rem",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "var(--calyx-text-muted)",
                      fontFamily: "'Inter', sans-serif",
                      textAlign: "center",
                    }}
                  >
                    Sunlight
                  </p>
                  <p
                    style={{
                      fontSize: "0.7rem",
                      color: "var(--calyx-text-secondary)",
                      textAlign: "center",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    See care guide
                  </p>
                </div>
              </GlassPanel>

              {/* Watering */}
              <GlassPanel variant="subtle" padding="sm">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.6rem",
                    padding: "0.5rem 0",
                  }}
                >
                  <div
                    className="glass-icon"
                    style={{ width: "34px", height: "34px" }}
                  >
                    <Droplets
                      size={14}
                      style={{ color: "var(--calyx-golden-oat)" }}
                    />
                  </div>
                  <p
                    style={{
                      fontSize: "0.6rem",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "var(--calyx-text-muted)",
                      fontFamily: "'Inter', sans-serif",
                      textAlign: "center",
                    }}
                  >
                    Watering
                  </p>
                  <p
                    style={{
                      fontSize: "0.7rem",
                      color: "var(--calyx-text-secondary)",
                      textAlign: "center",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    See care guide
                  </p>
                </div>
              </GlassPanel>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
