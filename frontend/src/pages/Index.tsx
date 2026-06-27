/**
 * Index.tsx — CALYX FLORA design system reference page.
 * 
 * This file is a standalone placeholder (not currently registered as a route
 * in App.tsx — the "/" route is handled by Home.tsx). It has been brought into
 * the CALYX FLORA design language as a future-ready branded page.
 *
 * No routing logic was changed. App.tsx is untouched.
 */

import { Link } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { GlassPill } from "@/components/ui/GlassPill";
import { Leaf, Search, Camera, BookOpen } from "lucide-react";
import "@/styles/theme.css";
import "@/styles/glass.css";

const quickLinks = [
  {
    href: "/identify",
    icon: Camera,
    label: "Identify",
    desc: "Upload a photo and identify any flower instantly.",
  },
  {
    href: "/catalogue",
    icon: BookOpen,
    label: "Catalogue",
    desc: "Browse our curated botanical species archive.",
  },
  {
    href: "/search",
    icon: Search,
    label: "Search",
    desc: "Find flowers by common or scientific name.",
  },
];

const Index = () => {
  return (
    <AppShell>
      <div
        className="mx-auto px-4 md:px-6"
        style={{
          maxWidth: "720px",
          paddingTop: "clamp(7rem, 18vh, 12rem)",
          paddingBottom: "5rem",
          textAlign: "center",
        }}
      >
        {/* ── LOGO MARK ─────────────────────────────────────────── */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: "var(--calyx-moss-15)",
            border: "1px solid var(--calyx-border-moss)",
            marginBottom: "1.75rem",
          }}
        >
          <Leaf size={24} style={{ color: "var(--calyx-golden-oat)" }} />
        </div>

        {/* ── EYEBROW ───────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "1.25rem",
          }}
        >
          <GlassPill variant="golden" size="xs">
            Calyx Flora
          </GlassPill>
        </div>

        {/* ── HEADLINE ──────────────────────────────────────────── */}
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 300,
            fontSize: "clamp(2.4rem, 6vw, 3.8rem)",
            color: "var(--calyx-muted-cream)",
            lineHeight: 1.1,
            letterSpacing: "0.01em",
            marginBottom: "1rem",
          }}
        >
          A Botanical Archive
          <br />
          <span
            style={{
              fontStyle: "italic",
              color: "var(--calyx-text-secondary)",
            }}
          >
            for the Curious
          </span>
        </h1>

        <p
          style={{
            fontSize: "0.875rem",
            color: "var(--calyx-text-secondary)",
            lineHeight: 1.75,
            maxWidth: "42ch",
            margin: "0 auto 3rem",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Identify, explore, and discover the plant kingdom — powered by
          precision ML and guided by botanical expertise.
        </p>

        {/* ── QUICK LINKS ───────────────────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(190px, 100%), 1fr))",
            gap: "0.75rem",
            textAlign: "left",
            marginBottom: "2.5rem",
          }}
        >
          {quickLinks.map(({ href, icon: Icon, label, desc }) => (
            <Link
              key={href}
              to={href}
              style={{ textDecoration: "none" }}
            >
              <GlassPanel
                variant="subtle"
                padding="md"
                className="h-full"
                style={{
                  transition:
                    "border-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease",
                  cursor: "pointer",
                } as React.CSSProperties}
                onMouseEnter={(e: React.MouseEvent<HTMLElement>) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "var(--calyx-border-golden)";
                  el.style.transform = "translateY(-2px)";
                  el.style.boxShadow =
                    "0 8px 24px rgba(0,0,0,0.3), 0 0 12px rgba(242,196,141,0.05)";
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLElement>) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "";
                  el.style.transform = "";
                  el.style.boxShadow = "";
                }}
              >
                <div
                  className="glass-icon"
                  style={{
                    width: "32px",
                    height: "32px",
                    marginBottom: "0.85rem",
                  }}
                >
                  <Icon
                    size={14}
                    style={{ color: "var(--calyx-golden-oat)" }}
                  />
                </div>
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1.05rem",
                    fontWeight: 400,
                    color: "var(--calyx-muted-cream)",
                    marginBottom: "0.3rem",
                  }}
                >
                  {label}
                </p>
                <p
                  style={{
                    fontSize: "0.72rem",
                    color: "var(--calyx-text-muted)",
                    lineHeight: 1.55,
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {desc}
                </p>
              </GlassPanel>
            </Link>
          ))}
        </div>

        {/* ── PRIMARY CTA ───────────────────────────────────────── */}
        <Link
          to="/"
          className="glass-btn-primary"
          style={{
            padding: "0.85rem 2.25rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.6rem",
            fontSize: "0.68rem",
            textDecoration: "none",
          }}
        >
          <Leaf size={13} />
          Enter Calyx Flora
        </Link>
      </div>
    </AppShell>
  );
};

export default Index;
