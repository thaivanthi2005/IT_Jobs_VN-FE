/**
 * Constellation Field — eight particle/line fields, each an independent source
 * document. Port of upstream `NeuformBatchEffects` patch functions, with the
 * palette re-pointed at the ITJobs brand instead of the authored gold/blue.
 *
 * Only shared, non-structural knobs are exposed: speed, size, length, density,
 * stroke width and the theme.
 */

export type ConstellationVariant =
  | "constellation-field"
  | "particle-drift"
  | "particle-network"
  | "gateway-flow"
  | "connectivity-graph"
  | "interface-lines"
  | "defense-lines"
  | "topo-field";

export type ConstellationKnobs = {
  mode: "light" | "dark";
  speed: number;
  size: number;
  length: number;
  density: number;
  strokeWidth: number;
};

/** Paper colour for the light theme, matching the app background. */
export const PAPER = "#f8fafc";

export const scaleCount = (base: number, density: number, min: number) =>
  Math.max(min, Math.round(base * density));

const num = (value: number) => Number(value.toFixed(2));

/** Injects the shared speed control the patched loops read each frame. */
const SPEED = "((window.__SF_CONTROLS&&window.__SF_CONTROLS.speed)||1)";

/* ITJobs brand inks: azure link, sky node, deep blue for paper. */
const BRAND_LINK = "#0EA5E9";
const BRAND_NODE = "#38BDF8";
const BRAND_DEEP = "#0369A1";
const BRAND_INK = "#0F172A";

export const BRAND_PALETTE = { BRAND_LINK, BRAND_NODE, BRAND_DEEP, BRAND_INK };

type Patcher = (source: string, knobs: ConstellationKnobs) => string;

const patchConstellationField: Patcher = (source, { size, length, density, strokeWidth, mode }) => {
  const next = source
    .replace("const LINK = 160;", `const LINK = ${Math.round(160 * length)};`)
    .replace(
      "const MAX_NODES = window.innerWidth < 768 ? 40 : 85;",
      `const MAX_NODES = window.innerWidth < 768 ? ${scaleCount(40, density, 8)} : ${scaleCount(85, density, 12)};`,
    )
    .replace("radius: Math.random() * 2.4 + 1.8", `radius: (Math.random() * 2.4 + 1.8) * ${num(size)}`)
    .replace("ctx.lineWidth = 1;", `ctx.lineWidth = ${Number(Math.max(0.25, strokeWidth).toFixed(2))};`)
    .replace("node.x += node.vx;", `node.x += node.vx * ${SPEED};`)
    .replace("node.y += node.vy;", `node.y += node.vy * ${SPEED};`);

  /* the authored gold becomes brand azure; light theme deepens it for paper */
  return next.replaceAll("#E6C879", mode === "light" ? BRAND_DEEP : BRAND_LINK);
};

const patchParticleDrift: Patcher = (source, { size, length, density, mode }) => {
  const link = Math.round(120 * length);
  const proximityAlpha = mode === "light" ? 0.22 : 0.15;

  const next = source
    .replace("Array.from({ length: 90 })", `Array.from({ length: ${scaleCount(90, density, 12)} })`)
    .replace("Array.from({ length: 25 })", `Array.from({ length: ${scaleCount(25, density, 4)} })`)
    .replace("length: Math.random() * 100 + 50,", `length: (Math.random() * 100 + 50) * ${num(length)},`)
    .replace("n.y += n.vy; // Slow drift", `n.y += n.vy * ${SPEED}; // Slow drift`)
    .replace("b.y -= b.speed;", `b.y -= b.speed * ${SPEED};`)
    .replace("if(d < 120) {", `if(d < ${link}) {`)
    .replace("0.15 * (1 - d/120)", `${proximityAlpha} * (1 - d/${link})`)
    .replace("ctx.lineWidth = 1.5;", `ctx.lineWidth = ${num(1.5 * size)};`);

  /* authored blue/grey -> brand azure/ink */
  return next
    .replaceAll("rgba(96, 165, 250,", mode === "light" ? "rgba(3, 105, 161," : "rgba(56, 189, 248,")
    .replaceAll("rgba(156, 163, 175,", mode === "light" ? "rgba(51, 65, 85," : "rgba(148, 163, 184,")
    .replace(
      "ctx.fillStyle = dist < 180 ? '#60A5FA' : 'rgba(36, 48, 68, 0.4)';",
      mode === "light"
        ? "ctx.fillStyle = dist < 180 ? '#0369A1' : 'rgba(51, 65, 85, 0.55)';"
        : "ctx.fillStyle = dist < 180 ? '#38BDF8' : 'rgba(148, 163, 184, 0.42)';",
    );
};

const patchParticleNetwork: Patcher = (source, { size, length, density, mode }) => {
  const next = source
    .replace("const particleCount = 200;", `const particleCount = ${scaleCount(200, density, 40)};`)
    .replace("this.length = Math.random() * 2 + 0.5;", `this.length = (Math.random() * 2 + 0.5) * ${num(length)};`)
    .replace("this.z -= this.speed;", `this.z -= this.speed * ${SPEED};`)
    .replace("const fov = 300;", `const fov = ${Math.round(300 / Math.max(0.4, size))};`);

  if (mode === "light") {
    return next
      .replace("ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';", "ctx.fillStyle = 'rgba(241, 245, 249, 0.55)';")
      .replace(
        "const hue = Math.random() > 0.5 ? '200, 220, 255' : '106, 157, 237';",
        "const hue = Math.random() > 0.5 ? '51, 65, 85' : '3, 105, 161';",
      );
  }

  return next.replace(
    "const hue = Math.random() > 0.5 ? '200, 220, 255' : '106, 157, 237';",
    "const hue = Math.random() > 0.5 ? '186, 230, 253' : '56, 189, 248';",
  );
};

const patchGatewayFlow: Patcher = (source, { size, density, mode }) => {
  const next = source
    .replace("const numPaths = 80;", `const numPaths = ${scaleCount(80, density, 12)};`)
    .replace("p.t += p.speed;", `p.t += p.speed * ${SPEED};`)
    .replace("ctx.lineWidth = 1.2;", `ctx.lineWidth = ${num(1.2 * size)};`);

  return next
    .replace(
      "ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';",
      mode === "light" ? "ctx.strokeStyle = 'rgba(3, 105, 161, 0.42)';" : "ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';",
    )
    .replace(
      "ctx.fillStyle = `rgba(255, 255, 255, 0.7)`;",
      mode === "light"
        ? "ctx.fillStyle = `rgba(3, 105, 161, 0.75)`;"
        : "ctx.fillStyle = `rgba(186, 230, 253, 0.8)`;",
    );
};

const patchConnectivityGraph: Patcher = (source, { size, length, density, mode }) => {
  const next = source
    .replace(
      "const particleCount = window.innerWidth < 768 ? 150 : 400;",
      `const particleCount = window.innerWidth < 768 ? ${scaleCount(150, density, 30)} : ${scaleCount(400, density, 60)};`,
    )
    .replace("this.maxLength = 20 + Math.random() * 180;", `this.maxLength = (20 + Math.random() * 180) * ${num(length)};`)
    .replace("this.distance += this.speed;", `this.distance += this.speed * ${SPEED};`)
    .replace("ctx.lineWidth = 0.5 + (distRatio * 2);", `ctx.lineWidth = (0.5 + (distRatio * 2)) * ${num(size)};`);

  if (mode !== "dark") return next;

  return next
    .replace("const lightness = 15 + (distRatio * 35);", "const lightness = 58 + (distRatio * 28);")
    .replace(
      "const tailColor = `hsla(${hue}, 90%, ${Math.max(5, lightness - 15)}%, ${this.alpha * 0.05})`;",
      "const tailColor = `hsla(${hue}, 90%, ${Math.max(40, lightness - 15)}%, ${this.alpha * 0.08})`;",
    );
};

const patchInterfaceLines: Patcher = (source, { size, length, density, mode }) => {
  const link = Math.round(120 * length);

  const next = source
    .replace(
      "const numParticles = window.innerWidth < 640 ? 30 : 70;",
      `const numParticles = window.innerWidth < 640 ? ${scaleCount(30, density, 8)} : ${scaleCount(70, density, 12)};`,
    )
    .replace("p.x += p.vx;", `p.x += p.vx * ${SPEED};`)
    .replace("p.y += p.vy;", `p.y += p.vy * ${SPEED};`)
    .replace("if (dist < 120)", `if (dist < ${link})`)
    .replace("ctx.lineWidth = 1;", `ctx.lineWidth = ${num(size)};`);

  /* the authored white hairlines become brand ink on paper, sky on night */
  return next.replaceAll(
    "rgba(255, 255, 255,",
    mode === "light" ? "rgba(3, 105, 161," : "rgba(125, 211, 252,",
  );
};

const patchDefenseLines: Patcher = (source, { size, length, density, mode }) => {
  const next = source
    .replace(
      "const particleCount = window.innerWidth < 768 ? 40 : 100;",
      `const particleCount = window.innerWidth < 768 ? ${scaleCount(40, density, 8)} : ${scaleCount(100, density, 16)};`,
    )
    .replace("baseLength: Math.random() * 80 + 20,", `baseLength: (Math.random() * 80 + 20) * ${num(length)},`)
    .replace(
      "p.y -= p.speedY * 1.5 * (1 + centerProximity * 0.5);",
      `p.y -= p.speedY * 1.5 * (1 + centerProximity * 0.5) * ${SPEED};`,
    )
    .replace("ctx.lineWidth = 0.5;", `ctx.lineWidth = ${num(0.5 * size)};`);

  /* authored crimson rain -> brand azure rain */
  if (mode === "light") {
    return next
      .replaceAll("rgba(220, 38, 38, 0)", "rgba(3, 105, 161, 0)")
      .replace(
        "grad.addColorStop(0.5, `rgba(255, ${38 + brightness}, ${38 + brightness}, ${currentOpacity})`);",
        "grad.addColorStop(0.5, `rgba(3, ${105 + brightness * 0.4}, ${161 + brightness * 0.35}, ${currentOpacity})`);",
      );
  }

  return next.replaceAll("rgba(220, 38, 38, 0)", "rgba(56, 189, 248, 0)");
};

const patchTopoField: Patcher = (source, { length, density, mode }) => {
  const next = source
    .replace("float noiseScale = 1.4;", `float noiseScale = ${num(1.4 * length)};`)
    .replace("float numBands = 10.0;", `float numBands = ${num(10 * density)};`);

  if (mode === "light") {
    return next
      .replace("gridLines = clamp(gridLines, 0.0, 1.0) * 0.12;", "gridLines = clamp(gridLines, 0.0, 1.0) * 0.55;")
      .replace(
        "float topoLines = smoothstep(0.02, 0.00, triangleWave) * 0.45;",
        "float topoLines = smoothstep(0.03, 0.00, triangleWave) * 0.95;",
      )
      .replace(
        "vec3 color = vec3(0.0);\n                    color += vec3(1.0) * gridLines;\n                    color += vec3(1.0) * topoLines;",
        "vec3 paper = vec3(0.973, 0.980, 0.988);\n                    vec3 ink = vec3(0.012, 0.094, 0.157);\n                    float lines = clamp(gridLines + topoLines, 0.0, 1.0);\n                    vec3 color = mix(paper, ink, lines);",
      );
  }

  return next.replace(
    "vec3 color = vec3(0.0);\n                    color += vec3(1.0) * gridLines;\n                    color += vec3(1.0) * topoLines;",
    "vec3 color = vec3(0.031, 0.055, 0.094);\n                    color += vec3(0.22, 0.74, 0.97) * gridLines;\n                    color += vec3(0.35, 0.88, 0.62) * topoLines;",
  );
};

type Mode = "light" | "dark";

export const CONSTELLATION_VARIANTS = {
  "constellation-field": {
    title: "Constellation Field",
    background: (mode: Mode) => (mode === "light" ? PAPER : "#070914"),
    patch: patchConstellationField,
  },
  "particle-drift": {
    title: "Particle Drift",
    background: (mode: Mode) => (mode === "light" ? PAPER : "#030509"),
    patch: patchParticleDrift,
  },
  "particle-network": {
    title: "Particle Network",
    background: (mode: Mode) => (mode === "light" ? PAPER : "#05070d"),
    patch: patchParticleNetwork,
  },
  "gateway-flow": {
    title: "Gateway Flow",
    background: (mode: Mode) => (mode === "light" ? PAPER : "#000000"),
    patch: patchGatewayFlow,
  },
  "connectivity-graph": {
    title: "Connectivity Graph",
    background: (mode: Mode) => (mode === "light" ? "#E0F2FE" : "#0a1220"),
    patch: patchConnectivityGraph,
  },
  "interface-lines": {
    title: "Interface Lines",
    background: (mode: Mode) => (mode === "light" ? PAPER : "#050505"),
    patch: patchInterfaceLines,
  },
  "defense-lines": {
    title: "Defense Lines",
    background: (mode: Mode) => (mode === "light" ? "#EFF6FF" : "#050505"),
    patch: patchDefenseLines,
  },
  "topo-field": {
    title: "Topo Field",
    background: (mode: Mode) => (mode === "light" ? PAPER : "#000000"),
    patch: patchTopoField,
  },
} as const satisfies Record<
  ConstellationVariant,
  { title: string; background: (mode: Mode) => string; patch: Patcher }
>;
