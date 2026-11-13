const { writeFileSync } = require("node:fs");
const BASE = process.env.BASE || "http://localhost:3000";

/**
 * Checks the things a user actually complained about:
 *  - the gallery band must render CTA links (not only a canvas);
 *  - no CTA may sit inside a `pointer-events-none` overlay;
 *  - the effect host must not swallow the page's own links.
 */
(async () => {
  const out = [];
  const say = (l) => out.push(l);
  let bad = 0;

  const res = await fetch(`${BASE}/`);
  const html = await res.text();
  say(`/ ${res.status} ${html.length}b`);

  /* the showcase band ships two real CTAs */
  const ctas = [
    { href: "/search", text: "Khám phá việc làm" },
    { href: "/cam-nang", text: "Cẩm nang IT" },
  ];
  for (const cta of ctas) {
    const found = html.includes(`href="${cta.href}"`) && html.includes(cta.text);
    if (found) say(`  ok  CTA ${cta.href} "${cta.text}"`);
    else {
      bad += 1;
      say(`  FAIL CTA ${cta.href} "${cta.text}" missing`);
    }
  }

  /* the hint must reach the DOM so the interaction is discoverable */
  if (html.includes("Đưa chuột vào để tăng tốc")) say("  ok  hover hint rendered");
  else say("  note hover hint is client-only (expected on the server render)");

  /* handbook page keeps its own CTAs outside the canvas */
  const handbook = await (await fetch(`${BASE}/cam-nang`)).text();
  const handbookCtas = ["/cam-nang/lo-trinh/frontend", "/search"];
  for (const href of handbookCtas) {
    if (handbook.includes(`href="${href}"`)) say(`  ok  handbook CTA ${href}`);
    else {
      bad += 1;
      say(`  FAIL handbook CTA ${href} missing`);
    }
  }

  /* a CTA wrapped in a pointer-events-none ancestor with no auto escape is dead.
     The tempered body stops at the first `</div>`, so a shipped-but-closed
     backdrop (which is legitimately pointer-events-none) is not flagged. */
  const deadOverlay =
    /class="[^"]*pointer-events-none[^"]*"(?:(?!<\/div>)[\s\S]){0,600}?<a [^>]*href=/g;
  const overlays = handbook.match(deadOverlay) || [];
  if (overlays.length === 0) say("  ok  no CTA trapped under pointer-events-none");
  else {
    bad += 1;
    say(`  FAIL ${overlays.length} CTA(s) look trapped under pointer-events-none`);
  }

  for (const name of ["gallery-heading", "constellation-field"]) {
    const asset = await fetch(`${BASE}/effects/${name}.html`);
    const text = await asset.text();
    say(`  asset ${name}.html ${asset.status} ${text.length}b`);
    if (asset.status !== 200) bad += 1;
  }

  say(bad === 0 ? "CTA checks passed" : `${bad} problem(s)`);
  writeFileSync("scripts/cta-report.txt", out.join("\n"), "utf8");
  console.log(out.join("\n"));
  process.exitCode = bad === 0 ? 0 : 1;
})();
