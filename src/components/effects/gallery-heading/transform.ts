import { Art, Clock, Head } from "./blocks";
import { GALLERY_FONTS, type GalleryVariant } from "./variants";

/**
 * Port of upstream `transformGalleryHeadingSource`.
 *
 * Every replacement targets the exact authored string, so the renderer, the ring
 * geometry, the twelve tiles and the hover clock stay byte-identical; only the
 * palette, the field painter, the headline ink and the type are re-pointed.
 */

/** the authored small-label builder, replaced wholesale by an empty layer */
const LABEL_BLOCK = /function buildLabels\(\)\{[\s\S]*?\n\}\n\nfunction resize/;

/** the authored headline builder, replaced by the per-variant one */
const HEAD_BLOCK = /function buildHead\(\)\{[\s\S]*?\n\}\n\nfunction buildLabels/;

/** the gradient wallpapers and every helper that painted them */
const ART_BLOCK = /function lin\(x,x0,y0,x1,y1,stops\)\{[\s\S]*?\n\];\n\nfunction roundRectPath/;

/** the authored film grain, now laid by each field painter at its own weight */
const GRAIN_BLOCK = /    \/\* film grain \*\/\n[\s\S]*?\n    x\.restore\(\);\n    front\.push\(c\);/;

/** the authored clock, replaced by the hover-driven one */
const CLOCK_BLOCK =
  /var t0 = performance\.now\(\), tNow = 0, playing = true;[\s\S]*?window\.__play = function\(\)\{ t0 = performance\.now\(\) - tNow\*1000; playing = true; \};/;

const EMPTY_LABELS = `function buildLabels(){
  /* the launch poster's corner marks and flanking notes are dropped; the
     layer stays so the compositing order below is untouched */
  labelLayer = mkc(1,1);
}

function resize`;

export function transformGalleryHeading(
  source: string,
  mode: "light" | "dark",
  variant: GalleryVariant,
): string {
  const background = mode === "light" ? "#f4f7fb" : "#000000";
  const ink = mode === "light" ? variant.ink.light : variant.ink.dark;
  const font = GALLERY_FONTS[variant.type.font];

  return source
    .replace(
      "<title>New Grainient Collection Added — motion</title>",
      `<title>${variant.title} — motion</title>`,
    )
    .replace(
      "html,body{margin:0;height:100%;background:#000;overflow:hidden}",
      `html,body{margin:0;height:100%;background:${background};overflow:hidden}`,
    )
    .replace("axis: 25.5,", `axis: ${variant.axis},`)
    .replace("phase: 93", `phase: ${variant.phase}`)

    /* 4:3 tiles: the tile keeps its authored width and the ring plane is where
       the crop happens, so the square texture is covered, never squashed */
    .replace(
      "  tile: 346,            /* tile side in ring units (R = a)               */",
      "  tile: 346,            /* tile width in ring units (R = a)              */\n" +
        "  aspect: 0.75,         /* tile height / width — a 4:3 landscape crop    */",
    )
    .replace(
      "  roundRectPath(ctx, TS, TS, TS*RING.radius);",
      "  roundRectPath(ctx, TS, TS*RING.aspect, TS*RING.aspect*RING.radius);",
    )

    /* the headline is the whole composition now, so it carries the variant's
       face, weight, tracking and treatment, and scales about HEAD_MID — the
       vertical centre of the authored two-line block */
    .replace(
      "var CAP = 142;          /* headline cap height */\nvar SMALL = 22;         /* small-label cap height */",
      "var HEAD_CAP = 142;     /* authored headline cap height */\n" +
        "var HEAD_MID = 1093;    /* authored vertical centre of the two-line block */\n" +
        `var HEAD_SIZE = ${variant.type.headlineSize};   /* headline size multiplier */\n` +
        `var HEAD_WEIGHT = '${variant.type.weight}'; /* headline weight */\n` +
        `var HEAD_TRACK = ${variant.type.tracking};   /* headline tracking, in cap heights */\n` +
        `var HEAD_STYLE = '${variant.field}';\n` +
        `var HEAD_SHADOW = '${ink[2]}';  /* riso: the plate under the ink */\n` +
        "var HEAD_GHOST = ['#ff2f6d','#00e6ff'];  /* glitch: the two channel ghosts */\n" +
        `var PLATES = ${JSON.stringify(variant.palette)};\n` +
        `var FIELD = '${variant.field}';       /* which painter shades the plates */\n` +
        `var EASE = ${variant.motion.ease};        /* seconds for the orbit to reach hover speed */\n` +
        `var SPRING = ${variant.motion.spring ? 1 : 0}, SPRING_K = 26, SPRING_D = 5.7;`,
    )
    .replace(
      "var SANS = '\"Helvetica Neue\",Helvetica,\"Inter\",Arial,system-ui,sans-serif';",
      `var SANS = '${font}';`,
    )
    .replace(
      "{ s:'NEW GRAINIENT',    top:930,  w:1370, fill:'#d0d0d0' }",
      `{ s:'${variant.headline[0]}', top:930,  w:${variant.headlineWidths[0]}, fill:'${ink[0]}' }`,
    )
    .replace(
      "{ s:'COLLECTION ADDED', top:1114, w:1775, fill:'#ffffff' }",
      `{ s:'${variant.headline[1]}', top:1114, w:${variant.headlineWidths[1]}, fill:'${ink[1]}' }`,
    )
    .replace(
      ' * Tile artwork — eleven grainy gradient "wallpapers"',
      " * Tile artwork — twelve flat plates under a procedural noise field",
    )
    .replace(ART_BLOCK, Art)
    .replace(GRAIN_BLOCK, "    /* each field painter lays its own grain, at the weight its style wants */\n    front.push(c);")

    /* the authored reverse side crushed a gradient to a hint; a flat plate has
       less to give up, so the far half of the ring keeps more of its colour */
    .replace("y.fillStyle = 'rgba(6,8,18,0.75)';", "y.fillStyle = 'rgba(10,12,24,0.45)';")
    .replace(HEAD_BLOCK, Head)
    .replace(LABEL_BLOCK, EMPTY_LABELS)

    .replace("var spin = (t/DUR)*Math.PI*2;", `var spin = (t/DUR)*Math.PI*2*${variant.direction};`)
    .replace(
      "ctx.fillStyle = '#000';\n  ctx.fillRect(0,0,W,H);",
      `ctx.fillStyle = '${background}';\n  ctx.fillRect(0,0,W,H);`,
    )

    .replace(CLOCK_BLOCK, Clock);
}
