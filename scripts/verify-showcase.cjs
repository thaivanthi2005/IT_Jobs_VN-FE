const BASE = process.env.BASE || "http://localhost:4500";
const fs = require("node:fs");

/**
 * Confirms the showcase band carries the effect and nothing else.
 *
 * The requirement was narrow: keep the rotating plates, drop every line of copy
 * around them. That is easy to regress by re-adding a caption, so it is asserted
 * rather than eyeballed.
 */
const out = [];
let bad = 0;

(async () => {
  const html = await (await fetch(`${BASE}/`)).text();
  out.push(`/ ${html.length}b`);

  /* the copy that must be gone */
  const banned = [
    "Hiệu ứng tương tác",
    "Mỗi tấm là một mảnh của bộ sưu tập",
    "Vòng mười hai khung tự quay",
    "Đưa chuột vào để tăng tốc",
    "Khám phá việc làm",
  ];
  for (const phrase of banned) {
    if (html.includes(phrase)) {
      bad += 1;
      out.push(`  FAIL copy still present: "${phrase}"`);
    } else {
      out.push(`  ok   removed: "${phrase}"`);
    }
  }

  /* the effect must still be on the page. Next escapes the flight payload
     several times over, so this looks for the bare token rather than a quoted
     fragment. */
  if (html.includes("falling-diagonal")) out.push("  ok   gallery variant is still mounted");
  else {
    bad += 1;
    out.push("  FAIL the gallery variant is missing");
  }

  /* and its band must stay decorative: no label, hidden from assistive tech */
  if (/<section class="bg-ink-950" aria-hidden="true">/.test(html)) {
    out.push("  ok   band is aria-hidden and carries no chrome");
  } else {
    bad += 1;
    out.push("  FAIL band is not marked decorative");
  }

  /* The label prop is serialised with several layers of escaping (`\\\"label\\\":\\\"\\\"`),
     so the reliable check is to strip the backslashes and look for the pair. */
  const unescaped = html.replace(/\\+/g, "");
  if (unescaped.includes('"label":""')) {
    out.push("  ok   effect label is empty (decorative)");
  } else if (/"label":"[^"]+"/.test(unescaped)) {
    bad += 1;
    const found = unescaped.match(/"label":"[^"]+"/)[0];
    out.push(`  FAIL effect still carries a label: ${found.slice(0, 60)}`);
  } else {
    out.push("  ok   effect carries no label at all");
  }

  /* the band must not ship a heading or a link of its own */
  const sectionStart = html.indexOf('class="bg-ink-950"');
  if (sectionStart > -1) {
    const sectionEnd = html.indexOf("</section>", sectionStart);
    const inner = html.slice(sectionStart, sectionEnd);
    for (const [needle, label] of [
      ["<h2", "a heading"],
      ["<a ", "a link"],
      ["<p ", "a paragraph"],
    ]) {
      if (inner.includes(needle)) {
        bad += 1;
        out.push(`  FAIL the band still contains ${label}`);
      } else {
        out.push(`  ok   no ${label} inside the band`);
      }
    }
  }

  out.push("", bad === 0 ? "showcase band is effect-only" : `${bad} problem(s)`);
  fs.writeFileSync("scripts/showcase-report.txt", out.join("\n"), "utf8");
  try {
    process.stdout.write(out.join("\n") + "\n");
  } catch {}
  process.exitCode = bad === 0 ? 0 : 1;
})().catch((error) => {
  fs.writeFileSync("scripts/showcase-report.txt", `ERR ${error.message}`, "utf8");
  process.exitCode = 1;
});
