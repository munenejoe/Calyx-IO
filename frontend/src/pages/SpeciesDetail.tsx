import { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { getSpeciesDetail, SpeciesDetail as SpeciesDetailType } from "@/lib/api";
import { AppShell } from "@/components/layout/AppShell";

import { AlertCircle } from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { GlassPill } from "@/components/ui/GlassPill";

import SpeciesGallery from "@/components/species/SpeciesGallery";
import SpeciesInfoPanels from "@/components/species/SpeciesInfoPanels";
import { useSharedNavbarVisibility } from "@/context/NavbarVisibilityContext";

import "@/styles/theme.css";
import "@/styles/glass.css";


// ── Component ─────────────────────────────────────────────────────────────

export default function SpeciesDetail() {
  // ── ALL DATA LOGIC UNCHANGED ───────────────────────────────────────────
  const { id } = useParams<{ id: string }>();
  const [species, setSpecies] = useState<SpeciesDetailType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();

  const isSpeciesDetail =
    location.pathname.startsWith("/species/");

  const showNavbar = useSharedNavbarVisibility();

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
      console.log("Species", data);
      setSpecies(data);
    } catch (err) {
      setError("Unable to load species details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── LOADING STATE ──────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <AppShell
          navbarOptions={{
              alwaysVisibleAtTop: false,
          }}
      >
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
                      fontSize: "0.72rem",
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


    return (
      <AppShell>
          <motion.div
              animate={{
                  y: showNavbar ? 0 : -80,
                  opacity: showNavbar ? 1 : 0,
              }}
              transition={{
                  duration: 0.45,
                  ease: "easeOut",
              }}
              style={{
                  position: "fixed",
                  top: "2.8rem",
                  left: "2.5rem",
                  zIndex: 100,
              }}
          >
              <Link
                  to="/search"
                  style={{ textDecoration: "none" }}
              >
                  <GlassPill size="md">
                      <ArrowLeft size={16} />
                  </GlassPill>
              </Link>
          </motion.div>

          <div
              className="species-archive"
          >
              {/* Background gallery */}
              <div className="species-gallery-section">
                  <SpeciesGallery species={species} />
              </div>

              <div className="species-info-section">
                  <SpeciesInfoPanels species={species} />
              </div>
          </div>

          <style>{`
              .species-archive{

              position:relative;

              height:100vh;

              overflow:hidden;

              padding:6.5rem 2.5rem 2rem;

          }

          .species-gallery-section{

              position:absolute;

              inset:0;

              bottom:13vh;

              padding:1.5rem;

          }

          .species-info-section{

              position:absolute;

              left:2.5rem;

              right:2.5rem;

              bottom:.75rem;

              z-index:20;

          }

          /* ------------------------------------------------ */
          /* Tablet + Mobile */
          /* ------------------------------------------------ */

          @media (max-width:1023px){

              .species-archive{

                  height:auto;

                  min-height:100vh;

                  overflow:visible;

                  padding:
                      6.5rem
                      1.25rem
                      2rem;

              }

              .species-gallery-section{

                  position:relative;

                  inset:auto;

                  bottom:auto;

                  padding:0;

                  margin-bottom:2rem;

              }

              .species-info-section{

                  position:relative;

                  left:auto;

                  right:auto;

                  bottom:auto;

              }

          }
          `}</style>
      </AppShell>
  );
}