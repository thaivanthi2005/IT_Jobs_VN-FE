import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";

const report = [];
const log = (line) => report.push(line);

const EXPECTED = {
  "gallery-heading": "8e42d2d5b4971bfc",
  "constellation-field": "1920ad4fe34f2ed2",
};

let failures = 0;
const fail = (message) => {
  failures += 1;
  log(`  FAIL  ${message}`);
};
const pass = (message) => log(`  ok    ${message}`);

log("source hashes");
for (const [name, expected] of Object.entries(EXPECTED)) {
  const buffer = readFileSync(`public/effects/${name}.html`);
  const digest = createHash("sha256").update(buffer).digest("hex").slice(0, 16);
  if (digest === expected) pass(`${name} ${digest}`);
  else fail(`${name} hash ${digest} !== ${expected}`);
}

const raw = readFileSync("public/effects/gallery-heading.html", "utf8");
log("gallery-heading transform anchors");
const anchors = [
  "<title>New Grainient Collection Added — motion</title>",
  "html,body{margin:0;height:100%;background:#000;overflow:hidden}",
  "axis: 25.5,",
  "phase: 93",
  "  tile: 346,            /* tile side in ring units (R = a)               */",
  "  roundRectPath(ctx, TS, TS, TS*RING.radius);",
  "var CAP = 142;          /* headline cap height */\nvar SMALL = 22;         /* small-label cap height */",
  "{ s:'NEW GRAINIENT',    top:930,  w:1370, fill:'#d0d0d0' }",
  "{ s:'COLLECTION ADDED', top:1114, w:1775, fill:'#ffffff' }",
  ' * Tile artwork — eleven grainy gradient "wallpapers"',
  "y.fillStyle = 'rgba(6,8,18,0.75)';",
  "var spin = (t/DUR)*Math.PI*2;",
  "ctx.fillStyle = '#000';\n  ctx.fillRect(0,0,W,H);",
];

for (const anchor of anchors) {
  const count = raw.split(anchor).length - 1;
  if (count === 1) pass(`anchor x1 ${JSON.stringify(anchor.slice(0, 48))}`);
  else fail(`anchor x${count} ${JSON.stringify(anchor.slice(0, 48))}`);
}

const blockPatterns = {
  ART_BLOCK: /function lin\(x,x0,y0,x1,y1,stops\)\{[\s\S]*?\n\];\n\nfunction roundRectPath/g,
  GRAIN_BLOCK: / {4}\/\* film grain \*\/\n[\s\S]*?\n {4}x\.restore\(\);\n {4}front\.push\(c\);/g,
  HEAD_BLOCK: /function buildHead\(\)\{[\s\S]*?\n\}\n\nfunction buildLabels/g,
  LABEL_BLOCK: /function buildLabels\(\)\{[\s\S]*?\n\}\n\nfunction resize/g,
  CLOCK_BLOCK:
    /var t0 = performance\.now\(\), tNow = 0, playing = true;[\s\S]*?window\.__play = function\(\)\{ t0 = performance\.now\(\) - tNow\*1000; playing = true; \};/g,
};

log("block patterns");
for (const [name, pattern] of Object.entries(blockPatterns)) {
  const count = (raw.match(pattern) || []).length;
  if (count === 1) pass(`${name} matches once`);
  else fail(`${name} matches ${count} times, expected 1`);
}

log("blocks are template-safe");
const blocksSource = readFileSync("src/components/effects/gallery-heading/blocks.ts", "utf8");
for (const name of ["Head", "Art", "Clock"]) {
  const match = blocksSource.match(new RegExp(`export const ${name} = (")`));
  if (!match) {
    fail(`${name} not exported from blocks.ts`);
    continue;
  }
  /* the emitted module stores each block as a JSON string literal, so a stray
     backtick or ${ would have had to be escaped — parse it back and check */
  const start = blocksSource.indexOf(`export const ${name} = `) + `export const ${name} = `.length;
  const end = blocksSource.indexOf(";\n", start);
  const literal = blocksSource.slice(start, end);
  const body = JSON.parse(literal);
  if (body.includes("`") || body.includes("${")) fail(`${name} contains a template hack`);
  else pass(`${name} (${body.length} chars)`);
}

const summary = failures === 0 ? "all checks passed" : `${failures} check(s) failed`;
report.push("", summary);
writeFileSync("scripts/verify-report.txt", report.join("\n"), "utf8");
try { process.stdout.write(report.join("\n") + "\n"); } catch (e) {}
/* stdout can be unavailable in some Windows shells; the report file and exit
   code are the contract */
process.exitCode = failures === 0 ? 0 : 1;
