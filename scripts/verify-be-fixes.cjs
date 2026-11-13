/**
 * Verifies the backend fixes from the bug report.
 *
 * Each check reads the file and asserts the specific corrected behaviour, so a
 * later edit cannot quietly reintroduce the bug. Run from the BE directory:
 *
 *   cd ../Product_JOB_BE_JS && node ../Product_JOB_FE_NEW_UI_UX/scripts/verify-be-fixes.cjs
 */
const fs = require("node:fs");

const out = [];
let failures = 0;
const fail = (m) => {
  failures += 1;
  out.push(`  FAIL  ${m}`);
};
const pass = (m) => out.push(`  ok    ${m}`);

/**
 * The symbol whitelist that used to gate login passwords.
 *
 * Matched as a plain substring rather than a regex: the pattern contains `$` and
 * `@`, which a regex reads as an anchor and a literal, so `/[@$!%*&?]/` silently
 * matched the wrong thing and the registration check reported a false failure.
 */
const SYMBOL_WHITELIST = "[@$!%*?&]";

/** Strip comments so a needle in a comment cannot pass a check. */
const code = (p) =>
  fs
    .readFileSync(p, "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");

/** The body of one exported function, up to the next export. */
const sectionOf = (src, name) => {
  const start = src.indexOf(name);
  if (start < 0) return "";
  const next = src.indexOf("export const", start + name.length);
  return src.slice(start, next < 0 ? undefined : next);
};

/* ---------------------------- 1. edit job images ---------------------------- */
out.push("1. editJobPatch keeps existing images");
const company = code("controller/company.controller.js");
const editBody = sectionOf(company, "export const editJobPatch");
if (/images:\s*\[\s*\]/.test(editBody)) fail("editJobPatch still starts images as []");
else pass("no empty-array reset in editJobPatch");
if (editBody.includes("jobDetail.images")) pass("seeds images from the stored job");
else fail("does not read the stored images");
if (/req\.files[\s\S]{0,80}push/.test(editBody)) pass("appends new uploads");
else fail("does not append new uploads");

/* ------------------------------ 2. company count ------------------------------ */
out.push("2. GET /company/list counts companies");
const countLine = company.slice(company.indexOf("export const list")).match(/(\w+)\.countDocuments\(\{\}\)/);
if (countLine && countLine[1] === "AccountCompany") pass("counts AccountCompany");
else fail(`counts ${countLine ? countLine[1] : "nothing"}`);

/* ------------------------------ 3. login validation ------------------------------ */
out.push("3. login validation does not enforce password shape");
for (const file of ["validates/user.validate.js", "validates/company.validate.js"]) {
  const src = code(file);
  const login = sectionOf(src, "export const loginPost");
  if (login.includes(SYMBOL_WHITELIST)) fail(`${file}: login still checks the symbol whitelist`);
  else pass(`${file}: login has no symbol whitelist`);
  if (/password:\s*Joi\.string\(\)\.required\(\)/.test(login)) pass(`${file}: login requires only a value`);
  else fail(`${file}: login password rule is not a plain required`);
  if (src.includes(SYMBOL_WHITELIST)) pass(`${file}: registration keeps the strength rules`);
  else fail(`${file}: lost the registration strength rules`);
}

/* ------------------------------ 4. search controller ------------------------------ */
out.push("4. search controller");
const search = code("controller/search.controller.js");
if (search.includes("Object.keys(req.query).length > 0")) fail("bare /search still returns empty");
else pass("no empty-query short circuit");
if (/const limitItems = 3;/.test(search)) fail("page size still hard-coded to 3");
else pass("page size is read from the query");
if (search.includes("req.query.limitItems")) pass("reads limitItems");
else fail("does not read limitItems");
if (/find\.companyId = accountCompany\?\.id/.test(search)) fail("company overwrites the city filter");
else pass("company filter combines with city");

/* ------------------------------ 5. response codes ------------------------------ */
out.push("5. response codes are uniform");
const seen = new Map();
for (const file of fs.readdirSync("controller").filter((f) => f.endsWith(".js"))) {
  for (const m of code(`controller/${file}`).matchAll(/code:\s*"([^"]+)"/g)) {
    const value = m[1];
    seen.set(value, (seen.get(value) || 0) + 1);
  }
}
const unexpected = [...seen.keys()].filter((v) => v !== "success" && v !== "error");
if (unexpected.length === 0) {
  pass(`only "success" and "error" appear (${seen.get("success")} / ${seen.get("error")})`);
} else {
  fail(`unexpected codes: ${unexpected.join(", ")}`);
}

/* ------------------------------ 6. cloudinary ------------------------------ */
out.push("6. cloudinary handles documents");
const cloud = code("helper/cloudinary.helper.js");
if (cloud.includes('resource_type: "auto"')) pass('resource_type is "auto"');
else fail("resource_type not set — Word CVs would fail");
if (cloud.includes("allowed_formats")) pass("allowed_formats declared");
else fail("no allowed_formats");

/* ------------------------------ 7. technologies split ------------------------------ */
out.push("7. technologies split on any comma");
if (/\.split\(", "\)/.test(company)) fail('still splits on ", " only');
else pass("no space-sensitive split");
if (company.includes("splitTechnologies")) pass("uses the shared splitter");
else fail("does not use the shared splitter");

/* ------------------------------ 8. try/catch ------------------------------ */
out.push("8. async controllers are guarded");
const guarded = [
  ["controller/user.controller.js", ["export const Profile", "export const listCV"]],
  ["controller/company.controller.js", ["export const jobCreate", "export const jobList"]],
  ["controller/job.controller.js", ["export const applyPost"]],
];
for (const [file, fns] of guarded) {
  const src = code(file);
  for (const fn of fns) {
    const label = fn.replace("export const ", "");
    if (/try\s*\{/.test(sectionOf(src, fn))) pass(`${file} ${label} is guarded`);
    else fail(`${file} ${label} has no try/catch`);
  }
}

/* ------------------------------ 9. city message ------------------------------ */
out.push("9. city list message matches the action");
const city = code("controller/city.controller.js");
if (city.includes("Cập nhật thành công")) fail("city list still says 'Cập nhật thành công'");
else pass("city list message corrected");

const summary = failures === 0 ? "backend fixes verified" : `${failures} check(s) failed`;
out.push("", summary);
fs.writeFileSync("../Product_JOB_FE_NEW_UI_UX/scripts/be-report.txt", out.join("\n"), "utf8");
try {
  process.stdout.write(out.join("\n") + "\n");
} catch {}
process.exitCode = failures === 0 ? 0 : 1;
