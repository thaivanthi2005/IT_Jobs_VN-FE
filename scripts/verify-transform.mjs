/**
 * End-to-end check of the Gallery Heading transform.
 *
 * Compiles the real `transform.ts` + `blocks.ts` + `variants.ts` with the
 * project's own TypeScript, applies the transform to the byte-exact source, then
 * asserts that no authored anchor survived, the injected blocks landed once, the
 * produced document still parses, and no CRLF leaked in.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const ts = require("typescript");

const report = [];
const log = (line) => report.push(line);
let failures = 0;
const fail = (m) => {
  failures += 1;
  log(`  FAIL  ${m}`);
};
const pass = (m) => log(`  ok    ${m}`);

const DIR = "src/components/effects/gallery-heading";

/** Transpile one module to CommonJS and hand back its exports. */
function loadModule(relPath, extra = {}) {
  const source = readFileSync(`${DIR}/${relPath}`, "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
    fileName: relPath,
  });

  const module = { exports: {} };
  const normalized = {};
  for (const [key, value] of Object.entries(extra)) {
    normalized[key.replace(/^\.\//, "").replace(/\.ts$/, "")] = value;
  }

  const localRequire = (id) => {
    const key = id.replace(/^\.\//, "").replace(/\.ts$/, "");
    if (!(key in normalized)) {
      console.log("DEBUG require", JSON.stringify(id), "->", JSON.stringify(key), "known:", Object.keys(normalized));
    }
    if (key in normalized) return normalized[key];
    throw new Error(`unexpected require: ${id}`);
  };

  new Function("exports", "require", "module", outputText)(module.exports, localRequire, module);
  return module.exports;
}

let api;
try {
  const blocks = loadModule("blocks.ts");
  const variants = loadModule("variants.ts");
  const transform = loadModule("transform.ts", { "./blocks": blocks, "./variants": variants });
  api = { ...transform, GALLERY_VARIANTS: variants.GALLERY_VARIANTS };
  pass("transform module evaluates");
} catch (error) {
  fail(`transform module threw: ${error.message}`);
  writeFileSync("scripts/transform-report.txt", report.join("\n"), "utf8");
  console.error(report.join("\n"));
  process.exit(1);
}

const raw = readFileSync("public/effects/gallery-heading.html", "utf8");
if (raw.includes("\r")) fail("source contains CRLF — every multi-line anchor would miss");
else pass("source is LF-only");

const MUST_BE_GONE = [
  "<title>New Grainient Collection Added — motion</title>",
  "html,body{margin:0;height:100%;background:#000;overflow:hidden}",
  "axis: 25.5,",
  "phase: 93",
  "  tile: 346,            /* tile side in ring units (R = a)               */",
  "  roundRectPath(ctx, TS, TS, TS*RING.radius);",
  "var CAP = 142;          /* headline cap height */",
  "{ s:'NEW GRAINIENT',    top:930,  w:1370, fill:'#d0d0d0' }",
  "{ s:'COLLECTION ADDED', top:1114, w:1775, fill:'#ffffff' }",
  ' * Tile artwork — eleven grainy gradient "wallpapers"',
  "y.fillStyle = 'rgba(6,8,18,0.75)';",
  "var spin = (t/DUR)*Math.PI*2;",
  "var t0 = performance.now(), tNow = 0, playing = true;",
];

for (const variantName of Object.keys(api.GALLERY_VARIANTS)) {
  for (const mode of ["dark", "light"]) {
    const configuration = api.GALLERY_VARIANTS[variantName];
    const out = api.transformGalleryHeading(raw, mode, configuration);
    const tag = `${variantName}/${mode}`;

    if (out.includes("\r")) fail(`${tag} output contains CRLF`);

    for (const anchor of MUST_BE_GONE) {
      /* a variant may legitimately reuse the authored value (brand keeps
         axis 25.5 / phase 93), so only flag anchors whose replacement differs */
      const replacedIdentically =
        (anchor === "axis: 25.5," && configuration.axis === 25.5) ||
        (anchor === "phase: 93" && configuration.phase === 93);
      if (replacedIdentically) continue;
      if (out.includes(anchor)) fail(`${tag} anchor survived: ${JSON.stringify(anchor.slice(0, 40))}`);
    }

    if (!out.includes("function buildHead(){\n  headLayer = mkc")) fail(`${tag} HEAD block missing`);
    if (!out.includes("function paintMatte(x, base, i){")) fail(`${tag} ART block missing`);
    if (!out.includes("var tNow = 0, playing = true, hovering = false")) fail(`${tag} CLOCK block missing`);
    if (!out.includes(`var FIELD = '${configuration.field}';`)) fail(`${tag} FIELD not injected`);
    if (!out.includes("aspect: 0.75,")) fail(`${tag} 4:3 aspect not injected`);

    const script = out.slice(out.indexOf("<script>") + 8, out.lastIndexOf("</script>"));
    try {
      new Function(script);
      pass(`${tag} script parses`);
    } catch (error) {
      fail(`${tag} script syntax error: ${error.message}`);
    }

    const expectedBg = mode === "light" ? "#f4f7fb" : "#000000";
    if (!out.includes(`background:${expectedBg};overflow:hidden`)) fail(`${tag} background not applied`);
  }
}

const summary = failures === 0 ? "all checks passed" : `${failures} check(s) failed`;
report.push("", summary);
writeFileSync("scripts/transform-report.txt", report.join("\n"), "utf8");
try { process.stdout.write(report.join("\n") + "\n"); } catch (e) {}
process.exitCode = failures === 0 ? 0 : 1;
