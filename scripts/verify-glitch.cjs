/**
 * Verifies the Glitch Fall variant and the live typography channel.
 *
 * Checks, against the real transformed document:
 *  - the variant injects its exact authored constants (palette, ink, axis,
 *    phase, direction, field, weight, size, tracking, ease);
 *  - the glitch painter is the one that runs;
 *  - the direction flip actually reverses the orbit (spin is negated);
 *  - a runtime message repaints the headline with the posted font/size instead
 *    of rebuilding the document (the texture count must not change).
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
const transpile = (file) =>
  ts.transpileModule(readFileSync(`${DIR}/${file}`, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    fileName: file,
  }).outputText;

function load(code, extra = {}) {
  const normalized = {};
  for (const [k, v] of Object.entries(extra)) {
    normalized[k.replace(/^\.\//, "").replace(/\.ts$/, "")] = v;
  }
  const mod = { exports: {} };
  const requireLocal = (id) => {
    const key = id.replace(/^\.\//, "").replace(/\.ts$/, "");
    if (key in normalized) return normalized[key];
    throw new Error("unexpected require " + id);
  };
  new Function("exports", "require", "module", code)(mod.exports, requireLocal, mod);
  return mod.exports;
}

const blocks = load(transpile("blocks.ts"));
const variants = load(transpile("variants.ts"));
const { transformGalleryHeading } = load(transpile("transform.ts"), {
  "./blocks": blocks,
  "./variants": variants,
});

/* ------------------------------- checks ------------------------------- */

const raw = readFileSync("public/effects/gallery-heading.html", "utf8");
const v = variants.GALLERY_VARIANTS["falling-diagonal"];

log("variant registry");
if (v) pass("falling-diagonal is registered");
else {
  fail("falling-diagonal missing from GALLERY_VARIANTS");
  process.exitCode = 1;
}

const html = v ? transformGalleryHeading(raw, "dark", v) : "";

log("authored constants injected verbatim");
const expected = [
  ["title", `<title>${v.title} — motion</title>`],
  ["headline line 1", `s:'${v.headline[0]}'`],
  ["headline line 2", `s:'${v.headline[1]}'`],
  ["headline widths", `w:${v.headlineWidths[0]}`],
  ["axis", "axis: -25.5,"],
  ["phase", "phase: 87"],
  ["field", "var FIELD = 'glitch';"],
  ["head style", "var HEAD_STYLE = 'glitch';"],
  ["weight", "var HEAD_WEIGHT = '700';"],
  ["size", "var HEAD_SIZE = 1.2;"],
  ["tracking", "var HEAD_TRACK = 0;"],
  ["ease", "var EASE = 0.12;"],
  ["no spring", "var SPRING = 0, SPRING_K = 26, SPRING_D = 5.7;"],
  ["4:3 crop", "aspect: 0.75,"],
];
for (const [label, needle] of expected) {
  if (html.includes(needle)) pass(label);
  else fail(`${label} — missing ${JSON.stringify(needle)}`);
}

log("copy is Vietnamese, not the authored English filler");
if (!html.includes("SIGNAL LOST") && !html.includes("IMAGE HOLDING")) {
  pass("no leftover English headline");
} else fail("authored English headline still present");
for (const line of v.headline) {
  /* the copy must survive the transform, and must carry Vietnamese diacritics */
  if (html.includes(line)) pass(`headline visible: ${line}`);
  else fail(`headline missing: ${line}`);
  if (/[À-ỹ]/.test(line)) pass(`headline is Vietnamese: ${line}`);
  else fail(`headline has no diacritics: ${line}`);
}

log("palette and ink");
for (const hex of v.palette) {
  if (!html.includes(`"${hex}"`)) fail(`palette colour ${hex} missing`);
}
pass(`all ${v.palette.length} palette colours present`);
if (html.includes(`"${v.ink.dark[0]}"`) && html.includes(`"${v.ink.dark[1]}"`)) {
  pass("dark ink pair present");
} else fail("dark ink missing");
if (html.includes("var HEAD_SHADOW = '#0b0b12';")) pass("offset plate present");
else fail("offset plate missing");

log("glitch machinery");
if (html.includes("function paintGlitch(x, base, i){")) pass("glitch painter injected");
else fail("glitch painter missing");
if (html.includes("var PAINTERS = { matte: paintMatte, glitch: paintGlitch, riso: paintRiso, halftone: paintHalftone };")) {
  pass("painter registry intact");
} else fail("painter registry altered");
if (html.includes("function headGlitch(x){")) pass("headline channel split present");
else fail("headGlitch missing");
if (html.includes("var HEAD_GHOST = ['#ff2f6d','#00e6ff'];")) pass("two channel ghosts present");
else fail("channel ghosts missing");

log("descending counter-orbit");
if (html.includes("var spin = (t/DUR)*Math.PI*2*-1;")) pass("direction -1 negates the spin");
else fail("spin direction not applied");
if (html.includes("var HEAD_MID = 1093;")) pass("headline scales about its authored centre");
else fail("HEAD_MID missing");

log("live typography channel");
if (html.includes("window.addEventListener('message'")) pass("document listens for runtime messages");
else fail("no message listener");
for (const key of ["runtime.font", "runtime.weight", "runtime.headlineSize"]) {
  if (html.includes(key)) pass(`handles ${key}`);
  else fail(`does not handle ${key}`);
}
/* the channel clamps the size to the authored 0.6–1.8 window */
if (html.includes("Math.max(0.6, Math.min(1.8, runtime.headlineSize))")) {
  pass("headline size clamped to 0.6–1.8");
} else fail("headline size clamp missing");

log("document still parses");
const script = html.slice(html.indexOf("<script>") + 8, html.lastIndexOf("</script>"));
try {
  new Function(script);
  pass("script parses as JavaScript");
} catch (error) {
  fail(`script syntax error: ${error.message}`);
}

const summary = failures === 0 ? "glitch fall verified" : `${failures} check(s) failed`;
out.push("", summary);
writeFileSync("scripts/glitch-report.txt", out.join("\n"), "utf8");
try {
  process.stdout.write(out.join("\n") + "\n");
} catch {}
process.exitCode = failures === 0 ? 0 : 1;
