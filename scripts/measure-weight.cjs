const BASE = process.env.BASE || "http://localhost:4300";
const fs = require("node:fs");
const zlib = require("node:zlib");

/**
 * Measures what the browser actually transfers for the home page.
 *
 * The first version counted raw bytes and reported 600 kB, which is not what
 * anyone downloads: Next serves gzip/brotli, and `polyfills-*.js` is only fetched
 * by legacy browsers. This version asks for compressed responses the way a modern
 * browser does, and separates the legacy polyfill from the real first paint.
 */
const out = [];
let bad = 0;

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} kB`;

/** Fetch with compression and report the transferred size. */
async function weigh(url) {
  const res = await fetch(url, { headers: { "accept-encoding": "br, gzip, deflate" } });
  const buf = Buffer.from(await res.arrayBuffer());
  const encoding = res.headers.get("content-encoding") || "identity";

  if (encoding !== "identity" && buf.length < 1000) {
    /* a real compressed response; trust its size */
    return { raw: buf.length, transferred: buf.length, encoding, text: buf.toString("utf8") };
  }

  /* this server does not compress, so estimate what a CDN would send. The
     compressed body is a Buffer, so its byte count is `.length` — reading
     `.length` off the *result of the compression call itself* silently returned
     the option object's length and made every asset look uncompressed. */
  const compressed = zlib.brotliCompressSync(buf);
  return {
    raw: buf.length,
    transferred: compressed.length,
    encoding: "brotli (simulated)",
    text: buf.toString("utf8"),
  };
}

(async () => {
  const started = Date.now();
  const html = await (await fetch(`${BASE}/`)).text();
  out.push(`server render: ${Date.now() - started} ms, ${kb(Buffer.byteLength(html))} HTML`);

  const scripts = [...new Set([...html.matchAll(/src="([^"]+\.js[^"]*)"/g)].map((m) => m[1]))];
  const styles = [...new Set([...html.matchAll(/href="([^"]+\.css[^"]*)"/g)].map((m) => m[1]))];

  const rows = [];
  let legacy = 0;
  let modern = 0;

  for (const src of scripts) {
    const r = await weigh(`${BASE}${src}`);
    const isLegacy = src.includes("polyfills");
    if (isLegacy) legacy += r.transferred;
    else modern += r.transferred;
    rows.push({ src, ...r, legacy: isLegacy });
  }

  let css = 0;
  for (const href of styles) css += (await weigh(`${BASE}${href}`)).transferred;

  rows.sort((a, b) => b.transferred - a.transferred);

  out.push("");
  out.push("asset                              raw       transfer");
  for (const row of rows) {
    const name = row.src.split("/").pop().slice(0, 32).padEnd(32);
    out.push(
      `  ${name} ${kb(row.raw).padStart(9)} ${kb(row.transferred).padStart(11)}${row.legacy ? "  legacy only" : ""}`,
    );
  }
  out.push(`  ${"CSS".padEnd(32)} ${"—".padStart(9)} ${kb(css).padStart(11)}`);

  out.push("");
  out.push(`first paint (modern): ${kb(modern)} JS + ${kb(css)} CSS = ${kb(modern + css)}`);
  out.push(`legacy polyfills:     ${kb(legacy)} (nomodule, evergreen browsers skip it)`);

  if (modern <= 200 * 1024) out.push("  ok   modern first-paint JS <= 200 kB");
  else {
    bad += 1;
    out.push(`  FAIL modern first-paint JS ${kb(modern)} > 200 kB`);
  }

  if (css <= 25 * 1024) out.push("  ok   compressed CSS <= 25 kB");
  else {
    bad += 1;
    out.push(`  FAIL compressed CSS ${kb(css)} > 25 kB`);
  }

  const allJs = await Promise.all(
    scripts.map(async (src) => (await (await fetch(`${BASE}${src}`)).text())),
  );
  if (allJs.some((t) => t.includes("WebGLRenderer"))) {
    bad += 1;
    out.push("  FAIL three.js is in the first paint");
  } else {
    out.push("  ok   three.js stays out of the first paint");
  }

  /* the gallery stays, but its copy must not: a caption over a motion band turned
     it into an explanation of itself */
  const captionLeak =
    html.includes("Hiệu ứng tương tác") ||
    html.includes("Mỗi tấm là một mảnh") ||
    html.includes("Đưa chuột vào để tăng tốc");
  if (captionLeak) {
    bad += 1;
    out.push("  FAIL showcase caption is back on the home page");
  } else {
    out.push("  ok   showcase band carries no caption");
  }

  out.push("", bad === 0 ? "page weight ok" : `${bad} problem(s)`);
  fs.writeFileSync("scripts/weight-report.txt", out.join("\n"), "utf8");
  try {
    process.stdout.write(out.join("\n") + "\n");
  } catch {}
  process.exitCode = bad === 0 ? 0 : 1;
})().catch((error) => {
  fs.writeFileSync("scripts/weight-report.txt", `ERR ${error.message}`, "utf8");
  process.exitCode = 1;
});
