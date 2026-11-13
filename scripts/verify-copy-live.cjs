const fs = require("node:fs");
const path = require("node:path");

/**
 * Confirms the localised copy is in the production client bundle.
 *
 * The effect is a lazy chunk, so the headline never appears in the server HTML —
 * it ships inside the chunk the browser downloads on demand. This scans the
 * emitted static chunks and asserts the Vietnamese copy is there while the
 * authored English filler is gone.
 */
function walk(dir, acc) {
  if (!fs.existsSync(dir)) return acc;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full, acc);
    else if (name.endsWith(".js")) acc.push(full);
  }
  return acc;
}

const chunks = walk(path.join(".next", "static", "chunks"), []);
const out = [`scanned ${chunks.length} client chunks`];
let bad = 0;

const read = (file) => fs.readFileSync(file, "utf8");

for (const needle of ["TÍN HIỆU NHIỄU", "CƠ HỘI VẪN RÕ", "falling-diagonal"]) {
  const hit = chunks.find((file) => read(file).includes(needle));
  if (hit) out.push(`  ok   "${needle}" -> ${path.basename(hit)}`);
  else {
    bad += 1;
    out.push(`  FAIL "${needle}" absent from every client chunk`);
  }
}

for (const needle of ["SIGNAL LOST", "IMAGE HOLDING"]) {
  const hit = chunks.find((file) => read(file).includes(needle));
  if (hit) {
    bad += 1;
    out.push(`  FAIL authored English "${needle}" still in ${path.basename(hit)}`);
  } else {
    out.push(`  ok   authored English "${needle}" removed`);
  }
}

out.push(bad === 0 ? "localised copy shipped in the client bundle" : `${bad} problem(s)`);
fs.writeFileSync("scripts/copy-live-report.txt", out.join("\n"), "utf8");
try {
  process.stdout.write(out.join("\n") + "\n");
} catch {}
process.exitCode = bad === 0 ? 0 : 1;
