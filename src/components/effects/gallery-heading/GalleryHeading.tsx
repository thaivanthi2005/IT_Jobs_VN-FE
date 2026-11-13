"use client";

import { useCallback, useMemo } from "react";
import { SandboxEffect, type EffectMode } from "../neuform/SandboxEffect";
import { transformGalleryHeading } from "./transform";
import { GALLERY_FONTS, GALLERY_VARIANTS, type GalleryFont, type GalleryVariantName } from "./variants";

/**
 * Gallery Heading — an oversized headline ringed by twelve 4:3 plates that hold
 * still until the pointer arrives, then orbit.
 *
 * The renderer, ring geometry, tile painters and hover clock are the authored
 * MengTo/threeui source, mounted byte-exact in a sandbox. This component only
 * chooses the variant (palette, field, ink, type) and the theme.
 */

/** Typography rides the live channel: a rebuilt srcDoc would repaint every tile. */
const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));

export const GalleryHeading = ({
  variant = "brand",
  mode = "dark",
  autoHover = true,
  font,
  weight,
  headlineSize,
  hue = 0,
  saturation = 1,
  brightness = 1,
  className = "",
}: {
  variant?: GalleryVariantName;
  mode?: EffectMode;
  /** Keeps the ring orbiting without a pointer. */
  autoHover?: boolean;
  /** Overrides the variant's face. */
  font?: GalleryFont;
  /** Overrides the variant's weight. */
  weight?: "400" | "700";
  /** 0.6 – 1.8, clamped. */
  headlineSize?: number;
  /** Outer-frame grade, applied to the iframe element itself. */
  hue?: number;
  saturation?: number;
  brightness?: number;
  className?: string;
}) => {
  const configuration = GALLERY_VARIANTS[variant] ?? GALLERY_VARIANTS.brand;

  const transform = useCallback(
    (html: string) => transformGalleryHeading(html, mode, configuration),
    [mode, configuration],
  );

  const background = mode === "light" ? "#f4f7fb" : "#000000";

  const title = useMemo(() => `${configuration.title} canvas animation`, [configuration]);

  /* The upstream component posts these three into the document rather than
     rebuilding it, because a rebuild regenerates all twelve 512px tile
     textures. */
  const runtime = useMemo(
    () => ({
      font: GALLERY_FONTS[font ?? configuration.type.font],
      weight: weight ?? configuration.type.weight,
      headlineSize: clamp(headlineSize ?? configuration.type.headlineSize, 0.6, 1.8),
    }),
    [font, weight, headlineSize, configuration],
  );

  return (
    <SandboxEffect
      source="gallery-heading"
      background={background}
      mode={mode}
      transform={transform}
      runtime={runtime}
      trackPointerHover
      autoHover={autoHover}
      hue={hue}
      saturation={saturation}
      brightness={brightness}
      className={className}
      title={title}
    />
  );
};
