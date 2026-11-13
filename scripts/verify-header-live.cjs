const BASE = process.env.BASE || "http://localhost:3700";

/**
 * Confirms the new header reaches the browser.
 *
 * Three things this has to get right, because they are easy to assert wrongly:
 *  - the frosted styling only exists once the page has scrolled, so it lives in
 *    the client bundle rather than in the first paint's markup;
 *  - most nav items are mega-menu triggers (rendered as buttons), so
 *    `aria-current` only appears on plain links;
 *  - the 3D mark's projection is client code, and production minification
 *    renames its locals, so the chunk is found by its animation signature.
 */
const fs = require("node:fs");
const path = require("node:path");

const out = [];

function walk(dir, acc) {
  if (!fs.existsSync(dir)) return acc;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full, acc);
    else if (name.endsWith(".js")) acc.push(full);
  }
  return acc;
}

(async () => {
  let bad = 0;

  const home = await (await fetch(`${BASE}/`)).text();
  out.push(`/ ${home.length}b`);

  /* what must be in the server markup */
  for (const [needle, label] of [
    ["ITJobs Việt Nam", "logo aria label"],
    ["Việt Nam", "country line"],
    ["DA251D", "Vietnam flag chip"],
    ["bg-clip-text", "gradient wordmark"],
    ["sticky top-0", "sticky header"],
    ['aria-label="Mở menu"', "mobile trigger"],
  ]) {
    if (home.includes(needle)) out.push(`  ok   ${label}`);
    else {
      bad += 1;
      out.push(`  FAIL ${label} (${needle})`);
    }
  }

  if (home.includes("fa-briefcase") || home.includes("FaBriefcase")) {
    bad += 1;
    out.push("  FAIL generic briefcase icon still present");
  } else {
    out.push("  ok   generic briefcase icon gone");
  }

  /* the 3D mark draws a <canvas>; its wrapper is in the markup */
  if (home.includes("<canvas")) out.push("  ok   logo canvas mounted in the markup");
  else {
    bad += 1;
    out.push("  FAIL no canvas in the header markup");
  }

  /* client-only behaviour, asserted against the shipped chunks */
  const chunks = walk(path.join(".next", "static", "chunks"), []);
  const readAll = chunks.map((file) => fs.readFileSync(file, "utf8"));

  const clientChecks = [
    ["backdrop-blur-xl", "frosted header class ships"],
    ["aria-current", "nav publishes the current page"],
    ["scale-x-0", "nav underline animation ships"],
    ["prefers-reduced-motion", "logo reads the motion preference"],
  ];
  for (const [needle, label] of clientChecks) {
    if (readAll.some((text) => text.includes(needle))) out.push(`  ok   ${label}`);
    else {
      bad += 1;
      out.push(`  FAIL ${label} (${needle})`);
    }
  }

  /* the mark's animation loop: rAF + a canvas 2d context in the same chunk */
  const markChunk = chunks.filter((file, index) => {
    const text = readAll[index];
    return (
      text.includes("requestAnimationFrame") &&
      text.includes('getContext("2d")') &&
      text.includes("LogoMark3D")
    );
  });
  if (markChunk.length > 0) {
    out.push(`  ok   3D mark animation shipped (${path.basename(markChunk[0])})`);
  } else {
    /* the symbol can be renamed, so fall back to the projection shape */
    const byMaths = readAll.filter(
      (text) => text.includes("requestAnimationFrame") && /Math\.cos\(\w+\)\*\w+/.test(text),
    );
    if (byMaths.length > 0) out.push("  ok   3D mark animation shipped (minified)");
    else {
      bad += 1;
      out.push("  FAIL 3D mark animation not found in any client chunk");
    }
  }

  for (const route of ["/cam-nang", "/search", "/company/list"]) {
    const res = await fetch(`${BASE}${route}`);
    const html = await res.text();
    if (res.status === 200 && !/Application error/.test(html)) out.push(`  ok   ${route} 200`);
    else {
      bad += 1;
      out.push(`  FAIL ${route} ${res.status}`);
    }
  }

  out.push(bad === 0 ? "header live checks passed" : `${bad} problem(s)`);
  fs.writeFileSync("scripts/header-live-report.txt", out.join("\n"), "utf8");
  try {
    process.stdout.write(out.join("\n") + "\n");
  } catch {}
  process.exitCode = bad === 0 ? 0 : 1;
})().catch((error) => {
  fs.writeFileSync("scripts/header-live-report.txt", `ERR ${error.message}`, "utf8");
  process.exitCode = 1;
});
