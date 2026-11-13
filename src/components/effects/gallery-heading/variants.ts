/**
 * Palette + typography presets for Gallery Heading.
 *
 * The authored source ships one red "grainient" gallery. These variants keep the
 * authored geometry, painters and hover-orbit clock untouched and only swap the
 * twelve flat plate colours, the headline ink, the field painter and the type —
 * the same surface the upstream `GALLERY_HEADING_VARIANTS` controls.
 */

export type GalleryField = "matte" | "glitch" | "riso" | "halftone";
export type GalleryFont = "serif" | "didone" | "oldstyle" | "sans";
export type GalleryWeight = "400" | "700";

export const GALLERY_FONTS: Record<GalleryFont, string> = {
  serif: '"Times New Roman",Times,"Liberation Serif","Nimbus Roman",serif',
  didone: 'Didot,"Bodoni 72","Bodoni MT","Playfair Display",Georgia,serif',
  oldstyle: '"Iowan Old Style","Palatino Linotype",Palatino,"Book Antiqua",Georgia,serif',
  sans: '"Helvetica Neue",Helvetica,"Inter",Arial,system-ui,sans-serif',
};

export type GalleryVariant = {
  title: string;
  headline: [string, string];
  headlineWidths: [number, number];
  axis: number;
  phase: number;
  direction: 1 | -1;
  field: GalleryField;
  palette: string[];
  /** [muted line, emphasis line, offset plate] */
  ink: { dark: [string, string, string]; light: [string, string, string] };
  type: { font: GalleryFont; weight: GalleryWeight; headlineSize: number; tracking: number };
  motion: { spring: boolean; ease: number };
};

export const GALLERY_VARIANTS = {
  /** ITJobs brand — azure plates rising diagonally, matte museum finish. */
  brand: {
    title: "ITJobs — Cơ hội đang chờ",
    headline: ["CƠ HỘI ĐANG", "CHỜ BẠN"],
    headlineWidths: [1500, 1760],
    axis: 25.5,
    phase: 93,
    direction: 1,
    field: "matte",
    palette: [
      "#0369A1", "#0EA5E9", "#38BDF8", "#16A34A", "#4ADE80", "#7DD3FC",
      "#075985", "#22C55E", "#0284C7", "#5EEAD4", "#0E7490", "#15803D",
    ],
    ink: { dark: ["#7DD3FC", "#F1F5F9", "#0EA5E9"], light: ["#0369A1", "#0F172A", "#38BDF8"] },
    type: { font: "sans", weight: "700", headlineSize: 1.16, tracking: 0.012 },
    motion: { spring: false, ease: 0.9 },
  },
  /** Career handbook — riso overprint, warm paper stock. */
  handbook: {
    title: "Cẩm nang — Lộ trình nghề nghiệp",
    headline: ["HỌC ĐÚNG THỨ TỰ", "ĐI NHANH HƠN"],
    headlineWidths: [1660, 1520],
    axis: 8,
    phase: 90,
    direction: 1,
    field: "riso",
    palette: [
      "#0369A1", "#F59E0B", "#16A34A", "#E2E8F0", "#0E7490", "#B45309",
      "#0EA5E9", "#334155", "#D97706", "#94A3B8", "#1D4ED8", "#15803D",
    ],
    ink: { dark: ["#FBBF24", "#F8FAFC", "#0369A1"], light: ["#0369A1", "#0F172A", "#F59E0B"] },
    type: { font: "oldstyle", weight: "700", headlineSize: 1.2, tracking: 0.03 },
    motion: { spring: false, ease: 0.9 },
  },
  /** Employer landing — halftone, didone, single ink on stock. */
  studio: {
    title: "Nhà tuyển dụng — Đăng tin",
    headline: ["TUYỂN ĐÚNG NGƯỜI", "ĐI ĐÚNG HƯỚNG"],
    headlineWidths: [1590, 1480],
    axis: 90,
    phase: 0,
    direction: -1,
    field: "halftone",
    palette: [
      "#082F49", "#F8FAFC", "#0369A1", "#E2E8F0", "#0C4A6E", "#CBD5E1",
      "#0F172A", "#F1F5F9", "#075985", "#DDE4EE", "#041E30", "#16A34A",
    ],
    ink: { dark: ["#38BDF8", "#F8FAFC", "#082F49"], light: ["#0369A1", "#0F172A", "#E2E8F0"] },
    type: { font: "didone", weight: "400", headlineSize: 1.25, tracking: 0.06 },
    motion: { spring: false, ease: 0.55 },
  },
  /** Signal-lost variant for search/404 — glitch plates, sprung motion. */
  signal: {
    title: "Đang quét tín hiệu",
    headline: ["ĐANG QUÉT", "TÍN HIỆU"],
    headlineWidths: [1240, 1400],
    axis: 25.5,
    phase: 45,
    direction: 1,
    field: "glitch",
    palette: [
      "#0369A1", "#0EA5E9", "#16A34A", "#38BDF8", "#075985", "#22C55E",
      "#0C4A6E", "#7DD3FC", "#15803D", "#0284C7", "#4ADE80", "#065F46",
    ],
    ink: { dark: ["#7DD3FC", "#F8FAFC", "#16A34A"], light: ["#0369A1", "#0F172A", "#16A34A"] },
    type: { font: "sans", weight: "700", headlineSize: 1.3, tracking: 0.02 },
    motion: { spring: true, ease: 0.9 },
  },
  /**
   * Glitch Fall (`falling-diagonal`) — authored structure, Vietnamese copy.
   *
   * Every authored constant is preserved: the mirrored `axis: -25.5`, the `87`
   * phase, the descending `direction: -1`, the `glitch` field, the twelve
   * broadcast plates, the ink pair, and the fast `ease: 0.12`. Only the two
   * headline lines (and the document title) are localised, so the effect reads as
   * "signal noisy, the opening is still clear" instead of English filler.
   */
  "falling-diagonal": {
    title: "Tín hiệu nhiễu, cơ hội vẫn rõ",
    headline: ["TÍN HIỆU NHIỄU", "CƠ HỘI VẪN RÕ"],
    headlineWidths: [1780, 2000],
    axis: -25.5,
    phase: 87,
    direction: -1,
    field: "glitch",
    palette: [
      "#0b0b12", "#ff2f6d", "#00e6ff", "#13f28a", "#f2f2f8", "#7a1bff",
      "#101018", "#ff7a1a", "#141a2e", "#e01f52", "#1a1a26", "#0ac2d8",
    ],
    ink: { dark: ["#ff2f6d", "#f2f2f8", "#0b0b12"], light: ["#c81049", "#111827", "#f2f2f8"] },
    type: { font: "sans", weight: "700", headlineSize: 1.2, tracking: 0 },
    motion: { spring: false, ease: 0.12 },
  },
} as const satisfies Record<string, GalleryVariant>;

export type GalleryVariantName = keyof typeof GALLERY_VARIANTS;
