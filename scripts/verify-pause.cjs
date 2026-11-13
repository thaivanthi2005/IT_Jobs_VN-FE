const { writeFileSync } = require("node:fs");
const ts = require("typescript");

/**
 * Reference-count semantics of the scene pause channel.
 *
 * Two overlays can be open at once (a menu drawer plus a dialog). The channel has
 * to stay paused until the last one closes, or the first one to unmount would
 * restart the render loop behind the other.
 */
const out = [];
const log = (l) => out.push(l);
let failures = 0;
const fail = (m) => {
  failures += 1;
  log(`  FAIL  ${m}`);
};
const pass = (m) => log(`  ok    ${m}`);

const source = require("fs").readFileSync("src/lib/scene-pause.ts", "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  fileName: "scene-pause.ts",
});

const mod = { exports: {} };
new Function("exports", "require", "module", outputText)(mod.exports, require, mod);
const { setScenePaused, subscribeScenePaused } = mod.exports;

const seen = [];
const unsubscribe = subscribeScenePaused((paused) => seen.push(paused));

seen.length = 0;
setScenePaused(true);
if (seen.length === 1 && seen[0] === true) pass("opening one overlay pauses");
else fail(`first open emitted ${JSON.stringify(seen)}`);

seen.length = 0;
setScenePaused(true);
if (seen.length === 0) pass("a second overlay does not re-emit");
else fail(`second open emitted ${JSON.stringify(seen)}`);

seen.length = 0;
setScenePaused(false);
if (seen.length === 0) pass("closing one of two keeps it paused");
else fail(`early resume emitted ${JSON.stringify(seen)}`);

seen.length = 0;
setScenePaused(false);
if (seen.length === 1 && seen[0] === false) pass("closing the last overlay resumes");
else fail(`final close emitted ${JSON.stringify(seen)}`);

seen.length = 0;
setScenePaused(false);
if (seen.length === 0) pass("an extra close is a no-op");
else fail(`unbalanced close emitted ${JSON.stringify(seen)}`);

unsubscribe();
seen.length = 0;
setScenePaused(true);
setScenePaused(false);
if (seen.length === 0) pass("unsubscribe stops delivery");
else fail(`unsubscribed listener still fired ${seen.length} time(s)`);

const summary = failures === 0 ? "pause channel verified" : `${failures} check(s) failed`;
out.push("", summary);
writeFileSync("scripts/pause-report.txt", out.join("\n"), "utf8");
try {
  process.stdout.write(out.join("\n") + "\n");
} catch {}
process.exitCode = failures === 0 ? 0 : 1;
