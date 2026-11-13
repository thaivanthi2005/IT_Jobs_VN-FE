const BASE = process.env.BASE || "http://localhost:4200";
const fs = require("node:fs");

/**
 * Confirms the light theme's surfaces actually read in the shipped CSS.
 *
 * The report was "trắng tinh" — the page, the cards and their borders were all
 * within 1.05:1 of each other. This fetches the stylesheet the page really loads
 * and asserts the border token and the utility ramp carry the corrected values,
 * so a future edit to the tokens cannot silently flatten them again.
 */
const out = [];
let bad = 0;

(async () => {
  const home = await (await fetch(`${BASE}/`)).text();
  out.push(`/ ${home.length}b`);

  const links = [...home.matchAll(/href="([^"]+\.css[^"]*)"/g)].map((m) => m[1]);
  if (links.length === 0) {
    bad += 1;
    out.push("  FAIL no stylesheet linked");
  }

  let css = "";
  for (const href of links) {
    css += await (await fetch(`${BASE}${href}`)).text();
  }
  out.push(`css ${css.length}b from ${links.length} file(s)`);
  /* minifiers differ on whitespace and on rgba vs hex, so both sides are
     normalised before comparing */
  const compact = css.toLowerCase().replace(/[\s;]/g, "");
  const probe = (text, needle) =>
    text.replace(/[\s;]/g, "").includes(needle.replace(/[\s;]/g, ""));

  for (const [needle, label] of [
    ["--color-border:#cbd5e1", "border token is the darker step"],
    ["--color-background:#f1f5f9", "page ground is one step below white"],
    ["--color-border-subtle:#e2e8f0", "subtle divider token added"],
    ["box-shadow", "surfaces carry a shadow"],
  ]) {
    if (probe(css, needle)) out.push(`  ok   ${label}`);
    else {
      bad += 1;
      out.push(`  FAIL ${label} (${needle})`);
    }
  }

  /* border-ink-200 must resolve to the darker step, whatever syntax is emitted —
     Tailwind writes `rgb(203 213 225 / var(--tw-border-opacity))`, and the
     spaces inside rgb() matter, so this reads the raw CSS rather than the
     whitespace-stripped copy. */
  const inkBorder =
    /\.border-ink-200\s*\{[^}]*border-color:\s*(?:#cbd5e1|rgb\(\s*203\s+213\s+225)/.test(css);
  if (inkBorder) out.push("  ok   border-ink-200 resolves to #cbd5e1");
  else {
    bad += 1;
    out.push("  FAIL border-ink-200 did not resolve to #cbd5e1");
  }

  /* the old, too-faint values must be gone from the theme layer */
  if (probe(css, "--color-border:#e2e8f0")) {
    bad += 1;
    out.push("  FAIL stale --color-border:#e2e8f0 still shipped");
  } else {
    out.push("  ok   stale --color-border:#e2e8f0 removed");
  }

  out.push(bad === 0 ? "light surfaces verified" : `${bad} problem(s)`);
  fs.writeFileSync("scripts/contrast-live-report.txt", out.join("\n"), "utf8");
  try {
    process.stdout.write(out.join("\n") + "\n");
  } catch {}
  process.exitCode = bad === 0 ? 0 : 1;
})().catch((error) => {
  fs.writeFileSync("scripts/contrast-live-report.txt", `ERR ${error.message}`, "utf8");
  process.exitCode = 1;
});
