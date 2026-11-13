"use client";

import { useEffect, useRef } from "react";
import { subscribeScenePaused } from "@/lib/scene-pause";

/**
 * The ITJobs mark, drawn as a real 3D object on a small canvas.
 *
 * Three flat plates stacked on the Y axis, rotated about Y with a fixed camera
 * tilt — the "layers of opportunity" reading — projected with true perspective
 * maths (`fov / (fov + z)`) rather than CSS transforms, so the plates genuinely
 * slide over one another and their depth decides which one paints last.
 *
 * Why Canvas 2D and not three.js: this canvas is 40 CSS pixels square. A WebGL
 * context per page for ~30 triangles would cost far more than it returns, and the
 * projection here is a dozen multiplications per vertex. It also stays sharp at
 * any DPR and never triggers a shader compile on first paint.
 *
 * Motion is honest about the user's preferences: it slows down for
 * `prefers-reduced-motion` instead of freezing (a still logo read as broken), and
 * it stops entirely while the tab is hidden or a modal dims the page.
 */

type Vec3 = [number, number, number];

const PLATES = [-1.18, 0, 1.18];
const HALF = 1.12;
const FOV = 6.2;

/** Rotate about Y, then tilt about X, then project through a pinhole camera. */
function project(p: Vec3, angleY: number, tiltX: number, scale: number, cx: number, cy: number) {
  const cy1 = Math.cos(angleY);
  const sy1 = Math.sin(angleY);
  const x1 = p[0] * cy1 + p[2] * sy1;
  const z1 = -p[0] * sy1 + p[2] * cy1;

  const cx1 = Math.cos(tiltX);
  const sx1 = Math.sin(tiltX);
  const y2 = p[1] * cx1 - z1 * sx1;
  const z2 = p[1] * sx1 + z1 * cx1;

  const k = FOV / (FOV + z2);

  return { x: cx + x1 * k * scale, y: cy + y2 * k * scale, z: z2, k };
}

/** A quad through four projected corners with softened corners. */
function quadPath(ctx: CanvasRenderingContext2D, pts: { x: number; y: number }[]) {
  const [a, b, c, d] = pts;
  ctx.beginPath();
  ctx.moveTo((a.x + b.x) / 2, (a.y + b.y) / 2);
  for (const [from, to] of [
    [b, c],
    [c, d],
    [d, a],
    [a, b],
  ]) {
    ctx.quadraticCurveTo((from.x + to.x) / 2, (from.y + to.y) / 2, to.x, to.y);
  }
  ctx.closePath();
}

export const LogoMark3D = ({
  size = 40,
  className = "",
}: {
  size?: number;
  className?: string;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(size * dpr);
    canvas.height = Math.round(size * dpr);
    ctx.scale(dpr, dpr);

    const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let muted = reduceQuery.matches;
    const onReduce = () => {
      muted = reduceQuery.matches;
    };
    reduceQuery.addEventListener("change", onReduce);

    let paused = false;
    const unsubscribe = subscribeScenePaused((value) => {
      paused = value;
    });

    const cx = size / 2;
    const cy = size / 2;
    /* 0.225 keeps the tallest plate corner inside the tile across a full turn —
       0.255 clipped the top edge by a pixel, which a round tile shows plainly */
    const scale = size * 0.225;
    const tilt = -0.52;

    let angle = 0.6;
    let raf = 0;
    let last = performance.now();
    /* an independent clock for the secondary motion, so the plates and the spread
       do not cycle together — that is what makes it read as animate rather than
       as a spinning icon */
    let phase = 0;
    let spread = 0;

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const rate = paused || document.hidden ? 0 : muted ? 0.35 : 1;

      angle += dt * 0.55 * rate;
      phase += dt * 0.9 * rate;

      /* the stack breathes: the plates fan open and close on their own beat, so
         the object is never at the same pose twice within a few seconds */
      const targetSpread = 1 + Math.sin(phase) * 0.34;
      spread += (targetSpread - spread) * Math.min(1, dt * 4);

      ctx.clearRect(0, 0, size, size);

      const bloom = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 0.5);
      bloom.addColorStop(0, `rgba(56, 189, 248, ${0.26 + 0.1 * Math.sin(phase * 0.7)})`);
      bloom.addColorStop(1, "rgba(56, 189, 248, 0)");
      ctx.fillStyle = bloom;
      ctx.fillRect(0, 0, size, size);

      const plates = PLATES.map((y) => y * spread);

      const built = plates.map((y, index) => {
        const corners: Vec3[] = [
          [-HALF, y, -HALF],
          [HALF, y, -HALF],
          [HALF, y, HALF],
          [-HALF, y, HALF],
        ];
        const pts = corners.map((p) => project(p, angle, tilt, scale, cx, cy));
        const depth = pts.reduce((sum, p) => sum + p.z, 0) / 4;
        return { index, pts, depth };
      });

      /* far plates first: with no depth buffer, paint order is the depth cue */
      built.sort((a, b) => b.depth - a.depth);

      for (const plate of built) {
        const near = (FOV - plate.depth) / (2 * FOV);
        const alpha = 0.24 + near * 0.62;
        const tint = ["#7DD3FC", "#38BDF8", "#0EA5E9"][plate.index];

        const g = ctx.createLinearGradient(0, 0, size, size);
        g.addColorStop(0, `rgba(125, 211, 252, ${alpha * 0.55})`);
        g.addColorStop(1, `rgba(14, 165, 233, ${alpha * 0.16})`);

        quadPath(ctx, plate.pts);
        ctx.fillStyle = g;
        ctx.fill();

        ctx.strokeStyle = tint;
        ctx.globalAlpha = 0.35 + near * 0.6;
        ctx.lineWidth = 1.15;
        ctx.lineJoin = "round";
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      /* a spine through the stack ties the layers into one object */
      const top = project([0, plates[0], 0], angle, tilt, scale, cx, cy);
      const bottom = project([0, plates[2], 0], angle, tilt, scale, cx, cy);
      ctx.beginPath();
      ctx.moveTo(top.x, top.y);
      ctx.lineTo(bottom.x, bottom.y);
      ctx.strokeStyle = "rgba(186, 230, 253, 0.5)";
      ctx.lineWidth = 1;
      ctx.stroke();

      /* a single mote riding the spine, so there is a moving highlight even when
         a plate is exactly edge-on and its outline collapses to a line */
      const t = (phase * 0.32) % 1;
      const moteY = plates[0] + (plates[2] - plates[0]) * t;
      const mote = project([0, moteY, 0], angle, tilt, scale, cx, cy);
      const moteR = Math.max(1.1, size * 0.035 * (1 - Math.abs(t - 0.5) * 0.7));
      const moteGlow = ctx.createRadialGradient(mote.x, mote.y, 0, mote.x, mote.y, moteR * 3.4);
      moteGlow.addColorStop(0, "rgba(224, 242, 254, 0.95)");
      moteGlow.addColorStop(0.45, "rgba(56, 189, 248, 0.5)");
      moteGlow.addColorStop(1, "rgba(56, 189, 248, 0)");
      ctx.fillStyle = moteGlow;
      ctx.beginPath();
      ctx.arc(mote.x, mote.y, moteR * 3.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(240, 249, 255, 0.95)";
      ctx.beginPath();
      ctx.arc(mote.x, mote.y, moteR, 0, Math.PI * 2);
      ctx.fill();

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      reduceQuery.removeEventListener("change", onReduce);
      unsubscribe();
    };
  }, [size]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{ width: size, height: size, display: "block" }}
    />
  );
};
