const fs = require("node:fs");

/**
 * Measures the light-theme surface contrast that makes cards disappear.
 *
 * The complaint was "trắng tinh" — pure white. That is measurable: WCAG contrast
 * between the page ground, the card fill and the card border. A card that is
 * white on `#f8fafc` with a `#e2e8f0` hairline scores ~1.04:1 against the page,
 * which is invisible; a border needs ~1.4:1 minimum to read as an edge, and 3:1
 * to read as a deliberate shape.
 */
const out = [];
let failures = 0;

const hex = (h) => {
  const v = h.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(v.slice(i, i + 2), 16));
};

/** WCAG relative luminance. */
const luminance = (rgb) => {
  const [r, g, b] = rgb.map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrast = (a, b) => {
  const la = luminance(hex(a));
  const lb = luminance(hex(b));
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
};

/* read the live tokens out of globals.css rather than restating them */
const css = fs.readFileSync("src/app/globals.css", "utf8");
const token = (name, block = ":root") => {
  const start = css.indexOf(`${block} {`);
  const body = css.slice(start, css.indexOf("}", start));
  const match = body.match(new RegExp(`${name}:\\s*(#[0-9a-fA-F]{6})`));
  if (!match) throw new Error(`token ${name} not found in ${block}`);
  return match[1].toUpperCase();
};

const pairs = [
  ["page", token("--color-background")],
  ["card", token("--color-card")],
  ["border", token("--color-border")],
  ["muted", token("--color-muted")],
];

const [page, card, border, muted] = pairs.map((p) => p[1]);
out.push(`light tokens: page ${page}  card ${card}  border ${border}  muted ${muted}`);

const cardVsPage = contrast(card, page);
const borderVsPage = contrast(border, page);
const borderVsCard = contrast(border, card);
const mutedVsPage = contrast(muted, page);

const report = (label, value, min) => {
  const ok = value >= min;
  out.push(`  ${ok ? "ok  " : "FAIL"} ${label}: ${value.toFixed(2)}:1 (min ${min})`);
  if (!ok) failures += 1;
};

report("card fill vs page", cardVsPage, 1.08);
report("border vs page", borderVsPage, 1.35);
report("border vs card", borderVsCard, 1.35);
report("muted fill vs page", mutedVsPage, 1.04);

/* dark theme just has to be coherent, not high contrast */
const darkPage = token("--color-background", ".dark");
const darkCard = token("--color-card", ".dark");
const darkBorder = token("--color-border", ".dark");
out.push(`dark tokens:  page ${darkPage}  card ${darkCard}  border ${darkBorder}`);
const dCard = contrast(darkCard, darkPage);
const dBorder = contrast(darkBorder, darkCard);
const darkReport = (label, value, min) => {
  const ok = value >= min;
  out.push(`  ${ok ? "ok  " : "FAIL"} ${label}: ${value.toFixed(2)}:1 (min ${min})`);
  if (!ok) failures += 1;
};
darkReport("dark card vs page", dCard, 1.08);
darkReport("dark border vs card", dBorder, 1.25);

/* the utilities that draw most of the borders in the app */
out.push("utility ramp (tailwind ink scale)");
const tailwind = fs.readFileSync("tailwind.config.ts", "utf8");
/* read only inside the `ink:` block — the brand ramp reuses the same step keys,
   so a global match returned sky blues and measured them as neutral greys */
const inkStart = tailwind.indexOf("ink: {");
const inkBlock = tailwind.slice(inkStart, tailwind.indexOf("},", inkStart));
const step = (n) => {
  const match = inkBlock.match(new RegExp(`\\b${n}:\\s*"(#[0-9A-Fa-f]{6})"`));
  if (!match) throw new Error(`ink ${n} missing`);
  return match[1].toUpperCase();
};
const ramp = { 100: step(100), 200: step(200), 300: step(300) };
out.push(`  ink-100 ${ramp[100]}  ink-200 ${ramp[200]}  ink-300 ${ramp[300]}`);

/* a border utility must be able to read on a white card */
const b200 = contrast(ramp[200], "#FFFFFF");
if (b200 >= 1.35) out.push(`  ok   border-ink-200 vs white card: ${b200.toFixed(2)}:1`);
else {
  failures += 1;
  out.push(`  FAIL border-ink-200 vs white card: ${b200.toFixed(2)}:1 (min 1.35)`);
}

const b100 = contrast(ramp[100], "#FFFFFF");
if (b100 >= 1.15) out.push(`  ok   border-ink-100 vs white card: ${b100.toFixed(2)}:1 (divider)`);
else {
  failures += 1;
  out.push(`  FAIL border-ink-100 too faint: ${b100.toFixed(2)}:1 (min 1.15)`);
}

/* ink-300 is a hover edge and must be stronger still */
const b300 = contrast(ramp[300], "#FFFFFF");
if (b300 >= 1.55) out.push(`  ok   border-ink-300 vs white card: ${b300.toFixed(2)}:1 (hover)`);
else {
  failures += 1;
  out.push(`  FAIL border-ink-300 too faint: ${b300.toFixed(2)}:1 (min 1.55)`);
}

/* the ramp must stay ordered, or one step would collide with its neighbour */
if (ramp[100] !== ramp[200] && ramp[200] !== ramp[300]) {
  out.push("  ok   ramp steps are distinct");
} else {
  failures += 1;
  out.push("  FAIL two ramp steps share a value");
}

const summary = failures === 0 ? "surface contrast ok" : `${failures} too flat`;
out.push("", summary);
fs.writeFileSync("scripts/contrast-report.txt", out.join("\n"), "utf8");
try {
  process.stdout.write(out.join("\n") + "\n");
} catch {}
process.exitCode = failures === 0 ? 0 : 1;
