const fs = require("node:fs");
const path = require("node:path");

/**
 * Finds colour utilities that reference a scale step the palette does not define.
 *
 * This is the bug that made "Phản hồi TB / < 24 giờ" render black on the light
 * theme: the markup asked for `text-success-400`, the `success` palette only
 * defined 50/100/500/600/700, and Tailwind silently emits **no rule at all** for
 * an unknown step. The element then inherits its parent's colour, which looks
 * like a broken theme rather than a missing class.
 *
 * TypeScript cannot see this, ESLint cannot see it, and the build stays green —
 * so it is checked structurally against the palette in `tailwind.config.ts`.
 */
const out = [];
let failures = 0;
const fail = (m) => {
  failures += 1;
  out.push(`  FAIL  ${m}`);
};
const pass = (m) => out.push(`  ok    ${m}`);

const tailwind = fs.readFileSync("tailwind.config.ts", "utf8");

/* parse `name: { ... }` blocks inside `colors` */
const colorsStart = tailwind.indexOf("colors: {");
const colorsEnd = tailwind.indexOf("fontFamily:");
const colorsBlock = tailwind.slice(colorsStart, colorsEnd);

const palettes = {};
const paletteRe = /(\w+):\s*\{([\s\S]*?)\n\s{8}\},?/g;
let match;
while ((match = paletteRe.exec(colorsBlock)) !== null) {
  const [, name, body] = match;
  const steps = [...body.matchAll(/(\d{2,3}):\s*"/g)].map((m) => m[1]);
  if (steps.length > 0) palettes[name] = new Set(steps);
}

out.push(`palettes: ${Object.entries(palettes).map(([k, v]) => `${k}(${v.size})`).join(" ")}`);

/* every `(text|bg|border|ring|from|via|to|fill|stroke)-<palette>-<step>` */
const UTIL = /\b(?:text|bg|border|ring|from|via|to|fill|stroke|divide|outline|shadow|accent|caret|decoration)-([a-z]+)-(\d{2,3})\b/g;

function walk(dir, acc) {
  if (!fs.existsSync(dir)) return acc;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full, acc);
    else if (/\.(tsx|ts|css)$/.test(name)) acc.push(full);
  }
  return acc;
}

const files = walk("src", []);
out.push(`scanned ${files.length} files`);

const missing = new Map();

for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  let m;
  while ((m = UTIL.exec(text)) !== null) {
    const [, palette, step] = m;
    if (!palettes[palette]) continue; // not a project palette (white, black, slate…)
    if (palettes[palette].has(step)) continue;

    const key = `${palette}-${step}`;
    if (!missing.has(key)) missing.set(key, new Set());
    missing.get(key).add(file);
  }
}

if (missing.size === 0) {
  pass("every colour utility resolves to a defined palette step");
} else {
  for (const [key, files] of missing) {
    fail(`${key} is used but not defined in tailwind.config.ts  (${[...files].slice(0, 3).join(", ")})`);
  }
}

const summary = failures === 0 ? "palette utilities resolve" : `${failures} undefined step(s)`;
out.push("", summary);
fs.writeFileSync("scripts/palette-report.txt", out.join("\n"), "utf8");
try {
  process.stdout.write(out.join("\n") + "\n");
} catch {}
process.exitCode = failures === 0 ? 0 : 1;
