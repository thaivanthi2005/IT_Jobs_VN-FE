"use client";

import dynamic from "next/dynamic";
import { EffectFrame } from "./EffectFrame";
import type { GalleryFont, GalleryVariantName } from "./gallery-heading/variants";

/**
 * Lazy entry points for the ported effects.
 *
 * Everything here is client-only and code-split: a page that does not use an
 * effect never downloads its host, and the sandboxed document is fetched only
 * once the frame is on screen (see `EffectFrame`).
 */
const GalleryHeadingImpl = dynamic(
  () => import("./gallery-heading/GalleryHeading").then((m) => m.GalleryHeading),
  { ssr: false, loading: () => null },
);

const ConstellationFieldImpl = dynamic(
  () => import("./constellation-field/ConstellationField").then((m) => m.ConstellationField),
  { ssr: false, loading: () => null },
);

export const GalleryHeading = ({
  variant = "brand",
  ratio = "16 / 8",
  label,
  className = "",
  minHeight,
  mode,
  autoHover = true,
  hint,
  font,
  weight,
  headlineSize,
  hue = 0,
  saturation = 1,
  brightness = 1,
}: {
  variant?: GalleryVariantName;
  ratio?: string | null;
  label?: string;
  className?: string;
  minHeight?: number;
  /** Forces a theme instead of following the site toggle. */
  mode?: "light" | "dark";
  /** Keeps the ring orbiting without a pointer. */
  autoHover?: boolean;
  /** Short call to action drawn over the effect. */
  hint?: string;
  /** Overrides the variant's face. */
  font?: GalleryFont;
  /** Overrides the variant's weight. */
  weight?: "400" | "700";
  /** 0.6 – 1.8, clamped by the document. */
  headlineSize?: number;
  /** Outer-frame grade, applied to the iframe element. */
  hue?: number;
  saturation?: number;
  brightness?: number;
}) => (
  <EffectFrame
    label={label}
    ratio={ratio ?? undefined}
    className={className}
    minHeight={minHeight}
    mode={mode}
    hint={hint}
  >
    {(resolved) => (
      <GalleryHeadingImpl
        variant={variant}
        mode={resolved}
        autoHover={autoHover}
        font={font}
        weight={weight}
        headlineSize={headlineSize}
        hue={hue}
        saturation={saturation}
        brightness={brightness}
      />
    )}
  </EffectFrame>
);

export const ConstellationField = ({
  variant = "constellation-field",
  ratio = "16 / 9",
  label,
  className = "",
  minHeight,
  mode,
}: {
  variant?:
    | "constellation-field"
    | "particle-drift"
    | "particle-network"
    | "gateway-flow"
    | "connectivity-graph"
    | "interface-lines"
    | "defense-lines"
    | "topo-field";
  ratio?: string | null;
  label?: string;
  className?: string;
  minHeight?: number;
  /** Forces a theme instead of following the site toggle. */
  mode?: "light" | "dark";
}) => (
  <EffectFrame
    label={label}
    ratio={ratio ?? undefined}
    className={className}
    minHeight={minHeight}
    mode={mode}
  >
    {(resolved) => <ConstellationFieldImpl variant={variant} mode={resolved} />}
  </EffectFrame>
);
