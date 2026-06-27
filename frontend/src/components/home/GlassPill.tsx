import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassPillProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: React.ReactNode;
  variant?: "default" | "primary" | "nav";
  size?: "sm" | "md" | "lg";
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
    sm: "px-4 py-2 text-xs tracking-widest",
    md: "px-7 py-3 text-xs tracking-[0.2em]",
    lg: "px-10 py-4 text-sm tracking-[0.25em]",
  };

  const variantClasses = {
    default: [
      "bg-white/5 border border-white/10",
      "hover:bg-white/10 hover:border-white/20",
      "text-[#F2C48D]/80 hover:text-[#F2C48D]",
    ].join(" "),
    primary: [
      "bg-[#F2C48D]/10 border border-[#F2C48D]/25",
      "hover:bg-[#F2C48D]/20 hover:border-[#F2C48D]/40",
      "text-[#F2C48D]",
    ].join(" "),
    nav: [
      "bg-white/[0.04] border border-white/[0.08]",
      "hover:bg-white/[0.08] hover:border-white/[0.15]",
      "text-white/60 hover:text-white/90",
    ].join(" "),
  };

  const baseClasses = cn(
    "relative rounded-full uppercase font-light cursor-pointer",
    "backdrop-blur-xl transition-all duration-500",
    "shadow-[0_0_0_0.5px_rgba(255,255,255,0.05),inset_0_1px_0_rgba(255,255,255,0.08)]",
    "hover:shadow-[0_0_20px_rgba(242,196,141,0.08),inset_0_1px_0_rgba(255,255,255,0.12)]",
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
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}
