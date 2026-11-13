/**
 * Verifies the Gallery Heading hover plumbing end to end.
 *
 * Two failure modes this catches, both of which shipped once:
 *  1. the host only ever posted `hover: 0`, so the authored ring never turned;
 *  2. a frozen document still passed every static check, because nothing
 *     asserted that the ring's clock actually advanced.
 */
const { readFileSync, writeFileSync } = require("node:fs");
const ts = require("typescript");

const report = [];
const log = (l) => report.push(l);
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
  for (const [key, value] of Object.entries(extra)) {
    normalized[key.replace(/^\.\//, "").replace(/\.ts$/, "")] = value;
  }
  const module = { exports: {} };
  const requireLocal = (id) => {
    const key = id.replace(/^\.\//, "").replace(/\.ts$/, "");
    if (key in normalized) return normalized[key];
    throw new Error("unexpected require " + id);
  };
  new Function("exports", "require", "module", code)(module.exports, requireLocal, module);
  return module.exports;
}

const blocks = load(transpile("blocks.ts"));
const variants = load(transpile("variants.ts"));
const { transformGalleryHeading } = load(transpile("transform.ts"), {
  "./blocks": blocks,
  "./variants": variants,
});

/* ------------------------------ stub canvas ------------------------------ */

function makeContext(canvas) {
  const gradient = { addColorStop() {} };
  const noop = () => {};
  return {
    canvas,
    globalAlpha: 1,
    globalCompositeOperation: "source-over",
    fillStyle: "#000",
    strokeStyle: "#000",
    lineWidth: 1,
    lineCap: "butt",
    lineJoin: "miter",
    shadowBlur: 0,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowColor: "transparent",
    imageSmoothingEnabled: true,
    imageSmoothingQuality: "low",
    textAlign: "start",
    textBaseline: "alphabetic",
    letterSpacing: "0px",
    font: "10px sans-serif",
    save: noop,
    restore: noop,
    translate: noop,
    scale: noop,
    rotate: noop,
    setTransform: noop,
    clearRect: noop,
    beginPath: noop,
    closePath: noop,
    moveTo: noop,
    lineTo: noop,
    quadraticCurveTo: noop,
    arc: noop,
    clip: noop,
    fill: noop,
    stroke: noop,
    fillRect: noop,
    strokeRect: noop,
    fillText: noop,
    measureText: (text) => ({
      width: String(text).length * 8,
      actualBoundingBoxAscent: 71,
      actualBoundingBoxRight: String(text).length * 8,
      actualBoundingBoxLeft: 0,
    }),
    createLinearGradient: () => gradient,
    createRadialGradient: () => gradient,
    createPattern: () => ({ setTransform: noop }),
    createImageData: (w, h) => ({ width: w, height: h, data: new Uint8ClampedArray(w * h * 4) }),
    putImageData: noop,
    drawImage: noop,
  };
}

function makeCanvas(w = 300, h = 150) {
  const canvas = { width: w, height: h };
  canvas.getContext = (type) => (type === "2d" ? (canvas.__ctx ||= makeContext(canvas)) : null);
  return canvas;
}

/* --------------------------- document harness --------------------------- */

/**
 * Runs the document and pumps frames, returning the ring clock. The clock is
 * read through the authored `window.__time()` hook, so the measurement does not
 * depend on anything the canvas stub draws.
 */
function runFrames(html, { hover, frames }) {
  const script = html.slice(html.indexOf("<script>") + 8, html.lastIndexOf("</script>"));
  const stage = makeCanvas(1280, 800);

  const frameQueue = [];
  const listeners = {};
  let clock = 0;

  const on = (bucket) => (type, cb) => {
    (listeners[`${bucket}:${type}`] ||= []).push(cb);
  };

  const sandbox = {
    document: {
      readyState: "complete",
      documentElement: { addEventListener: on("root") },
      body: { setAttribute() {}, appendChild() {}, children: [] },
      createElement: (tag) => (tag === "canvas" ? makeCanvas() : {}),
      getElementById: (id) => (id === "stage" ? stage : null),
      addEventListener: on("doc"),
      querySelectorAll: () => [],
      querySelector: () => null,
    },
    performance: { now: () => clock },
    requestAnimationFrame: (cb) => frameQueue.push(cb),
    cancelAnimationFrame: () => {},
    Event: function Event() {},
    Math,
    JSON,
    Float32Array,
    Uint8ClampedArray,
    parseInt,
    parseFloat,
    isNaN,
    setTimeout: (cb) => cb(),
    console: { log() {}, warn() {}, error() {} },
  };

  sandbox.window = {
    parent: null,
    innerWidth: 1280,
    innerHeight: 800,
    devicePixelRatio: 2,
    addEventListener: on("win"),
    dispatchEvent: () => {},
    matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
  };
  sandbox.globalThis = sandbox;

  const names = Object.keys(sandbox);
  new Function(...names, script)(...names.map((n) => sandbox[n]));

  const messageHandlers = listeners["win:message"] || [];
  if (hover) {
    messageHandlers.forEach((cb) => cb({ data: { threeuiRuntime: { hover: 1 } } }));
  }

  /* the clock advances before each frame so the loop sees real elapsed time */
  for (let i = 0; i < frames; i += 1) {
    clock += 16.7;
    const cb = frameQueue.shift();
    if (!cb) break;
    cb(clock);
  }

  const time = typeof sandbox.window.__time === "function" ? sandbox.window.__time() : NaN;
  return { time, messageHandlers: messageHandlers.length };
}

/* -------------------------------- checks -------------------------------- */

const raw = readFileSync("public/effects/gallery-heading.html", "utf8");
const html = transformGalleryHeading(raw, "dark", variants.GALLERY_VARIANTS.brand);
const FRAMES = 90;

const probe = runFrames(html, { hover: false, frames: 1 });
if (probe.messageHandlers > 0) pass(`document listens for runtime messages (${probe.messageHandlers})`);
else fail("no message listener — a hover can never reach the document");

const rest = runFrames(html, { hover: false, frames: FRAMES });
if (!Number.isFinite(rest.time)) fail("document exposes no __time hook");
else if (Math.abs(rest.time) < 0.01) pass(`rest holds still (t=${rest.time.toFixed(4)}s)`);
else fail(`ring drifted at rest (t=${rest.time.toFixed(4)}s)`);

const hovered = runFrames(html, { hover: true, frames: FRAMES });
if (!Number.isFinite(hovered.time)) fail("hover run produced no clock");
else if (hovered.time > 0.05) pass(`hover orbits (t=${hovered.time.toFixed(3)}s over ${FRAMES} frames)`);
else fail(`hover produced no orbit (t=${hovered.time.toFixed(4)}s)`);

if (Number.isFinite(hovered.time) && hovered.time < 15.015) {
  pass("hover rate stays under one authored revolution");
} else if (Number.isFinite(hovered.time)) {
  fail(`hover rate exceeded a full revolution (t=${hovered.time.toFixed(2)}s)`);
}

const summary = failures === 0 ? "hover plumbing verified" : `${failures} check(s) failed`;
report.push("", summary);
writeFileSync("scripts/hover-report.txt", report.join("\n"), "utf8");
try { process.stdout.write(report.join("\n") + "\n"); } catch (e) {}
process.exitCode = failures === 0 ? 0 : 1;
