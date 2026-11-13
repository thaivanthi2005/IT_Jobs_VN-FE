const BASE = process.env.BASE || "http://localhost:4300";
const fs = require("node:fs");

/**
 * Counts what the home page animates at runtime.
 *
 * Every `requestAnimationFrame` loop and every canvas is a cost the visitor pays
 * on the main thread or the GPU, and they are invisible in a bundle-size report.
 * The budget here is deliberately tight: a job board should animate a handful of
 * things, not a dozen.
 */
const out = [];
let bad = 0;

const {
  readdirSync,
} = fs;
const path = require("node:path");

function walk(dir, acc) {
  if (!fs.existsSync(dir)) return acc;
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full, acc);
    else if (/\.(tsx|ts)$/.test(name)) acc.push(full);
  }
  return acc;
}

/* what the home page mounts, transitively through its imports */
const HOME_GRAPH = [
  "src/app/(pages)/(home)/page.tsx",
  "src/components/home/HeroSearch.tsx",
  "src/components/home/OrbitRings.tsx",
  "src/components/home/CategorySection.tsx",
  "src/components/home/FeaturedJobsSection.tsx",
  "src/components/home/ValueSection.tsx",
  "src/components/home/TopCompaniesSection.tsx",
  "src/components/three/Backdrop3D.tsx",
  "src/components/three/tech-scene.tsx",
];

let loops = 0;
let canvases = 0;
const detail = [];

for (const file of HOME_GRAPH) {
  if (!fs.existsSync(file)) continue;
  const text = fs.readFileSync(file, "utf8");
  const r = (text.match(/requestAnimationFrame/g) || []).length;
  const c = (text.match(/<canvas|Canvas\b/g) || []).length;
  if (r || c) detail.push(`  ${file}  rAF:${r} canvas:${c}`);
  loops += r;
  canvases += c;
}

out.push("home page animation surface");
out.push(`  rAF call sites: ${loops}`);
out.push(`  canvas mounts:  ${canvases}`);
for (const line of detail) out.push(line);

/* the hero runs one WebGL scene plus one CSS rig; that is the design. A third
   rAF loop on this page would mean something crept in. */
if (loops <= 6) out.push(`  ok   rAF call sites within budget (<= 6)`);
else {
  bad += 1;
  out.push(`  FAIL ${loops} rAF call sites on the home page`);
}

const hero = fs.readFileSync("src/components/home/HeroSearch.tsx", "utf8");
const hasOrbit = hero.includes("OrbitRings");
const hasScene = hero.includes("Backdrop3D");
out.push(`  hero: Backdrop3D ${hasScene ? "yes" : "no"}, OrbitRings ${hasOrbit ? "yes" : "no"}`);

/* the orbit rig is pure CSS, so it costs no main-thread time. Comments are
   stripped first — the file's doc comment mentions requestAnimationFrame, which
   made a naive search report a JS loop that does not exist. */
const rings = fs.readFileSync("src/components/home/OrbitRings.tsx", "utf8");
const ringsCode = rings
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/^\s*\/\/.*$/gm, "");
if (!/requestAnimationFrame/.test(ringsCode)) {
  out.push("  ok   orbit rings animate in CSS, not JS");
} else {
  bad += 1;
  out.push("  FAIL orbit rings run a JS loop — they should be CSS");
}

/* a hidden tab must not animate */
const scene = fs.readFileSync("src/components/three/tech-scene.tsx", "utf8");
if (scene.includes("document.hidden") || scene.includes("visibilitychange")) {
  out.push("  ok   the 3D scene stops when the tab is hidden");
} else {
  bad += 1;
  out.push("  FAIL the 3D scene keeps rendering in a hidden tab");
}

out.push("", bad === 0 ? "animation budget ok" : `${bad} problem(s)`);
fs.writeFileSync("scripts/anim-report.txt", out.join("\n"), "utf8");
try {
  process.stdout.write(out.join("\n") + "\n");
} catch {}
process.exitCode = bad === 0 ? 0 : 1;
