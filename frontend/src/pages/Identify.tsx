import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Leaf, X, Loader2, Microscope, Sparkles } from "lucide-react";
import { HomeNavbar } from "@/components/home/HomeNavbar";
import { GlassPill } from "@/components/home/GlassPill";
import { identifyFlower } from "@/lib/api";

// ─── Calyx colour tokens ───────────────────────────────────────────────────
const C = {
  moss:     "#515932",
  golden:   "#F2C48D",
  rustwood: "#863A18",
  cedar:    "#593825",
  midnight: "#0d0d0d",
} as const;

// ─── Thin glass panel primitive ───────────────────────────────────────────
function GlassPanel({
  children,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={className}
      style={{
        background: "rgba(61,67,38,0.72)",
        backdropFilter: "blur(24px)",
        border: "1px solid rgba(242,196,141,0.15)",
        boxShadow: `
          0 20px 60px rgba(0,0,0,0.18),
          inset 0 1px 0 rgba(255,255,255,0.05)`,
        borderRadius: "1.5rem",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── Decorative botanical divider ─────────────────────────────────────────
function BotanicalDivider() {
  return (
    <div className="flex items-center gap-4 my-6">
      <div style={{ flex: 1, height: 1, background: "rgba(242,196,141,0.12)" }} />
      <Leaf
        className="w-3 h-3 opacity-30"
        style={{ color: C.golden }}
      />
      <div style={{ flex: 1, height: 1, background: "rgba(242,196,141,0.12)" }} />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────
export default function Identify() {
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview]       = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading]   = useState(false);
  const [error, setError]           = useState<string | null>(null);

  // ── drag handlers ──────────────────────────────────────────────────────
  const handleDrag     = useCallback((e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); }, []);
  const handleDragIn   = useCallback((e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); if (e.dataTransfer.items?.length) setIsDragging(true); }, []);
  const handleDragOut  = useCallback((e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); }, []);
  const handleDrop     = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file?.type.startsWith("image/")) handleFile(file);
  }, []);

  const handleFile = (file: File) => {
    setSelectedFile(file);
    setError(null);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const clearImage = () => { setPreview(null); setSelectedFile(null); setError(null); };

  const handleIdentify = async () => {
    if (!selectedFile) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await identifyFlower(selectedFile);
      navigate("/result", { state: { result, debugImage: preview } });
    } catch (err) {
      setError("Identification failed. Please try another image.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="calyx-identify min-h-screen"
      style={{
        background: `
          radial-gradient(
            ellipse 120% 80% at 50% 0%,
            rgba(134,58,24,0.12) 0%,
            rgba(81,89,50,0.95) 35%,
            #515932 100%
          )`,
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        color: C.golden,
      }}
    >
      <HomeNavbar />

      {/* ── ambient grain overlay ── */}
      <div
        aria-hidden
        style={{
          position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat", opacity: 0.4,
        }}
      />

      {/* ── page content ── */}
      <div className="relative z-10 flex flex-col items-center px-6 pt-40 pb-24">

        {/* header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full mb-6"
            style={{
              background: "rgba(81,89,50,0.25)",
              border: "1px solid rgba(81,89,50,0.5)",
              fontSize: "0.65rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(242,196,141,0.7)",
            }}
          >
            <Microscope className="w-3 h-3" />
            Botanical Laboratory
          </div>

          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2.8rem, 6vw, 5rem)",
              fontWeight: 400,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              color: "#f8f0e5",
              marginBottom: "1rem",
            }}
          >
            Identify a{" "}
            <span
              style={{
                color: C.golden,
                textShadow: `
                  0 0 1px rgba(255,255,255,0.4),
                  0 0 20px rgba(134,58,24,0.25)
                `,
              }}
            >
              Specimen
            </span>
          </h1>
          <p
            style={{
              fontSize: "clamp(0.95rem, 2vw, 1.15rem)",
              color: "rgba(242,196,141,0.55)",
              fontWeight: 300,
              maxWidth: "36ch",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Upload a botanical photograph for precision species recognition.
          </p>
        </motion.div>

        {/* upload container */}
        <motion.div
          className="w-full max-w-2xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <GlassPanel style={{ padding: "2.5rem" }}>

            <AnimatePresence mode="wait">
              {/* ── Preview state ── */}
              {preview ? (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  {/* image */}
                  <div className="relative">
                    <div
                      style={{
                        borderRadius: "1rem",
                        overflow: "hidden",
                        aspectRatio: "4/3",
                        border: "1px solid rgba(242,196,141,0.12)",
                      }}
                    >
                      <img
                        src={preview}
                        alt="Selected specimen"
                        className="w-full h-full object-cover"
                        style={{ filter: "brightness(0.92) saturate(1.1)" }}
                      />
                      {isLoading && (
                        <div
                          className="absolute inset-0 flex flex-col items-center justify-center gap-4"
                          style={{ background: "rgba(13,13,13,0.75)", backdropFilter: "blur(8px)" }}
                        >
                          <Loader2
                            className="w-10 h-10 animate-spin"
                            style={{ color: C.golden }}
                          />
                          <p style={{ color: "rgba(242,196,141,0.8)", fontSize: "0.85rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                            Analysing specimen…
                          </p>
                        </div>
                      )}
                    </div>

                    {/* clear button */}
                    {!isLoading && (
                      <button
                        onClick={clearImage}
                        className="absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
                        style={{
                          background: "rgba(13,13,13,0.9)",
                          border: "1px solid rgba(242,196,141,0.2)",
                          color: "rgba(242,196,141,0.7)",
                        }}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {selectedFile && (
                    <p style={{ textAlign: "center", fontSize: "0.75rem", color: "rgba(242,196,141,0.35)", letterSpacing: "0.06em" }}>
                      {selectedFile.name}
                    </p>
                  )}

                  {error && (
                    <p style={{ textAlign: "center", fontSize: "0.82rem", color: "#e87070" }}>
                      {error}
                    </p>
                  )}

                  <BotanicalDivider />

                  <GlassPill
                    variant="primary"
                    size="lg"
                    onClick={handleIdentify}
                    disabled={isLoading}
                    className="w-full justify-center"
                    style={{ width: "100%", justifyContent: "center" }}
                  >
                    {isLoading ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Identifying…</>
                    ) : (
                      <><Sparkles className="w-4 h-4" /> Identify Specimen</>
                    )}
                  </GlassPill>
                </motion.div>
              ) : (
                /* ── Drop zone state ── */
                <motion.div
                  key="dropzone"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label
                    htmlFor="flower-upload"
                    className="block cursor-pointer"
                    onDragEnter={handleDragIn}
                    onDragLeave={handleDragOut}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <motion.div
                      animate={{
                        borderColor: isDragging
                          ? "rgba(242,196,141,0.5)"
                          : "rgba(242,196,141,0.15)",
                        background: isDragging
                          ? "rgba(81,89,50,0.18)"
                          : "rgba(81,89,50,0.06)",
                      }}
                      transition={{ duration: 0.25 }}
                      style={{
                        border: "1.5px dashed rgba(242,196,141,0.15)",
                        borderRadius: "1.25rem",
                        padding: "4rem 2rem",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "1.5rem",
                        textAlign: "center",
                      }}
                    >
                      {/* icon circle */}
                      <motion.div
                        animate={{ scale: isDragging ? 1.12 : 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        style={{
                          width: 72, height: 72, borderRadius: "50%",
                          background: isDragging
                            ? "rgba(81,89,50,0.45)"
                            : "rgba(81,89,50,0.25)",
                          border: `1px solid ${isDragging ? "rgba(242,196,141,0.35)" : "rgba(242,196,141,0.15)"}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          transition: "background 0.25s, border 0.25s",
                        }}
                      >
                        {isDragging ? (
                          <Leaf className="w-7 h-7" style={{ color: C.golden }} />
                        ) : (
                          <Upload className="w-7 h-7" style={{ color: "rgba(242,196,141,0.7)" }} />
                        )}
                      </motion.div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <p
                          style={{
                            fontSize: "1.2rem",
                            fontWeight: 400,
                            color: isDragging ? C.golden : "rgba(255,255,255,0.8)",
                            letterSpacing: "0.01em",
                            transition: "color 0.25s",
                          }}
                        >
                          {isDragging ? "Release to upload" : "Drop your specimen here"}
                        </p>
                        <p style={{ fontSize: "0.82rem", color: "rgba(242,196,141,0.4)", letterSpacing: "0.04em" }}>
                          or click to browse your files
                        </p>
                      </div>

                      <BotanicalDivider />

                      <p style={{ fontSize: "0.7rem", color: "rgba(242,196,141,0.3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                        JPEG · PNG · WebP · max 5 MB
                      </p>
                    </motion.div>

                    <input
                      id="flower-upload"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleInputChange}
                      className="hidden"
                    />
                  </label>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassPanel>
        </motion.div>

        {/* ── feature hints ── */}
        <motion.div
          className="flex flex-wrap justify-center gap-6 mt-14"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {[
            { icon: "🔬", label: "AI Precision" },
            { icon: "🌿", label: "10 000+ Species" },
            { icon: "📖", label: "Botanical Archive" },
          ].map(({ icon, label }) => (
            <div
              key={label}
              style={{
                display: "flex", alignItems: "center", gap: "0.55rem",
                fontSize: "0.7rem", letterSpacing: "0.12em",
                textTransform: "uppercase", color: C.golden,
              }}
            >
              <span style={{ fontSize: "0.95rem" }}>{icon}</span>
              {label}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
