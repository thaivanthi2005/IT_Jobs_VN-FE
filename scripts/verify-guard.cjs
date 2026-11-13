const BASE = process.env.BASE || "http://localhost:4500";
const fs = require("node:fs");
const { SignJWT } = require("jose");

/**
 * Exercises the route guard.
 *
 * Each case forges a token with the same secret the backend uses and asserts the
 * middleware's decision, following redirects so the final URL is what a browser
 * would land on.
 */
const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "DOANHBATDCEM");

const sign = (role) =>
  new SignJWT({ id: "test", email: "t@t.t", role })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1d")
    .sign(SECRET);

/** Follow redirects manually and report the final path. */
async function visit(path, cookie) {
  let url = `${BASE}${path}`;
  for (let hop = 0; hop < 5; hop += 1) {
    const res = await fetch(url, {
      redirect: "manual",
      headers: cookie ? { cookie: `token=${cookie}` } : {},
    });
    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get("location");
      if (!location) return { status: res.status, final: new URL(url).pathname };
      url = location.startsWith("http") ? location : `${BASE}${location}`;
      continue;
    }
    return { status: res.status, final: new URL(url).pathname };
  }
  return { status: 0, final: new URL(url).pathname };
}

const out = [];
let bad = 0;

const expect = (label, actual, wanted) => {
  const ok = actual === wanted;
  out.push(`  ${ok ? "ok  " : "FAIL"} ${label}: landed on ${actual}${ok ? "" : ` (expected ${wanted})`}`);
  if (!ok) bad += 1;
};

(async () => {
  const userToken = await sign("user");
  const companyToken = await sign("company");

  out.push("anonymous visitor");
  expect("/user-manage/profile", (await visit("/user-manage/profile")).final, "/user/login");
  expect("/company-manage/job/list", (await visit("/company-manage/job/list")).final, "/company/login");

  out.push("candidate");
  expect("/user-manage/profile", (await visit("/user-manage/profile", userToken)).final, "/user-manage/profile");
  expect("/company-manage/profile", (await visit("/company-manage/profile", userToken)).final, "/user-manage/profile");

  out.push("employer");
  expect("/company-manage/job/list", (await visit("/company-manage/job/list", companyToken)).final, "/company-manage/job/list");
  expect("/user-manage/profile", (await visit("/user-manage/profile", companyToken)).final, "/company-manage/profile");

  out.push("tampered token");
  const forged = `${userToken.slice(0, -6)}abc123`;
  expect("/user-manage/profile", (await visit("/user-manage/profile", forged)).final, "/user/login");

  const summary = bad === 0 ? "route guard verified" : `${bad} case(s) failed`;
  out.push("", summary);
  fs.writeFileSync("scripts/guard-report.txt", out.join("\n"), "utf8");
  try {
    process.stdout.write(out.join("\n") + "\n");
  } catch {}
  process.exitCode = bad === 0 ? 0 : 1;
})().catch((error) => {
  fs.writeFileSync("scripts/guard-report.txt", `ERR ${error.message}`, "utf8");
  process.exitCode = 1;
});
