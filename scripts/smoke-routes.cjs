const { writeFileSync } = require("node:fs");

const BASE = process.env.BASE || "http://localhost:3000";
const ROUTES = ["/", "/cam-nang", "/company/list", "/search", "/user/login"];

(async () => {
  const out = [];
  const say = (line) => out.push(line);

  let bad = 0;
  for (const route of ROUTES) {
    try {
      const res = await fetch(BASE + route);
      const html = await res.text();
      const hasEffect = html.includes("/effects/") || html.includes("data-threeui");
      const hasError = /Application error|Unhandled Runtime Error/.test(html);
      if (res.status !== 200 || hasError) bad += 1;
      say(
        `${String(res.status).padEnd(4)} ${route.padEnd(16)} len=${String(html.length).padEnd(7)} effectRef=${hasEffect} error=${hasError}`,
      );
    } catch (error) {
      bad += 1;
      say(`ERR  ${route} ${error.message}`);
    }
  }

  for (const name of ["gallery-heading", "constellation-field"]) {
    const res = await fetch(`${BASE}/effects/${name}.html`);
    const text = await res.text();
    say(`asset ${name}.html ${res.status} ${text.length}b LF=${!text.includes("\r")}`);
    if (res.status !== 200) bad += 1;
  }

  say(bad === 0 ? "ALL ROUTES OK" : `${bad} problem(s)`);
  writeFileSync("scripts/smoke-result.txt", out.join("\n"), "utf8");
  process.exit(bad === 0 ? 0 : 1);
})();
