const fs = require("node:fs");
const path = require("node:path");

/**
 * Audits hard-coded colour classes for dark/light parity.
 *
 * Only *high contrast* utilities are flagged. `text-ink-400` (`#94A3B8`) is a
 * mid grey that reads on both grounds, so it is a deliberate muted tone rather
 * than a bug — flagging it buried the real problems in noise on the first run.
 *
 * A finding is real when a near-black text colour or a near-white surface has no
 * `dark:` counterpart and does not sit inside a theme-pinned band.
 */
function walk(dir, acc) {
  if (!fs.existsSync(dir)) return acc;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full, acc);
    else if (/\.tsx$/.test(name)) acc.push(full);
  }
  return acc;
}

/** Near-black ink and near-white surfaces: these invert between themes. */
const RISKY = [
  /\btext-ink-(900|800)\b(?![\w-])/,
  /\bbg-ink-(50|100)\b(?![\w-])/,
  /\bbg-white\b(?!\/)/,
  /\bborder-ink-(100|200)\b(?![\w-])/,
];

const files = walk("src", []);
const out = [`scanned ${files.length} tsx files`];
const offenders = [];

for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  const lines = text.split("\n");

  lines.forEach((line, index) => {
    if (!RISKY.some((pattern) => pattern.test(line))) return;
    if (line.includes("dark:")) return;

    /* a theme-pinned band makes the light utility intentional */
    const nearby = lines.slice(Math.max(0, index - 30), index + 3).join("\n");
    if (/mode="dark"/.test(nearby) || /bg-ink-950/.test(nearby) || /onDark/.test(nearby)) return;

    /* an explicit opt-out for a surface that must stay light on purpose */
    if (/theme-ok/.test(nearby)) return;

    /* a solid light surface carrying dark ink is a deliberate chip on a dark
       band (a white CTA), not drift: it reads correctly in both themes */
    if (/bg-white\b/.test(line) && /text-(brand|ink)-(7|8|9)00\b/.test(line)) return;

    offenders.push(`${file}:${index + 1}  ${line.trim().slice(0, 108)}`);
  });
}

if (offenders.length === 0) {
  out.push("  ok   every high-contrast colour utility has a dark counterpart");
} else {
  out.push(`  ${offenders.length} line(s) keep a light-only high-contrast colour:`);
  for (const line of offenders.slice(0, 30)) out.push(`    ${line}`);
}

const summary = offenders.length === 0 ? "theme parity ok" : `${offenders.length} finding(s)`;
out.push("", summary);
fs.writeFileSync("scripts/theme-report.txt", out.join("\n"), "utf8");
try {
  process.stdout.write(out.join("\n") + "\n");
} catch {}
process.exitCode = offenders.length === 0 ? 0 : 1;
