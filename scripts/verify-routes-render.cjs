const BASE = process.env.BASE || "http://localhost:4600";
const fs = require("node:fs");

/**
 * Fetches every page and asserts nothing throws at render time.
 *
 * The failure being guarded is the one that only appears when the page actually
 * renders: "Event handlers cannot be passed to Client Component props". Next
 * reports it in the HTML payload with a 500, so status alone is not enough — the
 * body is scanned for the boundary error and for the generic runtime error page.
 */
const ROUTES = [
  "/",
  "/cam-nang",
  "/cam-nang/lo-trinh/frontend",
  "/search",
  "/company/list",
  "/user/login",
  "/user/register",
  "/company/login",
  "/company/register",
];

const out = [];
let bad = 0;

const FATAL = [
  "Event handlers cannot be passed",
  "Unhandled Runtime Error",
  "Application error",
  "Cannot read properties of undefined",
  "Functions cannot be passed directly to Client Components",
];

(async () => {
  for (const route of ROUTES) {
    const res = await fetch(`${BASE}${route}`);
    const html = await res.text();

    const hit = FATAL.find((needle) => html.includes(needle));
    if (hit) {
      bad += 1;
      out.push(`  FAIL ${route} ${res.status} — "${hit}"`);
      continue;
    }

    if (res.status >= 400) {
      bad += 1;
      out.push(`  FAIL ${route} ${res.status}`);
      continue;
    }

    out.push(`  ok   ${route} ${res.status} ${html.length}b`);
  }

  /* the pages that render job cards must not ship a bare function prop */
  const home = await (await fetch(`${BASE}/`)).text();
  if (/onClick=\{?function/.test(home)) {
    bad += 1;
    out.push("  FAIL a function literal is serialised into the payload");
  } else {
    out.push("  ok   no serialised function props in the payload");
  }

  out.push("", bad === 0 ? "all routes render clean" : `${bad} route(s) failing`);
  fs.writeFileSync("scripts/routes-report.txt", out.join("\n"), "utf8");
  try {
    process.stdout.write(out.join("\n") + "\n");
  } catch {}
  process.exitCode = bad === 0 ? 0 : 1;
})().catch((error) => {
  fs.writeFileSync("scripts/routes-report.txt", `ERR ${error.message}`, "utf8");
  process.exitCode = 1;
});
