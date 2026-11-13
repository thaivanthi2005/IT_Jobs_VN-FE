const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { execSync } = require("node:child_process");

/**
 * Confirms the colour utilities the pages use actually exist in the built CSS.
 *
 * The point is to catch a utility that Tailwind silently drops because its palette
 * step is undefined — `text-success-400` produced no rule at all, so the text
 * inherited its parent colour and read as black on the light theme.
 *
 * A class inside a `dark:` variant is emitted as `.dark\:x:is(.dark *)`, so the
 * search has to tolerate the escaped prefix.
 */
const outPath = path.join(os.tmpdir(), "palette-check.css");
execSync(`npx tailwindcss -i src/app/globals.css -o "${outPath}"`, { stdio: "ignore" });
const css = fs.readFileSync(outPath, "utf8");

/* strip the `dark\:` / `hover\:` prefixes so both forms match */
const flat = css.replace(/\\:/g, " ");

const checks = [
  "text-success-400",
  "bg-success-400",
  "text-danger-400",
  "bg-danger-950",
  "ring-success-400",
];

const lines = [];
let missing = 0;

for (const name of checks) {
  const re = new RegExp(`[\\s.:]${name}(?![\\w-])`, "g");
  const count = [...flat.matchAll(re)].length;
  if (count === 0) missing += 1;
  lines.push(`${count > 0 ? "ok      " : "MISSING "} ${name} (${count})`);
}

lines.push("", missing === 0 ? "colour utilities emitted" : `${missing} class(es) never emitted`);
fs.writeFileSync("scripts/palette-css-report.txt", lines.join("\n"), "utf8");
process.exitCode = missing === 0 ? 0 : 1;
