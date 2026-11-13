const BASE = process.env.BASE || "http://localhost:3000";

/** Confirms the Glitch Fall variant and the CSS 3D orbit reach the browser. */
(async () => {
  const lines = [];
  const say = (l) => lines.push(l);
  let bad = 0;

  const home = await (await fetch(`${BASE}/`)).text();
  say(`/ ${home.length}b`);

  for (const [needle, label] of [
    ["SIGNAL LOST", "authored headline line 1"],
    ["IMAGE HOLDING", "authored headline line 2"],
    ["falling-diagonal", "variant key reaches the client bundle"],
    ["orbit-stage", "CSS 3D orbit container"],
    ["orbit-rig", "CSS 3D rig"],
    ["orbit-satellite", "satellite bead"],
    ["Đưa chuột vào để tăng tốc", "hover hint"],
  ]) {
    if (home.includes(needle)) say(`  ok   ${label}`);
    else {
      bad += 1;
      say(`  FAIL ${label} (${needle})`);
    }
  }

  /* the 3D CSS lives in the external stylesheet, not inline in the document */
  const href = (home.match(/href="([^"]*layout\.css[^"]*)"/) || [])[1];
  if (!href) {
    bad += 1;
    say("  FAIL no layout stylesheet link found");
  } else {
    const css = await (await fetch(`${BASE}${href}`)).text();
    say(`css ${href} ${css.length}b`);
    const rules = [
      ["perspective:1000px", "perspective"],
      ["preserve-3d", "preserve-3d"],
      ["@keyframes orbit-rig", "orbit-rig keyframes"],
      ["@keyframes orbit-ring", "orbit-ring keyframes"],
      ["animation-play-state:paused", "pause rule"],
    ];
    for (const [needle, label] of rules) {
      const compact = css.replace(/\s+/g, "");
      if (compact.includes(needle.replace(/\s+/g, ""))) say(`  ok   ${label}`);
      else {
        bad += 1;
        say(`  FAIL ${label} (${needle})`);
      }
    }
  }

  say(bad === 0 ? "glitch fall rendered in the browser" : `${bad} problem(s)`);
  process.stdout.write(lines.join("\n") + "\n");
  process.exitCode = bad === 0 ? 0 : 1;
})().catch((error) => {
  console.log("ERR", error.message);
  process.exitCode = 1;
});
