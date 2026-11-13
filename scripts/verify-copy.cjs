/**
 * Measures the localised headline against its authored box.
 *
 * The transform stretches each line's ink width to `headlineWidths[n]`, so a
 * copy that is far too short would be blown up until the letterforms look
 * stretched. This asserts the scale stays close to 1 by comparing the natural
 * ink width of the copy against the target box, using a proportional metric.
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

const DIR = "src/components/effects/gallery-heading";
const source = readFileSync(`${DIR}/variants.ts`, "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  fileName: "variants.ts",
});
const mod = { exports: {} };
new Function("exports", "require", "module", outputText)(mod.exports, require, mod);
const { GALLERY_VARIANTS } = mod.exports;

/**
 * Rough proportional ink width for a heavy sans at cap height 1.
 * Uppercase Latin averages ~0.62em; Vietnamese diacritics stack vertically and
 * do not widen the glyph, so they are weighted like their base letter.
 */
const WIDTH = {
  I: 0.3, L: 0.55, T: 0.62, N: 0.72, H: 0.72, U: 0.72, Y: 0.68, E: 0.62,
  O: 0.76, A: 0.72, C: 0.68, G: 0.75, M: 0.9, S: 0.62, R: 0.7, P: 0.66,
  D: 0.72, B: 0.68, V: 0.68, X: 0.68, K: 0.68, Q: 0.76, J: 0.5,
  " ": 0.28, ".": 0.28, ",": 0.28, "/": 0.3, "-": 0.4,
};

/** `fitText` sizes the font from the cap height, so px height is cap / capUnit. */
const CAP_UNIT = 142 / 0.717;

const strip = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();

/** Ink width in document pixels for a line at the authored cap height. */
const inkWidth = (text) =>
  [...strip(text)].reduce((sum, ch) => sum + (WIDTH[ch] ?? 0.65), 0) * CAP_UNIT;

log("localised headline fits its authored box");
const v = GALLERY_VARIANTS["falling-diagonal"];
v.headline.forEach((line, index) => {
  const natural = inkWidth(line);
  /* `fitText` scales horizontally to hit the box exactly, so this ratio is the
     amount of horizontal stretch applied to the letterforms */
  const target = v.headlineWidths[index];
  const scale = target / natural;
  const tag = `line ${index + 1} "${line}"`;
  log(`  ${tag}: ink=${Math.round(natural)}px box=${target}px scale=${scale.toFixed(2)}`);
  /* the authored English lines sit around 1.2–1.3; outside 0.8–1.4 reads as
     visibly stretched or cramped */
  if (scale >= 0.8 && scale <= 1.4) pass(`${tag} scale in range`);
  else fail(`${tag} scale ${scale.toFixed(2)} outside 0.8–1.4`);
});

log("lines are balanced");
const [a, b] = v.headline.map((line) => inkWidth(line));
const ratio = Math.max(a, b) / Math.min(a, b);
if (ratio <= 1.25) pass(`line widths balanced (${a.toFixed(2)} vs ${b.toFixed(2)})`);
else fail(`line widths unbalanced: ratio ${ratio.toFixed(2)}`);

log("copy reads as a slogan about jobs");
const joined = v.headline.join(" ");
for (const word of ["TÍN HIỆU", "CƠ HỘI"]) {
  if (joined.includes(word)) pass(`mentions "${word}"`);
  else fail(`missing "${word}"`);
}

const summary = failures === 0 ? "headline copy fits" : `${failures} check(s) failed`;
out.push("", summary);
writeFileSync("scripts/copy-report.txt", out.join("\n"), "utf8");
try {
  process.stdout.write(out.join("\n") + "\n");
} catch {}
process.exitCode = failures === 0 ? 0 : 1;
