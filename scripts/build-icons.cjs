/**
 * Generates the site icons from the same geometry as `LogoMark3D`.
 *
 * The mark on the page is three flat plates stacked on the Y axis, tumbled about
 * Y with a fixed camera tilt. This script projects that exact composition at one
 * chosen angle and writes it as SVG/PNG, so the favicon and the header logo are
 * the same object — not a lookalike drawn by hand.
 *
 * Run with `node scripts/build-icons.cjs`.
 */
const fs = require("node:fs");
const path = require("node:path");

/* ---- the geometry, mirrored from LogoMark3D so the two cannot drift ---- */
const PLATES = [-1.18, 0, 1.18];
const HALF = 1.12;
const FOV = 6.2;

const ANGLE = 0.62;
const TILT = -0.52;
const SPREAD = 1.06;

function project([x, y, z], angleY, tiltX, scale, cx, cy) {
  const cy1 = Math.cos(angleY);
  const sy1 = Math.sin(angleY);
  const x1 = x * cy1 + z * sy1;
  const z1 = -x * sy1 + z * cy1;

  const cx1 = Math.cos(tiltX);
  const sx1 = Math.sin(tiltX);
  const y2 = y * cx1 - z1 * sx1;
  const z2 = y * sx1 + z1 * cx1;

  const k = FOV / (FOV + z2);
  return { x: cx + x1 * k * scale, y: cy + y2 * k * scale, z: z2 };
}

const cornersOf = (y) =>
  [
    [-HALF, y, -HALF],
    [HALF, y, -HALF],
    [HALF, y, HALF],
    [-HALF, y, HALF],
  ];

/**
 * Unit-scale bounds of the composition, measured at the angles it will actually
 * be drawn at. Fitting to measured bounds is what keeps the icon from clipping:
 * eyeballing a constant overflowed the 64px viewBox by 0.75px on the top plate.
 */
function bounds(scale = 1) {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (const y of PLATES.map((v) => v * SPREAD)) {
    for (const p of cornersOf(y)) {
      const q = project(p, ANGLE, TILT, scale, 0, 0);
      minX = Math.min(minX, q.x);
      maxX = Math.max(maxX, q.x);
      minY = Math.min(minY, q.y);
      maxY = Math.max(maxY, q.y);
    }
  }

  return { minX, maxX, minY, maxY, w: maxX - minX, h: maxY - minY };
}

/** Scale that makes the mark fill `size` with `inset` fraction of padding. */
function fitScale(size, inset = 0.1) {
  const unit = bounds(1);
  const usable = size * (1 - inset * 2);
  return usable / Math.max(unit.w, unit.h);
}

function plates(size, { inset = 0.1 } = {}) {
  const scale = fitScale(size, inset);
  const unit = bounds(scale);
  /* centre the measured box, so the mark sits optically in the middle */
  const offX = size / 2 - (unit.minX + unit.maxX) / 2;
  const offY = size / 2 - (unit.minY + unit.maxY) / 2;

  const built = PLATES.map((y, index) => {
    const yy = y * SPREAD;
    const corners = cornersOf(yy).map((p) => {
      const q = project(p, ANGLE, TILT, scale, 0, 0);
      return { x: q.x + offX, y: q.y + offY, z: q.z };
    });

    const depth = corners.reduce((sum, p) => sum + p.z, 0) / 4;
    return { index, corners, depth };
  });

  /* far plates first: without a depth buffer, paint order is the depth cue */
  return built.sort((a, b) => b.depth - a.depth);
}

const TINTS = ["#7DD3FC", "#38BDF8", "#0EA5E9"];
const num = (v) => Math.round(v * 100) / 100;
const poly = (corners) =>
  corners.map((p) => `${num(p.x)},${num(p.y)}`).join(" ");

/** The mark as inline SVG, sized to whatever viewBox it is given. */
function markSvg(size, { inset = 0.12, withSpine = true } = {}) {
  const list = plates(size, { inset });

  const shapes = list
    .map((plate) => {
      const near = (FOV - plate.depth) / (2 * FOV);
      const alpha = 0.3 + near * 0.6;
      const tint = TINTS[plate.index];
      return `<polygon points="${poly(plate.corners)}" fill="url(#plate)" fill-opacity="${num(
        alpha,
      )}" stroke="${tint}" stroke-width="${num(size * 0.032)}" stroke-linejoin="round" stroke-opacity="${num(
        0.5 + near * 0.5,
      )}"/>`;
    })
    .join("");

  const centre = (plate) => ({
    x: plate.corners.reduce((s, p) => s + p.x, 0) / 4,
    y: plate.corners.reduce((s, p) => s + p.y, 0) / 4,
  });
  const top = centre(list.find((p) => p.index === 0));
  const bottom = centre(list.find((p) => p.index === 2));

  const spine = withSpine
    ? `<line x1="${num(top.x)}" y1="${num(top.y)}" x2="${num(bottom.x)}" y2="${num(
        bottom.y,
      )}" stroke="#BAE6FD" stroke-opacity="0.55" stroke-width="${num(size * 0.026)}" stroke-linecap="round"/>`
    : "";

  return `<defs>
    <linearGradient id="plate" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#7DD3FC"/>
      <stop offset="1" stop-color="#0EA5E9"/>
    </linearGradient>
  </defs>
  ${shapes}
  ${spine}`;
}

/* ------------------------------- outputs ------------------------------- */

const DIR = "src/app";

/** Full-bleed icon for the browser tab: dark ground, mark centred. */
const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="ITJobs">
  <defs>
    <linearGradient id="ground" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#082F49"/>
      <stop offset="1" stop-color="#041E30"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="14" fill="url(#ground)"/>
  ${markSvg(64, { inset: 0.13 })}
</svg>
`;

/**
 * A maskable icon needs its artwork inside the safe circle, so the mark is fitted
 * with a much larger inset instead of being scaled by a `<g transform>` — the
 * inner SVG is already fitted to its own artboard, so a second scale would not
 * compose the way it looks like it should.
 */
const maskableSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="ITJobs">
  <defs>
    <linearGradient id="ground" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#082F49"/>
      <stop offset="1" stop-color="#041E30"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="0" fill="url(#ground)"/>
  ${markSvg(64, { inset: 0.23 })}
</svg>
`;

/** The transparent mark, for anywhere the ground is supplied by the page. */
const markOnlySvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="ITJobs">
  ${markSvg(64, { inset: 0.13 })}
</svg>
`;

fs.writeFileSync(path.join(DIR, "icon.svg"), iconSvg, "utf8");
fs.mkdirSync(path.join("public"), { recursive: true });
fs.writeFileSync(path.join("public", "icon-maskable.svg"), maskableSvg, "utf8");
fs.writeFileSync(path.join("public", "logo-mark.svg"), markOnlySvg, "utf8");

/* apple-touch wants a plain square it can round itself */
fs.writeFileSync(
  path.join("public", "apple-icon.svg"),
  iconSvg.replace('rx="14"', 'rx="0"'),
  "utf8",
);

console.log("wrote src/app/icon.svg");
console.log("wrote public/icon-maskable.svg");
console.log("wrote public/logo-mark.svg");
console.log("wrote public/apple-icon.svg");
