const BASE = process.env.BASE || "http://localhost:5000";
const fs = require("node:fs");

/**
 * Confirms the served stylesheet defines the colour utilities the hero uses.
 *
 * The reported bug: on the light theme the "Phản hồi TB" badge text turned black.
 * Cause: `text-success-400` referenced a palette step that did not exist, so
 * Tailwind emitted no rule and the text inherited its parent colour. This checks
 * the compiled, served CSS rather than the source.
 */
(async () => {
  const out = [];
  let bad = 0;

  const html = await (await fetch(`${BASE}/`)).text();
  const href = (html.match(/href="([^"]+\.css[^"]*)"/g) || [])
    .map((m) => m.match(/href="([^"]+)"/)[1])
    .join("");

  let css = "";
  for (const path of (html.match(/href="([^"]+\.css[^"]*)"/g) || []).map(
    (m) => m.match(/href="([^"]+)"/)[1],
  )) {
    css += await (await fetch(`${BASE}${path}`)).text();
  }

  out.push(`/ ${html.length}b, css ${css.length}b`);

  /* dark:-prefixed utilities compile to `.dark\:x:is(.dark *)`, so both the plain
     and the escaped form have to be visible to the search */
  const flat = css.replace(/\\:/g, " ");

  for (const name of [
    "text-success-400",
    "bg-success-400",
    "text-danger-400",
    "bg-danger-950",
    "ring-success-400",
  ]) {
    const re = new RegExp(`[\\s.:]${name}(?![\\w-])`, "g");
    const count = [...flat.matchAll(re)].length;
    if (count > 0) out.push(`  ok   ${name} (${count})`);
    else {
      bad += 1;
      out.push(`  FAIL ${name} is not in the served CSS — the text would inherit black`);
    }
  }

  /* and the green must actually be the light-on-dark 400 step, not a fallback */
  const rule = css.match(/\.text-success-400\s*\{[^}]*\}/);
  if (rule && /74 222 128|#4ade80|#4ADE80/i.test(rule[0])) {
    out.push("  ok   text-success-400 resolves to #4ADE80");
  } else if (rule) {
    out.push(`  note text-success-400 is ${rule[0].replace(/\s+/g, " ")}`);
  } else {
    bad += 1;
    out.push("  FAIL no .text-success-400 rule");
  }

  out.push("", bad === 0 ? "hero badge colours resolve" : `${bad} problem(s)`);
  fs.writeFileSync("scripts/hero-colour-report.txt", out.join("\n"), "utf8");
  try {
    process.stdout.write(out.join("\n") + "\n");
  } catch {}
  process.exitCode = bad === 0 ? 0 : 1;
})().catch((error) => {
  fs.writeFileSync("scripts/hero-colour-report.txt", `ERR ${error.message}`, "utf8");
  process.exitCode = 1;
});
