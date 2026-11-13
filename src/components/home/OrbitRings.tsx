"use client";

import { useEffect, useState } from "react";
import { subscribeScenePaused } from "@/lib/scene-pause";

/**
 * CSS 3D orbit rings that frame the WebGL orb in the hero.
 *
 * These are real DOM elements with `perspective` + `preserve-3d`, not part of the
 * canvas: the tilt reads as genuine depth, the spin runs on the compositor, and
 * they keep animating even when the renderer is paused or the browser throttles
 * `requestAnimationFrame` on a background tab.
 *
 * Decorative only — `aria-hidden`, and `pointer-events-none` so the search form
 * and the floating badges stay clickable through them.
 */
export const OrbitRings = ({ tilt = 62 }: { tilt?: number }) => {
  const [paused, setPaused] = useState(false);

  useEffect(() => subscribeScenePaused(setPaused), []);

  return (
    <div
      className="orbit-stage pointer-events-none absolute inset-0"
      data-paused={paused ? "true" : "false"}
      aria-hidden="true"
      style={{ "--orbit-tilt-x": `${tilt}deg` } as React.CSSProperties}
    >
      <div className="orbit-rig">
        <div className="orbit-ring orbit-ring--a">
          <span className="orbit-satellite" />
        </div>
        <div className="orbit-ring orbit-ring--b">
          <span className="orbit-satellite" />
        </div>
        <div className="orbit-ring orbit-ring--c">
          <span className="orbit-satellite" />
        </div>
      </div>
    </div>
  );
};
