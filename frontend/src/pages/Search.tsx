/**
 * Search.tsx — Phase 3B Premium Botanical Search
 *
 * Changes: AppShell wrapper, improved visual hierarchy, glass search surface,
 * specimen-style result cards. All search logic / hooks / API calls unchanged.
 */
import { useState, useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search as SearchIcon, X, Loader2, ChevronRight, Leaf } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { searchFlowers, type SearchResult } from "@/lib/api";
import { AppShell, PageContent, PageHeader } from "@/components/layout/AppShell";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { GlassPill } from "@/components/ui/GlassPill";

// Colors from CALYX design tokens for inline styles in this file
const COLORS = {
  moss: "#515932",
  rustwood: "#863A18",
  oat: "#F2C48D",
  parchment: "#E8E1D6",
};

// ── Typography tokens ─────────────────────────────────────────────────────────
const serif  = "'Cormorant Garamond', Georgia, serif";
const sansUI = "'Inter', sans-serif";

// ── Specimen result card ──────────────────────────────────────────────────────
function SpecimenCard({ result }: { result: SearchResult }) {
  const [hovered, setHovered] = useState(false);
  const displayName = result.common_names?.[0] || result.scientific_name;

  return (
    <Link
      to={`/species/${result.id}`}
      style={{ display: "block", textDecoration: "none" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          background:
            hovered
              ? "rgba(81,89,50,0.75)"
              : "rgba(81,89,50,0.55)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: hovered
              ? "1px solid rgba(242,196,141,0.25)"
              : "1px solid rgba(242,196,141,0.10)",
          borderRadius: "16px",
          overflow: "hidden",
          transform: hovered ? "translateY(-4px)" : "translateY(0)",
          boxShadow: hovered
              ? "0 18px 42px rgba(0,0,0,.35)"
              : "0 6px 20px rgba(0,0,0,.18)",
          transition: "all 0.30s cubic-bezier(0.25,0.46,0.45,0.94)",
        }}
      >
        {/* Image */}
        <div style={{ aspectRatio: "4/3", overflow: "hidden", background: "rgba(255,255,255,0.03)" }}>
          {result.primary_image_url ? (
            <img
              src={result.primary_image_url}
              alt={displayName}
              loading="lazy"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: hovered ? "scale(1.04)" : "scale(1)",
                transition: "transform 0.5s ease",
                display: "block",
              }}
            />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Leaf style={{ width: "32px", height: "32px", color: "rgba(242,196,141,0.20)" }} />
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: "0.9rem 1.1rem 1rem" }}>
          <h3 style={{
            fontFamily: serif,
            fontSize: "1.08rem",
            fontWeight: 600,
            color: COLORS.oat,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            marginBottom: "0.2rem",
          }}>
            {displayName}
          </h3>
          <p style={{
            fontFamily: serif,
            fontSize: "0.8rem",
            fontStyle: "italic",
            fontWeight: 300,
            color: "rgba(242,196,141,0.7)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}>
            {result.scientific_name}
          </p>

          {/* CTA row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", marginTop: "0.7rem" }}>
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.25rem",
              fontSize: "0.62rem",
              fontFamily: sansUI,
              fontWeight: 500,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: 
                hovered 
                  ? COLORS.oat 
                  : "rgba(242,196,141,0.7)",
              transition: "color 0.2s ease",
            }}>
              View Record
              <ChevronRight style={{ width: "11px", height: "11px" }} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── Empty / idle state ────────────────────────────────────────────────────────
function SearchPlaceholder({ hasSearched }: { hasSearched: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "5rem 1rem", textAlign: "center" }}>
      <div style={{
        width: "64px", height: "64px", borderRadius: "50%",
        background: "rgba(242,196,141,0.06)",
        border: "1px solid rgba(242,196,141,0.12)",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: "1.5rem",
      }}>
        {hasSearched
          ? <X style={{ width: "26px", height: "26px", color: "rgba(242,196,141,0.45)" }} />
          : <SearchIcon style={{ width: "26px", height: "26px", color: "rgba(242,196,141,0.45)" }} />
        }
      </div>

      <h3 style={{
        fontFamily: serif,
        fontSize: "clamp(1.4rem, 3vw, 1.8rem)",
        fontWeight: 300,
        color: "rgba(232,225,214,0.75)",
        letterSpacing: "0.02em",
        marginBottom: "0.75rem",
      }}>
        {hasSearched ? "No specimens found" : "Begin your search"}
      </h3>
      <p style={{
        fontSize: "0.825rem",
        color: "rgba(232,225,214,0.35)",
        fontFamily: sansUI,
        maxWidth: "36ch",
        lineHeight: 1.7,
      }}>
        {hasSearched
          ? "No flowers matched that query. Try a different name or scientific term."
          : "Search by common name, scientific name, or colour family."}
      </p>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Search() {
  const [searchParams] = useSearchParams();
  const initialQuery   = searchParams.get("q") || "";

  const [results, setResults]         = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading]     = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentQuery, setCurrentQuery] = useState(initialQuery);
  const [inputValue, setInputValue]   = useState(initialQuery);

  // Suggestions
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debouncedInput = useDebounce(inputValue, 280);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initial query from URL
  useEffect(() => {
    if (initialQuery) performSearch(initialQuery);
  }, [initialQuery]);

  // Suggestion fetch
  useEffect(() => {
    if (debouncedInput.length >= 2 && !hasSearched) {
      searchFlowers(debouncedInput, 5)
        .then(r => { setSuggestions(r); setShowSuggestions(r.length > 0); })
        .catch(() => setSuggestions([]));
    } else {
      setSuggestions([]); setShowSuggestions(false);
    }
  }, [debouncedInput, hasSearched]);

  const performSearch = async (query: string) => {
    if (!query.trim()) return;
    setIsLoading(true);
    setHasSearched(true);
    setCurrentQuery(query);
    setShowSuggestions(false);
    try {
      const res = await searchFlowers(query);
      setResults(res);
    } catch {
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) performSearch(inputValue.trim());
  };

  const clearSearch = () => {
    setInputValue("");
    setResults([]);
    setHasSearched(false);
    setCurrentQuery("");
    setSuggestions([]);
    inputRef.current?.focus();
  };

  return (
    <AppShell>
      <PageContent>
        {/* ── Header ── */}
        <PageHeader
          eyebrow={
            <GlassPill
              as="div"
              size="xs"
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  fontSize: "0.65rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                  color: "var(--calyx-golden-oat)",
                }}
              >
                <SearchIcon style={{ width: "13px", height: "13px" }} />
                Botanical Search
              </div>
            </GlassPill>
          }
          title="Search Flowers"
          subtitle="Explore by common name, scientific name, or description."
        />

        {/* ── Search bar ── */}
        <div style={{ maxWidth: "640px", margin: "0 auto 3.5rem", position: "relative" }}>
          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 0,
                background: "rgba(81,89,50,0.55)",
                border: "1px solid rgba(242,196,141,0.18)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                borderRadius: "9999px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.05)",
                overflow: "hidden",
              }}
            >
              <SearchIcon style={{
                width: "16px", height: "16px",
                color: "rgba(242,196,141,0.50)",
                flexShrink: 0,
                marginLeft: "1.35rem",
              }} />
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                placeholder="Search flowers by name…"
                style={{
                  flex: 1,
                  padding: "0.9rem 0.75rem 0.9rem 0.65rem",
                  background: "transparent",
                  border: "none",
                  color: "rgba(242,196,141,0.55)",
                  fontSize: "0.9rem",
                  fontFamily: "sansUI",
                  outline: "none",
                }}
              />
              {inputValue && (
                <button
                  type="button"
                  onClick={clearSearch}
                  style={{
                    padding: "0 0.85rem",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "rgba(232,225,214,0.35)",
                    display: "flex",
                    flexShrink: 0,
                  }}
                >
                  <X style={{ width: "14px", height: "14px" }} />
                </button>
              )}
              <button
                type="submit"
                style={{
                  margin: "0.35rem 0.35rem 0.35rem 0",
                  padding: "0.6rem 1.4rem",
                  borderRadius: "9999px",
                  background: "rgba(242,196,141,0.12)", 
                  border: "1px solid rgba(242,196,141,0.24)", 
                  color: "rgba(242,196,141,0.90)",
                  fontSize: "0.68rem",
                  fontFamily: sansUI,
                  fontWeight: 500,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  flexShrink: 0,
                  transition: "background 0.2s ease",
                }}
                onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "rgba(242,196,141,0.20)"}
                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "rgba(242,196,141,0.12)"}
              >
                Search
              </button>
            </div>
          </form>

          {/* Suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 0.6rem)",
                left: 0,
                right: 0,
                zIndex: 50,
                background: "rgba(81,89,50,0.94)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "1px solid rgba(242,196,141,0.16)",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 16px 40px rgba(0,0,0,0.45)",
              }}
            >
              {suggestions.map(s => (
                <Link
                  key={s.id}
                  to={`/species/${s.id}`}
                  style={{ display: "flex", alignItems: "center", gap: "0.9rem", padding: "0.75rem 1.1rem", textDecoration: "none" }}
                  onClick={() => setShowSuggestions(false)}
                >
                  <img
                    src={s.primary_image_url}
                    alt={s.scientific_name}
                    style={{ width: "40px", height: "40px", borderRadius: "8px", objectFit: "cover", flexShrink: 0 }}
                  />
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontFamily: serif, fontSize: "0.95rem", color: "rgba(232,225,214,0.88)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {s.common_names?.[0] || s.scientific_name}
                    </p>
                    <p style={{ fontFamily: serif, fontSize: "0.75rem", fontStyle: "italic", color: "rgba(242,196,141,0.50)" }}>
                      {s.scientific_name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* ── Results ── */}
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {isLoading && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "4rem", gap: "1rem" }}>
              <Loader2 style={{ width: "32px", height: "32px", color: "rgba(242,196,141,0.55)", animation: "spin 1s linear infinite" }} />
              <p style={{ fontSize: "0.8rem", color: "rgba(232,225,214,0.38)", fontFamily: sansUI, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                Searching specimens…
              </p>
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <>
              <div style={{ marginBottom: "2rem" }}>
                <p style={{ fontSize: "0.72rem", fontFamily: sansUI, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(242,196,141,0.45)" }}>
                  {results.length} result{results.length !== 1 ? "s" : ""} for "{currentQuery}"
                </p>
              </div>
              <div style={{
                display: "grid",
                gridTemplateColumns:
                "repeat(auto-fill, minmax(260px, 1fr))",
                gap: "1.75rem",
              }}>
                {results.map(r => <SpecimenCard key={r.id} result={r} />)}
              </div>
            </>
          )}

          {!isLoading && (results.length === 0 || !hasSearched) && (
            <SearchPlaceholder hasSearched={hasSearched && results.length === 0} />
          )}
        </div>
      </PageContent>
    </AppShell>
  );
}
