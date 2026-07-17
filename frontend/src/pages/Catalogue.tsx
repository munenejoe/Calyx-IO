/**
 * Catalogue.tsx — Phase 3B Luxury Botanical Archive
 *
 * Changes from previous version:
 *  • Replaced <Navbar> with <AppShell> + <PageContent>
 *  • Page header rebuilt with PageHeader (eyebrow pill, display serif title)
 *  • Sidebar upgraded to <GlassPanel variant="subtle"> with sticky position
 *  • Mobile filter toggle rebuilt as glass surface
 *  • Mobile filter panel uses glass-float class
 *  • Error / loading states use CALYX theme colours
 *  • ALL catalogue logic, hooks, and data-fetching are UNCHANGED
 */
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Flower2, SlidersHorizontal, X } from "lucide-react";

import { AppShell, PageContent, PageHeader } from "@/components/layout/AppShell";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { CatalogueCard, CatalogueCardSkeleton } from "@/components/catalogue/CatalogueCard";
import { CatalogueFilters } from "@/components/catalogue/CatalogueFilters";
import { CatalogueEmptyState } from "@/components/catalogue/CatalogueEmptyState";
import { CataloguePagination } from "@/components/catalogue/CataloguePagination";

import { useCatalogueParams } from "@/hooks/useCatalogueParams";
import { useDebounce } from "@/hooks/useDebounce";
import { getCatalogue, getCatalogueFilters } from "@/lib/api";
import { GlassPill } from "@/components/ui/GlassPill";


export default function Catalogue() {
  const { params, setParam, clearAll, activeFilterCount } = useCatalogueParams();

  const [localSearch, setLocalSearch] = useState(params.name);
  const debouncedSearch = useDebounce(localSearch, 300);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    setLocalSearch(params.name);
  }, [params.name]);

  useEffect(() => {
    if (debouncedSearch !== params.name) {
      setParam("name", debouncedSearch);
    }
  }, [debouncedSearch, params.name, setParam]);

  const searchToUse = params.name;

  const { data: filterOptions } = useQuery({
    queryKey: ["catalogue-filters"],
    queryFn: getCatalogueFilters,
    staleTime: 5 * 60 * 1000,
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: [
      "catalogue",
      searchToUse,
      params.colors.join(","),
      params.country,
      params.sortBy,
      params.page,
    ],
    queryFn: () =>
      getCatalogue({
        name: searchToUse || undefined,
        color: params.colors.length > 0 ? params.colors.join(",") : undefined,
        country: params.country || undefined,
        sort_by: params.sortBy,
        page: params.page,
      }),
  });

  const handleColorToggle = (color: string) => {
    const current = params.colors;
    const updated = current.includes(color)
      ? current.filter((c) => c !== color)
      : [...current, color];
    setParam("color", updated);
  };

  const handleSearchChange = (value: string) => setLocalSearch(value);

  const handleClearAll = () => {
    setLocalSearch("");
    clearAll();
  };

  // ── Shared filter props ──────────────────────────────────────────────────
  const filterProps = {
    searchValue: localSearch,
    onSearchChange: handleSearchChange,
    sortBy: params.sortBy,
    onSortChange: (v: string) => setParam("sort_by", v),
    selectedColors: params.colors,
    onColorToggle: handleColorToggle,
    selectedCountry: params.country,
    onCountryChange: (v: string) => setParam("country", v),
    countries: filterOptions?.countries || [],
    activeFilterCount,
    onClearAll: handleClearAll,
  };

  // ── JSX ───────────────────────────────────────────────────────────────────
  return (
    <AppShell>
      <PageContent>

        {/* ── Page header ── */}
        <PageHeader
          eyebrow={
            <GlassPill
              as="div"
              size="xs"
              className="mb-4"
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
                <Flower2 style={{ width: "13px", height: "13px" }} />
                Botanical Archive
              </div>
            </GlassPill>
          }
          title="Flower Catalogue"
          subtitle={
            data
              ? `${data.total.toLocaleString()} specimen${data.total === 1 ? "" : "s"} in the collection`
              : "Exploring the full botanical collection"
          }
        />

        {/* ── Mobile filter toggle ── */}
        <div
          className="lg:hidden"
          style={{ marginBottom: "1.5rem" }}
        >
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0.85rem 1.2rem",
              background: "rgba(14,16,10,0.60)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(242,196,141,0.14)",
              borderRadius: "14px",
              cursor: "pointer",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
              <SlidersHorizontal style={{ width: "15px", height: "15px", color: "rgba(242,196,141,0.65)" }} />
              <span style={{
                fontSize: "0.72rem",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(232,225,214,0.75)",
              }}>
                Filters
              </span>
              {activeFilterCount > 0 && (
                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "1.3rem",
                  height: "1.3rem",
                  borderRadius: "9999px",
                  background: "rgba(242,196,141,0.14)",
                  border: "1px solid rgba(242,196,141,0.26)",
                  color: "rgba(242,196,141,0.90)",
                  fontSize: "0.58rem",
                  fontWeight: 600,
                }}>
                  {activeFilterCount}
                </span>
              )}
            </div>
            <X
              style={{
                width: "14px",
                height: "14px",
                color: "rgba(232,225,214,0.40)",
                transform: mobileFiltersOpen ? "rotate(0deg)" : "rotate(45deg)",
                transition: "transform 0.2s ease",
              }}
            />
          </button>
        </div>

        {/* ── Body layout: sidebar + main ── */}
        <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>

          {/* Desktop sidebar */}
          <aside
            className="hidden lg:block"
            style={{ width: "272px", flexShrink: 0 }}
          >
            <div style={{ position: "sticky", top: "5.5rem" }}>
              <GlassPanel variant="subtle" padding="md">
                <CatalogueFilters {...filterProps} />
              </GlassPanel>
            </div>
          </aside>

          {/* Mobile filter panel */}
          {mobileFiltersOpen && (
            <div
              className="lg:hidden"
              style={{
                position: "fixed",
                inset: "4.5rem 0 0 0",
                zIndex: 50,
                overflowY: "auto",
                padding: "1rem",
                background: "rgba(11,12,8,0.92)",
                backdropFilter: "blur(28px)",
                WebkitBackdropFilter: "blur(28px)",
              }}
            >
              <GlassPanel variant="default" padding="md">
                <CatalogueFilters {...filterProps} />
              </GlassPanel>
              <div style={{ height: "1rem" }} />
              <button
                onClick={() => setMobileFiltersOpen(false)}
                style={{
                  width: "100%",
                  padding: "0.85rem",
                  borderRadius: "12px",
                  background: "rgba(242,196,141,0.10)",
                  border: "1px solid rgba(242,196,141,0.22)",
                  color: "rgba(242,196,141,0.85)",
                  fontSize: "0.7rem",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                Show Results
              </button>
            </div>
          )}

          {/* ── Main content ── */}
          <main style={{ flex: 1, minWidth: 0 }}>
            {isLoading ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                  gap: "1.75rem",
                }}
              >
                {Array.from({ length: 9 }).map((_, i) => (
                  <CatalogueCardSkeleton key={i} />
                ))}
              </div>
            ) : isError ? (
              <div
                style={{
                  padding: "4rem 2rem",
                  textAlign: "center",
                  background: "rgba(134,58,24,0.08)",
                  border: "1px solid rgba(134,58,24,0.20)",
                  borderRadius: "20px",
                }}
              >
                <p style={{ color: "rgba(232,225,214,0.55)", marginBottom: "1.5rem", fontSize: "0.875rem" }}>
                  Something went wrong loading the catalogue.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  style={{
                    padding: "0.55rem 1.5rem",
                    borderRadius: "9999px",
                    background: "rgba(242,196,141,0.08)",
                    border: "1px solid rgba(242,196,141,0.22)",
                    color: "rgba(242,196,141,0.80)",
                    fontSize: "0.68rem",
                    fontFamily: "'Inter', sans-serif",
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                  }}
                >
                  Try Again
                </button>
              </div>
            ) : data && data.items.length > 0 ? (
              <>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                    gap: "1.75rem",
                  }}
                >
                  {data.items.map((item) => (
                    <CatalogueCard key={item.id} item={item} />
                  ))}
                </div>

                <CataloguePagination
                  currentPage={data.page}
                  totalPages={data.total_pages ?? data.pages ?? 1}
                  onPageChange={(p) => setParam("page", p)}
                />
              </>
            ) : (
              <CatalogueEmptyState
                hasFilters={activeFilterCount > 0}
                onClearFilters={handleClearAll}
              />
            )}
          </main>
        </div>
      </PageContent>
    </AppShell>
  );
}
