import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { GlassPill } from "./GlassPill";
import { getCatalogue, type CatalogueItem } from "@/lib/api";

function SpecimenCard({
  specimen,
  index,
}: 
{
  specimen: CatalogueItem;
  index: number;
}) 
{
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 1,
        delay: (index % 3) * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Link to={`/species/${specimen.id}`}>
        <motion.div
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          className="relative overflow-hidden cursor-pointer group"
          style={{
            borderRadius: "2px",
            border: "1px solid rgba(242,196,141,0.07)",
            background: "rgba(255,255,255,0.02)",
          }}
          animate={{
            borderColor: hovered
              ? "rgba(242,196,141,0.18)"
              : "rgba(242,196,141,0.07)",
          }}
          transition={{ duration: 0.4 }}
        >
          {/* Colour swatch top strip */}
          <motion.div
            className="h-1 w-full"
            style={{ background: specimen.traits?.color_primary?.[0] ??
                  specimen.colors?.[0] ??
                  "#C4687A" }}
            animate={{ scaleX: hovered ? 1 : 0.4, originX: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Content */}
          <div className="p-7">
            {/* Rarity badge */}
            <div className="flex items-center justify-between mb-6">
              <span
                style={{
                  fontSize: "0.58rem",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "rgba(242,196,141,0.28)",
                }}
              >
                Catalogue
              </span>
              <span
                style={{
                  fontSize: "0.58rem",
                  letterSpacing: "0.2em",
                  color: "rgba(255,255,255,0.2)",
                }}
              >
                {specimen.search_count
                    ? `${specimen.search_count} views`
                    : "Specimen"}
              </span>
            </div>

            {/* Bloom circle — abstract petal representation */}
            <motion.div
              className="relative mx-auto mb-7"
              style={{ width: 90, height: 90 }}
              animate={{ scale: hovered ? 1.08 : 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Petal petals radially arranged */}
                {Array.from({ length: 8 }).map((_, i) => {
                  const angle = (i * Math.PI * 2) / 8;
                  const cx = 50 + Math.cos(angle) * 22;
                  const cy = 50 + Math.sin(angle) * 22;
                  return (
                    <ellipse
                      key={i}
                      cx={cx}
                      cy={cy}
                      rx={10}
                      ry={16}
                      transform={`rotate(${(i * 360) / 8}, ${cx}, ${cy})`}
                      fill={specimen.traits?.color_primary?.[0] ??
                            specimen.colors?.[0] ??
                            "#C4687A"}
                      opacity={hovered ? 0.55 : 0.35}
                      style={{ transition: "opacity 0.4s" }}
                    />
                  );
                })}
                {/* Centre */}
                <circle
                  cx={50}
                  cy={50}
                  r={14}
                  fill={specimen.traits?.color_primary?.[0] ??
                        specimen.colors?.[0] ??
                        "#C4687A"}
                  opacity={hovered ? 0.8 : 0.5}
                  style={{ transition: "opacity 0.4s" }}
                />
                <circle
                  cx={50}
                  cy={50}
                  r={7}
                  fill="rgba(13,13,13,0.9)"
                />
              </svg>
            </motion.div>

            {/* Scientific name */}
            <h3
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.05rem",
                fontWeight: 400,
                fontStyle: "italic",
                color: "rgba(242,196,141,0.82)",
                letterSpacing: "0.02em",
                textAlign: "center",
                marginBottom: "0.3rem",
              }}
            >
              {specimen.scientific_name}
            </h3>

            <p
              style={{
                fontSize: "0.7rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.3)",
                textAlign: "center",
                marginBottom: "1.2rem",
              }}
            >
              {specimen.common_names?.[0] ?? "Unknown"}
            </p>

            {/* Origin */}
            <div
              className="flex items-center justify-between pt-5"
              style={{ borderTop: "1px solid rgba(242,196,141,0.06)" }}
            >
              <span
                style={{
                  fontSize: "0.62rem",
                  color: "rgba(255,255,255,0.22)",
                  letterSpacing: "0.08em",
                }}
              >
                {specimen.country}
              </span>
              <motion.span
                animate={{
                  x: hovered ? 3 : 0,
                  color: hovered ? "rgba(242,196,141,0.7)" : "rgba(242,196,141,0.25)",
                }}
                transition={{ duration: 0.3 }}
                style={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.1em",
                }}
              >
                →
              </motion.span>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

export function FloralCatalogueSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const { data, isLoading } = useQuery({
    queryKey: ["homepage-catalogue"],
    queryFn: () =>
      getCatalogue({
        page: 1,
        limit: 6,
      }),
  });

  return (
    <section
    id="catalogue"
      className="home-section relative"
      style={{ background: "#0d0d0d" }}
    >
      {/* Faint decorative rule */}
      <div
        className="absolute top-0 left-8 right-8 h-px md:left-16 md:right-16"
        style={{ background: "rgba(242,196,141,0.06)" }}
      />

        <div className="home-section-inner relative">
        {/* Header */}
        <div
          ref={ref}
            className="
            flex
            flex-col
            md:flex-row
            md:items-end
            md:justify-between
            gap-10
            mb-[clamp(2.5rem,5vh,6rem)]
            "
        >
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8 }}
              style={{
                fontSize: "0.6rem",
                letterSpacing: "0.4em",
                textTransform: "uppercase",
                color: "rgba(242,196,141,0.35)",
                marginBottom: "1.2rem",
              }}
            >
              Catalogue
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)",
                fontWeight: 300,
                letterSpacing: "0.04em",
                color: "rgba(242,196,141,0.9)",
                lineHeight: 1.1,
              }}
            >
              Living specimens
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <GlassPill as="a" href="/catalogue" variant="default" size="md">
              View full catalogue
            </GlassPill>
          </motion.div>
        </div>

        {/* Grid */}
        <div className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            gap-[clamp(1.5rem,2vw,2.5rem)]
            max-w-[1280px]
            mx-auto
            ">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="
                  h-[320px]
                  rounded
                  bg-white/5
                  animate-pulse
                  border
                  border-white/5
                  "
                />
              ))
            : data?.items.map((s, i) => (
                <SpecimenCard
                  key={s.id}
                  specimen={s}
                  index={i}
                />
              ))}
        </div>
      </div>
    </section>
  );
}
