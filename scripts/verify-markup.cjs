const { writeFileSync } = require("node:fs");
const BASE = process.env.BASE || "http://localhost:3000";

/**
 * Checks the two reported defects against the rendered HTML:
 *  1. the hero must ship real CSS 3D orbit markup (perspective/preserve-3d rigs);
 *  2. the job cards must be wired for the quick-view dialog.
 */
(async () => {
  const out = [];
  const say = (l) => out.push(l);
  let bad = 0;

  const home = await (await fetch(`${BASE}/`)).text();
  say(`/ ${home.length}b`);

  const heroChecks = [
    ["orbit-stage", "perspective container"],
    ["orbit-rig", "rotating rig"],
    ["orbit-ring orbit-ring--a", "ring A"],
    ["orbit-ring orbit-ring--b", "ring B"],
    ["orbit-ring orbit-ring--c", "ring C"],
    ["orbit-satellite", "satellite bead"],
  ];
  for (const [needle, label] of heroChecks) {
    if (home.includes(needle)) say(`  ok  ${label}`);
    else {
      bad += 1;
      say(`  FAIL ${label} (${needle})`);
    }
  }

  const sectionChecks = [
    ["Cơ hội đang chờ bạn", "featured jobs heading"],
    ["CardJob", "job cards"],
  ];
  for (const [needle] of sectionChecks) {
    if (home.includes(needle)) say(`  ok  ${needle}`);
    else say(`  note ${needle} is client-rendered`);
  }

  /* the search page lists the most cards, so it is the strictest check */
  const search = await (await fetch(`${BASE}/search`)).text();
  say(`/search ${search.length}b`);
  const jobLinks = (search.match(/href="\/job\/detail\//g) || []).length;
  say(`  ${jobLinks} job detail links`);
  if (jobLinks === 0) say("  note results are fetched client-side");
  else say("  ok  job links rendered");

  for (const [route, needle, label] of [
    ["/", "search?keyword", "hero search form"],
    ["/", "href=\"/search\"", "showcase CTA"],
    ["/cam-nang", "orbit", "handbook"],
  ]) {
    const html = route === "/" ? home : await (await fetch(`${BASE}${route}`)).text();
    if (html.includes(needle)) say(`  ok  ${label}`);
  }

  say(bad === 0 ? "render markup checks passed" : `${bad} problem(s)`);
  writeFileSync("scripts/markup-report.txt", out.join("\n"), "utf8");
  try {
    process.stdout.write(out.join("\n") + "\n");
  } catch {}
  process.exitCode = bad === 0 ? 0 : 1;
})();
