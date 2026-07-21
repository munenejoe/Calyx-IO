import React, { ElementType } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type GlassPanelVariant = "default" | "subtle" | "float" | "error";

interface GlassPanelProps {
  children: React.ReactNode;
  variant?: GlassPanelVariant;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  as?: ElementType;
  style?: React.CSSProperties;
}

const variantClass: Record<GlassPanelVariant, string> = {
  default: "glass-panel",
  subtle: "glass-panel opacity-80",
  float: "glass-panel glass-panel-float",
  error: "glass-panel glass-panel-error",
};

const paddingClass = {
  none: "",
  sm: "p-4",
  md: "p-5 md:p-6",
  lg: "p-6 md:p-8",
};

export function GlassPanel({
  children,
  variant = "default",
  className,
  padding = "md",
  as: Tag = "div",
}: GlassPanelProps) {

  const MotionTag = motion.create(Tag);

  return (
    <MotionTag
      className={cn(
        "relative overflow-hidden",
        variantClass[variant],
        paddingClass[padding],
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      <div className="glass-panel-highlight" />
      <div className="glass-panel-edge" />

      <div className="relative z-10">
        {children}
      </div>
    </MotionTag>
  );
}

/** Thin horizontal rule with a Golden Oat gradient */
export function GlassDivider({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <hr
      className={cn("glass-divider", className)}
      style={style}
    />
  );
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