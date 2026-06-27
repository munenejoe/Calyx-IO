/**
 * CatalogueFilters.tsx — Phase 3B Glass Botanical Filters
 *
 * All controls rebuilt as pure inline-styled glass elements.
 * No external CSS class dependencies (filter-glass-pill, filter-label, etc. removed).
 * Uses only the glass.css base utilities that are guaranteed to exist.
 */
import { Search, X, SlidersHorizontal } from "lucide-react";
import type { FilterOption } from "@/lib/api";

// ── Typography constants ──────────────────────────────────────────────────────
const serif  = "'Cormorant Garamond', Georgia, serif";
const sansUI = "'Inter', sans-serif";

const SORT_OPTIONS = [
  { value: "name",       label: "A – Z"    },
  { value: "popularity", label: "Popular"  },
  { value: "recent",     label: "Recent"   },
];

const COLOR_OPTIONS = [
  { value: "red",    label: "Red",    dot: "#ef4444" },
  { value: "pink",   label: "Pink",   dot: "#f472b6" },
  { value: "white",  label: "White",  dot: "#e8e1d6", border: true },
  { value: "yellow", label: "Yellow", dot: "#facc15" },
  { value: "orange", label: "Orange", dot: "#f97316" },
  { value: "purple", label: "Purple", dot: "#a855f7" },
  { value: "blue",   label: "Blue",   dot: "#3b82f6" },
];

interface CatalogueFiltersProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  selectedColors: string[];
  onColorToggle: (color: string) => void;
  selectedCountry: string;
  onCountryChange: (country: string) => void;
  countries: FilterOption[];
  activeFilterCount: number;
  onClearAll: () => void;
}

// ── Primitive: section label ──────────────────────────────────────────────────
function FilterLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: sansUI,
        fontSize: "0.6rem",
        fontWeight: 500,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: "rgba(242,196,141,0.50)",
        marginBottom: "0.75rem",
      }}
    >
      {children}
    </p>
  );
}

// ── Primitive: glass toggle pill ──────────────────────────────────────────────
function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.4rem",
        padding: "0.3rem 0.85rem",
        borderRadius: "9999px",
        fontFamily: sansUI,
        fontSize: "0.65rem",
        fontWeight: 500,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        cursor: "pointer",
        transition: "all 0.22s ease",
        whiteSpace: "nowrap",
        background: active ? "rgba(242,196,141,0.14)" : "rgba(255,255,255,0.04)",
        border: active
          ? "1px solid rgba(242,196,141,0.30)"
          : "1px solid rgba(255,255,255,0.08)",
        color: active ? "rgba(242,196,141,0.95)" : "rgba(232,225,214,0.50)",
        boxShadow: active
          ? "0 0 12px rgba(242,196,141,0.06), inset 0 1px 0 rgba(255,255,255,0.06)"
          : "inset 0 1px 0 rgba(255,255,255,0.03)",
      }}
    >
      {children}
    </button>
  );
}

export function CatalogueFilters({
  searchValue,
  onSearchChange,
  sortBy,
  onSortChange,
  selectedColors,
  onColorToggle,
  selectedCountry,
  onCountryChange,
  countries,
  activeFilterCount,
  onClearAll,
}: CatalogueFiltersProps) {
  return (
    <div style={{ fontFamily: sansUI }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>

        {/* ── Header ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <SlidersHorizontal
              style={{ width: "14px", height: "14px", color: "rgba(242,196,141,0.55)", flexShrink: 0 }}
            />
            <span style={{ fontFamily: serif, fontSize: "1.15rem", fontWeight: 600, color: "rgba(232,225,214,0.92)", letterSpacing: "0.01em" }}>
              Filters
            </span>
            {activeFilterCount > 0 && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: "1.3rem",
                  height: "1.3rem",
                  padding: "0 0.3rem",
                  borderRadius: "9999px",
                  background: "rgba(242,196,141,0.12)",
                  border: "1px solid rgba(242,196,141,0.24)",
                  color: "rgba(242,196,141,0.90)",
                  fontSize: "0.6rem",
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                }}
              >
                {activeFilterCount}
              </span>
            )}
          </div>

          {activeFilterCount > 0 && (
            <button
              onClick={onClearAll}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "0.62rem",
                fontFamily: sansUI,
                fontWeight: 500,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(242,196,141,0.45)",
                transition: "color 0.2s ease",
                padding: 0,
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = "rgba(242,196,141,0.90)")}
              onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = "rgba(242,196,141,0.45)")}
            >
              <X style={{ width: "11px", height: "11px" }} />
              Clear
            </button>
          )}
        </div>

        {/* ── Search input ── */}
        <div>
          <FilterLabel>Search</FilterLabel>
          <div style={{ position: "relative" }}>
            <Search
              style={{
                position: "absolute",
                left: "0.8rem",
                top: "50%",
                transform: "translateY(-50%)",
                width: "13px",
                height: "13px",
                color: "rgba(255,255,255,0.28)",
                pointerEvents: "none",
              }}
            />
            <input
              type="text"
              value={searchValue}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="Search flowers…"
              style={{
                width: "100%",
                paddingLeft: "2.25rem",
                paddingRight: searchValue ? "2.25rem" : "0.85rem",
                paddingTop: "0.6rem",
                paddingBottom: "0.6rem",
                background: "rgba(14,16,10,0.55)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "10px",
                color: "rgba(232,225,214,0.88)",
                fontSize: "0.82rem",
                fontFamily: sansUI,
                outline: "none",
                transition: "border-color 0.22s ease, box-shadow 0.22s ease",
              }}
              onFocus={e => {
                (e.target as HTMLInputElement).style.borderColor = "rgba(242,196,141,0.22)";
                (e.target as HTMLInputElement).style.boxShadow = "0 0 0 3px rgba(242,196,141,0.05)";
              }}
              onBlur={e => {
                (e.target as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.07)";
                (e.target as HTMLInputElement).style.boxShadow = "none";
              }}
            />
            {searchValue && (
              <button
                onClick={() => onSearchChange("")}
                style={{
                  position: "absolute",
                  right: "0.8rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "rgba(255,255,255,0.40)",
                  padding: 0,
                  display: "flex",
                }}
              >
                <X style={{ width: "13px", height: "13px" }} />
              </button>
            )}
          </div>
        </div>

        {/* ── Sort ── */}
        <div>
          <FilterLabel>Sort By</FilterLabel>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {SORT_OPTIONS.map(opt => (
              <FilterPill
                key={opt.value}
                active={sortBy === opt.value}
                onClick={() => onSortChange(opt.value)}
              >
                {opt.label}
              </FilterPill>
            ))}
          </div>
        </div>

        {/* ── Colour chips ── */}
        <div>
          <FilterLabel>Colour</FilterLabel>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {COLOR_OPTIONS.map(color => {
              const isSelected = selectedColors.includes(color.value);
              return (
                <FilterPill
                  key={color.value}
                  active={isSelected}
                  onClick={() => onColorToggle(color.value)}
                >
                  <span
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background: color.dot,
                      flexShrink: 0,
                      border: (color as any).border ? "1px solid rgba(255,255,255,0.25)" : "none",
                      boxShadow: isSelected ? `0 0 5px ${color.dot}70` : "none",
                    }}
                  />
                  {color.label}
                </FilterPill>
              );
            })}
          </div>
        </div>

        {/* ── Country ── */}
        {countries.length > 0 && (
          <div>
            <FilterLabel>Country</FilterLabel>
            <div style={{ position: "relative" }}>
              <select
                value={selectedCountry}
                onChange={e => onCountryChange(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.6rem 2rem 0.6rem 0.85rem",
                  background: "rgba(14,16,10,0.55)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "10px",
                  color: "rgba(232,225,214,0.80)",
                  fontSize: "0.82rem",
                  fontFamily: sansUI,
                  appearance: "none",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                <option value="">All Countries</option>
                {countries.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
              {/* Chevron */}
              <div
                style={{
                  position: "absolute",
                  right: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                  color: "rgba(242,196,141,0.40)",
                }}
              >
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                  <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
