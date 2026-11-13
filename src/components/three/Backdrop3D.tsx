"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { TechSceneVariant } from "./tech-scene";

/**
 * Lazy, SSR-safe wrapper around the three.js scene.
 *
 * The scene is client-only (`ssr: false`), so the server HTML ships just the
 * gradient backdrop and the page never pays for three.js in the initial bundle.
 * When WebGL is unavailable the canvas is skipped entirely and the gradient
 * stays as the final artwork.
 */
const TechScene = dynamic(() => import("./tech-scene"), {
  ssr: false,
  loading: () => null,
});

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl2") || canvas.getContext("webgl")),
    );
  } catch {
    return false;
  }
}

export const Backdrop3D = ({
  variant = "hero",
  className = "",
}: {
  variant?: TechSceneVariant;
  className?: string;
}) => {
  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-data: reduce)").matches) return;
    setCanRender(supportsWebGL());
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {/* Static artwork — always painted, and the final frame without WebGL */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(closest-side, rgba(14,165,233,0.30) 0%, rgba(14,165,233,0.12) 45%, transparent 78%)",
        }}
      />

      {canRender ? (
        <div className="absolute inset-0 animate-fade-in">
          <TechScene variant={variant} />
        </div>
      ) : null}
    </div>
  );
};
