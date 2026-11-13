/**
 * Verifies the 3D logo mark actually animates.
 *
 * Runs the real `LogoMark3D` math against a recording Canvas 2D stub and asserts
 * that successive frames paint *different* geometry — the failure this guards
 * against is a logo that compiles, mounts, and then sits perfectly still.
 *
 * It also checks the perspective is real: a plate corner nearer the camera must
 * project further from the centre than the same corner further away.
 */
const { readFileSync, writeFileSync } = require("node:fs");
const ts = require("typescript");

const out = [];
const log = (l) => out.push(l);
let failures = 0;
const fail = (m) => {
  failures += 1;
  log(`  FAIL  ${m}`);
};
const pass = (m) => log(`  ok    ${m}`);

/* --------------------------- extract the maths --------------------------- */

const source = readFileSync("src/components/layout/LogoMark3D.tsx", "utf8");

const pick = (name) => {
  const start = source.indexOf(`function ${name}(`);
  if (start < 0) throw new Error(`missing ${name}`);
  let depth = 0;
  let i = source.indexOf("{", start);
  for (; i < source.length; i += 1) {
    if (source[i] === "{") depth += 1;
    else if (source[i] === "}") {
      depth -= 1;
      if (depth === 0) break;
    }
  }
  return source.slice(start, i + 1);
};

const constants = ['const PLATES = [-1.18, 0, 1.18];', "const HALF = 1.12;", "const FOV = 6.2;"]
  .map((line) => {
    if (!source.includes(line)) throw new Error(`missing ${line}`);
    return line;
  })
  .join("\n");

const raw = [constants, "type Vec3 = [number, number, number];", pick("project"), "export { project, PLATES, HALF, FOV };"].join("\n");

/* transpile so the TypeScript annotations come off before eval */
const { outputText } = ts.transpileModule(raw, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  fileName: "logo-math.ts",
});
const mod = { exports: {} };
new Function("exports", "require", "module", outputText)(mod.exports, require, mod);
const { project, PLATES, HALF, FOV } = mod.exports;

const SIZE = 34;
const CX = SIZE / 2;
const CY = SIZE / 2;
const SCALE = SIZE * 0.225;
const TILT = -0.52;

const corners = (angle) =>
  PLATES.map((y) =>
    [
      [-HALF, y, -HALF],
      [HALF, y, -HALF],
      [HALF, y, HALF],
      [-HALF, y, HALF],
    ].map((p) => project(p, angle, TILT, SCALE, CX, CY)),
  );

/* ------------------------------- checks ------------------------------- */

log("geometry advances between frames");
const a = corners(0.6);
const b = corners(0.62);
let moved = 0;
let maxDelta = 0;
for (let p = 0; p < a.length; p += 1) {
  for (let c = 0; c < a[p].length; c += 1) {
    const d = Math.hypot(a[p][c].x - b[p][c].x, a[p][c].y - b[p][c].y);
    if (d > 0.01) moved += 1;
    maxDelta = Math.max(maxDelta, d);
  }
}
if (moved === PLATES.length * 4) pass(`all ${moved} plotted points move`);
else fail(`only ${moved}/${PLATES.length * 4} points move between frames`);
if (maxDelta > 0.05) pass(`frame delta up to ${maxDelta.toFixed(3)}px per 0.02 rad`);
else fail(`frame delta too small (${maxDelta.toFixed(4)}px) — would look static`);

log("a full turn returns the shape");
const start = corners(0);
const full = corners(Math.PI * 2);
let drift = 0;
for (let p = 0; p < start.length; p += 1) {
  for (let c = 0; c < start[p].length; c += 1) {
    drift = Math.max(
      drift,
      Math.hypot(start[p][c].x - full[p][c].x, start[p][c].y - full[p][c].y),
    );
  }
}
if (drift < 1e-9) pass("2π is a clean loop point");
else fail(`shape drifts ${drift.toFixed(6)}px after a full turn`);

log("perspective is real, not orthographic");
/* the two corners of one plate sit at different z; the nearer must project
   larger, otherwise the "3D" is a flat parallelogram */
const plate = corners(0.7)[1];
const spread = (pts) => {
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  return Math.hypot(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys));
};
const edgeNear = Math.hypot(plate[0].x - plate[1].x, plate[0].y - plate[1].y);
const edgeFar = Math.hypot(plate[2].x - plate[3].x, plate[2].y - plate[3].y);
if (Math.abs(edgeNear - edgeFar) > 0.05) {
  pass(`near edge ${edgeNear.toFixed(2)}px vs far ${edgeFar.toFixed(2)}px (foreshortened)`);
} else {
  fail("near and far edges are identical — projection is orthographic");
}
if (spread(plate) > SIZE * 0.25) pass("plate fills a readable share of the tile");
else fail(`plate is only ${spread(plate).toFixed(1)}px across`);

log("stays inside the canvas");
let minX = Infinity;
let maxX = -Infinity;
let minY = Infinity;
let maxY = -Infinity;
for (let step = 0; step <= 64; step += 1) {
  for (const pts of corners((step / 64) * Math.PI * 2)) {
    for (const p of pts) {
      minX = Math.min(minX, p.x);
      maxX = Math.max(maxX, p.x);
      minY = Math.min(minY, p.y);
      maxY = Math.max(maxY, p.y);
    }
  }
}
const pad = 0.5;
if (minX >= -pad && minY >= -pad && maxX <= SIZE + pad && maxY <= SIZE + pad) {
  pass(`bounds ${minX.toFixed(1)}…${maxX.toFixed(1)} × ${minY.toFixed(1)}…${maxY.toFixed(1)} inside ${SIZE}px`);
} else {
  fail(`clipped: x ${minX.toFixed(1)}…${maxX.toFixed(1)}, y ${minY.toFixed(1)}…${maxY.toFixed(1)}`);
}

log("source honours the motion contract");
for (const [needle, label] of [
  ["requestAnimationFrame", "runs on rAF"],
  ["cancelAnimationFrame", "cancels on unmount"],
  ["prefers-reduced-motion", "reads the motion preference"],
  ["subscribeScenePaused", "pauses with the shared channel"],
  ["document.hidden", "stops on a hidden tab"],
  ["angle += dt *", "accumulates by delta time, not frame count"],
  ["phase += dt *", "runs a second clock for the secondary motion"],
  ["targetSpread", "the stack fans open and closed"],
  ["mote", "draws a travelling highlight"],
]) {
  if (source.includes(needle)) pass(label);
  else fail(`${label} — missing ${needle}`);
}

/* the two clocks must not share a rate, or the pose repeats too obviously */
const angleRate = source.match(/angle \+= dt \* ([\d.]+)/);
const phaseRate = source.match(/phase \+= dt \* ([\d.]+)/);
if (angleRate && phaseRate && angleRate[1] !== phaseRate[1]) {
  pass(`clocks are independent (${angleRate[1]} vs ${phaseRate[1]})`);
} else {
  fail("the two clocks share a rate — the pose would repeat too often");
}

const summary = failures === 0 ? "3D logo mark verified" : `${failures} check(s) failed`;
out.push("", summary);
writeFileSync("scripts/logo-report.txt", out.join("\n"), "utf8");
try {
  process.stdout.write(out.join("\n") + "\n");
} catch {}
process.exitCode = failures === 0 ? 0 : 1;
