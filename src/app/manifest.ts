import type { MetadataRoute } from "next";

/**
 * Web app manifest.
 *
 * Both entries point at the same artwork the header logo is built from, so an
 * installed copy of the site keeps the identity instead of falling back to a
 * generic browser glyph. `maskable` is a separate file because Android crops the
 * icon to its own shape and would otherwise cut the mark.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ITJobs Việt Nam — Việc làm IT",
    short_name: "ITJobs",
    description:
      "Nền tảng tuyển dụng IT hàng đầu Việt Nam. Tìm việc làm lập trình viên, kết nối với các công ty công nghệ top đầu.",
    start_url: "/",
    display: "standalone",
    background_color: "#080f1d",
    theme_color: "#0369a1",
    lang: "vi",
    icons: [
      {
        src: "/icon-maskable.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
      {
        src: "/logo-mark.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
