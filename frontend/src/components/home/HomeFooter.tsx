import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";

const footerLinks = {
  Explore: [
    { label: "Home", href: "/" },
    { label: "Identify", href: "/identify" },
    { label: "Catalogue", href: "/catalogue" },
    { label: "Search", href: "/search" },
  ],
  Intelligence: [
    { label: "How it works", href: "/#process" },
    { label: "Recognition engine", href: "/#recognition" },
    { label: "Accuracy report", href: "#" },
    { label: "Research", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Contact", href: "#" },
  ],
};

const socials = [
  {
    label: "Instagram",
    abbr: "IG",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} className="w-4 h-4">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    label: "X / Twitter",
    abbr: "TW",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "Pinterest",
    abbr: "PT",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
      </svg>
    ),
  },
];

export function HomeFooter() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <footer
      ref={ref}
      className="relative overflow-hidden"
      style={{ background: "#515932" }}
    >
      {/* Top fade from dark */}
      <div
        className="absolute top-0 left-0 right-0 h-24 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, rgba(13,13,13,0.3), transparent)",
        }}
      />

      {/* Noise texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative max-w-screen-xl mx-auto px-8 md:px-16">
        {/* Main footer body */}
        <div className="pt-20 pb-14">
          <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-12 lg:gap-16">
            {/* Brand column */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-6"
            >
              {/* Logo */}
              <div className="flex items-center gap-3">
                <img
                  src="/MainLogo.png"
                  alt="Calyx Flora"
                  className="w-9 h-9 object-contain"
                  style={{ filter: "brightness(0.9) sepia(0.3)" }}
                />
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1.2rem",
                    fontWeight: 400,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "rgba(242,196,141,0.9)",
                  }}
                >
                  Calyx Flora
                </span>
              </div>

              <p
                style={{
                  fontSize: "0.8rem",
                  lineHeight: 1.85,
                  color: "rgba(242,196,141,0.38)",
                  maxWidth: "30ch",
                  letterSpacing: "0.02em",
                }}
              >
                ML-powered botanical recognition. Identify any flower from a
                single photograph. Built for florists, botanists, and the
                quietly curious.
              </p>

              {/* Social icons */}
              <div className="flex items-center gap-4 mt-2">
                {socials.map((s) => (
                  <a
                    key={s.abbr}
                    href={s.href}
                    aria-label={s.label}
                    className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300"
                    style={{
                      border: "1px solid rgba(242,196,141,0.2)",
                      color: "rgba(242,196,141,0.5)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "rgba(242,196,141,0.55)";
                      (e.currentTarget as HTMLElement).style.color =
                        "rgba(242,196,141,0.9)";
                      (e.currentTarget as HTMLElement).style.background =
                        "rgba(242,196,141,0.07)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "rgba(242,196,141,0.2)";
                      (e.currentTarget as HTMLElement).style.color =
                        "rgba(242,196,141,0.5)";
                      (e.currentTarget as HTMLElement).style.background =
                        "transparent";
                    }}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Link columns */}
            {Object.entries(footerLinks).map(([group, links], gi) => (
              <motion.div
                key={group}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 1,
                  delay: 0.1 + gi * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <p
                  style={{
                    fontSize: "0.58rem",
                    letterSpacing: "0.35em",
                    textTransform: "uppercase",
                    color: "rgba(242,196,141,0.35)",
                    marginBottom: "1.5rem",
                  }}
                >
                  {group}
                </p>
                <ul className="flex flex-col gap-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.href}
                        className="transition-colors duration-300"
                        style={{
                          fontSize: "0.8rem",
                          letterSpacing: "0.05em",
                          color: "rgba(242,196,141,0.5)",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.color =
                            "rgba(242,196,141,0.88)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.color =
                            "rgba(242,196,141,0.5)";
                        }}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 py-7"
          style={{ borderTop: "1px solid rgba(242,196,141,0.1)" }}
        >
          <span
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.12em",
              color: "rgba(242,196,141,0.28)",
            }}
          >
            © {new Date().getFullYear()} Calyx Flora. All rights reserved.
          </span>

          <div className="flex items-center gap-2">
            <span
              style={{
                fontSize: "0.6rem",
                letterSpacing: "0.08em",
                color: "rgba(242,196,141,0.2)",
              }}
            >
              Powered by
            </span>
            <span
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "0.75rem",
                letterSpacing: "0.2em",
                color: "rgba(242,196,141,0.35)",
              }}
            >
              ML FLORA ENGINE
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
