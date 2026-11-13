const fs = require("node:fs");
const path = require("node:path");

/**
 * Finds event handlers on server components.
 *
 * This is the exact bug that broke the site at runtime: `CardJobItem` had no
 * "use client", but was given an `onClick`, so Next threw "Event handlers cannot
 * be passed to Client Component props" the moment the page rendered.
 *
 * The rule enforced here: a file that passes a function literal to a DOM prop
 * must declare "use client", or it must not do it at all. TypeScript will not
 * catch this — the prop types are valid — so it is checked structurally.
 */
const out = [];
let failures = 0;
const fail = (m) => {
  failures += 1;
  out.push(`  FAIL  ${m}`);
};
const pass = (m) => out.push(`  ok    ${m}`);

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

/** DOM props that carry a function and cannot cross the server boundary. */
const HANDLER_PROPS = [
  "onClick",
  "onChange",
  "onSubmit",
  "onInput",
  "onKeyDown",
  "onKeyUp",
  "onFocus",
  "onBlur",
  "onMouseEnter",
  "onMouseLeave",
  "onPointerDown",
  "onPointerUp",
  "onScroll",
  "onLoad",
  "onError",
];

const files = walk("src", []);
out.push(`scanned ${files.length} tsx files`);

const offenders = [];

for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  const firstLine = text.split("\n").slice(0, 3).join("\n");
  const isClient = /["']use client["']/.test(firstLine);

  /* strip comments so an example in a doc comment is not counted */
  const code = text
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");

  for (const prop of HANDLER_PROPS) {
    /* a handler *prop* to a DOM element: `onClick={...}` */
    const pattern = new RegExp(`\\s${prop}=\\{`, "g");
    if (!pattern.test(code)) continue;

    if (!isClient) {
      offenders.push(`${file}  has ${prop}={...} but no "use client"`);
    }
    break;
  }
}

if (offenders.length === 0) {
  pass('every file with a DOM event handler declares "use client"');
} else {
  for (const line of offenders) fail(line);
}

/* a component must not accept a callback prop unless it is a client component */
const CALLBACK_PROP = /\b(on[A-Z]\w*)\??\s*:\s*\([^)]*\)\s*=>/g;
const propOffenders = [];
for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  const firstLine = text.split("\n").slice(0, 3).join("\n");
  if (/["']use client["']/.test(firstLine)) continue;

  const code = text
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");

  const matches = [...code.matchAll(CALLBACK_PROP)];
  if (matches.length > 0) {
    propOffenders.push(
      `${file}  declares ${matches.map((m) => m[1]).join(", ")} but is a server component`,
    );
  }
}

if (propOffenders.length === 0) {
  pass("no server component declares a callback prop");
} else {
  for (const line of propOffenders) fail(line);
}

const summary = failures === 0 ? "server/client boundary clean" : `${failures} violation(s)`;
out.push("", summary);
fs.writeFileSync("scripts/boundary-report.txt", out.join("\n"), "utf8");
try {
  process.stdout.write(out.join("\n") + "\n");
} catch {}
process.exitCode = failures === 0 ? 0 : 1;
