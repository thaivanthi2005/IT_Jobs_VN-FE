const BASE = process.env.BASE || "http://localhost:3800";

/**
 * Confirms the theme + reveal work reached the browser.
 *
 * Two specific bugs this was written for:
 *  1. a decorative layer at `-z-10` inside a section with no stacking context
 *     sank behind <body> and vanished;
 *  2. the gallery pinned `mode="dark"`, so its plates and headline ignored the
 *     site theme toggle.
 */
const fs = require("node:fs");
const path = require("node:path");

const out = [];
let bad = 0;

(async () => {
  const home = await (await fetch(`${BASE}/`)).text();
  out.push(`/ ${home.length}b`);

  /* the reveal class must be in the markup, but never the hidden state */
  if (home.includes("reveal")) out.push("  ok   reveal classes rendered");
  else {
    bad += 1;
    out.push("  FAIL reveal classes missing");
  }

  if (/data-reveal="pending"/.test(home)) {
    bad += 1;
    out.push('  FAIL hidden state shipped in the markup — no-JS would hide content');
  } else {
    out.push("  ok   hidden state is script-only");
  }

  /* the decorative band must not use -z-10 inside a non-isolated parent */
  const badZ = /class="[^"]*-z-10[^"]*"/.test(home);
  if (badZ) {
    bad += 1;
    out.push("  FAIL a layer still uses -z-10 near page content");
  } else {
    out.push("  ok   no -z-10 decorative layer");
  }

  /* the handbook gallery should follow the theme now */
  const handbook = await (await fetch(`${BASE}/cam-nang`)).text();
  if (handbook.includes("mode=\"dark\"")) {
    bad += 1;
    out.push('  FAIL handbook gallery still pins mode="dark"');
  } else {
    out.push("  ok   handbook gallery follows the site theme");
  }

  /* client chunks carry the reveal observer and the theme-aware gallery */
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
  const chunks = walk(path.join(".next", "static", "chunks"), []);
  const texts = chunks.map((f) => fs.readFileSync(f, "utf8"));
  for (const [needle, label] of [
    ["IntersectionObserver", "reveal observer ships"],
    ["dataset.reveal", "reveal state machine ships"],
    ["prefers-reduced-motion", "motion preference honoured"],
  ]) {
    if (texts.some((t) => t.includes(needle))) out.push(`  ok   ${label}`);
    else {
      bad += 1;
      out.push(`  FAIL ${label} (${needle})`);
    }
  }

  for (const route of ["/", "/cam-nang", "/search", "/company/list", "/user/login"]) {
    const res = await fetch(`${BASE}${route}`);
    if (res.status === 200) out.push(`  ok   ${route} 200`);
    else {
      bad += 1;
      out.push(`  FAIL ${route} ${res.status}`);
    }
  }

  out.push(bad === 0 ? "theme + motion checks passed" : `${bad} problem(s)`);
  fs.writeFileSync("scripts/live-theme-report.txt", out.join("\n"), "utf8");
  try {
    process.stdout.write(out.join("\n") + "\n");
  } catch {}
  process.exitCode = bad === 0 ? 0 : 1;
})().catch((error) => {
  fs.writeFileSync("scripts/live-theme-report.txt", `ERR ${error.message}`, "utf8");
  process.exitCode = 1;
});
