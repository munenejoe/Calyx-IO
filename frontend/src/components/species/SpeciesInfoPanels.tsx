import { Link } from "react-router-dom";

import { GlassPanel, GlassDivider, GlassSectionLabel } from "@/components/ui/GlassPanel";

import { SpeciesDetail as SpeciesDetailType } from "@/lib/api";

import "@/styles/theme.css";
import "@/styles/glass.css";

interface SpeciesInfoPanelsProps {
    species: SpeciesDetailType;
}

export default function SpeciesInfoPanels({
        species,
    }: SpeciesInfoPanelsProps) 
{

    // ── PRIMARY DISPLAY ────────────────────────────────────────────────────
    const primaryName = species.common_names[0] || species.scientific_name;
    const aliasNames = species.common_names.slice(1);

    const taxonomyRows = [
        { label: "Family", value: species.taxonomy?.family },
        { label: "Order", value: species.taxonomy?.order },
        { label: "Genus", value: species.taxonomy?.genus },
        { label: "Species", value: species.taxonomy?.species },
    ].filter(row => row.value);

    const hasTaxonomy = taxonomyRows.some((row) => row.value);


    return (   
    <>
            
            {/* ── RIGHT: FLOATING GLASS PANEL STACK (30%) ───────────────── */}
            <div
                className="species-info-layout"
                style={{
                    display: "grid",
                    gap: "1rem",
                    alignItems: "stretch",
                    width: "100%",
                }}
            >
                {/* Species */}
                <div className="species-panel">
                    <GlassPanel variant="float" padding="sm">
                        <GlassSectionLabel className="mb-3">Species</GlassSectionLabel>
                        <h1
                        style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontWeight: 500,
                            fontSize: "clamp(1.3rem,1.6vw,1.8rem)",
                            lineHeight: 1.1,
                            letterSpacing: "0.01em",
                            marginBottom: ".35rem",
                        }}
                        >
                        {primaryName}
                        </h1>
                        <p
                        style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontStyle: "italic",
                            fontSize: ".72rem",
                            letterSpacing: "0.03em",
                            opacity: 0.75,
                            marginBottom: ".55rem"
                        }}
                        >
                        {species.scientific_name}
                        </p>

                        {aliasNames.length > 0 && (
                        <>
                                <GlassDivider />

                                <p
                                    style={{
                                        marginTop: ".6rem",
                                        fontSize: ".68rem",
                                        fontFamily: "'Cormorant Garamond', serif",
                                        fontStyle: "italic",
                                        color: "var(--calyx-text-secondary)",
                                        lineHeight: 1.5,
                                        opacity: .8,
                                    }}
                                >
                                    {aliasNames.join(" • ")}
                                </p>
                            </>
                        )}
                        <GlassDivider />
                        <div
                            style={{
                                marginTop: ".8rem",
                                display: "grid",
                                gridTemplateColumns: `repeat(${taxonomyRows.length}, 1fr)`,
                                columnGap: "1rem",
                            }}
                        >
                            {taxonomyRows.map((row) => (
                                <div
                                    key={row.label}
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: ".35rem",
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: ".56rem",
                                            letterSpacing: ".22em",
                                            textTransform: "uppercase",
                                            fontFamily: "'Inter', sans-serif",
                                            opacity: .55,
                                        }}
                                    >
                                        {row.label}
                                    </span>

                                    <span
                                        style={{
                                            fontSize: ".76rem",
                                            fontFamily: "'Cormorant Garamond', serif",
                                            lineHeight: 1.2,
                                        }}
                                    >
                                        {row.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </GlassPanel>
                </div>

                {/* About */}
                {species.description && (
                <div className="species-panel">
                    <GlassPanel variant="float" padding="sm">
                        <GlassSectionLabel className="mb-3">About</GlassSectionLabel>
                        <div
                            style={{
                                paddingRight: "0.25rem",
                            }}
                            >
                            <p
                                style={{
                                    fontSize: ".84rem",
                                    lineHeight: 1.8,
                                    fontFamily: "'Inter', sans-serif",
                                    width: "100%",
                                }}
                            >
                            {species.description}
                            </p>
                        </div>
                    </GlassPanel>
                </div>
                )}
        </div>
    </>
    );
}