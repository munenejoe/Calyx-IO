import { Leaf } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { SpeciesDetail as SpeciesDetailType } from "@/lib/api";
import "@/styles/species-gallery.css";

interface ImageMeta {
    width: number;
    height: number;
    ratio: number;
    loaded: boolean;
}

interface GalleryImage {
    src: string;
    meta: ImageMeta;
    index: number;
}

interface SpeciesGalleryProps {
    species: SpeciesDetailType;
}

export default function SpeciesGallery({
    species,
}: SpeciesGalleryProps) {

    const galleryRef = useRef<HTMLDivElement>(null);

    const [imageMeta, setImageMeta] =
        useState<Record<number, ImageMeta>>({});

    const galleryImages = Array.isArray(species.gallery_images)
    ? species.gallery_images
        .map(img => img?.image_url)
        .filter(Boolean)
    : species.primary_image_url
        ? [species.primary_image_url]
        : [];;

    useEffect(() => {

        galleryImages.forEach((src, index) => {

            if (imageMeta[index]) return;

            const img = new Image();

            img.onload = () => {

                setImageMeta(prev => ({
                    ...prev,
                    [index]: {
                        width: img.naturalWidth,
                        height: img.naturalHeight,
                        ratio: img.naturalWidth / img.naturalHeight,
                        loaded: true,
                    },
                }));

            };

            img.src = src;

        });

    }, [galleryImages]);

    const loadedImages = galleryImages
        .map((src, index) => {
            const meta = imageMeta[index];

            if (!meta?.loaded) return null;

            return {
                src,
                meta,
                index,
            };
        })
        .filter(Boolean) as GalleryImage[];

    const hero = loadedImages[0];
    const images = loadedImages.slice(1);

    // ----------------------------------------------------------
    // Right Gallery Layout
    // ----------------------------------------------------------

    const imageCount = images.length;

    const columns =
        imageCount <= 2
            ? 1
            : imageCount <= 6
            ? 2
            : 3;

    const rows = Math.max(
        1,
        Math.ceil(imageCount / columns)
    );

    const gap = 16;

    const tileStyle = {

        height: `calc((100% - ${(rows - 1) * gap}px) / ${rows})`,

    };

    const isMobile = window.innerWidth <= 900;

    // ----------------------------------------------------------
    // Render
    // ----------------------------------------------------------

    return (
        <>
            <div
                style={{
                    height: "100%",
                    overflow: "hidden",
                }}
            >
                <div
                    ref={galleryRef}
                    className="species-gallery"
                >
                    {galleryImages.length > 0 ? (
                        <div className="editorial-gallery">

                            {hero && (

                                <div className="gallery-left">

                                    <div
                                        className="calyx-gallery-cell gallery-hero"
                                    >

                                        <img
                                            src={hero.src}
                                            alt=""
                                            className="calyx-gallery-img"
                                            width={hero.meta.width}
                                            height={hero.meta.height}
                                            loading="eager"
                                            decoding="async"
                                        />

                                        <div className="calyx-gallery-sheen"/>

                                    </div>

                                </div>

                            )}

                            <div
                                className="gallery-right"
                                style={
                                    {
                                        "--cols": columns,
                                    } as React.CSSProperties
                                }
                            >

                                {images.map(image => (

                                    <div
                                        key={image.index}
                                        className="gallery-tile"
                                        style={
                                            isMobile
                                                ? undefined
                                                : {
                                                    aspectRatio: `${image.meta.width} / ${image.meta.height}`,
                                                }
                                        }
                                    >

                                        <img
                                            src={image.src}
                                            alt=""
                                            className="calyx-gallery-img"
                                            width={image.meta.width}
                                            height={image.meta.height}
                                            loading="lazy"
                                            decoding="async"
                                        />

                                        <div className="calyx-gallery-sheen"/>

                                    </div>

                                ))}

                            </div>

                        </div>
                    ) : (
                        <div
                            className="calyx-gallery-empty"
                        >
                            <Leaf
                                size={56}
                                style={{
                                    opacity: 0.3,
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}