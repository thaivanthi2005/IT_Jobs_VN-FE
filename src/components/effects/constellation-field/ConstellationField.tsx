"use client";

import { useCallback } from "react";
import { SandboxEffect, type EffectMode } from "../neuform/SandboxEffect";
import { CONSTELLATION_VARIANTS, type ConstellationVariant } from "./patches";

/**
 * Constellation Field — one of eight particle/gateway/topographic fields.
 *
 * Each variant is a complete authored document in `public/effects/`; only the
 * selected one is mounted, so the inactive variants never allocate a canvas, a
 * WebGL context or an animation loop.
 */
export const ConstellationField = ({
  variant = "constellation-field",
  size = 1,
  length = 1,
  density = 1,
  strokeWidth = 1,
  mode = "dark",
  className = "",
}: {
  variant?: ConstellationVariant;
  size?: number;
  length?: number;
  density?: number;
  strokeWidth?: number;
  mode?: EffectMode;
  className?: string;
}) => {
  const definition = CONSTELLATION_VARIANTS[variant] ?? CONSTELLATION_VARIANTS["constellation-field"];

  const transform = useCallback(
    (html: string) =>
      definition.patch(html, {
        mode,
        speed: 1,
        size,
        length,
        density,
        strokeWidth,
      }),
    [definition, mode, size, length, density, strokeWidth],
  );

  return (
    <SandboxEffect
      source={variant}
      background={definition.background(mode)}
      mode={mode}
      transform={transform}
      className={className}
      title={`${definition.title} canvas animation`}
    />
  );
};
