/**
 * Headless render check for the ported Gallery Heading.
 *
 * Runs the *transformed* document's script against a recording Canvas 2D stub,
 * then asserts the renderer actually built twelve tile textures, painted pixels,
 * issued fills and drew the headline — proving the ported painters execute
 * instead of throwing or drawing nothing.
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
  for (const [key, value] of Object.entries(extra)) {
    normalized[key.replace(/^\.\//, "").replace(/\.ts$/, "")] = value;
  }
  const module = { exports: {} };
  const localRequire = (id) => {
    const key = id.replace(/^\.\//, "").replace(/\.ts$/, "");
    if (key in normalized) return normalized[key];
    throw new Error("unexpected require " + id);
  };
  new Function("exports", "require", "module", code)(module.exports, localRequire, module);
  return module.exports;
}

const blocks = load(transpile("blocks.ts"));
const variants = load(transpile("variants.ts"));
const { transformGalleryHeading } = load(transpile("transform.ts"), {
  "./blocks": blocks,
  "./variants": variants,
});

/* ---------------------------- Canvas 2D stub ---------------------------- */

const stats = { textures: 0, pixelsPainted: 0, fills: 0, strokes: 0, draws: 0, texts: 0 };

function makeContext(canvas) {
  const gradient = { addColorStop() {} };
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
    save() {},
    restore() {},
    translate() {},
    scale() {},
    rotate() {},
    setTransform() {},
    clearRect() {},
    beginPath() {},
    closePath() {},
    moveTo() {},
    lineTo() {},
    quadraticCurveTo() {},
    arc() {},
    clip() {},
    fill() {
      stats.fills += 1;
    },
    stroke() {
      stats.strokes += 1;
    },
    fillRect() {
      stats.fills += 1;
    },
    strokeRect() {},
    fillText() {
      stats.texts += 1;
    },
    measureText: (text) => ({
      width: String(text).length * 8,
      actualBoundingBoxAscent: 71,
      actualBoundingBoxRight: String(text).length * 8,
      actualBoundingBoxLeft: 0,
    }),
    createLinearGradient: () => gradient,
    createRadialGradient: () => gradient,
    createPattern: () => ({ setTransform() {} }),
    createImageData: (w, h) => ({ width: w, height: h, data: new Uint8ClampedArray(w * h * 4) }),
    putImageData(image) {
      stats.textures += 1;
      let ink = 0;
      const pixels = image.data;
      for (let i = 0; i < pixels.length; i += 4) {
        if (pixels[i] || pixels[i + 1] || pixels[i + 2] || pixels[i + 3]) ink += 1;
      }
      stats.pixelsPainted += ink;
      canvas.__ink += ink;
    },
    drawImage() {
      stats.draws += 1;
      canvas.__ink += 1;
    },
  };
}

function makeCanvas(w = 300, h = 150) {
  const canvas = { width: w, height: h, __ink: 0 };
  canvas.getContext = (type) => (type === "2d" ? (canvas.__ctx ||= makeContext(canvas)) : null);
  return canvas;
}

/* --------------------------- document harness --------------------------- */

function runDocument(html) {
  const script = html.slice(html.indexOf("<script>") + 8, html.lastIndexOf("</script>"));

  const stage = makeCanvas(1280, 800);
  const frameCallbacks = [];
  let clock = 0;
  let rand = 123456789;

  const fakeMath = Object.create(Math);
  fakeMath.random = () => {
    rand = (rand * 1103515245 + 12345) % 2147483648;
    return rand / 2147483648;
  };

  const sandbox = {
    document: {
      readyState: "complete",
      documentElement: { addEventListener() {} },
      body: { setAttribute() {}, appendChild() {}, children: [] },
      createElement: (tag) => (tag === "canvas" ? makeCanvas() : {}),
      getElementById: (id) => (id === "stage" ? stage : null),
      addEventListener() {},
      querySelectorAll: () => [],
      querySelector: () => null,
    },
    performance: {
      now: () => {
        clock += 16.7;
        return clock;
      },
    },
    requestAnimationFrame: (cb) => frameCallbacks.push(cb),
    cancelAnimationFrame() {},
    Event: function Event() {},
    Math: fakeMath,
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
    addEventListener() {},
    dispatchEvent() {},
    matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
  };
  sandbox.globalThis = sandbox;

  const names = Object.keys(sandbox);
  new Function(...names, script)(...names.map((n) => sandbox[n]));

  /* pump a couple of frames so the render loop actually composites */
  for (let i = 0; i < 3; i += 1) {
    const cb = frameCallbacks.shift();
    if (!cb) break;
    cb(clock);
  }

  return { stage };
}

const raw = readFileSync("public/effects/gallery-heading.html", "utf8");

for (const variantName of Object.keys(variants.GALLERY_VARIANTS)) {
  for (const key of Object.keys(stats)) stats[key] = 0;

  const html = transformGalleryHeading(raw, "dark", variants.GALLERY_VARIANTS[variantName]);
  const tag = variantName;

  try {
    const { stage } = runDocument(html);
    const configuration = variants.GALLERY_VARIANTS[variantName];
    const halftone = configuration.field === "halftone";

    /* matte/glitch/riso paint through a field buffer (putImageData per tile);
       halftone paints arcs straight onto the texture, so it has no buffers */
    if (halftone) {
      if (stats.fills > 100) pass(`${tag} ${stats.fills} dot fills`);
      else fail(`${tag} halftone drew only ${stats.fills} fills`);
    } else {
      if (stats.textures >= 12) pass(`${tag} ${stats.textures} tile textures`);
      else fail(`${tag} only ${stats.textures} tile textures`);

      if (stats.pixelsPainted > 1000) pass(`${tag} ${stats.pixelsPainted} textured pixels`);
      else fail(`${tag} only ${stats.pixelsPainted} textured pixels`);
    }

    if (stats.fills > 0) pass(`${tag} ${stats.fills} fills`);
    else fail(`${tag} no fills issued`);

    if (stats.texts > 0) pass(`${tag} ${stats.texts} fillText`);
    else fail(`${tag} headline never drawn`);

    if (stage.__ink > 0) pass(`${tag} stage composited`);
    else fail(`${tag} stage left blank`);
  } catch (error) {
    fail(`${tag} threw: ${error.message}`);
  }
}

const summary = failures === 0 ? "render checks passed" : `${failures} render check(s) failed`;
out.push("", summary);
writeFileSync("scripts/render-report.txt", out.join("\n"), "utf8");
process.exitCode = failures === 0 ? 0 : 1;
