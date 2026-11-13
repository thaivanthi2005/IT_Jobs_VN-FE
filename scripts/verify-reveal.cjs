const fs = require("node:fs");
const path = require("node:path");

/**
 * Verifies the scroll-reveal system.
 *
 * The failure modes worth guarding:
 *  - content hidden by CSS that never becomes visible (a broken observer), so the
 *    hidden state must be applied by script only;
 *  - an observer that keeps firing after the first reveal, doing work per frame;
 *  - reduced motion still animating.
 */
const out = [];
let failures = 0;
const fail = (m) => {
  failures += 1;
  out.push(`  FAIL  ${m}`);
};
const pass = (m) => out.push(`  ok    ${m}`);

const reveal = fs.readFileSync("src/components/ui/Reveal.tsx", "utf8");
const group = fs.readFileSync("src/components/ui/RevealGroup.tsx", "utf8");
const css = fs.readFileSync("src/app/globals.css", "utf8");

out.push("Reveal component");
for (const [needle, label] of [
  ["IntersectionObserver", "uses an IntersectionObserver"],
  ["observer.unobserve", "stops observing after the first reveal"],
  ["observer.disconnect", "disconnects on unmount"],
  ['dataset.reveal = "pending"', "applies the hidden state from script, not markup"],
  ['dataset.reveal = "shown"', "marks the revealed state"],
  ["rootMargin", "tunes the trigger margin"],
]) {
  if (reveal.includes(needle)) pass(label);
  else fail(`${label} — missing ${needle}`);
}

out.push("RevealGroup");
if (group.includes("step")) pass("staggers children");
else fail("no stagger");
if (group.includes("Array.isArray")) pass("handles a children array");
else fail("cannot handle multiple children");

out.push("CSS");
for (const [needle, label] of [
  [".reveal[data-reveal=\"pending\"]", "hidden state"],
  [".reveal[data-reveal=\"shown\"]", "shown state"],
  ["will-change: opacity, transform", "declares the composited properties"],
  ["cubic-bezier(0.16, 1, 0.3, 1)", "uses the project easing"],
]) {
  if (css.includes(needle)) pass(label);
  else fail(`${label} — missing ${needle}`);
}

/* reduced motion must force everything visible */
const reduced = css.slice(css.indexOf("prefers-reduced-motion: reduce"));
if (reduced.includes(".reveal") && reduced.includes("opacity: 1 !important")) {
  pass("reduced motion shows everything");
} else {
  fail("reduced motion does not restore visibility");
}

out.push("wiring");
function walk(dir, acc) {
  if (!fs.existsSync(dir)) return acc;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full, acc);
    else if (/\.tsx$/.test(name)) acc.push(full);
  }
  return acc;
}
const using = walk("src", []).filter((file) => {
  const text = fs.readFileSync(file, "utf8");
  return /<Reveal(Group)?\b/.test(text);
});
if (using.length >= 6) {
  pass(`${using.length} components reveal on scroll`);
} else {
  fail(`only ${using.length} components use Reveal`);
}

const summary = failures === 0 ? "reveal system verified" : `${failures} check(s) failed`;
out.push("", summary);
fs.writeFileSync("scripts/reveal-report.txt", out.join("\n"), "utf8");
try {
  process.stdout.write(out.join("\n") + "\n");
} catch {}
process.exitCode = failures === 0 ? 0 : 1;
