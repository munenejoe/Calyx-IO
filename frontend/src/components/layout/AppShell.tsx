import React from "react";
import { HomeNavbar } from "@/components/home/HomeNavbar";
import { cn } from "@/lib/utils";

import { NavbarVisibilityProvider,} from "@/context/NavbarVisibilityContext";

interface AppShellProps {
    children: React.ReactNode;
    className?: string;
    withBackground?: boolean;

    navbarOptions?: {
        alwaysVisibleAtTop?: boolean;
    };
}

/**
 * AppShell
 * --------
 * Single source-of-truth shell for all non-home pages.
 * • Renders HomeNavbar
 * • Applies Evergreen Moss page background via .calyx-page
 * • Sets min-height 100dvh
 * • Exports PageContent and PageHeader as named exports
 */
export function AppShell({
    children,
    className,
    withBackground = true,
    navbarOptions,
}: AppShellProps)
{
  return (
    <NavbarVisibilityProvider
        options={navbarOptions}
    >
        <div
            className={cn(withBackground && "calyx-page", className)}
            style={!withBackground ? { minHeight: "100dvh" } : undefined}
        >
            <HomeNavbar />
            {children}
        </div>
    </NavbarVisibilityProvider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PageContent
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Scrollable body beneath the fixed navbar.
 * Adds the standard 6rem top-padding to clear the floating pill nav.
 */
export function PageContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main
      className={cn(
        "calyx-content",          // padding-top: 6rem; padding-bottom: 4rem (from glass.css)
        "container mx-auto",
        "px-4 md:px-6",
        className
      )}
    >
      {children}
    </main>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PageHeader
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Standardised centred section header used at the top of each page.
 * eyebrow  — small pill/label above the title
 * title    — primary heading (Cormorant Garamond 300)
 * subtitle — secondary body copy
 */
export function PageHeader({
  eyebrow,
  title,
  subtitle,
  className,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("text-center mb-10 md:mb-14 calyx-fade-in", className)}>
      {eyebrow && (
        <div
          className="mb-4"
          style={{
            padding: "0.3rem 1rem",
            fontSize: "0.65rem",
            letterSpacing: "0.2em",
            color: "var(--calyx-golden-oat)",
            textTransform: "uppercase",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 500,
          }}
        >
          {eyebrow}
        </div>
      )}

      <h1
        className="mb-3"
        style={{
          fontFamily: "'Cormorant Garamond', 'Georgia', serif",
          fontWeight: 300,
          fontSize: "clamp(2rem, 5vw, 3.25rem)",
          letterSpacing: "0.02em",
          color: "#F2C48D", // Oat
          lineHeight: 1.15,
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          style={{
            fontSize: "0.875rem",
            color: "rgba(232,225,214,.70)",
            maxWidth: "46ch",
            margin: "0 auto",
            lineHeight: 1.65,
          }}
        >
          {subtitle}
        </p>
      )}
    </header>
  );
}
