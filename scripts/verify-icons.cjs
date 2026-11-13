const fs = require("node:fs");

/**
 * Verifies the generated icons.
 *
 * The specific failure this exists for: the first hand-tuned version put a plate
 * corner at y = -0.75, so the tab icon had its top edge sliced off. Eyeballing a
 * scale constant is exactly how that happens, so the check parses the emitted SVG
 * and asserts every coordinate sits inside the viewBox.
 */
const out = [];
let failures = 0;
const fail = (m) => {
  failures += 1;
  out.push(`  FAIL  ${m}`);
};
const pass = (m) => out.push(`  ok    ${m}`);

const FILES = [
  ["src/app/icon.svg", 64, 14],
  ["public/apple-icon.svg", 64, 0],
  ["public/icon-maskable.svg", 64, 0],
  ["public/logo-mark.svg", 64, 14],
];

const num = (v) => Number(v.replace(/px$/, ""));

for (const [file, size, expectedRadius] of FILES) {
  if (!fs.existsSync(file)) {
    fail(`${file} missing`);
    continue;
  }
  const svg = fs.readFileSync(file, "utf8");
  out.push(`${file}`);

  /* well-formed enough to trust: balanced tags, a viewBox, no stray entities */
  if (svg.trim().startsWith("<svg")) pass("starts with <svg");
  else fail("does not start with <svg>");
  if (svg.includes(`viewBox="0 0 ${size} ${size}"`)) pass(`viewBox 0 0 ${size} ${size}`);
  else fail("unexpected viewBox");
  if (svg.trim().endsWith("</svg>")) pass("closes </svg>");
  else fail("does not close </svg>");
  if (/&(?!amp;|lt;|gt;|quot;|#)/.test(svg)) fail("unescaped entity");
  else pass("no unescaped entities");

  /* every polygon point must land inside the artboard */
  const polygons = [...svg.matchAll(/points="([^"]+)"/g)].map((m) => m[1]);
  if (polygons.length === 3) pass("three plates present");
  else fail(`${polygons.length} polygons, expected 3`);

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const points of polygons) {
    for (const pair of points.split(" ")) {
      const [x, y] = pair.split(",").map(Number);
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
  }

  const inside =
    minX >= 0 && minY >= 0 && maxX <= size && maxY <= size;
  if (inside) {
    pass(
      `artwork inside the artboard: x ${minX.toFixed(1)}…${maxX.toFixed(1)}, y ${minY.toFixed(1)}…${maxY.toFixed(1)}`,
    );
  } else {
    fail(
      `artwork clipped: x ${minX.toFixed(1)}…${maxX.toFixed(1)}, y ${minY.toFixed(1)}…${maxY.toFixed(1)}`,
    );
  }

  /* the mark should fill a decent share of the tile, or it reads as a dot.
     A maskable icon is held to a lower bar on purpose: the platform crops it to
     a circle, so the artwork has to stay inside the safe zone and cannot also
     fill the whole artboard. */
  const fill = Math.max((maxX - minX) / size, (maxY - minY) / size);
  const minimum = file.includes("maskable") ? 0.5 : 0.6;
  if (fill >= minimum) pass(`mark fills ${(fill * 100).toFixed(0)}% of the tile`);
  else fail(`mark only fills ${(fill * 100).toFixed(0)}% — too small to read`);

  /* the maskable icon must keep the mark inside the safe circle (80% box) */
  if (file.includes("maskable")) {
    const margin = Math.min(minX, minY, size - maxX, size - maxY);
    if (margin >= size * 0.1) pass(`safe-zone margin ${margin.toFixed(1)}px`);
    else fail(`mark reaches the maskable edge (margin ${margin.toFixed(1)}px)`);
  }

  /* ground rect */
  const rect = svg.match(/<rect[^>]*width="(\d+)"[^>]*height="(\d+)"[^>]*rx="(\d+)"/);
  if (file.includes("logo-mark")) {
    if (!rect) pass("no ground rect (transparent mark)");
  } else if (rect) {
    if (Number(rect[3]) === expectedRadius) {
      pass(`ground rect with rx=${expectedRadius}`);
    } else {
      fail(`ground rx=${rect[3]}, expected ${expectedRadius}`);
    }
  } else {
    fail("ground rect missing");
  }

  /* the mark colours must match the header logo tokens */
  for (const hex of ["#7DD3FC", "#0EA5E9"]) {
    if (svg.includes(hex)) pass(`uses ${hex}`);
    else fail(`missing ${hex}`);
  }
}

/* Next only picks up src/app/icon.* automatically; the rest is manifest fodder */
if (fs.existsSync("src/app/icon.svg")) pass("src/app/icon.svg is auto-detected by Next");
else fail("src/app/icon.svg missing");

const summary = failures === 0 ? "icons verified" : `${failures} check(s) failed`;
out.push("", summary);
fs.writeFileSync("scripts/icon-report.txt", out.join("\n"), "utf8");
try {
  process.stdout.write(out.join("\n") + "\n");
} catch {}
process.exitCode = failures === 0 ? 0 : 1;
