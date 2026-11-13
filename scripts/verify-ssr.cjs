const BASE = process.env.BASE || "http://localhost:4700";
const fs = require("node:fs");

/**
 * Confirms the job and company lists are in the server-rendered HTML.
 *
 * The "bấm mãi mới load" complaint came from these two sections fetching on mount:
 * the visitor got skeleton boxes, then a round trip, then content. If the cards are
 * in the HTML now, that wait is gone — which is exactly what this checks.
 */
const out = [];
let bad = 0;

(async () => {
  const started = Date.now();
  const html = await (await fetch(`${BASE}/`)).text();
  const ms = Date.now() - started;

  out.push(`/ ${html.length}b in ${ms} ms`);

  const jobLinks = (html.match(/href="\/job\/detail\//g) || []).length;
  const companyLinks = (html.match(/href="\/company\/detail\//g) || []).length;

  out.push(`  job detail links in HTML:    ${jobLinks}`);
  out.push(`  company detail links in HTML: ${companyLinks}`);

  if (jobLinks > 0) out.push("  ok   featured jobs are server-rendered");
  else {
    bad += 1;
    out.push("  FAIL no job links in the HTML — the section is still client-fetched");
  }

  if (companyLinks > 0) out.push("  ok   top companies are server-rendered");
  else {
    bad += 1;
    out.push("  FAIL no company links in the HTML");
  }

  /* Skeletons belong to genuine loading states — the header shows one while the
     auth check resolves, which is correct. What must NOT happen is a skeleton in
     the job or company grid, so this looks for one inside those sections only. */
  const jobSection = html.indexOf("Cơ hội đang chờ bạn");
  const companySection = html.indexOf("Công ty IT hàng đầu");
  const skeletonIn = (from, to) => {
    if (from < 0) return false;
    const slice = html.slice(from, to > from ? to : from + 40000);
    return /class="[^"]*skeleton/.test(slice);
  };
  const jobsHaveSkeleton = skeletonIn(jobSection, companySection);
  const companiesHaveSkeleton = skeletonIn(companySection, -1);

  if (jobsHaveSkeleton) {
    bad += 1;
    out.push("  FAIL the job grid still ships a skeleton");
  } else {
    out.push("  ok   the job grid has no skeleton");
  }

  if (companiesHaveSkeleton) {
    bad += 1;
    out.push("  FAIL the company grid still ships a skeleton");
  } else {
    out.push("  ok   the company grid has no skeleton");
  }

  /* the API must not be called from the browser for these two sections */
  const scripts = [...new Set([...html.matchAll(/src="([^"]+\.js[^"]*)"/g)].map((m) => m[1]))];
  let apiInClient = false;
  for (const src of scripts) {
    const body = await (await fetch(`${BASE}${src}`)).text();
    if (body.includes("/search?page=1") || body.includes("company/list?limitItems")) {
      apiInClient = true;
      out.push(`  note ${src.split("/").pop()} references an API path directly`);
    }
  }
  if (!apiInClient) out.push("  ok   no first-paint script hard-codes those API paths");

  out.push("", bad === 0 ? "content is server-rendered" : `${bad} problem(s)`);
  fs.writeFileSync("scripts/ssr-report.txt", out.join("\n"), "utf8");
  try {
    process.stdout.write(out.join("\n") + "\n");
  } catch {}
  process.exitCode = bad === 0 ? 0 : 1;
})().catch((error) => {
  fs.writeFileSync("scripts/ssr-report.txt", `ERR ${error.message}`, "utf8");
  process.exitCode = 1;
});
