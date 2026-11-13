/**
 * Verifies the header upgrade.
 *
 * The failures this guards against are the ones that look fine in a screenshot:
 * a header that forgets its scroll state, a scroll listener that measures layout
 * on every event, and a nav whose "current page" underline never lights up.
 */
const { readFileSync, writeFileSync } = require("node:fs");

const out = [];
const log = (l) => out.push(l);
let failures = 0;
const fail = (m) => {
  failures += 1;
  log(`  FAIL  ${m}`);
};
const pass = (m) => log(`  ok    ${m}`);

const has = (source, needle, label) => {
  if (source.includes(needle)) pass(label);
  else fail(`${label} — missing ${JSON.stringify(needle.slice(0, 52))}`);
};

const header = readFileSync("src/components/layout/Header.tsx", "utf8");
log("header");
has(header, "sticky top-0", "sticks to the top");
has(header, "backdrop-blur-xl", "frosted when scrolled");
has(header, "shadow-soft", "lifts off the page when scrolled");
has(header, "bg-hero-mesh", "brand wash behind the bar");
has(header, "scaleX(", "reading-progress line is driven by scroll");
has(header, "requestAnimationFrame", "scroll work is coalesced into a frame");
has(header, 'passive: true', "scroll listener is passive");
has(header, "cancelAnimationFrame", "pending frame is cancelled on unmount");
has(header, "removeEventListener", "listeners are removed on unmount");
has(header, 'aria-label="Mở menu"', "mobile trigger is labelled");
has(header, "aria-expanded", "mobile trigger reports its state");

log("nav");
const nav = readFileSync("src/components/layout/DesktopMenu.tsx", "utf8");
has(nav, "usePathname", "reads the current route");
has(nav, "isCurrent(", "derives the active section");
has(nav, 'aria-current=', "announces the current page");
has(nav, "scale-x-0 group-hover:scale-x-100", "underline sweeps in on hover");
has(nav, "duration-300 ease-out-expo", "underline uses the project easing");
has(nav, "Escape", "Escape closes the mega menu");

log("logo");
const logo = readFileSync("src/components/layout/Logo.tsx", "utf8");
const mark = readFileSync("src/components/layout/LogoMark3D.tsx", "utf8");
has(logo, "LogoMark3D", "worldmark uses the 3D mark");
if (logo.includes("FaBriefcase")) fail("still using the generic briefcase glyph");
else pass("generic briefcase glyph is gone");
has(logo, "bg-clip-text", "wordmark carries the brand gradient");
has(logo, "DA251D", "Vietnam chip present");
has(logo, 'aria-label="ITJobs Việt Nam', "link is labelled with the country");
has(mark, "perspective", "mark uses a perspective projection");
has(mark, "requestAnimationFrame", "mark animates");
has(mark, "subscribeScenePaused", "mark pauses with the shared channel");
has(mark, "prefers-reduced-motion", "mark respects the motion preference");

/* the mark must not create a WebGL context: 30 triangles for a 34px tile */
if (mark.includes("getContext(\"webgl")) fail("mark opens a WebGL context for a tiny tile");
else pass("mark stays on Canvas 2D");

const summary = failures === 0 ? "header verified" : `${failures} check(s) failed`;
out.push("", summary);
writeFileSync("scripts/header-report.txt", out.join("\n"), "utf8");
try {
  process.stdout.write(out.join("\n") + "\n");
} catch {}
process.exitCode = failures === 0 ? 0 : 1;
