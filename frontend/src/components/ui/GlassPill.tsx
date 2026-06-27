import React from "react";
import { cn } from "@/lib/utils";

type GlassPillVariant = "golden" | "moss" | "ghost";
type GlassPillSize    = "xs" | "sm" | "md";

interface GlassPillProps {
  children: React.ReactNode;
  variant?: GlassPillVariant;
  size?: GlassPillSize;
  className?: string;
  onClick?: () => void;
  as?: "span" | "button" | "div";
  active?: boolean;
}

const variantStyles: Record<GlassPillVariant, React.CSSProperties> = {
  golden: {
    background: "rgba(242, 196, 141, 0.08)",
    border: "1px solid rgba(242, 196, 141, 0.18)",
    color: "var(--calyx-golden-oat)",
  },
  moss: {
    background: "rgba(81, 89, 50, 0.14)",
    border: "1px solid rgba(81, 89, 50, 0.32)",
    color: "rgba(232, 225, 214, 0.75)",
  },
  ghost: {
    background: "rgba(255, 255, 255, 0.04)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    color: "rgba(232, 225, 214, 0.55)",
  },
};

const activeStyles: Record<GlassPillVariant, React.CSSProperties> = {
  golden: {
    background: "rgba(242, 196, 141, 0.15)",
    border: "1px solid rgba(242, 196, 141, 0.30)",
    color: "var(--calyx-golden-oat)",
  },
  moss: {
    background: "rgba(81, 89, 50, 0.25)",
    border: "1px solid rgba(81, 89, 50, 0.45)",
    color: "rgba(232, 225, 214, 0.90)",
  },
  ghost: {
    background: "rgba(255, 255, 255, 0.08)",
    border: "1px solid rgba(255, 255, 255, 0.14)",
    color: "rgba(232, 225, 214, 0.80)",
  },
};

const sizeStyles: Record<GlassPillSize, React.CSSProperties> = {
  xs: { padding: "0.2rem 0.7rem", fontSize: "0.6rem", letterSpacing: "0.18em" },
  sm: { padding: "0.3rem 0.9rem", fontSize: "0.65rem", letterSpacing: "0.17em" },
  md: { padding: "0.45rem 1.1rem", fontSize: "0.7rem", letterSpacing: "0.18em" },
};

/**
 * GlassPill — Shared luxury botanical pill for the non-home pages.
 * Lives in /ui/ and is safe to import from any page.
 * (Distinct from src/components/home/GlassPill.tsx which is home-only.)
 */
export function GlassPill({
  children,
  variant = "golden",
  size = "sm",
  className,
  onClick,
  as: Tag = "span",
  active = false,
}: GlassPillProps) {
  const styles: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.4rem",
    borderRadius: "9999px",
    fontFamily: "'Inter', sans-serif",
    fontWeight: 500,
    textTransform: "uppercase",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)",
    cursor: onClick ? "pointer" : "default",
    transition: "background 0.25s ease, border-color 0.25s ease, color 0.25s ease",
    whiteSpace: "nowrap",
    ...(active ? activeStyles[variant] : variantStyles[variant]),
    ...sizeStyles[size],
  };

  return (
    <Tag
      style={styles}
      className={cn(className)}
      onClick={onClick}
    >
      {children}
    </Tag>
  );
}
