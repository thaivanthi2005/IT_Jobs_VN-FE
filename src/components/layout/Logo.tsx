import Link from "next/link";
import { LogoMark3D } from "./LogoMark3D";

/**
 * The ITJobs Việt Nam lockup: a live 3D mark, a gradient wordmark, and a
 * country chip.
 *
 * The mark is a real rotating object (see `LogoMark3D`), not an icon glyph — it
 * is the one element in the header that is always in motion, so the brand reads
 * as a product rather than as a template.
 */
export const Logo = ({
  className = "",
  onDark = false,
  size = 40,
}: {
  className?: string;
  onDark?: boolean;
  size?: number;
}) => (
  <Link
    href="/"
    aria-label="ITJobs Việt Nam — về trang chủ"
    className={`group inline-flex items-center gap-2.5 ${className}`}
  >
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-[13px] ring-1 transition-all duration-500 ease-out-expo group-hover:scale-[1.06] group-hover:ring-brand-400/60 ${
        onDark
          ? "bg-brand-900/55 ring-white/15"
          : "bg-brand-950/[0.06] ring-ink-900/10 dark:bg-brand-900/40 dark:ring-white/10"
      }`}
      style={{ width: size, height: size }}
    >
      {/* inner sheen so the tile reads as a lit panel, not a flat square */}
      <span
        className="pointer-events-none absolute inset-0 rounded-[13px] bg-gradient-to-br from-white/25 via-transparent to-transparent opacity-70"
        aria-hidden="true"
      />
      <LogoMark3D size={size - 6} />
    </span>

    <span className="flex flex-col leading-none">
      <span className="font-display text-[19px] font-extrabold tracking-tight">
        <span className={onDark ? "text-white" : "text-ink-900 dark:text-white"}>IT</span>
        <span className="bg-gradient-to-r from-brand-500 via-brand-400 to-success-400 bg-clip-text text-transparent">
          Jobs
        </span>
      </span>

      <span className="mt-1 flex items-center gap-1.5">
        {/* Vietnam chip: a tiny flag mark, drawn in CSS so it needs no asset */}
        <span
          className="relative inline-flex h-[9px] w-[13px] shrink-0 items-center justify-center overflow-hidden rounded-[2px] bg-[#DA251D] ring-1 ring-black/10"
          aria-hidden="true"
        >
          <svg viewBox="0 0 10 10" className="h-[6px] w-[6px]" aria-hidden="true">
            <path
              d="M5 0.6 6.18 3.72 9.5 3.9 6.93 5.98 7.75 9.2 5 7.3 2.25 9.2 3.07 5.98 0.5 3.9 3.82 3.72Z"
              fill="#FFDE00"
            />
          </svg>
        </span>
        <span
          className={`text-[9px] font-bold uppercase tracking-[0.18em] ${
            onDark ? "text-brand-200/75" : "text-ink-400"
          }`}
        >
          Việt Nam
        </span>
      </span>
    </span>
  </Link>
);
