const BASE = process.env.BASE || "http://localhost:3900";
const fs = require("node:fs");

/**
 * Confirms the icons reach the browser and match the header mark.
 *
 * A favicon that 404s or ships the wrong content-type fails silently — the tab
 * just shows a default glyph — so this checks the served bytes and the <head>.
 */
const out = [];
let bad = 0;

(async () => {
  const home = await (await fetch(`${BASE}/`)).text();
  out.push(`/ ${home.length}b`);

  for (const [needle, label] of [
    ['rel="icon"', "icon link in the head"],
    ['rel="apple-touch-icon"', "apple touch icon link"],
    ['rel="manifest"', "manifest link"],
    ["/icon.svg", "icon path"],
    ["/apple-icon.svg", "apple path"],
    ["/manifest.webmanifest", "manifest path"],
  ]) {
    if (home.includes(needle)) out.push(`  ok   ${label}`);
    else {
      bad += 1;
      out.push(`  FAIL ${label} (${needle})`);
    }
  }

  const assets = [
    ["/icon.svg", "image/svg+xml"],
    ["/apple-icon.svg", "image/svg+xml"],
    ["/icon-maskable.svg", "image/svg+xml"],
    ["/logo-mark.svg", "image/svg+xml"],
    ["/manifest.webmanifest", "application/manifest+json"],
  ];

  for (const [path, type] of assets) {
    const res = await fetch(`${BASE}${path}`);
    const body = await res.text();
    const contentType = (res.headers.get("content-type") || "").split(";")[0];
    const ok = res.status === 200 && contentType === type && body.length > 200;
    if (ok) out.push(`  ok   ${path} ${contentType} ${body.length}b`);
    else {
      bad += 1;
      out.push(`  FAIL ${path} ${res.status} ${contentType} ${body.length}b`);
    }
  }

  /* the served icon must carry the same mark colours as the header logo */
  const icon = await (await fetch(`${BASE}/icon.svg`)).text();
  for (const hex of ["#7DD3FC", "#0EA5E9"]) {
    if (icon.includes(hex)) out.push(`  ok   icon uses ${hex}`);
    else {
      bad += 1;
      out.push(`  FAIL icon missing ${hex}`);
    }
  }

  /* and it must not be the old generic briefcase: no text, no icon font */
  if (/<text/.test(icon)) {
    bad += 1;
    out.push("  FAIL icon relies on a font <text> element");
  } else {
    out.push("  ok   icon is pure geometry (no text, no font)");
  }

  const manifest = JSON.parse(await (await fetch(`${BASE}/manifest.webmanifest`)).text());
  if (manifest.icons && manifest.icons.length >= 2) {
    out.push(`  ok   manifest lists ${manifest.icons.length} icons`);
  } else {
    bad += 1;
    out.push("  FAIL manifest has too few icons");
  }
  if (manifest.icons.some((i) => i.purpose === "maskable")) {
    out.push("  ok   manifest declares a maskable icon");
  } else {
    bad += 1;
    out.push("  FAIL no maskable icon in the manifest");
  }

  out.push(bad === 0 ? "icons live-check passed" : `${bad} problem(s)`);
  fs.writeFileSync("scripts/icon-live-report.txt", out.join("\n"), "utf8");
  try {
    process.stdout.write(out.join("\n") + "\n");
  } catch {}
  process.exitCode = bad === 0 ? 0 : 1;
})().catch((error) => {
  fs.writeFileSync("scripts/icon-live-report.txt", `ERR ${error.message}`, "utf8");
  process.exitCode = 1;
});
