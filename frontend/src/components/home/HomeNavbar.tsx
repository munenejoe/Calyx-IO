import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { GlassPill } from "./GlassPill";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/identify", label: "Identify" },
  { href: "/catalogue", label: "Catalogue" },
  { href: "/search", label: "Search" },
];

export function HomeNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Desktop: floating pill nav */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 hidden md:flex justify-center pt-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className="flex items-center justify-between w-[840px] max-w-[90vw] px-8 py-2 rounded-full transition-all duration-500"
          style={{
            background: scrolled
              ? "rgba(13,13,13,0.85)"
              : "rgba(13,13,13,0.4)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow: scrolled
              ? "0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)"
              : "0 4px 20px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center mr-3">
            <img
              src="/MainLogo.png"
              alt="Calyx Flora"
              className="w-7 h-7 object-contain opacity-90"
            />
          </Link>

          {/* Nav links */}
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                to={link.href}
                className="relative px-4 py-1.5 rounded-full transition-all duration-300"
                style={{
                  fontFamily: "inherit",
                  fontSize: "0.7rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: isActive
                    ? "rgba(242, 196, 141, 1)"
                    : "rgba(255,255,255,0.5)",
                  background: isActive
                    ? "rgba(242, 196, 141, 0.08)"
                    : "transparent",
                }}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: "rgba(242, 196, 141, 0.07)",
                      border: "1px solid rgba(242, 196, 141, 0.15)",
                    }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
              </Link>
            );
          })}

          {/* Favicon/icon right */}
          <div className="ml-3 w-6 h-6 flex items-center justify-center opacity-40">
            <img src="/MainLogo.png" alt="" className="w-4 h-4 object-contain" />
          </div>
        </div>
      </motion.header>

      {/* Mobile: circular trigger */}
      <motion.div
        className="fixed top-4 right-4 z-50 md:hidden"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <button
          onClick={() => setMobileOpen(true)}
          className="w-11 h-11 rounded-full flex items-center justify-center"
          style={{
            background: "rgba(13,13,13,0.7)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <img src="/MainLogo.png" alt="Menu" className="w-5 h-5 object-contain opacity-80" />
        </button>
      </motion.div>

      {/* Mobile: fullscreen glass menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              background: "rgba(8,8,8,0.95)",
              backdropFilter: "blur(40px)",
            }}
          >
            {/* Close */}
            <div className="flex justify-end p-6">
              <button
                onClick={() => setMobileOpen(false)}
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <X className="w-4 h-4 text-white/60" />
              </button>
            </div>

            <div className="flex-1 flex flex-col justify-center px-10 gap-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                >
                  <Link
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "2.5rem",
                      fontWeight: 300,
                      letterSpacing: "0.05em",
                      color: "rgba(242, 196, 141, 0.9)",
                    }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="px-10 pb-12 flex gap-6">
              {["IG", "TW", "FB"].map((s) => (
                <span
                  key={s}
                  className="text-xs tracking-widest"
                  style={{ color: "rgba(242,196,141,0.35)" }}
                >
                  {s}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
