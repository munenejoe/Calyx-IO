/**
 * CataloguePagination.tsx — Phase 3B Floating Glass Pill Pagination
 *
 * Pure inline styles. All pagination logic unchanged.
 * Layout: prev arrow · page pills · next arrow — centered, floating glass strip
 */
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CataloguePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const sansUI = "'Inter', sans-serif";

// ── Shared pill base ──────────────────────────────────────────────────────────
const pillBase: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "9999px",
  fontFamily: sansUI,
  fontSize: "0.72rem",
  fontWeight: 500,
  cursor: "pointer",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(14,16,10,0.55)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  color: "rgba(232,225,214,0.55)",
  transition: "all 0.22s ease",
  boxShadow: "0 2px 8px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04)",
};

const pillActive: React.CSSProperties = {
  ...pillBase,
  background: "rgba(242,196,141,0.14)",
  border: "1px solid rgba(242,196,141,0.30)",
  color: "rgba(242,196,141,0.95)",
  boxShadow: "0 0 16px rgba(242,196,141,0.08), inset 0 1px 0 rgba(255,255,255,0.06)",
};

export function CataloguePagination({
  currentPage,
  totalPages,
  onPageChange,
}: CataloguePaginationProps) {
  if (totalPages <= 1) return null;

  const getPages = (): (number | "…")[] => {
    const pages: (number | "…")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("…");
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("…");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.4rem",
        paddingTop: "3rem",
        paddingBottom: "0.5rem",
      }}
    >
      {/* Prev */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Previous page"
        style={{
          ...pillBase,
          width: "2.4rem",
          height: "2.4rem",
          opacity: currentPage <= 1 ? 0.3 : 1,
          cursor: currentPage <= 1 ? "not-allowed" : "pointer",
        }}
        onMouseEnter={e => {
          if (currentPage > 1) {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(242,196,141,0.22)";
            (e.currentTarget as HTMLButtonElement).style.color = "rgba(232,225,214,0.88)";
          }
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.08)";
          (e.currentTarget as HTMLButtonElement).style.color = "rgba(232,225,214,0.55)";
        }}
      >
        <ChevronLeft style={{ width: "15px", height: "15px" }} />
      </button>

      {/* Page numbers */}
      {getPages().map((page, idx) =>
        page === "…" ? (
          <span
            key={`dots-${idx}`}
            style={{
              width: "2rem",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "rgba(232,225,214,0.28)",
              fontSize: "0.8rem",
              letterSpacing: "0.05em",
            }}
          >
            ···
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            aria-current={currentPage === page ? "page" : undefined}
            style={{
              ...(currentPage === page ? pillActive : pillBase),
              width: "2.4rem",
              height: "2.4rem",
            }}
            onMouseEnter={e => {
              if (currentPage !== page) {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(242,196,141,0.20)";
                (e.currentTarget as HTMLButtonElement).style.color = "rgba(232,225,214,0.80)";
              }
            }}
            onMouseLeave={e => {
              if (currentPage !== page) {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.08)";
                (e.currentTarget as HTMLButtonElement).style.color = "rgba(232,225,214,0.55)";
              }
            }}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Next page"
        style={{
          ...pillBase,
          width: "2.4rem",
          height: "2.4rem",
          opacity: currentPage >= totalPages ? 0.3 : 1,
          cursor: currentPage >= totalPages ? "not-allowed" : "pointer",
        }}
        onMouseEnter={e => {
          if (currentPage < totalPages) {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(242,196,141,0.22)";
            (e.currentTarget as HTMLButtonElement).style.color = "rgba(232,225,214,0.88)";
          }
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.08)";
          (e.currentTarget as HTMLButtonElement).style.color = "rgba(232,225,214,0.55)";
        }}
      >
        <ChevronRight style={{ width: "15px", height: "15px" }} />
      </button>
    </div>
  );
}
