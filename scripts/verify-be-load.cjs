/**
 * Loads every module the backend fixes touched, to prove they parse and their
 * imports resolve.
 *
 * `node --check` is not usable in this shell — it exits 1 on the "stdout is not a
 * tty" warning regardless of the file — so the check is a real dynamic import,
 * which fails loudly on a syntax error or a broken import path.
 *
 * Run from the BE directory:
 *   cd ../Product_JOB_BE_JS && node ../Product_JOB_FE_NEW_UI_UX/scripts/verify-be-load.cjs
 */
const files = [
  "controller/auth.controller.js",
  "controller/city.controller.js",
  "controller/company.controller.js",
  "controller/job.controller.js",
  "controller/search.controller.js",
  "controller/user.controller.js",
  "validates/user.validate.js",
  "validates/company.validate.js",
  "validates/job.validate.js",
  "helper/cloudinary.helper.js",
];

(async () => {
  const out = [];
  let bad = 0;

  for (const file of files) {
    const url = new URL(`file://${process.cwd().replace(/\\/g, "/")}/${file}`);
    try {
      await import(url.href);
      out.push(`  ok   ${file}`);
    } catch (error) {
      bad += 1;
      out.push(`  FAIL ${file}: ${error.message}`);
    }
  }

  out.push("", bad === 0 ? "all backend modules load" : `${bad} module(s) failed`);
  process.stdout.write(out.join("\n") + "\n");
  process.exitCode = bad === 0 ? 0 : 1;
})();
