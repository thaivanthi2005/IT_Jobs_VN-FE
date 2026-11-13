/**
 * Verifies the quick-view dialog contract without a browser.
 *
 * Checks the source-level guarantees that the report was about:
 *  - the card intercepts a plain left click and calls the quick-view callback;
 *  - modifier clicks (ctrl/cmd/shift/alt) still navigate, so open-in-new-tab
 *    and crawlers keep working;
 *  - the dialog wires all three close paths, traps Tab, and pauses the scenes;
 *  - the dialog binds every field the report asked for.
 */
const { existsSync, readFileSync, writeFileSync } = require("node:fs");

const out = [];
const log = (l) => out.push(l);
let failures = 0;
const fail = (m) => {
  failures += 1;
  log(`  FAIL  ${m}`);
};
const pass = (m) => log(`  ok    ${m}`);

const has = (source, needle, label) => {
  if (source.includes(needle)) pass(label);
  else fail(`${label} — missing ${JSON.stringify(needle.slice(0, 48))}`);
};

const card = readFileSync("src/components/cards/CardJobItem.tsx", "utf8");
log("job card");
/* The card is split in two: `CardJobItem` renders the markup on the server,
   `JobCardLink` adds the click. The earlier single-file version put onClick on a
   server component, which Next rejects. */
if (card.includes("CardJobBody")) pass("server card exports the shared body");
else fail("server card does not export the shared body");

if (card.includes("onClick")) fail("the server card still carries a click handler");
else pass("server card stays free of event handlers");

const link = readFileSync("src/components/cards/JobCardLink.tsx", "utf8");
has(link, "onOpen", "client card takes an open callback");
has(link, "event.preventDefault()", "intercepts the plain left click");
has(link, "event.metaKey || event.ctrlKey", "modifier clicks still navigate");
has(link, "aria-haspopup", "announces the dialog to assistive tech");
if (/href=\{`\/job\/detail\/\$\{item\.id\}`\}/.test(link)) pass("keeps the real href");
else fail("real href removed — middle-click and crawlers would break");

const dialog = readFileSync("src/components/cards/JobQuickView.tsx", "utf8");
log("quick view dialog");
has(dialog, 'role="dialog"', "dialog role");
has(dialog, "aria-modal", "modal semantics");
has(dialog, 'event.key === "Escape"', "Escape closes");
has(dialog, "onMouseDown={handleBackdrop}", "backdrop click closes");
has(dialog, "event.target === event.currentTarget", "only a true backdrop press closes");
has(dialog, "aria-label=\"Đóng chi tiết công việc\"", "X button labelled");
has(dialog, "setScenePaused(true)", "pauses the ambient 3D scenes");
has(dialog, "setScenePaused(false)", "resumes them on close");
has(dialog, "document.body.style.overflow", "locks background scroll");
has(dialog, 'event.key !== "Tab"', "traps Tab");
has(dialog, "restoreFocus.current?.focus?.()", "returns focus on close");

log("dialog data binding");
for (const [needle, label] of [
  ["{job.title}", "title"],
  ["{job.companyName}", "company name"],
  ["formatSalary(job.salaryMin, job.salaryMax)", "salary"],
  ["job.companyCity", "location"],
  ["job.technologies.map", "technology list"],
  ['href={`/job/detail/${job.id}`}', "apply link"],
  ["Ứng tuyển ngay", "apply button label"],
]) {
  has(dialog, needle, label);
}

log("wiring");
/* The two pages reach the dialog by different routes now: the featured grid is
   entirely a client island, so it renders `JobQuickViewClient`; the search page
   owns the state itself and renders `JobQuickView` directly. */
const wiring = [
  {
    label: "featured section",
    file: "src/components/home/FeaturedJobsSection.tsx",
    needle: "<JobQuickViewClient",
  },
  {
    label: "client grid",
    file: "src/components/cards/JobQuickViewClient.tsx",
    needle: "<JobQuickView",
  },
  {
    label: "search container",
    file: "src/app/(pages)/search/SearchContainer.tsx",
    needle: "<JobQuickView",
  },
];

for (const { label, file, needle } of wiring) {
  if (!existsSync(file)) {
    fail(`${label}: ${file} is missing`);
    continue;
  }
  const source = readFileSync(file, "utf8");
  if (source.includes(needle)) pass(`${label} renders the dialog`);
  else fail(`${label} is not wired to the dialog`);
}

/* the click has to reach the dialog: the card forwards it to whoever owns state */
const grid = readFileSync("src/components/cards/JobQuickViewClient.tsx", "utf8");
if (grid.includes("onOpen={setPreview}") && grid.includes("setPreview(null)")) {
  pass("the grid forwards card clicks to the dialog and closes it");
} else {
  fail("the grid does not connect card clicks to the dialog");
}

const summary = failures === 0 ? "dialog contract verified" : `${failures} check(s) failed`;
out.push("", summary);
writeFileSync("scripts/dialog-report.txt", out.join("\n"), "utf8");
try {
  process.stdout.write(out.join("\n") + "\n");
} catch {}
process.exitCode = failures === 0 ? 0 : 1;
