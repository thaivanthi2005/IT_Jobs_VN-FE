const BASE = process.env.BASE || "http://localhost:4800";
const fs = require("node:fs");

/**
 * Renders the company detail page and looks for the overlap.
 *
 * "Bị che" on this page has one likely cause: the logo is pulled up over the
 * cover banner with a negative margin (`-mt-12`), so if the banner or the wrapper
 * clips its overflow, the logo and the company name underneath get cut off. This
 * dumps the markup around the header so the structure can be checked, and asserts
 * the pieces that would clip it are absent.
 */
(async () => {
  const out = [];
  let bad = 0;

  /* find a real company id from the backend */
  let id = null;
  try {
    const res = await fetch("http://localhost:4000/company/list?limitItems=1");
    const data = await res.json();
    id = data?.companyList?.[0]?.id ?? null;
  } catch {
    /* backend down; fall through */
  }

  if (!id) {
    fs.writeFileSync("scripts/company-detail-report.txt", "ERR no company id from backend", "utf8");
    process.exitCode = 1;
    return;
  }

  out.push(`company id: ${id}`);

  const res = await fetch(`${BASE}/company/detail/${id}`);
  const html = await res.text();
  out.push(`GET /company/detail/${id} -> ${res.status} ${html.length}b`);

  if (res.status !== 200) {
    bad += 1;
    out.push("  FAIL the page did not render");
  }

  if (/Application error|Unhandled Runtime Error/.test(html)) {
    bad += 1;
    out.push("  FAIL runtime error in the payload");
  } else {
    out.push("  ok   no runtime error");
  }

  /* The cover must round its own top corners without clipping: the logo is pulled
     up into it by a negative margin, so `overflow-hidden` here would cut the logo.
     Both the banner and its mesh child need the radius, or the mesh bleeds past
     the corners. */
  const cover = html.match(/<div class="relative h-32[^"]*bg-brand-fade[^"]*"/);
  if (cover) {
    out.push(`  cover banner: ${cover[0]}`);
    if (/overflow-hidden/.test(cover[0])) {
      bad += 1;
      out.push("  FAIL the cover clips its overflow — the logo will be cut");
    } else if (!/rounded-t/.test(cover[0])) {
      bad += 1;
      out.push("  FAIL the cover has no top radius — it will bleed past the card");
    } else {
      out.push("  ok   cover rounds its corners without clipping");
    }
  } else {
    out.push("  note cover banner markup differs");
  }

  /* the mesh overlay must be rounded too, or it squares off the corners */
  const mesh = html.match(/<div class="absolute inset-0[^"]*bg-hero-mesh[^"]*"/);
  if (mesh && !/rounded-t/.test(mesh[0])) {
    bad += 1;
    out.push("  FAIL the mesh overlay has no radius — it squares off the cover corners");
  } else if (mesh) {
    out.push("  ok   mesh overlay is rounded with the cover");
  }

  /* THE BUG: the cover is `position: relative`, so it paints after a static
     sibling. The content block holds the logo pulled up into the banner with a
     negative margin, so if that block is static the banner covers the logo. It
     must be positioned and stacked above. */
  const header = html.match(/<div class="relative z-10 px-6 pb-6[^"]*"/);
  if (header) {
    out.push("  ok   the content block is positioned above the cover (relative z-10)");
  } else {
    const staticBlock = /<div class="px-6 pb-6 sm:px-8 sm:pb-8">/.test(html);
    bad += 1;
    out.push(
      staticBlock
        ? "  FAIL the content block is static — the cover banner paints over the logo"
        : "  FAIL could not find the content block wrapper",
    );
  }

  /* the surface wrapper must not clip: the logo is pulled up into the cover with
     a negative margin, and clipping the wrapper cuts its shadow and 4px ring */
  const surface = html.match(/<div class="surface"[^>]*>/);
  if (surface) {
    out.push(`  surface wrapper: ${surface[0]}`);
    if (/overflow-hidden/.test(surface[0])) {
      bad += 1;
      out.push("  FAIL the surface wrapper clips the overlapping logo");
    } else {
      out.push("  ok   surface wrapper does not clip the logo");
    }
  } else {
    out.push("  note surface wrapper markup differs");
  }

  /* the logo must actually be there */
  const logoImg = /alt="Logo /;
  if (logoImg.test(html)) out.push("  ok   company logo rendered");
  else {
    bad += 1;
    out.push("  FAIL no company logo in the markup");
  }

  /* the company name and the jobs heading must be present */
  for (const [needle, label] of [
    ["việc làm đang tuyển", "jobs heading"],
    ["Danh sách công ty", "back link"],
  ]) {
    if (html.includes(needle)) out.push(`  ok   ${label}`);
    else {
      bad += 1;
      out.push(`  FAIL ${label} missing`);
    }
  }

  /* negative margin needs a parent that does not clip; report the chain */
  if (html.includes("-mt-12") || html.includes("-mt-14")) {
    out.push("  note the header uses a negative top margin for the logo overlap");
  }

  out.push("", bad === 0 ? "company detail structure ok" : `${bad} problem(s)`);
  fs.writeFileSync("scripts/company-detail-report.txt", out.join("\n"), "utf8");
  try {
    process.stdout.write(out.join("\n") + "\n");
  } catch {}
  process.exitCode = bad === 0 ? 0 : 1;
})().catch((error) => {
  fs.writeFileSync("scripts/company-detail-report.txt", `ERR ${error.message}`, "utf8");
  process.exitCode = 1;
});
