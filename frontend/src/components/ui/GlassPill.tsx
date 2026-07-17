import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassPillProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: React.ReactNode;
  variant?: "default" | "primary" | "nav";
  size?: "sm" | "md" | "lg" | "xs";
  as?: "button" | "div" | "a";
  href?: string;
  onClick?: () => void;
  className?: string;
}

export function GlassPill({
  children,
  variant = "default",
  size = "md",
  as = "button",
  href,
  onClick,
  className,
  ...props
}: GlassPillProps) {
  const sizeClasses = {
    xs: "px-2.5 py-1 text-[10px] tracking-[0.18em]",
    sm: "px-4 py-2 text-xs tracking-widest",
    md: "px-6 py-3 text-xs tracking-[0.2em]",
    lg: "px-10 py-4 text-sm tracking-[0.25em]",
  };

  const variantClasses = {
    default: "text-white/80",
    primary: "text-white",
    nav: "text-white/70",
  };

  const baseClasses = cn(
    "glass-pill",
    "relative",
    "inline-flex",
    "items-center",
    "justify-center",
    sizeClasses[size],
    variantClasses[variant],
    className
  );

  if (as === "a" && href) {
    return (
      <motion.a
        href={href}
        className={baseClasses}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </motion.a>
    );
  }

  return (
  <motion.button
    onClick={onClick}
    className={baseClasses}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    transition={{ duration: 0.2 }}
    {...props}
  >

    <span
      className="relative z-10"
    >
      {children}
    </span>
  </motion.button>
  );
}
