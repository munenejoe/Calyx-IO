import React, { ElementType } from "react";
import { cn } from "@/lib/utils";

type GlassPanelVariant = "default" | "subtle" | "float" | "error";

interface GlassPanelProps {
  children: React.ReactNode;
  variant?: GlassPanelVariant;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  as?: ElementType;
}

const variantClass: Record<GlassPanelVariant, string> = {
  default: "glass-panel",
  subtle:  "glass-panel-subtle",
  float:   "glass-float",
  error:   "glass-error",
};

const paddingClass = {
  none: "",
  sm:   "p-4",
  md:   "p-5 md:p-6",
  lg:   "p-6 md:p-8",
};

/**
 * GlassPanel — Luxury botanical glass surface.
 * The workhorse container for all non-home page content.
 * Use variant="subtle" for sidebars and secondary surfaces.
 */
export function GlassPanel({
  children,
  variant = "default",
  className,
  padding = "md",
  as: Tag = "div",
}: GlassPanelProps) {
  return (
    <Tag
      className={cn(
        variantClass[variant],
        paddingClass[padding],
        className
      )}
    >
      {children}
    </Tag>
  );
}

/** Thin horizontal rule with a Golden Oat gradient */
export function GlassDivider({ 
  className, 
  style 
}: { 
  className?: string; 
  style?: React.CSSProperties 
}) {
  return <hr className={cn("glass-divider", className)} style={style} />;
}

/** Section label with small Golden Oat accent line above */
export function GlassSectionLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("glass-section-accent", className)}>
      <p
        style={{
          fontSize: "0.65rem",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "var(--calyx-text-accent-dim)",
          fontFamily: "'Inter', sans-serif",
          fontWeight: 500,
        }}
      >
        {children}
      </p>
    </div>
  );
}
