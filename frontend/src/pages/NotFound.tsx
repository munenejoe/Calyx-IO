import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { HomeNavbar } from "@/components/home/HomeNavbar";
import { GlassPanel, GlassDivider } from "@/components/ui/GlassPanel";
import "@/styles/theme.css";
import "@/styles/glass.css";

const NotFound = () => {
  // ── ALL LOGIC UNCHANGED ─────────────────────────────────────────────
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);
  // ── END LOGIC ───────────────────────────────────────────────────────

  return (
    <div
      style={{
        minHeight: "100dvh",
        position: "relative",
        overflow: "hidden",
        /*
         * Evergreen Moss atmosphere:
         * Strong moss radial at center-top, rustic warmth at bottom,
         * Midnight Ash base keeps it premium not garish.
         */
        background: `
          radial-gradient(ellipse 100% 70% at 50% -10%, rgba(81, 89, 50, 0.38) 0%, transparent 65%),
          radial-gradient(ellipse 80% 50% at 20% 110%, rgba(89, 56, 37, 0.22) 0%, transparent 60%),
          radial-gradient(ellipse 60% 40% at 80% 90%, rgba(134, 58, 24, 0.12) 0%, transparent 55%),
          #0B0C08
        `,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* HomeNavbar — shared luxury navigation */}
      <HomeNavbar />

      {/* Subtle decorative grain overlay */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")",
          pointerEvents: "none",
          opacity: 0.4,
        }}
      />

      {/* ── CENTERED CARD ─────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem 1.5rem",
          paddingTop: "9rem",
          paddingBottom: "5rem",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div style={{ maxWidth: "440px", width: "100%" }}>
          <GlassPanel variant="float" padding="lg">
            {/* Archive label */}
            <p
              style={{
                fontSize: "0.55rem",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "rgba(242, 196, 141, 0.35)",
                fontFamily: "'Inter', sans-serif",
                marginBottom: "1.5rem",
                textAlign: "center",
              }}
            >
              Calyx Flora — Archive
            </p>

            {/* 404 — Rustwood heading, large Cormorant */}
            <div style={{ textAlign: "center", marginBottom: "0.5rem" }}>
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 300,
                  fontSize: "clamp(5rem, 16vw, 8rem)",
                  color: "#863A18",            /* Rustwood — exact brand hex */
                  lineHeight: 0.9,
                  letterSpacing: "-0.02em",
                  display: "block",
                  opacity: 0.88,
                }}
              >
                404
              </span>
            </div>

            <GlassDivider style={{ margin: "1.25rem 0" } as React.CSSProperties} />

            {/* Message — Muted Cream */}
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 300,
                  fontSize: "1.4rem",
                  color: "var(--calyx-muted-cream)",
                  marginBottom: "0.65rem",
                  letterSpacing: "0.02em",
                }}
              >
                Page Not Found
              </h2>
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "var(--calyx-text-secondary)",
                  lineHeight: 1.7,
                  fontFamily: "'Inter', sans-serif",
                  maxWidth: "32ch",
                  margin: "0 auto",
                }}
              >
                The specimen you're looking for doesn't exist in our botanical
                archive. The path{" "}
                <code
                  style={{
                    fontFamily: "monospace",
                    fontSize: "0.72rem",
                    color: "var(--calyx-text-accent-dim)",
                    background: "rgba(242,196,141,0.06)",
                    padding: "0.1rem 0.35rem",
                    borderRadius: "4px",
                    border: "1px solid rgba(242,196,141,0.12)",
                  }}
                >
                  {location.pathname}
                </code>{" "}
                may have been moved or removed.
              </p>
            </div>

            {/* Return Home — Golden Oat glass button */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Link
                to="/"
                className="glass-btn-primary"
                style={{
                  padding: "0.8rem 2.25rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  fontSize: "0.68rem",
                  textDecoration: "none",
                }}
              >
                Return Home
              </Link>
            </div>
          </GlassPanel>

          {/* Sub-links */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1.75rem",
              marginTop: "1.5rem",
            }}
          >
            {[
              { to: "/identify", label: "Identify" },
              { to: "/catalogue", label: "Catalogue" },
              { to: "/search", label: "Search" },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                style={{
                  fontSize: "0.6rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--calyx-text-muted)",
                  textDecoration: "none",
                  fontFamily: "'Inter', sans-serif",
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
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
